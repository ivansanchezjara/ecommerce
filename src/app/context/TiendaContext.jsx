"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getConfig, getTipoCambio } from "@/services/tienda";

const STORAGE_KEY_MONEDA = "ecommerce_moneda";
const MONEDAS_VALIDAS = ["PYG", "USD", "BRL"];

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [tipoCambio, setTipoCambio] = useState(null);
  const [monedaSeleccionada, setMonedaSeleccionadaState] = useState("PYG");
  const [loading, setLoading] = useState(true);
  const [tipoCambioLoading, setTipoCambioLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restaurar moneda persistida al montar
  useEffect(() => {
    const guardada = localStorage.getItem(STORAGE_KEY_MONEDA);
    if (guardada && MONEDAS_VALIDAS.includes(guardada)) {
      setMonedaSeleccionadaState(guardada);
    }
  }, []);

  // Persistir moneda al cambiar
  const setMonedaSeleccionada = useCallback((moneda) => {
    if (!MONEDAS_VALIDAS.includes(moneda)) return;
    localStorage.setItem(STORAGE_KEY_MONEDA, moneda);
    setMonedaSeleccionadaState(moneda);
  }, []);

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
        setTipoCambioLoading(false);
      }
    }
    fetchConfig();
  }, []);

  /**
   * Convierte un precio en USD a la moneda seleccionada.
   * Devuelve null si precioUSD es null/undefined (precio desconocido),
   * y 0 solo si precioUSD es explícitamente 0 (producto gratis).
   */
  function convertirPrecio(precioUSD) {
    if (precioUSD == null) return null;
    if (monedaSeleccionada === "USD") return precioUSD;
    if (!tipoCambio?.tasas?.[monedaSeleccionada]) return precioUSD;

    const tasa = parseFloat(tipoCambio.tasas[monedaSeleccionada].valor);
    return precioUSD * tasa;
  }

  /**
   * Formatea un precio según la moneda seleccionada.
   * Devuelve null si el precio es desconocido (para renderizar skeleton en UI).
   */
  function formatearPrecio(precioUSD) {
    const convertido = convertirPrecio(precioUSD);
    if (convertido == null) return null;

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
        tipoCambioLoading,
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
