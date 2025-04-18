// This is a mock service that simulates fetching data from GitHub API
// In a real application, we would use the GitHub API directly

import { Repository } from "@/types";
import { getOctokit } from "./github-login";

export const fetchStarredRepositories = async () => {
  // Simulate API call delay
  const octokit = getOctokit();
  const size = 100;
  let currentSize = size;
  let page = 1;
  let result: Repository[] = [];
  while (currentSize === size) {
    const repos = await octokit.request("GET /user/starred", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: size,
      page: page++,
    });
    currentSize = repos.data.length;
    result.push(...repos.data);
  }
  return result;
};

export const getUserProfile = async () => {
  // Simulate API call delay

  const octokit = getOctokit();
  const user = await octokit.request("GET /user", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return user.data;
};
