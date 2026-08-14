"use client";

import { useEffect, useState } from "react";
import { getAsesores } from "@/services/tienda";
import { Badge, Heading, Text, Button } from "@/components/ui";
import { MessageCircle, Phone, Mail, User, Users } from "lucide-react";
import { useTienda } from "@/app/context/TiendaContext";

export default function AtencionPage() {
  const { config } = useTienda();
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);

  const whatsappGeneral = config?.whatsapp;
  const emailGeneral = config?.email;
  const telefonoGeneral = config?.telefono;

  useEffect(() => {
    async function fetchAsesores() {
      try {
        const data = await getAsesores();
        setAsesores(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error cargando asesores:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAsesores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            <MessageCircle size={12} className="mr-1" /> Estamos para ayudarte
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Atención al Cliente
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Nuestro equipo de asesores está disponible para ayudarte con consultas, cotizaciones y soporte técnico.
          </Text>
        </div>
      </section>

      {/* Contacto general */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {whatsappGeneral && (
            <a
              href={`https://wa.me/${whatsappGeneral.replace(/[^0-9]/g, "")}?text=Hola%2C%20tengo%20una%20consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all duration-300 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <Text variant="bodySmBold">WhatsApp</Text>
              <Text variant="mutedXs">Respuesta inmediata</Text>
            </a>
          )}

          {telefonoGeneral && (
            <a
              href={`tel:${telefonoGeneral}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-dental-blue-light text-dental-blue flex items-center justify-center">
                <Phone size={24} />
              </div>
              <Text variant="bodySmBold">Teléfono</Text>
              <Text variant="mutedXs">{telefonoGeneral}</Text>
            </a>
          )}

          {emailGeneral && (
            <a
              href={`mailto:${emailGeneral}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <Text variant="bodySmBold">Email</Text>
              <Text variant="mutedXs">{emailGeneral}</Text>
            </a>
          )}
        </div>

        {/* Asesores */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-dental-blue" />
            <Heading level={2} className="text-2xl">Nuestros Asesores</Heading>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : asesores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
              <User size={40} className="mx-auto text-gray-300 mb-3" />
              <Text variant="bodySm" className="text-gray-500">
                Contactanos por cualquiera de los canales de arriba y te atenderemos a la brevedad.
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {asesores.map((asesor) => (
                <div
                  key={asesor.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300 flex items-center gap-4"
                >
                  {/* Foto */}
                  <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                    {asesor.avatar_url ? (
                      <img src={asesor.avatar_url} alt={asesor.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <User size={22} className="text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Text variant="bodySmBold">{asesor.nombre}</Text>
                    {asesor.email && (
                      <Text variant="mutedXs" className="mt-0.5 truncate">{asesor.email}</Text>
                    )}
                  </div>

                  {/* Botón WhatsApp */}
                  {asesor.whatsapp && (
                    <a
                      href={`https://wa.me/${asesor.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${asesor.nombre.split(" ")[0]}, tengo una consulta.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors shadow-sm shadow-green-200"
                    >
                      <MessageCircle size={14} />
                      <span className="hidden sm:inline">Escribir</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
