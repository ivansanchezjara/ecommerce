import { Suspense } from "react";
import ProductsContent from "./ProductsContent";
import { LoadingScreen } from "@/components/ui";

export const metadata = {
  title: "Catálogo de Productos",
  description: "Explora nuestro catálogo completo de productos profesionales.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingScreen texto="Cargando catálogo..." />}>
      <ProductsContent />
    </Suspense>
  );
}
