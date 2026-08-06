"use client";

import Link from "next/link";
import { Text } from "@/components/ui";
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Search,
  Ticket,
  Wrench,
  Wallet,
  MessageSquare,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Configuración de secciones agrupadas ────────────────────────────────────

const GRUPOS_SECCIONES = [
  {
    titulo: "Compras",
    secciones: [
      {
        id: "pedidos",
        href: "/mi-cuenta/pedidos",
        label: "Mis Pedidos",
        desc: "Historial y estado de envíos",
        icon: ShoppingBag,
        color: "bg-indigo-100 text-indigo-600",
        countKey: "pedidos",
      },
      {
        id: "wishlist",
        href: "/mi-cuenta/wishlist",
        label: "Favoritos",
        desc: "Tu lista de deseos",
        icon: Heart,
        color: "bg-pink-100 text-pink-600",
        countKey: "wishlist",
      },
      {
        id: "cupones",
        href: "/mi-cuenta/cupones",
        label: "Cupones",
        desc: "Descuentos disponibles",
        icon: Ticket,
        color: "bg-green-100 text-green-600",
        countKey: "cupones",
      },
    ],
  },
  {
    titulo: "Mi Cuenta",
    secciones: [
      {
        id: "datos",
        href: "/mi-cuenta/datos",
        label: "Mis Datos",
        desc: "Información personal y contacto",
        icon: User,
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: "direcciones",
        href: "/mi-cuenta/direcciones",
        label: "Direcciones",
        desc: "Direcciones de envío",
        icon: MapPin,
        color: "bg-emerald-100 text-emerald-600",
        countKey: "direcciones",
      },
      {
        id: "formas-pago",
        href: "/mi-cuenta/formas-pago",
        label: "Formas de Pago",
        desc: "Métodos guardados",
        icon: Wallet,
        color: "bg-purple-100 text-purple-600",
      },
    ],
  },
  {
    titulo: "Soporte",
    secciones: [
      {
        id: "asistencia",
        href: "/mi-cuenta/asistencia",
        label: "Asistencia Técnica",
        desc: "Garantías y reparaciones",
        icon: Wrench,
        color: "bg-orange-100 text-orange-600",
        countKey: "asistencia",
      },
      {
        id: "evaluaciones",
        href: "/mi-cuenta/evaluaciones",
        label: "Mis Reseñas",
        desc: "Evaluaciones de productos",
        icon: MessageSquare,
        color: "bg-amber-100 text-amber-600",
      },
      {
        id: "busquedas",
        href: "/mi-cuenta/busquedas",
        label: "Búsquedas",
        desc: "Tu historial de búsquedas",
        icon: Search,
        color: "bg-violet-100 text-violet-600",
      },
    ],
  },
];

// ─── Card individual ─────────────────────────────────────────────────────────

function SeccionCard({ seccion, count }) {
  const Icon = seccion.icon;

  return (
    <Link
      href={seccion.href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md hover:scale-[1.01]"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${seccion.color}`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text variant="bodySmBold" className="text-slate-800 text-sm">
            {seccion.label}
          </Text>
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-dental-blue/10 px-1.5 text-[10px] font-bold text-dental-blue">
              {count}
            </span>
          )}
        </div>
        <Text variant="bodySm" className="text-slate-400 text-xs mt-0.5">
          {seccion.desc}
        </Text>
      </div>
      <ChevronRight
        size={16}
        className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0"
      />
    </Link>
  );
}

// ─── Grid completo ───────────────────────────────────────────────────────────

export default function SeccionesGrid({ counts = {}, loadingCounts = false }) {
  return (
    <div className="space-y-6">
      {GRUPOS_SECCIONES.map((grupo) => (
        <section key={grupo.titulo}>
          <Text variant="label" className="text-slate-400 mb-3 px-1">
            {grupo.titulo}
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {grupo.secciones.map((seccion) => (
              <SeccionCard
                key={seccion.id}
                seccion={seccion}
                count={seccion.countKey ? counts[seccion.countKey] || 0 : 0}
              />
            ))}
          </div>
        </section>
      ))}

      {loadingCounts && (
        <div className="flex items-center justify-center py-2">
          <Loader2 size={14} className="animate-spin text-slate-300 mr-2" />
          <Text variant="bodySm" className="text-slate-300 text-xs">
            Cargando resumen...
          </Text>
        </div>
      )}
    </div>
  );
}
