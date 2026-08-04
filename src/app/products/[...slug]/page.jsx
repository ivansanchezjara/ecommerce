"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { getProducto } from "@/services/tienda";
import ProductDetailView from "@/components/products/ProductDetailView";
import { LoadingScreen, EmptyState } from "@/components/ui";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
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
    return <LoadingScreen texto="Cargando producto..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        titulo="No pudimos cargar el producto"
        descripcion="Ocurrió un error al obtener la información. Intentá de nuevo o volvé al catálogo."
        textoBoton="Ver catálogo"
        onAction={() => router.push("/products")}
      />
    );
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
