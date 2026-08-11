"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Heading, Text } from "./basics/Typography";
import Badge from "./basics/Badge";
import Button from "./basics/Button";

// ─── Carousel de banners ────────────────────────────────────────

function BannerSlide({ banner }) {
  const Wrapper = banner.enlace ? Link : "div";
  const wrapperProps = banner.enlace ? { href: banner.enlace } : {};

  const tieneTexto = banner.titulo || banner.subtitulo || banner.boton_texto;

  // Mapeo de posicion_texto a clases de Tailwind
  const posicionClasses = {
    'top-left': 'items-start justify-start pt-8',
    'top-center': 'items-start justify-center pt-8 text-center',
    'top-right': 'items-start justify-end pt-8 text-right',
    'center-left': 'items-center justify-start',
    'center': 'items-center justify-center text-center',
    'center-right': 'items-center justify-end text-right',
    'bottom-left': 'items-end justify-start pb-8',
    'bottom-center': 'items-end justify-center pb-8 text-center',
    'bottom-right': 'items-end justify-end pb-8 text-right',
  };

  const posClass = posicionClasses[banner.posicion_texto] || posicionClasses['center-left'];

  return (
    <Wrapper
      {...wrapperProps}
      className="relative block w-full overflow-hidden bg-white"
    >
      {/* Imagen desktop */}
      {banner.imagen_url && (
        <img
          src={banner.imagen_url}
          alt={banner.titulo || "Banner promocional"}
          className={`w-full h-auto block ${
            banner.imagen_mobile_url ? "hidden md:block" : ""
          }`}
        />
      )}

      {/* Imagen mobile */}
      {banner.imagen_mobile_url && (
        <img
          src={banner.imagen_mobile_url}
          alt={banner.titulo || "Banner promocional"}
          className="w-full h-auto block md:hidden"
        />
      )}

      {/* Texto posicionado */}
      {tieneTexto && (
        <div className={`absolute inset-0 flex flex-col ${posClass} px-6 md:px-10`}>
          <div className="max-w-lg space-y-3">
            {banner.titulo && (
              <Heading level={1} className="text-2xl md:text-5xl text-white drop-shadow-lg">
                {banner.titulo}
              </Heading>
            )}
            {banner.subtitulo && (
              <Text className="text-sm md:text-lg text-white/90 font-light leading-relaxed drop-shadow">
                {banner.subtitulo}
              </Text>
            )}
            {banner.boton_texto && banner.enlace && (
              <Button
                as={Link}
                href={banner.enlace}
                variant="secondary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                className="rounded-full bg-white text-gray-900 hover:bg-gray-100 border-none shadow-lg mt-1"
              >
                {banner.boton_texto}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Botón CTA flotante si no hay texto pero sí enlace */}
      {!tieneTexto && banner.enlace && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
          <Button
            as={Link}
            href={banner.enlace}
            variant="secondary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="rounded-full bg-white/95 text-gray-900 hover:bg-white border-none shadow-xl backdrop-blur-sm"
          >
            Ver más
          </Button>
        </div>
      )}
    </Wrapper>
  );
}

function BannerCarousel({ banners }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = banners.length;

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-avance cada 6 segundos
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [next, total]);

  // Pausar auto-avance al interactuar
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 6000);
  }, [next]);

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Slides — la altura la define la imagen */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ width: `${total * 100}%`, transform: `translateX(-${current * (100 / total)}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} style={{ width: `${100 / total}%` }}>
            <BannerSlide banner={banner} />
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {total > 1 && (
        <>
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => { next(); resetTimer(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Banner siguiente"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { goTo(idx); resetTimer(); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ─── Hero estático (fallback) ───────────────────────────────────

function StaticHero({ logoUrl, nombreEmpresa, slogan }) {
  return (
    <section className="relative py-12 md:py-24 border-b border-gray-100 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50/50">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Logo */}
        {logoUrl && (
          <div className="flex-1 flex justify-center animate-fade-slide-in">
            <div className="relative w-full max-w-sm aspect-square bg-white/70 backdrop-blur-md rounded-3xl shadow-xl flex items-center justify-center p-10 overflow-hidden border border-white/80 hover:shadow-2xl transition-shadow duration-500">
              <img
                src={logoUrl}
                alt={`Logo ${nombreEmpresa}`}
                className="object-contain max-w-full max-h-full drop-shadow-md"
              />
            </div>
          </div>
        )}

        <div className="flex-1 space-y-6 text-center md:text-left flex flex-col items-center md:items-start justify-center animate-fade-up">
          <Badge variant="info" className="bg-dental-light text-dental-blue border-blue-100 gap-1.5">
            <Sparkles size={12} className="animate-pulse" /> Distribuidor Oficial en Paraguay
          </Badge>

          <Heading level={1} className="text-4xl md:text-6xl">
            {nombreEmpresa}
          </Heading>

          <Text variant="body" className="text-lg md:text-xl text-gray-600 max-w-lg font-light leading-relaxed">
            {slogan}
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Button
              as={Link}
              href="/products"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="rounded-full bg-gray-900 hover:bg-gray-800 border-gray-900 shadow-lg shadow-gray-200 px-10"
            >
              Ver Catálogo
            </Button>
            <Button
              as={Link}
              href="/about"
              variant="outline"
              size="lg"
              className="rounded-full px-10"
            >
              Sobre Nosotros
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Componente principal ───────────────────────────────────────

/**
 * HeroSection dinámico.
 * - Si recibe `banners` con items → muestra carousel
 * - Si no → muestra hero estático con logo/slogan
 */
export default function HeroSection({ banners = [], logoUrl, nombreEmpresa, slogan }) {
  const heroBanners = banners.filter((b) => b.imagen_url);

  if (heroBanners.length > 0) {
    return <BannerCarousel banners={heroBanners} />;
  }

  return <StaticHero logoUrl={logoUrl} nombreEmpresa={nombreEmpresa} slogan={slogan} />;
}
