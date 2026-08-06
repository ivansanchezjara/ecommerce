"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionCupones from "@/components/cuenta/SeccionCupones";

export default function CuponesPage() {
  return (
    <CuentaPageWrapper title="Mis Cupones" description="Cupones de descuento disponibles para tus compras.">
      <SeccionCupones />
    </CuentaPageWrapper>
  );
}
