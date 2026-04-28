# weather

An MCP server that exposes US National Weather Service data as tools.

## Tools

- `get_alerts` — active weather alerts for a US state. Input: `state` (two-letter code).
- `get_forecast` — forecast for a US location. Input: `latitude`, `longitude`.

Only US locations are supported (NWS API limitation).

## Build

```sh
npm install
npm run build
```

The build emits an executable `dist/index.js` that speaks MCP over stdio.

## Use with a client

The server speaks MCP over stdio: a client launches `node dist/index.js` as a child process and exchanges JSON-RPC over stdin/stdout. You configure the client to launch it; you don't run the server yourself.

Use an absolute path to `dist/index.js` in any of the configs below — relative paths break because the client's working directory is not your shell's.

### Claude Desktop

Edit `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/absolute/path/to/weather/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. The tools appear in the tools menu; try asking "What are the active weather alerts in CA?" or "What's the forecast for 37.7749, -122.4194?".

### Claude Code

From the project directory:

```sh
claude mcp add weather -- node /absolute/path/to/weather/dist/index.js
```

Verify with `claude mcp list`. Tools show up as `mcp__weather__get_alerts` and `mcp__weather__get_forecast`.

### Other MCP clients

Any MCP-compatible client (Cursor, Continue, Zed, custom SDK clients) follows the same pattern — register a stdio server with:

- **command:** `node`
- **args:** `["/absolute/path/to/weather/dist/index.js"]`

### Quick sanity check without a client

You can drive the server by hand to confirm it's working:

```sh
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

You should see `get_alerts` and `get_forecast` in the response.

## Troubleshooting

- **"Server disconnected" / tools missing:** the client logs the child process's stderr. Check the client's MCP log (Claude Desktop: `~/Library/Logs/Claude/mcp-server-weather.log` on macOS).
- **`command not found: node`:** the client doesn't inherit your shell's PATH. Use the absolute path to your node binary (`which node`) as `command`.
- **All requests fail:** the NWS API only covers US territory. Coordinates outside the US return an error from `get_forecast`.
