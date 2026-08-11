"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getMarcas } from "@/services/tienda";
import { Badge, Button, Heading, Text } from "@/components/ui";

export default function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarcas() {
      try {
        const data = await getMarcas();
        setMarcas(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error cargando marcas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMarcas();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-dental-blue transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            Nuestros socios
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Marcas con las que Trabajamos
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl leading-relaxed">
            Distribuimos productos odontológicos y médicos de marcas líderes a nivel mundial.
            Cada marca es seleccionada por su calidad, innovación y respaldo profesional.
          </Text>
        </div>
      </section>

      {/* Grid de marcas */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : marcas.length === 0 ? (
            <div className="text-center py-16">
              <Text className="text-gray-400 text-lg">No hay marcas disponibles aún.</Text>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {marcas.map((marca) => (
                <Link
                  key={marca.id}
                  href={`/products?brand=${encodeURIComponent(marca.nombre)}`}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-white hover:border-dental-blue/30 hover:shadow-xl hover:shadow-dental-blue/5 transition-all duration-300 aspect-square"
                >
                  {marca.logo_url ? (
                    <img
                      src={marca.logo_url}
                      alt={marca.nombre}
                      className="w-full h-20 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <Text className="text-3xl font-black text-gray-300 group-hover:text-dental-blue transition-colors">
                        {marca.nombre.charAt(0)}
                      </Text>
                    </div>
                  )}
                  <Text className="mt-4 text-sm font-semibold text-gray-500 group-hover:text-gray-800 transition-colors text-center">
                    {marca.nombre}
                  </Text>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <Heading level={3} className="text-xl">
            ¿Buscás un producto específico?
          </Heading>
          <Text variant="bodySm" className="text-gray-500">
            Explorá nuestro catálogo completo con productos de todas nuestras marcas.
          </Text>
          <Button
            as={Link}
            href="/products"
            variant="primary"
            size="md"
            className="rounded-full bg-dental-blue hover:bg-dental-blue-hover border-none shadow-lg"
          >
            Ver catálogo completo
          </Button>
        </div>
      </section>
    </div>
  );
}
