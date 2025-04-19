import { searchRAG } from "@/services/search-rag";
import type { RAGResponse } from "@/types";
import { useMemoizedFn, useThrottleFn } from "ahooks";
import {
  ArrowLeftRightIcon,
  BookmarkIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface SidebarProps {
  onFilterChange: (
    filters: Partial<{
      search: string;
      tags: string[];
      language: string;
      ragResults: RAGResponse;
    }>,
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);

  const isComposingRef = React.useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Extract unique languages from repositories
  const languages = Array.from(
    new Set(state.repositories.map((repo) => repo.language).filter(Boolean)),
  ).sort();

  const { run: throttledRAGSearch } = useThrottleFn(
    async (query: string) => {
      if (isComposingRef.current) return;
      console.log("search...", query);
      onFilterChange({
        search: query,
        tags: selectedTags,
        language: selectedLanguage,
      });

      if (!query) {
        onFilterChange({
          ragResults: [],
        });
        return;
      }
      try {
        setIsLoading(true);
        const result = await searchRAG(query);
        onFilterChange({
          ragResults: result,
        });
      } catch (error) {
        console.error("Error fetching RAG data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    {
      wait: 500,
      leading: false,
      trailing: true,
    },
  );

  const handleTagToggle = useMemoizedFn((tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    onFilterChange({
      search: searchTerm,
      tags: newTags,
      language: selectedLanguage,
    });
  });

  const handleLanguageSelect = (language: string) => {
    const newLanguage = selectedLanguage === language ? "" : language;
    setSelectedLanguage(newLanguage);
    onFilterChange({
      search: searchTerm,
      tags: selectedTags,
      language: newLanguage,
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} transition-width duration-300 ease-in-out h-screen sticky top-16 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 pt-4 flex flex-col max-h-full`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-1 top-6 transform translate-x-1/2 bg-white dark:bg-gray-800 border rounded p-1 shadow-sm"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ArrowLeftRightIcon size={16} />
      </Button>

      <div className={`px-4 ${isOpen ? "block" : "hidden"}`}>
        <Input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => {
            const query = e.target.value.trim();
            setSearchTerm(query);
            throttledRAGSearch(query);
          }}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          icon={
            isLoading ? (
              <SparklesIcon
                size={16}
                className="text-amber-300 animate-pulse"
              />
            ) : (
              <SearchIcon size={16} className="text-gray-500" />
            )
          }
        />
      </div>

      <div className={`mt-6 ${isOpen ? "px-4" : "px-2"} flex-1 overflow-auto`}>
        {isOpen ? (
          <>
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Badge
                    key={language}
                    color={selectedLanguage === language ? "blue" : "gray"}
                    onClick={() => handleLanguageSelect(language as string)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
            <Topics
              tags={state.tags}
              selectedTags={selectedTags}
              handleTagToggle={handleTagToggle}
            />
            <div className="mb-6 hidden">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Collections
              </h3>
              <div className="space-y-1">
                {state.collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: collection.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {collection.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-500">
                      {collection.repositoryIds.length}
                    </span>
                  </div>
                ))}
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <PlusIcon size={16} className="mr-2" />
                  <span>Create collection</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <Button variant="ghost" aria-label="Search">
              <SearchIcon size={20} />
            </Button>
            <Button variant="ghost" aria-label="Tags">
              <TagIcon size={20} />
            </Button>
            <Button variant="ghost" aria-label="Collections">
              <FolderIcon size={20} />
            </Button>
            <Button variant="ghost" aria-label="Bookmarks">
              <BookmarkIcon size={20} />
            </Button>
          </div>
        )}
      </div>

      <div
        className={`border-t border-gray-200 dark:border-gray-800 p-4 ${isOpen ? "" : "flex justify-center"}`}
      >
        <Button
          variant="ghost"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          icon={<SettingsIcon size={isOpen ? 16 : 20} />}
        >
          {isOpen ? "Settings" : ""}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

const Topics = React.memo(
  ({
    tags,
    selectedTags,
    handleTagToggle,
  }: {
    tags: string[];
    selectedTags: string[];
    handleTagToggle: (tag: string) => void;
  }) => {
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              color={selectedTags.includes(tag) ? "blue" : "gray"}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
          <Badge
            color="gray"
            className="!hidden border border-dashed border-gray-300 dark:border-gray-600 bg-transparent"
          >
            <PlusIcon size={10} className="mr-1" />
            Add
          </Badge>
        </div>
      </div>
    );
  },
);
