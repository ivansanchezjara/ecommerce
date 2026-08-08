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
import { ProductsCarousel, HeroSection, Badge, Button, Heading, Text } from "@/components/ui";

// Helper para mapear ícono según nombre de categoría
function getCategoryIcon(name) {
  const n = name.toLowerCase();
  if (n.includes("equip")) return <Wrench className="w-6 h-6" />;
  if (n.includes("instrument")) return <Stethoscope className="w-6 h-6" />;
  if (n.includes("descart") || n.includes("desech") || n.includes("insum")) return <Layers className="w-6 h-6" />;
  if (n.includes("ortodon")) return <Smile className="w-6 h-6" />;
  if (n.includes("estet") || n.includes("blanquea")) return <Sparkles className="w-6 h-6" />;
  if (n.includes("cirug") || n.includes("implante")) return <HeartPulse className="w-6 h-6" />;
  if (n.includes("diagnos") || n.includes("radiograf")) return <Activity className="w-6 h-6" />;
  return <Package className="w-6 h-6" />;
}

export default function Home() {
  const { config } = useTienda();
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
                <Badge variant="primary" className="mb-2 bg-dental-blue-light text-dental-blue border-none">Explorar por rubro</Badge>
                <Heading level={2} className="text-2xl md:text-3xl mt-1">Categorías Destacadas</Heading>
              </div>
              <Button
                as={Link}
                href="/products"
                variant="ghost"
                size="sm"
                icon={ArrowUpRight}
                iconPosition="right"
                className="text-dental-blue hover:text-dental-blue-hover hover:bg-transparent border-none"
              >
                Ver todas las categorías
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categoria=${cat.id}`}
                  className="group p-5 bg-dental-blue-light/30 hover:bg-white border border-gray-100 hover:border-dental-blue/30 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[160px] hover:shadow-lg hover:shadow-dental-blue/5 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-dental-blue-light text-dental-blue flex items-center justify-center group-hover:bg-dental-blue group-hover:text-white transition-colors duration-300 shadow-inner">
                    {getCategoryIcon(cat.nombre)}
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <Text as="h3" variant="bodySmBold" className="group-hover:text-dental-blue transition-colors line-clamp-2">
                      {cat.nombre}
                    </Text>
                    {cat.cantidad_productos > 0 && (
                      <Text variant="mutedXs" className="mt-1 bg-dental-blue-light/50 group-hover:bg-dental-blue-light px-2 py-0.5 rounded-full transition-colors">
                        {cat.cantidad_productos} {cat.cantidad_productos === 1 ? "producto" : "productos"}
                      </Text>
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
            <Badge variant="info" className="mb-3">¿Por qué elegirnos?</Badge>
            <Heading level={2} className="text-2xl md:text-3xl mt-1">Servicio y Compromiso Profesional</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-sky-50/40 to-sky-50/10 border border-sky-100/50 transition-all hover:shadow-xl hover:shadow-sky-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-dental-blue shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <Heading level={3} className="text-lg">Calidad Garantizada</Heading>
                <Text variant="bodySm" className="max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Insumos odontológicos y médicos certificados bajo las más estrictas normas de bioseguridad.
                </Text>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-emerald-50/40 to-emerald-50/10 border border-emerald-100/50 transition-all hover:shadow-xl hover:shadow-emerald-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <Truck size={28} />
              </div>
              <div>
                <Heading level={3} className="text-lg">Envíos Rápidos</Heading>
                <Text variant="bodySm" className="max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Despacho ágil en Asunción y envíos a todo el territorio paraguayo para que tu clínica nunca se detenga.
                </Text>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 to-amber-50/10 border border-amber-100/50 transition-all hover:shadow-xl hover:shadow-amber-50/30 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <Star size={28} />
              </div>
              <div>
                <Heading level={3} className="text-lg">Soporte Técnico Especializado</Heading>
                <Text variant="bodySm" className="max-w-[240px] mx-auto mt-2 leading-relaxed">
                  Asesoramiento personalizado de profesionales para ayudarte a elegir el equipamiento ideal.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CTA PARA PROFESIONALES */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.15),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <Badge variant="info" className="bg-blue-500/10 text-sky-400 border border-sky-400/20" icon={Percent}>
            <Percent size={12} className="mr-1" /> Beneficios Exclusivos
          </Badge>
          <Heading level={2} className="text-3xl md:text-4xl text-white">
            ¿Sos odontólogo o tenés una clínica dental?
          </Heading>
          <Text variant="body" className="text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Registrate e ingresá con tu cuenta para acceder a nuestra lista de precios preferenciales, promociones especiales por cantidad y cotizaciones en el día.
          </Text>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as={Link}
              href="/login"
              variant="secondary"
              size="lg"
              className="rounded-full bg-white text-slate-900 hover:bg-slate-100 border-none shadow-lg"
            >
              Iniciar Sesión / Registrarse
            </Button>
            <Button
              as={Link}
              href="/about"
              variant="ghost"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="text-slate-300 hover:text-white hover:bg-transparent border-none"
            >
              Saber más sobre Dent-Par
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
