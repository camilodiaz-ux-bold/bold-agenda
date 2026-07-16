import { useState } from "react";
import type { CheckoutItem } from "../types";
import { formatCOP } from "../utils/format";

export function DetallePage({
  items,
  onBack,
  onCobrar,
}: {
  items: CheckoutItem[];
  onBack: () => void;
  onCobrar: () => void;
}) {
  const [tipEnabled, setTipEnabled] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tip = tipEnabled ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + tip;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="relative size-full">
      <div className="absolute inset-0 bg-[#f7f8fb]" />
      <div className="absolute inset-0" style={{ background: "rgba(30,30,30,0.7)" }} />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[32px] rounded-tr-[32px] flex flex-col px-[18px] pt-[12px] pb-[28px]">
        {/* Header */}
        <div className="flex items-center gap-[20px]">
          <button onClick={onBack} className="flex items-center py-[16px] cursor-pointer shrink-0">
            <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[18px] leading-[24px] text-[#121e6c] text-center py-[12px]">Detalle a cobrar</p>
          <div className="size-[24px] shrink-0" />
        </div>

        <div className="flex flex-col gap-[16px]">
          {/* Amount + dividir */}
          <div className="flex flex-col gap-[20px] items-center">
            <p className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[24px] leading-[36px] text-[#1e1e1e]">{formatCOP(total)}</p>
            <button className="bg-[#f1f2f6] flex gap-[8px] h-[48px] items-center justify-center w-full rounded-[12px] cursor-pointer">
              <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
                <rect x="2" y="7" width="20" height="13" rx="2" stroke="#121E6C" strokeWidth="1.5" />
                <path d="M2 11h20M8 7V5a2 2 0 014 0v2" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="15" r="1.5" fill="#121E6C" />
              </svg>
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#121e6c] leading-[20px]">Dividir cobro</span>
            </button>
          </div>

          {/* Breakdown rows */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">Subtotal</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(subtotal)}</p>
            </div>
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">INC (0 %)</p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(0)}</p>
            </div>
          </div>

          <div className="h-px bg-[#e8e9f0]" />

          {/* Second group */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Productos y servicios</p>
              <button className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[14px] text-[#121e6c] underline leading-[20px] cursor-pointer">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </button>
            </div>
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Agregar propina</p>
              <button onClick={() => setTipEnabled(!tipEnabled)} className="cursor-pointer shrink-0">
                <div className={`relative h-[28px] w-[47px] rounded-[99px] transition-colors ${tipEnabled ? "bg-[#ff2947]" : "bg-[#d2d4e1]"}`}>
                  <div className={`absolute top-[2px] size-[24px] bg-white rounded-full drop-shadow-[0px_4px_4px_rgba(0,0,0,0.08)] transition-all ${tipEnabled ? "left-[21px]" : "left-[2px]"}`} />
                </div>
              </button>
            </div>
            {tipEnabled && (
              <div className="flex items-center">
                <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Propina (10%)</p>
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(tip)}</p>
              </div>
            )}
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">Total a cobrar</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(total)}</p>
            </div>
          </div>

          {/* Cobrar button */}
          <button onClick={onCobrar} className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer">
            <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Cobrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
