"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button, Input } from "@/components/ui";
import { Lock, Eye, EyeOff } from "lucide-react";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepLogin({ identificador, razonSocial, onBack, onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identificador, password);
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Contraseña incorrecta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo={`Hola, ${razonSocial?.split(" ")[0] || "bienvenido"}`}
        subtitulo={`Ingresando como ${identificador}`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Tu contraseña"
        icon={Lock}
        autoComplete="current-password"
        autoFocus
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 -mt-2"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseña
      </button>

      <Button type="submit" className="w-full" size="lg" disabled={loading || !password}>
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
