"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button, Input } from "@/components/ui";
import { restablecerPassword } from "@/services/auth";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepNuevaPassword({ identificador, tokenVerificacionId, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login: setAuthState } = useAuth();

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
      await restablecerPassword(identificador, password, tokenVerificacionId);
      onSuccess();
    } catch (err) {
      setError(err?.data?.detail || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo="Nueva contraseña"
        subtitulo="Elegí una contraseña segura para tu cuenta."
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Nueva contraseña"
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
        {loading ? "Guardando..." : "Confirmar nueva contraseña"}
      </Button>
    </form>
  );
}
