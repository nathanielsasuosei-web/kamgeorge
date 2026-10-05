import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { ProductsProvider } from "@/components/ProductsContext";
import { SettingsProvider } from "@/components/SettingsContext";
import { CartProvider } from "@/components/CartContext";
import { ThemeProvider } from "@/components/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ThemeFab from "@/components/ThemeFab";

export const metadata = {
  title: "Unclaim — Quality essentials delivered in Ghana",
  description:
    "Shop electronics, fashion, home and beauty. Fast delivery across Ghana, Mobile Money accepted.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

// Applies the saved background theme before first paint (avoids a flash)
const themeInitScript = `(function(){try{var t=localStorage.getItem('unclaim-theme');if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <ProductsProvider>
                <CartProvider>
                  <Navbar />
                  <main className="container main">{children}</main>
                  <Footer />
                  <ChatWidget />
                  <ThemeFab />
                </CartProvider>
              </ProductsProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
