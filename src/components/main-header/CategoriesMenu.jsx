"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { getCategorias } from "@/services/tienda";
import { Text, Badge } from "@/components/ui";

export default function CategoriesMenu({ mobile = false, onItemClick, dark = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const menuRef = useRef(null);

  // Cargar categorías del API
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await getCategorias();
        setCategorias(data.results || data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    }
    fetchCategorias();
  }, []);

  // Cerrar al hacer click fuera (Desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!mobile) setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  // --- CONTENIDO DEL MENÚ ---
  const MenuList = () => (
    <div className="flex flex-col w-full bg-white text-left select-none">
      {/* Ver todos los productos */}
      <div className="border-b border-gray-100">
        <Link
          href="/products"
          onClick={handleLinkClick}
          className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Package size={18} className="text-gray-400" />
            <Text variant="bodySm" className="text-gray-600 group-hover:text-gray-900 transition-colors">
              Ver todos
            </Text>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900" />
        </Link>
      </div>

      {/* Categorías */}
      {categorias.map((cat) => (
        <div key={cat.id} className="border-b border-gray-100 last:border-0">
          <Link
            href={`/products?categoria=${cat.id}`}
            onClick={handleLinkClick}
            className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="text-gray-400" />
              <Text variant="bodySm" className="text-gray-600 group-hover:text-gray-900 transition-colors">
                {cat.nombre}
              </Text>
            </div>
            {cat.cantidad_productos > 0 && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0">
                {cat.cantidad_productos}
              </Badge>
            )}
          </Link>
        </div>
      ))}
    </div>
  );

  // --- RENDERIZADO MÓVIL ---
  if (mobile) {
    return (
      <div className="w-full select-none bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-4 rounded-2xl text-xl transition-colors flex items-center justify-between ${
            isOpen ? "bg-gray-50 text-gray-900 font-bold" : "text-gray-600 font-medium"
          }`}
        >
          <span>Productos</span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 border-l-2 border-gray-100 ml-4">
            <MenuList />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO DESKTOP ---
  return (
    <div className="relative h-full flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-1 h-full transition-colors font-medium cursor-pointer ${
          dark
            ? (isOpen ? "text-dental-yellow" : "text-white hover:text-dental-yellow")
            : (isOpen ? "text-gray-900" : "text-gray-600 hover:text-gray-900")
        }`}
      >
        <span>Productos</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        {isOpen && (
          <span className={`absolute bottom-[-13px] left-0 w-full h-0.5 rounded-full ${dark ? "bg-dental-yellow" : "bg-gray-900"}`} />
        )}
      </button>

      {/* Dropdown Flotante */}
      <div
        className={`absolute top-full left-0 mt-4 w-72 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 origin-top-left ${
          isOpen
            ? "opacity-100 scale-100 visible translate-y-2"
            : "opacity-0 scale-95 invisible translate-y-0"
        }`}
      >
        <div className="relative z-10 max-h-[500px] overflow-y-auto rounded-xl">
          <MenuList />
        </div>
      </div>
    </div>
  );
}
