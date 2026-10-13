import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import type { PaymentMethod } from '../types';
import { formatCOP } from '../data/appointments';
import type { TipPreset } from '../lib/closure';
import { Card, Field } from './CheckoutParts';
import { paymentMethodLabel } from './PaymentMethodModal';

const CORAL = '#FF2947';

/** Enlace de acción de sección ("+ Agregar método"): coral, subrayado, 12px semibold (Figma 29747:7836). */
function SectionLink({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 py-3 active:opacity-60">
      <span className="text-[24px] leading-6 font-light" style={{ color: CORAL }} aria-hidden>+</span>
      <span className="text-[12px] leading-4 font-semibold underline" style={{ color: CORAL }}>{children}</span>
    </button>
  );
}

function SectionHeader({ label, action }: { label: string; action?: { text: string; onClick: () => void } }) {
  return (
    <div className="flex items-center justify-between min-h-[29px]">
      <span className="text-[12px] leading-4 text-[#606060]">{label}</span>
      {action && <SectionLink onClick={action.onClick}>{action.text}</SectionLink>}
    </div>
  );
}

// ── Resumen financiero (Figma "History Card") ───────────────────────────────
export function PaymentSummary({ total, subtotal, prepaid, tip, tipLabel }: {
  total: number;
  subtotal: number;
  prepaid: number;
  /** Solo se muestra si la propina está activa. */
  tip?: number;
  tipLabel?: string;
}) {
  const row = (label: string, value: string, color = '#1e1e1e') => (
    <div className="flex items-center h-4 gap-3">
      <span className="flex-1 text-[12px] leading-4 text-[#1e1e1e]">{label}</span>
      <span className="text-[12px] leading-4 font-medium tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="text-[12px] leading-4 text-[#1e1e1e]">Total a cobrar</span>
        <span className="text-[24px] leading-7 text-[#1e1e1e] tabular-nums">{formatCOP(total)}</span>
      </div>
      <div className="flex flex-col gap-1">
        {row('Servicios', formatCOP(subtotal))}
        {prepaid > 0 && row('Prepago', `-${formatCOP(prepaid)}`, '#15803D')}
        {tip !== undefined && row(tipLabel ?? 'Propina', formatCOP(tip))}
      </div>
    </div>
  );
}

// ── Toggle (Figma "Toggle switch" 52×28) ────────────────────────────────────
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative shrink-0 w-[52px] h-7 rounded-full transition-colors"
      style={{ backgroundColor: on ? CORAL : '#D2D4E1' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  );
}

// ── Propina: apagada por defecto ────────────────────────────────────────────
export function TipControl({ enabled, onToggle, preset, onPreset, amountText, onAmountChange, error }: {
  enabled: boolean;
  onToggle: (on: boolean) => void;
  preset: TipPreset;
  onPreset: (p: TipPreset) => void;
  /** Valor del input: el monto calculado del preset o el monto manual. */
  amountText: string;
  onAmountChange: (v: string) => void;
  error: string | null;
}) {
  const title = !enabled ? 'Agregar propina' : typeof preset === 'number' && preset > 0 ? `Propina con el ${preset}%` : 'Propina';
  return (
    <div className="flex flex-col gap-3">
      <SectionHeader label="Propina" />
      <div className="bg-white rounded-2xl px-3 py-3 flex items-center gap-3">
        <span className="flex-1 text-[14px] leading-5 text-[#1e1e1e]">{title}</span>
        <Toggle on={enabled} onChange={onToggle} label="Propina" />
      </div>
      {enabled && (
        <>
          <div className="flex gap-2">
            {([5, 10, 'custom'] as TipPreset[]).map(p => {
              const active = preset === p;
              return (
                <button
                  key={String(p)}
                  onClick={() => onPreset(p)}
                  className="flex-1 h-9 rounded-full text-[12px] font-semibold border transition-colors active:opacity-70"
                  style={{
                    backgroundColor: active ? '#121e6c' : '#fff',
                    color: active ? '#fff' : '#606060',
                    borderColor: active ? '#121e6c' : '#d2d4e1',
                  }}
                >
                  {p === 'custom' ? 'Otra' : `${p}%`}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tip-amount" className="text-[14px] leading-5 font-semibold text-[#121e6c]">Propina</label>
            <div
              className="h-10 bg-white rounded-xl px-3 flex items-center gap-1 border"
              style={{ borderColor: error ? '#BE123C' : 'transparent' }}
            >
              <span className="text-[14px] text-[#1e1e1e]">$</span>
              <input
                id="tip-amount"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountText}
                onChange={e => onAmountChange(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-[14px] leading-5 font-medium text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
              />
            </div>
            {error && <p className="text-[12px] text-[#BE123C]">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}

// ── Método de cobro: una sola línea (no hay split payment) ──────────────────
export function PaymentMethodsSection({ method, amount, state, onAdd, onChange, onRemove, onReload }: {
  method: PaymentMethod | null;
  amount: number;
  state: 'ok' | 'loading' | 'error';
  onAdd: () => void;
  onChange: () => void;
  onRemove: () => void;
  onReload: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-[#d2d4e1]/60">
      <SectionHeader
        label="Métodos de cobro"
        action={state === 'ok' && !method ? { text: 'Agregar método', onClick: onAdd } : undefined}
      />

      {state === 'loading' && (
        <Card className="items-center justify-center gap-2 py-6 flex-row">
          <Loader2 size={18} color="#121e6c" className="animate-spin" />
          <span className="text-[14px] text-[#969696]">Cargando medios de pago…</span>
        </Card>
      )}

      {state === 'error' && (
        <Card className="items-center gap-2 text-center">
          <p className="text-[14px] text-[#1e1e1e]">No pudimos cargar los medios de pago</p>
          <button onClick={onReload} className="flex items-center gap-1.5 text-[14px] font-bold text-[#121e6c] active:opacity-60">
            <RefreshCw size={14} color="#121e6c" strokeWidth={2.5} />
            Reintentar
          </button>
        </Card>
      )}

      {state === 'ok' && method && (
        <div className="flex items-end gap-4">
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-3">
            <Field label="Método" value={paymentMethodLabel(method)} onClick={onChange} />
            <Field label="Monto" value={formatCOP(amount)} />
          </div>
          <button
            onClick={onRemove}
            aria-label="Quitar método de cobro"
            className="w-6 h-10 flex items-center justify-center shrink-0 active:opacity-60"
          >
            <Trash2 size={24} color="#121e6c" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {state === 'ok' && !method && (
        <p className="text-[12px] leading-4 text-[#606060]">Agrega el método con el que cobrarás el servicio.</p>
      )}
    </div>
  );
}
