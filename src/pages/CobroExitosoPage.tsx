import type { CheckoutItem } from "../types";
import { formatCOP } from "../utils/format";
import { StatusBar } from "../components/StatusBar";

export function CobroExitosoPage({
  items,
  onNuevoCobro,
}: {
  items: CheckoutItem[];
  onNuevoCobro: () => void;
}) {
  const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} - ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <div className="flex items-start">
      <p className={`flex-1 text-[12px] leading-[16px] text-[#606060] ${bold ? "font-['Montserrat:Bold',sans-serif] font-bold text-[#1e1e1e]" : "font-['Montserrat:Regular',sans-serif] font-normal"}`}>{label}</p>
      <p className={`text-[12px] leading-[16px] text-right ${bold ? "font-['Montserrat:Bold',sans-serif] font-bold text-[#1e1e1e]" : "font-['Montserrat:Medium',sans-serif] font-medium text-[#1e1e1e]"}`}>{value}</p>
    </div>
  );

  const Divider = () => (
    <div className="h-px w-full bg-[#e8e9f0]" />
  );

  return (
    <div className="bg-[#f7f8fb] flex flex-col size-full">
      <div className="flex-none">
        <StatusBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-[32px] px-[16px] py-[24px]">
          {/* Receipt card */}
          <div className="bg-white w-full rounded-[16px] drop-shadow-[0px_8px_8px_rgba(18,30,108,0.04)] flex flex-col gap-[28px] items-center px-[16px] py-[24px]">
            <div className="flex flex-col gap-[8px] items-center">
              <div className="size-[40px] bg-[#6CDCAB] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-[22px]" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#1e1e1e] text-center">Cobro exitoso</p>
              <p className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[32px] leading-[40px] text-[#121e6c] text-center whitespace-nowrap">{formatCOP(total)}</p>
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#606060] text-center">{dateStr}</p>
              <button className="flex gap-[8px] items-center">
                <svg viewBox="0 0 22 22" className="size-[22px]" fill="none">
                  <path d="M3 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M11 2v12M7 8l4 4 4-4" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#121e6c] underline leading-[16px]">
                  Ver productos y servicios
                </span>
              </button>
            </div>

            {/* Transaction info */}
            <div className="flex flex-col gap-[16px] w-full">
              <div className="flex flex-col gap-[8px]">
                <Row label="Comercio" value="Vinos y vinilos" />
                <Row label="Dirección" value="Calle 123 # 24 - 32" />
              </div>
              <Divider />
              <div className="flex flex-col gap-[8px]">
                <Row label="Código único" value="17385253" />
                <Row label="Terminal" value="9B00L648" />
                <Row label="Código de autorización" value="000000-0" />
                <Row label="ID transacción Bold" value="000000-0" />
                <div className="flex items-center">
                  <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">Método de pago</p>
                  <div className="flex items-center gap-[4px]">
                    <div className="flex items-center gap-[1px]">
                      <div className="size-[12px] rounded-full bg-[#EB001B]" />
                      <div className="size-[12px] rounded-full bg-[#F79E1B] -ml-[4px]" />
                    </div>
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[12px] text-[#1e1e1e] leading-[16px]">**** **** **** 7711</p>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col gap-[8px]">
                <Row label="Subtotal" value={formatCOP(total)} />
                <Row label="Sin impuesto" value={formatCOP(0)} />
                <Row label={`${itemCount} productos`} value="" />
                <Row label="Total de la venta" value={`COP ${formatCOP(total)}`} bold />
              </div>
              <Divider />
              <div className="flex items-center">
                <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969696] leading-[16px]">Detalle</p>
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[12px] text-[#969696] leading-[16px]">Pago sin contacto</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-[8px] items-center w-full">
            <button onClick={onNuevoCobro} className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer">
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Nuevo cobro</span>
            </button>
            <button className="flex items-center justify-center py-[12px] cursor-pointer">
              <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#ff2947] underline leading-[16px]">Compartir</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-[8px] items-center pb-[16px]">
            <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#606060] leading-[20px] text-center">
              Si tienes dudas escríbenos a{" "}
              <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[#121e6c] underline">soporte@bold.co</span>
            </p>
            <div className="flex flex-col items-center gap-[2px]">
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969bbd] leading-[16px]">Bold.co S.A.S NIT 901281572-4</p>
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969bbd] leading-[16px]">www.bold.co</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
