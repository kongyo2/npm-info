import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchPackages } from "../services/npm-api.js";
import { DEFAULT_SEARCH_LIMIT } from "../constants.js";

const SearchInputSchema = {
  query: z
    .string()
    .trim()
    .min(2, "Search query must be at least 2 characters")
    .max(64, "Search query must not exceed 64 characters")
    .describe("Search query for npm packages (keywords, package names, descriptions)"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(30)
    .default(DEFAULT_SEARCH_LIMIT)
    .describe("Maximum number of results to return (default: 10, max: 30)"),
};

export function registerSearchTool(server: McpServer): void {
  server.registerTool(
    "npm_search",
    {
      title: "Search npm Packages",
      description: `Search the npm registry for packages matching a query.

Returns a list of packages with name, version, description, keywords, and quality scores.

Args:
  - query (string): Search query for npm packages
  - limit (number): Maximum results to return, 1-30 (default: 10)

Returns:
  List of matching packages with metadata and scores. Each result includes:
  - name, version, description, keywords
  - links (npm, homepage, repository)
  - scores (quality, popularity, maintenance, overall)

Examples:
  - "react state management" -> finds Redux, MobX, Zustand, etc.
  - "typescript orm" -> finds Prisma, TypeORM, Drizzle, etc.
  - "zod" -> finds zod and related packages`,
      inputSchema: SearchInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ query, limit }) => {
      try {
        const result = await searchPackages(query, limit);

        if (result.total === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No packages found matching "${query}". Try broader search terms.`,
              },
            ],
          };
        }

        const lines: string[] = [
          `# npm Search Results: "${query}"`,
          "",
          `Found ${result.total} packages (showing ${result.objects.length})`,
          "",
        ];

        for (const obj of result.objects) {
          const pkg = obj.package;
          const score = obj.score;
          lines.push(`## ${pkg.name} (v${pkg.version})`);
          if (pkg.description) lines.push(`${pkg.description}`);
          lines.push("");
          if (pkg.keywords?.length) {
            lines.push(`**Keywords:** ${pkg.keywords.join(", ")}`);
          }
          if (pkg.links?.homepage) lines.push(`**Homepage:** ${pkg.links.homepage}`);
          if (pkg.links?.repository)
            lines.push(`**Repository:** ${pkg.links.repository}`);
          lines.push(
            `**Score:** overall=${score.final.toFixed(1)} quality=${(score.detail.quality * 100).toFixed(0)}% popularity=${(score.detail.popularity * 100).toFixed(0)}% maintenance=${(score.detail.maintenance * 100).toFixed(0)}%`
          );
          lines.push(`**Published:** ${pkg.date}`);
          lines.push("");
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
