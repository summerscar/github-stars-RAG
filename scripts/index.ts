import { components } from "@octokit/openapi-types";
import fs from "fs-extra";
import process from "node:process";
import { $fetch, FetchError } from "ofetch";

type Repo = components["schemas"]["repository"];

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

async function getReadMe(repo: Repo) {
  console.log(`Getting readme for ${repo.full_name}`);
  return $fetch<string>(
    `https://api.github.com/repos/${repo.full_name}/readme`,
    {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        accept: "application/vnd.github.raw+json",
        "user-agent": "github-stars",
      },
      retry: 3,
      retryDelay: 100,
    },
  );
}

async function getStaredRepos() {
  const perPage = 100;
  const repos: Repo[] = [];
  let page = 1;
  while (true) {
    console.log(`Getting page ${page}`);
    const pageRepos = await $fetch<Repo[]>(
      `https://api.github.com/user/starred`,
      {
        query: {
          page,
          per_page: perPage,
        },
        headers: {
          authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "user-agent": "github-stars",
        },
        retry: 3,
        retryDelay: 100,
      },
    );
    console.log(`Got ${pageRepos.length} repos`);
    repos.push(...pageRepos);
    console.log(`Current repos: ${repos.length}`);
    if (pageRepos.length < perPage) {
      break;
    }
    page++;
  }
  return repos;
}

function saveReadMe(repo: Repo, readme: string) {
  const fileContent = `---
project: ${repo.name}
stars: ${repo.stargazers_count}
description: |-
    ${repo.description}
url: ${repo.html_url}
---

${readme}
`;
  fs.ensureDirSync(`stars/${repo.owner.login}`);
  fs.writeFileSync(`stars/${repo.full_name}.md`, fileContent);
}

async function main() {
  try {
    fs.removeSync("stars");
    const repos = await getStaredRepos();
    for (const repo of repos) {
      try {
        const readme = await getReadMe(repo);
        saveReadMe(repo, readme);
      } catch (e) {
        console.error(`Error getting readme for ${repo.full_name}: ${e}`);
      }
    }
  } catch (e: unknown) {
    console.error(`Error: ${e}`);
    if (e instanceof FetchError) {
      console.error(`Fetch Error: `, e?.response, e?.response?.headers);
    }
    process.exit(1);
  }
}

await main();
