"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Cargar carrito desde localStorage al iniciar (solo en cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedCart = localStorage.getItem("ecommerce_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {
      // localStorage corrupto — arrancar con carrito vacío
    }
  }, []);

  // Guardar en localStorage cada vez que cambie (solo en cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ecommerce_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const key = product.variante_id || product.product_code;
      const existing = prev.find((item) => (item.variante_id || item.product_code) === key);
      if (existing) {
        return prev.map((item) =>
          (item.variante_id || item.product_code) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (key) => {
    setCart((prev) => {
      const existing = prev.find((item) => (item.variante_id || item.product_code) === key);
      if (existing && existing.quantity === 1) {
        return prev.filter((item) => (item.variante_id || item.product_code) !== key);
      }
      return prev.map((item) =>
        (item.variante_id || item.product_code) === key
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => (item.variante_id || item.product_code) !== key));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
