import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  /** Conteúdo principal do card. */
  children?: ReactNode;
  /** Título exibido no cabeçalho do card. */
  title?: string;
  /** Subtítulo exibido no cabeçalho do card, logo abaixo do título. */
  subtitle?: string;
  /** Conteúdo do rodapé do card. */
  footer?: ReactNode;
  /** Classes CSS adicionais aplicadas ao card. */
  className?: string;
  /** Estilos inline adicionais. */
  style?: CSSProperties;
  /** Chamado ao clicar no card. */
  onClick?: () => void;
}

/**
 * Card de conteúdo independente, com estrutura e estética equivalentes
 * ao BrCard do GovBR-DS (classes `br-card`, `card-header`, `card-content`
 * e `card-footer`), criado para permitir ajustes sem depender do
 * componente do pacote.
 */
export function Card({
  children,
  title,
  subtitle,
  footer,
  className = "",
  style,
  onClick,
}: CardProps) {
  const hasHeader = Boolean(title || subtitle);

  return (
    <div
      className={`br-card p-0 flex flex-col gap-3${className ? ` ${className}` : ""}`}
      style={style}
      onClick={onClick}
    >
      {hasHeader && (
        <div className="card-header p-0 px-3">
          <div className="d-flex">
            <div>
              {title && (
                <div className="text-weight-semi-bold text-up-02">{title}</div>
              )}
              {subtitle && <div>{subtitle}</div>}
            </div>
          </div>
        </div>
      )}
      {children !== undefined && <div className="card-content pb-0">{children}</div>}
      {footer !== undefined && <div className="card-footer">{footer}</div>}
    </div>
  );
}