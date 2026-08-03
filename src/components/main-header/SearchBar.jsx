"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 relative group">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="¿Qué estás buscando?"
        className="peer w-full bg-gray-100 border border-transparent rounded-full pl-10 pr-4 py-2 text-sm transition-all duration-300 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:shadow-sm outline-none"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200 peer-focus:text-gray-900" />
      <button type="submit" className="hidden">
        Buscar
      </button>
    </form>
  );
}
