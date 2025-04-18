import { useDeferredValue, useState } from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AppProvider } from "./context/AppContext";
import { RAGResponse } from "./types";

function App() {
  const [filters, setFilters] = useState({
    search: "",
    tags: [] as string[],
    language: "",
    ragResults: [] as RAGResponse,
  });
  const deferredFilters = useDeferredValue(filters);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((filters) => ({ ...filters, ...newFilters }));
  };

  return (
    <AppProvider>
      <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-auto">
          <Sidebar onFilterChange={handleFilterChange} />
          <main className="flex-1 overflow-auto">
            <Dashboard filters={deferredFilters} />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
