"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/services/tienda";
import { Badge, Heading, Text } from "@/components/ui";
import { Percent } from "lucide-react";
import Link from "next/link";
import { useTienda } from "@/app/context/TiendaContext";

export default function OfertasPage() {
  const { formatearPrecio } = useTienda();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const data = await getProductos({ tag: "ofertas" });
        setProductos(data.results || data);
      } catch (err) {
        console.error("Error cargando ofertas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOfertas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="danger" className="mb-3 bg-white/20 text-white border-white/30">
            <Percent size={12} className="mr-1" /> Ofertas Activas
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl text-white">
            Ofertas y Promociones
          </Heading>
          <Text variant="body" className="text-red-100 mt-3 max-w-2xl mx-auto">
            Aprovechá los mejores precios en insumos y equipamiento. Ofertas por tiempo limitado.
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
            <Percent size={48} className="mx-auto text-gray-300 mb-4" />
            <Heading level={3} className="text-gray-500">No hay ofertas activas</Heading>
            <Text variant="body" className="text-gray-400 mt-2">Volvé pronto, siempre tenemos promociones nuevas.</Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/products/${producto.slug || producto.id}`}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-50 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden relative">
                  {producto.imagen_principal ? (
                    <img
                      src={producto.imagen_principal}
                      alt={producto.nombre}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  )}
                  <Badge variant="danger" className="absolute top-3 right-3 text-[10px] bg-red-500 text-white border-none shadow-sm">
                    Oferta
                  </Badge>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <Text variant="bodySmBold" className="line-clamp-2 group-hover:text-red-600 transition-colors">
                    {producto.nombre}
                  </Text>
                  {producto.precio && (
                    <Text variant="bodySm" className="text-red-600 font-bold mt-auto pt-2">
                      {formatearPrecio(producto.precio)}
                    </Text>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
