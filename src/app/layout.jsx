import Footer from "@/components/footer/footer";
import "./globals.css";
import MainHeader from "@/components/main-header/main-header";
import SideCart from "@/components/cart/SideCart";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { TiendaProvider } from "./context/TiendaContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "@/components/ui/feedback/ToastContext";

export const metadata = {
  title: {
    template: "%s | Dent-Par",
    default: "Dent-Par | Artículos Odontológicos",
  },
  description:
    "Tienda online de insumos y equipamiento odontológico y médico profesional en Paraguay.",
  openGraph: {
    title: "Dent-Par | Artículos Odontológicos",
    description: "Insumos y equipamiento odontológico profesional.",
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
            <WishlistProvider>
              <CartProvider>
                <ToastProvider>
                  <SideCart />
                  <MainHeader />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                </ToastProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </TiendaProvider>
      </body>
    </html>
  );
}
