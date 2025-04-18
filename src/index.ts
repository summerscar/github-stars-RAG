import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

export class GitHubStarsMCP extends McpAgent {
  server = new McpServer({ name: "GitHub Stars", version: "0.0.1" });
  env: any;

  async init() {
    this.server.tool(
      "search_github_stars",
      { query: z.string() },
      async ({ query }) => {
        const answer = await this.env.AI.autorag(this.env.AUTO_RAG_NAME).search(
          {
            query,
          },
        );

        return {
          content: [{ type: "text", text: JSON.stringify(answer.data) }],
        };
      },
    );
  }
}

export default {
  fetch: (req: Request, env: any, ctx: any) => {
    const request = new URL(req.url);
    const API_KEY = request.searchParams.get("api-key");
    if (env.MCP_API_KEY && API_KEY !== env.MCP_API_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }
    return GitHubStarsMCP.mount("/").fetch(req, env, ctx);
  },
};
