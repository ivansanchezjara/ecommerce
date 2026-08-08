"use client";

import { useState } from "react";
import { Button, Input, PhoneInput, validatePhone, buildPhoneValue } from "@/components/ui";
import { registrarCliente } from "@/services/auth";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepRegistrar({ identificador, tokenVerificacionId, canal, onSuccess, onBack }) {
  const [razonSocial, setRazonSocial] = useState("");
  const [tipoEntidad, setTipoEntidad] = useState("");
  const [celularPrefix, setCelularPrefix] = useState("+595");
  const [celularNumero, setCelularNumero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const esEmail = identificador.includes("@");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmar) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (!razonSocial.trim()) { setError("El nombre es requerido."); return; }

    if (esEmail && celularNumero.trim()) {
      const phoneError = validatePhone(celularPrefix, celularNumero);
      if (phoneError) { setError(phoneError); return; }
    }

    setError("");
    setLoading(true);
    try {
      await registrarCliente({
        identificador,
        password,
        razon_social: razonSocial.trim(),
        celular: esEmail
          ? buildPhoneValue(celularPrefix, celularNumero)
          : identificador,
        tipo_entidad: tipoEntidad,
        tokenVerificacionId,
      });
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StepHeader
        titulo="Completá tus datos"
        subtitulo="Casi listo. Completá tu información para crear la cuenta."
        onBack={onBack}
        icon={User}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Nombre completo o razón social"
        type="text"
        value={razonSocial}
        onChange={(e) => setRazonSocial(e.target.value)}
        placeholder="Ej: Juan Pérez o Clínica Dental"
        icon={User}
        autoFocus
        required
      />

      {/* Tipo de entidad */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          ¿Qué tipo de entidad sos?
        </label>
        <select
          value={tipoEntidad}
          onChange={(e) => setTipoEntidad(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue/30 outline-none transition-colors"
        >
          <option value="">Seleccioná una opción</option>
          <option value="profesional">Profesional independiente (odontólogo, protesista, etc.)</option>
          <option value="estudiante">Estudiante</option>
          <option value="clinica">Clínica / Consultorio</option>
          <option value="institucion">Institución educativa</option>
          <option value="empresa">Empresa / Mayorista</option>
        </select>
        <p className="text-xs text-gray-400">
          Esto nos ayuda a ofrecerte una mejor experiencia. Tu asesor de ventas te contactará para confirmar beneficios.
        </p>
      </div>

      {esEmail && (
        <PhoneInput
          label="Celular (opcional)"
          prefix={celularPrefix}
          onPrefixChange={setCelularPrefix}
          value={celularNumero}
          onChange={(e) => setCelularNumero(e.target.value)}
          helperText="Para recibir notificaciones por WhatsApp."
          error={celularNumero ? validatePhone(celularPrefix, celularNumero) : ""}
        />
      )}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        icon={Lock}
        required
      />

      <Input
        label="Confirmar contraseña"
        type={showPassword ? "text" : "password"}
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Repetí tu contraseña"
        icon={Lock}
        required
        error={confirmar && password !== confirmar ? "Las contraseñas no coinciden" : ""}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseñas
      </button>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !razonSocial || !password || !confirmar}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Al registrarte aceptás nuestros{" "}
        <Link href="/about" className="text-dental-blue hover:underline">
          términos de uso
        </Link>
        .
      </p>
    </form>
  );
}
