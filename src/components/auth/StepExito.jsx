"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function StepExito({ proposito }) {
  const router = useRouter();
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">✓</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900">
          {proposito === "registrar" ? "¡Bienvenido!" : "¡Cuenta activada!"}
        </h2>
        <p className="text-gray-500 text-sm mt-1.5">
          {proposito === "registrar"
            ? "Tu cuenta fue creada exitosamente. Ya podés ver precios y hacer pedidos."
            : "Tu cuenta está lista. Ya podés ingresar a la tienda."}
        </p>
      </div>
      <Button className="w-full" size="lg" onClick={() => router.push("/")}>
        Ir a la tienda
      </Button>
    </div>
  );
}
