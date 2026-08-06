"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionDirecciones from "@/components/cuenta/SeccionDirecciones";

export default function DireccionesPage() {
  return (
    <CuentaPageWrapper title="Mis Direcciones" description="Direcciones de envío y entrega guardadas.">
      <SeccionDirecciones />
    </CuentaPageWrapper>
  );
}
