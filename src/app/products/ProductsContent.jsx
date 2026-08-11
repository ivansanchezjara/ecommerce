"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProductos, getCategorias, getMarcas } from "@/services/tienda";
import { registrarBusqueda } from "@/services/cuenta";
import { ProductCard } from "@/components/products/ProductsCard";
import { PaginationInfo, PaginationControls } from "@/components/ui/Pagination";
import ProductsFilters from "@/components/products/ProductsFilters";
import { LoadingScreen, EmptyState, Heading, Text, useToast } from "@/components/ui";
import { SearchX } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const searchQuery = searchParams.get("q") || "";
  const categoriaParam = searchParams.get("categoria") || "";
  const brandParam = searchParams.get("brand") || "";
  const featuredParam = searchParams.get("featured") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce del query de búsqueda para el registro en historial
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Ref para cancelar fetches obsoletos (race condition)
  const abortControllerRef = useRef(null);

  // Cargar filtros
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [cats, brands] = await Promise.all([getCategorias(), getMarcas()]);
        setCategorias(cats.results || cats);
        const marcasData = Array.isArray(brands) ? brands : brands.results || [];
        setMarcas(marcasData.map((m) => typeof m === "string" ? m : m.nombre));
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    }
    fetchFilters();
  }, []);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    // Cancelar request anterior si aún está en vuelo
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoriaParam) params.categoria = categoriaParam;
        if (brandParam) params.brand = brandParam;
        if (featuredParam) params.featured = featuredParam;
        params.page = pageParam;
        params.page_size = ITEMS_PER_PAGE;

        const data = await getProductos(params, controller.signal);

        // Si fue abortado, no actualizar estado
        if (controller.signal.aborted) return;

        setProducts(data.results || data);
        setTotalCount(data.count || (data.results || data).length);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error cargando productos:", err);
        setError("No se pudieron cargar los productos. Intentá de nuevo.");
        setProducts([]);
        showToast("Error al cargar productos", "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [searchQuery, categoriaParam, brandParam, featuredParam, pageParam, showToast]);

  // Registrar búsqueda con debounce (efecto separado)
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length >= 2) {
      registrarBusqueda(debouncedSearchQuery.trim(), totalCount).catch(() => {});
    }
  }, [debouncedSearchQuery, totalCount]);

  // Scroll al tope cuando cambian filtros o página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchQuery, categoriaParam, brandParam, featuredParam, pageParam]);

  // Helpers de navegación
  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "Todos") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // Reset page on filter change
      router.replace(`/products?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Filter groups memoizados para evitar re-renders innecesarios
  const filterGroups = useMemo(
    () => [
      {
        title: "Categoría",
        options: ["Todos", ...categorias.map((c) => c.nombre)],
        active:
          categorias.find((c) => String(c.id) === categoriaParam)?.nombre || "Todos",
        setActive: (val) => {
          const cat = categorias.find((c) => c.nombre === val);
          updateParams("categoria", cat ? String(cat.id) : "");
        },
      },
      {
        title: "Marca",
        options: ["Todos", ...marcas],
        active: brandParam || "Todos",
        setActive: (val) => updateParams("brand", val === "Todos" ? "" : val),
      },
    ],
    [categorias, marcas, categoriaParam, brandParam, updateParams]
  );

  const clearAllFilters = useCallback(() => {
    router.replace("/products", { scroll: false });
  }, [router]);

  return (
    <main className="max-w-7xl mx-auto py-6 lg:py-12 px-4">
      {/* Header */}
      <header className="mb-8 flex flex-col items-center justify-center text-center">
        {searchQuery ? (
          <>
            <Text variant="label" className="text-red-600 mb-2">
              Resultados de búsqueda
            </Text>
            <Heading level={1} className="text-3xl lg:text-4xl">
              &ldquo;{searchQuery}&rdquo;
            </Heading>
          </>
        ) : (
          <>
            <Heading level={1} className="text-3xl lg:text-4xl">
              Nuestros Productos
            </Heading>
            <div className="mt-3 flex items-center justify-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
              <Text variant="label" className="text-gray-500">
                {totalCount} productos disponibles
              </Text>
            </div>
          </>
        )}
      </header>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <ProductsFilters filterGroups={filterGroups} clearAll={clearAllFilters} />

        {/* Grid de productos */}
        <div className="flex-1">
          {loading ? (
            <LoadingScreen texto="Cargando productos..." />
          ) : error ? (
            <EmptyState
              icon={<SearchX size={40} strokeWidth={1.5} />}
              titulo="Error al cargar"
              descripcion={error}
              textoBoton="Reintentar"
              onAction={() => router.replace(
                `/products?${searchParams.toString()}`,
                { scroll: false }
              )}
            />
          ) : products.length > 0 ? (
            <>
              <PaginationInfo
                currentPage={pageParam}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalCount}
                label="productos"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-12">
                {products.map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="block hover:scale-[1.02] transition-transform duration-300"
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>

              <PaginationControls
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState
              icon={<SearchX size={40} strokeWidth={1.5} />}
              titulo="No hay resultados"
              descripcion="No encontramos productos con los filtros aplicados."
              textoBoton="Ver todo el catálogo"
              onAction={clearAllFilters}
            />
          )}
        </div>
      </div>
    </main>
  );
}
