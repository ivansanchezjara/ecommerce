"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionEvaluaciones from "@/components/cuenta/SeccionEvaluaciones";

export default function EvaluacionesPage() {
  return (
    <CuentaPageWrapper title="Mis Reseñas" description="Evaluaciones de productos que compraste.">
      <SeccionEvaluaciones />
    </CuentaPageWrapper>
  );
}
