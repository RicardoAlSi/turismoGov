"use client";

import dynamic from "next/dynamic";

const MapaInterativo = dynamic(
  () =>
    import("@/components/page/MapaInterativo").then(
      (mod) => mod.MapaInterativo
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-label="Carregando mapa"
        className="flex-1 flex items-center justify-center py-24 text-gray-500"
      >
        Carregando mapa interativo...
      </div>
    ),
  }
);

export function MapaInterativoLoader() {
  return <MapaInterativo />;
}