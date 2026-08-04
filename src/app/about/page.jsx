"use client";

import { useTienda } from "@/app/context/TiendaContext";
import { ShieldCheck, Truck, Star, Award, MessageCircle, Mail } from "lucide-react";
import { Heading, Text, Button, Badge } from "@/components/ui";

export default function AboutPage() {
  const { config } = useTienda();

  const nombreEmpresa =
    config?.nombre_fantasia || config?.nombre || "Nuestra Empresa";

  const pilares = [
    {
      icon: Award,
      title: "Calidad Certificada",
      text: "Trabajamos exclusivamente con productos certificados bajo normas internacionales de calidad.",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: ShieldCheck,
      title: "Confianza",
      text: "Más de una década acompañando a profesionales con productos en los que pueden confiar.",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: Truck,
      title: "Logística Eficiente",
      text: "Entrega rápida y segura a todo el país para que tu negocio no se detenga.",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: Star,
      title: "Soporte Técnico",
      text: "Asesoramiento profesional personalizado para cada necesidad.",
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20 space-y-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Quiénes somos</Badge>
        <Heading level={1} className="text-4xl md:text-5xl">
          Sobre {nombreEmpresa}
        </Heading>
        <Text variant="body" className="text-lg max-w-2xl mx-auto">
          {config?.slogan ||
            "Productos profesionales de alta calidad para elevar el estándar de tu práctica."}
        </Text>
      </section>

      {/* Pilares */}
      <section>
        <div className="text-center mb-10 space-y-3">
          <Heading level={2}>Nuestros Pilares</Heading>
          <Text variant="body" className="max-w-2xl mx-auto">
            Lo que nos diferencia y define nuestro compromiso con cada cliente.
          </Text>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`mb-4 p-3 rounded-2xl inline-flex items-center justify-center ${card.color}`}
                >
                  <Icon size={22} />
                </div>
                <Heading level={4} className="mb-2">
                  {card.title}
                </Heading>
                <Text variant="bodySm">{card.text}</Text>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filosofía */}
      <section className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center space-y-6">
        <Heading level={2}>Nuestra Filosofía</Heading>
        <Text variant="body" className="text-lg max-w-2xl mx-auto">
          Nacimos como respuesta a la necesidad de contar con productos
          confiables, bien diseñados y accesibles para el profesional moderno.
        </Text>
        <blockquote className="relative py-4 px-6 max-w-xl mx-auto text-left">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500 rounded-full" />
          <Text
            variant="bodyBold"
            as="p"
            className="text-lg italic pl-4"
          >
            &ldquo;Nuestro objetivo es acompañar al profesional con herramientas
            en las que pueda confiar a largo plazo.&rdquo;
          </Text>
        </blockquote>
      </section>

      {/* Contacto */}
      <section className="text-center space-y-6">
        <Heading level={3}>¿Querés trabajar con nosotros?</Heading>
        <Text variant="body">
          Contáctanos para consultas, distribución o soporte técnico.
        </Text>

        {/* Sucursales */}
        {config?.sucursales?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {config.sucursales.map((suc) => (
              <div
                key={suc.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <Heading level={4} className="mb-2">
                  {suc.nombre}
                </Heading>
                {suc.telefono && (
                  <Text variant="bodySm" className="mb-1">
                    📞 {suc.telefono}
                  </Text>
                )}
                {suc.direccion && (
                  <Text variant="muted">📍 {suc.direccion}</Text>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Email / contacto general */}
        {config?.email && (
          <Text variant="muted">✉️ {config.email}</Text>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {config?.whatsapp && (
            <Button
              as="a"
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
              size="lg"
              icon={MessageCircle}
            >
              WhatsApp
            </Button>
          )}
          {config?.email && (
            <Button
              as="a"
              href={`mailto:${config.email}`}
              variant="secondary"
              size="lg"
              icon={Mail}
            >
              Email
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
