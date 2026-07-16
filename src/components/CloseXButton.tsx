import svgE1 from "../imports/EmptyState1/svg-4pwqqtr0t8";

export function CloseXButton({ onPress }: { onPress: () => void }) {
  return (
    <button onClick={onPress} className="relative shrink-0 size-[24px] cursor-pointer">
      <div className="absolute inset-[15.63%_14.06%_15.62%_17.19%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
          <path clipRule="evenodd" d={svgE1.p25dc38a0} fill="#121E6C" fillRule="evenodd" />
        </svg>
      </div>
    </button>
  );
}
