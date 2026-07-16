import svgPaths from "./svg-nr9b7t4r4u";

function Battery() {
  return (
    <div className="-translate-y-1/2 absolute h-[11.5px] right-[5.5px] top-[calc(50%+0.25px)] w-[26.5px]" data-name="Battery">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.5 11.5">
        <g id="Battery">
          <path d={svgPaths.p2e31dc00} fill="var(--fill-0, #121E6C)" id="Stroke" opacity="0.4" />
          <path clipRule="evenodd" d={svgPaths.p14ba0000} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Path" />
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
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[normal] left-[calc(50%+0.51px)] text-[#121e6c] text-[12px] text-center top-[calc(50%-7px)] w-[49px]" style={{ fontVariationSettings: '"wdth" 100' }}>
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
          <path clipRule="evenodd" d={svgPaths.p56b4e80} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Signal" />
        </svg>
      </div>
      <div className="absolute inset-[7.14%_0.88%_14.53%_80.72%]" data-name="Wi-Fi">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2724 10.9656">
          <path clipRule="evenodd" d={svgPaths.p3d0e09f2} fill="var(--fill-0, #121E6C)" fillRule="evenodd" id="Wi-Fi" />
        </svg>
      </div>
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-20.5px)] text-[#121e6c] text-[12px] top-[calc(50%-7px)] tracking-[-0.0167px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Carrier
      </p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch" data-name="Text">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Productos y servicios</p>
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
          <div className="relative shrink-0 size-[24px]" data-name="icon/ic_close_navigation" />
        </div>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full" data-name="Info">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[min-content] whitespace-pre-wrap">
        <p className="leading-[16px] mb-0">{`Crear producto `}</p>
        <p className="leading-[16px]">o servicio</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full" data-name="Text">
      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
        <p className="leading-[20px]">Crea un producto o servicio</p>
      </div>
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
    </div>
  );
}

function Info1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="Info">
      <Text1 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Content">
      <Info1 />
      <div className="relative shrink-0 size-[92px]" data-name=".atom/ Pie chart">
        <div className="absolute flex inset-[6.52%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
            <div className="relative size-full" data-name="Bar">
              <div className="absolute inset-[-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 84">
                  <path d={svgPaths.p1835f000} id="Bar" stroke="var(--stroke-0, #F3F3F3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex inset-[6.52%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
            <div className="relative size-full" data-name="Status">
              <div className="absolute inset-[47.5%_-2.5%_-2.5%_-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 44">
                  <path d={svgPaths.pd408e40} id="Status" stroke="url(#paint0_radial_7_2166)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                  <defs>
                    <radialGradient cx="0" cy="0" gradientTransform="matrix(65 -66.4407 7.96225 221.571 11.7222 34.2034)" gradientUnits="userSpaceOnUse" id="paint0_radial_7_2166" r="1">
                      <stop offset="0.153871" stopColor="#FF2947" />
                      <stop offset="0.695363" stopColor="#121E6C" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-[34.78%_18.48%] justify-center leading-[0] text-[#121e6c] text-[24px] text-center">
          <p className="leading-[28px]">1/2</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[16px] w-full">
        <p className="leading-[24px]">Métricas de tus productos y servicios</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Cuando vendas tus productos, verás aquí todos los datos relacionados con ellos.</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[24px] h-[221.122px] items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
      <div className="relative shrink-0 size-[45px]" data-name="icon/ic_chart">
        <div className="absolute inset-[9.5%_4.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.9501 36.45">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p5e5b500} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p3833b980} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p24d3d880} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p369cfd80} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p280b900} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p39a98200} fill="var(--fill-0, #6C759F)" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
      <Group1 />
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center w-[173px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear producto</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame1 />
    </div>
  );
}

function Filters() {
  return (
    <div className="content-stretch flex flex-col gap-[56px] items-center justify-center relative shrink-0 w-[343px]" data-name="Filters">
      <Group />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Filters />
    </div>
  );
}

function Body() {
  return (
    <div className="relative shrink-0 w-full" data-name="Body">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[16px] relative size-full">
          <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="APP Card / Grid Selection">
            <div className="flex flex-col items-center justify-center size-full">
              <div className="content-stretch flex flex-col gap-[12px] items-center justify-center px-[4px] py-[16px] relative size-full">
                <div className="relative shrink-0 size-[32px]" data-name="Status=Selected, Type=Add">
                  <div className="absolute inset-[4.17%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.3333 29.3333">
                      <circle cx="14.6667" cy="14.6667" fill="var(--fill-0, #FF2947)" id="Vector" r="14.6667" />
                    </svg>
                  </div>
                  <div className="absolute inset-[27.93%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1235 14.1235">
                      <path clipRule="evenodd" d={svgPaths.p3ebeae00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
                    </svg>
                  </div>
                </div>
                <Info />
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="APP Card / Feedback_2">
            <Content />
            <div className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full" data-name="APP Button / Action">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                  <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Crear producto o servicio</p>
                </div>
              </div>
            </div>
          </div>
          <Frame2 />
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Screen() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 top-0 w-[375px]" data-name="Screen">
      <div className="content-stretch flex flex-col gap-[20px] items-center pb-[16px] relative shrink-0 w-[375px]" data-name="APP Header / Internal">
        <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Bars / Status / Default">
          <Right />
          <Center />
          <Container />
        </div>
        <NavigationBar />
      </div>
      <Body />
    </div>
  );
}

function ButtonPayments() {
  return (
    <div className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[96px] py-[12px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[20px]">Cobrar con mis productos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UiSeccionCobroConCatalogo() {
  return (
    <div className="bg-[#f7f8fb] relative size-full" data-name="UI – Sección cobro con catálogo">
      <Screen />
      <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center justify-center left-0 px-[16px] py-[24px] w-[375px]" style={{ backgroundImage: "linear-gradient(0.637538deg, rgb(247, 248, 251) 35.923%, rgba(247, 248, 251, 0) 98.003%)" }} data-name="APP Button / Default">
        <ButtonPayments />
      </div>
    </div>
  );
}