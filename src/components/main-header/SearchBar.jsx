"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui";

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
      {/* Ícono búsqueda */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-200 pointer-events-none" />

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="¿Qué estás buscando?"
        className="w-full bg-gray-100 border border-transparent rounded-full pl-10 pr-9 py-2 text-sm font-medium text-gray-700 placeholder:text-gray-500 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 focus:shadow-sm outline-none"
      />

      {/* Botón limpiar */}
      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          icon={X}
          onClick={() => setSearchQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 border-none"
          aria-label="Limpiar búsqueda"
        />
      )}
    </form>
  );
}
