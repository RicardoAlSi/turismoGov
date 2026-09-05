"use client";

import Link from "next/link";
import { BrButton } from "@govbr-ds/react-components";

export function HeroSection() {
  return (
    <section className="gov-container rounded-2xl relative w-full bg-[url('/catedral.jpg')] bg-cover bg-center bg-no-repeat p-6 md:p-12 min-h-[350px] flex items-center">

      <div className="absolute rounded-[15px] inset-0 bg-linear-to-r from-white via-white/60 md:via-white/90 md:via-40% via-100% to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-4 max-w-xl md:max-w-1xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold mb-1 md:text-4xl text-[var(--blue-warm-vivid-70,#1351b4)] flex flex-col">
            Observatório do <span>Turismo Religioso Brasileiro</span>
          </h1>
          <p className="text-base text-gray-700 font-normal">
            Informação, inteligência e dados para fomentar o turismo religioso
            em todas as regiões do Brasil, valorizando a diversidade da fé e da
            cultura.
          </p>
        </div>
        <div>
          <Link href="/mapa-interativo">
            <BrButton primary icon="fa-solid fa-map" className="rounded-xl font-light">
              Explorar o mapa
            </BrButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
