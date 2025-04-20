import { Repository } from "@/types";
import localforage from "localforage";

const localKey = "starred_repositories";
const timeStampKey = "timestamp";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "github-stars",
  version: 1.0,
  storeName: "keyvaluepairs",
  description: "local storage",
});

export const getLocalRepository = async () => {
  const cached = await localforage.getItem(localKey);
  const timeStamp = await localforage.getItem(timeStampKey);
  if (cached) {
    try {
      return [cached, timeStamp] as [Repository[], number];
    } catch {
      return null;
    }
  }
  return null;
};

export const setLocalRepository = async (repos: Repository[]) => {
  try {
    await localforage.setItem(localKey, repos);
    await localforage.setItem(timeStampKey, Date.now());
  } catch (error) {
    console.error("Error saving to localForage", error);
  }
};

export const removeLocalRepository = async () => {
  try {
    await localforage.removeItem(localKey);
    await localforage.removeItem(timeStampKey);
  } catch (error) {
    console.error("Error removing from localForage", error);
  }
};
