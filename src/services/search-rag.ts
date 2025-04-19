import { RAGResponse } from "@/types";

const AUTO_RAG_NAME = process.env.AUTO_RAG_NAME;
const AUTO_RAG_TOKEN = process.env.AUTO_RAG_TOKEN;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;

export const searchRAG = async (query: string) => {
  if (!AUTO_RAG_NAME || !AUTO_RAG_TOKEN || !R2_ACCOUNT_ID) {
    throw new Error("Missing environment variables");
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
