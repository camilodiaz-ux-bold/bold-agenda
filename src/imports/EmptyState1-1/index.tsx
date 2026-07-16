import svgPaths from "./svg-7h6w0w4nn3";
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
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Tus productos</p>
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

function SearchBar() {
  return (
    <div className="bg-white h-[40px] relative rounded-[30px] shrink-0 w-full" data-name="Search bar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[12px] pr-[16px] py-[12px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/ic_search">
            <div className="absolute inset-[4.17%_8.33%_6.57%_8.33%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.4221">
                <path clipRule="evenodd" d={svgPaths.p2ea251f0} fill="var(--fill-0, #606060)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </div>
          <div className="flex-[1_0_0] min-w-px relative" data-name=".atom/search_bar_styles">
            <div className="content-stretch flex items-start px-[4px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Light',sans-serif] font-light justify-center leading-[0] relative shrink-0 text-[#606060] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Buscar ítem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative rounded-[100px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Filtrar</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[343px]">
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative" data-name="WEB/APP Search bar">
        <SearchBar />
      </div>
      <div className="content-stretch flex h-[40px] items-center justify-center py-[12px] relative shrink-0" data-name="App text button">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/ic_filter">
          <div className="absolute inset-[16.67%_0_15.81%_0]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16.2048">
              <g id="Vector">
                <path clipRule="evenodd" d={svgPaths.p2ff2ec40} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p33334580} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p369c000} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p259bc880} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p2f036500} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p3848dc00} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              </g>
            </svg>
          </div>
        </div>
        <Button />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[96px]">
      <Frame />
    </div>
  );
}

function Text1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full" data-name="Text">
      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
        <p className="leading-[20px]">Cobra seleccionando tu producto</p>
      </div>
      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="Info">
      <Text1 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Content">
      <Info />
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
              <div className="absolute inset-[-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 84.0001">
                  <path d={svgPaths.p25e07580} id="Status" stroke="url(#paint0_radial_1_2017)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                  <defs>
                    <radialGradient cx="0" cy="0" gradientTransform="matrix(65 -66.4407 7.96225 221.571 11.7222 74.2034)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2017" r="1">
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
          <p className="leading-[28px]">2/2</p>
        </div>
      </div>
    </div>
  );
}

function Img() {
  return (
    <div className="content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[96px]" data-name="Img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgImg} />
    </div>
  );
}

function Info2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start leading-[0] min-h-px relative text-[#1e1e1e] text-[12px] w-full" data-name="Info">
      <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 w-[211px]">
        <p className="leading-[16px]">Zapatillas Nike SB</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 whitespace-nowrap">
        <p className="leading-[16px]">$559.000</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="WEB/APP Tag">
        <div className="relative shrink-0 size-[16px]" data-name="icon/ic_status_indicator">
          <div className="-translate-y-1/2 absolute aspect-[12/12] left-[16.67%] right-[16.67%] top-1/2" data-name="Status indicator">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
              <circle cx="5.33333" cy="5.33333" fill="var(--fill-0, #6CDCAB)" id="Status indicator" r="5.33333" />
            </svg>
          </div>
        </div>
        <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Activo</p>
        </div>
      </div>
    </div>
  );
}

function Info1() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-full items-start justify-center min-w-px relative" data-name="Info">
        <Info2 />
        <Frame1 />
      </div>
    </div>
  );
}

function LinkHistorial() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_8px_10px_rgba(18,30,108,0.08)] flex gap-[12px] items-center p-[12px] relative rounded-[16px] shrink-0 w-[343px]" data-name="LINK_Historial">
      <Img />
      <Info1 />
    </div>
  );
}

function Img1() {
  return (
    <div className="bg-[#f7f8fb] content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[96px]" data-name="Img">
      <div className="overflow-clip relative shrink-0 size-[40px]" data-name="illustration/ill_shopping bag">
        <div className="absolute inset-[8.17%_4.52%_7.85%_4.69%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.3167 33.5894">
            <g id="Vector">
              <path d={svgPaths.p6ae8c00} fill="#D0D2DF" />
              <path d={svgPaths.p31e6cd80} fill="var(--fill-0, #9499BB)" />
              <path d={svgPaths.pf17b780} fill="var(--fill-0, #9499BB)" />
              <path d={svgPaths.p1e993b00} fill="#D0D2DF" />
              <path d={svgPaths.p17b25100} fill="var(--fill-0, #9499BB)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Info4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start leading-[0] min-h-px relative text-[#1e1e1e] w-full" data-name="Info">
      <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-[211px]">
        <p className="leading-[16px]">Producto de ejemplo</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">$25.000</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="WEB/APP Tag">
        <div className="relative shrink-0 size-[16px]" data-name="icon/ic_status_indicator">
          <div className="-translate-y-1/2 absolute aspect-[12/12] left-[16.67%] right-[16.67%] top-1/2" data-name="Status indicator">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
              <circle cx="5.33333" cy="5.33333" fill="var(--fill-0, #6CDCAB)" id="Status indicator" r="5.33333" />
            </svg>
          </div>
        </div>
        <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Activo</p>
        </div>
      </div>
    </div>
  );
}

function Info3() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-full items-start justify-center min-w-px relative" data-name="Info">
        <Info4 />
        <Frame2 />
      </div>
    </div>
  );
}

function LinkHistorial1() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_8px_10px_rgba(18,30,108,0.08)] flex gap-[12px] items-center p-[12px] relative rounded-[16px] shrink-0 w-[343px]" data-name="LINK_Historial">
      <Img1 />
      <Info3 />
    </div>
  );
}

function Img2() {
  return (
    <div className="bg-[#f7f8fb] content-stretch flex items-center justify-center p-[24px] relative rounded-[16px] shrink-0 size-[96px]" data-name="Img">
      <div className="overflow-clip relative shrink-0 size-[40px]" data-name="illustration/ill_shopping bag">
        <div className="absolute inset-[8.17%_4.52%_7.85%_4.69%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.3167 33.5894">
            <g id="Vector">
              <path d={svgPaths.p6ae8c00} fill="#D0D2DF" />
              <path d={svgPaths.p31e6cd80} fill="var(--fill-0, #9499BB)" />
              <path d={svgPaths.pf17b780} fill="var(--fill-0, #9499BB)" />
              <path d={svgPaths.p1e993b00} fill="#D0D2DF" />
              <path d={svgPaths.p17b25100} fill="var(--fill-0, #9499BB)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Info6() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start leading-[0] min-h-px relative text-[#1e1e1e] w-full" data-name="Info">
      <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-[211px]">
        <p className="leading-[16px]">Servicio de ejemplo</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">$50.000</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="WEB/APP Tag">
        <div className="relative shrink-0 size-[16px]" data-name="icon/ic_status_indicator">
          <div className="-translate-y-1/2 absolute aspect-[12/12] left-[16.67%] right-[16.67%] top-1/2" data-name="Status indicator">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
              <circle cx="5.33333" cy="5.33333" fill="var(--fill-0, #6CDCAB)" id="Status indicator" r="5.33333" />
            </svg>
          </div>
        </div>
        <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Activo</p>
        </div>
      </div>
    </div>
  );
}

function Info5() {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-full items-start justify-center min-w-px relative" data-name="Info">
        <Info6 />
        <Frame3 />
      </div>
    </div>
  );
}

function LinkHistorial2() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_8px_10px_rgba(18,30,108,0.08)] flex gap-[12px] items-center p-[12px] relative rounded-[16px] shrink-0 w-[343px]" data-name="LINK_Historial">
      <Img2 />
      <Info5 />
    </div>
  );
}

function Day() {
  return (
    <div className="relative shrink-0 w-full" data-name="Day">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-center px-[16px] relative size-full">
          <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[343px]" data-name="APP Card / Feedback_2">
            <Content />
            <div className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full" data-name="APP Button / Action">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                  <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Cobrar con mis productos</p>
                </div>
              </div>
            </div>
          </div>
          <LinkHistorial />
          <LinkHistorial1 />
          <LinkHistorial2 />
        </div>
      </div>
    </div>
  );
}

function Historial() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 py-[12px] top-[152px] w-[375px]" data-name="Historial">
      <Day />
    </div>
  );
}

function ButtonPayments() {
  return (
    <div className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[96px] py-[12px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[20px]">Crear producto o servicio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmptyState() {
  return (
    <div className="bg-[#f7f8fb] relative size-full" data-name="empty_state_1">
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-[375px]" data-name="APP Header / Internal">
        <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Bars / Status / Default">
          <Right />
          <Center />
          <Container />
        </div>
        <NavigationBar />
      </div>
      <Frame4 />
      <Historial />
      <div className="-translate-x-1/2 absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center justify-center left-1/2 px-[16px] py-[20px] w-[375px]" style={{ backgroundImage: "linear-gradient(0.584414deg, rgb(247, 248, 251) 35.923%, rgba(247, 248, 251, 0) 98.003%)" }} data-name="APP Button / Default">
        <ButtonPayments />
      </div>
    </div>
  );
}