import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchPackageVersion,
  fetchAbbreviatedPackument,
  createLimiter,
  maxSatisfying,
} from "../services/npm-api.js";
import type { AbbreviatedPackument, NpmPackageVersion } from "../types.js";

const DependenciesInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  version: z
    .string()
    .optional()
    .describe(
      "Specific version to check (default: latest). Use npm_package_versions to find available versions."
    ),
  depth: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .describe(
      "Resolve transitive production dependencies up to this depth (1-5, default: 1). Higher depths fetch more packages and take longer."
    ),
  include_dev: z
    .boolean()
    .optional()
    .describe("Include devDependencies (default: true). Ignored when depth > 1."),
  include_peer: z
    .boolean()
    .optional()
    .describe("Include peerDependencies (default: true). Ignored when depth > 1."),
  include_optional: z
    .boolean()
    .optional()
    .describe("Include optionalDependencies (default: true). Ignored when depth > 1."),
};

function formatDeps(deps: Record<string, string> | undefined, label: string): string[] {
  if (!deps || Object.keys(deps).length === 0) return [];
  const entries = Object.entries(deps).sort(([a], [b]) => a.localeCompare(b));
  const lines: string[] = [`### ${label} (${entries.length})`, ""];
  for (const [name, version] of entries) {
    lines.push(`- ${name}: ${version}`);
  }
  lines.push("");
  return lines;
}

interface TreeNode {
  version: string;
  dependencies: Record<string, string>;
}

interface ResolveResult {
  rootKey: string;
  tree: Record<string, TreeNode>;
  /** Maps "name@versionHint" (the range as written in package.json) to the
   *  resolved tree key "name@resolvedVersion". Used to walk child edges
   *  without re-running semver resolution. */
  hintToKey: Map<string, string>;
  warnings: string[];
}

/**
 * Resolve a production-dependency tree by fetching abbreviated packuments
 * with bounded concurrency. Each package is fetched at most once (cached by
 * name) and each `name@versionHint` pair is queued at most once. Final
 * deduplication is keyed on the resolved version, so multiple ranges that
 * resolve to the same version produce a single tree node.
 */
async function resolveProductionTree(
  rootName: string,
  rootHint: string,
  maxDepth: number
): Promise<ResolveResult> {
  const runLimited = createLimiter(8);
  const packumentCache = new Map<string, AbbreviatedPackument>();
  const queued = new Set<string>();
  const tree: Record<string, TreeNode> = {};
  const hintToKey = new Map<string, string>();
  const warnings: string[] = [];
  let rootResolvedKey: string | null = null;

  async function visit(
    name: string,
    versionHint: string,
    currentDepth: number,
    isRoot: boolean
  ): Promise<void> {
    const hintKey = `${name}@${versionHint}`;
    if (queued.has(hintKey) || currentDepth > maxDepth) return;
    queued.add(hintKey);

    let pkg = packumentCache.get(name);
    if (!pkg) {
      try {
        pkg = await runLimited(() => fetchAbbreviatedPackument(name));
        packumentCache.set(name, pkg);
      } catch (err) {
        warnings.push(
          `Failed to fetch ${name}: ${err instanceof Error ? err.message : String(err)}`
        );
        tree[hintKey] = { version: versionHint, dependencies: {} };
        hintToKey.set(hintKey, hintKey);
        if (isRoot) rootResolvedKey = hintKey;
        return;
      }
    }

    let resolvedVersion: string;
    if (pkg.versions[versionHint]) {
      resolvedVersion = versionHint;
    } else if (pkg["dist-tags"]?.[versionHint]) {
      resolvedVersion = pkg["dist-tags"][versionHint];
    } else {
      const matched = maxSatisfying(Object.keys(pkg.versions), versionHint);
      resolvedVersion = matched ?? pkg["dist-tags"]?.latest ?? versionHint;
    }

    const resolvedKey = `${name}@${resolvedVersion}`;
    hintToKey.set(hintKey, resolvedKey);
    if (isRoot && !rootResolvedKey) rootResolvedKey = resolvedKey;
    if (tree[resolvedKey]) return;

    const versionData = pkg.versions[resolvedVersion] as NpmPackageVersion | undefined;
    const deps = versionData?.dependencies ?? {};
    tree[resolvedKey] = { version: resolvedVersion, dependencies: deps };

    if (currentDepth < maxDepth) {
      await Promise.all(
        Object.entries(deps).map(([n, r]) => visit(n, r, currentDepth + 1, false))
      );
    }
  }

  await visit(rootName, rootHint, 1, true);

  return {
    rootKey: rootResolvedKey ?? `${rootName}@${rootHint}`,
    tree,
    hintToKey,
    warnings,
  };
}

function formatTree(result: ResolveResult, maxDepth: number): string[] {
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
      const childKey = result.hintToKey.get(`${depName}@${depRange}`);
      if (childKey && result.tree[childKey]) {
        walk(childKey, nextPrefix, isLastChild, depth + 1);
      } else {
        const reason = depth + 1 > maxDepth ? "depth limit" : "not resolved";
        lines.push(
          `${nextPrefix}${isLastChild ? "└── " : "├── "}${depName}@${depRange} (${reason})`
        );
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
        const versionData = await fetchPackageVersion(
          package_name,
          version?.trim() || "latest"
        );

        const runtimeDeps = versionData.dependencies ?? {};
        const devDeps = versionData.devDependencies ?? {};
        const peerDeps = versionData.peerDependencies ?? {};
        const optDeps = versionData.optionalDependencies ?? {};

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

        const resolvedDepth = depth ?? 1;
        const wantDev = include_dev !== false;
        const wantPeer = include_peer !== false;
        const wantOptional = include_optional !== false;

        if (resolvedDepth === 1) {
          const sections: string[] = [
            ...formatDeps(runtimeDeps, "Dependencies"),
            ...(wantDev ? formatDeps(devDeps, "Dev Dependencies") : []),
            ...(wantPeer ? formatDeps(peerDeps, "Peer Dependencies") : []),
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

        return {
          content: [{ type: "text" as const, text: lines.join("\n") }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
