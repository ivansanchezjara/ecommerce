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
import { Heading, Text, Button, Badge, Input, EmptyState } from "@/components/ui";

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
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <EmptyState
          icon="🛒"
          titulo="Tu pedido está vacío"
          descripcion="Agrega productos desde nuestro catálogo para armar tu pedido."
          onAction={() => window.location.href = "/products"}
          textoBoton="Explorar Productos"
          inline
        />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Formulario */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex flex-col items-center text-center">
            <Button
              as={Link}
              href="/products"
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              className="mb-6 text-gray-400 hover:text-red-600"
            >
              Continuar viendo productos
            </Button>
            <Heading level={1} className="text-3xl md:text-4xl mb-4">
              Datos de Envío
            </Heading>
            <Text variant="body" className="max-w-md mx-auto">
              Ingresa tus datos para que un asesor te envíe el presupuesto formal.
            </Text>
          </div>

          <form id="checkout-form" onSubmit={handleWhatsApp} className="space-y-5">
            <Input
              required
              type="text"
              placeholder="Nombre y Apellido *"
              value={userData.name}
              icon={User}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="!py-4 !rounded-2xl"
            />

            <Input
              required
              type="text"
              placeholder="Ciudad / Localidad *"
              icon={MapPin}
              onChange={(e) => setUserData({ ...userData, city: e.target.value })}
              className="!py-4 !rounded-2xl"
            />

            <Input
              type="text"
              placeholder="Institución (Opcional)"
              icon={Building2}
              onChange={(e) => setUserData({ ...userData, institut: e.target.value })}
              className="!py-4 !rounded-2xl"
            />
          </form>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-5">
          <div className="flex justify-between items-center mb-8">
            <Heading level={3}>Tu Selección</Heading>
            <Badge variant="default" className="bg-gray-900 text-white">
              {cartCount} Ítems
            </Badge>
          </div>

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
                      <Text variant="bodySmBold" className="line-clamp-2 group-hover/item:text-red-600 transition-colors">
                        {item.nombre}
                      </Text>
                    </Link>
                    <Text variant="mono">
                      Cód: {item.product_code}
                    </Text>
                    <Text variant="bodyXsBold" className="mt-2 text-gray-900">
                      Cantidad: {item.quantity}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-dashed border-gray-200 text-left">
            <div className="flex justify-between items-center">
              <Text variant="muted" className="italic">Presupuesto:</Text>
              <Text variant="bodyBold" className="text-lg">A Consultar</Text>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <Button
              form="checkout-form"
              type="submit"
              variant="success"
              size="lg"
              icon={MessageCircle}
              className="w-full !bg-[#25D366] hover:!bg-[#1fae53] !py-4 !rounded-full shadow-lg"
            >
              Enviar pedido por WhatsApp
            </Button>
            <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <Text variant="mutedXs" className="uppercase tracking-tight text-left">
                Tu pedido será verificado por stock antes del cobro.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
