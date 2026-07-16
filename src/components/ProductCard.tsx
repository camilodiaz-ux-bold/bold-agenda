import type { Product } from "../types";
import { ProductPhoto } from "./ProductPhoto";
import { ActiveBadge } from "./ActiveBadge";

export function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const displayPrice = product.price.startsWith("$") ? product.price : "$" + product.price;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`bg-white content-stretch drop-shadow-[0px_8px_10px_rgba(18,30,108,0.08)] flex gap-[12px] items-center p-[12px] relative rounded-[16px] shrink-0 w-[343px] text-left${onClick ? " cursor-pointer" : ""}`}>
      <ProductPhoto product={product} />
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-full items-start justify-center min-w-px relative">
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start leading-[0] min-h-px relative text-[#1e1e1e] w-full">
            <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-[211px]">
              <p className="leading-[16px]">{product.name}</p>
            </div>
            <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">{displayPrice}</p>
            </div>
          </div>
          <ActiveBadge />
        </div>
      </div>
    </Tag>
  );
}
