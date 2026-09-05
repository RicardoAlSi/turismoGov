"use client";

import { BrBreadcrumbs, type BrBreadcrumbsLink } from "@govbr-ds/react-components";

interface GovBrBreadcrumbProps {
  crumbs: BrBreadcrumbsLink[];
}

/**
 * Trilha de navegação (breadcrumb) institucional, baseada no
 * componente oficial `BrBreadcrumbs`. Recebe os itens da página
 * que o utiliza, sempre com "Início" como primeiro item.
 */
export function GovBrBreadcrumb({ crumbs }: GovBrBreadcrumbProps) {
  return <BrBreadcrumbs crumbs={crumbs} />;
}