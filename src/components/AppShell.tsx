"use client";

import { GovBrBreadcrumb } from "@/components/govbr/GovBrBreadcrumb";
import { HeroSection } from "@/components/page/HeroSection";
import { StatsSection } from "@/components/page/StatsSection";
import { DestinationsSection } from "@/components/page/DestinationsSection";
import { EventsSection } from "@/components/page/EventsSection";
import { InfoBanner } from "@/components/page/InfoBanner";

/**
 * Conteúdo da página inicial. O header, a sidebar de navegação e o
 * footer são injetados pelo `ClientShell` (no layout), então este
 * componente renderiza apenas o `<main>` com as seções da home.
 *
 * Carregado via `next/dynamic` com `ssr: false` em `AppShellLoader.tsx`
 * porque agrupa UI que depende de `@govbr-ds/react-components`.
 */
export function AppShell() {
  return (
    <main className="min-w-0 flex-1 flex flex-col px-4 bg-zinc-100">
      <div className="gov-container p-0">
        <GovBrBreadcrumb
          crumbs={[{ label: "Início", isHome: true, href: "/", active: true }]}
        />
      </div>
      <div className="flex flex-col gap-8">
        <HeroSection />
        <StatsSection />
        <DestinationsSection />
        <EventsSection />
        <InfoBanner />
      </div>
    </main>
  );
}