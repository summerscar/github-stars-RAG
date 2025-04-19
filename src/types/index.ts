import { components } from "@octokit/openapi-types";

export type Repository = components["schemas"]["repository"];

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  repositoryIds: number[];
}

export type User = components["schemas"]["public-user"];

export type ThemeMode = "light" | "dark";

export interface AppState {
  repositories: Repository[];
  collections: Collection[];
  tags: string[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  theme: ThemeMode;
  settings: Setting | null;
}

interface Attribute {
  timestamp: number;
  folder: string;
}

export interface Content {
  id: string;
  type: string;
  text: string;
}

type RAGItem = {
  file_id: string;
  filename: string;
  score: number;
  attributes: Attribute;
  content: Content[];
};

export type RAGResponse = RAGItem[];

export type Setting = {
  AUTO_RAG_TOKEN: string;
  AUTO_RAG_NAME: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
};
