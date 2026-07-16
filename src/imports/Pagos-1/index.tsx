import svgPaths from "./svg-i9dqhgb5zr";
import imgCard from "./5a728c2f6078cde80c55091bf9f2eb0eeb24968a.png";
import imgCard1 from "./bfb4d0e5d42f0a85a652d9f2b3f840dc2ef1a0a7.png";

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

function ProfileIconBackground() {
  return (
    <div className="bg-[#121e6c] content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex items-center justify-center relative rounded-[100px] shrink-0 size-[40px]" data-name="Profile Icon Background">
      <div className="relative shrink-0 size-[20px]" data-name="Profile Icon">
        <div className="absolute inset-[4.17%_10.26%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8945 18.3333">
            <g id="Vector">
              <path d={svgPaths.p3be4d9f0} fill="var(--fill-0, white)" />
              <path d={svgPaths.p1cd49800} fill="var(--fill-0, white)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function NameContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Name Container">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Semibold',sans-serif] leading-[20px] min-w-px not-italic relative text-[#1e1e1e] text-[14px]">Vinos y vinilos</p>
    </div>
  );
}

function ProfileDetails() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="Profile Details">
      <NameContainer />
      <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[#606060] text-[12px] text-ellipsis w-full whitespace-nowrap">Calle 123 # 24 - 32, San Vicent</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px py-[8px] relative" data-name="Profile">
      <ProfileIconBackground />
      <ProfileDetails />
    </div>
  );
}

function IconSet() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Icon Set">
      <div className="bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex gap-[8px] h-[32px] items-center justify-center px-[12px] py-[8px] relative rounded-[100px] shrink-0" data-name="Status Selected Icon">
        <div className="content-stretch flex items-start relative shrink-0" data-name=".atom/tag_label">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Ayuda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[56px] items-center px-[16px] relative size-full">
          <Profile />
          <IconSet />
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-0 pb-[12px] rounded-bl-[24px] rounded-br-[24px] top-0 w-[390px]" data-name="APP Header">
      <div className="h-[20px] overflow-clip relative shrink-0 w-[375px]" data-name="Status Bar">
        <Right />
        <Center />
        <Container />
      </div>
      <Menu />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full" data-name="Header">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Herramientas para vender</p>
    </div>
  );
}

function IconFillIcSale() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_money">
        <div className="absolute inset-[4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 40.3333">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p22f20380} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p22f20380} fill="url(#paint0_radial_1_2306)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p22f20380} fill="url(#paint1_radial_1_2306)" fillRule="evenodd" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -16.9007 16.9007 24.0838 3.43676 37.0445)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2306" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-14.6333 19.2074 -19.2074 -16.3374 39.6417 0.936393)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2306" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Cobrar</p>
    </div>
  );
}

function IconFillIcSale1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_click">
        <div className="absolute inset-[2.27%_20.72%_6.06%_20.45%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.8832 40.3333">
            <g id="Vector">
              <path d={svgPaths.p16ff6d00} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p16ff6d00} fill="url(#paint0_radial_1_2260)" />
              <path d={svgPaths.p16ff6d00} fill="url(#paint1_radial_1_2260)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(13.8432 -16.9007 10.8457 24.0838 2.20548 37.0445)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2260" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-9.39063 19.2074 -12.326 -16.3374 25.4393 0.936393)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2260" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Simular una venta</p>
    </div>
  );
}

function IconFillIcSale2() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_payment_link">
        <div className="absolute inset-[4.17%_24.22%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.6875 40.3333">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p1bd7a280} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p1bd7a280} fill="url(#paint0_radial_7_2448)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p1bd7a280} fill="url(#paint1_radial_7_2448)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2eeace00} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2eeace00} fill="url(#paint2_radial_7_2448)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2eeace00} fill="url(#paint3_radial_7_2448)" fillRule="evenodd" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.78788 -16.8056 17.9865 4.36729 15.6776 40.3333)" gradientUnits="userSpaceOnUse" id="paint0_radial_7_2448" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(9.33237 18.7034 -18.0368 0.984205 4.73485 1.44048)" gradientUnits="userSpaceOnUse" id="paint1_radial_7_2448" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.78788 -16.8056 17.9865 4.36729 15.6776 40.3333)" gradientUnits="userSpaceOnUse" id="paint2_radial_7_2448" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(9.33237 18.7034 -18.0368 0.984205 4.73485 1.44048)" gradientUnits="userSpaceOnUse" id="paint3_radial_7_2448" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Links de pago</p>
    </div>
  );
}

function IconFillIcSale3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="Color=Default">
        <div className="-translate-y-1/2 absolute aspect-[53.00269317626953/15] left-[12.5%] right-[12.5%] top-[calc(50%+0.19px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 9.33915">
            <g id="Vector">
              <path d={svgPaths.p2b2c5680} fill="#32005F" />
              <path d={svgPaths.p1f7990c0} fill="#32005F" />
              <path d={svgPaths.p3a153700} fill="#32005F" />
              <path d={svgPaths.p19052300} fill="#32005F" />
              <path d={svgPaths.p17f439c0} fill="var(--fill-0, #32005F)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">QR Pro</p>
    </div>
  );
}

function Line() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 6">
        <IconFillIcSale />
        <Label />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 9">
        <IconFillIcSale1 />
        <Label1 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 5">
        <IconFillIcSale2 />
        <Label2 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 2">
        <IconFillIcSale3 />
        <Label3 />
      </div>
    </div>
  );
}

function AppButtonSuperAppToolsStack() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full" data-name="APP Button / SuperApp Tools stack">
      <Header />
      <Line />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full" data-name="Header">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Gestión de tu negocio</p>
    </div>
  );
}

function IconFillIcSale4() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative rounded-[100px] shrink-0 size-[44px]" data-name="icon_fill/ic_bill">
        <div className="absolute inset-[17.92%_4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 28.2333">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.pa600780} fill="var(--fill-0, #121E6C)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pa600780} fill="url(#paint0_radial_1_2290)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.pa600780} fill="url(#paint1_radial_1_2290)" fillRule="evenodd" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -11.8305 16.9007 16.8587 3.43676 25.9312)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2290" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-14.6333 13.4452 -19.2074 -11.4362 39.6417 0.655475)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2290" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Crédito</p>
    </div>
  );
}

function IconFillIcSale5() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_money_bag">
        <div className="absolute inset-[2.08%_12.03%_4.17%_12.03%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.4167 41.25">
            <g id="Vector">
              <path clipRule="evenodd" d={svgPaths.p24407e00} fill="url(#paint0_radial_7_2429)" fillRule="evenodd" />
              <path d={svgPaths.p1df0bdf0} fill="url(#paint1_radial_7_2429)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="paint0_radial_7_2429" r="1">
                <stop offset="0.153871" stopColor="#FF2947" />
                <stop offset="0.695363" stopColor="#121E6C" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="paint1_radial_7_2429" r="1">
                <stop offset="0.153871" stopColor="#FF2947" />
                <stop offset="0.695363" stopColor="#121E6C" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">
        <p className="leading-[16px] mb-0">Saldo</p>
        <p className="leading-[16px]">de ventas</p>
      </div>
    </div>
  );
}

function IconFillIcSale6() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="Color=Gradient/300">
        <div className="absolute inset-[9.94%_9.09%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 35.2543">
            <g id="Vector">
              <path d={svgPaths.p179ca00} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p179ca00} fill="url(#paint0_radial_1_2312)" />
              <path d={svgPaths.p179ca00} fill="url(#paint1_radial_1_2312)" />
              <path d={svgPaths.pf3c05c0} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.pf3c05c0} fill="url(#paint2_radial_1_2312)" />
              <path d={svgPaths.pf3c05c0} fill="url(#paint3_radial_1_2312)" />
              <path d={svgPaths.p7e97200} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p7e97200} fill="url(#paint4_radial_1_2312)" />
              <path d={svgPaths.p7e97200} fill="url(#paint5_radial_1_2312)" />
              <path d={svgPaths.p2ac29a00} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p2ac29a00} fill="url(#paint6_radial_1_2312)" />
              <path d={svgPaths.p2ac29a00} fill="url(#paint7_radial_1_2312)" />
              <path d={svgPaths.p16a7bb80} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p16a7bb80} fill="url(#paint8_radial_1_2312)" />
              <path d={svgPaths.p16a7bb80} fill="url(#paint9_radial_1_2312)" />
              <path d={svgPaths.p3d9cc100} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p3d9cc100} fill="url(#paint10_radial_1_2312)" />
              <path d={svgPaths.p3d9cc100} fill="url(#paint11_radial_1_2312)" />
              <path d={svgPaths.p2498ad00} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p2498ad00} fill="url(#paint12_radial_1_2312)" />
              <path d={svgPaths.p2498ad00} fill="url(#paint13_radial_1_2312)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint2_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint3_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint4_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint5_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint6_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint7_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint8_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint9_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint10_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint11_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="paint12_radial_1_2312" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="paint13_radial_1_2312" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
        <p className="leading-[16px] mb-0">{`Historial `}</p>
        <p className="leading-[16px]">de ventas</p>
      </div>
    </div>
  );
}

function IconFillIcSale7() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="Color=Gradient/300">
        <div className="absolute bottom-[9.09%] left-1/4 right-[23.66%] top-[9.09%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5912 36">
            <g id="Vector">
              <path d={svgPaths.p5804700} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p5804700} fill="url(#paint0_radial_1_2282)" />
              <path d={svgPaths.p5804700} fill="url(#paint1_radial_1_2282)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(12.0825 -15.0849 9.46629 21.4963 1.92497 33.0646)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2282" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-8.19627 17.1438 -10.7583 -14.5821 22.2038 0.835789)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2282" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Datáfonos</p>
    </div>
  );
}

function IconFillIcSale8() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="Color=Gradient/300">
        <div className="absolute inset-[9.09%_15.43%_9.09%_13.64%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.211 36">
            <g id="Vector">
              <path d={svgPaths.p12fbc080} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p12fbc080} fill="url(#paint0_radial_1_2304)" />
              <path d={svgPaths.p12fbc080} fill="url(#paint1_radial_1_2304)" />
              <path d={svgPaths.pea8b280} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.pea8b280} fill="url(#paint2_radial_1_2304)" />
              <path d={svgPaths.pea8b280} fill="url(#paint3_radial_1_2304)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(16.6927 -15.0849 13.0782 21.4963 2.65946 33.0646)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2304" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.5 14 -13.2497 -6.19096 20.625 0.5)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2304" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(16.6927 -15.0849 13.0782 21.4963 2.65946 33.0646)" gradientUnits="userSpaceOnUse" id="paint2_radial_1_2304" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.5 14 -13.2497 -6.19096 20.625 0.5)" gradientUnits="userSpaceOnUse" id="paint3_radial_1_2304" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Empleados</p>
    </div>
  );
}

function IconFillIcSale9() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_sale">
        <div className="absolute inset-[4.17%_14.4%_2.08%_16.67%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.3303 41.25">
            <path clipRule="evenodd" d={svgPaths.p3426b9a0} fill="url(#paint0_radial_7_2440)" fillRule="evenodd" id="Vector" />
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(24.6434 -34.2585 31.2176 61.8568 3.68597 37.2299)" gradientUnits="userSpaceOnUse" id="paint0_radial_7_2440" r="1">
                <stop offset="0.153871" stopColor="#FF2947" />
                <stop offset="0.695363" stopColor="#121E6C" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function TagNew() {
  return (
    <div className="bg-[#ee424e] content-stretch flex items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-name="Tag New">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Gratis</p>
      </div>
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
        <p className="leading-[16px] mb-0">{`Productos `}</p>
        <p className="leading-[16px]">y servicios</p>
      </div>
      <TagNew />
    </div>
  );
}

function IconFillIcSale10() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <div className="relative shrink-0 size-[44px]" data-name="icon_fill/ic_file">
        <div className="absolute inset-[4.17%_13.99%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.6905 40.3333">
            <g id="Vector">
              <path d={svgPaths.p72e2380} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p72e2380} fill="url(#paint0_radial_1_2302)" />
              <path d={svgPaths.p72e2380} fill="url(#paint1_radial_1_2302)" />
            </g>
            <defs>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(16.9491 -16.9007 13.2791 24.0838 2.70031 37.0445)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_2302" r="1">
                <stop offset="0.147248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
              <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.55377 15.6852 -13.4533 -6.93616 20.9419 0.560186)" gradientUnits="userSpaceOnUse" id="paint1_radial_1_2302" r="1">
                <stop offset="0.107248" stopColor="#FF2947" />
                <stop offset="1" stopColor="#FF2947" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label10() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Métricas del negocio</p>
    </div>
  );
}

function Line1() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 4">
        <IconFillIcSale4 />
        <Label4 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 2">
        <IconFillIcSale5 />
        <Label5 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 3">
        <IconFillIcSale6 />
        <Label6 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 9">
        <IconFillIcSale7 />
        <Label7 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 7">
        <IconFillIcSale8 />
        <Label8 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 8">
        <IconFillIcSale9 />
        <Label9 />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0" data-name=".Atom Tool Button 10">
        <IconFillIcSale10 />
        <Label10 />
      </div>
    </div>
  );
}

function AppButtonSuperAppToolsStack1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full" data-name="APP Button / SuperApp Tools stack">
      <Header1 />
      <Line1 />
    </div>
  );
}

function Header2() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-[343px]" data-name="Header">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Novedades</p>
    </div>
  );
}

function Text() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] h-[84px] items-start justify-center leading-[0] relative shrink-0 text-[#1e1e1e] w-[172px]" data-name="Text">
      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[16px] w-full">
        <p className="leading-[20px]">Gana $50.000 por cada referido</p>
      </div>
      <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
        <p className="leading-[16px]">Tu referido también recibe $10.000 al unirse.</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="h-[172px] relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[16px]">
        <div className="absolute inset-0 rounded-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(247, 248, 251, 0.2) 0%, rgba(247, 248, 251, 0.2) 100%), linear-gradient(103.24deg, rgba(8, 14, 255, 0.08) 5.486%, rgba(156, 155, 151, 0.04) 73.55%, rgba(8, 14, 255, 0.16) 93.334%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} />
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgCard} />
        <div className="absolute inset-0 overflow-hidden rounded-[16px]">
          <img alt="" className="absolute h-[179.03%] left-[38.63%] max-w-none top-[-61.09%] w-[89.51%]" src={imgCard1} />
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
        <Text />
        <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.6)] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[162px]" data-name="APP Button / Action">
          <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Referir ahora</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_30.2px_0px_rgba(18,30,108,0.2)]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[343px]" data-name="Container">
      <div className="content-stretch flex gap-[12px] items-center justify-center overflow-clip p-[16px] relative shrink-0 w-[180px]" data-name="Carousel">
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EE424E)" id="Ellipse 1" r="4" />
          </svg>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FCDFE2)" id="Ellipse 2" r="4" />
          </svg>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FCDFE2)" id="Ellipse 2" r="4" />
          </svg>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FCDFE2)" id="Ellipse 2" r="4" />
          </svg>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FCDFE2)" id="Ellipse 2" r="4" />
          </svg>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FCDFE2)" id="Ellipse 2" r="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Card />
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Header2 />
      <Container2 />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-center left-0 px-[16px] top-[120px] w-[390px]" data-name="content">
      <AppButtonSuperAppToolsStack />
      <AppButtonSuperAppToolsStack1 />
      <Container1 />
    </div>
  );
}

function Vertical() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] h-full items-center min-w-px relative" data-name="Vertical">
      <div className="relative shrink-0 size-[24px]" data-name="icon_fill/ic_plus">
        <div className="absolute inset-[4.17%_20.79%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.021 22">
            <path d={svgPaths.p206800} fill="var(--fill-0, #121E6C)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">Ventas</p>
    </div>
  );
}

function ButtonPayments() {
  return (
    <div className="bg-[#ff2947] flex-[1_0_0] h-full min-w-px relative rounded-[100px]" data-name="Button Payments">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
            <p className="leading-[20px]">Cobrar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Vertical1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-center min-w-px relative" data-name="Vertical">
      <div className="relative shrink-0 size-[24px]" data-name="icon/ic_wallet">
        <div className="absolute inset-[8.72%_3.99%_8.71%_4%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.082 19.8165">
            <g id="Vector">
              <path d={svgPaths.p1dc44880} fill="var(--fill-0, #121E6C)" />
              <path d={svgPaths.p3d534980} fill="var(--fill-0, #121E6C)" />
            </g>
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Cuenta</p>
      </div>
    </div>
  );
}

function AppNavBarHome() {
  return (
    <div className="h-[62px] relative rounded-[100px] shrink-0 w-full" data-name="APP Nav Bar / Home">
      <div aria-hidden className="absolute backdrop-blur-[6px] inset-0 pointer-events-none rounded-[100px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(247, 248, 251, 0.2) 0%, rgba(247, 248, 251, 0.2) 100%), url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 350 62' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.6000000238418579'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-15.09 -2.9747 16.237 -1.6544 175.59 31)'><stop stop-color='rgba(255,255,255,0.03)' offset='0.4375'/><stop stop-color='rgba(132,135,255,0.065)' offset='0.71875'/><stop stop-color='rgba(8,14,255,0.1)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%)" }} />
      <div aria-hidden className="absolute border border-[rgba(210,212,225,0.5)] border-solid inset-0 pointer-events-none rounded-[100px] shadow-[0px_10px_18.7px_0px_rgba(18,30,108,0.09)]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[42px] py-[8px] relative size-full">
          <Vertical />
          <div className="content-stretch cursor-pointer flex h-full items-center justify-center relative shrink-0 w-[83.67px]" data-name="APP Button / Prototype">
            <ButtonPayments />
          </div>
          <Vertical1 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_4px_0px_white,inset_0px_3px_7.5px_0px_rgba(18,30,108,0.13)]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center left-0 pb-[24px] pt-[20px] px-[20px] w-[390px]" style={{ backgroundImage: "linear-gradient(0.500163deg, rgb(247, 248, 251) 50.064%, rgba(247, 248, 251, 0) 98.508%)" }} data-name="container">
      <AppNavBarHome />
    </div>
  );
}

export default function Pagos() {
  return (
    <div className="backdrop-blur-[1px] bg-[#f7f8fb] relative size-full" data-name="Pagos">
      <AppHeader />
      <Content />
      <Container4 />
    </div>
  );
}