import svgPaths from "./svg-k6rye2yqeq";

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

function Frame14() {
  return (
    <div className="content-stretch flex gap-[21px] items-center justify-end relative shrink-0 w-[274px]">
      <div className="bg-[#f7f8fb] content-stretch flex gap-[4px] items-center relative rounded-[100px] shrink-0 w-[205px]" data-name="APP Tabs / Navigation">
        <div className="bg-[#121e6c] drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex-[1_0_0] min-w-px relative rounded-[100px]" data-name=".atoms/superapp_tabs">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                <p className="leading-[20px]">Monto</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f7f8fb] flex-[1_0_0] min-w-px relative rounded-[100px]" data-name=".atoms/superapp_tabs">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                <p className="leading-[20px]">Productos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f4fdf9] content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[12px] relative rounded-[100px] shrink-0 w-[48px]" data-name="tag_pos_connected">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/ic_connected">
          <div className="absolute inset-[0_18.9%_0_18.75%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.965 24">
              <g id="Vector">
                <path clipRule="evenodd" d={svgPaths.p2575c480} fill="var(--fill-0, #1B8959)" fillRule="evenodd" />
                <path d={svgPaths.p2df40570} fill="var(--fill-0, #1B8959)" />
                <path clipRule="evenodd" d={svgPaths.p743b600} fill="var(--fill-0, #1B8959)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.pc3dfb80} fill="var(--fill-0, #1B8959)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p26360080} fill="var(--fill-0, #1B8959)" fillRule="evenodd" />
                <path clipRule="evenodd" d={svgPaths.p2183600} fill="var(--fill-0, #1B8959)" fillRule="evenodd" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between px-[16px] relative shrink-0 w-[375px]" data-name="Menu">
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
      <Frame14 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-center left-0 pb-[16px] top-0" data-name="Header">
      <div className="h-[20px] overflow-clip relative shrink-0 w-[375px]" data-name="Bars / Status / Default">
        <Right />
        <Center />
        <Container />
      </div>
      <Menu />
    </div>
  );
}

function ButtonPayments() {
  return (
    <div className="bg-[#f59fa5] flex-[1_0_0] h-[48px] min-w-px relative rounded-[100px]" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[16px] items-center justify-center px-[28px] py-[12px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white uppercase whitespace-nowrap">
            <p className="leading-[20px]">CONTINUAR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[148px] p-[12px] rounded-[16px] top-[309px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">2</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[252px] p-[12px] rounded-[16px] top-[309px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">3</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[44px] p-[12px] rounded-[16px] top-[309px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">1</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[148px] p-[12px] rounded-[16px] top-[373px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">5</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[252px] p-[12px] rounded-[16px] top-[373px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">6</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[44px] p-[12px] rounded-[16px] top-[373px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">4</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[148px] p-[12px] rounded-[16px] top-[437px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">8</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[252px] p-[12px] rounded-[16px] top-[437px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">9</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[44px] p-[12px] rounded-[16px] top-[437px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">7</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[148px] p-[12px] rounded-[16px] top-[501px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">0</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[44px] p-[12px] rounded-[16px] top-[501px] w-[80px]">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[#121e6c] text-[16px] text-center whitespace-nowrap">00</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#f7f8fb] content-stretch flex flex-col h-[48px] items-center justify-center left-[252px] rounded-[16px] top-[501px] w-[80px]">
      <div className="h-[20px] relative shrink-0 w-[28.597px]" data-name="Erase button">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.5973 20">
          <path d={svgPaths.p2151ce00} fill="var(--fill-0, #969BBD)" id="Union" />
        </svg>
        <div className="absolute inset-[15%_10.48%_15%_40.56%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path clipRule="evenodd" d={svgPaths.p9d92c00} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[44px] top-[309px]">
      <Frame1 />
      <Frame9 />
      <Frame5 />
      <Frame2 />
      <Frame10 />
      <Frame6 />
      <Frame3 />
      <Frame11 />
      <Frame7 />
      <Frame4 />
      <Frame8 />
      <Frame />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex h-[52px] items-center justify-center left-[138px] px-[16px] top-[96px]">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Light',sans-serif] font-light justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[52px] text-center whitespace-nowrap">
        <p className="leading-[78px]">$0</p>
      </div>
    </div>
  );
}

function ButtonPayments1() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative rounded-[100px] shrink-0" data-name="Button Payments">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#babdd3] text-[12px] text-center whitespace-nowrap">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Describe tu venta</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[45px] top-[236px]">
      <div className="bg-white content-stretch drop-shadow-[0px_4px_4px_rgba(18,30,108,0.04)] flex items-center justify-center px-[18px] py-[4px] relative rounded-[100px] shrink-0 w-[136.5px]" data-name="Tax button">
        <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[100px]" />
        <div className="[word-break:break-word] flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d2d4e1] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Con impuesto</p>
        </div>
      </div>
      <div className="bg-white content-stretch drop-shadow-[0px_4px_4px_rgba(18,30,108,0.04)] flex items-center justify-center px-[18px] py-[4px] relative rounded-[100px] shrink-0 w-[136.5px]" data-name="Tax button">
        <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[100px]" />
        <div className="[word-break:break-word] flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#d2d4e1] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[20px]">Sin impuesto</p>
        </div>
      </div>
    </div>
  );
}

export default function CobroInicioConectado() {
  return (
    <div className="bg-white relative size-full" data-name="cobro_inicio_conectado">
      <Header />
      <div className="absolute content-stretch flex items-center justify-center left-0 pb-[24px] pt-[12px] px-[16px] top-[583px] w-[375px]" style={{ backgroundImage: "linear-gradient(-1.17483deg, rgb(255, 255, 255) 50.548%, rgba(255, 255, 255, 0) 96.366%)" }} data-name="APP Button / Default">
        <ButtonPayments />
      </div>
      <Group />
      <Frame12 />
      <div className="absolute content-stretch flex items-center justify-center left-[115px] px-[16px] py-[12px] top-[172px]" data-name="App text button">
        <ButtonPayments1 />
      </div>
      <Frame13 />
    </div>
  );
}