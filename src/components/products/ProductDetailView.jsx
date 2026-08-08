"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle, Tag, ShieldCheck, Truck, Ruler, Lock, ShoppingCart,
  ChevronRight, Package
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import { useCart } from "@/app/context/CartContext";
import { getPrecios } from "@/services/tienda";
import { Button, Badge, Heading, Text } from "@/components/ui";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviews from "@/components/products/ProductReviews";
import ProductQuestions from "@/components/products/ProductQuestions";

// ─── Tabs Section ───────────────────────────────────────────────────────────

function DetailTabs({ product }) {
  const tabs = useMemo(() => {
    const t = [];
    if (product.description || product.long_description) {
      t.push({ id: "descripcion", label: "Descripción" });
    }
    if (product.atributos && Object.keys(product.atributos).length > 0) {
      t.push({ id: "especificaciones", label: "Especificaciones" });
    }
    if (product.tags && product.tags.length > 0) {
      t.push({ id: "tags", label: "Etiquetas" });
    }
    return t;
  }, [product]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "descripcion");

  if (tabs.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-16">
      {/* Tab headers */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto" aria-label="Secciones del producto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="py-6 lg:py-8">
        {activeTab === "descripcion" && (
          <div className="max-w-3xl space-y-4">
            {product.description && (
              <Text variant="body" className="text-gray-700">
                {product.description}
              </Text>
            )}
            {product.long_description && (
              <Text variant="body" className="text-gray-600 leading-relaxed font-light whitespace-pre-line">
                {product.long_description}
              </Text>
            )}
          </div>
        )}

        {activeTab === "especificaciones" && (
          <div className="max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th colSpan="2" className="px-5 py-3 text-gray-700 tracking-wider text-sm">
                    <div className="flex items-center gap-2">
                      <Ruler size={14} className="text-red-600" />
                      <span>Especificaciones técnicas</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(product.atributos).map(([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                    <td className="px-5 py-3 font-medium text-gray-500 w-1/3 border-r border-gray-50 capitalize">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="default" className="text-xs gap-1.5 px-3 py-1.5">
                <Tag size={12} className="text-gray-400" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProductDetailView({ product }) {
  const { isLoggedIn } = useAuth();
  const { formatearPrecio, config } = useTienda();
  const { addToCart } = useCart();

  const [selectedVariante, setSelectedVariante] = useState(null);
  const [precios, setPrecios] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState(null);

  const addedTimerRef = useRef(null);

  const variantes = product.variantes || [];
  const currentVariante = selectedVariante || (variantes.length === 1 ? variantes[0] : null);

  // WhatsApp desde configuración de la tienda
  const whatsappNumber = config?.whatsapp?.replace(/[^0-9]/g, "") || "";

  // Cargar precios si está logueado
  useEffect(() => {
    if (!isLoggedIn || !product.slug) return;

    const controller = new AbortController();

    getPrecios(product.slug)
      .then((data) => {
        if (!controller.signal.aborted) setPrecios(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPrecios(null);
      });

    return () => controller.abort();
  }, [isLoggedIn, product.slug]);

  // Imagen principal: activa por galería > variante > producto
  const mainImage = activeImageUrl || currentVariante?.imagen_url || product.imagen_principal_url;
  const galleryImages = currentVariante?.imagenes || [];

  // Resetear imagen activa cuando cambia la variante
  useEffect(() => {
    setActiveImageUrl(null);
  }, [currentVariante?.id]);

  // Precio memoizado para la variante actual
  const currentPrecio = useMemo(() => {
    if (!precios?.precios || !currentVariante) return null;
    return precios.precios.find((pr) => pr.id === currentVariante.id) || null;
  }, [precios, currentVariante]);

  // Cleanup del timer de "agregado" al desmontar
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (!currentVariante) return;
    addToCart({
      variante_id: currentVariante.id,
      product_code: currentVariante.product_code,
      nombre: `${product.nombre_general} - ${currentVariante.nombre_variante}`,
      imagen_url: currentVariante.imagen_url || product.imagen_principal_url,
      slug: product.slug,
    });
    setAddedToCart(true);

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-gray-900 transition-colors">
          Productos
        </Link>
        <ChevronRight size={14} />
        {product.categoria && (
          <>
            <Link
              href={`/products?categoria=${product.categoria.id}`}
              className="hover:text-gray-900 transition-colors"
            >
              {product.categoria.nombre}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.nombre_general}
        </span>
      </nav>

      {/* ═══ Top Section: 2 columnas (foto + acción) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {/* Columna izquierda: Galería */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.nombre_general}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package size={48} strokeWidth={1} />
              </div>
            )}
          </div>

          {/* Thumbnails interactivos */}
          {galleryImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageUrl(img.url)}
                  className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImageUrl === img.url
                      ? "border-gray-900 ring-1 ring-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  aria-label={img.descripcion || "Ver imagen"}
                >
                  <Image
                    src={img.url}
                    alt={img.descripcion || ""}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha: Información de compra */}
        <div className="flex flex-col">
          {/* Categoría + Marca */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <Badge variant="warning" className="text-[12px]">
              {product.categoria?.nombre || "General"}
            </Badge>
            {product.brand && (
              <>
                <span className="text-gray-300">|</span>
                <Text variant="label" className="text-gray-500">
                  {product.brand}
                </Text>
              </>
            )}
          </div>

          {/* Título */}
          <Heading level={1} className="text-xl md:text-2xl lg:text-3xl mb-1 leading-tight">
            {product.nombre_general}
            {currentVariante && variantes.length > 1 && (
              <span className="text-red-600 ml-2">{currentVariante.nombre_variante}</span>
            )}
          </Heading>

          {/* Código */}
          {currentVariante && (
            <Text variant="mono" className="w-fit text-xs bg-gray-100 px-2 py-0.5 rounded uppercase mb-4">
              Código: {currentVariante.product_code}
            </Text>
          )}

          {/* Descripción corta (1-2 líneas) */}
          {product.description && (
            <Text variant="bodySm" className="text-gray-600 mb-5 line-clamp-2">
              {product.description}
            </Text>
          )}

          {/* Divider */}
          <hr className="border-gray-100 mb-5" />

          {/* Precio */}
          <div className="mb-5">
            {isLoggedIn ? (
              <div className="flex flex-col">
                {currentPrecio ? (
                  <>
                    {currentPrecio.oferta_activa && (
                      <Text variant="bodySm" className="text-gray-400 line-through mb-0.5">
                        {formatearPrecio(currentPrecio.precio)}
                      </Text>
                    )}
                    <Heading level={2} className="text-2xl lg:text-3xl leading-none">
                      {formatearPrecio(currentPrecio.oferta_activa ? currentPrecio.precio_oferta : currentPrecio.precio)}
                    </Heading>
                    {currentPrecio.oferta_activa && (
                      <Badge variant="danger" className="w-fit mt-1.5 text-[11px]">
                        Oferta
                      </Badge>
                    )}
                  </>
                ) : (
                  <Heading level={3} className="text-xl text-gray-700">
                    {variantes.length > 1 && !currentVariante
                      ? "Seleccione una opción"
                      : "Consultar precio"}
                  </Heading>
                )}
                {currentVariante?.tiene_stock === false && (
                  <Text variant="bodyXs" className="text-red-600 mt-1">Sin stock disponible</Text>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <Lock size={16} className="text-gray-400" />
                <div className="flex flex-col">
                  <Text variant="bodySm" className="text-gray-700">
                    Inicie sesión para ver precios
                  </Text>
                  <Link href="/login" className="text-xs text-red-600 font-medium hover:underline">
                    Ingresar aquí
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Selector de Variantes */}
          {variantes.length > 1 && (
            <div className="mb-5">
              <Text variant="label" className="text-gray-700 mb-2 text-xs uppercase tracking-wide">
                Opción
              </Text>
              <div className="flex flex-wrap gap-2">
                {variantes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariante(v)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold text-xs transition-all ${
                      currentVariante?.id === v.id
                        ? "border-gray-900 bg-gray-900 text-white shadow-md scale-105"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {v.nombre_variante}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-row gap-3 w-full items-center mb-6">
            <Button
              onClick={handleAddToCart}
              disabled={!currentVariante || (variantes.length > 1 && !selectedVariante)}
              variant="primary"
              size="lg"
              icon={ShoppingCart}
              className={`flex-1 h-13 rounded-full shadow-lg ${
                addedToCart
                  ? "bg-green-500 hover:bg-green-500 border-green-500"
                  : "bg-gray-900 hover:bg-gray-800 border-gray-900"
              }`}
            >
              {addedToCart ? "¡Agregado!" : "Agregar al carrito"}
            </Button>

            {whatsappNumber && (
              <Button
                as={Link}
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
                  `Hola, me interesa: ${product.nombre_general}${currentVariante ? ` - ${currentVariante.nombre_variante}` : ""}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="success"
                size="lg"
                icon={MessageCircle}
                className="flex-1 min-w-0 h-13 rounded-full shadow-lg bg-[#25D366] hover:bg-[#128C7E] border-[#25D366]"
              >
                <span className="text-[13px] md:text-base truncate">WhatsApp</span>
              </Button>
            )}
          </div>

          {/* Info compacta: Garantía y Envío */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <ShieldCheck className="text-blue-600 shrink-0" size={18} />
              <div className="flex items-center gap-1.5">
                <Text variant="bodyXs" className="text-gray-700 font-medium">
                  Garantía {product.brand || "del fabricante"}
                </Text>
                <span className="text-gray-300">·</span>
                <Text variant="bodyXs" className="text-gray-500">Original certificado</Text>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
              <Truck className="text-green-600 shrink-0" size={18} />
              <div className="flex items-center gap-1.5">
                <Text variant="bodyXs" className="text-gray-700 font-medium">
                  Envío nacional
                </Text>
                <span className="text-gray-300">·</span>
                <Text variant="bodyXs" className="text-gray-500">Todo el territorio</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom Section: Tabs con contenido expandido ═══ */}
      <DetailTabs product={product} />

      {/* ═══ Productos relacionados ═══ */}
      <RelatedProducts
        productSlug={product.slug}
        categoriaId={product.categoria?.id}
      />

      {/* ═══ Preguntas y Respuestas ═══ */}
      <ProductQuestions productSlug={product.slug} />

      {/* ═══ Evaluaciones / Reseñas ═══ */}
      <ProductReviews productSlug={product.slug} productId={product.id} />
    </main>
  );
}
