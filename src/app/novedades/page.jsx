"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/services/tienda";
import { Badge, Heading, Text } from "@/components/ui";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useTienda } from "@/app/context/TiendaContext";

export default function NovedadesPage() {
  const { formatearPrecio } = useTienda();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNovedades() {
      try {
        const data = await getProductos({ ordering: "-created_at", page_size: 20 });
        setProductos(data.results || data);
      } catch (err) {
        console.error("Error cargando novedades:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNovedades();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            <Sparkles size={12} className="mr-1" /> Recién llegados
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Novedades
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Los últimos productos que ingresaron a nuestro catálogo. Siempre actualizado con lo más nuevo del mercado odontológico y médico.
          </Text>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <Text variant="body" className="text-gray-400">No hay productos nuevos por el momento.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/products/${producto.slug || producto.id}`}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                  {producto.imagen_principal ? (
                    <img
                      src={producto.imagen_principal}
                      alt={producto.nombre}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Text variant="bodySmBold" className="line-clamp-2 group-hover:text-dental-blue transition-colors">
                    {producto.nombre}
                  </Text>
                  {producto.precio && (
                    <Text variant="bodySm" className="text-dental-blue font-bold mt-auto pt-2">
                      {formatearPrecio(producto.precio)}
                    </Text>
                  )}
                </div>
                <div className="px-4 pb-3">
                  <Badge variant="primary" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-100">
                    Nuevo
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
