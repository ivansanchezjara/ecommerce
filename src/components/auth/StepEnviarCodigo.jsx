"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { enviarCodigo } from "@/services/auth";
import { Mail, RefreshCw } from "lucide-react";
import StepHeader from "./StepHeader";
import ErrorBanner from "./ErrorBanner";

export default function StepEnviarCodigo({ identificador, proposito, razonSocial, canal, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const esActivar = proposito === "activar";
  const canalLabel = canal === "email" ? "email" : "WhatsApp";

  async function enviar() {
    setError("");
    setLoading(true);
    try {
      const resp = await enviarCodigo(identificador, proposito);
      setEnviado(true);
      setCooldown(resp.cooldown_segundos ?? 60);
      if (resp.preview_url) window.open(resp.preview_url, "_blank");
    } catch (err) {
      const data = err.data || {};
      if (err.status === 429) {
        if (data.bloqueado) {
          setBloqueado(true);
          setError(data.detail);
        } else {
          setCooldown(data.cooldown_restante ?? 60);
          setError(data.detail);
        }
      } else {
        setError(data.detail || "Error enviando el código.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <StepHeader
        titulo={esActivar ? "Activar tu cuenta" : "Crear cuenta nueva"}
        subtitulo={
          esActivar
            ? `Hola ${razonSocial?.split(" ")[0] || ""}. Tu cuenta está lista, solo falta crear una contraseña.`
            : "Te enviaremos un código para verificar tu identidad."
        }
        onBack={onBack}
        icon={Mail}
      />

      {error && <ErrorBanner mensaje={error} />}

      {bloqueado ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 text-center">
          <p className="font-semibold mb-1">Demasiados intentos</p>
          <p>Esperá 10 minutos antes de solicitar un nuevo código.</p>
        </div>
      ) : !enviado ? (
        <>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700">
            Te enviaremos un código de 6 dígitos a tu <strong>{canalLabel}</strong>:{" "}
            <span className="font-semibold">{identificador}</span>
          </div>
          <Button className="w-full" size="lg" onClick={enviar} disabled={loading}>
            {loading ? "Enviando..." : `Enviar código por ${canalLabel}`}
          </Button>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
            ✓ Código enviado a <strong>{identificador}</strong>. Revisá tu {canalLabel}.
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => onNext({ identificador, proposito, canal, razonSocial })}
          >
            Tengo mi código →
          </Button>
          <button
            type="button"
            onClick={enviar}
            disabled={loading || cooldown > 0}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {cooldown > 0
              ? `Reenviar en ${cooldown}s`
              : "Reenviar código"}
          </button>
        </>
      )}
    </div>
  );
}
