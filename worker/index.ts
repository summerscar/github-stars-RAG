import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

type EnvFile = {
  AUTO_RAG_NAME: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};
const isDev = process.env.NODE_ENV === "development";

export class GitHubStarsMCP extends McpAgent {
  server = new McpServer({ name: "GitHub Stars", version: "0.0.1" });
  declare env: Env & EnvFile;
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
  fetch: async (req: Request, env: Env & EnvFile, ctx: any) => {
    const request = new URL(req.url);
    if (request.pathname === "/api/mcp") {
      return GitHubStarsMCP.mount("/mcp").fetch(req, env as any, ctx);
    }

    if (request.pathname === "/api/auth/callback/github") {
      const code = request.searchParams.get("code");
      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      const response = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${env.GITHUB_CLIENT_ID}&client_secret=${env.GITHUB_CLIENT_SECRET}&code=${code}`,
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "application/json",
          },
        },
      );
      const json = await response.json<{
        access_token: string;
      }>();
      if (response.ok) {
        const token = json.access_token;
        const url = new URL("/", request.origin);
        // 反代
        isDev && (url.port = "3000");
        url.searchParams.set("access_token", token);
        return Response.redirect(url.toString(), 301);
      }
      return new Response(JSON.stringify(json), { status: response.status });
    }

    if (request.pathname === "/api/search") {
      const query = request.searchParams.get("query");

      if (!query) {
        return new Response("Missing query parameter", { status: 400 });
      }
      const answer = await env.AI.autorag(env.AUTO_RAG_NAME).search({
        query,
      });

      return new Response(JSON.stringify(answer.data), { status: 200 });
    }

    return env.ASSETS.fetch(request);
  },
};
