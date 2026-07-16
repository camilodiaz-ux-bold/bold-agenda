import svgPaths from "./svg-kot07dyito";

function Fa6SolidCashRegister() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="fa6-solid:cash-register">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g clipPath="url(#clip0_15_4147)" id="fa6-solid:cash-register">
          <path d={svgPaths.p1b393980} fill="url(#paint0_linear_15_4147)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_15_4147" x1="32" x2="-7.98412e-07" y1="16" y2="16">
            <stop offset="0.149063" stopColor="#FF2947" />
            <stop offset="0.87985" stopColor="#121E6C" />
          </linearGradient>
          <clipPath id="clip0_15_4147">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function IconFillIcSale() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] size-full" data-name="icon_fill/ic_sale">
      <Fa6SolidCashRegister />
    </div>
  );
}