"use client";
import { useState, useEffect } from "react";
import { HelpCircle, Send, CheckCircle2, Clock } from "lucide-react";
import { getPreguntasProducto, crearPreguntaProducto } from "@/services/tienda";
import { useAuth } from "@/app/context/AuthContext";
import { Heading, Text, Button, useToast } from "@/components/ui";
import Link from "next/link";

function formatFecha(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function PreguntaItem({ pregunta }) {
  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      {/* Pregunta */}
      <div className="flex gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
          <HelpCircle size={14} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <Text variant="bodySm" className="text-gray-800 font-medium">
            {pregunta.pregunta}
          </Text>
          <Text variant="bodyXs" className="text-gray-400 mt-1">
            {pregunta.autor} · {formatFecha(pregunta.created_at)}
          </Text>
        </div>
      </div>

      {/* Respuesta */}
      {pregunta.respondida ? (
        <div className="flex gap-3 mt-3 ml-9">
          <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 size={12} className="text-green-600" />
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <Text variant="bodySm" className="text-gray-700">
              {pregunta.respuesta}
            </Text>
            {pregunta.respondido_at && (
              <Text variant="bodyXs" className="text-gray-400 mt-1">
                Respondido el {formatFecha(pregunta.respondido_at)}
              </Text>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2 ml-9 text-gray-400">
          <Clock size={12} />
          <Text variant="bodyXs">Pendiente de respuesta</Text>
        </div>
      )}
    </div>
  );
}

export default function ProductQuestions({ productSlug }) {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preguntaTexto, setPreguntaTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!productSlug) return;

    let cancelled = false;

    getPreguntasProducto(productSlug)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.error("Error cargando preguntas:", err);
        if (!cancelled) setData({ total: 0, preguntas: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [productSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const texto = preguntaTexto.trim();
    if (texto.length < 10) {
      showToast("La pregunta debe tener al menos 10 caracteres", "error");
      return;
    }

    setEnviando(true);
    try {
      await crearPreguntaProducto(productSlug, texto);
      showToast("¡Pregunta enviada! Te responderemos pronto.", "success");
      setPreguntaTexto("");
      setShowForm(false);
      // Recargar preguntas
      const updated = await getPreguntasProducto(productSlug);
      setData(updated);
    } catch (err) {
      const message = err?.data?.detail || err?.message || "Error al enviar la pregunta";
      showToast(message, "error");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return null;

  const { total = 0, preguntas = [] } = data || {};

  return (
    <section className="mt-12 lg:mt-16 border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-6">
        <Heading level={2} className="text-xl md:text-2xl">
          Consultá tus dudas sobre este producto
        </Heading>

        {isLoggedIn && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            size="sm"
            icon={HelpCircle}
            className="border-gray-300 text-gray-700"
          >
            Hacer pregunta
          </Button>
        )}
      </div>

      {/* Formulario de pregunta */}
      {showForm && isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <Text variant="label" className="text-gray-700 mb-2 text-sm">
            Tu pregunta
          </Text>
          <textarea
            value={preguntaTexto}
            onChange={(e) => setPreguntaTexto(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ej: ¿Este producto es compatible con...?"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 resize-none mb-3"
          />
          <div className="flex items-center justify-between">
            <Text variant="bodyXs" className="text-gray-400">
              {preguntaTexto.length}/500
            </Text>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setShowForm(false); setPreguntaTexto(""); }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Send}
                disabled={preguntaTexto.trim().length < 10 || enviando}
                className="bg-gray-900 hover:bg-gray-800 border-gray-900"
              >
                {enviando ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Mensaje para no logueados */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
          <HelpCircle size={18} className="text-gray-400 shrink-0" />
          <div>
            <Text variant="bodySm" className="text-gray-600">
              <Link href="/login" className="text-red-600 font-medium hover:underline">
                Iniciá sesión
              </Link>
              {" "}para hacer una pregunta sobre este producto.
            </Text>
          </div>
        </div>
      )}

      {/* Lista de preguntas */}
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
          <HelpCircle size={32} className="text-gray-300 mb-3" />
          <Text variant="bodySmBold" className="text-gray-600 mb-1">
            No hay preguntas sobre este producto
          </Text>
          <Text variant="bodySm" className="text-gray-400 max-w-sm">
            Sé el primero en consultar. Nuestro equipo te responderá lo antes posible.
          </Text>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {preguntas.map((p) => (
            <PreguntaItem key={p.id} pregunta={p} />
          ))}
        </div>
      )}
    </section>
  );
}
