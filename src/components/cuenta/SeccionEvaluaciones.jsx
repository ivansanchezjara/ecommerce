"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getMisEvaluaciones,
  getProductosPendientesEvaluar,
  crearEvaluacion,
  eliminarEvaluacion,
} from "@/services/cuenta";
import { Button, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Star,
  Loader2,
  AlertCircle,
  Package,
  Trash2,
  PenLine,
  Check,
  MessageSquare,
} from "lucide-react";

// ─── Componente de estrellas ─────────────────────────────────────────────────

function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly ? star <= value : star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Formulario de evaluación ────────────────────────────────────────────────

function EvaluacionForm({ producto, onSubmit, onCancel, saving }) {
  const [rating, setRating] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({
      producto: producto.id,
      rating,
      titulo,
      comentario,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Producto info */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
          {producto.imagen_url ? (
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package size={18} className="text-slate-300" />
            </div>
          )}
        </div>
        <div>
          <Text variant="bodySmBold" className="text-slate-700">
            {producto.nombre}
          </Text>
          {producto.brand && (
            <Text variant="bodySm" className="text-slate-400">
              {producto.brand}
            </Text>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <Text variant="label">Tu calificación</Text>
        <StarRating value={rating} onChange={setRating} size={28} />
        {rating === 0 && (
          <Text variant="bodySm" className="text-slate-400 text-xs">
            Seleccioná una calificación
          </Text>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1.5">
        <Text variant="label">Título (opcional)</Text>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Resumen de tu experiencia"
          maxLength={100}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Comentario */}
      <div className="space-y-1.5">
        <Text variant="label">Tu reseña (opcional)</Text>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Contá tu experiencia con este producto..."
          rows={3}
          maxLength={1000}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
        />
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={saving || rating === 0}
          icon={saving ? Loader2 : Check}
          className={saving ? "[&>svg]:animate-spin" : ""}
        >
          {saving ? "Enviando..." : "Enviar evaluación"}
        </Button>
      </div>
    </form>
  );
}

// ─── Card de evaluación existente ────────────────────────────────────────────

function EvaluacionCard({ evaluacion, onDelete }) {
  const fecha = new Date(evaluacion.created_at).toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {/* Imagen producto */}
        <Link
          href={`/products/${evaluacion.producto_slug}`}
          className="h-14 w-14 rounded-lg bg-slate-100 overflow-hidden relative shrink-0"
        >
          {evaluacion.producto_imagen_url ? (
            <Image
              src={evaluacion.producto_imagen_url}
              alt={evaluacion.producto_nombre}
              fill
              className="object-contain p-1"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package size={20} className="text-slate-300" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${evaluacion.producto_slug}`}
            className="hover:text-dental-blue transition-colors"
          >
            <Text variant="bodySmBold" className="text-slate-700 truncate block">
              {evaluacion.producto_nombre}
            </Text>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={evaluacion.rating} readonly size={14} />
            <Text variant="bodySm" className="text-slate-400 text-xs">
              {fecha}
            </Text>
          </div>
          {evaluacion.titulo && (
            <Text variant="bodySm" className="text-slate-600 font-medium mt-2">
              {evaluacion.titulo}
            </Text>
          )}
          {evaluacion.comentario && (
            <Text variant="bodySm" className="text-slate-500 mt-1">
              {evaluacion.comentario}
            </Text>
          )}
          {!evaluacion.aprobada && (
            <Badge variant="warning" className="mt-2 text-[10px]">
              Pendiente de aprobación
            </Badge>
          )}
        </div>

        {/* Eliminar */}
        <button
          onClick={() => onDelete(evaluacion.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          title="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Card de producto pendiente ──────────────────────────────────────────────

function PendienteCard({ producto, onEvaluar }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3">
      <div className="h-10 w-10 rounded-lg bg-white overflow-hidden relative shrink-0 border border-slate-100">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-contain p-1"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={14} className="text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Text variant="bodySm" className="text-slate-600 font-medium truncate">
          {producto.nombre}
        </Text>
        <Text variant="bodySm" className="text-slate-400 text-xs">
          {producto.brand}
        </Text>
      </div>
      <Button size="sm" variant="outline" onClick={() => onEvaluar(producto)} icon={PenLine}>
        Evaluar
      </Button>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [evaluando, setEvaluando] = useState(null); // producto seleccionado

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [evals, pends] = await Promise.all([
        getMisEvaluaciones(),
        getProductosPendientesEvaluar(),
      ]);
      setEvaluaciones(evals);
      setPendientes(pends);
    } catch (err) {
      setError("Error al cargar tus evaluaciones.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data) {
    setSaving(true);
    setError("");
    try {
      await crearEvaluacion(data);
      setEvaluando(null);
      await fetchData();
    } catch (err) {
      setError(err.data?.detail || err.data?.[0] || "Error al enviar la evaluación.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await eliminarEvaluacion(id);
      setEvaluaciones((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError("Error al eliminar la evaluación.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-dental-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario de nueva evaluación */}
      {evaluando && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 shadow-sm">
          <Heading level={5} className="mb-4 text-sm">
            Evaluar producto
          </Heading>
          <EvaluacionForm
            producto={evaluando}
            onSubmit={handleCreate}
            onCancel={() => setEvaluando(null)}
            saving={saving}
          />
        </div>
      )}

      {/* Pendientes de evaluar */}
      {pendientes.length > 0 && !evaluando && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <PenLine size={15} className="text-amber-600" />
            </div>
            <div>
              <Text variant="bodySmBold" className="text-slate-700">
                Productos por evaluar
              </Text>
              <Text variant="bodySm" className="text-slate-400">
                Compartí tu experiencia con estos productos que compraste.
              </Text>
            </div>
          </div>
          <div className="space-y-2">
            {pendientes.slice(0, 5).map((producto) => (
              <PendienteCard
                key={producto.id}
                producto={producto}
                onEvaluar={setEvaluando}
              />
            ))}
            {pendientes.length > 5 && (
              <Text variant="bodySm" className="text-slate-400 text-center pt-2">
                y {pendientes.length - 5} producto{pendientes.length - 5 !== 1 ? "s" : ""} más...
              </Text>
            )}
          </div>
        </div>
      )}

      {/* Mis evaluaciones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <MessageSquare size={18} className="text-amber-500" />
            </div>
            <div>
              <Heading level={4} className="text-lg">
                Mis Evaluaciones
              </Heading>
              <Text variant="bodySm" className="mt-0.5">
                {evaluaciones.length === 0
                  ? "Tus reseñas de productos aparecerán acá."
                  : `${evaluaciones.length} evaluación${evaluaciones.length !== 1 ? "es" : ""}`}
              </Text>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-6 text-red-600">
            <AlertCircle size={18} />
            <Text variant="bodySm" className="font-bold text-red-600">
              {error}
            </Text>
          </div>
        )}

        {evaluaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Star size={28} className="text-amber-300" />
            </div>
            <Heading level={5} className="text-slate-600">
              Sin evaluaciones
            </Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">
              Cuando evalúes productos que compraste, tus reseñas aparecerán acá.
            </Text>
          </div>
        ) : (
          <div className="space-y-3">
            {evaluaciones.map((evaluacion) => (
              <EvaluacionCard
                key={evaluacion.id}
                evaluacion={evaluacion}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
