"use client";

import Link from "next/link";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Activity,
  Wrench,
  Layers,
  HeartPulse,
  Stethoscope,
  Smile,
  Package,
  ArrowUpRight,
  Percent,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTienda } from "./context/TiendaContext";
import { getProductos, getCategorias } from "@/services/tienda";
import ProductsCarousel from "@/components/ui/ProductsCarousel";

// Helper function to dynamically map an icon based on category name
function getCategoryIcon(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("equip")) return <Wrench className="w-6 h-6" />;
  if (normalized.includes("instrument")) return <Stethoscope className="w-6 h-6" />;
  if (normalized.includes("descart") || normalized.includes("desech") || normalized.includes("insum")) {
    return <Layers className="w-6 h-6" />;
  }
  if (normalized.includes("ortodon")) return <Smile className="w-6 h-6" />;
  if (normalized.includes("estet") || normalized.includes("blanquea")) return <Sparkles className="w-6 h-6" />;
  if (normalized.includes("cirug") || normalized.includes("implante")) return <HeartPulse className="w-6 h-6" />;
  if (normalized.includes("diagnos") || normalized.includes("radiograf")) return <Activity className="w-6 h-6" />;
  return <Package className="w-6 h-6" />;
}

import HeroSection from "@/components/ui/HeroSection";

export default function Home() {
  const { config, loading: configLoading } = useTienda();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProductos({ featured: "true" }),
          getCategorias(),
        ]);
        setFeaturedProducts(productsData.results || productsData);
        setCategorias((categoriesData.results || categoriesData).slice(0, 6));
      } catch (err) {
        console.error("Error cargando datos de inicio:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Dent-Par";
  const slogan = config?.slogan || "Productos profesionales de alta calidad";
  const logoUrl = config?.logo_url;

  return (
    <div className="flex flex-col w-full bg-slate-50/30">
      {/* SECCIÓN HERO */}
      <HeroSection
        logoUrl={logoUrl}
        nombreEmpresa={nombreEmpresa}
        slogan={slogan}
      />

      {/* GRID DE CATEGORÍAS */}
      {!loading && categorias.length > 0 && (
        <section className="py-12 bg-white border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-dental-blue uppercase tracking-widest">Explorar por rubro</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Categorías Destacadas</h2>
              </div>
              <Link href="/products" className="text-sm font-semibold text-dental-blue hover:underline flex items-center gap-1">
                Ver todas las categorías <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categoria=${cat.id}`}
                  className="group p-5 bg-slate-50/50 hover:bg-white border border-gray-100 hover:border-dental-blue/30 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[160px] hover:shadow-lg hover:shadow-sky-50/50 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-dental-blue flex items-center justify-center group-hover:bg-dental-blue group-hover:text-white transition-colors duration-300 shadow-inner">
                    {getCategoryIcon(cat.nombre)}
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-dental-blue transition-colors line-clamp-2">
                      {cat.nombre}
                    </h3>
                    {cat.cantidad_productos > 0 && (
                      <span className="text-[10px] text-gray-400 mt-1 bg-gray-100 group-hover:bg-sky-50 px-2 py-0.5 rounded-full transition-colors">
                        {cat.cantidad_productos} {cat.cantidad_productos === 1 ? 'producto' : 'productos'}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS DESTACADOS */}
      {!loading && featuredProducts.length > 0 && (
        <section className="bg-white py-12 border-b border-gray-50">
          <div className="max-w-7xl mx-auto">
            <ProductsCarousel products={featuredProducts} title="Productos Destacados" />
          </div>
        </section>
      )}

      {/* BARRA DE BENEFICIOS */}
      <section className="py-16 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-dental-blue uppercase tracking-widest">¿Por qué elegirnos?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Servicio y Compromiso Profesional</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-sky-50/40 to-sky-50/10 border border-sky-100/50 transition-all hover:shadow-xl hover:shadow-sky-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-dental-blue shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Calidad Garantizada
                </h3>
                <p className="text-sm text-gray-600 max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Insumos odontológicos y médicos certificados bajo las más estrictas normas de bioseguridad.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-emerald-50/40 to-emerald-50/10 border border-emerald-100/50 transition-all hover:shadow-xl hover:shadow-emerald-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Envíos Rápidos
                </h3>
                <p className="text-sm text-gray-600 max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Despacho ágil en Asunción y envíos a todo el territorio paraguayo para que tu clínica nunca se detenga.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 to-amber-50/10 border border-amber-100/50 transition-all hover:shadow-xl hover:shadow-amber-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <Star size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Soporte Técnico Especializado
                </h3>
                <p className="text-sm text-gray-600 max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Asesoramiento personalizado de profesionales para ayudarte a elegir el equipamiento ideal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CTA PARA PROFESIONALES */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.15),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-sky-400 border border-sky-400/20">
            <Percent size={12} /> Beneficios Exclusivos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ¿Sos odontólogo o tenés una clínica médica?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Registrate e ingresá con tu cuenta para acceder a nuestra lista de precios preferenciales, promociones especiales por cantidad y cotizaciones en el día.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="bg-white text-slate-900 font-bold px-8 py-3.5 rounded-full hover:bg-slate-100 transition-all shadow-lg active:scale-95"
            >
              Iniciar Sesión / Registrarse
            </Link>
            <Link
              href="/about"
              className="text-slate-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Saber más sobre Dent-Par <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
