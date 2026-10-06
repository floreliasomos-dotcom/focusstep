import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-body-family",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Dirección pública: se fija con NEXT_PUBLIC_SITE_URL al publicar (dominio aún no comprado, Sesión 6).
const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITULO = "FocusStep — Un solo paso a la vez, sin culpa";
const DESCRIPCION =
  "Cumple tus metas diarias sin listas infinitas de tareas ni la culpa de romper una racha.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: TITULO,
  description: DESCRIPCION,
  applicationName: "FocusStep",
  openGraph: { title: TITULO, description: DESCRIPCION, siteName: "FocusStep", locale: "es_LA", type: "website" },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
};

export const viewport: Viewport = { themeColor: "#BD5227" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${baloo2.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
