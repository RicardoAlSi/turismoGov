"use client";

import dynamic from "next/dynamic";

const ClientShell = dynamic(
  () =>
    import("@/components/ClientShell").then((mod) => mod.ClientShell),
  { ssr: false }
);

/**
 * Carrega o shell (GovBrHeader + GovBrFooter) apenas no cliente.
 * O `@govbr-ds/react-components` embute `self`/`window` no escopo do
 * módulo, por isso `dynamic(ssr: false)` precisa estar num Client
 * Component — `ssr: false` é proibido em Server Components.
 */
export function ClientShellLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientShell>{children}</ClientShell>;
}