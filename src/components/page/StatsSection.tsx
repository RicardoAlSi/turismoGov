"use client";

import { useEffect, useState } from "react";
import { BrCard } from "@govbr-ds/react-components";
import { getPontosReligiosos } from "@/lib/pontosReligiosos";

interface Stat {
  icon: string;
  value: string;
  label: string;
  iconColor: string;
}

const baseStats: Stat[] = [
  {
    icon: "fa-regular fa-calendar",
    value: "1.890",
    label: "Eventos cadastrados neste ano",
    iconColor: "#168821",
  },
  {
    icon: "fa-solid fa-users",
    value: "18,6 mi",
    label: "Visitantes estimados em eventos religiosos (ano)",
    iconColor: "#8a4fdb",
  },
  {
    icon: "fa-solid fa-building",
    value: "1.248",
    label: "Municípios envolvidos em todas as regiões",
    iconColor: "#c15a1f",
  },
];

/**
 * Grade de indicadores institucionais. O primeiro valor
 * (Destinos Religiosos em todo o Brasil) é o total de pontos
 * carregados de `dados/pontos-religiosos.json`.
 */
export function StatsSection() {
  const [destinationsCount, setDestinationsCount] = useState("0");

  useEffect(() => {
    let cancelled = false;
    getPontosReligiosos()
      .then((data) => {
        if (!cancelled) {
          setDestinationsCount(data.length.toLocaleString("pt-BR"));
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats: Stat[] = [
    {
      icon: "fa-solid fa-location-dot",
      value: destinationsCount,
      label: "Destinos Religiosos em todo o Brasil",
      iconColor: "#1351b4",
    },
    ...baseStats,
  ];

  return (
    <section className="gov-container p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {stats.map((stat) => (
          <BrCard key={stat.label} className="rounded-xl">
            <div className="flex items-center gap-3">
              <i className={stat.icon} style={{ fontSize: "1.5rem", color: stat.iconColor }} />
              <div>
                <strong className="block text-xl">{stat.value}</strong>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
            </div>
          </BrCard>
        ))}
      </div>
    </section>
  );
}