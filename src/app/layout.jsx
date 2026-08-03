import Footer from "@/components/footer/footer";
import "./globals.css";
import MainHeader from "@/components/main-header/main-header";
import SideCart from "@/components/cart/SideCart";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { TiendaProvider } from "./context/TiendaContext";

export const metadata = {
  title: {
    template: "%s | Tienda Online",
    default: "Tienda Online",
  },
  description:
    "Tienda online de insumos y equipamiento profesional.",
  openGraph: {
    title: "Tienda Online",
    description: "Equipamiento y productos profesionales.",
    type: "website",
    locale: "es_PY",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased scroll-smooth" suppressHydrationWarning>
        <TiendaProvider>
          <AuthProvider>
            <CartProvider>
              <SideCart />
              <MainHeader />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </TiendaProvider>
      </body>
    </html>
  );
}
