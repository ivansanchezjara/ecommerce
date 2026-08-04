"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection({ logoUrl, nombreEmpresa, slogan }) {
  return (
    <section className="relative py-12 md:py-24 border-b border-gray-100 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50/50">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Logo con diseño flotante y premium */}
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-dental-light text-dental-blue border border-blue-100">
            <Sparkles size={12} className="animate-pulse" /> Distribuidor Oficial en Paraguay
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {nombreEmpresa}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-lg font-light leading-relaxed">
            {slogan}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Link
              href="/products"
              className="bg-gray-900 text-white px-10 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Ver Catálogo <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="bg-white border border-gray-200 text-gray-700 px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all text-center hover:border-gray-300"
            >
              Sobre Nosotros
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
