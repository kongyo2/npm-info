import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPackageMetadata } from "../services/npm-api.js";

const PackageInfoInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name (e.g., 'react', '@types/node', 'lodash')"),
};

function formatRepository(repo: unknown): string | undefined {
  if (!repo) return undefined;
  if (typeof repo === "string") return repo;
  if (typeof repo === "object" && repo !== null && "url" in repo) {
    const url = (repo as { url: string }).url;
    return url.replace(/^git\+/, "").replace(/\.git$/, "");
  }
  return undefined;
}

function formatAuthor(author: unknown): string | undefined {
  if (!author) return undefined;
  if (typeof author === "string") return author;
  if (typeof author === "object" && author !== null && "name" in author) {
    const a = author as { name?: string; email?: string; url?: string };
    const parts = [a.name];
    if (a.email) parts.push(`<${a.email}>`);
    if (a.url) parts.push(`(${a.url})`);
    return parts.join(" ");
  }
  return undefined;
}

export function registerPackageInfoTool(server: McpServer): void {
  server.registerTool(
    "npm_package_info",
    {
      title: "Get npm Package Info",
      description: `Get comprehensive information about an npm package including latest version, description, license, homepage, repository, keywords, engines, and maintainers.

Args:
  - package_name (string): The npm package name

Returns:
  Package metadata including:
  - name, latest version, description
  - license, homepage, repository URL
  - keywords, engines (node/npm version requirements)
  - dist-tags (latest, next, beta, etc.)
  - maintainers list
  - author information

Examples:
  - "react" -> React package info with latest version, license, etc.
  - "@anthropic-ai/sdk" -> Anthropic SDK details`,
      inputSchema: PackageInfoInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name }) => {
      try {
        const metadata = await fetchPackageMetadata(package_name);
        const latestTag = metadata["dist-tags"]?.latest;
        const latestVersion =
          latestTag && metadata.versions?.[latestTag]
            ? metadata.versions[latestTag]
            : undefined;

        const lines: string[] = [`# ${metadata.name}`];
        if (metadata.description) lines.push("", metadata.description);
        lines.push("");

        if (latestTag) lines.push(`**Latest Version:** ${latestTag}`);
        if (metadata.license) lines.push(`**License:** ${metadata.license}`);
        if (metadata.homepage) lines.push(`**Homepage:** ${metadata.homepage}`);

        const repoUrl = formatRepository(metadata.repository);
        if (repoUrl) lines.push(`**Repository:** ${repoUrl}`);

        const authorStr = formatAuthor(latestVersion?.author);
        if (authorStr) lines.push(`**Author:** ${authorStr}`);

        if (latestVersion?.engines) {
          const engineParts = Object.entries(latestVersion.engines).map(
            ([k, v]) => `${k}: ${v}`
          );
          lines.push(`**Engines:** ${engineParts.join(", ")}`);
        }

        if (metadata.keywords?.length) {
          lines.push(`**Keywords:** ${metadata.keywords.join(", ")}`);
        }

        if (metadata["dist-tags"]) {
          const tags = Object.entries(metadata["dist-tags"])
            .map(([tag, ver]) => `${tag}: ${ver}`)
            .join(", ");
          lines.push(`**Dist-tags:** ${tags}`);
        }

        if (metadata.maintainers?.length) {
          lines.push("");
          lines.push("**Maintainers:**");
          for (const m of metadata.maintainers.slice(0, 10)) {
            lines.push(`- ${m.name}${m.email ? ` <${m.email}>` : ""}`);
          }
          if (metadata.maintainers.length > 10) {
            lines.push(`- ... and ${metadata.maintainers.length - 10} more`);
          }
        }

        if (latestVersion) {
          const depCount = Object.keys(latestVersion.dependencies ?? {}).length;
          const peerCount = Object.keys(latestVersion.peerDependencies ?? {}).length;
          lines.push("");
          lines.push(
            `**Dependencies:** ${depCount} direct${peerCount > 0 ? `, ${peerCount} peer` : ""}`
          );

          if (latestVersion.types || latestVersion.typings) {
            lines.push(
              `**TypeScript:** Bundled types (${latestVersion.types ?? latestVersion.typings})`
            );
          }

          if (latestVersion.deprecated) {
            lines.push("");
            lines.push(`> **DEPRECATED:** ${latestVersion.deprecated}`);
          }
        }

        const publishDate = metadata.time?.[latestTag ?? ""];
        if (publishDate) {
          lines.push(`**Last Published:** ${publishDate}`);
        }
        const createdDate = metadata.time?.created;
        if (createdDate) {
          lines.push(`**Created:** ${createdDate}`);
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
