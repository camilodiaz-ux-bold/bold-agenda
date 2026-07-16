import type { Product } from "../types";
import { ShoppingBagIllustration } from "./ShoppingBagIllustration";
import imgSneaker from "../imports/ProductVisualizacion/f92cde031c4a218992de87f81f773a3859c8498a.png";
import imgRectangle from "../assets/Rectangle.png";

export function ProductPhoto({ product, size = 96 }: { product: Product; size?: number }) {
  if (!product.hasPhoto) return <ShoppingBagIllustration size={size} />;
  if (product.photoType === "water-bottle") {
    return (
      <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 overflow-hidden" style={{ width: size, height: size }}>
        <img alt={product.name} className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgRectangle} />
      </div>
    );
  }
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0" style={{ width: size, height: size }}>
      <img alt={product.name} className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgSneaker} />
    </div>
  );
}
