import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { getApiBaseUrl } from "@/lib/api";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { fontVariables } from "@/lib/fonts";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetchWithTimeout(`${getApiBaseUrl()}/settings`, { next: { revalidate: 120 } });
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
    <html lang="hy" className={`${fontVariables} locale-hy`} suppressHydrationWarning>
      <body style={{ background: '#F8F5F2', color: 'var(--color-ink)' }}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
