import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { Product } from "../types";
import { ProductPhoto } from "../components/ProductPhoto";

export function SuccessSheet({
  product, celebrate = false, onContinue, onCreateAnother,
}: {
  product: Product; celebrate?: boolean; onContinue: () => void; onCreateAnother: () => void;
}) {
  const displayPrice = product.price.startsWith("$") ? product.price : "$" + product.price;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!celebrate || !canvasRef.current) return;
    const fire = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    const timer = window.setTimeout(() => {
      fire({ particleCount: 140, spread: 80, startVelocity: 42, origin: { y: 0.45 }, ticks: 220 });
    }, 150);
    return () => {
      window.clearTimeout(timer);
      fire.reset();
    };
  }, [celebrate]);

  return (
    <div className="absolute inset-0 bg-[rgba(30,30,30,0.7)] flex flex-col items-center justify-end overflow-clip">
      {celebrate && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none size-full z-10" />}
      <div className="bg-white drop-shadow-[0px_-4px_4px_rgba(0,0,0,0.12)] relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 w-full">
        <div className="flex flex-col items-center justify-end size-full">
          <div className="content-stretch flex flex-col gap-[16px] items-center justify-end pb-[20px] pt-[12px] px-[16px] relative size-full">
            <div className="content-stretch flex gap-[20px] items-center py-[12px] relative shrink-0 w-full">
              <div className="relative shrink-0 size-[24px]" />
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[16px] text-center">
                <p className="leading-[20px]">¡Creaste tu primer producto!</p>
              </div>
              <div className="relative shrink-0 size-[24px]" />
            </div>
            <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Ahora podrás seleccionarlo desde el cobro para vender de forma más ágil.</p>
            <div className="bg-[#f7f8fb] content-stretch flex flex-col gap-[16px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
              <ProductPhoto product={product} size={112} />
              <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-full">
                  <p className="leading-[16px]">{product.name}</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[24px] text-center whitespace-nowrap">
                  <p className="leading-[28px]">{displayPrice}</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-center justify-end pt-[8px] relative shrink-0 w-full">
              <button onClick={onContinue} className="bg-[#ff2947] flex-[1_0_0] h-[48px] min-w-px relative rounded-[100px] cursor-pointer w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[12px] relative size-full">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                      <p className="leading-[20px]">Continuar</p>
                    </div>
                  </div>
                </div>
              </button>
              <button onClick={onCreateAnother} className="content-stretch flex gap-[8px] items-center justify-center py-[12px] relative shrink-0 w-full cursor-pointer">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff2947] text-[12px] text-center whitespace-nowrap">
                  <p className="[text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear otro producto o servicio</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
