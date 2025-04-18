import {
  BookmarkIcon,
  BookOpenIcon,
  GitForkIcon,
  StarIcon,
} from "lucide-react";
import React from "react";
import { Repository } from "../types";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface RepositoryListItemProps {
  repository: Repository;
  onAddToCollection: (repoId: number) => void;
  onAddTag: (repoId: number) => void;
  onViewDetails: (repo: Repository) => void;
  hightLight: boolean;
}

const RepositoryListItem: React.FC<RepositoryListItemProps> = ({
  repository,
  onAddTag,
  onViewDetails,
  hightLight,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "yellow",
      TypeScript: "blue",
      Python: "green",
      Java: "red",
      Ruby: "red",
      PHP: "purple",
      "C#": "purple",
      "C++": "blue",
      CSS: "blue",
      HTML: "red",
      Go: "blue",
      Rust: "red",
    };

    return colors[language] || "gray";
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow ${hightLight ? "shadow-lg shadow-amber-300" : ""}`}
    >
      <img
        src={repository.owner.avatar_url}
        alt={repository.owner.login}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {repository.name}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {repository.owner.login}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {repository.description || "No description available."}
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {repository.language && (
            <Badge color={getLanguageColor(repository.language)}>
              {repository.language}
            </Badge>
          )}

          {repository.topics?.map((tag) => (
            <Badge key={tag} color="gray" removable>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <StarIcon size={14} className="mr-1" />
            <span>{repository.stargazers_count.toLocaleString()}</span>
          </div>
          stargazers_count
          <div className="flex items-center">
            <GitForkIcon size={14} className="mr-1" />
            <span>{repository.forks_count.toLocaleString()}</span>
          </div>
          forks_count
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>
        updated_at
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(repository)}
          icon={<BookOpenIcon size={16} />}
        >
          Details
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTag(repository.id)}
          icon={<BookmarkIcon size={16} />}
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
};

export default RepositoryListItem;
