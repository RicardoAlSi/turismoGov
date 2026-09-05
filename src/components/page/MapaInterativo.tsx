"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { getPontosReligiosos, type PontoReligioso } from "@/lib/pontosReligiosos";

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RAIO_KM = 15;
const MAX_RESULTADOS = 200;

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
});

const ESTADOS: Array<{ sigla: string; nome: string }> = [
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

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
};

/** Valores únicos de `religiao` no JSON, normalizados (lowercase/tolower). */
const RELIGIOES = [
  { valor: "christian", rotulo: "Cristã" },
  { valor: "catholic", rotulo: "Católica" },
  { valor: "baptist", rotulo: "Batista" },
  { valor: "evangelical", rotulo: "Evangélica" },
  { valor: "protestant", rotulo: "Protestante" },
  { valor: "spiritualist", rotulo: "Espírita" },
  { valor: "jewish", rotulo: "Judaica" },
  { valor: "buddhist", rotulo: "Budista" },
  { valor: "muslim", rotulo: "Muçulmana" },
  { valor: "shinto", rotulo: "Xintoísta" },
  { valor: "hindu", rotulo: "Hinduísta" },
  { valor: "umbanda", rotulo: "Umbanda" },
  { valor: "candomblé", rotulo: "Candomblé" },
  { valor: "matriz_africana", rotulo: "Afro-brasileira" },
];

function religionLabel(raw?: string): string {
  if (!raw) return "Não especificada";
  if (RELIGION_LABELS[raw]) return RELIGION_LABELS[raw];
  if (raw.includes("candomblé") || raw.includes("candomble")) return "Candomblé";
  if (raw.includes("umbanda")) return "Umbanda";
  if (raw.includes("espírita") || raw.includes("espirita")) return "Espírita";
  if (raw.includes("catolic")) return "Católica";
  if (raw.includes("evangel")) return "Evangélica";
  if (raw.includes("matriz_africana") || raw.includes("afro")) return "Afro-brasileira";
  if (raw === "Não especificada" || raw === "none") return "Não especificada";
  return raw.replaceAll("_", " ");
}

function religionNormalized(raw?: string): string {
  return (raw || "").trim().toLowerCase();
}

interface ResultadoPonto {
  id: string;
  nome: string;
  religiao: string;
  lat: number;
  lon: number;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function urlGoogleMaps(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

async function geocodificarCidade(
  cidade: string,
  uf: string
): Promise<{ lat: number; lon: number }> {
  const params = new URLSearchParams({
    q: `${cidade}, ${uf}, Brasil`,
    format: "json",
    countrycodes: "br",
    limit: "5",
  });
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "Accept-Language": "pt-BR" } }
  );
  if (!resp.ok) throw new Error("Falha ao localizar a cidade.");
  const resultados = (await resp.json()) as Array<{
    lat: string;
    lon: string;
    display_name?: string;
  }>;
  if (resultados.length === 0) {
    throw new Error(
      `Cidade "${cidade}" (${uf}) não encontrada. Verifique o nome e tente novamente.`
    );
  }
  const ufLower = uf.toLowerCase();
  const match =
    resultados.find((r) =>
      (r.display_name || "").toLowerCase().includes(ufLower)
    ) || resultados[0];
  return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };
}

function criarIcone(numero: number): L.DivIcon {
  return L.divIcon({
    className: "poi-marker",
    html: `<div class="poi-marker-inner">${numero}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function escapeHtml(str: unknown): string {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

export function MapaInterativo() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const pointsRef = useRef<PontoReligioso[]>([]);
  const activeMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("MA");
  const [religiao, setReligiao] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [erro, setErro] = useState("");
  const [resultados, setResultados] = useState<ResultadoPonto[]>([]);
  const [totalPontos, setTotalPontos] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getPontosReligiosos().then((dados) => {
      if (cancelled) return;
      pointsRef.current = dados;
      setTotalPontos(dados.length);

      if (!mapRef.current) return;
      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [-14.2, -51.9],
        4
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">colaboradores OpenStreetMap</a>',
      }).addTo(map);

      const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });
      cluster.addTo(map);

      const markers = dados
        .filter((p) => p.latitude != null && p.longitude != null)
        .map((p) =>
          L.marker([p.latitude as number, p.longitude as number], {
            title: p.nome,
          })
        );
      cluster.addLayers(markers);

      markersRef.current = map;
      clusterRef.current = cluster;
      setLoading(false);
    });

    return () => {
      cancelled = true;
      markersRef.current?.remove();
      markersRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  const exibirResultados = (pois: ResultadoPonto[]) => {
    const map = markersRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();

    if (pois.length === 0) {
      map.setView([-14.2, -51.9], 4);
      setResultados([]);
      return;
    }

    const bounds: Array<[number, number]> = [];

    pois.forEach((poi, index) => {
      const marker = L.marker([poi.lat, poi.lon], {
        icon: criarIcone(index + 1),
        title: poi.nome,
      });
      marker.bindPopup(`
        <div class="poi-popup">
          <strong class="poi-popup-nome">${escapeHtml(poi.nome)}</strong>
          <span class="poi-popup-religiao">${escapeHtml(poi.religiao)}</span>
          <a href="${urlGoogleMaps(poi.lat, poi.lon)}" target="_blank" rel="noopener">Ver no Google Maps</a>
        </div>`);
      cluster.addLayer(marker);
      activeMarkersRef.current.set(poi.id, marker);
      bounds.push([poi.lat, poi.lon]);
    });

    if (bounds.length === 1) {
      map.flyTo(bounds[0], 15, { duration: 0.8 });
    } else {
      map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8, maxZoom: 15 });
    }
    setResultados(pois);
  };

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = cidade.trim();
    if (!nome) return;

    setSearching(true);
    setErro("");

    try {
      const { lat, lon } = await geocodificarCidade(nome, uf);
      const religiaoNorm = religionNormalized(religiao);

      const dentroRaio = pointsRef.current
        .filter((p) => {
          if (p.latitude == null || p.longitude == null) return false;
          if (
            religiaoNorm !== "todas" &&
            religionNormalized(p.religiao) !== religiaoNorm
          ) {
            return false;
          }
          return haversineKm(lat, lon, p.latitude, p.longitude) <= RAIO_KM;
        })
        .map((p) => ({
          id: `${p.nome}|${p.latitude}|${p.longitude}`,
          nome: p.nome,
          religiao: religionLabel(p.religiao),
          lat: p.latitude as number,
          lon: p.longitude as number,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        .slice(0, MAX_RESULTADOS);

      exibirResultados(dentroRaio);
      if (dentroRaio.length === 0) {
        setErro(
          `Nenhum ponto religioso encontrado em "${nome} (${uf})" num raio de ${RAIO_KM} km. Tente outra cidade ou remova o filtro de religião.`
        );
      }
    } catch (error) {
      console.error(error);
      setErro(error instanceof Error ? error.message : "Falha na busca.");
      setResultados([]);
      markersRef.current?.setView([-14.2, -51.9], 4);
    } finally {
      setSearching(false);
    }
  };

  const lista = resultados.map((poi, index) => (
    <button
      key={poi.id}
      type="button"
      onClick={() => {
        const map = markersRef.current;
        if (!map) return;
        map.flyTo([poi.lat, poi.lon], 17, { duration: 0.8 });
        activeMarkersRef.current.get(poi.id)?.openPopup();
      }}
      className="flex w-full gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-blue-300 hover:shadow-sm"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
        {index + 1}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900">
          {poi.nome}
        </span>
        <span className="block text-xs text-gray-500">{poi.religiao}</span>
      </span>
    </button>
  ));

  return (
    <section className="mapa-interativo gov-container p-0 flex-1 flex flex-col min-h-0 lg:h-[calc(100vh-7rem)]">
      <div className="flex flex-col flex-1 min-h-0 lg:flex-row overflow-hidden rounded-xl border border-gray-200 bg-white">
        <aside className="flex flex-col border-r border-gray-200 bg-white p-4 lg:min-h-0 lg:w-96 lg:shrink-0">
          <header className="shrink-0">
            <div className="mb-4">
              <h1 className="m-0 text-xl font-semibold text-gray-900">
                Mapa Interativo
              </h1>
              <p className="m-0 mt-1 text-sm text-gray-500">
                {totalPontos > 0
                  ? `${totalPontos.toLocaleString("pt-BR")} locais cadastrados. Busque por cidade ou navegue pelo mapa.`
                  : "Carregando locais cadastrados..."}
              </p>
            </div>

            <form onSubmit={buscar} className="flex flex-col gap-3" role="search">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="mi-cidade"
                  className="text-sm font-medium text-gray-700"
                >
                  Cidade
                </label>
                <input
                  id="mi-cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: São Luís"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="mi-uf"
                    className="text-sm font-medium text-gray-700"
                  >
                    Estado
                  </label>
                  <select
                    id="mi-uf"
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.sigla} value={e.sigla}>
                        {e.nome} ({e.sigla})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="mi-religiao"
                    className="text-sm font-medium text-gray-700"
                  >
                    Religião
                  </label>
                  <select
                    id="mi-religiao"
                    value={religiao}
                    onChange={(e) => setReligiao(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="todas">Todas</option>
                    {RELIGIOES.map((r) => (
                      <option key={r.valor} value={r.valor}>
                        {r.rotulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={searching || loading}
                  className="flex-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {searching ? "Buscando..." : "Buscar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCidade("");
                    setUf("MA");
                    setReligiao("todas");
                    setErro("");
                    setResultados([]);
                    clusterRef.current?.clearLayers();
                    markersRef.current?.setView([-14.2, -51.9], 4);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Limpar
                </button>
              </div>
            </form>

            {erro && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {erro}
              </div>
            )}
          </header>

          <div className="mt-4 flex min-h-0 flex-1 flex-col lg:min-h-0">
            <div className="flex shrink-0 items-center justify-between">
              <h2 className="m-0 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Resultados
              </h2>
              {resultados.length > 0 && (
                <span className="text-sm text-gray-500">
                  {resultados.length} local(is)
                </span>
              )}
            </div>

            <ul className="m-0 mt-2 list-none space-y-2 overflow-y-auto p-0 max-h-[40vh] lg:max-h-none lg:flex-1 lg:min-h-0">
              {lista}
              {resultados.length === 0 && !erro && (
                <li className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                  Digite o nome de uma cidade e escolha o estado para descobrir
                  os pontos religiosos próximos num raio de {RAIO_KM} km.
                </li>
              )}
            </ul>
          </div>

          <footer className="mt-4 shrink-0 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-400">
            Busca por geocodificação (Nominatim/OpenStreetMap). A cobertura e a
            precisão variam conforme a base de pontos cadastrados.
          </footer>
        </aside>

        <div className="relative min-h-[55vh] flex-1 lg:min-h-0">
          <div
            ref={mapRef}
            className="map-leaflet absolute inset-0 h-full w-full"
          />
          {loading && (
            <div className="absolute inset-0 z-[400] flex items-center justify-center bg-gray-100/80 text-gray-600">
              Carregando mapa...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}