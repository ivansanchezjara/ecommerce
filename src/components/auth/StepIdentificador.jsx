"use client";

import { useState } from "react";
import { Button, Input, PhoneInput, validatePhone, buildPhoneValue } from "@/components/ui";
import { verificarIdentidad } from "@/services/auth";
import { Mail, Phone } from "lucide-react";
import ErrorBanner from "./ErrorBanner";

export default function StepIdentificador({ onNext }) {
  const [modoEmail, setModoEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+595");
  const [numeroLocal, setNumeroLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    let idFinal;

    if (modoEmail) {
      if (!email.trim()) return;
      idFinal = email.trim();
    } else {
      const phoneError = validatePhone(prefix, numeroLocal);
      if (phoneError) { setError(phoneError); return; }
      idFinal = buildPhoneValue(prefix, numeroLocal);
    }

    setLoading(true);
    try {
      const resultado = await verificarIdentidad(idFinal);
      onNext({ identificador: idFinal, ...resultado });
    } catch (err) {
      setError(err.data?.detail || "Error al verificar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function cambiarModo() {
    setModoEmail((m) => !m);
    setError("");
    setEmail("");
    setNumeroLocal("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-dental-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4">
          {modoEmail ? <Mail size={26} className="text-dental-blue" /> : <Phone size={26} className="text-dental-blue" />}
        </div>
        <h1 className="text-2xl font-black text-gray-900">Ingresar a la Tienda</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {modoEmail
            ? "Ingresá tu dirección de email para continuar."
            : "Ingresá tu número de celular para continuar."}
        </p>
      </div>

      {error && <ErrorBanner mensaje={error} />}

      {modoEmail ? (
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ej: usuario@email.com"
          icon={Mail}
          autoComplete="email"
          autoFocus
          required
        />
      ) : (
        <PhoneInput
          label="Número de celular"
          prefix={prefix}
          onPrefixChange={setPrefix}
          value={numeroLocal}
          onChange={(e) => setNumeroLocal(e.target.value)}
          required
          autoFocus
        />
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || (modoEmail ? !email.trim() : !numeroLocal.trim())}
      >
        {loading ? "Verificando..." : "Continuar"}
      </Button>

      <button
        type="button"
        onClick={cambiarModo}
        className="w-full text-center text-sm text-gray-400 hover:text-dental-blue transition-colors"
      >
        {modoEmail
          ? "¿Preferís usar tu celular? Ingresá con WhatsApp"
          : "¿Preferís usar email? Ingresá con tu correo"}
      </button>
    </form>
  );
}
