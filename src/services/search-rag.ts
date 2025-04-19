import { RAGResponse } from "@/types";

export const searchRAG = async (
  query: string,
  {
    AUTO_RAG_NAME,
    AUTO_RAG_TOKEN,
    R2_ACCOUNT_ID,
  }: {
    AUTO_RAG_NAME?: string;
    AUTO_RAG_TOKEN?: string;
    R2_ACCOUNT_ID?: string;
  },
) => {
  if (!AUTO_RAG_NAME || !AUTO_RAG_TOKEN || !R2_ACCOUNT_ID) {
    throw new Error("parameter is missing");
  }
  const response = await fetch(
    "/api/search?query=" +
      encodeURIComponent(query) +
      `&name=${AUTO_RAG_NAME}` +
      `&token=${AUTO_RAG_TOKEN}` +
      `&r2_account_id=${R2_ACCOUNT_ID}`,
  );
  const data = (await response.json()) as { result: { data: RAGResponse } };
  return data.result.data;
};
