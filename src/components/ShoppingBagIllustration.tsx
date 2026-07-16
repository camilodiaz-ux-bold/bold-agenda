import svgE1 from "../imports/EmptyState1/svg-4pwqqtr0t8";

export function ShoppingBagIllustration({ size = 96 }: { size?: number }) {
  const inner = size * (40 / 96);
  return (
    <div className="bg-[#f7f8fb] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0"
      style={{ width: size, height: size, padding: size * (24 / 96) }}>
      <div className="overflow-clip relative shrink-0" style={{ width: inner, height: inner }}>
        <div className="absolute inset-[8.17%_4.52%_7.85%_4.69%]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.3167 33.5894">
            <path d={svgE1.p6ae8c00} fill="#D0D2DF" />
            <path d={svgE1.p31e6cd80} fill="#9499BB" />
            <path d={svgE1.pf17b780} fill="#9499BB" />
            <path d={svgE1.p1e993b00} fill="#D0D2DF" />
            <path d={svgE1.p17b25100} fill="#9499BB" />
          </svg>
        </div>
      </div>
    </div>
  );
}
