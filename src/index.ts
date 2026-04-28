#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./lib/tools.js";

const server = new McpServer({
  name: "Weather MCP Server",
  version: "1.0.0",
});

registerTools(server);

console.error("Weather MCP Server firing up on stdio...");
await server.connect(new StdioServerTransport());
