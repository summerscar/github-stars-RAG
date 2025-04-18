import { githubLogin } from "@/services/github-login";
import { Github as GitHub, Menu, Moon, Sun } from "lucide-react";
import React from "react";
import { useAppContext } from "../context/AppContext";
import Button from "./ui/Button";

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const handleLogin = () => {
    // In a real app, this would redirect to GitHub OAuth
    githubLogin();
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 backdrop-blur bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <GitHub className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            StarManager
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {state.user ? (
            <div className="flex items-center">
              <img
                src={state.user.avatar_url}
                alt={state.user.login}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {state.user.name}
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleLogin}
              icon={<GitHub size={16} />}
            >
              Sign in with GitHub
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="border-2 dark:border-red-500"
            aria-label="Toggle theme"
          >
            {state.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-2">
            {state.user ? (
              <div className="flex items-center py-2">
                <img
                  src={state.user.avatar_url}
                  alt={state.user.login}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {state.user.name}
                </span>
              </div>
            ) : (
              <Button
                className="w-full"
                variant="primary"
                onClick={handleLogin}
                icon={<GitHub size={16} />}
              >
                Sign in with GitHub
              </Button>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={toggleTheme}
              icon={
                state.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
              }
            >
              {state.theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
