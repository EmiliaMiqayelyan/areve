import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE}/settings`, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error("unavailable");
    const data = await res.json();
    const title = data.siteContent?.metadata?.title as string | undefined;
    const description = data.siteContent?.metadata?.description as string | undefined;
    return {
      title: title ?? "AREVÉ",
      description: description ?? "",
    };
  } catch {
    return {
      title: "AREVÉ — Handmade with Warmth and Sunlight",
      description:
        "Discover AREVÉ's handcrafted beaded bags, unique toys, and artisan accessories. Every piece made with love, warmth, and sunlight.",
    };
  }
}

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
