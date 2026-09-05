"use client";

import dynamic from "next/dynamic";

const AppShell = dynamic(
  () => import("@/components/AppShell").then((mod) => mod.AppShell),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Carregando página"
        className="flex-1 flex items-center justify-center py-24 text-gray-500"
      >
        Carregando...
      </div>
    ),
  }
);

export function AppShellLoader() {
  return <AppShell />;
}