"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getConfig, getTipoCambio } from "@/services/tienda";

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [tipoCambio, setTipoCambio] = useState(null);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState("PYG");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const [configData, tcData] = await Promise.all([
          getConfig(),
          getTipoCambio(),
        ]);
        setConfig(configData);
        setTipoCambio(tcData);
      } catch (err) {
        setError(err.message);
        console.error("Error cargando configuración de tienda:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  /**
   * Convierte un precio en USD a la moneda seleccionada.
   */
  function convertirPrecio(precioUSD) {
    if (!precioUSD) return 0;
    if (monedaSeleccionada === "USD") return precioUSD;
    if (!tipoCambio?.tasas?.[monedaSeleccionada]) return precioUSD;

    const tasa = parseFloat(tipoCambio.tasas[monedaSeleccionada].valor);
    return precioUSD * tasa;
  }

  /**
   * Formatea un precio según la moneda seleccionada.
   */
  function formatearPrecio(precioUSD) {
    const convertido = convertirPrecio(precioUSD);
    const simbolos = { USD: "US$", PYG: "₲", BRL: "R$" };
    const simbolo = simbolos[monedaSeleccionada] || "$";

    if (monedaSeleccionada === "PYG") {
      return `${simbolo} ${Math.round(convertido).toLocaleString("es-PY")}`;
    }
    return `${simbolo} ${convertido.toLocaleString("es-PY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <TiendaContext.Provider
      value={{
        config,
        tipoCambio,
        monedaSeleccionada,
        setMonedaSeleccionada,
        convertirPrecio,
        formatearPrecio,
        loading,
        error,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

export function useTienda() {
  const context = useContext(TiendaContext);
  if (!context) {
    throw new Error("useTienda debe usarse dentro de TiendaProvider");
  }
  return context;
}
