import type { CheckoutItem } from "../types";
import { formatCOP } from "../utils/format";

export function MediosDePagoPage({
  items,
  onBack,
  onDatafono,
}: {
  items: CheckoutItem[];
  onBack: () => void;
  onDatafono: () => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <div className="relative size-full bg-[#f7f8fb]">
      {/* Background: summary card */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="px-[16px] pt-[60px] flex flex-col gap-[12px]">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#121e6c] leading-[20px]">Detalle a cobrar</p>
          <div className="bg-white rounded-[12px] px-[16px] py-[12px] flex flex-col gap-[12px]">
            {[
              { label: "Subtotal", value: formatCOP(subtotal), bold: true },
              { label: "Descuento", value: formatCOP(0), bold: false },
              { label: "Sin impuesto", value: formatCOP(0), bold: false },
            ].map(({ label, value, bold }) => (
              <div key={label} className="flex items-center">
                <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#1e1e1e]">{label}</p>
                <p className={`text-[12px] text-[#1e1e1e] ${bold ? "font-['Montserrat:Semibold',sans-serif] font-semibold" : "font-['Montserrat:Regular',sans-serif] font-normal"}`}>{value}</p>
              </div>
            ))}
            <div className="h-px bg-[#e8e9f0]" />
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Semibold',sans-serif] font-semibold text-[14px] text-[#1e1e1e]">Total a facturar</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e]">{formatCOP(subtotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(30,30,30,0.7)" }} />

      {/* Drop-up sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[24px] rounded-tr-[24px] flex flex-col gap-[16px] pb-[32px]">
        <div className="flex items-start px-[16px] pt-[12px]">
          <button onClick={onBack} className="flex items-center py-[12px] cursor-pointer shrink-0">
            <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#121e6c] text-center py-[12px]">¿Cómo quieres cobrar?</p>
          <div className="size-[24px] shrink-0 mt-[12px]" />
        </div>

        {/* Payment methods grid */}
        <div className="flex flex-wrap gap-[12px] px-[16px]">
          {[
            {
              label: "Datáfono",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <rect x="6" y="4" width="20" height="24" rx="3" stroke="#121E6C" strokeWidth="1.5" />
                  <rect x="9" y="8" width="14" height="7" rx="1.5" fill="#121E6C" opacity="0.12" />
                  <circle cx="16" cy="11" r="2" fill="#ff2947" opacity="0.6" />
                  <circle cx="11" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="16" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="21" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="11" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="16" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="21" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                </svg>
              ),
              action: onDatafono,
              interactive: true,
            },
            {
              label: "Link de pago",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <path d="M13 19a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 13a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              action: null as (() => void) | null,
              interactive: false,
            },
            {
              label: "Efectivo",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <rect x="3" y="10" width="26" height="14" rx="3" stroke="#121E6C" strokeWidth="1.5" />
                  <circle cx="16" cy="17" r="3.5" stroke="#121E6C" strokeWidth="1.5" />
                  <path d="M7 14v6M25 14v6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
              action: null as (() => void) | null,
              interactive: false,
            },
            {
              label: "Nequi",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <path d="M9 25V7l14 18V7" stroke="#7B2FBE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              action: null as (() => void) | null,
              interactive: false,
            },
          ].map(({ label, icon, action, interactive }) => (
            <button
              key={label}
              onClick={() => action?.()}
              className={`bg-[#f7f8fb] flex flex-1 flex-col gap-[12px] items-center justify-center min-w-[136px] max-w-[163px] h-[134px] px-[4px] py-[16px] rounded-[16px] ${interactive ? "cursor-pointer" : "cursor-default"}`}
            >
              {icon}
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px] text-center">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
