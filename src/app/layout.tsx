import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { getSiteContentForLocale } from "@/i18n/siteContent";
import { fontVariables } from "@/lib/fonts";

const defaultMeta = getSiteContentForLocale("hy").metadata;

export const metadata: Metadata = {
  title: defaultMeta.title,
  description: defaultMeta.description,
};

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
