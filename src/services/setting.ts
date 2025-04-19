import { Setting } from "@/types";
import { isDev } from "./is-dev";

const getSettings = (): Setting | null => {
  const setting = localStorage.getItem("settings");
  if (setting) {
    return JSON.parse(setting);
  }
  return null;
};

const setSettings = (setting: Setting) => {
  localStorage.setItem("settings", JSON.stringify(setting));
};

const removeSettings = () => {
  if (isDev) return;

  localStorage.removeItem("settings");
};

export { getSettings, removeSettings, setSettings };
