"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/services/tienda";
import { Badge, Heading, Text, ProductsCarousel } from "@/components/ui";
import { BeneficiosSection, CtaProfesionales } from "@/components/secciones";
import { GraduationCap, BookOpen, ShieldCheck, Package } from "lucide-react";

const BENEFICIOS_ESTUDIANTES = [
  {
    id: "kits",
    icon: Package,
    titulo: "Kits Completos",
    descripcion: "Kits armados con todo lo que necesitás para tus prácticas clínicas, listos para usar.",
    colorScheme: "sky",
  },
  {
    id: "calidad",
    icon: ShieldCheck,
    titulo: "Calidad Profesional",
    descripcion: "Los mismos productos que usan los profesionales, accesibles para estudiantes.",
    colorScheme: "emerald",
  },
  {
    id: "asesoria",
    icon: BookOpen,
    titulo: "Asesoría Personalizada",
    descripcion: "Te ayudamos a elegir exactamente lo que necesitás según tu año y especialidad.",
    colorScheme: "amber",
  },
];

export default function EstudiantesPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstudiantes() {
      try {
        const data = await getProductos({ tag: "estudiantes" });
        setProductos(data.results || data);
      } catch (err) {
        console.error("Error cargando productos estudiantes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEstudiantes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-dental-blue via-blue-600 to-indigo-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <Badge variant="info" className="mb-4 bg-white/10 text-white border-white/20">
            <GraduationCap size={14} className="mr-1.5" /> Para Estudiantes
          </Badge>
          <Heading level={1} className="text-3xl md:text-5xl text-white">
            Equipate para tu Carrera
          </Heading>
          <Text variant="body" className="text-blue-100 mt-4 max-w-2xl mx-auto text-lg">
            Kits estudiantiles, instrumentos y materiales seleccionados para estudiantes de odontología y carreras médicas. Todo lo que necesitás en un solo lugar.
          </Text>
        </div>
      </section>

      {/* Beneficios */}
      <BeneficiosSection
        badgeText="Pensado para vos"
        titulo="¿Por qué comprar acá?"
        beneficios={BENEFICIOS_ESTUDIANTES}
      />

      {/* Productos */}
      {!loading && productos.length > 0 && (
        <section className="bg-white py-12 border-b border-gray-50">
          <div className="max-w-7xl mx-auto">
            <ProductsCarousel products={productos} title="Kits y Productos para Estudiantes" />
          </div>
        </section>
      )}

      {loading && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <CtaProfesionales
        badgeText="Descuentos Estudiantiles"
        titulo="¿Sos estudiante de odontología?"
        descripcion="Contactanos con tu cédula estudiantil para acceder a precios especiales y kits armados según tu año de carrera."
        ctaText="Contactar por WhatsApp"
        ctaHref="/atencion"
        secondaryHref="/products"
        secondaryText="Ver todo el catálogo"
      />
    </div>
  );
}
