import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPackageVersion } from "../services/npm-api.js";

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
};

function formatDeps(deps: Record<string, string> | undefined, label: string): string[] {
  if (!deps || Object.keys(deps).length === 0) return [];
  const lines: string[] = [`### ${label} (${Object.keys(deps).length})`, ""];
  for (const [name, version] of Object.entries(deps)) {
    lines.push(`- ${name}: ${version}`);
  }
  lines.push("");
  return lines;
}

export function registerDependenciesTool(server: McpServer): void {
  server.registerTool(
    "npm_package_dependencies",
    {
      title: "Get npm Package Dependencies",
      description: `Get dependency information for a specific version of an npm package.

Returns all dependency types: dependencies, devDependencies, peerDependencies, and optionalDependencies.

Args:
  - package_name (string): The npm package name
  - version (string, optional): Specific version to check (defaults to latest)

Returns:
  Dependency lists organized by type:
  - dependencies (runtime)
  - devDependencies (development only)
  - peerDependencies (required peer)
  - optionalDependencies

Examples:
  - "express" -> Express dependencies at latest version
  - "react", version="18.2.0" -> React 18.2.0 dependencies`,
      inputSchema: DependenciesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name, version }) => {
      try {
        const versionData = await fetchPackageVersion(package_name, version ?? "latest");

        const lines: string[] = [
          `# ${package_name}@${versionData.version} - Dependencies`,
          "",
        ];

        const deps = formatDeps(versionData.dependencies, "Dependencies");
        const devDeps = formatDeps(versionData.devDependencies, "Dev Dependencies");
        const peerDeps = formatDeps(versionData.peerDependencies, "Peer Dependencies");
        const optDeps = formatDeps(
          versionData.optionalDependencies,
          "Optional Dependencies"
        );

        if (
          deps.length === 0 &&
          devDeps.length === 0 &&
          peerDeps.length === 0 &&
          optDeps.length === 0
        ) {
          lines.push("This package has no dependencies.");
        } else {
          lines.push(...deps, ...devDeps, ...peerDeps, ...optDeps);
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
