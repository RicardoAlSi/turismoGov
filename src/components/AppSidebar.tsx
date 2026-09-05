"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Início", link: "/", icon: "fa-house" },
  { label: "Destino", link: "/destino", icon: "fa-map" },
  { label: "Eventos", link: "/eventos", icon: "fa-calendar-days" },
  { label: "Mapa Interativo", link: "/mapa-interativo", icon: "fa-map-location-dot" },
  { label: "Indicadores", link: "/indicadores", icon: "fa-chart-column" },
  { label: "Notícias", link: "/noticias", icon: "fa-newspaper" },
  { label: "Sobre o Observatório", link: "/sobre", icon: "fa-circle-info" },
];

/**
 * Sidebar de navegação principal, compartilhada por todas as páginas.
 *
 * Desktop: empurra o conteúdo quando aberta (transição de largura).
 * Celular (≤768px): sobrepõe o conteúdo (slide lateral) com um
 * backdrop para fechar ao tocar fora.
 *
 * O botão hambúrguer é renderizado pelo `BrHeader` do GovBR-DS como
 * `button[data-target="#main-navigation"]` (data-toggle="menu",
 * id="navigation"). Como não usamos `<BrMenu>`, esse botão é inerte:
 * este componente escuta o `click` no document e alterna `menuOpen`.
 */
export function AppSidebar({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.('button[data-target="#main-navigation"]')) {
        setMenuOpen((open) => !open);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const button = document.querySelector<HTMLButtonElement>(
      'button[data-target="#main-navigation"]'
    );
    if (!button) return;
    const icon = button.querySelector("i.fa-bars, i.fa-xmark");
    icon?.classList.toggle("fa-bars", !menuOpen);
    icon?.classList.toggle("fa-xmark", menuOpen);
    button.setAttribute("aria-label", menuOpen ? "Fechar menu" : "Abrir menu");
    button.setAttribute("aria-expanded", String(menuOpen));
  }, [menuOpen]);

  return (
    <div className={`relative flex flex-1 ${menuOpen ? "sidebar-open" : ""}`}>
      {menuOpen && (
        <div
          className="app-backdrop"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className="app-sidebar shrink-0"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="h-full bg-blue-950 gap-4 flex flex-col">
          <div className="flex justify-between items-center bg-blue-950 px-4 pt-4 gap-2">
            <Image
              src={"/logo.png"}
              alt=""
              width={1000}
              height={1000}
              className="w-auto h-18"
            />
            <p className="font-medium text-white flex flex-col text-sm m-0">
              <span className="font-bold">OBSERVATÓRIO</span> DO TURISMO
              RELIGIOSO BRASILEIRO
            </p>
          </div>
          <nav
            className="h-full w-72 overflow-y-auto bg-blue-950 px-4"
            aria-label="Menu principal"
          >
            <ul className="m-0 p-0 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.link}>
                  <a
                    href={item.link}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 pl-4 rounded-xl py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-gray-50 hover:text-blue-700"
                  >
                    <i
                      className={`fa-solid ${item.icon} w-4 text-center text-base`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {children}
    </div>
  );
}