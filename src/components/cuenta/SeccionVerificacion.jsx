"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  ShieldCheck, Building2, GraduationCap, Briefcase, Truck,
  User, FileText, Save, Loader2, CheckCircle, Info,
} from "lucide-react";
import { updatePerfil } from "@/services/auth";

/**
 * Campos de verificación según el tipo de entidad declarado.
 * Se muestra en Mi Cuenta → Datos para que el cliente complete
 * la información que el asesor necesita para evaluar su tier.
 */

const CAMPOS_POR_TIPO = {
  profesional: {
    titulo: "Datos de Profesional",
    subtitulo: "Completá tu información profesional para que un asesor pueda verificarte.",
    icon: User,
    color: "blue",
    campos: [
      { key: "especialidad", label: "Especialidad", placeholder: "Ej: Odontología, Prótesis, Cirugía...", required: true },
    ],
  },
  estudiante: {
    titulo: "Datos de Estudiante",
    subtitulo: "Completá tu formación académica en la sección correspondiente para verificar tu condición de estudiante.",
    icon: GraduationCap,
    color: "purple",
    campos: [],
    soloBanner: true,
  },
  clinica: {
    titulo: "Datos de Clínica / Consultorio",
    subtitulo: "Completá estos datos para que un asesor pueda verificar tu clínica y asignarte beneficios.",
    icon: Building2,
    color: "teal",
    campos: [
      { key: "ruc", label: "RUC", placeholder: "Ej: 80012345-6", required: true },
      { key: "nombre_comercial", label: "Nombre comercial", placeholder: "Ej: OdontoCenter, Clínica Sonrisa..." },
      { key: "contacto_compras_nombre", label: "Contacto de compras (nombre)", placeholder: "Persona que gestiona pedidos" },
      { key: "contacto_compras_telefono", label: "Teléfono de contacto de compras", placeholder: "+595 981 ..." },
    ],
  },
  institucion: {
    titulo: "Datos de Institución",
    subtitulo: "Tu institución ya está registrada. Un asesor revisará tu cuenta.",
    icon: Building2,
    color: "indigo",
    campos: [],
    soloBanner: true,
  },
  empresa: {
    titulo: "Datos de Empresa / Mayorista",
    subtitulo: "Completá estos datos para que un asesor pueda evaluar tu cuenta empresarial.",
    icon: Briefcase,
    color: "amber",
    campos: [
      { key: "ruc", label: "RUC", placeholder: "Ej: 80012345-6", required: true },
      { key: "contacto_nombre", label: "Nombre de contacto", placeholder: "Persona de contacto principal" },
      { key: "transportadora_preferida", label: "Transportadora preferida", placeholder: "Ej: Rápido Cargo, Trans Paraguay..." },
    ],
  },
};

export default function SeccionVerificacion({ cliente, onUpdated }) {
  const tipoEntidad = cliente?.tipo_entidad_declarado;
  const datosGuardados = cliente?.datos_verificacion || {};
  const config = CAMPOS_POR_TIPO[tipoEntidad];

  const [form, setForm] = useState(datosGuardados);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!tipoEntidad || !config) return null;

  // Si ya está verificado (tier diferente de público), mostrar solo una confirmación
  if (cliente?.tier_precio && cliente.tier_precio !== "publico") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle size={22} className="text-emerald-600" />
          <div>
            <Heading level={4} className="text-base text-emerald-800">Cuenta verificada</Heading>
            <Text variant="bodySm" className="text-emerald-600 mt-0.5">
              Tu asesor ya verificó tu cuenta. Disfrutás de precios con tier <strong className="capitalize">{cliente.tier_precio}</strong>.
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Solo banner (estudiante, institución) — sin campos extra
  if (config.soloBanner) {
    return (
      <div className={`rounded-2xl border p-6 shadow-sm ${getBorderColor(config.color)}`}>
        <div className="flex items-start gap-3">
          <config.icon size={20} className={getIconColor(config.color)} />
          <div>
            <Heading level={4} className="text-base">{config.titulo}</Heading>
            <Text variant="bodySm" className="text-slate-500 mt-1">{config.subtitulo}</Text>
          </div>
        </div>
      </div>
    );
  }

  // Formulario con campos
  const todosLlenos = config.campos
    .filter((c) => c.required)
    .every((c) => form[c.key]?.trim());

  async function handleSave() {
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      await updatePerfil({ datos_verificacion: form });
      setSaved(true);
      onUpdated?.();
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setError(err.data?.detail || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-sm ${getBorderColor(config.color)}`}>
      <div className="flex items-start gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${getBgColor(config.color)}`}>
          <config.icon size={18} className={getIconColor(config.color)} />
        </div>
        <div>
          <Heading level={4} className="text-base">{config.titulo}</Heading>
          <Text variant="bodySm" className="text-slate-500 mt-0.5">{config.subtitulo}</Text>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2 bg-slate-50 rounded-xl px-4 py-3 mb-5">
        <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <Text variant="bodySm" className="text-slate-500 text-xs">
          Estos datos los usará tu asesor de ventas para verificar tu cuenta y habilitar precios especiales.
          No cambian tu acceso actual.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.campos.map((campo) => (
          <div key={campo.key}>
            <Input
              label={campo.label}
              value={form[campo.key] || ""}
              onChange={(e) => setForm((f) => ({ ...f, [campo.key]: e.target.value }))}
              placeholder={campo.placeholder}
              icon={campo.key === "ruc" ? FileText : campo.key.includes("transport") ? Truck : User}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-500 font-medium">{error}</p>
      )}

      <div className="flex items-center gap-3 mt-5">
        <Button
          onClick={handleSave}
          disabled={saving || !todosLlenos}
          size="sm"
          icon={saving ? Loader2 : Save}
          className={saving ? "[&>svg]:animate-spin" : ""}
        >
          {saving ? "Guardando..." : "Guardar datos"}
        </Button>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle size={14} />
            Guardado. Tu asesor será notificado.
          </span>
        )}
      </div>
    </div>
  );
}

function getBorderColor(color) {
  const map = {
    blue: "border-blue-200",
    teal: "border-teal-200",
    amber: "border-amber-200",
    purple: "border-purple-200",
    indigo: "border-indigo-200",
  };
  return map[color] || "border-slate-200";
}

function getBgColor(color) {
  const map = {
    blue: "bg-blue-50",
    teal: "bg-teal-50",
    amber: "bg-amber-50",
    purple: "bg-purple-50",
    indigo: "bg-indigo-50",
  };
  return map[color] || "bg-slate-50";
}

function getIconColor(color) {
  const map = {
    blue: "text-blue-600",
    teal: "text-teal-600",
    amber: "text-amber-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
  };
  return map[color] || "text-slate-600";
}
