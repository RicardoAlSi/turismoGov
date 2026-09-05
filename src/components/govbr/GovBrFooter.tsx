"use client";

import { BrFooter } from "@govbr-ds/react-components";

/**
 * Rodapé institucional do site, baseado no componente oficial `BrFooter`.
 */
export function GovBrFooter() {
  return (
    <BrFooter
      urlLogo="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png"
      links={[
        {
          category: "Observatório",
          items: [
            { label: "Sobre o Observatório", link: "/sobre" },
            { label: "Indicadores", link: "/indicadores" },
            { label: "Notícias", link: "/noticias" },
          ],
        },
        {
          category: "Participe",
          items: [
            { label: "Envie um Evento", link: "/envie-um-evento" },
            { label: "Colabore com dados", link: "/colabore" },
          ],
        },
        {
          category: "Acesso à informação",
          items: [
            { label: "Acessibilidade", link: "/acessibilidade" },
            { label: "Política de Privacidade", link: "/privacidade" },
          ],
        },
      ]}
      socialNetworks={[
        { icon: "fab fa-instagram", link: "https://instagram.com", name: "Instagram" },
        { icon: "fab fa-youtube", link: "https://youtube.com", name: "YouTube" },
      ]}
      userLicenseText="Conteúdo produzido pelo Observatório do Turismo Religioso Brasileiro, exceto quando indicado o contrário, está publicado sob a licença Creative Commons - Atribuição 4.0 Internacional."
    />
  );
}