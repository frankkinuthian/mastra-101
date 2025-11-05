import { MCPClient } from "@mastra/mcp";
import { createSmitheryUrl } from "@smithery/sdk";
import path from "path";

const smitheryGithubMCPServerUrl = createSmitheryUrl(
  "https://server.smithery.ai/@smithery-ai/github",
  {
    apiKey: process.env.SMITHERY_API_KEY,
    profile: process.env.SMITHERY_PROFILE,
    config: {
      githubPersonalAccessToken: process.env.GITHUB_TOKEN,
    },
  }
);

const mcp = new MCPClient({
  servers: {
    zapier: {
      url: new URL(process.env.ZAPIER_MCP_URL || ""),
    },
    github: {
      url: smitheryGithubMCPServerUrl,
    },
    hackernews: {
      command: "npx",
      args: ["-y", "@devabdultech/hn-mcp-server"],
    },
    textEditor: {
      command: "pnpx",
      args: [
        `@modelcontextprotocol/server-filesystem`,
        path.join(process.cwd(), "..", "..", "notes"), // relative to output directory
      ],
    },
  },
});

const mcpTools = await mcp.getTools();

export { mcp, mcpTools };
