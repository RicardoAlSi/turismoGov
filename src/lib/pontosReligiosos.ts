export interface PontoReligioso {
  nome: string;
  latitude: number;
  longitude: number;
  tipo_osm?: string;
  religiao?: string;
  denominacao?: string;
  descricao?: string;
  /** Campo reservado: quando o JSON passar a incluir imagens
   * (ex.: chave `imagem`), o card de destino passa a exibi-las. */
  imagem?: string;
}

let cache: Promise<PontoReligioso[]> | null = null;

export function getPontosReligiosos(): Promise<PontoReligioso[]> {
  if (!cache) {
    cache = fetch("/dados/pontos-religiosos.json").then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao carregar dados/pontos-religiosos.json");
      }
      return res.json() as Promise<PontoReligioso[]>;
    });
  }
  return cache;
}