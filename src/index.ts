#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchTool } from "./tools/search.js";
import { registerPackageInfoTool } from "./tools/package-info.js";
import { registerVersionsTool } from "./tools/versions.js";
import { registerDependenciesTool } from "./tools/dependencies.js";
import { registerReadmeTool } from "./tools/readme.js";
import { registerTypesCheckTool } from "./tools/types-check.js";
import { registerScoreTool } from "./tools/score.js";

const server = new McpServer({
  name: "npm-info-mcp-server",
  version: "1.0.0",
});

registerSearchTool(server);
registerPackageInfoTool(server);
registerVersionsTool(server);
registerDependenciesTool(server);
registerReadmeTool(server);
registerTypesCheckTool(server);
registerScoreTool(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("npm-info-mcp-server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
