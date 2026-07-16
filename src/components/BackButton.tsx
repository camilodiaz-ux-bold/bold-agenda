import { ChevronSvg } from "./ChevronSvg";

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <button onClick={onPress} className="relative shrink-0 size-[24px] cursor-pointer">
      <div className="absolute flex inset-[8.33%_25.71%_8.33%_25.68%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[100cqw] rotate-90 w-[100cqh]">
          <div className="relative size-full"><ChevronSvg /></div>
        </div>
      </div>
    </button>
  );
}
