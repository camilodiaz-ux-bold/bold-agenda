import svgPaths from "./svg-mwyti191t6";
import imgImg from "./f92cde031c4a218992de87f81f773a3859c8498a.png";

function Img() {
  return (
    <div className="content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[79px]" data-name="Img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgImg} />
    </div>
  );
}

function InfoGeneral() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="Info general">
      <Img />
      <div className="bg-[#f1f2f6] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[311px]" data-name="APP Button / Action">
        <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Agregar foto</p>
      </div>
    </div>
  );
}

function WebRadiobutton() {
  return (
    <div className="content-stretch flex gap-[59px] items-center justify-end shrink-0 sticky top-0 w-full" data-name="WEB Radiobutton">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Medium',sans-serif] font-medium leading-[20px] min-w-px relative text-[#121e6c] text-[14px]">¿Producto incluye impuesto?</p>
      <div className="h-[28px] relative shrink-0 w-[52px]" data-name="Toggle switch">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
          <g id="Vector">
            <path d={svgPaths.p9c7c300} fill="#FF2947" />
            <path d={svgPaths.p24e980} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ButtonPayments() {
  return (
    <div className="bg-[#ff2947] flex-[1_0_0] h-[48px] min-w-px relative rounded-[100px]" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[24px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[20px]">Crear producto</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Forms() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-center left-[16px] top-[96px] w-[343px]" data-name="Forms">
      <InfoGeneral />
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p>
              <span className="leading-[20px]">{`Nombre del producto o servicio `}</span>
              <span className="leading-[20px] text-[#c31a2f]">*</span>
            </p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center justify-end size-full">
            <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                  <p className="leading-[20px]">Zapatillas Nike SB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p className="leading-[20px]">Precio de venta (impuesto incluido) *</p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center pl-[12px] pr-[8px] py-[12px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                  <p className="leading-[20px]">$559.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Ingresa el precio que pagará tu cliente.</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p className="leading-[20px]">{`Categoría `}</p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                  <p className="leading-[20px]">General</p>
                </div>
              </div>
              <div className="relative shrink-0 size-[24px]" data-name="icon/ic_chevron">
                <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector 2 (Stroke)">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 11.6667">
                    <path clipRule="evenodd" d={svgPaths.p32a7b500} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Vector 2 (Stroke)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WebRadiobutton />
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p>
              <span className="leading-[20px]">{`Impuesto `}</span>
              <span className="leading-[20px] text-[#c31a2f]">*</span>
            </p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                  <p className="leading-[20px]">IVA 5% ($27.950)</p>
                </div>
              </div>
              <div className="relative shrink-0 size-[24px]" data-name="icon/ic_chevron">
                <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector 2 (Stroke)">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 11.6667">
                    <path clipRule="evenodd" d={svgPaths.p32a7b500} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Vector 2 (Stroke)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p className="leading-[20px]">Subtotal sin impuestos</p>
          </div>
        </div>
        <div className="bg-white h-[40px] opacity-50 relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center justify-end size-full">
            <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                  <p className="leading-[20px]">$531.050</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Este valor se calcula según el precio y el impuesto.</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p>
              <span className="leading-[20px]">{`Unidad de medida `}</span>
              <span className="leading-[20px] text-[#c31a2f]">*</span>
            </p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                  <p className="leading-[20px]">Unidades</p>
                </div>
              </div>
              <div className="relative shrink-0 size-[24px]" data-name="icon/ic_chevron">
                <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector 2 (Stroke)">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 11.6667">
                    <path clipRule="evenodd" d={svgPaths.p32a7b500} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Vector 2 (Stroke)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Selecciona cómo se mide o vende este producto (ej. unidad, kilo, litro).</p>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Text inputs">
        <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
            <p className="leading-[20px]">Código del producto</p>
          </div>
        </div>
        <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full" data-name=".atom/text_input_fields">
          <div className="flex flex-row items-center justify-end size-full">
            <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name=".atom/text_input_labels">
                <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                  <p className="leading-[20px]">Ej. PROD01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-name=".atom/text_input_labels">
          <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Código único para identificar tu producto</p>
        </div>
      </div>
      <div className="content-stretch flex h-[48px] items-center justify-center relative shrink-0 w-[343px]" data-name="APP Button / Default">
        <ButtonPayments />
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="-translate-y-1/2 absolute h-[11.5px] right-[5.5px] top-[calc(50%+0.25px)] w-[26.5px]" data-name="Battery">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.5 11.5">
        <g id="Battery">
          <path d={svgPaths.p2e31dc00} fill="var(--fill-0, #1E1E1E)" id="Stroke" opacity="0.4" />
          <path clipRule="evenodd" d={svgPaths.p14ba0000} fill="var(--fill-0, #1E1E1E)" fillRule="evenodd" id="Path" />
        </g>
      </svg>
    </div>
  );
}

function Right() {
  return (
    <div className="-translate-y-1/2 absolute h-[20px] overflow-clip right-0 top-1/2 w-[182px]" data-name="Right">
      <Battery />
    </div>
  );
}

function Center() {
  return (
    <div className="absolute inset-[0_25.6%_0_25.87%] overflow-clip" data-name="Center">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(50%+0.51px)] text-[#1e1e1e] text-[12px] text-center top-[calc(50%-7px)] w-[49px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        1:11 PM
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="-translate-y-1/2 absolute h-[14px] left-[5px] overflow-clip top-1/2 w-[83px]" data-name="Container">
      <div className="absolute inset-[14.29%_79.52%_14.29%_0]" data-name="Signal">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 10">
          <path clipRule="evenodd" d={svgPaths.p56b4e80} fill="var(--fill-0, #1E1E1E)" fillRule="evenodd" id="Signal" />
        </svg>
      </div>
      <div className="absolute inset-[7.14%_0.88%_14.53%_80.72%]" data-name="Wi-Fi">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2724 10.9656">
          <path clipRule="evenodd" d={svgPaths.p3d0e09f2} fill="var(--fill-0, #1E1E1E)" fillRule="evenodd" id="Wi-Fi" />
        </svg>
      </div>
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-20.5px)] text-[#1e1e1e] text-[12px] top-[calc(50%-7px)] tracking-[-0.0167px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Carrier
      </p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch" data-name="Text">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Nuevo producto o servicio</p>
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="relative shrink-0 w-full" data-name="Navigation bar">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
          <div className="relative shrink-0 size-[24px]" data-name="icon/ic_chevron">
            <div className="absolute flex inset-[8.33%_25.71%_8.33%_25.68%] items-center justify-center" style={{ containerType: "size" }}>
              <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
                <div className="relative size-full" data-name="Vector 2 (Stroke)">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 11.6667">
                    <path clipRule="evenodd" d={svgPaths.p32a7b500} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Vector 2 (Stroke)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <Text />
          <div className="relative shrink-0 size-[24px]" data-name="icon/ic_close_navigation">
            <div className="absolute inset-[15.63%_14.06%_15.62%_17.19%]" data-name="Union">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                <path clipRule="evenodd" d={svgPaths.p25dc38a0} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[20px] items-start py-[12px] relative shrink-0 w-full" data-name="Header">
      <div className="relative shrink-0 size-[24px]" data-name="icon/ic_chevron" />
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-end leading-[0] min-w-px not-italic relative text-[#121e6c] text-[16px] text-center">
        <p className="leading-[20px]">¡Creaste tu primer producto!</p>
      </div>
      <div className="relative shrink-0 size-[24px]" data-name="icon/ic_close_navigation" />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Ahora podrás seleccionarlo desde el cobro para vender de forma más ágil.</p>
    </div>
  );
}

function Img1() {
  return (
    <div className="content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[112px]" data-name="Img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgImg} />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[28px]">$559.000</p>
      </div>
    </div>
  );
}

function Details() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Details">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[311px]">
        <p className="leading-[16px]">Zapatillas Nike SB</p>
      </div>
      <Frame />
    </div>
  );
}

function InfoGeneral1() {
  return (
    <div className="bg-[#f7f8fb] content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="Info general">
      <Img1 />
      <Details />
    </div>
  );
}

function ButtonPayments1() {
  return (
    <div className="bg-[#ff2947] flex-[1_0_0] h-[48px] min-w-px relative rounded-[100px]" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[24px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[20px]">Continuar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDialog() {
  return (
    <div className="bg-white drop-shadow-[0px_-4px_4px_rgba(0,0,0,0.12)] relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 w-full" data-name="App dialog">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-end pb-[20px] pt-[12px] px-[16px] relative size-full">
          <Header />
          <Text1 />
          <InfoGeneral1 />
          <div className="content-stretch flex flex-col gap-[8px] items-center justify-end pt-[8px] relative shrink-0 w-full" data-name="APP Button / Clustered">
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="APP Button / Default">
              <ButtonPayments1 />
            </div>
            <div className="content-stretch flex gap-[8px] items-center justify-center py-[12px] relative shrink-0 w-full" data-name="APP Button / Default">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff2947] text-[12px] text-center whitespace-nowrap">
                <p className="[text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear otro producto o servicio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDropUpIllustration() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(30,30,30,0.7)] bottom-0 content-stretch flex flex-col h-[667px] items-center justify-end left-1/2 overflow-clip pt-[275px] w-[375px]" data-name="APP Drop Up / Illustration">
      <AppDialog />
    </div>
  );
}

export default function CreateProduct() {
  return (
    <div className="bg-[#f7f8fb] relative size-full" data-name="create_product">
      <Forms />
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-[375px]" data-name="APP Header / Internal">
        <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Bars / Status / Default">
          <Right />
          <Center />
          <Container />
        </div>
        <NavigationBar />
      </div>
      <AppDropUpIllustration />
    </div>
  );
}