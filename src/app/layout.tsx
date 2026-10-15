import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy" className={`${fontVariables} locale-hy`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
