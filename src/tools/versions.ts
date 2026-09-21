import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPackageMetadata } from "../services/npm-api.js";
import { DEFAULT_VERSIONS_LIMIT } from "../constants.js";
import type { NpmRegistryResponse } from "../types.js";
import { errorResult, textResult } from "./shared.js";

const VersionsInputSchema = {
  package_name: z
    .string()
    .trim()
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

export interface VersionRow {
  version: string;
  date?: string;
  tags: string[];
  deprecated?: string;
}

export function collectVersionRows(
  metadata: NpmRegistryResponse,
  limit: number
): { rows: VersionRow[]; total: number } {
  const allVersions = metadata.versions ?? {};
  const time = metadata.time ?? {};
  const total = Object.keys(allVersions).length;

  const tagLookup = new Map<string, string[]>();
  for (const [tag, ver] of Object.entries(metadata["dist-tags"] ?? {})) {
    const existing = tagLookup.get(ver) ?? [];
    existing.push(tag);
    tagLookup.set(ver, existing);
  }

  const publishTime = (v: string): number => {
    const ms = new Date(time[v] ?? "").getTime();
    return Number.isNaN(ms) ? 0 : ms;
  };

  const rows = Object.keys(allVersions)
    .sort((a, b) => publishTime(b) - publishTime(a))
    .slice(0, limit)
    .map((ver) => ({
      version: ver,
      date: time[ver],
      tags: tagLookup.get(ver) ?? [],
      deprecated: allVersions[ver]?.deprecated,
    }));

  return { rows, total };
}

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
        const { rows, total } = collectVersionRows(metadata, limit);

        if (total === 0) {
          return textResult(`No version information available for "${package_name}".`);
        }

        const lines: string[] = [
          `# ${package_name} - Versions`,
          "",
          `Total versions: ${total} (showing ${rows.length} most recent)`,
          "",
        ];

        for (const row of rows) {
          let line = `- **${row.version}**`;
          if (row.date) line += ` (${row.date})`;
          if (row.tags.length) line += ` [${row.tags.join(", ")}]`;
          if (row.deprecated) line += ` **DEPRECATED**: ${row.deprecated}`;
          lines.push(line);
        }

        return textResult(lines);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
