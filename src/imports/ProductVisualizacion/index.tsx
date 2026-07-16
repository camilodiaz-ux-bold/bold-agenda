import svgPaths from "./svg-pi74w8qury";
import imgImg from "./f92cde031c4a218992de87f81f773a3859c8498a.png";

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
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Detalle del producto</p>
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

function Img() {
  return (
    <div className="content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[112px]" data-name="Img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgImg} />
    </div>
  );
}

function Frame1() {
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
      <Frame1 />
    </div>
  );
}

function IconFillIcHeart() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon_fill/ic_heart">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon_fill/ic_heart">
          <path d={svgPaths.p39393500} fill="var(--fill-0, #FF2947)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <div className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px]" data-name="APP Button / Action">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
            <div className="relative shrink-0 size-[24px]" data-name="icon/ic_trash">
              <div className="absolute inset-[4.44%_9.46%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.46 21.87">
                  <g id="Vector">
                    <path clipRule="evenodd" d={svgPaths.p288a3180} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p3fd74800} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p3420f340} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p10d46d00} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p2fb24200} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p15ffbc80} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Eliminar</p>
          </div>
        </div>
      </div>
      <div className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px]" data-name="APP Button / Action">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
            <div className="relative shrink-0 size-[24px]" data-name="icon/ic_edit">
              <div className="absolute inset-[4.17%_4.17%_4.19%_4.17%]" data-name="Vector">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21.9948">
                  <g id="Vector">
                    <path d={svgPaths.p26ae3500} fill="var(--fill-0, #121E6C)" />
                    <path d={svgPaths.p276e25f0} fill="var(--fill-0, #121E6C)" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">{`Editar `}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoGeneral() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="Info general">
      <Img />
      <Details />
      <div className="absolute backdrop-blur-[2px] bg-[#fff2f4] content-stretch flex items-center p-[4px] right-[16px] rounded-[8px] top-[16px]" data-name="icon_fill/ic_favorite">
        <IconFillIcHeart />
      </div>
      <Frame2 />
    </div>
  );
}

function AppCardHistorial() {
  return (
    <div className="bg-white content-stretch flex gap-[96px] items-center px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-[343px]" data-name="APP Card / Historial">
      <div className="bg-[#f4fdf9] content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[12px] relative rounded-[100px] shrink-0" data-name="APP Tag / Status">
        <div className="relative shrink-0 size-[24px]" data-name="icon/ic_status_indicator">
          <div className="absolute inset-1/4" data-name="Status indicator">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <circle cx="6" cy="6" fill="var(--fill-0, #6CDCAB)" id="Status indicator" r="6" />
            </svg>
          </div>
        </div>
        <div className="content-stretch flex items-start relative shrink-0" data-name=".atom/tag_label">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1b8959] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Producto activo</p>
          </div>
        </div>
      </div>
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

function Summary1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[24px] items-start justify-center min-w-px relative" data-name="Summary">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[14px] w-full">
        <p className="leading-[20px]">Más información</p>
      </div>
    </div>
  );
}

function Balance() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Balance">
      <div className="relative shrink-0 size-[24px]" data-name="icon/ic_file">
        <div className="absolute inset-[4.29%_14.06%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.25 21.94">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p8bb1070} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2d013e00} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p17e54280} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p4b3c800} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p23dc2680} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
      <Summary1 />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header">
      <Balance />
    </div>
  );
}

function Info1() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
        <p className="leading-[16px]">Categoría</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
        <p className="leading-[16px]">General</p>
      </div>
    </div>
  );
}

function Level() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Level 2">
      <Info1 />
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[311px]" data-name="Info">
      <Level />
    </div>
  );
}

function Info3() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
        <p className="leading-[16px]">Unidad de medida</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
        <p className="leading-[16px]">Unidades</p>
      </div>
    </div>
  );
}

function Level1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Level 2">
      <Info3 />
    </div>
  );
}

function Info2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[311px]" data-name="Info">
      <Level1 />
    </div>
  );
}

function Info5() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
        <p className="leading-[16px]">Código del producto</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
        <p className="leading-[16px]">PROD01</p>
      </div>
    </div>
  );
}

function Level2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Level 2">
      <Info5 />
    </div>
  );
}

function Info4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[311px]" data-name="Info">
      <Level2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Info />
      <Info2 />
      <Info4 />
    </div>
  );
}

function Info8() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
        <p className="leading-[16px]">Impuesto (5%)</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
        <p className="leading-[16px]">$26.619,05</p>
      </div>
    </div>
  );
}

function Level3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Level 2">
      <Info8 />
    </div>
  );
}

function Info7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[311px]" data-name="Info">
      <Level3 />
    </div>
  );
}

function Info9() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 text-[12px] w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
        <p className="leading-[16px]">Subtotal</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
        <p className="leading-[16px]">$532.380,95</p>
      </div>
    </div>
  );
}

function Info10() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Info">
      <div className="flex flex-[1_0_0] flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center min-w-px relative text-[12px]">
        <p className="leading-[16px]">Precio de venta total</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[14px] text-right whitespace-nowrap">
        <p className="leading-[20px]">$559.000,00</p>
      </div>
    </div>
  );
}

function Level4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start leading-[0] relative shrink-0 text-[#1e1e1e] w-full" data-name="Level 2">
      <Info9 />
      <Info10 />
    </div>
  );
}

function Info6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Info">
      <Info7 />
      <Level4 />
    </div>
  );
}

function Summary() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-start pb-[16px] pt-[20px] px-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="Summary">
      <Header />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.25px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
            <path d="M0.25 0.25H311.25" id="Vector 19" stroke="var(--stroke-0, #D2D4E1)" strokeLinecap="round" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
      <Frame />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.25px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
            <path d="M0.25 0.25H311.25" id="Vector 19" stroke="var(--stroke-0, #D2D4E1)" strokeLinecap="round" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
      <Info6 />
    </div>
  );
}

function ProductVisualizacion1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-center justify-center left-[16px] top-[96px]" data-name="Product_Visualización">
      <InfoGeneral />
      <AppCardHistorial />
      <Summary />
    </div>
  );
}

export default function ProductVisualizacion() {
  return (
    <div className="bg-[#f7f8fb] relative size-full" data-name="Product_Visualización">
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-[375px]" data-name="APP Header / Internal">
        <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Bars / Status / Default">
          <Right />
          <Center />
          <Container />
        </div>
        <NavigationBar />
      </div>
      <ProductVisualizacion1 />
    </div>
  );
}