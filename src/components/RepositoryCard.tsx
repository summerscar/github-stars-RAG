import {
  BookmarkIcon,
  BookOpenIcon,
  GitForkIcon,
  StarIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Repository } from "../types";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Card, { CardBody, CardFooter } from "./ui/Card";

interface RepositoryCardProps {
  repository: Repository;
  onAddToCollection: (repoId: number) => void;
  onAddTag: (repoId: number) => void;
  onViewDetails: (repo: Repository) => void;
  hightLight: boolean;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onAddTag,
  onViewDetails,
  hightLight,
}) => {
  const [isHovered] = useState(false);

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
    <Card
      className={`h-full flex flex-col transition-all duration-300 ${hightLight ? "shadow-lg shadow-amber-300" : ""}`}
      hoverable
    >
      <CardBody className="flex-grow">
        <div className="flex items-center mb-3">
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.avatar_url}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {repository.owner.login}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate">
          {repository.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {repository.description || "No description available."}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {repository.language && (
            <Badge color={getLanguageColor(repository.language)}>
              {repository.language}
            </Badge>
          )}

          {(repository.topics || []).map((tag) => (
            <Badge key={tag} color="gray" removable={false}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4">
          <div className="flex items-center">
            <StarIcon size={14} className="mr-1" />
            <span>{repository.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <GitForkIcon size={14} className="mr-1" />
            <span>{repository.forks_count.toLocaleString()}</span>
          </div>
          <div className="">
            <span>Updated {formatDate(repository.updated_at!)}</span>
          </div>
        </div>
      </CardBody>

      <CardFooter
        className={`border-t border-gray-200 dark:border-gray-700 flex justify-between transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-70"}`}
      >
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
          className="!hidden"
        >
          Add Tag
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;
