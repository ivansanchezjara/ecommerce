"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { crearEvaluacion } from "@/services/cuenta";
import { Button, Modal, Text, useToast } from "@/components/ui";

function StarSelector({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <Star
            size={28}
            className={
              star <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function CrearResenaModal({
  isOpen,
  onClose,
  productoId,
  productoNombre,
  varianteId = null,
  ventaId = null,
  onSuccess,
}) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showToast("Seleccioná una calificación", "error");
      return;
    }

    setLoading(true);
    try {
      const data = {
        producto: productoId,
        rating,
        titulo: titulo.trim(),
        comentario: comentario.trim(),
      };
      if (varianteId) data.variante = varianteId;
      if (ventaId) data.venta = ventaId;

      await crearEvaluacion(data);
      showToast("¡Gracias por tu reseña!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err?.data?.detail || err?.message || "Error al enviar la reseña";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setTitulo("");
    setComentario("");
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="Escribir reseña">
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {/* Producto */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <Text variant="bodySmBold" className="text-gray-800">
            {productoNombre}
          </Text>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center gap-2">
          <Text variant="label" className="text-gray-600 text-sm">
            ¿Cómo calificás este producto?
          </Text>
          <StarSelector value={rating} onChange={setRating} />
          {rating > 0 && (
            <Text variant="bodyXs" className="text-gray-400">
              {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][rating]}
            </Text>
          )}
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título (opcional)
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            placeholder="Resumí tu experiencia"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
          />
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu opinión (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Contá más sobre tu experiencia con este producto..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 resize-none"
          />
          <Text variant="bodyXs" className="text-gray-400 mt-1 text-right">
            {comentario.length}/1000
          </Text>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={rating === 0 || loading}
            className="flex-1 bg-gray-900 hover:bg-gray-800 border-gray-900"
          >
            {loading ? "Enviando..." : "Enviar reseña"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
