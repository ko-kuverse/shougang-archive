import {
  Barlow_Condensed,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";

export const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const sansFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontClassName = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
].join(" ");
