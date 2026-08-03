"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getProducto } from "@/services/tienda";
import ProductDetailView from "@/components/products/ProductDetailView";

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];

  // El slug del producto es siempre el último segmento
  const productSlug = slug[slug.length - 1];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProducto(productSlug);
        setProduct(data);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (productSlug) fetchProduct();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Cargando producto...
        </p>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
