"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProductos, getCategorias, getMarcas } from "@/services/tienda";
import { ProductCard } from "@/components/products/ProductsCard";
import { PaginationInfo, PaginationControls } from "@/components/ui/Pagination";
import ProductsFilters from "@/components/products/ProductsFilters";
import Link from "next/link";
import { SearchX } from "lucide-react";

const ITEMS_PER_PAGE = 20;

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Cargar filtros
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [cats, brands] = await Promise.all([getCategorias(), getMarcas()]);
        setCategorias(cats.results || cats);
        setMarcas(brands);
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    }
    fetchFilters();
  }, []);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (categoriaParam) params.categoria = categoriaParam;
        if (brandParam) params.brand = brandParam;
        if (featuredParam) params.featured = featuredParam;
        params.page = pageParam;
        params.page_size = ITEMS_PER_PAGE;

        const data = await getProductos(params);
        setProducts(data.results || data);
        setTotalCount(data.count || (data.results || data).length);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Filter groups para el componente de filtros
  const filterGroups = [
    {
      title: "Categoría",
      options: ["Todos", ...categorias.map((c) => c.nombre)],
      active: categorias.find((c) => String(c.id) === categoriaParam)?.nombre || "Todos",
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
  ];

  const clearAllFilters = () => {
    router.replace("/products", { scroll: false });
  };

  return (
    <main className="max-w-7xl mx-auto py-6 lg:py-12 px-4">
      {/* Header */}
      <header className="mb-8 flex flex-col items-center justify-center text-center">
        {searchQuery ? (
          <>
            <p className="text-xs text-red-600 font-bold uppercase tracking-widest mb-2">
              Resultados de búsqueda
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              &ldquo;{searchQuery}&rdquo;
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Nuestros Productos
            </h1>
            <div className="mt-3 flex items-center justify-center text-gray-500 font-medium bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
              <p className="text-xs font-medium uppercase tracking-wide">
                {totalCount} productos disponibles
              </p>
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
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
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
            <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
                <SearchX className="text-gray-300" size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No hay resultados
              </h3>
              <p className="text-gray-500 mb-8 px-4 max-w-sm mx-auto">
                No encontramos productos con los filtros aplicados.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold active:scale-95 transition-all"
              >
                Ver todo el catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
