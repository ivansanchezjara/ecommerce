"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getWishlist, eliminarWishlistItem } from "@/services/cuenta";
import { Button, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Heart,
  Trash2,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ExternalLink,
  Package,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useTienda } from "@/app/context/TiendaContext";

// ─── Tarjeta de item en wishlist ─────────────────────────────────────────────

function WishlistCard({ item, onRemove, onAddToCart }) {
  const { formatearPrecio } = useTienda();

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      {/* Imagen */}
      <Link
        href={`/products/${item.producto_slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
      >
        {item.producto_imagen_url ? (
          <Image
            src={item.producto_imagen_url}
            alt={item.producto_nombre}
            fill
            className="object-contain p-2"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={32} className="text-slate-300" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.producto_slug}`}
            className="hover:text-dental-blue transition-colors"
          >
            <Text variant="bodySmBold" className="text-slate-700 line-clamp-2">
              {item.producto_nombre}
            </Text>
          </Link>
          {item.producto_brand && (
            <Text variant="bodySm" className="text-slate-400 mt-0.5">
              {item.producto_brand}
            </Text>
          )}
          {item.variante_nombre && (
            <Badge className="mt-1.5 text-[10px]">
              {item.variante_nombre}
              {item.variante_code && ` • ${item.variante_code}`}
            </Badge>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mt-2 flex items-center gap-3">
          {item.tiene_stock ? (
            <Badge variant="success" className="text-[10px]">
              En stock
            </Badge>
          ) : (
            <Badge variant="danger" className="text-[10px]">
              Sin stock
            </Badge>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Quitar de favoritos"
        >
          <Trash2 size={16} />
        </button>

        <Button
          size="sm"
          icon={ShoppingCart}
          onClick={() => onAddToCart(item)}
          disabled={!item.tiene_stock}
          className="text-xs"
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      setLoading(true);
      const data = await getWishlist();
      setItems(data);
    } catch (err) {
      setError("Error al cargar tu lista de deseos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id) {
    try {
      await eliminarWishlistItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Error al quitar el producto.");
    }
  }

  function handleAddToCart(item) {
    addToCart({
      product_code: item.variante_code || item.producto_slug,
      variante_id: item.variante,
      nombre: item.producto_nombre,
      variante_nombre: item.variante_nombre,
      imagen_url: item.producto_imagen_url,
      slug: item.producto_slug,
    });
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-dental-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100">
              <Heart size={18} className="text-pink-500" />
            </div>
            <div>
              <Heading level={4} className="text-lg">
                Mi Lista de Deseos
              </Heading>
              <Text variant="bodySm" className="mt-0.5">
                {items.length === 0
                  ? "Guardá productos que te interesen para comprarlos después."
                  : `${items.length} producto${items.length !== 1 ? "s" : ""} guardado${items.length !== 1 ? "s" : ""}`}
              </Text>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-6 text-red-600">
            <AlertCircle size={18} />
            <Text variant="bodySm" className="font-bold text-red-600">
              {error}
            </Text>
          </div>
        )}

        {/* Lista vacía */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
              <Heart size={28} className="text-pink-300" />
            </div>
            <Heading level={5} className="text-slate-600">
              Tu lista está vacía
            </Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">
              Explorá nuestro catálogo y hacé clic en el corazón para guardar
              productos que te interesen.
            </Text>
            <Link href="/products">
              <Button variant="outline" className="mt-4" icon={ExternalLink}>
                Ver catálogo
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
