"use client";

import Link from "next/link";
import {
  Wrench,
  Stethoscope,
  Layers,
  Sparkles,
  HeartPulse,
  Activity,
  Package,
  Smile,
  ArrowUpRight,
} from "lucide-react";
import { Badge, Button, Heading, Text } from "@/components/ui";

/**
 * Helper para mapear ícono según nombre de categoría.
 */
function getCategoryIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("equip")) return <Wrench className="w-6 h-6" />;
  if (n.includes("instrument")) return <Stethoscope className="w-6 h-6" />;
  if (n.includes("descart") || n.includes("desech") || n.includes("insum")) return <Layers className="w-6 h-6" />;
  if (n.includes("ortodon")) return <Smile className="w-6 h-6" />;
  if (n.includes("estet") || n.includes("blanquea")) return <Sparkles className="w-6 h-6" />;
  if (n.includes("cirug") || n.includes("implante")) return <HeartPulse className="w-6 h-6" />;
  if (n.includes("diagnos") || n.includes("radiograf")) return <Activity className="w-6 h-6" />;
  return <Package className="w-6 h-6" />;
}

/**
 * Sección de categorías reutilizable.
 *
 * @param {Array} categorias - Array de { id, nombre, cantidad_productos }
 * @param {string} [badgeText="Explorar por rubro"] - Texto del badge superior
 * @param {string} [titulo="Categorías Destacadas"] - Título de la sección
 * @param {string} [linkHref="/products"] - URL del botón "Ver todas"
 * @param {string} [linkText="Ver todas las categorías"] - Texto del botón
 * @param {string} [className] - Clases adicionales para el section wrapper
 */
export default function CategoriasSection({
  categorias = [],
  badgeText = "Explorar por rubro",
  titulo = "Categorías Destacadas",
  linkHref = "/products",
  linkText = "Ver todas las categorías",
  className = "",
}) {
  if (categorias.length === 0) return null;

  return (
    <section className={`py-12 bg-white border-b border-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="primary" className="mb-2 bg-dental-blue-light text-dental-blue border-none">
              {badgeText}
            </Badge>
            <Heading level={2} className="text-2xl md:text-3xl mt-1">
              {titulo}
            </Heading>
          </div>
          <Button
            as={Link}
            href={linkHref}
            variant="ghost"
            size="sm"
            icon={ArrowUpRight}
            iconPosition="right"
            className="text-dental-blue hover:text-dental-blue-hover hover:bg-transparent border-none"
          >
            {linkText}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoria=${cat.id}`}
              className="group p-5 bg-dental-blue-light/30 hover:bg-white border border-gray-100 hover:border-dental-blue/30 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[160px] hover:shadow-lg hover:shadow-dental-blue/5 active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-dental-blue-light text-dental-blue flex items-center justify-center group-hover:bg-dental-blue group-hover:text-white transition-colors duration-300 shadow-inner">
                {getCategoryIcon(cat.nombre)}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <Text as="h3" variant="bodySmBold" className="group-hover:text-dental-blue transition-colors line-clamp-2">
                  {cat.nombre}
                </Text>
                {cat.cantidad_productos > 0 && (
                  <Text variant="mutedXs" className="mt-1 bg-dental-blue-light/50 group-hover:bg-dental-blue-light px-2 py-0.5 rounded-full transition-colors">
                    {cat.cantidad_productos} {cat.cantidad_productos === 1 ? "producto" : "productos"}
                  </Text>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
