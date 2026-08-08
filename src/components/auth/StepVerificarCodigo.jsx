"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { verificarCodigo } from "@/services/auth";
import { Lock } from "lucide-react";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepVerificarCodigo({ identificador, proposito, canal, razonSocial, onNext, onBack }) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (codigo.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const { token_verificacion_id } = await verificarCodigo(identificador, codigo, proposito);
      onNext({ identificador, proposito, canal, razonSocial, tokenVerificacionId: token_verificacion_id });
    } catch (err) {
      setError(err.data?.detail || "Código incorrecto.");
      setCodigo("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo="Verificá tu código"
        subtitulo={`Ingresá el código de 6 dígitos que enviamos a tu ${canal === "email" ? "email" : "WhatsApp"}.`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <div>
        <Input
          label="Código de verificación"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          autoFocus
          required
          className="text-center text-2xl tracking-[0.5em] font-black"
        />
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          El código expira en 5 minutos.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || codigo.length !== 6}
      >
        {loading ? "Verificando..." : "Verificar código"}
      </Button>
    </form>
  );
}
