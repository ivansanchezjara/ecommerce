"use client";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import { useState } from "react";
import {
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  User,
  Building2,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartCount } = useCart();
  const { isLoggedIn, cliente } = useAuth();
  const { config } = useTienda();

  const [userData, setUserData] = useState({
    name: cliente?.razon_social || "",
    institut: "",
    city: "",
  });

  const whatsappNumber = config?.whatsapp?.replace(/[^0-9]/g, "") || "";

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!userData.name) return alert("Por favor, ingresa tu nombre.");

    let message = "🛒 *NUEVO PEDIDO*\n";
    message += "--------------------------\n";
    message += `👤 *Nombre:* ${userData.name}\n`;
    message += `📍 *Ciudad:* ${userData.city || "No especificada"}\n`;
    if (userData.institut) {
      message += `🏥 *Institución:* ${userData.institut}\n`;
    }
    message += "--------------------------\n\n";

    cart.forEach((item) => {
      message += `✅ *${item.nombre}*\n`;
      message += `   Cant: ${item.quantity} | Cód: ${item.product_code}\n\n`;
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tu pedido está vacío
        </h2>
        <Link
          href="/products"
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Formulario */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex flex-col items-center text-center">
            <Link
              href="/products"
              className="text-gray-400 hover:text-red-600 flex items-center gap-2 text-sm mb-6 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Continuar viendo productos
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Datos de Envío
            </h1>
            <p className="text-gray-500 font-light max-w-md mx-auto">
              Ingresa tus datos para que un asesor te envíe el presupuesto formal.
            </p>
          </div>

          <form id="checkout-form" onSubmit={handleWhatsApp} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                required
                type="text"
                placeholder="Nombre y Apellido *"
                value={userData.name}
                className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                required
                type="text"
                placeholder="Ciudad / Localidad *"
                className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="text"
                placeholder="Institución (Opcional)"
                className="w-full pl-12 p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                onChange={(e) => setUserData({ ...userData, institut: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-bold text-gray-900 mb-8 flex justify-between items-center">
            Tu Selección
            <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full">
              {cartCount} Ítems
            </span>
          </h2>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
            {cart.map((item) => {
              const uniqueKey = item.variante_id || item.product_code;
              return (
                <div key={uniqueKey} className="flex gap-4 items-center group">
                  <div className="relative h-20 w-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.nombre}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        Sin img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <Link href={`/products/${item.slug}`} className="group/item">
                      <h4 className="text-gray-900 font-bold leading-tight mb-1 line-clamp-2 group-hover/item:text-red-600 transition-colors">
                        {item.nombre}
                      </h4>
                    </Link>
                    <p className="text-[12px] text-gray-400 font-mono italic">
                      Cód: {item.product_code}
                    </p>
                    <div className="mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        Cantidad: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-dashed border-gray-200 text-left">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400 italic">Presupuesto:</span>
              <span className="text-gray-900 font-bold text-lg">A Consultar</span>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <button
              form="checkout-form"
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#1fae53] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <MessageCircle fill="currentColor" size={20} />
              <span className="text-base">Enviar pedido por WhatsApp</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <p className="text-[10px] text-gray-400 leading-tight font-medium uppercase tracking-tight text-left">
                Tu pedido será verificado por stock antes del cobro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
