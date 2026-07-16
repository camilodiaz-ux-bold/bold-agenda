export function ActiveBadge() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[16px]">
        <div className="-translate-y-1/2 absolute aspect-square left-[16.67%] right-[16.67%] top-1/2">
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 10.6667 10.6667">
            <circle cx="5.33333" cy="5.33333" fill="#6CDCAB" r="5.33333" />
          </svg>
        </div>
      </div>
      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Activo</p>
      </div>
    </div>
  );
}
