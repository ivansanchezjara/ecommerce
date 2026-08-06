"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMisPedidos } from "@/services/cuenta";
import { Button, Badge } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Package,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useTienda } from "@/app/context/TiendaContext";

// ─── Constantes ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "todos", label: "Todos", icon: Package },
  { id: "por_pagar", label: "Por Pagar", icon: CreditCard },
  { id: "por_enviar", label: "Por Enviar", icon: Clock },
  { id: "enviado", label: "Enviados", icon: Truck },
  { id: "cancelado", label: "Cancelados", icon: XCircle },
];

const ESTADO_CONFIG = {
  confirmado: {
    color: "bg-amber-100 text-amber-700",
    icon: CreditCard,
    label: "Por pagar",
  },
  cobrado: {
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
    label: "Por enviar",
  },
  entregado: {
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    label: "Entregado",
  },
  cancelado: {
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    label: "Cancelado",
  },
};

// ─── Tarjeta de pedido ───────────────────────────────────────────────────────

function PedidoCard({ pedido }) {
  const [expanded, setExpanded] = useState(false);
  const { formatearPrecio } = useTienda();
  const config = ESTADO_CONFIG[pedido.estado] || ESTADO_CONFIG.confirmado;
  const IconEstado = config.icon;

  const fechaCreacion = new Date(pedido.created_at).toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header del pedido */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.color}`}>
            <IconEstado size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text variant="bodySmBold" className="text-slate-700">
                {pedido.numero_comprobante || `Pedido #${pedido.id}`}
              </Text>
              <Badge className={`text-[10px] ${config.color} border-none`}>
                {config.label}
              </Badge>
            </div>
            <Text variant="bodySm" className="text-slate-400">
              {fechaCreacion} • {pedido.lineas_count} producto{pedido.lineas_count !== 1 ? "s" : ""}
              {pedido.metodo_entrega_display && ` • ${pedido.metodo_entrega_display}`}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <Text variant="bodySmBold" className="text-slate-800">
              {formatearPrecio
                ? formatearPrecio(pedido.total_usd, "USD")
                : `US$ ${pedido.total_usd.toFixed(2)}`}
            </Text>
            {pedido.moneda_negociacion !== "USD" && pedido.total_moneda > 0 && (
              <Text variant="bodySm" className="text-slate-400 text-xs">
                {formatearPrecio
                  ? formatearPrecio(pedido.total_moneda, pedido.moneda_negociacion)
                  : `${pedido.total_moneda}`}
              </Text>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Preview de productos (siempre visible, máx 3) */}
      <div className="px-5 py-3 flex items-center gap-2">
        {pedido.lineas.slice(0, 4).map((linea) => (
          <div
            key={linea.id}
            className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative"
          >
            {linea.imagen_url ? (
              <Image
                src={linea.imagen_url}
                alt={linea.producto_nombre}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package size={16} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {pedido.lineas.length > 4 && (
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Text variant="bodySm" className="text-slate-400 font-bold text-xs">
              +{pedido.lineas.length - 4}
            </Text>
          </div>
        )}
      </div>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/50">
          {/* Timeline */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            {pedido.confirmed_at && (
              <span>Confirmado: {new Date(pedido.confirmed_at).toLocaleDateString("es-PY")}</span>
            )}
            {pedido.cobrado_at && (
              <span>Pagado: {new Date(pedido.cobrado_at).toLocaleDateString("es-PY")}</span>
            )}
            {pedido.entregado_at && (
              <span>Entregado: {new Date(pedido.entregado_at).toLocaleDateString("es-PY")}</span>
            )}
          </div>

          {/* Líneas */}
          <div className="space-y-2">
            {pedido.lineas.map((linea) => (
              <div
                key={linea.id}
                className="flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-100"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                  {linea.imagen_url ? (
                    <Image
                      src={linea.imagen_url}
                      alt={linea.producto_nombre}
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
                  <Text variant="bodySm" className="text-slate-700 font-medium truncate">
                    {linea.producto_nombre}
                  </Text>
                  <Text variant="bodySm" className="text-slate-400 text-xs">
                    {linea.variante_nombre}
                    {linea.variante_code && ` • ${linea.variante_code}`}
                  </Text>
                </div>
                <div className="text-right shrink-0">
                  <Text variant="bodySm" className="text-slate-600 font-medium">
                    x{linea.cantidad}
                  </Text>
                  <Text variant="bodySm" className="text-slate-400 text-xs">
                    US$ {linea.subtotal_usd.toFixed(2)}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          {/* Dirección de entrega */}
          {pedido.direccion_entrega && (
            <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100">
              <Text variant="label" className="text-slate-400 text-[10px]">
                Dirección de entrega
              </Text>
              <Text variant="bodySm" className="text-slate-600 mt-1">
                {pedido.direccion_entrega}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  useEffect(() => {
    fetchPedidos();
  }, [activeTab]);

  async function fetchPedidos() {
    try {
      setLoading(true);
      setError("");
      const data = await getMisPedidos(activeTab);
      setPedidos(data);
    } catch (err) {
      setError("Error al cargar tus pedidos.");
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <ShoppingBag size={18} className="text-indigo-500" />
            </div>
            <div>
              <Heading level={4} className="text-lg">
                Mis Pedidos
              </Heading>
              <Text variant="bodySm" className="mt-0.5">
                Historial de compras y estado de tus pedidos.
              </Text>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6 p-1 bg-slate-100 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
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
        ) : pedidos.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={28} className="text-indigo-300" />
            </div>
            <Heading level={5} className="text-slate-600">
              {activeTab === "todos"
                ? "No tenés pedidos aún"
                : `Sin pedidos ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}`}
            </Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">
              {activeTab === "todos"
                ? "Cuando realices tu primera compra, vas a poder ver el estado de tus pedidos acá."
                : "No hay pedidos en esta categoría."}
            </Text>
            {activeTab === "todos" && (
              <Link href="/products">
                <Button variant="outline" className="mt-4" icon={ExternalLink}>
                  Ver catálogo
                </Button>
              </Link>
            )}
          </div>
        ) : (
          /* Lista de pedidos */
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
