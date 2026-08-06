"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionPedidos from "@/components/cuenta/SeccionPedidos";

export default function PedidosPage() {
  return (
    <CuentaPageWrapper title="Mis Pedidos" description="Historial de compras y estado de tus envíos.">
      <SeccionPedidos />
    </CuentaPageWrapper>
  );
}
