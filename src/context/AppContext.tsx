import { getToken, removeToken } from "@/services/github-login";
import { getSettings, removeSettings } from "@/services/setting";
import { removeLocalRepository } from "@/services/storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  fetchStarredRepositories,
  getUserProfile,
} from "../services/githubService";
import {
  AppState,
  Collection,
  Repository,
  Setting,
  ThemeMode,
  User,
} from "../types";

// Define action types
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_SETTINGS"; payload: Setting | null }
  | { type: "SET_REPOSITORIES"; payload: Repository[] }
  | { type: "UPDATE_REPOSITORY"; payload: Repository }
  | { type: "SET_COLLECTIONS"; payload: Collection[] }
  | { type: "ADD_COLLECTION"; payload: Collection }
  | { type: "UPDATE_COLLECTION"; payload: Collection }
  | { type: "REMOVE_COLLECTION"; payload: string }
  | { type: "ADD_TAG"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  | { type: "TOGGLE_THEME" };

// Initial state
const initialState: AppState = {
  repositories: [],
  collections: [],
  tags: [],
  user: null,
  isLoading: false,
  error: null,
  theme: "light",
  settings: null,
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_REPOSITORIES":
      return { ...state, repositories: action.payload };
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "UPDATE_REPOSITORY":
      return {
        ...state,
        repositories: state.repositories.map((repo) =>
          repo.id === action.payload.id ? action.payload : repo,
        ),
      };
    case "SET_COLLECTIONS":
      return { ...state, collections: action.payload };
    case "ADD_COLLECTION":
      return { ...state, collections: [...state.collections, action.payload] };
    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.id === action.payload.id ? action.payload : collection,
        ),
      };
    case "REMOVE_COLLECTION":
      return {
        ...state,
        collections: state.collections.filter(
          (collection) => collection.id !== action.payload,
        ),
      };
    case "ADD_TAG":
      return {
        ...state,
        tags: [...state.tags, action.payload],
      };
    case "REMOVE_TAG":
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.payload),
      };
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    default:
      return state;
  }
};

// Context provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with saved theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      dispatch({
        type: "SET_THEME",
        payload: prefersDark ? "dark" : "light",
      } as unknown as Action);
    }
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    localStorage.setItem("theme", state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Helper hook for loading data
export const useLoadData = () => {
  const { dispatch } = useAppContext();

  const loadUserAndStars = async () => {
    const token = getToken();
    if (!token) {
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const user = await getUserProfile();
      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "SET_SETTINGS", payload: getSettings() });

      const repositories = await fetchStarredRepositories();
      dispatch({ type: "SET_REPOSITORIES", payload: repositories });
      // console.log("repositories:", repositories);
      // Extract unique tags from repositories
      const uniqueTags = Array.from(
        new Set(repositories.flatMap((repo) => repo.topics)),
      );

      uniqueTags.forEach((tag) => {
        dispatch({ type: "ADD_TAG", payload: tag! });
      });

      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load data. Please try again.",
      });
      dispatch({ type: "SET_SETTINGS", payload: null });
      removeToken();
      removeSettings();
      removeLocalRepository();
      console.error("Error loading data:", error);
      debugger;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return { loadUserAndStars };
};
