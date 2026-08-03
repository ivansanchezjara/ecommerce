"use client";

import Image from "next/image";
import { ShoppingCart, Check, ListFilter, Lock } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import { useState } from "react";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { formatearPrecio } = useTienda();
  const [added, setAdded] = useState(false);

  const hasVariants = product.variantes_count > 1;
  const imageUrl = product.imagen_principal_url || "/placeholder-product.png";

  const handleAdd = (e) => {
    if (hasVariants) return;
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      variante_id: product.first_variante_id,
      product_code: product.product_code || product.slug,
      nombre: product.nombre_general,
      imagen_url: imageUrl,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden shrink-0">
        {product.featured && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-full z-20 shadow-sm">
            Destacado
          </span>
        )}
        {imageUrl.startsWith("http") ? (
          <img
            src={imageUrl}
            alt={product.nombre_general}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="p-3 flex flex-col grow text-left">
        <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mb-1 truncate">
          {product.categoria_nombre || product.brand || "General"}
        </span>

        <h3 className="text-sm font-medium text-gray-900 mb-2 leading-tight group-hover:underline underline-offset-2 transition-all line-clamp-3 min-h-[2.5em]">
          {product.nombre_general}
        </h3>

        <div className="mt-auto flex flex-col gap-2">
          {/* Precio */}
          <div className="flex justify-between items-end border-t border-gray-50 pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 uppercase font-medium">
                Precio
              </span>
              {isLoggedIn && product.precio_desde ? (
                <span className="text-sm font-bold text-gray-800 leading-none">
                  Desde {formatearPrecio(product.precio_desde)}
                </span>
              ) : isLoggedIn ? (
                <span className="text-sm font-bold text-gray-800 leading-none">
                  Consultar
                </span>
              ) : (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Lock size={10} />
                  Ingresar para ver
                </span>
              )}
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleAdd}
            className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              hasVariants
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : added
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            {hasVariants ? (
              <>
                <ListFilter size={14} />
                Ver opciones
              </>
            ) : added ? (
              <>
                <Check size={14} />
                ¡Agregado!
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
