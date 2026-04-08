import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchPackageMetadata,
  checkDefinitelyTyped,
} from "../services/npm-api.js";

const TypesCheckInputSchema = {
  package_name: z
    .string()
    .min(1, "Package name must not be empty")
    .describe("npm package name"),
  version: z
    .string()
    .optional()
    .describe("Specific version to check (default: latest)"),
};

export function registerTypesCheckTool(server: McpServer): void {
  server.registerTool(
    "npm_package_types",
    {
      title: "Check npm Package TypeScript Support",
      description: `Check if an npm package has TypeScript type definitions.

Checks for bundled types (types/typings field in package.json) and DefinitelyTyped (@types/) packages.

Args:
  - package_name (string): The npm package name
  - version (string, optional): Specific version to check (defaults to latest)

Returns:
  TypeScript type support details:
  - Whether types are bundled with the package
  - Type definition entry point path
  - Whether @types/ package exists on DefinitelyTyped
  - @types/ package version if available
  - Installation instructions

Examples:
  - "express" -> Has @types/express on DefinitelyTyped
  - "zod" -> Bundled types (TypeScript-first library)
  - "typescript" -> Bundled types`,
      inputSchema: TypesCheckInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ package_name, version }) => {
      try {
        const metadata = await fetchPackageMetadata(package_name);
        const targetVersion =
          version ?? metadata["dist-tags"]?.latest;

        if (!targetVersion || !metadata.versions?.[targetVersion]) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not find version "${version ?? "latest"}" for "${package_name}".`,
              },
            ],
            isError: true,
          };
        }

        const versionData = metadata.versions[targetVersion];
        const typesField = versionData.types ?? versionData.typings;
        const hasBundledTypes = !!typesField;

        const dtResult = await checkDefinitelyTyped(package_name);

        const lines: string[] = [
          `# ${package_name}@${targetVersion} - TypeScript Support`,
          "",
        ];

        if (hasBundledTypes) {
          lines.push(`**Bundled Types:** Yes`);
          lines.push(`**Types Entry:** ${typesField}`);
          lines.push("");
          lines.push(
            "This package includes its own TypeScript type definitions. No additional @types/ package needed."
          );
        } else if (dtResult.exists) {
          const typesName = package_name.startsWith("@")
            ? `@types/${package_name.slice(1).replace("/", "__")}`
            : `@types/${package_name}`;
          lines.push(`**Bundled Types:** No`);
          lines.push(
            `**DefinitelyTyped:** Yes (${typesName}@${dtResult.version})`
          );
          lines.push("");
          lines.push("Install types separately:");
          lines.push(`\`\`\`bash`);
          lines.push(`npm install -D ${typesName}`);
          lines.push(`\`\`\``);
        } else {
          lines.push(`**Bundled Types:** No`);
          lines.push(`**DefinitelyTyped:** Not available`);
          lines.push("");
          lines.push(
            "This package does not have TypeScript type definitions. You may need to create a local declaration file (`.d.ts`) or use `// @ts-ignore`."
          );
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
