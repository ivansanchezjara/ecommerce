"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { activarCuenta } from "@/services/auth";
import { Lock, Eye, EyeOff } from "lucide-react";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepCrearPassword({ identificador, proposito, tokenVerificacionId, razonSocial, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const esActivar = proposito === "activar";

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (esActivar) {
        await activarCuenta(identificador, password, tokenVerificacionId);
      }
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Error al crear la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo="Creá tu contraseña"
        subtitulo={`Elegí una contraseña segura para tu cuenta${razonSocial ? ` (${razonSocial})` : ""}.`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        icon={Lock}
        autoFocus
        required
        helperText="Usá letras, números y símbolos para mayor seguridad."
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
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 -mt-2"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseñas
      </button>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !password || !confirmar}
      >
        {loading ? "Guardando..." : "Confirmar contraseña"}
      </Button>
    </form>
  );
}
