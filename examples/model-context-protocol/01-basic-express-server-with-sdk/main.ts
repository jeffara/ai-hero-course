import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
});

server.tool("getWeather", {}, async () => ({
  content: [
    {
      type: "text",
      text: `The weather today is sunny!`,
    },
  ],
}));

let transport: SSEServerTransport | undefined =
  undefined;

const app = express();

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (!transport) {
    res.status(400);
    res.json({ error: "No transport" });
    return;
  }
  await transport.handlePostMessage(req, res);
});

app.listen(3001);
