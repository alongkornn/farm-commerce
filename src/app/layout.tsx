import type { Metadata } from "next";
import { Manrope, Noto_Sans_Thai } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const bodyFont = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  display: "swap",
});

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Farm Commerce | ผลไม้จากสวน ส่งตรงถึงคุณ",
    template: "%s | Farm Commerce",
  },
  description:
    "ตลาดผลไม้และประสบการณ์ท่องเที่ยวสวน เชื่อมต่อผู้ซื้อกับสวนที่ไว้ใจได้",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
