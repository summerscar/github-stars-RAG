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
