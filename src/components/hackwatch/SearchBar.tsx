import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input placeholder="Search IP or domain (e.g., 8.8.8.8 or example.com)" value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button variant="hero" type="submit">Check</Button>
    </form>
  );
};

export default SearchBar;
