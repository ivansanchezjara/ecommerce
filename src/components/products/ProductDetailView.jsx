"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Tag, ShieldCheck, Truck, Ruler, Lock, ShoppingCart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useTienda } from "@/app/context/TiendaContext";
import { useCart } from "@/app/context/CartContext";
import { getPrecios } from "@/services/tienda";

export default function ProductDetailView({ product }) {
  const { isLoggedIn } = useAuth();
  const { formatearPrecio } = useTienda();
  const { addToCart } = useCart();

  const [selectedVariante, setSelectedVariante] = useState(null);
  const [precios, setPrecios] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const variantes = product.variantes || [];
  const currentVariante = selectedVariante || (variantes.length === 1 ? variantes[0] : null);

  // Cargar precios si está logueado
  useEffect(() => {
    if (isLoggedIn && product.slug) {
      getPrecios(product.slug)
        .then((data) => setPrecios(data))
        .catch(() => setPrecios(null));
    }
  }, [isLoggedIn, product.slug]);

  // Obtener precio de una variante
  const getPrecioVariante = (varianteId) => {
    if (!precios?.precios) return null;
    const p = precios.precios.find((pr) => pr.id === varianteId);
    return p;
  };

  // Imagen principal
  const mainImage = currentVariante?.imagen_url || product.imagen_principal_url;
  const galleryImages = currentVariante?.imagenes || [];

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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Galería de imágenes */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.nombre_general}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <img src={img.url} alt={img.descripcion || ""} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col justify-center">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-amber-600 text-[12px] font-bold uppercase tracking-[0.2em]">
                {product.categoria?.nombre || "General"}
              </span>
              {product.brand && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 text-[12px] font-medium uppercase tracking-wider">
                    {product.brand}
                  </span>
                </>
              )}
            </div>
            {currentVariante && (
              <span className="w-fit bg-gray-100 text-gray-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                #{currentVariante.product_code}
              </span>
            )}
          </div>

          {/* Título */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {product.nombre_general}
            {currentVariante && variantes.length > 1 && (
              <span className="text-red-600 ml-2">{currentVariante.nombre_variante}</span>
            )}
          </h1>

          {/* Descripción */}
          {product.description && (
            <p className="text-gray-600 mb-4">{product.description}</p>
          )}

          {product.long_description && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Descripción Detallada
              </h2>
              <p className="text-base text-gray-700 leading-relaxed font-light">
                {product.long_description}
              </p>
            </div>
          )}

          {/* Atributos */}
          {product.atributos && Object.keys(product.atributos).length > 0 && (
            <div className="mb-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th colSpan="2" className="px-5 py-3 text-gray-700 tracking-wider text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Ruler size={14} className="text-red-600" />
                        <span>Especificaciones</span>
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

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-[9px] rounded-lg border border-gray-200 uppercase">
                  <Tag size={10} className="text-gray-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Selector de Variantes */}
          {variantes.length > 1 && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3">
                Seleccionar opción
              </h2>
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

          {/* Precio */}
          <div className="flex items-center gap-4 mb-8">
            {isLoggedIn ? (
              <div className="flex flex-col">
                {currentVariante && getPrecioVariante(currentVariante.id) ? (
                  <>
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 leading-none">
                      {formatearPrecio(getPrecioVariante(currentVariante.id).precio)}
                    </span>
                    {getPrecioVariante(currentVariante.id).oferta_activa && (
                      <span className="text-sm text-red-600 font-medium mt-1">
                        Oferta: {formatearPrecio(getPrecioVariante(currentVariante.id).precio_oferta)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    {variantes.length > 1 && !currentVariante
                      ? "Seleccione una opción"
                      : "Consultar precio"}
                  </span>
                )}
                {currentVariante?.tiene_stock === false && (
                  <span className="text-xs text-red-600 font-medium mt-1">Sin stock disponible</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <Lock size={16} className="text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    Inicie sesión para ver precios
                  </span>
                  <Link href="/login" className="text-xs text-red-600 font-medium hover:underline">
                    Ingresar aquí
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Garantía y Envío */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
              <ShieldCheck className="text-blue-600" size={20} />
              <div className="flex flex-col text-xs font-bold text-gray-900 uppercase">
                Garantía {product.brand || ""}
                <span className="text-[10px] text-gray-400 font-normal italic">Original Certificado</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
              <Truck className="text-green-600" size={20} />
              <div className="flex flex-col text-xs font-bold text-gray-900 uppercase">
                Envío Nacional
                <span className="text-[10px] text-gray-400 font-normal italic">Todo el territorio</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-row gap-3 w-full items-center">
            <button
              onClick={handleAddToCart}
              disabled={!currentVariante || (variantes.length > 1 && !selectedVariante)}
              className={`flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              }`}
            >
              <ShoppingCart size={18} />
              <span>{addedToCart ? "¡Agregado!" : "Agregar al carrito"}</span>
            </button>

            <Link
              href={`https://api.whatsapp.com/send?phone=595983188000&text=${encodeURIComponent(
                `Hola, me interesa: ${product.nombre_general}${currentVariante ? ` - ${currentVariante.nombre_variante}` : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 h-14 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 px-2"
            >
              <MessageCircle size={18} fill="currentColor" />
              <span className="text-[13px] md:text-base truncate">WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
