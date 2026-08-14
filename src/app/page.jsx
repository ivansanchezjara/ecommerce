"use client";

import { useEffect, useState } from "react";
import { useTienda } from "./context/TiendaContext";
import { getProductos, getCategorias, getMarcas, getBanners } from "@/services/tienda";
import { ProductsCarousel, HeroSection } from "@/components/ui";
import MarcasSection from "@/components/marcas/MarcasSection";
import { CategoriasSection, BeneficiosSection, CtaProfesionales } from "@/components/secciones";

export default function Home() {
  const { config } = useTienda();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData, marcasData, bannersData] = await Promise.all([
          getProductos({ featured: "true" }),
          getCategorias(),
          getMarcas(),
          getBanners("hero"),
        ]);
        setFeaturedProducts(productsData.results || productsData);
        setCategorias((categoriesData.results || categoriesData).slice(0, 6));
        setMarcas(Array.isArray(marcasData) ? marcasData : marcasData.results || []);
        setBanners(Array.isArray(bannersData) ? bannersData : bannersData.results || []);
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
    <div className="flex flex-col w-full">
      {/* SECCIÓN HERO */}
      <HeroSection
        banners={banners}
        logoUrl={logoUrl}
        nombreEmpresa={nombreEmpresa}
        slogan={slogan}
      />

      {/* GRID DE CATEGORÍAS */}
      {!loading && <CategoriasSection categorias={categorias} />}

      {/* PRODUCTOS DESTACADOS */}
      {!loading && featuredProducts.length > 0 && (
        <section className="bg-white py-12 border-b border-gray-50">
          <div className="max-w-7xl mx-auto">
            <ProductsCarousel products={featuredProducts} title="Productos Destacados" />
          </div>
        </section>
      )}

      {/* MARCAS CON LAS QUE TRABAJAMOS */}
      {!loading && <MarcasSection marcas={marcas} />}

      {/* BARRA DE BENEFICIOS */}
      <BeneficiosSection />

      {/* SECCIÓN CTA PARA PROFESIONALES */}
      <CtaProfesionales />
    </div>
  );
}
