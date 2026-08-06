"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getHistorialBusquedas,
  eliminarBusqueda,
  limpiarHistorialBusquedas,
} from "@/services/cuenta";
import { Button, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Search,
  Trash2,
  Clock,
  Loader2,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";

// ─── Item de búsqueda ────────────────────────────────────────────────────────

function BusquedaItem({ busqueda, onRemove, onSearch }) {
  const fecha = new Date(busqueda.created_at);
  const fechaStr = fecha.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
  });
  const horaStr = fecha.toLocaleTimeString("es-PY", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors">
      {/* Ícono */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-dental-blue/10 group-hover:text-dental-blue transition-colors">
        <Clock size={15} />
      </div>

      {/* Término (clickeable para re-buscar) */}
      <button
        onClick={() => onSearch(busqueda.termino)}
        className="flex-1 text-left min-w-0"
      >
        <Text variant="bodySmBold" className="text-slate-700 truncate block">
          {busqueda.termino}
        </Text>
        <Text variant="bodySm" className="text-slate-400 text-xs">
          {fechaStr} {horaStr}
          {busqueda.resultados_count > 0 && (
            <span className="ml-2">
              • {busqueda.resultados_count} resultado
              {busqueda.resultados_count !== 1 ? "s" : ""}
            </span>
          )}
        </Text>
      </button>

      {/* Acciones */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSearch(busqueda.termino)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-dental-blue hover:bg-dental-blue/10 transition-colors"
          title="Buscar de nuevo"
        >
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => onRemove(busqueda.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Eliminar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionHistorialBusqueda() {
  const router = useRouter();
  const [busquedas, setBusquedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    fetchHistorial();
  }, []);

  async function fetchHistorial() {
    try {
      setLoading(true);
      const data = await getHistorialBusquedas();
      setBusquedas(data);
    } catch (err) {
      setError("Error al cargar el historial de búsquedas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id) {
    try {
      await eliminarBusqueda(id);
      setBusquedas((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError("Error al eliminar la búsqueda.");
    }
  }

  async function handleClearAll() {
    try {
      await limpiarHistorialBusquedas();
      setBusquedas([]);
      setConfirmClear(false);
    } catch (err) {
      setError("Error al limpiar el historial.");
    }
  }

  function handleSearch(termino) {
    router.push(`/products?q=${encodeURIComponent(termino)}`);
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
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
              <Search size={18} className="text-violet-500" />
            </div>
            <div>
              <Heading level={4} className="text-lg">
                Historial de Búsquedas
              </Heading>
              <Text variant="bodySm" className="mt-0.5">
                {busquedas.length === 0
                  ? "Tus búsquedas recientes aparecerán acá."
                  : `${busquedas.length} búsqueda${busquedas.length !== 1 ? "s" : ""} reciente${busquedas.length !== 1 ? "s" : ""}`}
              </Text>
            </div>
          </div>

          {busquedas.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClear(true)}
              icon={Trash2}
              className="text-slate-400 hover:text-red-500"
            >
              Limpiar
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-4 text-red-600">
            <AlertCircle size={18} />
            <Text variant="bodySm" className="font-bold text-red-600">
              {error}
            </Text>
          </div>
        )}

        {/* Lista vacía */}
        {busquedas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-violet-300" />
            </div>
            <Heading level={5} className="text-slate-600">
              Sin búsquedas recientes
            </Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">
              Cuando busques productos en la tienda, tu historial aparecerá acá
              para que puedas volver a buscarlos fácilmente.
            </Text>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {busquedas.map((busqueda) => (
              <BusquedaItem
                key={busqueda.id}
                busqueda={busqueda}
                onRemove={handleRemove}
                onSearch={handleSearch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal confirmación limpiar todo */}
      {confirmClear && (
        <Modal
          open={confirmClear}
          onClose={() => setConfirmClear(false)}
          title="Limpiar historial"
        >
          <div className="p-6 space-y-4">
            <Text variant="bodySm">
              ¿Querés eliminar todo tu historial de búsquedas? Esta acción no
              se puede deshacer.
            </Text>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmClear(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleClearAll}
                icon={Trash2}
              >
                Limpiar todo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
