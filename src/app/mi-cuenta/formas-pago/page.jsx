"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionFormasPago from "@/components/cuenta/SeccionFormasPago";

export default function FormasPagoPage() {
  return (
    <CuentaPageWrapper title="Formas de Pago" description="Métodos de pago guardados para tus compras.">
      <SeccionFormasPago />
    </CuentaPageWrapper>
  );
}
