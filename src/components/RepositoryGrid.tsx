import React from "react";
import { Repository } from "../types";
import RepositoryCard from "./RepositoryCard";
import RepositoryListItem from "./RepositoryListItem";

interface RepositoryGridProps {
  repositories: Repository[];
  onAddToCollection: (repoId: number) => void;
  onAddTag: (repoId: number) => void;
  onViewDetails: (repo: Repository) => void;
  viewMode: "grid" | "list";
  ragRepoNames: string[];
}

const RepositoryGrid: React.FC<RepositoryGridProps> = ({
  ragRepoNames,
  repositories,
  onAddToCollection,
  onAddTag,
  onViewDetails,
  viewMode,
}) => {
  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
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
            className="text-gray-500 dark:text-gray-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No repositories found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Star some repositories on GitHub or adjust your search filters to see
          repositories here.
        </p>
      </div>
    );
  }

  return viewMode === "grid" ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {repositories.map((repository) => (
        <RepositoryCard
          hightLight={ragRepoNames.includes(repository.full_name)}
          key={repository.id}
          repository={repository}
          onAddToCollection={onAddToCollection}
          onAddTag={onAddTag}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  ) : (
    <div className="space-y-2">
      {repositories.map((repository) => (
        <RepositoryListItem
          key={repository.id}
          hightLight={ragRepoNames.includes(repository.full_name)}
          repository={repository}
          onAddToCollection={onAddToCollection}
          onAddTag={onAddTag}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default RepositoryGrid;
