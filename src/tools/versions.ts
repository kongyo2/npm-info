import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPackageMetadata } from "../services/npm-api.js";
import { DEFAULT_VERSIONS_LIMIT } from "../constants.js";

const VersionsInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(DEFAULT_VERSIONS_LIMIT)
    .describe(
      "Maximum number of versions to return, sorted by most recent (default: 20)"
    ),
};

export function registerVersionsTool(server: McpServer): void {
  server.registerTool(
    "npm_package_versions",
    {
      title: "List npm Package Versions",
      description: `List published versions of an npm package with release dates, sorted by most recent first.

Args:
  - package_name (string): The npm package name
  - limit (number): Maximum versions to return, 1-100 (default: 20)

Returns:
  Version list with publish dates, dist-tags, and deprecation notices. Includes:
  - version number and publish date for each version
  - dist-tags annotation (latest, next, beta, etc.)
  - deprecation warnings where applicable
  - total version count

Examples:
  - "react" -> Lists recent React versions with dates
  - "typescript", limit=5 -> Last 5 TypeScript releases`,
      inputSchema: VersionsInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name, limit }) => {
      try {
        const metadata = await fetchPackageMetadata(package_name);

        if (!metadata.versions || !metadata.time) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No version information available for "${package_name}".`,
              },
            ],
          };
        }

        const distTags = metadata["dist-tags"] ?? {};
        const tagLookup = new Map<string, string[]>();
        for (const [tag, ver] of Object.entries(distTags)) {
          const existing = tagLookup.get(ver) ?? [];
          existing.push(tag);
          tagLookup.set(ver, existing);
        }

        const versions = Object.keys(metadata.versions)
          .filter((v) => metadata.time![v])
          .sort(
            (a, b) =>
              new Date(metadata.time![b]).getTime() -
              new Date(metadata.time![a]).getTime()
          )
          .slice(0, limit);

        const totalVersions = Object.keys(metadata.versions).length;

        const lines: string[] = [
          `# ${package_name} - Versions`,
          "",
          `Total versions: ${totalVersions} (showing ${versions.length} most recent)`,
          "",
        ];

        for (const ver of versions) {
          const date = metadata.time[ver];
          const tags = tagLookup.get(ver);
          const versionData = metadata.versions![ver];
          let line = `- **${ver}** (${date})`;
          if (tags?.length) {
            line += ` [${tags.join(", ")}]`;
          }
          if (versionData.deprecated) {
            line += ` **DEPRECATED**: ${versionData.deprecated}`;
          }
          lines.push(line);
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
