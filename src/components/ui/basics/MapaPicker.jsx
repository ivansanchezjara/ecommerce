"use client";
import dynamic from "next/dynamic";

/**
 * MapaPicker — Wrapper que carga el mapa solo en el cliente.
 * Leaflet accede a `window` al nivel de módulo, así que necesitamos
 * desactivar SSR completamente para este componente.
 */
const MapaPicker = dynamic(
  () => import("./MapaPickerClient"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[250px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
        <span className="text-xs text-slate-400">Cargando mapa...</span>
      </div>
    ),
  }
);

export default MapaPicker;
