import { useEffect } from "react";
import { formatCOP } from "../utils/format";
import { StatusBar } from "../components/StatusBar";

export function AcercaInsertaPage({
  total,
  onCancel,
  onSuccess,
}: {
  total: number;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onSuccess, 2500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white relative size-full flex flex-col">
      {/* Header */}
      <div className="flex-none">
        <StatusBar />
        <div className="flex items-center justify-between px-[4px] pr-[16px] h-[40px]">
          <button onClick={onCancel} className="flex items-center px-[12px] gap-[4px] cursor-pointer">
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#ff2947" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[12px] text-[#ff2947] underline leading-[16px]">Cancelar</span>
          </button>
          <div className="bg-[#f4fdf9] flex gap-[4px] h-[28px] items-center justify-center px-[12px] rounded-[100px]">
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none">
              <circle cx="12" cy="12" r="3.5" fill="#6CDCAB" />
              <circle cx="12" cy="12" r="7" stroke="#6CDCAB" strokeWidth="1.5" opacity="0.4" fill="none" />
            </svg>
            <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1b8959] leading-[20px]">Conectado</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-[48px] gap-[24px]">
        <p className="font-['Montserrat:ExtraBold',sans-serif] font-extrabold text-[20px] leading-[28px] text-[#111e6c] text-center px-[24px]">
          Acerca, inserta o desliza la tarjeta del tu cliente
        </p>
        <div className="flex flex-col items-center gap-[4px]">
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[16px] text-[#969696] leading-[24px]">Monto a cobrar</p>
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[32px] text-[#1e1e1e] leading-[40px]">{formatCOP(total)}</p>
        </div>

        {/* Datáfono illustration */}
        <div className="flex items-center justify-center mt-[16px]">
          <svg viewBox="0 0 160 200" className="w-[160px] h-[200px]" fill="none">
            <defs>
              <radialGradient id="devBg" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#ff2947" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#121e6c" stopOpacity="0.15" />
              </radialGradient>
            </defs>
            <ellipse cx="80" cy="185" rx="70" ry="18" fill="url(#devBg)" />
            <rect x="30" y="15" width="100" height="160" rx="16" fill="#f1f2f6" />
            <rect x="30" y="15" width="100" height="160" rx="16" stroke="#d2d4e1" strokeWidth="1" />
            <rect x="42" y="30" width="76" height="46" rx="6" fill="#121e6c" opacity="0.08" />
            <rect x="42" y="30" width="76" height="46" rx="6" stroke="#d2d4e1" strokeWidth="1" />
            <circle cx="80" cy="53" r="7" fill="#ff2947" opacity="0.5" />
            <circle cx="52" cy="103" r="6" fill="#d2d4e1" /><circle cx="80" cy="103" r="6" fill="#d2d4e1" /><circle cx="108" cy="103" r="6" fill="#d2d4e1" />
            <circle cx="52" cy="124" r="6" fill="#d2d4e1" /><circle cx="80" cy="124" r="6" fill="#d2d4e1" /><circle cx="108" cy="124" r="6" fill="#d2d4e1" />
            <circle cx="52" cy="145" r="6" fill="#d2d4e1" /><circle cx="80" cy="145" r="6" fill="#d2d4e1" /><circle cx="108" cy="145" r="6" fill="#d2d4e1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
