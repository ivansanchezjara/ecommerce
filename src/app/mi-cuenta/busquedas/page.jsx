"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionHistorialBusqueda from "@/components/cuenta/SeccionHistorialBusqueda";

export default function BusquedasPage() {
  return (
    <CuentaPageWrapper title="Historial de Búsquedas" description="Tus búsquedas recientes en la tienda.">
      <SeccionHistorialBusqueda />
    </CuentaPageWrapper>
  );
}
