import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchNpmsScore } from "../services/npm-api.js";

const ScoreInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
};

function pct(val: number | undefined): string {
  if (val === undefined) return "N/A";
  return `${(val * 100).toFixed(0)}%`;
}

function num(val: number | undefined): string {
  if (val === undefined) return "N/A";
  return val.toLocaleString();
}

export function registerScoreTool(server: McpServer): void {
  server.registerTool(
    "npm_package_score",
    {
      title: "Get npm Package Score",
      description: `Get quality, popularity, and maintenance scores for an npm package from npms.io.

Provides detailed metrics including download counts, GitHub stars, test coverage indicators, and release frequency.

Args:
  - package_name (string): The npm package name

Returns:
  Comprehensive scoring breakdown:
  - Overall score (0-100%)
  - Quality score: carefulness, tests, health, branding
  - Popularity: community interest, downloads, dependents
  - Maintenance: release frequency, commit frequency, open issues
  - GitHub stats: stars, forks, issues
  - Download statistics

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
        const data = await fetchNpmsScore(package_name);

        const lines: string[] = [
          `# ${package_name} - Package Score`,
          "",
          `**Overall Score:** ${pct(data.score.final)}`,
          "",
          "## Score Breakdown",
          "",
          `| Category | Score |`,
          `|----------|-------|`,
          `| Quality | ${pct(data.score.detail.quality)} |`,
          `| Popularity | ${pct(data.score.detail.popularity)} |`,
          `| Maintenance | ${pct(data.score.detail.maintenance)} |`,
          "",
        ];

        const ev = data.evaluation;
        if (ev.quality) {
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

        if (ev.popularity) {
          lines.push("## Popularity Details");
          lines.push("");
          if (ev.popularity.communityInterest !== undefined)
            lines.push(
              `- **Community Interest:** ${num(ev.popularity.communityInterest)}`
            );
          if (ev.popularity.downloadsCount !== undefined)
            lines.push(
              `- **Downloads (30d):** ${num(ev.popularity.downloadsCount)}`
            );
          if (ev.popularity.downloadsAcceleration !== undefined)
            lines.push(
              `- **Download Acceleration:** ${ev.popularity.downloadsAcceleration.toFixed(1)}`
            );
          if (ev.popularity.dependentsCount !== undefined)
            lines.push(
              `- **Dependents:** ${num(ev.popularity.dependentsCount)}`
            );
          lines.push("");
        }

        if (ev.maintenance) {
          lines.push("## Maintenance Details");
          lines.push("");
          if (ev.maintenance.releasesFrequency !== undefined)
            lines.push(
              `- **Release Frequency:** ${pct(ev.maintenance.releasesFrequency)}`
            );
          if (ev.maintenance.commitsFrequency !== undefined)
            lines.push(
              `- **Commit Frequency:** ${pct(ev.maintenance.commitsFrequency)}`
            );
          if (ev.maintenance.openIssues !== undefined)
            lines.push(`- **Open Issues:** ${pct(ev.maintenance.openIssues)}`);
          if (ev.maintenance.issuesDistribution !== undefined)
            lines.push(
              `- **Issue Resolution:** ${pct(ev.maintenance.issuesDistribution)}`
            );
          lines.push("");
        }

        if (data.collected.github) {
          const gh = data.collected.github;
          lines.push("## GitHub Stats");
          lines.push("");
          if (gh.starsCount !== undefined)
            lines.push(`- **Stars:** ${num(gh.starsCount)}`);
          if (gh.forksCount !== undefined)
            lines.push(`- **Forks:** ${num(gh.forksCount)}`);
          if (gh.issues?.openCount !== undefined)
            lines.push(`- **Open Issues:** ${num(gh.issues.openCount)}`);
          if (gh.subscribersCount !== undefined)
            lines.push(`- **Watchers:** ${num(gh.subscribersCount)}`);
          lines.push("");
        }

        lines.push(`**Analyzed:** ${data.analyzedAt}`);

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
