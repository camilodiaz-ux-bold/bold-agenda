import { useState } from "react";
import svgCP from "../imports/CreateProduct/svg-8vda8388u0";
import imgSneaker from "../imports/ProductVisualizacion/f92cde031c4a218992de87f81f773a3859c8498a.png";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { CloseXButton } from "../components/CloseXButton";
import { ChevronSvg } from "../components/ChevronSvg";
import { ShoppingBagIllustration } from "../components/ShoppingBagIllustration";

export function CreateProductPage({
  formName, formPrice, formHasPhoto,
  onNameChange, onPriceChange, onHasPhotoChange,
  onSave, onBack, onClose,
  editMode = false,
}: {
  formName: string; formPrice: string; formHasPhoto: boolean;
  onNameChange: (v: string) => void; onPriceChange: (v: string) => void;
  onHasPhotoChange: (v: boolean) => void;
  onSave: (name: string, price: string, hasPhoto: boolean) => void;
  onBack: () => void; onClose: () => void;
  editMode?: boolean;
}) {
  const [includeTax, setIncludeTax] = useState(false);
  const isValid = formName.trim().length > 0 && formPrice.trim().length > 0;
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">
                  {editMode ? "Editar producto" : "Nuevo producto o servicio"}
                </p>
              </div>
              <CloseXButton onPress={onClose} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable fields */}
      <div className="absolute left-[16px] right-[16px] top-[96px] bottom-[88px] overflow-y-auto">
        <div className="flex flex-col gap-[32px] items-center pb-[16px]">
          {/* Photo */}
          <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            {formHasPhoto ? (
              <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[79px]">
                <img alt="Zapatillas Nike SB" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgSneaker} />
              </div>
            ) : (
              <ShoppingBagIllustration size={79} />
            )}
            <button
              onClick={() => onHasPhotoChange(!formHasPhoto)}
              className="bg-[#f1f2f6] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[311px] cursor-pointer"
            >
              <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                {formHasPhoto ? "Editar foto" : "Agregar foto"}
              </p>
            </button>
          </div>

          {/* Nombre */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p><span className="leading-[20px]">Nombre del producto o servicio </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Ej. Zapatillas Nike SB"
                    className="flex-1 min-w-0 font-['Montserrat:Medium',sans-serif] font-medium text-[14px] leading-[20px] text-[#1e1e1e] outline-none bg-transparent placeholder:text-[#9a9a9a] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Precio de venta (impuesto incluido) <span className="text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center pl-[12px] pr-[8px] py-[12px] relative size-full gap-[4px]">
                  <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] shrink-0">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formPrice}
                    onChange={(e) => onPriceChange(e.target.value)}
                    placeholder="0"
                    className="flex-1 min-w-0 font-['Montserrat:Medium',sans-serif] font-medium text-[14px] leading-[20px] text-[#1e1e1e] outline-none bg-transparent placeholder:text-[#9a9a9a] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Ingresa el precio que pagará tu cliente.</p>
            </div>
          </div>

          {/* Categoría */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Categoría</p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px relative">
                    <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                      <p className="leading-[20px]">General</p>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px]">
                    <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4">
                      <ChevronSvg />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle impuesto */}
          <button
            onClick={() => setIncludeTax(!includeTax)}
            className="content-stretch flex gap-[59px] items-center justify-end shrink-0 w-full cursor-pointer"
          >
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Medium',sans-serif] font-medium leading-[20px] min-w-px relative text-[#121e6c] text-[14px]">¿Producto incluye impuesto?</p>
            <div className="h-[28px] relative shrink-0 w-[52px]">
              {includeTax ? (
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                  <path d={svgCP.p9c7c300} fill="#FF2947" />
                  <path d={svgCP.p24e980} fill="white" />
                </svg>
              ) : (
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                  <path d={svgCP.p9c7c300} fill="#CBCED4" />
                  <path d="M26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14Z" fill="white" />
                </svg>
              )}
            </div>
          </button>

          {includeTax && (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
                <p><span className="leading-[20px]">Impuesto </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
              </div>
              <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                    <div className="flex-[1_0_0] h-full min-w-px relative">
                      <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                        <p className="leading-[20px]">IVA 5%</p>
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4"><ChevronSvg /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {includeTax && (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
                <p className="leading-[20px]">Subtotal sin impuestos</p>
              </div>
              <div className="bg-white h-[40px] opacity-50 relative rounded-[12px] shrink-0 w-full">
                <div className="flex flex-row items-center justify-end size-full">
                  <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                      <p className="leading-[20px]">Se calcula automáticamente</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[20px] relative shrink-0 w-full">
                <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Este valor se calcula según el precio y el impuesto.</p>
              </div>
            </div>
          )}

          {/* Unidad de medida */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p><span className="leading-[20px]">Unidad de medida </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px relative">
                    <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                      <p className="leading-[20px]">Unidades</p>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px]">
                    <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4"><ChevronSvg /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Selecciona cómo se mide o vende este producto (ej. unidad, kilo, litro).</p>
            </div>
          </div>

          {/* Código */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Código del producto</p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-end size-full">
                <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                    <p className="leading-[20px]">Ej. PROD01</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Código único para identificar tu producto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed action button */}
      <div
        className="absolute bottom-0 left-0 right-0 px-[16px] py-[20px] backdrop-blur-[1px]"
        style={{ backgroundImage: "linear-gradient(0deg, rgb(247,248,251) 40%, rgba(247,248,251,0) 100%)" }}
      >
        <button
          onClick={() => isValid && onSave(formName.trim(), formPrice.trim(), formHasPhoto)}
          className={`h-[48px] relative rounded-[100px] transition-colors w-full ${isValid ? "bg-[#ff2947] cursor-pointer" : "bg-[#ffb2bc] cursor-not-allowed"}`}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[12px] relative size-full">
              <div className={`[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center whitespace-nowrap ${isValid ? "text-white" : "text-[#ffdfe4]"}`}>
                <p className="leading-[20px]">{editMode ? "Guardar cambios" : "Crear producto"}</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
