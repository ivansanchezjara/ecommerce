"use client";

import { useTienda } from "@/app/context/TiendaContext";
import { ShieldCheck, Truck, Star, Award } from "lucide-react";

export default function AboutPage() {
  const { config } = useTienda();

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Nuestra Empresa";

  const pilares = [
    {
      icon: Award,
      title: "Calidad Certificada",
      text: "Trabajamos exclusivamente con productos certificados bajo normas internacionales de calidad.",
    },
    {
      icon: ShieldCheck,
      title: "Confianza",
      text: "Más de una década acompañando a profesionales con productos en los que pueden confiar.",
    },
    {
      icon: Truck,
      title: "Logística Eficiente",
      text: "Entrega rápida y segura a todo el país para que tu negocio no se detenga.",
    },
    {
      icon: Star,
      title: "Soporte Técnico",
      text: "Asesoramiento profesional personalizado para cada necesidad.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20 space-y-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Sobre {nombreEmpresa}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {config?.slogan || "Productos profesionales de alta calidad para elevar el estándar de tu práctica."}
        </p>
      </section>

      {/* Pilares */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Nuestros Pilares
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lo que nos diferencia y define nuestro compromiso con cada cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 p-3 bg-gray-50 rounded-2xl text-gray-700 inline-block">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filosofía */}
      <section className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Nuestra Filosofía
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
          Nacimos como respuesta a la necesidad de contar con productos confiables,
          bien diseñados y accesibles para el profesional moderno.
        </p>
        <blockquote className="relative py-4 px-6 max-w-xl mx-auto text-left">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500 rounded-full" />
          <p className="text-lg italic text-gray-700 font-medium pl-4">
            &ldquo;Nuestro objetivo es acompañar al profesional con herramientas
            en las que pueda confiar a largo plazo.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Contacto */}
      <section className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Querés trabajar con nosotros?
        </h3>
        <p className="text-gray-500 mb-6">
          Contáctanos para consultas, distribución o soporte técnico.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {config?.whatsapp && (
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition-all"
            >
              WhatsApp
            </a>
          )}
          {config?.email && (
            <a
              href={`mailto:${config.email}`}
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all"
            >
              Email
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
