import svgCP from "../imports/CreateProduct/svg-8vda8388u0";
import svgPV from "../imports/ProductVisualizacion/svg-pi74w8qury";
import type { Product } from "../types";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { CloseXButton } from "../components/CloseXButton";
import { ProductPhoto } from "../components/ProductPhoto";

export function ProductDetailPage({
  product,
  onBack,
  onEdit,
  onClose,
  onDelete,
}: {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const displayPrice = product.price.startsWith("$") ? product.price : "$" + product.price;

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
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Detalle del producto</p>
              </div>
              <CloseXButton onPress={onClose} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-[16px] right-[16px] top-[96px] bottom-0 overflow-y-auto">
        <div className="flex flex-col gap-[24px] items-center pb-[32px]">

          {/* InfoGeneral card */}
          <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            <ProductPhoto product={product} size={112} />
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[311px]">
                <p className="leading-[16px]">{product.name}</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[24px] text-center whitespace-nowrap">
                  <p className="leading-[28px]">{displayPrice}</p>
                </div>
              </div>
            </div>
            {/* Heart badge */}
            <div className="absolute backdrop-blur-[2px] bg-[#fff2f4] content-stretch flex items-center p-[4px] right-[16px] rounded-[8px] top-[16px]">
              <div className="relative shrink-0 size-[24px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPV.p39393500} fill="#FF2947" />
                </svg>
              </div>
            </div>
            {/* Eliminar / Editar */}
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
              <button onClick={onDelete} className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px] cursor-pointer">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute inset-[4.44%_9.46%]">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.46 21.87">
                          <path clipRule="evenodd" d={svgPV.p288a3180} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p3fd74800} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p3420f340} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p10d46d00} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p2fb24200} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p15ffbc80} fill="#121E6C" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Eliminar</p>
                  </div>
                </div>
              </button>
              <button
                onClick={onEdit}
                className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px] cursor-pointer"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute inset-[4.17%_4.17%_4.19%_4.17%]">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21.9948">
                          <path d={svgPV.p26ae3500} fill="#121E6C" />
                          <path d={svgPV.p276e25f0} fill="#121E6C" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Editar</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Status card */}
          <div className="bg-white content-stretch flex gap-[96px] items-center px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-[343px]">
            <div className="bg-[#f4fdf9] content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[12px] relative rounded-[100px] shrink-0">
              <div className="relative shrink-0 size-[24px]">
                <div className="absolute inset-1/4">
                  <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" fill="#6CDCAB" r="6" />
                  </svg>
                </div>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1b8959] text-[14px] text-center whitespace-nowrap">
                <p className="leading-[20px]">Producto activo</p>
              </div>
            </div>
            <div className="h-[28px] relative shrink-0 w-[52px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                <path d={svgCP.p9c7c300} fill="#FF2947" />
                <path d={svgCP.p24e980} fill="white" />
              </svg>
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-white content-stretch flex flex-col gap-[20px] items-start pb-[16px] pt-[20px] px-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[4.29%_14.06%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.25 21.94">
                      <path clipRule="evenodd" d={svgPV.p8bb1070} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p2d013e00} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p17e54280} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p4b3c800} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p23dc2680} fill="#121E6C" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col h-[24px] items-start justify-center min-w-px relative">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[14px] w-full">
                    <p className="leading-[20px]">Más información</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute inset-[-0.25px_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
                  <path d="M0.25 0.25H311.25" stroke="#D2D4E1" strokeLinecap="round" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {[
                { label: "Categoría", value: "General" },
                { label: "Unidad de medida", value: "Unidades" },
                { label: "Código del producto", value: "PROD01" },
              ].map(({ label, value }) => (
                <div key={label} className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                  <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                    <p className="leading-[16px]">{label}</p>
                  </div>
                  <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                    <p className="leading-[16px]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute inset-[-0.25px_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
                  <path d="M0.25 0.25H311.25" stroke="#D2D4E1" strokeLinecap="round" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                  <p className="leading-[16px]">Impuesto (5%)</p>
                </div>
                <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                  <p className="leading-[16px]">$26.619,05</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                  <p className="leading-[16px]">Subtotal</p>
                </div>
                <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                  <p className="leading-[16px]">$532.380,95</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center min-w-px relative text-[12px]">
                  <p className="leading-[16px]">Precio de venta total</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[14px] text-right whitespace-nowrap">
                  <p className="leading-[20px]">{displayPrice}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
