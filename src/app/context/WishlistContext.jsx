"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getWishlistIds, toggleWishlist } from "@/services/cuenta";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [productoIds, setProductoIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Cargar IDs cuando el usuario está logueado
  useEffect(() => {
    if (!isLoggedIn) {
      setProductoIds(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getWishlistIds();
        if (!cancelled) {
          setProductoIds(new Set(data.producto_ids || []));
        }
      } catch {
        // Silenciar errores — no bloquear la app por la wishlist
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const isInWishlist = useCallback(
    (productoId) => productoIds.has(productoId),
    [productoIds]
  );

  const toggle = useCallback(
    async (productoId) => {
      if (!isLoggedIn) return null;

      // Optimistic update
      setProductoIds((prev) => {
        const next = new Set(prev);
        if (next.has(productoId)) {
          next.delete(productoId);
        } else {
          next.add(productoId);
        }
        return next;
      });

      try {
        const result = await toggleWishlist(productoId);
        return result;
      } catch {
        // Revertir en caso de error
        setProductoIds((prev) => {
          const next = new Set(prev);
          if (next.has(productoId)) {
            next.delete(productoId);
          } else {
            next.add(productoId);
          }
          return next;
        });
        return null;
      }
    },
    [isLoggedIn]
  );

  return (
    <WishlistContext.Provider value={{ isInWishlist, toggle, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  }
  return context;
}
