"use client";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionWishlist from "@/components/cuenta/SeccionWishlist";

export default function WishlistPage() {
  return (
    <CuentaPageWrapper title="Mis Favoritos" description="Productos guardados en tu lista de deseos.">
      <SeccionWishlist />
    </CuentaPageWrapper>
  );
}
