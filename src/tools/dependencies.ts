import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchAbbreviatedPackument, fetchResolvedVersion } from "../services/npm-api.js";
import { createLimiter } from "../services/concurrency.js";
import { maxSatisfying } from "../services/semver.js";
import type { AbbreviatedPackument, NpmPackageVersion } from "../types.js";
import { errorMessage, errorResult, textResult } from "./shared.js";

const DependenciesInputSchema = {
  package_name: z
    .string()
    .trim()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  version: z
    .string()
    .optional()
    .describe(
      "Version, dist-tag, or semver range to check (default: latest). Use npm_package_versions to find available versions."
    ),
  depth: z
    .number()
    .int()
    .min(1)
    .max(5)
    .default(1)
    .describe(
      "Resolve transitive production dependencies up to this depth (1-5, default: 1). Higher depths fetch more packages and take longer."
    ),
  include_dev: z
    .boolean()
    .default(true)
    .describe("Include devDependencies (default: true). Ignored when depth > 1."),
  include_peer: z
    .boolean()
    .default(true)
    .describe("Include peerDependencies (default: true). Ignored when depth > 1."),
  include_optional: z
    .boolean()
    .default(true)
    .describe("Include optionalDependencies (default: true). Ignored when depth > 1."),
};

export function formatDeps(
  deps: Record<string, string> | undefined,
  label: string,
  optionalDeps?: ReadonlySet<string>
): string[] {
  if (!deps || Object.keys(deps).length === 0) return [];
  const entries = Object.entries(deps).sort(([a], [b]) => a.localeCompare(b));
  const lines: string[] = [`### ${label} (${entries.length})`, ""];
  for (const [name, version] of entries) {
    lines.push(`- ${name}: ${version}${optionalDeps?.has(name) ? " (optional)" : ""}`);
  }
  lines.push("");
  return lines;
}

/** Registry manifests sometimes carry non-object dependency maps. */
function depsRecord(value: unknown): Record<string, string> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, string>)
    : {};
}

interface TreeNode {
  version: string;
  dependencies: Record<string, string>;
}

/**
 * Translate a package.json dependency entry into the (real package name,
 * version hint) pair we should fetch from the registry.
 *
 * Standard entry: `"foo": "^1.0.0"` → `{ name: "foo", hint: "^1.0.0" }`.
 *
 * npm alias spec: `"foo": "npm:bar@^1.0.0"` (foo installed from package bar)
 * → `{ name: "bar", hint: "^1.0.0" }`. Scoped aliases work too:
 * `"foo": "npm:@scope/bar@1.0.0"` → `{ name: "@scope/bar", hint: "1.0.0" }`.
 *
 * Non-registry specs (git, file:, link:, http(s):, github: shorthand) can't
 * be resolved through the npm registry — return null so the caller can
 * record a clear warning instead of attempting a doomed packument fetch.
 *
 * Exported for tests.
 */
export function resolveDependencySpec(
  alias: string,
  raw: string
): { name: string; hint: string } | null {
  const trimmed = raw.trim();

  if (trimmed.startsWith("npm:")) {
    const spec = trimmed.slice(4);
    const isScoped = spec.startsWith("@");
    const at = isScoped ? spec.indexOf("@", 1) : spec.indexOf("@");
    if (at > 0) {
      return { name: spec.slice(0, at), hint: spec.slice(at + 1) || "latest" };
    }
    return { name: spec, hint: "latest" };
  }

  // Specs that can't be resolved against the registry.
  if (
    /^(?:git\+|git:|ssh:|https?:|file:|link:|workspace:|catalog:|jsr:|portal:|patch:|github:)/i.test(
      trimmed
    ) ||
    /^[\w.-]+\/[\w.-]+(?:#.*)?$/.test(trimmed) // bare GitHub shorthand "owner/repo"
  ) {
    return null;
  }

  return { name: alias, hint: trimmed };
}

export interface ResolveResult {
  rootKey: string;
  tree: Record<string, TreeNode>;
  /** Maps "name@versionHint" (the range as written in package.json) to the
   *  resolved tree key "name@resolvedVersion". Used to walk child edges
   *  without re-running semver resolution. */
  hintToKey: Map<string, string>;
  warnings: string[];
  /** True when a budget cap stopped expansion — the tree is partial. */
  truncated: boolean;
  /** Why the tree was truncated ("packages" | "time"), when truncated. */
  truncatedBy?: "packages" | "time";
}

export interface TreeBudget {
  /** Max distinct packuments to fetch. */
  maxPackages: number;
  /** Wall-clock budget for the whole resolution. */
  timeLimitMs: number;
}

/** Default bounds keep deep trees inside typical MCP client timeouts. */
export const DEFAULT_TREE_BUDGET: TreeBudget = {
  maxPackages: 400,
  timeLimitMs: 20_000,
};

/**
 * Resolve a production-dependency tree by fetching abbreviated packuments
 * with bounded concurrency. Each package is fetched at most once (the
 * in-flight promise is cached by name) and each `name@versionHint` pair is
 * queued at most once. Final deduplication is keyed on the resolved
 * version, so multiple ranges that resolve to the same version produce a
 * single tree node.
 */
export async function resolveProductionTree(
  rootName: string,
  rootHint: string,
  maxDepth: number,
  budget: TreeBudget = DEFAULT_TREE_BUDGET
): Promise<ResolveResult> {
  const runLimited = createLimiter(8);
  const packuments = new Map<string, Promise<AbbreviatedPackument>>();
  // Tracks the shallowest depth at which each `name@versionHint` was visited.
  // Skipping by hint alone (a Set) is racy under concurrent fetches: if the
  // same hint is first processed on a deeper branch (no children expanded
  // because we hit the depth limit) and later seen at a shallower depth, the
  // shallower visit must run so its children get explored.
  const visitedAtDepth = new Map<string, number>();
  const tree: Record<string, TreeNode> = {};
  const hintToKey = new Map<string, string>();
  const warnings: string[] = [];
  const seenWarnings = new Set<string>();
  let truncatedBy: "packages" | "time" | undefined;
  let rootResolvedKey: string | null = null;
  const deadline = Date.now() + budget.timeLimitMs;

  const warn = (message: string): void => {
    if (!seenWarnings.has(message)) {
      seenWarnings.add(message);
      warnings.push(message);
    }
  };

  const getPackument = (name: string): Promise<AbbreviatedPackument> => {
    let pending = packuments.get(name);
    if (!pending) {
      pending = runLimited(() => fetchAbbreviatedPackument(name));
      packuments.set(name, pending);
    }
    return pending;
  };

  async function visit(
    name: string,
    versionHint: string,
    currentDepth: number,
    isRoot: boolean
  ): Promise<void> {
    if (currentDepth > maxDepth) return;
    const hintKey = `${name}@${versionHint}`;
    const prevDepth = visitedAtDepth.get(hintKey);
    if (prevDepth !== undefined && prevDepth <= currentDepth) return;
    visitedAtDepth.set(hintKey, currentDepth);

    // Budget check only applies to new fetches — cached packuments are free.
    if (!packuments.has(name)) {
      if (truncatedBy) return;
      if (packuments.size >= budget.maxPackages) truncatedBy = "packages";
      else if (Date.now() > deadline) truncatedBy = "time";
      if (truncatedBy) return;
    }

    let pkg: AbbreviatedPackument;
    try {
      pkg = await getPackument(name);
    } catch (err) {
      warn(`Failed to fetch ${name}: ${errorMessage(err)}`);
      if (!tree[hintKey]) {
        tree[hintKey] = { version: versionHint, dependencies: {} };
      }
      hintToKey.set(hintKey, hintKey);
      if (isRoot && !rootResolvedKey) rootResolvedKey = hintKey;
      return;
    }

    const versions = pkg.versions ?? {};
    let resolvedVersion: string | null;
    if (versions[versionHint]) {
      resolvedVersion = versionHint;
    } else if (pkg["dist-tags"]?.[versionHint]) {
      resolvedVersion = pkg["dist-tags"][versionHint];
    } else {
      // No fallback to dist-tags.latest: if no published version satisfies
      // the range, npm would refuse to install it. Surface that as a
      // warning rather than silently expanding an unrelated version's deps.
      resolvedVersion = maxSatisfying(Object.keys(versions), versionHint);
    }

    if (!resolvedVersion) {
      warn(`No published version of ${name} satisfies '${versionHint}'.`);
      if (isRoot && !rootResolvedKey) rootResolvedKey = hintKey;
      return;
    }

    const resolvedKey = `${name}@${resolvedVersion}`;
    hintToKey.set(hintKey, resolvedKey);
    if (isRoot && !rootResolvedKey) rootResolvedKey = resolvedKey;

    const versionData = versions[resolvedVersion] as NpmPackageVersion | undefined;
    const deps = depsRecord(versionData?.dependencies);
    if (!tree[resolvedKey]) {
      tree[resolvedKey] = { version: resolvedVersion, dependencies: deps };
    }

    if (currentDepth < maxDepth) {
      await Promise.all(
        Object.entries(deps).map(([alias, raw]) => {
          const spec = resolveDependencySpec(alias, raw);
          if (!spec) {
            warn(`Skipped non-registry dependency '${alias}': ${raw}`);
            return Promise.resolve();
          }
          return visit(spec.name, spec.hint, currentDepth + 1, false);
        })
      );
    }
  }

  await visit(rootName, rootHint, 0, true);

  return {
    rootKey: rootResolvedKey ?? `${rootName}@${rootHint}`,
    tree,
    hintToKey,
    warnings,
    truncated: truncatedBy !== undefined,
    truncatedBy,
  };
}

export function formatTree(result: ResolveResult, maxDepth: number): string[] {
  const lines: string[] = [];
  const totalNodes = Object.keys(result.tree).length;
  const totalEdges = Object.values(result.tree).reduce(
    (sum, node) => sum + Object.keys(node.dependencies).length,
    0
  );

  lines.push(
    `**Resolved tree:** ${totalNodes} unique package${totalNodes === 1 ? "" : "s"} ` +
      `(depth ${maxDepth}, ${totalEdges} edge${totalEdges === 1 ? "" : "s"})`
  );
  if (result.truncated) {
    const why =
      result.truncatedBy === "packages"
        ? `package fetch limit reached`
        : `time budget reached`;
    lines.push(
      `> **Note:** tree is partial — ${why}. Re-run with a smaller \`depth\` for a complete picture.`
    );
  }
  lines.push("");

  const rootEntry = result.tree[result.rootKey];
  if (!rootEntry) {
    lines.push(`Root: ${result.rootKey} (not resolved)`);
    return lines;
  }

  lines.push("```");
  const visited = new Set<string>();

  const walk = (key: string, prefix: string, isLast: boolean, depth: number): void => {
    const node = result.tree[key];
    const connector = depth === 0 ? "" : isLast ? "└── " : "├── ";
    const cycleMarker = visited.has(key) ? " (already shown)" : "";
    lines.push(`${prefix}${connector}${key}${cycleMarker}`);
    if (visited.has(key) || !node) return;
    visited.add(key);

    const deps = Object.entries(node.dependencies).sort(([a], [b]) => a.localeCompare(b));
    const nextPrefix = depth === 0 ? "" : prefix + (isLast ? "    " : "│   ");
    deps.forEach(([depName, depRange], idx) => {
      const isLastChild = idx === deps.length - 1;
      const spec = resolveDependencySpec(depName, depRange);
      if (!spec) {
        lines.push(
          `${nextPrefix}${isLastChild ? "└── " : "├── "}${depName}@${depRange} (non-registry)`
        );
        return;
      }
      const childKey = result.hintToKey.get(`${spec.name}@${spec.hint}`);
      if (childKey && result.tree[childKey]) {
        walk(childKey, nextPrefix, isLastChild, depth + 1);
      } else {
        const label =
          spec.name === depName
            ? `${depName}@${depRange}`
            : `${depName} → npm:${spec.name}@${spec.hint}`;
        const reason =
          depth + 1 > maxDepth
            ? "depth limit"
            : result.truncated
              ? "truncated"
              : "not resolved";
        lines.push(`${nextPrefix}${isLastChild ? "└── " : "├── "}${label} (${reason})`);
      }
    });
  };

  walk(result.rootKey, "", true, 0);
  lines.push("```");
  lines.push("");

  if (result.warnings.length > 0) {
    lines.push(`### Warnings (${result.warnings.length})`, "");
    for (const w of result.warnings) lines.push(`- ${w}`);
    lines.push("");
  }
  return lines;
}

export function registerDependenciesTool(server: McpServer): void {
  server.registerTool(
    "npm_package_dependencies",
    {
      title: "Get npm Package Dependencies",
      description: `Get dependency information for a specific version of an npm package.

By default returns direct dependencies of all kinds (dependencies, devDependencies,
peerDependencies, optionalDependencies) along with totals. When \`depth\` is
greater than 1, resolves the transitive production dependency tree (using the
abbreviated packument format and a bounded fetch limiter) and renders it as an
ASCII tree with deduplicated nodes.

Args:
  - package_name (string): The npm package name
  - version (string, optional): Specific version to check (defaults to latest)
  - depth (number, optional, 1-5): Transitive production-dep depth (default 1)
  - include_dev (boolean, optional): Include devDependencies (default true; ignored when depth > 1)
  - include_peer (boolean, optional): Include peerDependencies (default true; ignored when depth > 1)
  - include_optional (boolean, optional): Include optionalDependencies (default true; ignored when depth > 1)

Returns:
  - Counts summary (runtime/dev/peer/optional)
  - Direct dependency lists by category
  - When depth > 1: a transitive production-dep tree, deduplicated on resolved version

Examples:
  - "express" -> Express direct dependencies at latest
  - "react", version="18.2.0" -> React 18.2.0 dependencies
  - "express", depth=2 -> Express + its production deps' dependencies`,
      inputSchema: DependenciesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({
      package_name,
      version,
      depth,
      include_dev,
      include_peer,
      include_optional,
    }) => {
      try {
        const versionData = await fetchResolvedVersion(package_name, version);

        const runtimeDeps = depsRecord(versionData.dependencies);
        const devDeps = depsRecord(versionData.devDependencies);
        const peerDeps = depsRecord(versionData.peerDependencies);
        const optDeps = depsRecord(versionData.optionalDependencies);
        const optionalPeers = new Set(
          Object.entries(versionData.peerDependenciesMeta ?? {})
            .filter(([, meta]) => meta?.optional === true)
            .map(([name]) => name)
        );

        const counts = {
          runtime: Object.keys(runtimeDeps).length,
          dev: Object.keys(devDeps).length,
          peer: Object.keys(peerDeps).length,
          optional: Object.keys(optDeps).length,
        };

        const lines: string[] = [
          `# ${package_name}@${versionData.version} - Dependencies`,
          "",
          `**Totals:** ${counts.runtime} runtime, ${counts.dev} dev, ${counts.peer} peer, ${counts.optional} optional`,
          "",
        ];

        const resolvedDepth = depth;
        const wantDev = include_dev !== false;
        const wantPeer = include_peer !== false;
        const wantOptional = include_optional !== false;

        if (resolvedDepth === 1) {
          const sections: string[] = [
            ...formatDeps(runtimeDeps, "Dependencies"),
            ...(wantDev ? formatDeps(devDeps, "Dev Dependencies") : []),
            ...(wantPeer ? formatDeps(peerDeps, "Peer Dependencies", optionalPeers) : []),
            ...(wantOptional ? formatDeps(optDeps, "Optional Dependencies") : []),
          ];

          if (sections.length === 0) {
            lines.push(
              counts.runtime + counts.dev + counts.peer + counts.optional === 0
                ? "This package has no dependencies."
                : "No dependencies match the selected filters."
            );
          } else {
            lines.push(...sections);
          }
        } else {
          // Transitive resolution: only production deps (matches npm install
          // semantics — devDeps/peerDeps are not transitively resolved).
          lines.push(...formatDeps(runtimeDeps, "Direct Dependencies"));
          const tree = await resolveProductionTree(
            package_name,
            versionData.version,
            resolvedDepth
          );
          lines.push(`### Transitive Production Dependency Tree`, "");
          lines.push(...formatTree(tree, resolvedDepth));
        }

        return textResult(lines);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
