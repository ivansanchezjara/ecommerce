"use client";

import { useEffect, useState } from "react";
import { getEventos } from "@/services/tienda";
import { Badge, Heading, Text, Button } from "@/components/ui";
import { Calendar, MapPin, User, Clock, ExternalLink, MessageCircle } from "lucide-react";

function formatFecha(fecha) {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function EventosPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const data = await getEventos();
        setEventos(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-3 bg-dental-blue-light text-dental-blue border-none">
            <Calendar size={12} className="mr-1" /> Agenda
          </Badge>
          <Heading level={1} className="text-3xl md:text-4xl">
            Eventos y Capacitaciones
          </Heading>
          <Text variant="body" className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Congresos, workshops y demostraciones con profesionales del rubro. Mantente actualizado con las últimas técnicas y tecnologías.
          </Text>
        </div>
      </section>

      {/* Lista de eventos */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <Heading level={3} className="text-gray-500">Sin eventos próximos</Heading>
            <Text variant="body" className="text-gray-400 mt-2">
              Estamos organizando nuevos eventos. Seguinos en redes para enterarte primero.
            </Text>
          </div>
        ) : (
          <div className="space-y-6">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-dental-blue/30 hover:shadow-lg hover:shadow-dental-blue/5 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Imagen */}
                  {evento.imagen_url && (
                    <div className="md:w-56 shrink-0 aspect-square bg-gray-100">
                      <img
                        src={evento.imagen_url}
                        alt={evento.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Heading level={3} className="text-xl">
                        {evento.titulo}
                      </Heading>
                      {evento.descripcion && (
                        <Text variant="bodySm" className="text-gray-500 mt-2">
                          {evento.descripcion}
                        </Text>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                      {evento.fecha && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-dental-blue" />
                          <span>{formatFecha(evento.fecha)}</span>
                        </div>
                      )}
                      {evento.hora_inicio && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-dental-blue" />
                          <span>{evento.hora_inicio}{evento.hora_fin ? ` - ${evento.hora_fin}` : ""}</span>
                        </div>
                      )}
                      {evento.lugar && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-dental-blue" />
                          <span>{evento.lugar}</span>
                        </div>
                      )}
                      {evento.ponente && (
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-dental-blue" />
                          <span>{evento.ponente}{evento.especialidad_ponente ? ` — ${evento.especialidad_ponente}` : ""}</span>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    {(evento.enlace_inscripcion || evento.enlace_info || evento.whatsapp_contacto) && (
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-50">
                        {evento.whatsapp_contacto && (
                          <Button
                            as="a"
                            href={`https://wa.me/${evento.whatsapp_contacto.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`¡Hola! Quiero inscribirme en el evento "${evento.titulo}"${evento.fecha ? ` del ${formatFecha(evento.fecha)}` : ""}. ¿Cómo hago?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            size="sm"
                            icon={MessageCircle}
                            iconPosition="left"
                            className="bg-green-600 hover:bg-green-700 border-green-600 shadow-sm shadow-green-200"
                          >
                            ¡Quiero inscribirme!
                          </Button>
                        )}
                        {evento.enlace_inscripcion && (
                          <Button
                            as="a"
                            href={evento.enlace_inscripcion}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            size="sm"
                            className="bg-dental-blue hover:bg-dental-blue-hover border-dental-blue shadow-sm shadow-blue-200"
                          >
                            Formulario de inscripción
                          </Button>
                        )}
                        {evento.enlace_info && (
                          <Button
                            as="a"
                            href={evento.enlace_info}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="ghost"
                            size="sm"
                            icon={ExternalLink}
                            iconPosition="right"
                            className="text-gray-500 hover:text-dental-blue"
                          >
                            Más info
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
