type EnvFile = {
  AUTO_RAG_NAME: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};
const isDev = process.env.NODE_ENV === "development";

export default {
  fetch: async (req: Request, env: Env & EnvFile, ctx: any) => {
    const request = new URL(req.url);
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
      const name = request.searchParams.get("name");
      const token = request.searchParams.get("token");
      const r2_account_id = request.searchParams.get("r2_account_id");
      if (!query) {
        return new Response("Missing query parameter", { status: 400 });
      }
      const answer = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${r2_account_id}/autorag/rags/${name}/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        },
      );
      const data = await answer.json();
      return new Response(JSON.stringify(data), { status: 200 });
    }

    return env.ASSETS.fetch(request);
  },
};
