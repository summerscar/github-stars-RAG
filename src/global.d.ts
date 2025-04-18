declare module "*.svg";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_REDIRECT_URI: string;
      GITHUB_CLIENT_ID: string;
    }
  }
}
