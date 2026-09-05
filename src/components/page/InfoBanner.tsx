/**
 * Aviso institucional simples. Não depende de estado nem de
 * componentes do GovBR-DS com hooks, então permanece um Server
 * Component (não precisa de "use client").
 */
export function InfoBanner() {
  return (
    <div className="gov-container p-0">
      <p className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
        <i className="fa-solid fa-circle-info" aria-hidden="true" />
        Os dados apresentados são continuamente atualizados. Participe
        enviando informações sobre eventos e destinos religiosos.
      </p>
    </div>
  );
}