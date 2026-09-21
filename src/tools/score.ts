import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchAbbreviatedPackument,
  fetchNpmDownloads,
  fetchNpmsScore,
  HttpError,
} from "../services/npm-api.js";
import { errorMessage, errorResult, textResult } from "./shared.js";
import type { NpmDownloadsResponse, NpmsPackageResponse } from "../types.js";

const ScoreInputSchema = {
  package_name: z
    .string()
    .trim()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
};

function pct(val: number | undefined): string {
  if (val === undefined) return "N/A";
  return `${(val * 100).toFixed(0)}%`;
}

function num(val: number | undefined): string {
  if (val === undefined) return "N/A";
  return Math.round(val).toLocaleString("en-US");
}

const MS_PER_DAY = 86_400_000;

function windowDays(from: string, to: string): number | null {
  const start = Date.parse(from);
  const end = Date.parse(to);
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  return Math.round((end - start) / MS_PER_DAY);
}

export function daysSince(iso: string, now: number = Date.now()): number | null {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  return Math.floor((now - ms) / MS_PER_DAY);
}

export const STALE_AFTER_DAYS = 180;

export interface ScoreReportInput {
  packageName: string;
  npms: NpmsPackageResponse | null;
  npmsError?: string;
  registryMeta?: { latest?: string; modified?: string };
  downloads: {
    lastWeek?: NpmDownloadsResponse;
    lastMonth?: NpmDownloadsResponse;
  };
  now?: number;
}

export function formatScoreReport(input: ScoreReportInput): string[] {
  const { packageName, npms, npmsError, registryMeta, downloads, now } = input;
  const lines: string[] = [`# ${packageName} - Package Score`, ""];

  if (npms) {
    lines.push(`**Overall Score:** ${pct(npms.score?.final)}`);
    if (npms.score?.detail) {
      const detail = npms.score.detail;
      lines.push(
        "",
        "## Score Breakdown",
        "",
        "| Category | Score |",
        "|----------|-------|",
        `| Quality | ${pct(detail.quality)} |`,
        `| Popularity | ${pct(detail.popularity)} |`,
        `| Maintenance | ${pct(detail.maintenance)} |`
      );
    }
    lines.push("");

    const ev = npms.evaluation;
    if (ev?.quality) {
      lines.push("## Quality Details");
      lines.push("");
      if (ev.quality.carefulness !== undefined)
        lines.push(`- **Carefulness:** ${pct(ev.quality.carefulness)}`);
      if (ev.quality.tests !== undefined)
        lines.push(`- **Tests:** ${pct(ev.quality.tests)}`);
      if (ev.quality.health !== undefined)
        lines.push(`- **Health:** ${pct(ev.quality.health)}`);
      if (ev.quality.branding !== undefined)
        lines.push(`- **Branding:** ${pct(ev.quality.branding)}`);
      lines.push("");
    }

    if (ev?.popularity) {
      lines.push("## Popularity Details");
      lines.push("");
      if (ev.popularity.communityInterest !== undefined)
        lines.push(`- **Community Interest:** ${num(ev.popularity.communityInterest)}`);
      if (ev.popularity.downloadsCount !== undefined)
        lines.push(
          `- **Downloads (30d, at analysis time):** ${num(ev.popularity.downloadsCount)}`
        );
      if (ev.popularity.downloadsAcceleration !== undefined)
        lines.push(
          `- **Download Acceleration:** ${ev.popularity.downloadsAcceleration.toFixed(1)}`
        );
      if (ev.popularity.dependentsCount !== undefined)
        lines.push(`- **Dependents:** ${num(ev.popularity.dependentsCount)}`);
      lines.push("");
    }

    if (ev?.maintenance) {
      lines.push("## Maintenance Details");
      lines.push("");
      if (ev.maintenance.releasesFrequency !== undefined)
        lines.push(`- **Release Frequency:** ${pct(ev.maintenance.releasesFrequency)}`);
      if (ev.maintenance.commitsFrequency !== undefined)
        lines.push(`- **Commit Frequency:** ${pct(ev.maintenance.commitsFrequency)}`);
      if (ev.maintenance.openIssues !== undefined)
        lines.push(`- **Open Issues:** ${pct(ev.maintenance.openIssues)}`);
      if (ev.maintenance.issuesDistribution !== undefined)
        lines.push(`- **Issue Resolution:** ${pct(ev.maintenance.issuesDistribution)}`);
      lines.push("");
    }

    const collectedDownloads = npms.collected?.npm?.downloads;
    if (collectedDownloads?.length) {
      lines.push("## Download Statistics (at analysis time)");
      lines.push("");
      for (const window of collectedDownloads) {
        const days = windowDays(window.from, window.to);
        const label =
          days === null
            ? `${window.from} – ${window.to}`
            : `Last ${days} day${days === 1 ? "" : "s"}`;
        lines.push(`- **${label}:** ${num(window.count)}`);
      }
      lines.push("");
    }

    if (npms.collected?.github) {
      const gh = npms.collected.github;
      lines.push("## GitHub Stats");
      lines.push("");
      if (gh.starsCount !== undefined) lines.push(`- **Stars:** ${num(gh.starsCount)}`);
      if (gh.forksCount !== undefined) lines.push(`- **Forks:** ${num(gh.forksCount)}`);
      if (gh.issues?.openCount !== undefined)
        lines.push(`- **Open Issues:** ${num(gh.issues.openCount)}`);
      if (gh.subscribersCount !== undefined)
        lines.push(`- **Watchers:** ${num(gh.subscribersCount)}`);
      lines.push("");
    }
  } else if (npmsError) {
    lines.push(
      `> **Note:** npms.io scoring is unavailable right now (${npmsError}).`,
      ""
    );
  } else {
    lines.push(
      "**npms.io:** no analysis available — its public index has been frozen since early 2023, so packages created or updated since then are unscored."
    );
    if (registryMeta) {
      const parts = [
        registryMeta.latest ? `latest ${registryMeta.latest}` : undefined,
        registryMeta.modified ? `updated ${registryMeta.modified}` : undefined,
      ].filter(Boolean);
      if (parts.length > 0) lines.push(`**Registry:** ${parts.join(", ")}`);
    }
    lines.push("");
  }

  const { lastWeek, lastMonth } = downloads;
  if (lastWeek || lastMonth) {
    lines.push("## npm Downloads (live)");
    lines.push("");
    if (lastWeek) lines.push(`- **Last 7 days:** ${num(lastWeek.downloads)}`);
    if (lastMonth) lines.push(`- **Last 30 days:** ${num(lastMonth.downloads)}`);
    lines.push("");
  }

  if (npms && npms.analyzedAt) {
    const age = daysSince(npms.analyzedAt, now);
    lines.push(
      `**Analyzed:** ${npms.analyzedAt}${age !== null && age >= 0 ? ` (${age} days ago)` : ""}`
    );
    if (age !== null && age > STALE_AFTER_DAYS) {
      lines.push(
        "",
        `> **Note:** this analysis is over ${STALE_AFTER_DAYS} days old — npms.io's index is frozen, so the scores above may badly lag the package's current state. The live download counts are current.`
      );
    }
  }

  return lines;
}

export function registerScoreTool(server: McpServer): void {
  server.registerTool(
    "npm_package_score",
    {
      title: "Get npm Package Score",
      description: `Get quality, popularity, and maintenance scores for an npm package from npms.io, plus live npm download counts.

Provides detailed metrics including download counts, GitHub stars, test coverage indicators, and release frequency.

Note: npms.io's public index has been frozen since early 2023, so scores can
be stale and recently-published packages may have no npms analysis at all —
in that case the report falls back to live registry/download data.

Args:
  - package_name (string): The npm package name

Returns:
  Comprehensive scoring breakdown:
  - Overall score (0-100%)
  - Quality score: carefulness, tests, health, branding
  - Popularity: community interest, downloads, dependents
  - Maintenance: release frequency, commit frequency, open issues
  - GitHub stats: stars, forks, issues
  - Download statistics (npms at analysis time + live npm counts)

Examples:
  - "react" -> High scores across all categories
  - "lodash" -> Well-maintained with high popularity`,
      inputSchema: ScoreInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name }) => {
      try {
        const [npmsRes, downloads] = await Promise.all([
          fetchNpmsScore(package_name).then(
            (data) => ({ data, error: undefined as unknown }),
            (error) => ({ data: undefined, error })
          ),
          fetchNpmDownloads(package_name),
        ]);

        if (npmsRes.data) {
          return textResult(
            formatScoreReport({
              packageName: package_name,
              npms: npmsRes.data,
              downloads,
            })
          );
        }

        const is404 = npmsRes.error instanceof HttpError && npmsRes.error.status === 404;
        let registryMeta: { latest?: string; modified?: string } | undefined;
        if (is404) {
          const packument = await fetchAbbreviatedPackument(package_name).catch(
            () => undefined
          );
          if (!packument) return errorResult(npmsRes.error);
          registryMeta = {
            latest: packument["dist-tags"]?.latest,
            modified: packument.modified,
          };
        }
        const hasDownloads = !!(downloads.lastWeek || downloads.lastMonth);
        if (!is404 && !hasDownloads) return errorResult(npmsRes.error);

        return textResult(
          formatScoreReport({
            packageName: package_name,
            npms: null,
            npmsError: is404 ? undefined : errorMessage(npmsRes.error),
            registryMeta,
            downloads,
          })
        );
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
