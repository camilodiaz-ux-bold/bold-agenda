import svgE1 from "../imports/EmptyState1/svg-4pwqqtr0t8";
import type { Product } from "../types";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { PieChart } from "../components/PieChart";
import { ProductCard } from "../components/ProductCard";

export function TusProductosPage({
  products,
  onBack,
  onCreateProduct,
  onContinueToCobro,
  onViewProduct,
}: {
  products: Product[];
  onBack: () => void;
  onCreateProduct: () => void;
  onContinueToCobro: () => void;
  onViewProduct: (p: Product) => void;
}) {
  const hasProducts = products.some(p => !p.isExample);
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      {/* Header */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Tus productos</p>
              </div>
              <div className="relative shrink-0 size-[24px]">
                <div className="absolute inset-[15.63%_14.06%_15.62%_17.19%]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                    <path clipRule="evenodd" d={svgE1.p25dc38a0} fill="#121E6C" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[96px]">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[343px]">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative">
            <div className="bg-white h-[40px] relative rounded-[30px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center pl-[12px] pr-[16px] py-[12px] relative size-full">
                  <div className="overflow-clip relative shrink-0 size-[24px]">
                    <div className="absolute inset-[4.17%_8.33%_6.57%_8.33%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.4221">
                        <path clipRule="evenodd" d={svgE1.p2ea251f0} fill="#606060" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-[1_0_0] min-w-px relative">
                    <div className="content-stretch flex items-start px-[4px] py-[8px] relative size-full">
                      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Light',sans-serif] font-light justify-center leading-[0] relative shrink-0 text-[#606060] text-[14px] whitespace-nowrap">
                        <p className="leading-[20px]">Buscar ítem</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex h-[40px] items-center justify-center py-[12px] relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[16.67%_0_15.81%_0]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16.2048">
                  <path clipRule="evenodd" d={svgE1.p2ff2ec40} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p33334580} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p369c000} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p259bc880} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p2f036500} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p3848dc00} fill="#121E6C" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="content-stretch flex items-center pl-[8px] relative rounded-[100px] shrink-0">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center whitespace-nowrap">
                <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Filtrar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-0 top-[152px] bottom-[88px] w-full overflow-y-auto">
        <div className="py-[12px]">
          <div className="flex flex-col items-center gap-[12px] px-[16px]">
            {/* Feedback card */}
            <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full">
                    <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
                      <p className="leading-[20px]">{hasProducts ? "Cobra seleccionando tu producto" : "Crea un producto o servicio"}</p>
                    </div>
                    <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
                  </div>
                </div>
                <PieChart label={hasProducts ? "2/2" : "1/2"} full={hasProducts} />
              </div>
              <button
                onClick={hasProducts ? onContinueToCobro : onCreateProduct}
                className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full cursor-pointer"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                    <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                      {hasProducts ? "Cobrar con mis productos" : "Crear producto o servicio"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
            {products.map((p) => <ProductCard key={p.id} product={p} onClick={() => onViewProduct(p)} />)}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute backdrop-blur-[1px] bottom-0 left-0 right-0 content-stretch flex flex-col items-center justify-center px-[16px] py-[20px]"
        style={{ backgroundImage: "linear-gradient(0.584414deg, rgb(247,248,251) 35.923%, rgba(247,248,251,0) 98.003%)" }}>
        <button onClick={onCreateProduct} className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full cursor-pointer">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[16px] py-[12px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                <p className="leading-[20px]">Crear producto o servicio</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
