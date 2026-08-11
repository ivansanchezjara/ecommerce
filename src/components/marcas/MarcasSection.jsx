"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Button, Heading, Text } from "@/components/ui";

/**
 * Sección de marcas reutilizable.
 * Muestra un grid de logos con link a sus productos.
 *
 * @param {Array} marcas - Array de { id, nombre, slug, logo_url }
 */
export default function MarcasSection({ marcas = [] }) {
  if (marcas.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="primary" className="mb-2 bg-dental-blue-light text-dental-blue border-none">
            Marcas de confianza
          </Badge>
          <Heading level={2} className="text-2xl md:text-3xl mt-1">
            Trabajamos con las Mejores Marcas
          </Heading>
          <Text variant="bodySm" className="text-gray-500 mt-3 leading-relaxed">
            Productos odontológicos y médicos de marcas reconocidas a nivel mundial, garantizando calidad y respaldo profesional.
          </Text>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {marcas.map((marca) => (
            <Link
              key={marca.id}
              href={`/products?brand=${encodeURIComponent(marca.nombre)}`}
              className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 aspect-square"
            >
              {marca.logo_url ? (
                <img
                  src={marca.logo_url}
                  alt={marca.nombre}
                  className="w-full h-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <Text className="text-2xl font-black text-gray-300 group-hover:text-dental-blue transition-colors">
                  {marca.nombre.charAt(0)}
                </Text>
              )}
              <Text variant="mutedXs" className="mt-3 text-center font-medium text-gray-400 group-hover:text-gray-700 transition-colors truncate w-full">
                {marca.nombre}
              </Text>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            as={Link}
            href="/marcas"
            variant="ghost"
            size="sm"
            icon={ArrowUpRight}
            iconPosition="right"
            className="text-dental-blue hover:text-dental-blue-hover hover:bg-transparent border-none"
          >
            Ver todas las marcas
          </Button>
        </div>
      </div>
    </section>
  );
}
