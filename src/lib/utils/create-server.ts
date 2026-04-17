import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function createServer(server: McpServer) {
  try {
    const transport = new StdioServerTransport();
    console.error("Weather MCP Server firing up on stdio..."); 
    return await server.connect(transport);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in createServer():", error.message);
    }
    console.error("Fatal error in createServer():", error);
    process.exit(1);
  }
}