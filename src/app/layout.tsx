import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "AREVÉ — Handmade with Warmth and Sunlight",
  description: "Discover AREVÉ's handcrafted beaded bags, unique toys, and artisan accessories. Every piece made with love, warmth, and sunlight.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#F8F5F2', color: '#2B2B2B' }}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
