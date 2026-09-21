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
  const name =
    typeof l.type === "string" && l.type
      ? l.type
      : typeof l.name === "string" && l.name
        ? l.name
        : undefined;
  const url = typeof l.url === "string" && l.url ? l.url : undefined;
  if (!name) return url;
  return url ? `${name} (${url})` : name;
}

export function formatLicense(
  license: string | LicenseRef | Array<LicenseRef | string> | undefined,
  licenses?: Array<LicenseRef | string>
): string | undefined {
  if (typeof license === "string") return license;
  const list = Array.isArray(license) ? license : license ? [license] : (licenses ?? []);
  const names = list
    .map((l) =>
      typeof l === "string"
        ? l
        : l && typeof l === "object"
          ? formatLicenseRef(l)
          : undefined
    )
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
  if (typeof author !== "object") return undefined;
  const parts: string[] = [];
  if (typeof author.name === "string" && author.name) parts.push(author.name);
  if (typeof author.email === "string" && author.email) parts.push(`<${author.email}>`);
  if (typeof author.url === "string" && author.url) parts.push(`(${author.url})`);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function formatEngines(engines: NpmPackageVersion["engines"]): string | undefined {
  if (!engines) return undefined;
  if (typeof engines === "string") return engines;
  if (Array.isArray(engines)) {
    const items = engines.filter((e): e is string => typeof e === "string" && e !== "");
    return items.length > 0 ? items.join(", ") : undefined;
  }
  if (typeof engines !== "object") return undefined;
  const parts = Object.entries(engines)
    .filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== "")
    .map(([k, v]) => `${k}: ${v}`);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export function formatKeywords(
  keywords: string[] | string | undefined
): string | undefined {
  if (typeof keywords === "string") return keywords || undefined;
  if (!Array.isArray(keywords) || keywords.length === 0) return undefined;
  const items = keywords.filter((k): k is string => typeof k === "string" && k !== "");
  return items.length > 0 ? items.join(", ") : undefined;
}

export function formatMaintainer(
  m: { name?: string; email?: string } | string | null | undefined
): string {
  if (typeof m === "string") return m;
  if (!m || typeof m !== "object") return "unknown";
  const name = typeof m.name === "string" && m.name ? m.name : "unknown";
  const email = typeof m.email === "string" && m.email ? ` <${m.email}>` : "";
  return `${name}${email}`;
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
        const latestTagRaw = metadata["dist-tags"]?.latest;
        const latestTag = typeof latestTagRaw === "string" ? latestTagRaw : undefined;
        const latestCandidate = latestTag ? metadata.versions?.[latestTag] : undefined;
        const latestVersion =
          latestCandidate && typeof latestCandidate === "object"
            ? latestCandidate
            : undefined;

        const name =
          typeof metadata.name === "string" && metadata.name
            ? metadata.name
            : package_name;
        const lines: string[] = [`# ${name}`];
        if (typeof metadata.description === "string" && metadata.description)
          lines.push("", metadata.description);
        lines.push("");

        if (latestTag) lines.push(`**Latest Version:** ${latestTag}`);

        const license = formatLicense(
          latestVersion?.license ?? metadata.license,
          latestVersion?.licenses ?? metadata.licenses
        );
        if (license) lines.push(`**License:** ${license}`);

        if (typeof metadata.homepage === "string" && metadata.homepage)
          lines.push(`**Homepage:** ${metadata.homepage}`);

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
            .filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== "")
            .map(([tag, ver]) => `${tag}: ${ver}`)
            .join(", ");
          if (tags) lines.push(`**Dist-tags:** ${tags}`);
        }

        const publishDate = latestTag ? metadata.time?.[latestTag] : undefined;
        if (typeof publishDate === "string" && publishDate) {
          lines.push(`**Last Published:** ${publishDate}`);
        }
        const createdDate = metadata.time?.created;
        if (typeof createdDate === "string" && createdDate) {
          lines.push(`**Created:** ${createdDate}`);
        }

        if (Array.isArray(metadata.maintainers) && metadata.maintainers.length) {
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
          const depCount = Object.keys(
            typeof latestVersion.dependencies === "object" &&
              latestVersion.dependencies !== null &&
              !Array.isArray(latestVersion.dependencies)
              ? latestVersion.dependencies
              : {}
          ).length;
          const peerCount = Object.keys(
            typeof latestVersion.peerDependencies === "object" &&
              latestVersion.peerDependencies !== null &&
              !Array.isArray(latestVersion.peerDependencies)
              ? latestVersion.peerDependencies
              : {}
          ).length;
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
