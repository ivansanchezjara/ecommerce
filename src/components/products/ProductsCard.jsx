"use client";

import { ShoppingCart, Check, ListFilter, Lock } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import { useState } from "react";
import { Badge, Button, Text } from "@/components/ui";

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
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 flex flex-col h-full relative">
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-dental-blue-light">
        {product.featured && (
          <Badge variant="warning" className="absolute top-2 left-2 text-[8px] px-2 py-0.5 z-20 shadow-sm bg-dental-yellow text-dental-text border-none">
            Destacado
          </Badge>
        )}
        {imageUrl.startsWith("http") ? (
          <img
            src={imageUrl}
            alt={product.nombre_general}
            className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="p-3 flex flex-col grow text-left">
        <Text variant="label" className="text-dental-blue mb-1 truncate">
          {product.categoria_nombre || product.brand || "General"}
        </Text>

        <Text as="h3" variant="bodySmBold" className="mb-2 leading-tight group-hover:text-dental-blue transition-colors line-clamp-3 min-h-[2.5em]">
          {product.nombre_general}
        </Text>

        <div className="mt-auto flex flex-col gap-2">
          {/* Precio */}
          <div className="flex justify-between items-end border-t border-gray-50 pt-2">
            <div className="flex flex-col">
              <Text variant="label" className="text-gray-400">
                Precio
              </Text>
              {isLoggedIn && product.precio_desde ? (
                <Text variant="bodySmBold" className="text-dental-text leading-none">
                  Desde {formatearPrecio(product.precio_desde)}
                </Text>
              ) : isLoggedIn ? (
                <Text variant="bodySmBold" className="text-dental-text leading-none">
                  Consultar
                </Text>
              ) : (
                <Text variant="bodyXs" className="text-gray-500 flex items-center gap-1">
                  <Lock size={10} />
                  Ingresar para ver
                </Text>
              )}
            </div>
          </div>

          {/* Botón */}
          <Button
            onClick={handleAdd}
            variant={hasVariants ? "primary" : added ? "success" : "secondary"}
            size="sm"
            icon={hasVariants ? ListFilter : added ? Check : ShoppingCart}
            className={`w-full rounded-xl ${
              hasVariants
                ? "bg-dental-blue hover:bg-dental-blue-hover border-dental-blue"
                : added
                ? ""
                : "bg-dental-blue-light text-dental-blue border-dental-blue-light hover:bg-dental-blue hover:text-white hover:border-dental-blue"
            }`}
          >
            {hasVariants ? "Ver opciones" : added ? "¡Agregado!" : "Añadir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
