import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { ProductsProvider } from "@/components/ProductsContext";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "KamGeorge — Quality essentials delivered in Ghana",
  description:
    "Shop electronics, fashion, home and beauty. Fast delivery across Ghana, Mobile Money and card accepted.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <Navbar />
              <main className="container main">{children}</main>
              <Footer />
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
