import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchPackageMetadata,
  extractGitHubRepo,
  fetchGitHubReadme,
} from "../services/npm-api.js";
import { CHARACTER_LIMIT } from "../constants.js";

const ReadmeInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
};

export function registerReadmeTool(server: McpServer): void {
  server.registerTool(
    "npm_package_readme",
    {
      title: "Get npm Package README",
      description: `Get the README content of an npm package.

Returns the package's README markdown content, which typically includes installation instructions, usage examples, API documentation, and configuration options.

Args:
  - package_name (string): The npm package name

Returns:
  README content in markdown format. Large READMEs are truncated to ${CHARACTER_LIMIT} characters with a notice.

Examples:
  - "zod" -> Zod README with schema validation examples
  - "express" -> Express README with routing examples`,
      inputSchema: ReadmeInputSchema,
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

        let readmeContent = metadata.readme;
        let source = "npm";

        if (!readmeContent || readmeContent === "ERROR: No README data found!") {
          const ghRepo = extractGitHubRepo(metadata.repository);
          if (ghRepo) {
            const ghReadme = await fetchGitHubReadme(ghRepo.owner, ghRepo.repo);
            if (ghReadme) {
              readmeContent = ghReadme;
              source = "github";
            }
          }
        }

        if (!readmeContent || readmeContent === "ERROR: No README data found!") {
          return {
            content: [
              {
                type: "text" as const,
                text: `No README found for "${package_name}". Check the package's repository or homepage for documentation.`,
              },
            ],
          };
        }

        let readme = readmeContent;
        let truncated = false;

        if (readme.length > CHARACTER_LIMIT) {
          readme = readme.slice(0, CHARACTER_LIMIT);
          truncated = true;
        }

        const lines: string[] = [`# README: ${package_name}`, ""];

        if (source === "github") {
          lines.push(
            `> **Note:** README fetched from GitHub repository as npm registry had no README data.`,
            ""
          );
        }

        if (truncated) {
          lines.push(
            `> **Note:** README truncated from ${readmeContent.length} to ${CHARACTER_LIMIT} characters.`,
            ""
          );
        }

        lines.push(readme);

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
