"use client";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { Button, Heading, Text } from "@/components/ui";

export default function ProductsFilters({ filterGroups, clearAll }) {
  const [isOpen, setIsOpen] = useState(() =>
    filterGroups.some((g) => g.active && g.active !== "Todos")
  );

  return (
    <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
      <Button
        variant="outline"
        size="sm"
        icon={Filter}
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4"
      >
        {isOpen ? "Ocultar" : "Filtrar"}
      </Button>

      {isOpen && (
        <aside className="w-full flex flex-col gap-6 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
          <div className="flex items-center justify-between">
            <Heading level={4}>Filtros</Heading>
            {clearAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 hover:bg-transparent border-none p-0 underline"
              >
                Borrar todo
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {filterGroups.map((group, index) => (
              <FilterGroup key={index} group={group} />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

function FilterGroup({ group }) {
  const [isOpen, setIsOpen] = useState(group.active && group.active !== "Todos");

  if (!group.options || group.options.length <= 1) return null;

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 group"
      >
        <Text variant="bodyXsBold" className="uppercase tracking-wider text-gray-700 group-hover:text-gray-900 transition-colors">
          {group.title}
        </Text>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 mt-2">
          {group.options.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group/item">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  group.active === option
                    ? "border-gray-900 bg-gray-900"
                    : "border-gray-300 bg-white group-hover/item:border-gray-500"
                }`}
                onClick={() => group.setActive(option)}
              >
                {group.active === option && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </div>
              <Text
                as="span"
                variant={group.active === option ? "bodySmBold" : "bodySm"}
                className={`${
                  group.active === option
                    ? "text-gray-900"
                    : "text-gray-600 group-hover/item:text-gray-900"
                }`}
                onClick={() => group.setActive(option)}
              >
                {option}
              </Text>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
