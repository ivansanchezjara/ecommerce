"use client";
import { Text } from "../basics/Typography";

/**
 * Pantalla de carga minimalista con spinner.
 *
 * @param {string} texto - Mensaje de carga (default: "Cargando")
 */
export default function LoadingScreen({ texto = "Cargando" }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-transparent min-h-[400px] animate-in fade-in duration-1000">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-12 h-12 border-[1.5px] border-slate-200 rounded-full" />
        <div className="absolute w-12 h-12 border-[1.5px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <div className="text-center select-none">
        <Text
          variant="caption"
          className="text-slate-400 tracking-[0.4em] animate-pulse font-medium text-[10px]"
        >
          {texto}
        </Text>
      </div>
    </div>
  );
}
