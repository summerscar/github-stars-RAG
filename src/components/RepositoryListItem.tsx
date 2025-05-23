import {
  ActivityIcon,
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
    return new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
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
      <a
        href={repository.owner.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="contents"
      >
        <img
          src={repository.owner.avatar_url}
          alt={repository.owner.login}
          className="w-10 h-10 rounded-full"
          loading="lazy"
        />
      </a>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repository.name}
            </a>
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <a
              href={repository.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repository.owner.login}
            </a>
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
            <Badge key={tag} color="gray" removable={false}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <StarIcon size={14} className="mr-1" />
            <span>{repository.stargazers_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center">
            <GitForkIcon size={14} className="mr-1" />
            <span>{repository.forks_count.toLocaleString()}</span>
          </div>

          <div className="flex items-center">
            <ActivityIcon size={14} className="mr-1" />
            {formatDate(repository.updated_at!)}
          </div>
        </div>
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
          className="!hidden"
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
