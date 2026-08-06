"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionAsistencia from "@/components/cuenta/SeccionAsistencia";

export default function AsistenciaPage() {
  return (
    <CuentaPageWrapper title="Asistencia Técnica" description="Solicitudes de garantía, reparación y soporte técnico.">
      <SeccionAsistencia />
    </CuentaPageWrapper>
  );
}
