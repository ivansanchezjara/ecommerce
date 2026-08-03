"use client";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ArrowRight, User } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import CategoriesMenu from "./CategoriesMenu";
import CurrencySelector from "@/components/ui/CurrencySelector";

export default function MainHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const { isLoggedIn, cliente, logout } = useAuth();
  const { config } = useTienda();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Sobre Nosotros", href: "/about" },
  ];

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Tienda";
  const logoUrl = config?.logo_url;

  return (
    <header className="w-full sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-4 p-3 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center transition-opacity hover:opacity-90 active:scale-95"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo ${nombreEmpresa}`}
              className="h-10 md:h-12 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {nombreEmpresa}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 self-stretch">
          <CategoriesMenu />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center h-full transition-colors hover:text-gray-900 ${
                pathname === link.href ? "text-gray-900 font-medium" : ""
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-[-13px] left-0 w-full h-0.5 bg-gray-900" />
              )}
            </Link>
          ))}
        </nav>

        <SearchBar />

        {/* Iconos */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de moneda */}
          <CurrencySelector />

          {/* Botón de usuario / login */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600 max-w-[120px] truncate">
                {cliente?.razon_social?.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <User size={20} />
              <span>Ingresar</span>
            </Link>
          )}

          {/* Carrito */}
          <button
            onClick={openCart}
            className="flex items-center justify-center p-2.5 bg-white text-gray-700 hover:bg-gray-50 rounded-full transition-all active:scale-90 relative group"
            aria-label="Ver pedido"
          >
            <div className="relative">
              <ShoppingCart
                size={24}
                strokeWidth={2}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors z-50 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white ${
          mobileOpen
            ? "max-h-[800px] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-2 p-4 pb-6">
          <CategoriesMenu mobile={true} onItemClick={() => setMobileOpen(false)} />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`p-4 rounded-2xl text-xl transition-colors flex items-center justify-between ${
                pathname === link.href
                  ? "bg-gray-50 text-gray-900 font-bold"
                  : "text-gray-600 active:bg-gray-50 font-medium"
              }`}
            >
              <span>{link.name}</span>
              <ArrowRight
                size={20}
                className={`transition-transform duration-300 ${
                  pathname === link.href
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
              />
            </Link>
          ))}

          {/* Login / Perfil en mobile */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {isLoggedIn ? (
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-gray-600">
                  {cliente?.razon_social}
                </span>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="p-4 rounded-2xl text-xl text-gray-600 active:bg-gray-50 font-medium flex items-center gap-2"
              >
                <User size={20} />
                <span>Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
