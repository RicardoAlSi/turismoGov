"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BrTag } from "@govbr-ds/react-components";
import { Card } from "@/components/ui/Card";
import {
  getPontosReligiosos,
  type PontoReligioso,
} from "@/lib/pontosReligiosos";

const MAX_DESTINATIONS = 3;

const RELIGION_LABELS: Record<string, string> = {
  christian: "Cristã",
  catholic: "Católica",
  jewish: "Judaica",
  buddhist: "Budista",
  muslim: "Muçulmana",
  shinto: "Xintoísta",
  hindu: "Hinduísta",
  spiritualist: "Espírita",
  umbanda: "Umbanda",
  candomblé: "Candomblé",
  matriz_africana: "Afro-brasileira",
};

function religionLabel(raw?: string): string {
  if (!raw) return "Não especificada";
  if (RELIGION_LABELS[raw]) return RELIGION_LABELS[raw];
  if (raw.includes("candomblé") || raw.includes("candomble")) return "Candomblé";
  if (raw.includes("umbanda")) return "Umbanda";
  if (raw.includes("espírita") || raw.includes("espirita")) return "Espírita";
  return raw.replaceAll("_", " ");
}

function destinationSubtitle(dest: PontoReligioso): string {
  // if (dest.descricao?.trim()) return dest.descricao;
  // if (dest.denominacao?.trim()) return dest.denominacao.replaceAll("_", " ");
  return religionLabel(dest.religiao);
}

function pickRandom<T>(items: T[], max: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, max);
}

/**
 * Grade de destinos em destaque, puxada do arquivo
 * `dados/pontos-religiosos.json`. Exibe 3 pontos turísticos
 * aleatórios; sem imagem, apresenta um bloco neutro com a
 * inicial do nome do local.
 */
export function DestinationsSection() {
  const [destinations, setDestinations] = useState<PontoReligioso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPontosReligiosos()
      .then((data) => {
        if (cancelled) return;
        setDestinations(pickRandom(data, MAX_DESTINATIONS));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="gov-container p-0">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold m-0">Destinos em destaque</h2>
        <a
          href="/destinos"
          className="text-sm text-[var(--blue-warm-vivid-70,#1351b4)] hover:underline"
        >
          Ver todos <i className="fa-solid fa-chevron-right" />
        </a>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando destinos...</p>
      ) : (
        <div className="destinations-grid overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <Card
              key={`${dest.nome}-${dest.latitude}-${dest.longitude}`}
              title={dest.nome}
              subtitle={`${destinationSubtitle(dest)}`}
              footer={<BrTag type="text" value={religionLabel(dest.religiao)} 
              className=""/>}
            >
              <div className="relative -mx-4 -mt-4 flex h-36 items-center justify-center overflow-hidden rounded-t bg-gray-200">
                {dest.imagem ? (
                  <Image
                    src={dest.imagem}
                    alt={`Vista do destino religioso ${dest.nome}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-gray-400">
                    {(dest.nome?.trim().charAt(0) || "?").toUpperCase()}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}