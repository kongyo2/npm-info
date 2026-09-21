import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchPackages } from "../services/npm-api.js";
import { DEFAULT_SEARCH_LIMIT } from "../constants.js";
import type { NpmSearchResult } from "../types.js";
import { errorResult, textResult } from "./shared.js";

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

function pctOf(value: number | undefined): string | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? `${(value * 100).toFixed(0)}%`
    : undefined;
}

function formatScoreLine(
  score: NpmSearchResult["objects"][number]["score"]
): string | undefined {
  if (!score) return undefined;
  const parts: string[] = [];
  if (typeof score.final === "number" && Number.isFinite(score.final)) {
    parts.push(`overall=${score.final.toFixed(1)}`);
  }
  const detail = score.detail;
  for (const key of ["quality", "popularity", "maintenance"] as const) {
    const pct = pctOf(detail?.[key]);
    if (pct) parts.push(`${key}=${pct}`);
  }
  return parts.length > 0 ? `**Score:** ${parts.join(" ")}` : undefined;
}

export function formatSearchResults(query: string, result: NpmSearchResult): string[] {
  const objects = Array.isArray(result.objects) ? result.objects : [];
  const total = typeof result.total === "number" ? result.total : objects.length;
  if (total === 0 || objects.length === 0) {
    return [`No packages found matching "${query}". Try broader search terms.`];
  }

  const entryLines: string[] = [];
  let shown = 0;
  for (const obj of objects) {
    const pkg = obj?.package;
    if (!pkg || typeof pkg.name !== "string" || !pkg.name) continue;
    shown++;
    entryLines.push(
      typeof pkg.version === "string" && pkg.version
        ? `## ${pkg.name} (v${pkg.version})`
        : `## ${pkg.name}`
    );
    if (typeof pkg.description === "string" && pkg.description)
      entryLines.push(`${pkg.description}`);
    entryLines.push("");
    const keywords = Array.isArray(pkg.keywords)
      ? pkg.keywords.filter((k): k is string => typeof k === "string" && k !== "")
      : [];
    if (keywords.length > 0) {
      entryLines.push(`**Keywords:** ${keywords.join(", ")}`);
    }
    const homepage = pkg.links?.homepage;
    const repository = pkg.links?.repository;
    if (typeof homepage === "string" && homepage)
      entryLines.push(`**Homepage:** ${homepage}`);
    if (typeof repository === "string" && repository)
      entryLines.push(`**Repository:** ${repository}`);
    const scoreLine = formatScoreLine(obj.score);
    if (scoreLine) entryLines.push(scoreLine);
    if (typeof pkg.date === "string" && pkg.date)
      entryLines.push(`**Published:** ${pkg.date}`);
    entryLines.push("");
  }

  if (entryLines.length === 0) {
    return [`No packages found matching "${query}". Try broader search terms.`];
  }

  return [
    `# npm Search Results: "${query}"`,
    "",
    `Found ${total} packages (showing ${shown})`,
    "",
    ...entryLines,
  ];
}

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
        return textResult(formatSearchResults(query, result));
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
