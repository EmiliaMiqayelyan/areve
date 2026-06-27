import { Noto_Sans_JP, Noto_Serif_Armenian } from "next/font/google";

export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ["armenian", "latin"],
  variable: "--font-noto-serif-armenian",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontVariables = `${notoSansJP.variable} ${notoSerifArmenian.variable}`;
