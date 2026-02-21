import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  searchQuery: "",
  setSearchQuery: () => {},
  clearSearch: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
