"use client";
import { useCart } from "@/app/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Heading, Text, EmptyState } from "@/components/ui";

export default function SideCart() {
  const router = useRouter();
  const {
    isCartOpen,
    closeCart,
    cart,
    cartCount,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [shouldRender, setShouldRender] = useState(isCartOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Panel lateral */}
      <div
        className={`relative w-[85%] sm:max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex flex-col items-start text-left">
            <Heading level={3} className="text-xl leading-tight">
              Mi Pedido
            </Heading>
            <Text variant="label" className="mt-0.5 text-gray-400">
              {cartCount}{" "}
              {cartCount === 1 ? "Producto seleccionado" : "Productos seleccionados"}
            </Text>
          </div>
          <Button
            variant="ghost"
            size="icon"
            icon={X}
            onClick={closeCart}
            className="text-gray-400 hover:text-red-500 rounded-full shrink-0"
            aria-label="Cerrar carrito"
          />
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={48} strokeWidth={1} />}
              titulo="No hay productos aún"
              descripcion="Agregá productos desde el catálogo para armar tu pedido."
              inline
            />
          ) : (
            cart.map((item) => {
              const uniqueKey = item.variante_id || item.product_code;
              const imageUrl = item.imagen_url;

              return (
                <div key={uniqueKey} className="flex gap-4 border-b border-gray-50 pb-6 group">
                  {/* Imagen */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.nombre}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        Sin img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between items-start text-left">
                    <div className="w-full text-left">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="group/title"
                      >
                        <Text
                          as="h4"
                          variant="bodySmBold"
                          className="leading-tight mb-1 line-clamp-2 group-hover/title:text-red-600 transition-colors duration-200"
                        >
                          {item.nombre}
                        </Text>
                      </Link>
                      <Text variant="mono" className="italic">
                        {item.product_code}
                      </Text>
                    </div>

                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          icon={Minus}
                          onClick={() => decreaseQuantity(uniqueKey)}
                          className="p-1 text-gray-500 hover:text-red-500 hover:bg-transparent border-none"
                        />
                        <Text as="span" variant="bodyXsBold" className="w-8 text-center text-gray-900">
                          {item.quantity}
                        </Text>
                        <Button
                          variant="ghost"
                          size="icon"
                          icon={Plus}
                          onClick={() => addToCart(item)}
                          className="p-1 text-gray-500 hover:text-gray-900 hover:bg-transparent border-none"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        icon={Trash2}
                        onClick={() => removeFromCart(uniqueKey)}
                        className="text-gray-300 hover:text-red-500 hover:bg-transparent border-none"
                        aria-label="Eliminar producto"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          <Button
            disabled={cart.length === 0}
            onClick={() => { closeCart(); router.push("/checkout"); }}
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full rounded-full py-5 shadow-xl bg-gray-900 hover:bg-gray-800 border-none"
          >
            Solicitar Presupuesto
          </Button>
          <Text variant="label" className="text-center mt-4 text-gray-400">
            Respuesta rápida por WhatsApp
          </Text>
        </div>
      </div>
    </div>
  );
}
