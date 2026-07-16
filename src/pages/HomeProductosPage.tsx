import svgProds from "../imports/UiSeccionCobroConCatalogo-2/svg-nr9b7t4r4u";
import type { Product } from "../types";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { PieChart } from "../components/PieChart";

export function HomeProductosPage({
  products,
  onBack,
  onCreateProduct,
  onTusProductos,
  onCobrar,
}: {
  products: Product[];
  onBack: () => void;
  onCreateProduct: () => void;
  onTusProductos: () => void;
  onCobrar: () => void;
}) {
  const hasProducts = products.some(p => !p.isExample);
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      {/* Header */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar dark />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Caja registradora</p>
              </div>
              <div className="relative shrink-0 size-[24px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="absolute left-0 top-[76px] bottom-[96px] w-full overflow-y-auto">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[16px] py-[12px]">

          {/* Crear producto o servicio */}
          <div className="bg-white relative rounded-[16px] shrink-0 w-full">
            <div className="flex flex-col items-center justify-center size-full">
              <button
                onClick={onCreateProduct}
                className="content-stretch flex flex-col gap-[12px] items-center justify-center px-[4px] py-[16px] relative size-full cursor-pointer w-full"
              >
                <div className="relative shrink-0 size-[32px]">
                  <div className="absolute inset-[4.17%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.3333 29.3333">
                      <circle cx="14.6667" cy="14.6667" fill="#FF2947" r="14.6667" />
                    </svg>
                  </div>
                  <div className="absolute inset-[27.93%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1235 14.1235">
                      <path clipRule="evenodd" d={svgProds.p3ebeae00} fill="white" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[min-content] whitespace-pre-wrap">
                    <p className="leading-[16px] mb-0">Crear producto</p>
                    <p className="leading-[16px]">o servicio</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Progreso */}
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
              onClick={hasProducts ? onCobrar : onCreateProduct}
              className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full cursor-pointer"
            >
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                  <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">{hasProducts ? "Cobrar con mis productos" : "Crear producto o servicio"}</p>
                </div>
              </div>
            </button>
          </div>

          {/* Gestiona tus productos */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[16px] w-full">
              <p className="leading-[24px]">Gestiona tus productos</p>
            </div>
          </div>

          <div className="content-start flex gap-[8px] items-start relative shrink-0 w-full">
            {/* Tus productos */}
            <button
              onClick={onTusProductos}
              className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0 cursor-pointer"
            >
              <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                <div className="relative shrink-0 size-[32px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="grad_tus_p2" x1="32" x2="0" y1="16" y2="16">
                        <stop offset="0.149063" stopColor="#FF2947" />
                        <stop offset="0.87985" stopColor="#121E6C" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#grad_tus_p2)" d="M16 4a6 6 0 0 0-6 6H7a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V13a3 3 0 0 0-3-3h-3a6 6 0 0 0-6-6zm0 2a4 4 0 0 1 4 4h-8a4 4 0 0 1 4-4z" />
                  </svg>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">
                  <p className="leading-[16px] mb-0">Tus</p>
                  <p className="leading-[16px]">productos</p>
                </div>
              </div>
            </button>

            {/* Configuración */}
            <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
              <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                <div className="relative shrink-0 size-[32px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="grad_cfg_p2" x1="32" x2="0" y1="16" y2="16">
                        <stop offset="0.149063" stopColor="#FF2947" />
                        <stop offset="0.87985" stopColor="#121E6C" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#grad_cfg_p2)" d="M27 17.5a11 11 0 0 0 .1-1.5 11 11 0 0 0-.1-1.5l2.9-2.3-2.8-5-3.4 1.4a11 11 0 0 0-2.6-1.5L20.4 4h-5.6l-.6 3.1A11 11 0 0 0 11.6 8.6L8.2 7.2 5.4 12.2l2.9 2.3A11 11 0 0 0 8.2 16a11 11 0 0 0 .1 1.5L5.4 19.8l2.8 5 3.4-1.4a11 11 0 0 0 2.6 1.5L14.8 28h5.6l.6-3.1a11 11 0 0 0 2.6-1.5l3.4 1.4 2.8-5-2.9-2.3zM17.6 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Configuración</p>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[16px] w-full">
              <p className="leading-[24px]">Métricas de tus productos y servicios</p>
            </div>
          </div>

          {/* Metrics empty state */}
          <div className="content-stretch flex flex-col gap-[56px] items-center justify-center relative shrink-0 w-[343px]">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
              <div className="col-1 content-stretch flex flex-col gap-[24px] h-[221.122px] items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
                <div className="relative shrink-0 size-[45px]">
                  <div className="absolute inset-[9.5%_4.5%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.9501 36.45">
                      <path clipRule="evenodd" d={svgProds.p5e5b500} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p3833b980} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p24d3d880} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p369cfd80} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p280b900} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p39a98200} fill="#6C759F" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  <div className="col-1 content-stretch flex flex-col items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
                    <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Cuando vendas tus productos, verás aquí todos los datos relacionados con ellos.</p>
                  </div>
                </div>
                <button
                  onClick={onCreateProduct}
                  className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center w-[173px] cursor-pointer"
                >
                  <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear producto</p>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center justify-center left-0 px-[16px] py-[24px] w-full"
        style={{ backgroundImage: "linear-gradient(0.637538deg, rgb(247,248,251) 35.923%, rgba(247,248,251,0) 98.003%)" }}>
        <button
          onClick={onCobrar}
          className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[16px] py-[12px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                <p className="leading-[20px]">Cobrar con mis productos</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
