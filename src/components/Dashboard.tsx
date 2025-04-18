import { githubLogin } from "@/services/github-login";
import { useDebounceFn } from "ahooks";
import {
  GithubIcon,
  LayoutGridIcon,
  ListIcon,
  RefreshCwIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppContext, useLoadData } from "../context/AppContext";
import { RAGResponse, Repository } from "../types";
import RepositoryGrid from "./RepositoryGrid";
import Button from "./ui/Button";

interface DashboardProps {
  filters: {
    search: string;
    tags: string[];
    language: string;
    ragResults: RAGResponse;
  };
}

const mapRagResultsToRepoNames = (ragResults: RAGResponse) => {
  return ragResults.map(
    (item) => item.filename.split("/").pop()!.split(".md")[0],
  );
};

const Dashboard: React.FC<DashboardProps> = ({ filters }) => {
  const { state } = useAppContext();
  const { loadUserAndStars } = useLoadData();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);

  const { run: loadData } = useDebounceFn(
    () => {
      loadUserAndStars();
    },
    { wait: 100 },
  );

  useEffect(() => {
    // Load data on initial render
    const accessToken = new URLSearchParams(window.location.search).get(
      "access_token",
    );
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    history.replaceState(null, "", "/");

    loadData();
  }, []);

  useEffect(() => {
    // Apply filters when repositories or filters change
    let result = [...state.repositories];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (repo) =>
          repo.owner.login.toLowerCase().includes(searchLower) ||
          repo.name.toLowerCase().includes(searchLower) ||
          repo.description?.toLowerCase().includes(searchLower),
      );

      if (filters.ragResults.length) {
        const repoNames = mapRagResultsToRepoNames(filters.ragResults);
        result = [
          ...new Set([
            ...state.repositories.filter((repo) =>
              repoNames.includes(repo.name),
            ),
            ...result,
          ]),
        ];
      }
    }

    if (filters.tags.length > 0) {
      result = result.filter((repo) =>
        filters.tags.some((tag) => repo.topics?.includes(tag)),
      );
    }

    if (filters.language) {
      result = result.filter((repo) => repo.language === filters.language);
    }

    setFilteredRepos(result);
  }, [state.repositories, filters]);

  const handleAddToCollection = (repoId: number) => {
    alert(
      `Add to collection functionality would be implemented here for repo ID: ${repoId}`,
    );
  };

  const handleAddTag = (repoId: number) => {
    alert(
      `Add tag functionality would be implemented here for repo ID: ${repoId}`,
    );
  };

  const handleViewDetails = (repo: Repository) => {
    window.open(
      repo.html_url,
      "_blank",
      "width=500,height=700,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes",
    );
  };

  if (state.isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading your stars...
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Error loading data
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
          {state.error}
        </p>
        <Button
          variant="primary"
          onClick={() => loadUserAndStars()}
          icon={<RefreshCwIcon size={16} />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <GithubIcon
          size={48}
          className="text-gray-400 dark:text-gray-600 mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Your GitHub Stars
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Sign in with GitHub to organize your starred repositories into
          collections, add custom tags, and never lose track of useful projects
          again.
        </p>
        <Button
          variant="primary"
          icon={<GithubIcon size={16} />}
          onClick={() => githubLogin()}
        >
          Sign in with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Starred Repositories
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredRepos.length} repositories found
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            icon={<LayoutGridIcon size={16} />}
            aria-label="Grid view"
          />
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            icon={<ListIcon size={16} />}
            aria-label="List view"
          />
        </div>
      </div>

      <RepositoryGrid
        ragRepoNames={mapRagResultsToRepoNames(filters.ragResults)}
        repositories={filteredRepos}
        onAddToCollection={handleAddToCollection}
        onAddTag={handleAddTag}
        onViewDetails={handleViewDetails}
        viewMode={viewMode}
      />
    </div>
  );
};

export default React.memo(Dashboard);
