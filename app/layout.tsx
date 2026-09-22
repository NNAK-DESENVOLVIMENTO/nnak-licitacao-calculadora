import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NNAK | Calculadora de Licitações",
  description: "Calculadora interna para definição do lance mínimo em licitações."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
