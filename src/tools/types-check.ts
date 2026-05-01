import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPackageVersion, checkDefinitelyTyped } from "../services/npm-api.js";
import type { NpmPackageVersion, PackageExports } from "../types.js";

const TypesCheckInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  version: z.string().optional().describe("Specific version to check (default: latest)"),
};

interface ExportsTypesFinding {
  /** Whether any "types" condition was found in the exports map */
  found: boolean;
  /** First detected types entry path (the "." or root subpath when possible) */
  rootEntry?: string;
  /** Number of subpath patterns where a "types" condition was detected */
  subpathCount: number;
}

/**
 * Walk the package.json `exports` field and detect TypeScript "types"
 * conditions. Modern packages declare types via conditional exports rather
 * than the legacy `types`/`typings` fields, so we surface that explicitly.
 */
function inspectExportsForTypes(
  exports: PackageExports | null | undefined
): ExportsTypesFinding {
  if (!exports || typeof exports === "string") {
    return { found: false, subpathCount: 0 };
  }

  let rootEntry: string | undefined;
  let subpathCount = 0;

  const visitConditions = (
    node: PackageExports | null | undefined
  ): string | undefined => {
    if (!node || typeof node !== "object") return undefined;
    const obj = node as Record<string, PackageExports>;
    // Prefer the unconditional `"types"` entry; fall back to the first
    // versioned `types@<spec>` condition (TypeScript 5.5+ gated typing).
    const direct = obj["types"];
    if (typeof direct === "string") return direct;
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("types@") && typeof value === "string") return value;
    }
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        const nested = visitConditions(value);
        if (nested) return nested;
      }
    }
    return undefined;
  };

  const topLevelKeys = Object.keys(exports);
  // Sugar form: `"exports": { "import": "...", "types": "..." }` (no subpaths)
  const hasSubpaths = topLevelKeys.some((k) => k.startsWith("."));

  if (!hasSubpaths) {
    const entry = visitConditions(exports);
    if (entry) {
      return { found: true, rootEntry: entry, subpathCount: 1 };
    }
    return { found: false, subpathCount: 0 };
  }

  let dotEntry: string | undefined;
  let firstEntry: string | undefined;
  for (const [subpath, value] of Object.entries(exports)) {
    if (!subpath.startsWith(".")) continue;
    const entry = visitConditions(value);
    if (entry) {
      subpathCount++;
      if (subpath === ".") dotEntry = entry;
      else if (!firstEntry) firstEntry = entry;
    }
  }
  rootEntry = dotEntry ?? firstEntry;

  return { found: subpathCount > 0, rootEntry, subpathCount };
}

function detectTypesEntry(versionData: NpmPackageVersion): {
  entry?: string;
  source: "types" | "typings" | "exports" | "none";
  exportsSubpathCount: number;
} {
  if (versionData.types) {
    return { entry: versionData.types, source: "types", exportsSubpathCount: 0 };
  }
  if (versionData.typings) {
    return { entry: versionData.typings, source: "typings", exportsSubpathCount: 0 };
  }
  const fromExports = inspectExportsForTypes(versionData.exports);
  if (fromExports.found) {
    return {
      entry: fromExports.rootEntry,
      source: "exports",
      exportsSubpathCount: fromExports.subpathCount,
    };
  }
  return { source: "none", exportsSubpathCount: 0 };
}

export function registerTypesCheckTool(server: McpServer): void {
  server.registerTool(
    "npm_package_types",
    {
      title: "Check npm Package TypeScript Support",
      description: `Check whether an npm package ships TypeScript type definitions.

Detects bundled types from three sources (in priority order):
  1. \`types\` field
  2. \`typings\` field
  3. \`exports\` map with a \`types\` condition (modern conditional exports)

Also checks for a DefinitelyTyped (@types/) companion package when no
bundled types are found, and surfaces \`typesVersions\` (TS-version-specific
type maps) when present.

Args:
  - package_name (string): The npm package name
  - version (string, optional): Specific version to check (defaults to latest)

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
        const versionData = await fetchPackageVersion(
          package_name,
          version?.trim() || "latest"
        );
        const targetVersion = versionData.version;
        const detection = detectTypesEntry(versionData);
        const hasBundledTypes = detection.source !== "none";
        const hasTypesVersions =
          !!versionData.typesVersions &&
          Object.keys(versionData.typesVersions).length > 0;

        const dtResult = hasBundledTypes
          ? { exists: false, version: undefined as string | undefined }
          : await checkDefinitelyTyped(package_name);

        const lines: string[] = [
          `# ${package_name}@${targetVersion} - TypeScript Support`,
          "",
        ];

        if (hasBundledTypes) {
          lines.push(`**Bundled Types:** Yes`);
          if (detection.entry) {
            lines.push(`**Types Entry:** ${detection.entry}`);
          }
          const sourceLabel =
            detection.source === "types"
              ? "package.json `types` field"
              : detection.source === "typings"
                ? "package.json `typings` field"
                : "package.json `exports` map (`types` condition)";
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
          lines.push("");
          lines.push(
            "This package ships its own TypeScript type definitions. No additional @types/ package needed."
          );
        } else if (dtResult.exists) {
          const typesName = package_name.startsWith("@")
            ? `@types/${package_name.slice(1).replace("/", "__")}`
            : `@types/${package_name}`;
          lines.push(`**Bundled Types:** No`);
          lines.push(`**DefinitelyTyped:** Yes (${typesName}@${dtResult.version})`);
          lines.push("");
          lines.push("Install types separately:");
          lines.push(`\`\`\`bash`);
          lines.push(`npm install -D ${typesName}`);
          lines.push(`\`\`\``);
        } else {
          lines.push(`**Bundled Types:** No`);
          lines.push(`**DefinitelyTyped:** Not available`);
          lines.push("");
          lines.push(
            "This package does not have TypeScript type definitions. You may need to create a local declaration file (`.d.ts`) or use `// @ts-ignore`."
          );
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
