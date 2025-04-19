import { Octokit } from "@octokit/core";
let octokit: Octokit | undefined;
const useGithubLogin = () => {
  //   const { dispatch } = useAppContext();
  const handleLogin = () => {};
  return { handleLogin };
};

const githubLogin = () => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${location.origin + redirectUri}`;
  window.location.href = url;
};

export const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token;
};

export const setToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
  octokit = undefined;
};

export const getOctokit = () => {
  if (octokit) return octokit;
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }
  return (octokit = new Octokit({
    auth: token,
  }));
};

export { githubLogin };

export default useGithubLogin;
