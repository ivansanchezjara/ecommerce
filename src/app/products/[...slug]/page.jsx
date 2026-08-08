"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProducto } from "@/services/tienda";
import ProductDetailView from "@/components/products/ProductDetailView";
import { LoadingScreen, EmptyState } from "@/components/ui";
import { PackageX, WifiOff } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];

  // El slug del producto es siempre el último segmento
  const productSlug = slug[slug.length - 1];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { type: "not_found" | "network" }

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!productSlug) return;

    // Cancelar fetch anterior si el slug cambia rápido
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const data = await getProducto(productSlug, controller.signal);

        if (controller.signal.aborted) return;

        setProduct(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Error cargando producto:", err);

        if (err.status === 404) {
          setError({ type: "not_found" });
        } else {
          setError({ type: "network" });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [productSlug]);

  // Actualizar título del documento cuando se carga el producto
  useEffect(() => {
    if (product) {
      document.title = `${product.nombre} | Tienda`;
    }
    return () => {
      document.title = "Tienda";
    };
  }, [product]);

  if (loading) {
    return <LoadingScreen texto="Cargando producto..." />;
  }

  if (error?.type === "not_found") {
    return (
      <EmptyState
        icon={<PackageX size={40} strokeWidth={1.5} />}
        titulo="Producto no encontrado"
        descripcion="El producto que buscás no existe o fue eliminado del catálogo."
        textoBoton="Ver catálogo"
        onAction={() => router.push("/products")}
      />
    );
  }

  if (error?.type === "network") {
    return (
      <EmptyState
        icon={<WifiOff size={40} strokeWidth={1.5} />}
        titulo="Error de conexión"
        descripcion="No pudimos cargar el producto. Verificá tu conexión e intentá de nuevo."
        textoBoton="Reintentar"
        onAction={() => router.refresh()}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={<PackageX size={40} strokeWidth={1.5} />}
        titulo="Producto no encontrado"
        descripcion="No se encontró información para este producto."
        textoBoton="Ver catálogo"
        onAction={() => router.push("/products")}
      />
    );
  }

  return <ProductDetailView product={product} />;
}
