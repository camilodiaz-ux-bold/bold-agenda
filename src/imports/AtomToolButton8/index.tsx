import svgPaths from "./svg-avnd5zds0q";

function Fa6SolidCashRegister() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="fa6-solid:cash-register">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g clipPath="url(#clip0_14_4107)" id="fa6-solid:cash-register">
          <path d={svgPaths.p1b393980} fill="url(#paint0_linear_14_4107)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_14_4107" x1="32" x2="-7.98412e-07" y1="16" y2="16">
            <stop offset="0.149063" stopColor="#FF2947" />
            <stop offset="0.87985" stopColor="#121E6C" />
          </linearGradient>
          <clipPath id="clip0_14_4107">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconFillIcSale() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]" data-name="icon_fill/ic_sale">
      <Fa6SolidCashRegister />
    </div>
  );
}

function TagNew() {
  return (
    <div className="bg-[#ee424e] content-stretch flex items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-name="Tag New">
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">Nuevo</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0" data-name="Label">
      <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Caja registradora</p>
      <TagNew />
    </div>
  );
}

export default function AtomToolButton() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center pt-[2px] relative size-full" data-name=".Atom Tool Button 8">
      <IconFillIcSale />
      <Label />
    </div>
  );
}