"use client";

import { BrCard, BrTag } from "@govbr-ds/react-components";

interface ReligiousEvent {
  month: string;
  day: string;
  name: string;
  place: string;
  period: string;
  category: string;
}

const events: ReligiousEvent[] = [
  {
    month: "Mai",
    day: "12",
    name: "Romaria de Nossa Senhora Aparecida",
    place: "Aparecida - SP",
    period: "12 a 12 de Mai de 2027",
    category: "Romaria",
  },
  {
    month: "Mai",
    day: "18",
    name: "Festa de Pentecostes",
    place: "Trindade - GO",
    period: "18 a 18 de Mai de 2027",
    category: "Festa Religiosa",
  },
  {
    month: "Jun",
    day: "08",
    name: "Círio de Nazaré",
    place: "Belém - PA",
    period: "08 a 08 de Jun de 2027",
    category: "Procissão",
  },
  {
    month: "Jun",
    day: "13",
    name: "Festa de Santo Antônio",
    place: "Juazeiro do Norte - CE",
    period: "13 a 13 de Jun de 2027",
    category: "Festa Religiosa",
  },
];

/**
 * Lista de próximos eventos. O selo de data é um elemento de
 * conteúdo próprio (Tailwind); card e categoria usam os
 * componentes oficiais `BrCard` e `BrTag`.
 */
export function EventsSection() {
  return (
    <section className="gov-container p-0">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-semibold m-0">Próximos eventos</h2>
        <a
          href="/eventos"
          className="text-sm text-[var(--blue-warm-vivid-70,#1351b4)] hover:underline"
        >
          Ver calendário<i className="fa-solid fa-chevron-right" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event) => (
          <BrCard key={event.name}>
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center min-w-14 rounded bg-[var(--blue-warm-vivid-10,#eef4fb)] text-[var(--blue-warm-vivid-70,#1351b4)] px-2 py-1">
                <span className="text-xs font-bold uppercase">{event.month}</span>
                <span className="text-lg font-bold leading-none">{event.day}</span>
              </div>
              <div className="min-w-0">
                <strong className="block text-sm truncate" title={event.name}>{event.name}</strong>
                <p className="text-xs text-gray-600 my-1">{event.place}</p>
                <p className="text-xs text-gray-500 mb-2">{event.period}</p>
                <BrTag type="text" size="small" value={event.category} />
              </div>
            </div>
          </BrCard>
        ))}
      </div>
    </section>
  );
}