import { RAGResponse } from "@/types";

export const searchRAG = async (query: string) => {
  const response = await fetch(
    "/api/search?query=" + encodeURIComponent(query),
  );
  const data = await response.json();
  return data as RAGResponse;
};
