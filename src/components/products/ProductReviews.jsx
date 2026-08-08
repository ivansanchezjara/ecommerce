"use client";
import { useState, useEffect } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { getEvaluacionesProducto } from "@/services/tienda";
import { getProductosPendientesEvaluar } from "@/services/cuenta";
import { useAuth } from "@/app/context/AuthContext";
import { Heading, Text, Button } from "@/components/ui";
import CrearResenaModal from "./CrearResenaModal";

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-gray-600 text-right">{stars}</span>
      <Star size={12} className="fill-yellow-400 text-yellow-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-6 text-gray-500 text-xs">{count}</span>
    </div>
  );
}

function formatFecha(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ProductReviews({ productSlug, productId }) {
  const { isLoggedIn } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Cargar evaluaciones públicas
  useEffect(() => {
    if (!productSlug) return;

    let cancelled = false;

    getEvaluacionesProducto(productSlug)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.error("Error cargando evaluaciones:", err);
        if (!cancelled) setData({ promedio: 0, total: 0, evaluaciones: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [productSlug]);

  // Verificar si el usuario puede dejar reseña (compró el producto)
  useEffect(() => {
    if (!isLoggedIn || !productId) return;

    let cancelled = false;

    getProductosPendientesEvaluar()
      .then((pendientes) => {
        if (!cancelled) {
          const puede = pendientes.some((p) => p.id === productId);
          setCanReview(puede);
        }
      })
      .catch(() => {
        if (!cancelled) setCanReview(false);
      });

    return () => { cancelled = true; };
  }, [isLoggedIn, productId]);

  const handleReviewSuccess = () => {
    setCanReview(false);
    // Recargar evaluaciones
    getEvaluacionesProducto(productSlug)
      .then((res) => setData(res))
      .catch(() => {});
  };

  if (loading) return null;

  const { promedio = 0, total = 0, evaluaciones = [] } = data || {};

  // Calcular distribución de estrellas
  const distribucion = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: evaluaciones.filter((e) => e.rating === stars).length,
  }));

  return (
    <section className="mt-12 lg:mt-16 border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-8">
        <Heading level={2} className="text-xl md:text-2xl">
          Opiniones de clientes
        </Heading>

        {canReview && (
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            size="sm"
            icon={MessageSquarePlus}
            className="border-gray-300 text-gray-700"
          >
            Hacer reseña
          </Button>
        )}
      </div>

      {total === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={24} className="fill-gray-200 text-gray-200" />
            ))}
          </div>
          <Text variant="bodySmBold" className="text-gray-600 mb-1">
            No hay reseñas sobre este producto
          </Text>
          <Text variant="bodySm" className="text-gray-400 max-w-sm">
            {canReview
              ? "Sé el primero en compartir tu experiencia con este producto."
              : "Las reseñas aparecen luego de que un cliente compra y evalúa el producto."}
          </Text>
          {canReview && (
            <Button
              onClick={() => setShowModal(true)}
              variant="primary"
              size="sm"
              icon={MessageSquarePlus}
              className="mt-4 bg-gray-900 hover:bg-gray-800 border-gray-900"
            >
              Escribir reseña
            </Button>
          )}
        </div>
      ) : (
        /* Con reseñas */
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Resumen */}
          <div className="flex flex-col items-center md:items-start gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-center md:text-left">
              <span className="text-4xl font-bold text-gray-900">{promedio}</span>
              <span className="text-lg text-gray-500 ml-1">/ 5</span>
            </div>
            <StarRating rating={Math.round(promedio)} size={20} />
            <Text variant="bodySm" className="text-gray-500">
              {total} {total === 1 ? "evaluación" : "evaluaciones"}
            </Text>

            {/* Barras de distribución */}
            <div className="w-full mt-3 space-y-1.5">
              {distribucion.map(({ stars, count }) => (
                <RatingBar key={stars} stars={stars} count={count} total={total} />
              ))}
            </div>

            {canReview && (
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                size="sm"
                icon={MessageSquarePlus}
                className="w-full mt-4 border-gray-300 text-gray-700"
              >
                Hacer reseña
              </Button>
            )}
          </div>

          {/* Lista de evaluaciones */}
          <div className="space-y-6">
            {evaluaciones.map((ev) => (
              <article
                key={ev.id}
                className="pb-6 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {ev.autor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Text variant="bodySmBold" className="text-gray-900">
                        {ev.autor}
                      </Text>
                      <Text variant="bodyXs" className="text-gray-400">
                        {formatFecha(ev.created_at)}
                      </Text>
                    </div>
                  </div>
                  <StarRating rating={ev.rating} size={14} />
                </div>

                {ev.titulo && (
                  <Text variant="bodySmBold" className="text-gray-800 mb-1">
                    {ev.titulo}
                  </Text>
                )}
                {ev.comentario && (
                  <Text variant="bodySm" className="text-gray-600 leading-relaxed">
                    {ev.comentario}
                  </Text>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Modal de crear reseña */}
      {showModal && (
        <CrearResenaModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productoId={productId}
          productoNombre={productSlug}
          onSuccess={handleReviewSuccess}
        />
      )}
    </section>
  );
}
