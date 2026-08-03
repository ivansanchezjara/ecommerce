import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export const metadata = {
  title: "Catálogo de Productos",
  description: "Explora nuestro catálogo completo de productos profesionales.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Cargando Catálogo...
          </p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
