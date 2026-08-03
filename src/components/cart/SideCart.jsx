"use client";
import { useCart } from "@/app/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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
            <h2 className="font-bold text-xl text-gray-900 leading-tight">
              Mi Pedido
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              {cartCount}{" "}
              {cartCount === 1 ? "Producto seleccionado" : "Productos seleccionados"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-full transition-all shrink-0"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <ShoppingBag size={64} className="text-gray-100 mb-4" />
              <p className="text-gray-400 font-medium">No hay productos aún</p>
            </div>
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
                        <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2 text-left group-hover/title:text-red-600 transition-colors duration-200">
                          {item.nombre}
                        </h4>
                      </Link>
                      <p className="text-[10px] text-gray-400 font-mono text-left italic">
                        {item.product_code}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full mt-2">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <button
                          onClick={() => decreaseQuantity(uniqueKey)}
                          className="p-1 text-gray-500 hover:text-red-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 text-gray-500 hover:text-gray-900"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(uniqueKey)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          <button
            disabled={cart.length === 0}
            onClick={() => {
              closeCart();
              router.push("/checkout");
            }}
            className="w-full bg-gray-900 text-white py-5 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            Solicitar Presupuesto <ArrowRight size={20} />
          </button>
          <p className="text-[10px] text-center mt-4 text-gray-400 uppercase tracking-widest font-bold">
            Respuesta rápida por WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
