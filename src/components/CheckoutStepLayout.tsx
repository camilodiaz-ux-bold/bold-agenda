import type { ReactNode } from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface Props {
  /** Sin onBack el botón no se muestra (estados terminales). */
  onBack?: () => void;
  backDisabled?: boolean;
  /** Sin onClose la X no se muestra (estados terminales). */
  onClose?: () => void;
  closeDisabled?: boolean;
  /** Resumen a la izquierda de la barra inferior ("1 Servicio / $220.000"). */
  summary?: { label: string; value: string };
  /** CTA de la barra inferior. Con resumen mide 174px; sin resumen ocupa el ancho seguro. */
  cta?: ReactNode;
  children: ReactNode;
}

/**
 * Superficie única de todos los pasos del checkout (frame Figma 29725:6812):
 * header de segundo nivel, contenido con scroll y barra inferior anclada.
 * La barra es hermana del scroll (no flota encima), así que nunca tapa contenido.
 */
export function CheckoutStepLayout({ onBack, backDisabled, onClose, closeDisabled, summary, cta, children }: Props) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <header className="flex items-center gap-2 px-3 pt-4 pb-4 shrink-0">
        <div className="w-6 h-6 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              disabled={backDisabled}
              aria-label="Volver"
              className="w-6 h-6 flex items-center justify-center transition-opacity active:opacity-60 disabled:opacity-30"
            >
              <ChevronLeft size={24} color="#121e6c" strokeWidth={2} />
            </button>
          )}
        </div>
        <h1 className="flex-1 min-w-0 text-center text-[16px] leading-5 font-semibold text-[#121e6c] truncate">Cerrar servicio</h1>
        <div className="w-6 h-6 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              disabled={closeDisabled}
              aria-label="Abandonar cierre"
              className="w-6 h-6 flex items-center justify-center transition-opacity active:opacity-60 disabled:opacity-30"
            >
              <X size={24} color="#121e6c" strokeWidth={2} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-6">{children}</div>

      {cta && (
        <div
          className="shrink-0 flex items-center gap-4 px-4 pt-5"
          style={{ backgroundColor: '#F7F8FB', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        >
          {summary && (
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[12px] leading-4 text-[#606060]">{summary.label}</span>
              <span className="text-[16px] leading-5 font-medium text-[#1e1e1e] tabular-nums">{summary.value}</span>
            </div>
          )}
          <div className={summary ? 'w-[174px] shrink-0' : 'w-full'}>{cta}</div>
        </div>
      )}
    </div>
  );
}
