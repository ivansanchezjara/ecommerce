"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Phone, Mail, ArrowLeft } from "lucide-react";

export default function CuentaSuspendidaPage() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const msg = sessionStorage.getItem("cuenta_bloqueada_mensaje");
    if (msg) {
      setMensaje(msg);
      sessionStorage.removeItem("cuenta_bloqueada_mensaje");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
        {/* Ícono */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          Cuenta Suspendida
        </h1>

        {/* Mensaje */}
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {mensaje || (
            "Su cuenta ha sido suspendida temporalmente debido a pagos pendientes. "
            + "No es posible acceder a la tienda ni consultar precios hasta regularizar su situación."
          )}
        </p>

        {/* Separador */}
        <div className="border-t border-slate-200 my-6" />

        {/* Contacto */}
        <div className="text-left space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Para regularizar su cuenta, contacte a:
          </p>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-700">Departamento de Cobranzas</p>
              <p className="text-xs text-slate-400">Lunes a Viernes, 8:00 a 17:00</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-700">cobranzas@empresa.com</p>
              <p className="text-xs text-slate-400">Respuesta en 24h hábiles</p>
            </div>
          </div>
        </div>

        {/* Link volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
