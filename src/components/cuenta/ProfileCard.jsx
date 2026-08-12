"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  Pencil,
  GraduationCap,
  Briefcase,
  Phone,
  MapPin,
  ShieldCheck,
  Building2,
  Stethoscope,
} from "lucide-react";

const CATEGORIAS = {
  odontologo: "Odontólogo/a",
  estudiante: "Estudiante",
  protesista: "Protesista",
  profesor: "Profesor/a",
  cliente_casual: "Cliente Casual",
};

const TIER_LABELS = {
  publico: "Público",
  estudiante: "Estudiante",
  reventa: "Reventa",
  mayorista: "Mayorista",
  intercompany: "Intercompany",
};

export default function ProfileCard({ cliente }) {
  const inicial = (cliente?.razon_social?.[0] || "?").toUpperCase();
  const tipoCuenta = cliente?.tipo_cuenta; // "persona" | "clinica" | "empresa"

  // Determinar ícono y label según tipo de cuenta
  const tipoInfo = getTipoInfo(tipoCuenta, cliente);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      {/* Avatar + Nombre + Editar */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-dental-blue text-xl font-black text-white">
          {inicial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Heading level={4} className="text-base truncate">
              {cliente?.tratamiento ? `${cliente.tratamiento} ` : ""}
              {cliente?.razon_social || "Cliente"}
            </Heading>
            <Link
              href="/mi-cuenta/datos"
              className="p-1.5 rounded-lg text-slate-400 hover:text-dental-blue hover:bg-dental-blue/10 transition-colors shrink-0"
              title="Editar perfil"
            >
              <Pencil size={14} />
            </Link>
          </div>

          {/* Tipo de cuenta + tier (sin redundancia) */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge className={`text-[10px] border-none ${tipoInfo.badgeColor}`}>
              <tipoInfo.icon size={10} className="mr-1" />
              {tipoInfo.label}
            </Badge>
            {/* Solo mostrar tier si aporta info diferente a la categoría */}
            {cliente?.tier_precio && !esTierRedundante(cliente.categoria, cliente.tier_precio) && (
              <Badge variant="info" className="text-[10px]">
                {TIER_LABELS[cliente.tier_precio] || cliente.tier_precio}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Info de contacto */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
        {cliente?.telefono && (
          <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-slate-400 shrink-0" />
            <Text variant="bodySm" className="text-slate-600 text-xs">
              {cliente.telefono}
            </Text>
          </div>
        )}
        {(cliente?.ciudad || cliente?.departamento) && (
          <div className="flex items-center gap-2.5">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <Text variant="bodySm" className="text-slate-600 text-xs">
              {[cliente.ciudad, cliente.departamento].filter(Boolean).join(", ")}
            </Text>
          </div>
        )}
        {cliente?.correo_electronico && (
          <Text variant="bodySm" className="text-slate-400 text-xs pl-[23px]">
            {cliente.correo_electronico}
          </Text>
        )}
      </div>

      {/* Registro profesional (solo personas con matrícula) */}
      {tipoCuenta === "persona" && cliente?.registro_profesional?.vigente && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <Text variant="bodySm" className="text-emerald-700 text-xs font-semibold">
            Profesional verificado
          </Text>
        </div>
      )}

      {/* Formaciones (personas) */}
      {tipoCuenta === "persona" && cliente?.formaciones?.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5">
          <GraduationCap size={13} className="text-slate-400 mt-0.5 shrink-0" />
          <Text variant="bodySm" className="text-slate-500 text-xs leading-relaxed">
            {cliente.formaciones
              .slice(0, 2)
              .map((f) => f.titulo_obtenido || f.oferta_academica || f.tipo_display)
              .join(" • ")}
          </Text>
        </div>
      )}

      {/* Lugar de trabajo (personas) */}
      {tipoCuenta === "persona" && cliente?.vinculos_laborales?.length > 0 && (
        <div className="mt-2.5 flex items-start gap-2.5">
          <Briefcase size={13} className="text-slate-400 mt-0.5 shrink-0" />
          <Text variant="bodySm" className="text-slate-500 text-xs leading-relaxed">
            {cliente.vinculos_laborales
              .filter((v) => v.activo)
              .slice(0, 2)
              .map((v) => v.clinica)
              .join(" • ")}
          </Text>
        </div>
      )}

      {/* Nombre comercial (clínicas) */}
      {tipoCuenta === "clinica" && cliente?.nombre_comercial && (
        <div className="mt-4 flex items-start gap-2.5">
          <Building2 size={13} className="text-slate-400 mt-0.5 shrink-0" />
          <Text variant="bodySm" className="text-slate-500 text-xs leading-relaxed">
            {cliente.nombre_comercial}
          </Text>
        </div>
      )}
    </div>
  );
}

/**
 * Determina ícono, label y color según tipo de cuenta.
 */
function getTipoInfo(tipoCuenta, cliente) {
  switch (tipoCuenta) {
    case "persona": {
      const cat = cliente?.categoria;
      if (cat && CATEGORIAS[cat]) {
        return {
          label: CATEGORIAS[cat],
          icon: cat === "odontologo" || cat === "protesista" ? Stethoscope : GraduationCap,
          badgeColor: "bg-blue-100 text-blue-700",
        };
      }
      return { label: "Persona", icon: Stethoscope, badgeColor: "bg-blue-100 text-blue-700" };
    }
    case "clinica":
      return { label: "Clínica", icon: Building2, badgeColor: "bg-teal-100 text-teal-700" };
    case "empresa":
      return { label: "Empresa", icon: Building2, badgeColor: "bg-slate-100 text-slate-700" };
    default:
      return { label: "Cliente", icon: Stethoscope, badgeColor: "bg-slate-100 text-slate-600" };
  }
}

/**
 * Determina si el tier de precio es redundante con la categoría mostrada.
 * Ej: categoría "estudiante" + tier "estudiante" → redundante.
 */
function esTierRedundante(categoria, tierPrecio) {
  if (!categoria || !tierPrecio) return false;
  // Si la categoría y el tier son el mismo concepto, no mostrar ambos
  if (categoria === tierPrecio) return true;
  // "publico" es el default, no aporta info nueva
  if (tierPrecio === "publico") return true;
  return false;
}
