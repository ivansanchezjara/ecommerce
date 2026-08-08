"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  StepIdentificador,
  StepLogin,
  StepEnviarCodigo,
  StepVerificarCodigo,
  StepCrearPassword,
  StepRegistrar,
  StepExito,
} from "@/components/auth";

// ─── Máquina de pasos ────────────────────────────────────────────────────────

const PASOS = {
  IDENTIFICADOR: "identificador",
  LOGIN: "login",
  ENVIAR_CODIGO: "enviar_codigo",
  VERIFICAR_CODIGO: "verificar_codigo",
  CREAR_PASSWORD: "crear_password",
  REGISTRAR: "registrar",
  EXITO: "exito",
};

export default function LoginPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(PASOS.IDENTIFICADOR);
  const [datos, setDatos] = useState({});

  function irA(nuevoPaso, nuevosDatos = {}) {
    setDatos((prev) => ({ ...prev, ...nuevosDatos }));
    setPaso(nuevoPaso);
  }

  function handleIdentificadorNext({ identificador, estado, canal, razon_social }) {
    const base = { identificador, canal, razonSocial: razon_social };
    if (estado === "login") {
      irA(PASOS.LOGIN, base);
    } else {
      irA(PASOS.ENVIAR_CODIGO, { ...base, proposito: estado });
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {paso === PASOS.IDENTIFICADOR && (
            <StepIdentificador onNext={handleIdentificadorNext} />
          )}

          {paso === PASOS.LOGIN && (
            <StepLogin
              identificador={datos.identificador}
              razonSocial={datos.razonSocial}
              onBack={() => setPaso(PASOS.IDENTIFICADOR)}
              onSuccess={() => router.push("/")}
            />
          )}

          {paso === PASOS.ENVIAR_CODIGO && (
            <StepEnviarCodigo
              identificador={datos.identificador}
              proposito={datos.proposito}
              razonSocial={datos.razonSocial}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.IDENTIFICADOR)}
              onNext={(d) => irA(PASOS.VERIFICAR_CODIGO, d)}
            />
          )}

          {paso === PASOS.VERIFICAR_CODIGO && (
            <StepVerificarCodigo
              identificador={datos.identificador}
              proposito={datos.proposito}
              canal={datos.canal}
              razonSocial={datos.razonSocial}
              onBack={() => setPaso(PASOS.ENVIAR_CODIGO)}
              onNext={(d) => {
                if (datos.proposito === "activar") {
                  irA(PASOS.CREAR_PASSWORD, d);
                } else {
                  irA(PASOS.REGISTRAR, d);
                }
              }}
            />
          )}

          {paso === PASOS.CREAR_PASSWORD && (
            <StepCrearPassword
              identificador={datos.identificador}
              proposito={datos.proposito}
              tokenVerificacionId={datos.tokenVerificacionId}
              razonSocial={datos.razonSocial}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.VERIFICAR_CODIGO)}
              onSuccess={() => irA(PASOS.EXITO)}
            />
          )}

          {paso === PASOS.REGISTRAR && (
            <StepRegistrar
              identificador={datos.identificador}
              tokenVerificacionId={datos.tokenVerificacionId}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.VERIFICAR_CODIGO)}
              onSuccess={() => irA(PASOS.EXITO, { proposito: "registrar" })}
            />
          )}

          {paso === PASOS.EXITO && (
            <StepExito proposito={datos.proposito} />
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Necesitás ayuda?{" "}
          <Link href="/about" className="text-dental-blue hover:underline font-medium">
            Contactanos
          </Link>
        </p>
      </div>
    </div>
  );
}
