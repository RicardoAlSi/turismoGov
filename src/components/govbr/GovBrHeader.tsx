"use client";

import { BrHeader } from "@govbr-ds/react-components";

/**
 * Header institucional do site, baseado no componente oficial
 * `BrHeader` do GovBR Design System.
 *
 * Precisa ser Client Component porque o BrHeader usa estado
 * interno (useState) para o menu mobile e a barra de busca,
 * e a biblioteca não inclui a diretiva "use client".
 *
 * O botão de menu ("migalha") abre o drawer de navegação
 * `#main-navigation`, renderizado em `AppShell`.
 */
export function GovBrHeader() {
  return (
    <BrHeader
      urlLogo="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png"
      signature="Turismo Religioso Brasileiro"
      title="Observatório do Turismo Religioso Brasileiro"
      subTitle="Informação, inteligência e dados para fomentar o turismo religioso em todo o Brasil"
      showSearchBar
      showLoginButton
      showMenuButton
      menuId="main-navigation"
      loggedIn={false}
      sticky
      quickAccessLinks={[
        { label: "Ajuda", href: "/ajuda" },
        { label: "Acessibilidade", href: "/acessibilidade" },
      ]}
    />
  );
}