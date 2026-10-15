import { Cormorant_Garamond, Noto_Sans_Armenian, Noto_Serif_Armenian } from "next/font/google";

export const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ["armenian", "latin"],
  variable: "--font-noto-serif-armenian",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian", "latin"],
  variable: "--font-noto-sans-armenian",
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Latin display face for the English locale — close to the logo's high-contrast serif. */
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const fontVariables = `${notoSerifArmenian.variable} ${notoSansArmenian.variable} ${cormorantGaramond.variable}`;
