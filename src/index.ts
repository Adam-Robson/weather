import { server } from "./lib/server.js";
import { createServer } from "./lib/utils/create-server.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

async function asyncMain() {
  const s: McpServer = server;
  return await createServer(s);
}

function main() {
  asyncMain().catch((e) => {
    if (e instanceof Error) {
      console.error("Error in asyncMain():", e.message);
    }
    console.error("Fatal error in asyncMain():", e);
    process.exit(1);
  });
}

main();
