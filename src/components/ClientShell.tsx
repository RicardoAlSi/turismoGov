"use client";

import { GovBrHeader } from "@/components/govbr/GovBrHeader";
import { GovBrFooter } from "@/components/govbr/GovBrFooter";
import { AppSidebar } from "@/components/AppSidebar";

/**
 * Shell compartilhado que adiciona GovBrHeader, a sidebar de
 * navegação (AppSidebar) e GovBrFooter em todas as páginas.
 * Carregado via `dynamic` com `ssr: false` no `layout.tsx` para
 * evitar que `@govbr-ds/react-components` tente acessar
 * `self`/`window` no servidor.
 */
export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GovBrHeader />
      <AppSidebar>{children}</AppSidebar>
      <GovBrFooter />
    </>
  );
}