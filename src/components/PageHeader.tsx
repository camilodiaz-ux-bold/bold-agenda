import type { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  rightAction?: ReactNode;
  border?: boolean;
  /** Centers the title (with a matching-width spacer feel via flex-1 on both sides). For headers with a symmetric back + close pair. */
  centerTitle?: boolean;
  /** Header background color. Defaults to white; pass the page background to blend the header into the surface (no bar). */
  bg?: string;
}

export function PageHeader({ title, subtitle, onBack, onClose, rightAction, border = false, centerTitle = false, bg = '#ffffff' }: Props) {
  return (
    <header
      className={`px-4 pt-4 pb-3 flex items-center gap-2 flex-shrink-0${border ? ' border-b border-gray-100' : ''}`}
      style={{ backgroundColor: bg }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center -ml-2 shrink-0 transition-opacity active:opacity-60"
        >
          <ArrowLeft size={22} color="#121e6c" strokeWidth={2} />
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center -ml-2 shrink-0 transition-opacity active:opacity-60"
        >
          <X size={22} color="#121e6c" strokeWidth={2} />
        </button>
      )}
      <div className={centerTitle ? 'flex-1 min-w-0 flex flex-col items-center' : 'flex-1 min-w-0'}>
        <h1 className={`text-lg font-bold text-[#121e6c] leading-tight truncate${centerTitle ? ' text-center' : ''}`}>{title}</h1>
        {subtitle && (
          <p className="text-xs text-[#969696] mt-0.5 leading-none">{subtitle}</p>
        )}
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </header>
  );
}
