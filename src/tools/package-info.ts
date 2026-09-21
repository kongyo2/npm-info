import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractGitHubRepo, fetchPackageMetadata } from "../services/npm-api.js";
import { detectTypesEntry } from "./types-check.js";
import type { LicenseRef, NpmPackageVersion, NpmRegistryResponse } from "../types.js";
import { errorResult, textResult } from "./shared.js";

const PackageInfoInputSchema = {
  package_name: z
    .string()
    .trim()
    .min(1, "Package name must not be empty")
    .describe("npm package name (e.g., 'react', '@types/node', 'lodash')"),
};

function formatLicenseRef(l: LicenseRef): string | undefined {
  const name = l.type ?? l.name;
  if (!name) return l.url;
  return l.url ? `${name} (${l.url})` : name;
}

export function formatLicense(
  license: string | LicenseRef | LicenseRef[] | undefined,
  licenses?: LicenseRef[]
): string | undefined {
  if (typeof license === "string") return license;
  const list = Array.isArray(license) ? license : license ? [license] : (licenses ?? []);
  const names = list
    .map((l) => (l && typeof l === "object" ? formatLicenseRef(l) : undefined))
    .filter((s): s is string => !!s);
  return names.length > 0 ? names.join(", ") : undefined;
}

export function formatRepository(
  repo: NpmRegistryResponse["repository"]
): string | undefined {
  if (!repo) return undefined;
  const url = typeof repo === "string" ? repo : repo.url;
  if (!url || typeof url !== "string") return undefined;

  const github = extractGitHubRepo(repo);
  if (github) {
    const base = `https://github.com/${github.owner}/${github.repo}`;
    return github.directory ? `${base}/tree/HEAD/${github.directory}` : base;
  }

  return url
    .replace(/^git\+/, "")
    .replace(/^git@([^:]+):/, "https://$1/")
    .replace(/^(?:git|ssh):\/\/(?:git@)?/, "https://")
    .replace(/^http:\/\//, "https://")
    .replace(/#.*$/, "")
    .replace(/\.git\/?$/, "")
    .replace(/\/$/, "");
}

export function formatAuthor(author: NpmPackageVersion["author"]): string | undefined {
  if (!author) return undefined;
  if (typeof author === "string") return author;
  const parts: string[] = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push(`<${author.email}>`);
  if (author.url) parts.push(`(${author.url})`);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function formatEngines(engines: NpmPackageVersion["engines"]): string | undefined {
  if (!engines) return undefined;
  if (typeof engines === "string") return engines;
  if (Array.isArray(engines)) {
    return engines.length > 0 ? engines.join(", ") : undefined;
  }
  if (typeof engines !== "object") return undefined;
  const parts = Object.entries(engines).map(([k, v]) => `${k}: ${v}`);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export function formatKeywords(
  keywords: string[] | string | undefined
): string | undefined {
  if (typeof keywords === "string") return keywords || undefined;
  if (!Array.isArray(keywords) || keywords.length === 0) return undefined;
  return keywords.join(", ");
}

export function formatMaintainer(m: { name?: string; email?: string } | string): string {
  if (typeof m === "string") return m;
  return `${m.name ?? "unknown"}${m.email ? ` <${m.email}>` : ""}`;
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

        const license = formatLicense(
          latestVersion?.license ?? metadata.license,
          latestVersion?.licenses ?? metadata.licenses
        );
        if (license) lines.push(`**License:** ${license}`);

        if (metadata.homepage) lines.push(`**Homepage:** ${metadata.homepage}`);

        const repoUrl = formatRepository(metadata.repository);
        if (repoUrl) lines.push(`**Repository:** ${repoUrl}`);

        const authorStr = formatAuthor(latestVersion?.author);
        if (authorStr) lines.push(`**Author:** ${authorStr}`);

        const engines = formatEngines(latestVersion?.engines);
        if (engines) lines.push(`**Engines:** ${engines}`);

        const keywords = formatKeywords(metadata.keywords);
        if (keywords) lines.push(`**Keywords:** ${keywords}`);

        if (metadata["dist-tags"]) {
          const tags = Object.entries(metadata["dist-tags"])
            .map(([tag, ver]) => `${tag}: ${ver}`)
            .join(", ");
          lines.push(`**Dist-tags:** ${tags}`);
        }

        const publishDate = metadata.time?.[latestTag ?? ""];
        if (publishDate) {
          lines.push(`**Last Published:** ${publishDate}`);
        }
        const createdDate = metadata.time?.created;
        if (createdDate) {
          lines.push(`**Created:** ${createdDate}`);
        }

        if (metadata.maintainers?.length) {
          lines.push("");
          lines.push("**Maintainers:**");
          for (const m of metadata.maintainers.slice(0, 10)) {
            lines.push(`- ${formatMaintainer(m)}`);
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

          const detection = detectTypesEntry(latestVersion);
          if (detection.source !== "none") {
            const sourceLabel =
              detection.source === "types" || detection.source === "typings"
                ? (detection.entry ?? `${detection.source} field`)
                : detection.source === "exports"
                  ? (detection.entry ?? "exports map")
                  : "typesVersions map";
            lines.push(`**TypeScript:** Bundled types (${sourceLabel})`);
          }

          if (typeof latestVersion.deprecated === "string") {
            lines.push("");
            lines.push(`> **DEPRECATED:** ${latestVersion.deprecated}`);
          }
        }

        return textResult(lines);
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
