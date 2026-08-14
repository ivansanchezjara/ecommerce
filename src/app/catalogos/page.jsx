"use client";

import { useEffect, useState } from "react";
import { getCatalogos } from "@/services/tienda";
import { Badge, Heading, Text, Button } from "@/components/ui";
import { FileDown, BookOpen } from "lucide-react";

export default function CatalogosPage() {
  const [catalogos, setCatalogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogos() {
      try {
        const data = await getCatalogos();
        setCatalogos(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            <BookOpen size={12} className="mr-1" /> Material Descargable
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Catálogos
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Descargá los catálogos de nuestras marcas, listas de precios y fichas técnicas en formato PDF.
          </Text>
        </div>
      </section>

      {/* Grid de catálogos */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : catalogos.length === 0 ? (
          <div className="text-center py-20">
            <FileDown size={48} className="mx-auto text-gray-300 mb-4" />
            <Heading level={3} className="text-gray-500">Próximamente</Heading>
            <Text variant="body" className="text-gray-400 mt-2">
              Estamos preparando los catálogos para descarga. Contactanos si necesitás uno específico.
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {catalogos.map((catalogo) => (
              <div
                key={catalogo.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 flex flex-col"
              >
                {/* Portada */}
                <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center overflow-hidden">
                  {catalogo.portada_url ? (
                    <img
                      src={catalogo.portada_url}
                      alt={catalogo.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-300">
                      <FileDown size={24} />
                      <Text variant="mutedXs">PDF</Text>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <Text variant="bodySmBold" className="text-xs line-clamp-2">{catalogo.titulo}</Text>
                  {catalogo.marca && (
                    <Text variant="mutedXs" className="mt-1 text-gray-400">{catalogo.marca}</Text>
                  )}

                  <div className="mt-auto pt-3">
                    {catalogo.enlace_pdf ? (
                      <Button
                        as="a"
                        href={catalogo.enlace_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="ghost"
                        size="xs"
                        icon={FileDown}
                        iconPosition="left"
                        className="text-dental-blue hover:text-dental-blue-hover w-full justify-center border border-dental-blue/20 hover:bg-dental-blue-light text-[11px]"
                      >
                        Descargar
                      </Button>
                    ) : (
                      <Text variant="mutedXs" className="text-center text-gray-400">
                        No disponible
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
