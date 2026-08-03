"use client";

import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTienda } from "./context/TiendaContext";
import { getProductos } from "@/services/tienda";
import ProductsCarousel from "@/components/ui/ProductsCarousel";

export default function Home() {
  const { config, loading: configLoading } = useTienda();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await getProductos({ featured: "true" });
        setFeaturedProducts(data.results || data);
      } catch (err) {
        console.error("Error cargando productos destacados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Tienda Online";
  const slogan = config?.slogan || "Productos profesionales de alta calidad";
  const logoUrl = config?.logo_url;

  return (
    <div className="flex flex-col w-full">
      {/* SECCIÓN HERO */}
      <section className="relative bg-gray-50 py-10 md:py-16 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Logo */}
          {logoUrl && (
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center p-8 overflow-hidden border border-white">
                <img
                  src={logoUrl}
                  alt={`Logo ${nombreEmpresa}`}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-6 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              {nombreEmpresa}
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mx-auto font-light">
              {slogan}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gray-900 text-white px-12 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Ver Productos <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="bg-white border border-gray-200 text-gray-700 px-12 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all text-center"
              >
                Sobre Nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      {!loading && featuredProducts.length > 0 && (
        <section className="bg-white py-4 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <ProductsCarousel products={featuredProducts} title="Destacados" />
          </div>
        </section>
      )}

      {/* BARRA DE BENEFICIOS */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-blue-50/50 transition-transform hover:scale-105">
            <ShieldCheck className="text-blue-600 w-12 h-12" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Calidad Garantizada
              </h3>
              <p className="text-sm text-gray-600 max-w-[200px] mx-auto">
                Productos certificados bajo normas internacionales.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-green-50/50 transition-transform hover:scale-105">
            <Truck className="text-green-600 w-12 h-12" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Envío Rápido
              </h3>
              <p className="text-sm text-gray-600 max-w-[200px] mx-auto">
                Despacho prioritario para tu negocio.
              </p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-yellow-50/50 transition-transform hover:scale-105">
            <Star className="text-yellow-600 w-12 h-12" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Soporte Técnico
              </h3>
              <p className="text-sm text-gray-600 max-w-[200px] mx-auto">
                Asesoramiento profesional en cada compra.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
