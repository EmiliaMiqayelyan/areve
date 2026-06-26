import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { getApiBaseUrl } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/settings`, { next: { revalidate: 120 } });
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
      title: 'AREVÉ — Ձեռագործ՝ ջերմությամբ և արևի լույսով',
      description:
        'Բացահայտեք AREVÉ-ի ձեռագործ բիջակապարց տոպրակները, եզակի խաղալիքներն ու արհեստավոր աքսեսուարները։',
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" suppressHydrationWarning>
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
