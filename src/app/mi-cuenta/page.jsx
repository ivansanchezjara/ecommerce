"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getPerfil } from "@/services/auth";
import {
  getMisPedidos,
  getWishlistIds,
  getMisCupones,
  getMisSolicitudesAsistencia,
  getDirecciones,
} from "@/services/cuenta";
import { LogOut } from "lucide-react";
import ProfileCard from "@/components/cuenta/ProfileCard";
import SeccionesGrid from "@/components/cuenta/SeccionesGrid";
import CuentaHeader from "@/components/cuenta/CuentaHeader";

export default function MiCuentaPage() {
  const router = useRouter();
  const { isLoggedIn, cliente, loading: authLoading, logout } = useAuth();
  const [perfilData, setPerfilData] = useState(null);
  const [counts, setCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    getPerfil().then(setPerfilData).catch(() => setPerfilData(cliente));
  }, [isLoggedIn, cliente]);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchCounts() {
      try {
        const [pedidos, wishlistIds, cupones, asistencia, direcciones] =
          await Promise.allSettled([
            getMisPedidos("por_pagar"),
            getWishlistIds(),
            getMisCupones("disponibles"),
            getMisSolicitudesAsistencia(),
            getDirecciones(),
          ]);

        setCounts({
          pedidos: pedidos.status === "fulfilled" ? pedidos.value.length : 0,
          wishlist:
            wishlistIds.status === "fulfilled"
              ? wishlistIds.value.producto_ids?.length || 0
              : 0,
          cupones: cupones.status === "fulfilled" ? cupones.value.length : 0,
          asistencia:
            asistencia.status === "fulfilled"
              ? asistencia.value.filter(
                  (s) => s.estado !== "completada" && s.estado !== "rechazada"
                ).length
              : 0,
          direcciones:
            direcciones.status === "fulfilled" ? direcciones.value.length : 0,
        });
      } catch {
        // Counters son opcionales
      } finally {
        setLoadingCounts(false);
      }
    }
    fetchCounts();
  }, [isLoggedIn]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (authLoading) return null;

  const datosCliente = perfilData || cliente;

  return (
    <div className="min-h-[80vh] bg-slate-50/50">
      <CuentaHeader title="Mi Cuenta" />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Mobile: Perfil primero */}
        <div className="lg:hidden mb-6">
          <ProfileCard cliente={datosCliente} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8">
              <ProfileCard cliente={datosCliente} />
            </div>
          </aside>

          {/* Secciones */}
          <main className="lg:col-span-9">
            <SeccionesGrid counts={counts} loadingCounts={loadingCounts} />
          </main>
        </div>

        {/* Logout — al fondo, separado del perfil */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-red-100 font-bold text-sm transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
