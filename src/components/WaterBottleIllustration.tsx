export function WaterBottleIllustration({ size = 96 }: { size?: number }) {
  const inner = size * (40 / 96);
  return (
    <div className="bg-[#f7f8fb] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0"
      style={{ width: size, height: size, padding: size * (24 / 96) }}>
      <div className="overflow-clip relative shrink-0" style={{ width: inner, height: inner }}>
        <svg viewBox="0 0 36 54" fill="none" className="absolute inset-0 size-full">
          <rect x="12" y="1" width="12" height="7" rx="3" fill="#9499BB" />
          <rect x="14" y="8" width="8" height="5" rx="1" fill="#D0D2DF" />
          <rect x="5" y="13" width="26" height="36" rx="6" fill="#D0D2DF" />
          <path d="M5 33 h26 v10 Q31 49 25 49 H11 Q5 49 5 43 Z" fill="#9499BB" />
          <rect x="8" y="19" width="20" height="6" rx="2" fill="white" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}
