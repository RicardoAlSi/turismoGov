import type { Metadata } from "next";
import { ClientShellLoader } from "@/components/ClientShellLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Observatório do Turismo Religioso Brasileiro",
  description:
    "Informação, inteligência e dados para fomentar o turismo religioso em todas as regiões do Brasil, valorizando a diversidade da fé e da cultura.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        <ClientShellLoader>{children}</ClientShellLoader>
      </body>
    </html>
  );
}