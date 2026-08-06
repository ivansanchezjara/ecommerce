"use client";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ArrowRight, User, Sparkles, Percent } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import CategoriesMenu from "./CategoriesMenu";
import CurrencySelector from "@/components/ui/CurrencySelector";
import { Badge, Button, Text } from "@/components/ui";

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
    { name: "Estudiantes", href: "/products?tag=estudiantes", icon: Sparkles },
    { name: "Ofertas", href: "/products?tag=ofertas", icon: Percent, badge: "Sale" },
    { name: "Sobre Nosotros", href: "/about" },
  ];

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Tienda";
  const logoUrl = config?.logo_url;

  return (
    <header className="w-full sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      {/* PISO 1: LOGO, ACCIONES — Fondo blanco */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-3.5 px-4">
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
              <Text as="span" variant="bodyBold" className="text-dental-text text-xl">
                {nombreEmpresa}
              </Text>
            )}
          </Link>

          {/* Buscador Desktop Prominente */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Acciones de la Derecha */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Selector de moneda */}
            <CurrencySelector />

            {/* Carrito (izquierda del login) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label="Ver pedido"
              className="relative bg-dental-blue-light hover:bg-dental-blue hover:text-white text-dental-blue rounded-full border border-dental-blue/10 group"
            >
              <ShoppingCart
                size={20}
                strokeWidth={2.5}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-dental-red text-white text-[9px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Botón de usuario / login (Desktop) */}
            {isLoggedIn ? (
              <Link
                href="/mi-cuenta"
                className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-3 text-sm font-semibold text-gray-700 hover:text-dental-blue transition-colors"
              >
                <User size={18} />
                <span className="max-w-[120px] truncate">
                  {cliente?.razon_social?.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-dental-blue transition-colors border-l border-gray-200 pl-3"
              >
                <User size={18} />
                <span>Ingresar</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-gray-700 hover:bg-gray-100 border-none z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              icon={mobileOpen ? X : Menu}
            />
          </div>
        </div>
      </div>

      {/* PISO 2: CATEGORÍAS Y LINKS — Fondo azul navy DentPar */}
      <div className="hidden md:block bg-dental-navy py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
          {/* Menú de categorías */}
          <div className="border-r border-white/20 pr-6 h-7 flex items-center">
            <CategoriesMenu dark />
          </div>

          {/* Enlaces Principales */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-1.5 text-sm font-semibold transition-all relative py-1 ${
                    isActive
                      ? "text-dental-yellow"
                      : "text-white hover:text-dental-yellow"
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={15}
                      className={
                        isActive ? "text-dental-yellow" : "text-white/70 group-hover:text-dental-yellow"
                      }
                    />
                  )}
                  <span>{link.name}</span>
                  {link.badge && (
                    <Badge variant="danger" className="text-[9px] px-1.5 py-0 -translate-y-1 scale-90 bg-dental-red text-white border-none">
                      {link.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-dental-yellow rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE MENU (CON BUSCADOR Y LINKS) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white ${
          mobileOpen
            ? "max-h-[1000px] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4 p-4 pb-8">
          {/* Buscador Mobile */}
          <div className="w-full pb-2 border-b border-gray-50">
            <SearchBar />
          </div>

          <CategoriesMenu mobile={true} onItemClick={() => setMobileOpen(false)} />

          {/* Enlaces de navegación en mobile */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`p-3.5 rounded-xl text-base transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-dental-blue-light text-dental-blue font-bold"
                      : "text-gray-600 active:bg-gray-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={18} className="text-gray-400" />}
                    <span>{link.name}</span>
                    {link.badge && (
                      <Badge variant="danger" className="text-[9px] px-1.5 py-0 ml-1">
                        {link.badge}
                      </Badge>
                    )}
                  </div>
                  <ArrowRight
                    size={16}
                    className={`transition-transform duration-300 ${
                      isActive
                        ? "translate-x-0 opacity-100 text-dental-blue"
                        : "-translate-x-4 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Login / Perfil en mobile */}
          <div className="mt-2 pt-4 border-t border-gray-100">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/mi-cuenta"
                  onClick={() => setMobileOpen(false)}
                  className="p-3.5 rounded-xl text-base text-gray-700 active:bg-gray-50 font-bold flex items-center gap-2 bg-slate-50 border border-gray-100"
                >
                  <User size={18} />
                  <span>{cliente?.razon_social}</span>
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="p-3.5 rounded-xl text-base text-red-500 active:bg-red-50 font-bold flex items-center justify-center gap-2"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="p-3.5 rounded-xl text-base text-gray-700 active:bg-gray-50 font-bold flex items-center gap-2 bg-slate-50 border border-gray-100"
              >
                <User size={18} />
                <span>Ingresar a mi Cuenta</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
