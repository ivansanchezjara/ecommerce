"use client";

import { useState, useEffect } from "react";
import { getMisCupones } from "@/services/cuenta";
import { Button, Badge } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Ticket,
  Loader2,
  AlertCircle,
  Percent,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { useTienda } from "@/app/context/TiendaContext";

// ─── Constantes ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "todos", label: "Todos" },
  { id: "disponibles", label: "Disponibles" },
  { id: "usados", label: "Usados" },
  { id: "vencidos", label: "Vencidos" },
];

// ─── Card de cupón ───────────────────────────────────────────────────────────

function CuponCard({ cupon }) {
  const [copied, setCopied] = useState(false);
  const { formatearPrecio } = useTienda();

  const esPorcentaje = cupon.tipo_descuento === "porcentaje";
  const disponible = cupon.esta_vigente && cupon.veces_usado < cupon.uso_maximo_por_cliente;
  const agotado = cupon.veces_usado >= cupon.uso_maximo_por_cliente;
  const vencido = !cupon.esta_vigente && !agotado;

  const fechaFin = new Date(cupon.fecha_fin).toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function handleCopy() {
    navigator.clipboard.writeText(cupon.codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden transition-all ${
        disponible
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white"
          : agotado
          ? "border-slate-200 bg-slate-50 opacity-75"
          : "border-slate-200 bg-slate-50 opacity-60"
      }`}
    >
      {/* Decorativo lateral */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          disponible ? "bg-emerald-400" : agotado ? "bg-slate-300" : "bg-red-300"
        }`}
      />

      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                disponible ? "bg-emerald-100" : "bg-slate-100"
              }`}
            >
              {esPorcentaje ? (
                <Percent
                  size={22}
                  className={disponible ? "text-emerald-600" : "text-slate-400"}
                />
              ) : (
                <DollarSign
                  size={22}
                  className={disponible ? "text-emerald-600" : "text-slate-400"}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Text variant="bodySmBold" className="text-slate-800 text-base">
                  {esPorcentaje ? `${cupon.valor}% OFF` : `US$ ${cupon.valor} OFF`}
                </Text>
                {disponible && (
                  <Badge variant="success" className="text-[10px]">
                    Disponible
                  </Badge>
                )}
                {agotado && (
                  <Badge className="text-[10px] bg-slate-200 text-slate-500 border-none">
                    Usado
                  </Badge>
                )}
                {vencido && (
                  <Badge variant="danger" className="text-[10px]">
                    Vencido
                  </Badge>
                )}
              </div>
              {cupon.descripcion && (
                <Text variant="bodySm" className="text-slate-500 mt-0.5">
                  {cupon.descripcion}
                </Text>
              )}
            </div>
          </div>
        </div>

        {/* Código + copiar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-dashed border-slate-300 rounded-lg px-3 py-2">
            <Ticket size={14} className="text-slate-400 shrink-0" />
            <code className="text-sm font-bold text-slate-700 tracking-wider">
              {cupon.codigo}
            </code>
          </div>
          {disponible && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Hasta {fechaFin}
          </span>
          {cupon.monto_minimo_usd > 0 && (
            <span>
              Mín. US$ {parseFloat(cupon.monto_minimo_usd).toFixed(0)}
            </span>
          )}
          <span>
            Usos: {cupon.veces_usado}/{cupon.uso_maximo_por_cliente}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionCupones() {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  useEffect(() => {
    fetchCupones();
  }, [activeTab]);

  async function fetchCupones() {
    try {
      setLoading(true);
      setError("");
      const data = await getMisCupones(activeTab);
      setCupones(data);
    } catch (err) {
      setError("Error al cargar tus cupones.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
              <Ticket size={18} className="text-green-600" />
            </div>
            <div>
              <Heading level={4} className="text-lg">
                Mis Cupones
              </Heading>
              <Text variant="bodySm" className="mt-0.5">
                Cupones de descuento disponibles para tus compras.
              </Text>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6 p-1 bg-slate-100 rounded-xl">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
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

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-dental-blue" />
          </div>
        ) : cupones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Ticket size={28} className="text-green-300" />
            </div>
            <Heading level={5} className="text-slate-600">
              {activeTab === "todos"
                ? "No tenés cupones"
                : `Sin cupones ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}`}
            </Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">
              Cuando tengamos promociones o cupones especiales para vos,
              aparecerán acá.
            </Text>
          </div>
        ) : (
          <div className="space-y-4">
            {cupones.map((cupon, idx) => (
              <CuponCard key={`${cupon.codigo}-${idx}`} cupon={cupon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
