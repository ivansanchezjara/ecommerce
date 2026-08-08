"use client";
import { useState, useEffect } from "react";
import { getProductosRelacionados } from "@/services/tienda";
import ProductsCarousel from "@/components/ui/ProductsCarousel";

export default function RelatedProducts({ productSlug, categoriaId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productSlug) return;

    let cancelled = false;

    getProductosRelacionados(productSlug)
      .then((data) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : data.results || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error cargando productos relacionados:", err);
          setProducts([]);
        }
      });

    return () => { cancelled = true; };
  }, [productSlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-16">
      <ProductsCarousel
        products={products}
        title="También te puede interesar"
        viewAllLink={categoriaId ? `/products?categoria=${categoriaId}` : "/products"}
      />
    </section>
  );
}
