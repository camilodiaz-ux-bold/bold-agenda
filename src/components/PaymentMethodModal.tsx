import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { PaymentMethod } from '../types';
import bold from '../assets/payment-methods/bold.svg';
import efectivo from '../assets/payment-methods/efectivo.svg';
import nequi from '../assets/payment-methods/nequi.png';
import daviplata from '../assets/payment-methods/daviplata.png';
import credibanco from '../assets/payment-methods/credibanco.png';
import redeban from '../assets/payment-methods/redeban.png';
import addi from '../assets/payment-methods/addi.png';
import sistecredito from '../assets/payment-methods/sistecredito.svg';
import otro from '../assets/payment-methods/otro.svg';
import transferencia from '../assets/payment-methods/transferencia.svg';
import intercambio from '../assets/payment-methods/intercambio.svg';
import contraEntrega from '../assets/payment-methods/contra-entrega.svg';

/**
 * Catálogo de Bold POS (frame Figma 29747:7949). En el prototipo es solo una capa
 * de selección: ningún método tiene integración real todavía.
 * `tint`: íconos de línea de un solo color que cambian a coral al seleccionarse.
 */
const CATALOG: { method: PaymentMethod; label: string; icon: string; tint?: boolean }[] = [
  { method: 'datafono', label: 'Datáfono', icon: bold },
  { method: 'efectivo', label: 'Efectivo', icon: efectivo, tint: true },
  { method: 'nequi', label: 'Nequi', icon: nequi },
  { method: 'daviplata', label: 'Daviplata', icon: daviplata },
  { method: 'credibanco', label: 'Credibanco', icon: credibanco },
  { method: 'redeban', label: 'Redeban', icon: redeban },
  { method: 'addi', label: 'Addi', icon: addi },
  { method: 'sistecredito', label: 'Sistecrédito', icon: sistecredito },
  { method: 'otro', label: 'Otro', icon: otro, tint: true },
  { method: 'transferencia', label: 'Transferencia bancaria', icon: transferencia, tint: true },
  { method: 'intercambio', label: 'Intercambio', icon: intercambio, tint: true },
  { method: 'contra-entrega', label: 'Pago contra entrega', icon: contraEntrega, tint: true },
];

export function paymentMethodLabel(method: PaymentMethod | null | undefined): string {
  return CATALOG.find(c => c.method === method)?.label ?? '';
}

export function PaymentMethodIcon({ method, size = 24 }: { method: PaymentMethod; size?: number }) {
  const entry = CATALOG.find(c => c.method === method);
  if (!entry) return null;
  return <img src={entry.icon} alt="" width={size} height={size} className="object-contain mix-blend-darken" />;
}

const CORAL = '#EE424E';
const NAVY = '#121E6C';

/** Modal puntual de selección: se abre sobre la pantalla "Método de cobro". */
export function PaymentMethodModal({ selected, onSelect, onClose }: {
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="absolute inset-0 z-50" role="dialog" aria-modal="true" aria-label="Agregar método de cobro">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 right-0 bottom-0 bg-white flex flex-col transition-transform duration-300 ease-out"
        style={{
          maxHeight: '92%',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="flex items-center gap-2 px-4 pt-3 h-14 shrink-0">
          <div className="w-6 shrink-0" />
          <h2 className="flex-1 text-center text-[16px] leading-6 font-semibold text-[#121e6c]">Agregar método de cobro</h2>
          <button onClick={onClose} aria-label="Cerrar" className="w-6 h-6 flex items-center justify-center active:opacity-60">
            <X size={24} color={NAVY} strokeWidth={2} />
          </button>
        </div>

        <div
          className="overflow-y-auto min-h-0 px-4 pt-4 grid grid-cols-2 gap-4"
          style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
        >
          {CATALOG.map(({ method, label, icon, tint }) => {
            const active = selected === method;
            const color = active ? CORAL : NAVY;
            return (
              <button
                key={method}
                onClick={() => onSelect(method)}
                aria-pressed={active}
                className="h-[108px] rounded-2xl px-4 py-3 flex flex-col items-center justify-center gap-3 border transition-colors active:opacity-70"
                style={{
                  backgroundColor: active ? '#FEF1F3' : '#F7F8FB',
                  borderColor: active ? CORAL : 'transparent',
                }}
              >
                {tint ? (
                  <span
                    className="w-8 h-8 shrink-0"
                    style={{
                      backgroundColor: color,
                      // Vite inlinea los SVG pequeños como data URI: la URL va entre comillas.
                      WebkitMask: `url("${icon.replace(/"/g, '%22')}") center / contain no-repeat`,
                      mask: `url("${icon.replace(/"/g, '%22')}") center / contain no-repeat`,
                    }}
                  />
                ) : (
                  <img
                    src={icon}
                    alt=""
                    className="w-8 h-8 shrink-0 object-contain mix-blend-darken"
                  />
                )}
                <span
                  className="w-full text-center text-[14px] leading-5"
                  style={{ color: active ? CORAL : '#1e1e1e', fontWeight: active ? 700 : 500 }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
