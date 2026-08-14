"use client";

import { useState } from "react";
import { Badge, Heading, Text } from "@/components/ui";
import { HelpCircle, ChevronDown } from "lucide-react";

const PREGUNTAS = [
  {
    categoria: "Compras",
    items: [
      {
        pregunta: "¿Cómo puedo hacer un pedido?",
        respuesta: "Navegá nuestro catálogo, agregá productos al carrito y completá el proceso de compra. Si ya tenés cuenta, tus precios preferenciales se aplican automáticamente.",
      },
      {
        pregunta: "¿Cuáles son las formas de pago?",
        respuesta: "Aceptamos transferencias bancarias, pagos en efectivo y cheques. Para más detalles, contactá a nuestro equipo de ventas.",
      },
      {
        pregunta: "¿Puedo pedir una cotización?",
        respuesta: "Sí, agregá los productos al carrito y solicitá una cotización en lugar de confirmar la compra. Te enviaremos el presupuesto por email.",
      },
    ],
  },
  {
    categoria: "Envíos",
    items: [
      {
        pregunta: "¿Hacen envíos al interior?",
        respuesta: "Sí, realizamos envíos a todo el territorio paraguayo a través de empresas de encomienda. El costo depende del destino y el peso del paquete.",
      },
      {
        pregunta: "¿Cuánto tarda un envío en Asunción?",
        respuesta: "Los pedidos confirmados antes de las 12:00 se despachan el mismo día. La entrega en Asunción y Gran Asunción es generalmente en 24 horas hábiles.",
      },
    ],
  },
  {
    categoria: "Cuenta y Precios",
    items: [
      {
        pregunta: "¿Cómo accedo a precios preferenciales?",
        respuesta: "Registrate con tus datos profesionales (RUC o cédula). Una vez verificada tu cuenta, se te asigna un nivel de precios según tu perfil de cliente.",
      },
      {
        pregunta: "¿Hay descuentos por volumen?",
        respuesta: "Sí, ofrecemos precios especiales para compras en cantidad. Consultá con tu asesor comercial para cotizaciones a medida.",
      },
      {
        pregunta: "¿Los precios incluyen IVA?",
        respuesta: "Los precios mostrados no incluyen IVA. El impuesto se calcula al momento de la facturación.",
      },
    ],
  },
  {
    categoria: "Productos",
    items: [
      {
        pregunta: "¿Todos los productos tienen garantía?",
        respuesta: "Los equipos e instrumentos cuentan con garantía del fabricante. Los insumos descartables no aplican para garantía por su naturaleza de uso único.",
      },
      {
        pregunta: "¿Puedo devolver un producto?",
        respuesta: "Aceptamos devoluciones dentro de los 7 días de la entrega, siempre que el producto esté sin uso y en su empaque original. Los insumos descartables no son retornables.",
      },
    ],
  },
];

function FaqItem({ pregunta, respuesta }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full text-left py-4 px-1 flex items-start justify-between gap-4 group"
      >
        <Text variant="bodySmBold" className="group-hover:text-dental-blue transition-colors">
          {pregunta}
        </Text>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-300 mt-0.5 ${
            abierto ? "rotate-180 text-dental-blue" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          abierto ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        <Text variant="bodySm" className="text-gray-600 px-1 leading-relaxed">
          {respuesta}
        </Text>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            <HelpCircle size={12} className="mr-1" /> Ayuda
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Preguntas Frecuentes
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Encontrá respuestas a las dudas más comunes sobre compras, envíos, cuenta y productos.
          </Text>
        </div>
      </section>

      {/* FAQ por categorías */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {PREGUNTAS.map((grupo) => (
            <div key={grupo.categoria} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 pt-5 pb-2">
                <Heading level={3} className="text-lg text-dental-blue">
                  {grupo.categoria}
                </Heading>
              </div>
              <div className="px-6 pb-2">
                {grupo.items.map((item, i) => (
                  <FaqItem key={i} pregunta={item.pregunta} respuesta={item.respuesta} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
