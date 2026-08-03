import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationInfo({
  currentPage,
  itemsPerPage,
  totalItems,
  label = "productos",
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-sm text-gray-400">
        Mostrando <strong>{totalItems > 0 ? startIndex + 1 : 0}</strong> -{" "}
        <strong>{endIndex}</strong> de <strong>{totalItems}</strong> {label}
      </span>
    </div>
  );
}

export function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 border-t border-gray-100 pt-8 pb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 border border-transparent hover:border-gray-200"
      >
        <ChevronLeft size={24} />
      </button>

      <span className="text-sm font-medium text-gray-600">
        Página <span className="text-gray-900 font-bold">{currentPage}</span>{" "}
        de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700 border border-transparent hover:border-gray-200"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
