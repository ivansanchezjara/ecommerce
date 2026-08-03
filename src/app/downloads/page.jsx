"use client";

import { useTienda } from "@/app/context/TiendaContext";
import { FileDown, MessageCircle } from "lucide-react";

export default function DownloadsPage() {
  const { config } = useTienda();

  // Los catálogos pueden venir del backend en el futuro.
  // Por ahora es un placeholder hasta configurar desde el ERP.
  const catalogs = [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Catálogos y Descargas
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Descarga nuestros catálogos digitales para consultar el portafolio completo de productos.
        </p>
      </div>

      {catalogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileDown size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-all"
                >
                  <FileDown size={16} />
                  <span>Descargar PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <FileDown size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Próximamente
          </h3>
          <p className="text-gray-500 mb-6">
            Los catálogos digitales estarán disponibles pronto.
          </p>
          {config?.whatsapp && (
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, me interesa recibir el catálogo de productos.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition-all"
            >
              <MessageCircle size={18} fill="currentColor" />
              Solicitar catálogo por WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
