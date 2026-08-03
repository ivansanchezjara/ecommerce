"use client";
import { useTienda } from "@/app/context/TiendaContext";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const MONEDAS = [
  { codigo: "PYG", simbolo: "₲", nombre: "Guaraní" },
  { codigo: "USD", simbolo: "US$", nombre: "Dólar" },
  { codigo: "BRL", simbolo: "R$", nombre: "Real" },
];

export default function CurrencySelector() {
  const { monedaSeleccionada, setMonedaSeleccionada } = useTienda();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentMoneda = MONEDAS.find((m) => m.codigo === monedaSeleccionada) || MONEDAS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
      >
        <span className="font-bold">{currentMoneda.simbolo}</span>
        <span className="hidden sm:inline">{currentMoneda.codigo}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[140px]">
          {MONEDAS.map((moneda) => (
            <button
              key={moneda.codigo}
              onClick={() => {
                setMonedaSeleccionada(moneda.codigo);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                monedaSeleccionada === moneda.codigo
                  ? "text-gray-900 font-bold bg-gray-50"
                  : "text-gray-600"
              }`}
            >
              <span className="font-bold w-8">{moneda.simbolo}</span>
              <span>{moneda.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
