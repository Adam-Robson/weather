import { server } from "./lib/server.js";
import { createServer } from "./lib/utils/create-server.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

async function asyncMain() {
  return await createServer(server);
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
