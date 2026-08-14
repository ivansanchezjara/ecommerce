"use client";

import { ShieldCheck, Truck, Star } from "lucide-react";
import { Badge, Heading, Text } from "@/components/ui";

/**
 * Configuración por defecto de los beneficios.
 */
const BENEFICIOS_DEFAULT = [
  {
    id: "calidad",
    icon: ShieldCheck,
    titulo: "Calidad Garantizada",
    descripcion: "Insumos odontológicos y médicos certificados bajo las más estrictas normas de bioseguridad.",
    colorScheme: "sky",
  },
  {
    id: "envios",
    icon: Truck,
    titulo: "Envíos Rápidos",
    descripcion: "Despacho ágil en Asunción y envíos a todo el territorio paraguayo para que tu clínica nunca se detenga.",
    colorScheme: "emerald",
  },
  {
    id: "soporte",
    icon: Star,
    titulo: "Soporte Técnico Especializado",
    descripcion: "Asesoramiento personalizado de profesionales para ayudarte a elegir el equipamiento ideal.",
    colorScheme: "amber",
  },
];

/**
 * Mapeo de color schemes a clases de Tailwind.
 */
const COLOR_CLASSES = {
  sky: {
    card: "from-sky-50/40 to-sky-50/10 border-sky-100/50 hover:shadow-sky-50/30",
    circle: "bg-sky-50 border-sky-100 text-dental-blue",
  },
  emerald: {
    card: "from-emerald-50/40 to-emerald-50/10 border-emerald-100/50 hover:shadow-emerald-50/30",
    circle: "bg-emerald-50 border-emerald-100 text-emerald-600",
  },
  amber: {
    card: "from-amber-50/40 to-amber-50/10 border-amber-100/50 hover:shadow-amber-50/30",
    circle: "bg-amber-50 border-amber-100 text-amber-600",
  },
};

/**
 * Sección de beneficios reutilizable.
 *
 * @param {string} [badgeText="¿Por qué elegirnos?"] - Texto del badge
 * @param {string} [titulo="Servicio y Compromiso Profesional"] - Título principal
 * @param {Array} [beneficios] - Array personalizado de beneficios { id, icon, titulo, descripcion, colorScheme }
 * @param {string} [className] - Clases adicionales para el section wrapper
 */
export default function BeneficiosSection({
  badgeText = "¿Por qué elegirnos?",
  titulo = "Servicio y Compromiso Profesional",
  beneficios = BENEFICIOS_DEFAULT,
  className = "",
}) {
  return (
    <section className={`py-16 bg-white border-b border-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="info" className="mb-3">{badgeText}</Badge>
          <Heading level={2} className="text-2xl md:text-3xl mt-1">{titulo}</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beneficios.map((beneficio) => {
            const Icon = beneficio.icon;
            const colors = COLOR_CLASSES[beneficio.colorScheme] || COLOR_CLASSES.sky;

            return (
              <div
                key={beneficio.id}
                className={`flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b ${colors.card} border transition-all hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-full ${colors.circle} border flex items-center justify-center shadow-sm`}>
                  <Icon size={28} />
                </div>
                <div>
                  <Heading level={3} className="text-lg">{beneficio.titulo}</Heading>
                  <Text variant="bodySm" className="max-w-[240px] mx-auto mt-2 leading-relaxed">
                    {beneficio.descripcion}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
