import svgE1 from "../imports/EmptyState1/svg-4pwqqtr0t8";
import svgE1_1 from "../imports/EmptyState1-1/svg-7h6w0w4nn3";

export function PieChart({ label, full }: { label: string; full: boolean }) {
  return (
    <div className="relative shrink-0 size-[92px]">
      <div className="absolute flex inset-[6.52%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <div className="relative size-full">
            <div className="absolute inset-[-2.5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 84">
                <path d={svgE1.p1835f000} stroke="#F3F3F3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[6.52%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
          <div className="relative size-full">
            {full ? (
              <div className="absolute inset-[-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 84.0001">
                  <path d={svgE1_1.p25e07580} stroke="url(#pie_full)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                  <defs>
                    <radialGradient cx="0" cy="0" gradientTransform="matrix(65 -66.4407 7.96225 221.571 11.7222 74.2034)" gradientUnits="userSpaceOnUse" id="pie_full" r="1">
                      <stop offset="0.153871" stopColor="#FF2947" />
                      <stop offset="0.695363" stopColor="#121E6C" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            ) : (
              <div className="absolute inset-[47.5%_-2.5%_-2.5%_-2.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84 44">
                  <path d={svgE1.pd408e40} stroke="url(#pie_half)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                  <defs>
                    <radialGradient cx="0" cy="0" gradientTransform="matrix(65 -66.4407 7.96225 221.571 11.7222 34.2034)" gradientUnits="userSpaceOnUse" id="pie_half" r="1">
                      <stop offset="0.153871" stopColor="#FF2947" />
                      <stop offset="0.695363" stopColor="#121E6C" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-[34.78%_18.48%] justify-center leading-[0] text-[#121e6c] text-[24px] text-center">
        <p className="leading-[28px]">{label}</p>
      </div>
    </div>
  );
}
