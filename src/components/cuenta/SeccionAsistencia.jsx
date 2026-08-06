"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getMisSolicitudesAsistencia,
  crearSolicitudAsistencia,
  getProductosPendientesEvaluar,
} from "@/services/cuenta";
import { getMisPedidos } from "@/services/cuenta";
import { Button, Input, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Wrench,
  Plus,
  Loader2,
  AlertCircle,
  Check,
  Package,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const TIPOS_SOLICITUD = [
  { value: "garantia", label: "Garantía", icon: Shield, desc: "El producto presenta un defecto cubierto por garantía" },
  { value: "reparacion", label: "Reparación", icon: Wrench, desc: "Necesito reparar un equipo (fuera de garantía)" },
  { value: "consulta_tecnica", label: "Consulta Técnica", icon: AlertTriangle, desc: "Tengo una duda técnica sobre un producto" },
  { value: "instalacion", label: "Instalación", icon: Package, desc: "Necesito ayuda con la instalación de un equipo" },
];

const ESTADO_CONFIG = {
  pendiente: { color: "bg-amber-100 text-amber-700", label: "Pendiente" },
  en_revision: { color: "bg-blue-100 text-blue-700", label: "En Revisión" },
  aprobada: { color: "bg-emerald-100 text-emerald-700", label: "Aprobada" },
  rechazada: { color: "bg-red-100 text-red-700", label: "Rechazada" },
  en_proceso: { color: "bg-indigo-100 text-indigo-700", label: "En Proceso" },
  completada: { color: "bg-green-100 text-green-700", label: "Completada" },
};

function SolicitudForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({ tipo: "", producto: "", descripcion: "", numero_serie: "" });
  const [productosComprados, setProductosComprados] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const pedidos = await getMisPedidos("todos");
        const prods = new Map();
        pedidos.forEach((p) => {
          p.lineas.forEach((l) => {
            if (!prods.has(l.producto_nombre)) {
              prods.set(l.producto_nombre, { nombre: l.producto_nombre, imagen_url: l.imagen_url });
            }
          });
        });
        setProductosComprados(Array.from(prods.values()));
      } catch { /* ignore */ }
      finally { setLoadingProductos(false); }
    }
    fetchProductos();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.tipo || !form.descripcion.trim()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tipo */}
      <div className="space-y-2">
        <Text variant="label">Tipo de solicitud</Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TIPOS_SOLICITUD.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, tipo: t.value }))}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                form.tipo === t.value
                  ? "border-dental-blue bg-dental-blue/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <t.icon size={16} className={form.tipo === t.value ? "text-dental-blue" : "text-slate-400"} />
              <div>
                <Text variant="bodySm" className={`font-bold ${form.tipo === t.value ? "text-dental-blue" : "text-slate-700"}`}>
                  {t.label}
                </Text>
                <Text variant="bodySm" className="text-slate-400 text-xs mt-0.5">{t.desc}</Text>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Producto (opcional, de productos comprados) */}
      {!loadingProductos && productosComprados.length > 0 && (
        <div className="space-y-1.5">
          <Text variant="label">Producto relacionado (opcional)</Text>
          <select
            value={form.producto}
            onChange={(e) => setForm((p) => ({ ...p, producto: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Seleccionar producto...</option>
            {productosComprados.map((p, i) => (
              <option key={i} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Número de serie */}
      <Input
        label="Número de serie (opcional)"
        value={form.numero_serie}
        onChange={(e) => setForm((p) => ({ ...p, numero_serie: e.target.value }))}
        placeholder="Si el equipo tiene número de serie"
      />

      {/* Descripción */}
      <div className="space-y-1.5">
        <Text variant="label">Descripción del problema</Text>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          placeholder="Describí con detalle el problema o lo que necesitás..."
          rows={4}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving || !form.tipo || !form.descripcion.trim()} icon={saving ? Loader2 : Check} className={saving ? "[&>svg]:animate-spin" : ""}>
          {saving ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}

function SolicitudCard({ solicitud }) {
  const config = ESTADO_CONFIG[solicitud.estado] || ESTADO_CONFIG.pendiente;
  const fecha = new Date(solicitud.created_at).toLocaleDateString("es-PY", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 shrink-0">
            <Wrench size={18} className="text-slate-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text variant="bodySmBold" className="text-slate-700">
                {solicitud.tipo_display}
              </Text>
              <Badge className={`text-[10px] ${config.color} border-none`}>
                {config.label}
              </Badge>
            </div>
            {solicitud.producto_nombre && (
              <Text variant="bodySm" className="text-slate-500 mt-0.5">
                {solicitud.producto_nombre}
              </Text>
            )}
            <Text variant="bodySm" className="text-slate-400 mt-1">
              {solicitud.descripcion.length > 120
                ? `${solicitud.descripcion.slice(0, 120)}...`
                : solicitud.descripcion}
            </Text>
            <Text variant="bodySm" className="text-slate-400 text-xs mt-2">
              {fecha}
              {solicitud.orden_trabajo_numero && (
                <span> • OT-{solicitud.orden_trabajo_numero}</span>
              )}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeccionAsistencia() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try { setLoading(true); setSolicitudes(await getMisSolicitudesAsistencia()); }
    catch { setError("Error al cargar solicitudes."); }
    finally { setLoading(false); }
  }

  async function handleCreate(data) {
    setSaving(true); setError("");
    try {
      await crearSolicitudAsistencia(data);
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError(err.data?.detail || err.data?.[0] || "Error al enviar la solicitud.");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-dental-blue" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100"><Wrench size={18} className="text-orange-500" /></div>
            <div>
              <Heading level={4} className="text-lg">Asistencia Técnica</Heading>
              <Text variant="bodySm" className="mt-0.5">Solicitudes de garantía, reparación y soporte técnico.</Text>
            </div>
          </div>
          {!showForm && <Button onClick={() => setShowForm(true)} icon={Plus} size="sm">Nueva solicitud</Button>}
        </div>

        {error && <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-6 text-red-600"><AlertCircle size={18} /><Text variant="bodySm" className="font-bold text-red-600">{error}</Text></div>}

        {showForm && (
          <div className="rounded-xl border border-orange-200 bg-orange-50/30 p-6 mb-6">
            <Heading level={5} className="mb-4 text-sm">Nueva solicitud de asistencia</Heading>
            <SolicitudForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
          </div>
        )}

        {!showForm && solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4"><Wrench size={28} className="text-orange-300" /></div>
            <Heading level={5} className="text-slate-600">Sin solicitudes</Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">Si necesitás asistencia técnica, garantía o reparación, creá una solicitud y nuestro equipo te contactará.</Text>
          </div>
        ) : !showForm && (
          <div className="space-y-3">
            {solicitudes.map((s) => <SolicitudCard key={s.id} solicitud={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
