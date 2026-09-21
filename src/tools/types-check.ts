import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchResolvedVersion,
  checkDefinitelyTyped,
  typesPackageName,
} from "../services/npm-api.js";
import { satisfiableAtOrAbove } from "../services/semver.js";
import type { NpmPackageVersion, PackageExports } from "../types.js";
import { errorMessage, errorResult, textResult } from "./shared.js";

const TypesCheckInputSchema = {
  package_name: z
    .string()
    .trim()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  version: z
    .string()
    .optional()
    .describe("Version, dist-tag, or semver range to check (default: latest)"),
};

interface ExportsTypesFinding {
  found: boolean;
  rootEntry?: string;
  rootCondition?: string;
  subpathCount: number;
  misorderedSubpaths: string[];
}

function isTypesConditionKey(key: string): boolean {
  return key === "types" || key.startsWith("types@");
}

function pickTargetString(value: PackageExports | null | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") return item;
    }
  }
  return undefined;
}

function firstTarget(value: PackageExports | null | undefined): string | undefined {
  const direct = pickTargetString(value);
  if (direct) return direct;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const item of Object.values(value)) {
      const nested = firstTarget(item);
      if (nested) return nested;
    }
  }
  return undefined;
}

const TYPES_FILE_PATTERN = /\.d\.[cm]?ts$/;

export function inspectExportsForTypes(
  exports: PackageExports | null | undefined
): ExportsTypesFinding {
  if (!exports) {
    return { found: false, subpathCount: 0, misorderedSubpaths: [] };
  }
  if (typeof exports === "string") {
    return TYPES_FILE_PATTERN.test(exports)
      ? {
          found: true,
          rootEntry: exports,
          subpathCount: 1,
          misorderedSubpaths: [],
        }
      : { found: false, subpathCount: 0, misorderedSubpaths: [] };
  }

  const visitConditions = (
    node: PackageExports | null | undefined
  ): { entry?: string; condition?: string; misordered: boolean } => {
    if (typeof node === "string") {
      return TYPES_FILE_PATTERN.test(node)
        ? { entry: node, misordered: false }
        : { misordered: false };
    }
    if (!node || typeof node !== "object") return { misordered: false };
    if (Array.isArray(node)) {
      let misordered = false;
      for (const item of node) {
        const nested = visitConditions(item);
        if (nested.misordered) misordered = true;
        if (nested.entry) return { ...nested, misordered };
      }
      return { misordered };
    }
    const keys = Object.keys(node);
    const firstTypesIdx = keys.findIndex(isTypesConditionKey);
    let misordered = firstTypesIdx > 0;
    const direct = firstTarget(node["types"]);
    if (direct) return { entry: direct, condition: "types", misordered };
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("types@")) {
        const gated = firstTarget(value);
        if (gated) return { entry: gated, condition: key, misordered };
      }
    }
    for (const value of Object.values(node)) {
      if (value && typeof value === "object") {
        const nested = visitConditions(value);
        if (nested.misordered) misordered = true;
        if (nested.entry) return { ...nested, misordered };
      }
    }
    return { misordered };
  };

  const hasSubpaths = !Array.isArray(exports)
    ? Object.keys(exports).some((k) => k.startsWith("."))
    : false;

  if (!hasSubpaths) {
    const { entry, condition, misordered } = visitConditions(exports);
    if (entry) {
      return {
        found: true,
        rootEntry: entry,
        rootCondition: condition,
        subpathCount: 1,
        misorderedSubpaths: misordered ? ["."] : [],
      };
    }
    return { found: false, subpathCount: 0, misorderedSubpaths: [] };
  }

  let subpathCount = 0;
  let dot: { entry: string; condition?: string } | undefined;
  let first: { entry: string; condition?: string } | undefined;
  const misorderedSubpaths: string[] = [];
  for (const [subpath, value] of Object.entries(exports)) {
    if (!subpath.startsWith(".")) continue;
    const { entry, condition, misordered } = visitConditions(value);
    if (entry) {
      subpathCount++;
      if (subpath === ".") dot = { entry, condition };
      else if (!first) first = { entry, condition };
    }
    if (misordered) misorderedSubpaths.push(subpath);
  }

  if (subpathCount === 0) return { found: false, subpathCount: 0, misorderedSubpaths };
  const root = dot ?? first;
  return {
    found: true,
    rootEntry: root?.entry,
    rootCondition: root?.condition,
    subpathCount,
    misorderedSubpaths,
  };
}

const DT_STUB_DEPRECATION = /stub types definition|provides its own type/i;

export function isDefinitelyTypedStub(deprecated: string | undefined): boolean {
  return !!deprecated && DT_STUB_DEPRECATION.test(deprecated);
}

export function detectTypesEntry(versionData: NpmPackageVersion): {
  entry?: string;
  entryCondition?: string;
  source: "types" | "typings" | "exports" | "typesVersions" | "none";
  exportsSubpathCount: number;
  misorderedSubpaths: string[];
} {
  if (typeof versionData.types === "string" && versionData.types) {
    return {
      entry: versionData.types,
      source: "types",
      exportsSubpathCount: 0,
      misorderedSubpaths: [],
    };
  }
  if (typeof versionData.typings === "string" && versionData.typings) {
    return {
      entry: versionData.typings,
      source: "typings",
      exportsSubpathCount: 0,
      misorderedSubpaths: [],
    };
  }
  const fromExports = inspectExportsForTypes(versionData.exports);
  if (fromExports.found) {
    return {
      entry: fromExports.rootEntry,
      entryCondition: fromExports.rootCondition,
      source: "exports",
      exportsSubpathCount: fromExports.subpathCount,
      misorderedSubpaths: fromExports.misorderedSubpaths,
    };
  }
  if (typesVersionsCoverCurrentTypeScript(versionData.typesVersions)) {
    return {
      source: "typesVersions",
      exportsSubpathCount: 0,
      misorderedSubpaths: [],
    };
  }
  return { source: "none", exportsSubpathCount: 0, misorderedSubpaths: [] };
}

const OLDEST_SUPPORTED_TYPESCRIPT = "4.0.0";

export function typesVersionsCoverCurrentTypeScript(typesVersions: unknown): boolean {
  if (
    !typesVersions ||
    typeof typesVersions !== "object" ||
    Array.isArray(typesVersions)
  ) {
    return false;
  }
  return Object.keys(typesVersions).some((selector) =>
    satisfiableAtOrAbove(selector, OLDEST_SUPPORTED_TYPESCRIPT)
  );
}

export function registerTypesCheckTool(server: McpServer): void {
  server.registerTool(
    "npm_package_types",
    {
      title: "Check npm Package TypeScript Support",
      description: `Check whether an npm package ships TypeScript type definitions.

Detects bundled types from four sources (in priority order):
  1. \`types\` field
  2. \`typings\` field
  3. \`exports\` map with a \`types\` condition (modern conditional exports)
  4. \`typesVersions\` map (TS-version-specific bundled declarations)

Also checks for a DefinitelyTyped (@types/) companion package when no
bundled types are found — including whether it is a deprecated stub — and
warns when a \`types\` condition is not listed first in \`exports\`
(TypeScript ignores it otherwise).

Args:
  - package_name (string): The npm package name
  - version (string, optional): Version, dist-tag, or semver range (defaults to latest)

Returns markdown with:
  - Whether bundled types are present and which field declared them
  - Type-definitions entry path
  - Number of subpaths typed via \`exports\` (when applicable)
  - Whether a \`typesVersions\` map is declared
  - Whether @types/<pkg> exists on DefinitelyTyped, plus its latest version
  - An install command when @types is needed

Examples:
  - "express" -> @types/express on DefinitelyTyped
  - "zod" -> Bundled types (TypeScript-first library)
  - "react" -> Bundled types via exports/types condition`,
      inputSchema: TypesCheckInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name, version }) => {
      try {
        const versionData = await fetchResolvedVersion(package_name, version);
        const targetVersion = versionData.version;
        const detection = detectTypesEntry(versionData);
        const hasBundledTypes = detection.source !== "none";
        const hasTypesVersions =
          !!versionData.typesVersions &&
          typeof versionData.typesVersions === "object" &&
          !Array.isArray(versionData.typesVersions) &&
          Object.keys(versionData.typesVersions).length > 0;

        let dtResult: Awaited<ReturnType<typeof checkDefinitelyTyped>> = {
          exists: false,
        };
        let dtError: string | undefined;
        if (!hasBundledTypes) {
          try {
            dtResult = await checkDefinitelyTyped(package_name);
          } catch (error) {
            dtError = errorMessage(error);
          }
        }

        const lines: string[] = [
          `# ${package_name}@${targetVersion} - TypeScript Support`,
          "",
        ];

        if (hasBundledTypes) {
          lines.push(`**Bundled Types:** Yes`);
          if (detection.entry) {
            const gate =
              detection.entryCondition && detection.entryCondition !== "types"
                ? ` (only for TypeScript matching \`${detection.entryCondition}\`)`
                : "";
            lines.push(`**Types Entry:** ${detection.entry}${gate}`);
          }
          const sourceLabel =
            detection.source === "types"
              ? "package.json `types` field"
              : detection.source === "typings"
                ? "package.json `typings` field"
                : detection.source === "exports"
                  ? "package.json `exports` map (`types` condition)"
                  : "package.json `typesVersions` map";
          lines.push(`**Source:** ${sourceLabel}`);
          if (detection.source === "exports" && detection.exportsSubpathCount > 1) {
            lines.push(
              `**Typed Subpaths:** ${detection.exportsSubpathCount} (multiple entry points typed via \`exports\`)`
            );
          }
          if (hasTypesVersions) {
            const tsRanges = Object.keys(versionData.typesVersions ?? {}).join(", ");
            lines.push(`**typesVersions:** ${tsRanges}`);
          }
          if (detection.misorderedSubpaths.length > 0) {
            lines.push("");
            lines.push(
              `> **Warning:** a \`types\` condition is not listed first in \`exports\` for ${detection.misorderedSubpaths.join(", ")} — TypeScript resolves conditions in order and may ignore it.`
            );
          }
          lines.push("");
          lines.push(
            "This package ships its own TypeScript type definitions. No additional @types/ package needed."
          );
        } else if (dtResult.exists) {
          const typesName = typesPackageName(package_name);
          lines.push(`**Bundled Types:** No`);
          if (isDefinitelyTypedStub(dtResult.deprecated)) {
            lines.push(
              `**DefinitelyTyped:** ${typesName}@${dtResult.version} exists but is a deprecated stub`
            );
            lines.push("");
            lines.push(`> ${dtResult.deprecated}`);
            lines.push("");
            lines.push(
              version?.trim() && version.trim() !== "latest"
                ? `The current release of ${package_name} provides its own type definitions, so the latest ${typesName} is only a stub. For ${package_name}@${targetVersion} an older ${typesName} release may still be needed — check \`npm view ${typesName} versions\` for one published alongside it.`
                : "Do **not** install the @types package — the library provides its own type definitions (declared in a way this check does not detect, e.g. alongside the JS entry point)."
            );
          } else {
            lines.push(`**DefinitelyTyped:** Yes (${typesName}@${dtResult.version})`);
            lines.push("");
            if (dtResult.deprecated) {
              lines.push(`> **Deprecated:** ${dtResult.deprecated}`);
              lines.push("");
            }
            lines.push("Install types separately:");
            lines.push(`\`\`\`bash`);
            lines.push(`npm install -D ${typesName}`);
            lines.push(`\`\`\``);
          }
        } else if (dtError) {
          lines.push(`**Bundled Types:** No`);
          lines.push(`**DefinitelyTyped:** Unknown (check failed: ${dtError})`);
          lines.push("");
          lines.push(
            `Could not verify whether ${typesPackageName(package_name)} exists. Try again later.`
          );
        } else {
          lines.push(`**Bundled Types:** No`);
          lines.push(`**DefinitelyTyped:** Not available`);
          lines.push("");
          lines.push(
            "This package does not have TypeScript type definitions. You may need to create a local declaration file (`.d.ts`) or use `// @ts-ignore`."
          );
        }

        return textResult(lines);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
