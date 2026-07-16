import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import svgE1 from "../imports/EmptyState1/svg-4pwqqtr0t8";
import svgE1_1 from "../imports/EmptyState1-1/svg-7h6w0w4nn3";
import svgCP from "../imports/CreateProduct/svg-8vda8388u0";
import svgPagos from "../imports/Pagos-1/svg-i9dqhgb5zr";
import svgProds from "../imports/UiSeccionCobroConCatalogo-2/svg-nr9b7t4r4u";
import svgCashReg from "../imports/IconFillIcSale/svg-kot07dyito";
import svgPV from "../imports/ProductVisualizacion/svg-pi74w8qury";
import imgSneaker from "../imports/ProductVisualizacion/f92cde031c4a218992de87f81f773a3859c8498a.png";
import imgRectangle from "../assets/Rectangle.png";
import imgCard from "../imports/Pagos-1/5a728c2f6078cde80c55091bf9f2eb0eeb24968a.png";
import imgCard1 from "../imports/Pagos-1/bfb4d0e5d42f0a85a652d9f2b3f840dc2ef1a0a7.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product { id: string; name: string; price: string; hasPhoto?: boolean; photoType?: "water-bottle"; isExample?: boolean; }

interface CheckoutItem { id: string; name: string; qty: number; unitPrice: number; hasPhoto?: boolean; photoType?: "water-bottle"; }

type AppScreen = "home-payments" | "home-productos" | "tus-productos" | "create-product" | "product-detail" | "cobro" | "cobro-productos" | "cobro-detalle" | "cobro-medios" | "cobro-captura" | "cobro-exitoso";

const formatCOP = (n: number) => "$" + n.toLocaleString("es-CO");

// ─── Shared atoms ─────────────────────────────────────────────────────────────

// StatusBar is hidden on real devices — the system status bar handles this.
// The component is kept as a stub to avoid changing all call sites.
function StatusBar({ dark: _dark = false }: { dark?: boolean }) {
  return null;
}

function ChevronSvg({ color = "#121E6C" }: { color?: string }) {
  return (
    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 11.6667">
      <path clipRule="evenodd" d={svgE1.p32a7b500} fill={color} fillRule="evenodd" />
    </svg>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
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

function CloseXButton({ onPress }: { onPress: () => void }) {
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

function ShoppingBagIllustration({ size = 96 }: { size?: number }) {
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

function WaterBottleIllustration({ size = 96 }: { size?: number }) {
  const inner = size * (40 / 96);
  return (
    <div className="bg-[#f7f8fb] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0"
      style={{ width: size, height: size, padding: size * (24 / 96) }}>
      <div className="overflow-clip relative shrink-0" style={{ width: inner, height: inner }}>
        <svg viewBox="0 0 36 54" fill="none" className="absolute inset-0 size-full">
          {/* Cap */}
          <rect x="12" y="1" width="12" height="7" rx="3" fill="#9499BB" />
          {/* Neck */}
          <rect x="14" y="8" width="8" height="5" rx="1" fill="#D0D2DF" />
          {/* Body — full */}
          <rect x="5" y="13" width="26" height="36" rx="6" fill="#D0D2DF" />
          {/* Water fill — bottom portion */}
          <path d="M5 33 h26 v10 Q31 49 25 49 H11 Q5 49 5 43 Z" fill="#9499BB" />
          {/* Label stripe */}
          <rect x="8" y="19" width="20" height="6" rx="2" fill="white" opacity="0.35" />
        </svg>
      </div>
    </div>
  );
}

function ProductPhoto({ product, size = 96 }: { product: Product; size?: number }) {
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

function ActiveBadge() {
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

function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
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


function PieChart({ label, full }: { label: string; full: boolean }) {
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

// ─── Page 1: Home Payments ────────────────────────────────────────────────────

function HomePaymentsPage({ onProductosYServicios, onCobrar }: { onProductosYServicios: () => void; onCobrar: () => void }) {
  return (
    <div className="backdrop-blur-[1px] bg-[#f7f8fb] relative size-full" data-name="Pagos">
      {/* APP Header */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-0 pb-[12px] rounded-bl-[24px] rounded-br-[24px] top-0 w-full">
        <div className="shrink-0 w-full">
          <StatusBar />
        </div>
        {/* Menu */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[56px] items-center px-[16px] relative size-full">
              {/* Profile */}
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px py-[8px] relative">
                <div className="bg-[#121e6c] content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex items-center justify-center relative rounded-[100px] shrink-0 size-[40px]">
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute inset-[4.17%_10.26%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8945 18.3333">
                        <path d={svgPagos.p3be4d9f0} fill="white" />
                        <path d={svgPagos.p1cd49800} fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative">
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Semibold',sans-serif] leading-[20px] min-w-px not-italic relative text-[#1e1e1e] text-[14px]">Vinos y vinilos</p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[#606060] text-[12px] text-ellipsis w-full whitespace-nowrap">Calle 123 # 24 - 32, San Vicent</p>
                </div>
              </div>
              {/* Ayuda */}
              <div className="content-stretch flex items-center justify-center relative shrink-0">
                <div className="bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex gap-[8px] h-[32px] items-center justify-center px-[12px] py-[8px] relative rounded-[100px] shrink-0">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                    <p className="leading-[20px]">Ayuda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-0 top-[120px] bottom-[84px] w-full overflow-y-auto">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[16px] pb-[16px]">
          {/* Herramientas para vender */}
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Herramientas para vender</p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {/* Cobrar */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 40.3333">
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="url(#p1_cobrar_a)" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="url(#p1_cobrar_b)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -16.9007 16.9007 24.0838 3.43676 37.0445)" gradientUnits="userSpaceOnUse" id="p1_cobrar_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-14.6333 19.2074 -19.2074 -16.3374 39.6417 0.936393)" gradientUnits="userSpaceOnUse" id="p1_cobrar_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Cobrar</p>
              </div>
              {/* Simular una venta */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[2.27%_20.72%_6.06%_20.45%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.8832 40.3333">
                        <path d={svgPagos.p16ff6d00} fill="#121E6C" />
                        <path d={svgPagos.p16ff6d00} fill="url(#p1_sim_a)" />
                        <path d={svgPagos.p16ff6d00} fill="url(#p1_sim_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(13.8432 -16.9007 10.8457 24.0838 2.20548 37.0445)" gradientUnits="userSpaceOnUse" id="p1_sim_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-9.39063 19.2074 -12.326 -16.3374 25.4393 0.936393)" gradientUnits="userSpaceOnUse" id="p1_sim_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Simular una venta</p>
              </div>
              {/* Links de pago */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%_24.22%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.6875 40.3333">
                        <path clipRule="evenodd" d={svgPagos.p1bd7a280} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p1bd7a280} fill="url(#p1_lnk_a)" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p2eeace00} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p2eeace00} fill="url(#p1_lnk_b)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.78788 -16.8056 17.9865 4.36729 15.6776 40.3333)" gradientUnits="userSpaceOnUse" id="p1_lnk_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(9.33237 18.7034 -18.0368 0.984205 4.73485 1.44048)" gradientUnits="userSpaceOnUse" id="p1_lnk_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Links de pago</p>
              </div>
              {/* QR Pro */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="-translate-y-1/2 absolute aspect-[53.00269317626953/15] left-[12.5%] right-[12.5%] top-[calc(50%+0.19px)]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 9.33915">
                        <path d={svgPagos.p2b2c5680} fill="#32005F" />
                        <path d={svgPagos.p1f7990c0} fill="#32005F" />
                        <path d={svgPagos.p3a153700} fill="#32005F" />
                        <path d={svgPagos.p19052300} fill="#32005F" />
                        <path d={svgPagos.p17f439c0} fill="#32005F" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">QR Pro</p>
              </div>
            </div>
          </div>

          {/* Gestión de tu negocio */}
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Gestión de tu negocio</p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {/* Crédito */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative rounded-[100px] shrink-0 size-[44px]">
                    <div className="absolute inset-[17.92%_4.17%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 28.2333">
                        <path clipRule="evenodd" d={svgPagos.pa600780} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.pa600780} fill="url(#p1_cred_a)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -11.8305 16.9007 16.8587 3.43676 25.9312)" gradientUnits="userSpaceOnUse" id="p1_cred_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Crédito</p>
              </div>
              {/* Saldo de ventas */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[2.08%_12.03%_4.17%_12.03%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.4167 41.25">
                        <path clipRule="evenodd" d={svgPagos.p24407e00} fill="url(#p1_saldo_a)" fillRule="evenodd" />
                        <path d={svgPagos.p1df0bdf0} fill="url(#p1_saldo_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="p1_saldo_a" r="1">
                            <stop offset="0.153871" stopColor="#FF2947" /><stop offset="0.695363" stopColor="#121E6C" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="p1_saldo_b" r="1">
                            <stop offset="0.153871" stopColor="#FF2947" /><stop offset="0.695363" stopColor="#121E6C" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">
                  <p className="leading-[16px] mb-0">Saldo</p>
                  <p className="leading-[16px]">de ventas</p>
                </div>
              </div>
              {/* Historial de ventas */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[9.94%_9.09%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 35.2543">
                        <path d={svgPagos.p179ca00} fill="#121E6C" />
                        <path d={svgPagos.p179ca00} fill="url(#p1_hist_a)" />
                        <path d={svgPagos.pf3c05c0} fill="#121E6C" />
                        <path d={svgPagos.pf3c05c0} fill="url(#p1_hist_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="p1_hist_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="p1_hist_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
                  <p className="leading-[16px] mb-0">Historial</p>
                  <p className="leading-[16px]">de ventas</p>
                </div>
              </div>
              {/* Datáfonos */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute bottom-[9.09%] left-1/4 right-[23.66%] top-[9.09%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5912 36">
                        <path d={svgPagos.p5804700} fill="#121E6C" />
                        <path d={svgPagos.p5804700} fill="url(#p1_dat_a)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(12.0825 -15.0849 9.46629 21.4963 1.92497 33.0646)" gradientUnits="userSpaceOnUse" id="p1_dat_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Datáfonos</p>
              </div>
              {/* Empleados */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[9.09%_15.43%_9.09%_13.64%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.211 36">
                        <path d={svgPagos.p12fbc080} fill="#121E6C" />
                        <path d={svgPagos.p12fbc080} fill="url(#p1_emp_a)" />
                        <path d={svgPagos.pea8b280} fill="#121E6C" />
                        <path d={svgPagos.pea8b280} fill="url(#p1_emp_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(16.6927 -15.0849 13.0782 21.4963 2.65946 33.0646)" gradientUnits="userSpaceOnUse" id="p1_emp_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.5 14 -13.2497 -6.19096 20.625 0.5)" gradientUnits="userSpaceOnUse" id="p1_emp_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Empleados</p>
              </div>
              {/* Caja registradora — INTERACTIVE (ex "Productos y servicios") */}
              <button
                onClick={onProductosYServicios}
                className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0 cursor-pointer"
              >
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[32px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <g clipPath="url(#clip_cash_home)">
                        <path d={svgCashReg.p1b393980} fill="url(#grad_cash_home)" />
                      </g>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="grad_cash_home" x1="32" x2="-7.98412e-07" y1="16" y2="16">
                          <stop offset="0.149063" stopColor="#FF2947" />
                          <stop offset="0.87985" stopColor="#121E6C" />
                        </linearGradient>
                        <clipPath id="clip_cash_home">
                          <rect fill="white" height="32" width="32" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                  <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
                    <p className="leading-[16px] mb-0">Caja</p>
                    <p className="leading-[16px]">registradora</p>
                  </div>
                  <div className="bg-[#ee424e] content-stretch flex items-center justify-center px-[8px] relative rounded-[100px] shrink-0">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
                      <p className="leading-[16px]">Nuevo</p>
                    </div>
                  </div>
                </div>
              </button>
              {/* Métricas del negocio */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%_13.99%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.6905 40.3333">
                        <path d={svgPagos.p72e2380} fill="#121E6C" />
                        <path d={svgPagos.p72e2380} fill="url(#p1_met_a)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(16.9491 -16.9007 13.2791 24.0838 2.70031 37.0445)" gradientUnits="userSpaceOnUse" id="p1_met_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Métricas del negocio</p>
              </div>
            </div>
          </div>

          {/* Novedades */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Novedades</p>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="h-[172px] relative rounded-[16px] shrink-0 w-full">
                <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[16px]">
                  <div className="absolute inset-0 rounded-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(247,248,251,0.2) 0%, rgba(247,248,251,0.2) 100%), linear-gradient(103.24deg, rgba(8,14,255,0.08) 5.486%, rgba(156,155,151,0.04) 73.55%, rgba(8,14,255,0.16) 93.334%), linear-gradient(90deg, #fff 0%, #fff 100%)" }} />
                  <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgCard} />
                  <div className="absolute inset-0 overflow-hidden rounded-[16px]">
                    <img alt="" className="absolute h-[179.03%] left-[38.63%] max-w-none top-[-61.09%] w-[89.51%]" src={imgCard1} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] h-[84px] items-start justify-center leading-[0] relative shrink-0 text-[#1e1e1e] w-[172px]">
                    <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[16px] w-full">
                      <p className="leading-[20px]">Gana $50.000 por cada referido</p>
                    </div>
                    <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
                      <p className="leading-[16px]">Tu referido también recibe $10.000 al unirse.</p>
                    </div>
                  </div>
                  <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.6)] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[162px]">
                    <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Referir ahora</p>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_30.2px_0px_rgba(18,30,108,0.2)]" />
              </div>
              {/* Carousel dots */}
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center overflow-clip p-[16px] relative shrink-0 w-[180px]">
                  {[true,false,false,false,false,false].map((active, i) => (
                    <div key={i} className="relative shrink-0 size-[8px]">
                      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" fill={active ? "#EE424E" : "#FCDFE2"} r="4" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center left-0 pb-[24px] pt-[20px] px-[20px] w-full"
        style={{ backgroundImage: "linear-gradient(0.500163deg, rgb(247,248,251) 50.064%, rgba(247,248,251,0) 98.508%)" }}>
        <div className="h-[62px] relative rounded-[100px] shrink-0 w-full">
          <div aria-hidden className="absolute backdrop-blur-[6px] inset-0 pointer-events-none rounded-[100px]"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(247,248,251,0.2) 0%, rgba(247,248,251,0.2) 100%), linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 100%)" }} />
          <div aria-hidden className="absolute border border-[rgba(210,212,225,0.5)] border-solid inset-0 pointer-events-none rounded-[100px] shadow-[0px_10px_18.7px_0px_rgba(18,30,108,0.09)]" />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[42px] py-[8px] relative size-full">
              {/* Ventas */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] h-full items-center min-w-px relative">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[4.17%_20.79%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.021 22">
                      <path d={svgPagos.p206800} fill="#121E6C" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">Ventas</p>
              </div>
              {/* Cobrar CTA */}
              <button onClick={onCobrar} className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[83.67px] cursor-pointer">
                <div className="bg-[#ff2947] flex-[1_0_0] h-full min-w-px relative rounded-[100px]">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative size-full">
                      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                        <p className="leading-[20px]">Cobrar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              {/* Cuenta */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-center min-w-px relative">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[8.72%_3.99%_8.71%_4%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.082 19.8165">
                      <path d={svgPagos.p1dc44880} fill="#121E6C" />
                      <path d={svgPagos.p3d534980} fill="#121E6C" />
                    </svg>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">
                  <p className="leading-[16px]">Cuenta</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_4px_0px_white,inset_0px_3px_7.5px_0px_rgba(18,30,108,0.13)]" />
        </div>
      </div>
    </div>
  );
}

// ─── Page 2: Home Productos y servicios ──────────────────────────────────────

function HomeProductosPage({
  products,
  onBack,
  onCreateProduct,
  onTusProductos,
  onCobrar,
}: {
  products: Product[];
  onBack: () => void;
  onCreateProduct: () => void;
  onTusProductos: () => void;
  onCobrar: () => void;
}) {
  const hasProducts = products.some(p => !p.isExample);
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      {/* Header */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar dark />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Caja registradora</p>
              </div>
              <div className="relative shrink-0 size-[24px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="absolute left-0 top-[76px] bottom-[96px] w-full overflow-y-auto">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[16px] py-[12px]">

          {/* ① Bloque + — Crear producto o servicio */}
          <div className="bg-white relative rounded-[16px] shrink-0 w-full">
            <div className="flex flex-col items-center justify-center size-full">
              <button
                onClick={onCreateProduct}
                className="content-stretch flex flex-col gap-[12px] items-center justify-center px-[4px] py-[16px] relative size-full cursor-pointer w-full"
              >
                <div className="relative shrink-0 size-[32px]">
                  <div className="absolute inset-[4.17%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.3333 29.3333">
                      <circle cx="14.6667" cy="14.6667" fill="#FF2947" r="14.6667" />
                    </svg>
                  </div>
                  <div className="absolute inset-[27.93%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1235 14.1235">
                      <path clipRule="evenodd" d={svgProds.p3ebeae00} fill="white" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[min-content] whitespace-pre-wrap">
                    <p className="leading-[16px] mb-0">Crear producto</p>
                    <p className="leading-[16px]">o servicio</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ② Bloque progreso — 1/2 sin productos, 2/2 con productos */}
          <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full">
                  <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
                    <p className="leading-[20px]">{hasProducts ? "Cobra seleccionando tu producto" : "Crea un producto o servicio"}</p>
                  </div>
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
                </div>
              </div>
              <PieChart label={hasProducts ? "2/2" : "1/2"} full={hasProducts} />
            </div>
            <button
              onClick={hasProducts ? onCobrar : onCreateProduct}
              className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full cursor-pointer"
            >
              <div className="flex flex-row items-center justify-center size-full">
                <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                  <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">{hasProducts ? "Cobrar con mis productos" : "Crear producto o servicio"}</p>
                </div>
              </div>
            </button>
          </div>

          {/* ③ Gestiona tus productos — section heading */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[16px] w-full">
              <p className="leading-[24px]">Gestiona tus productos</p>
            </div>
          </div>

          {/* ③ Gestiona tus productos — tool-button grid, pixel perfect matching AtomToolButton8 pattern */}
          <div className="content-start flex gap-[8px] items-start relative shrink-0 w-full">

            {/* Tus productos — 64px card + 32px icon + linearGradient fill */}
            <button
              onClick={onTusProductos}
              className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0 cursor-pointer"
            >
              <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                <div className="relative shrink-0 size-[32px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="grad_tus_p2" x1="32" x2="0" y1="16" y2="16">
                        <stop offset="0.149063" stopColor="#FF2947" />
                        <stop offset="0.87985" stopColor="#121E6C" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#grad_tus_p2)" d="M16 4a6 6 0 0 0-6 6H7a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V13a3 3 0 0 0-3-3h-3a6 6 0 0 0-6-6zm0 2a4 4 0 0 1 4 4h-8a4 4 0 0 1 4-4z" />
                  </svg>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">
                  <p className="leading-[16px] mb-0">Tus</p>
                  <p className="leading-[16px]">productos</p>
                </div>
              </div>
            </button>

            {/* Configuración — 64px card + 32px icon + linearGradient fill */}
            <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
              <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                <div className="relative shrink-0 size-[32px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="grad_cfg_p2" x1="32" x2="0" y1="16" y2="16">
                        <stop offset="0.149063" stopColor="#FF2947" />
                        <stop offset="0.87985" stopColor="#121E6C" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#grad_cfg_p2)" d="M27 17.5a11 11 0 0 0 .1-1.5 11 11 0 0 0-.1-1.5l2.9-2.3-2.8-5-3.4 1.4a11 11 0 0 0-2.6-1.5L20.4 4h-5.6l-.6 3.1A11 11 0 0 0 11.6 8.6L8.2 7.2 5.4 12.2l2.9 2.3A11 11 0 0 0 8.2 16a11 11 0 0 0 .1 1.5L5.4 19.8l2.8 5 3.4-1.4a11 11 0 0 0 2.6 1.5L14.8 28h5.6l.6-3.1a11 11 0 0 0 2.6-1.5l3.4 1.4 2.8-5-2.9-2.3zM17.6 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Configuración</p>
              </div>
            </div>

          </div>

          {/* ④ Métricas heading */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[16px] w-full">
              <p className="leading-[24px]">Métricas de tus productos y servicios</p>
            </div>
          </div>

          {/* ④ Metrics empty state */}
          <div className="content-stretch flex flex-col gap-[56px] items-center justify-center relative shrink-0 w-[343px]">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
              <div className="col-1 content-stretch flex flex-col gap-[24px] h-[221.122px] items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
                <div className="relative shrink-0 size-[45px]">
                  <div className="absolute inset-[9.5%_4.5%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.9501 36.45">
                      <path clipRule="evenodd" d={svgProds.p5e5b500} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p3833b980} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p24d3d880} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p369cfd80} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p280b900} fill="#6C759F" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgProds.p39a98200} fill="#6C759F" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  <div className="col-1 content-stretch flex flex-col items-center justify-center ml-0 mt-0 relative row-1 w-[283px]">
                    <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Cuando vendas tus productos, verás aquí todos los datos relacionados con ellos.</p>
                  </div>
                </div>
                <button
                  onClick={onCreateProduct}
                  className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center w-[173px] cursor-pointer"
                >
                  <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear producto</p>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ⑤ Bottom CTA fijo */}
      <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center justify-center left-0 px-[16px] py-[24px] w-full"
        style={{ backgroundImage: "linear-gradient(0.637538deg, rgb(247,248,251) 35.923%, rgba(247,248,251,0) 98.003%)" }}>
        <button
          onClick={onCobrar}
          className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[16px] py-[12px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                <p className="leading-[20px]">Cobrar con mis productos</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Page 3: Tus productos ────────────────────────────────────────────────────

function TusProductosPage({
  products,
  onBack,
  onCreateProduct,
  onContinueToCobro,
  onViewProduct,
}: {
  products: Product[];
  onBack: () => void;
  onCreateProduct: () => void;
  onContinueToCobro: () => void;
  onViewProduct: (p: Product) => void;
}) {
  const hasProducts = products.some(p => !p.isExample);
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      {/* Header */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Tus productos</p>
              </div>
              <div className="relative shrink-0 size-[24px]">
                <div className="absolute inset-[15.63%_14.06%_15.62%_17.19%]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                    <path clipRule="evenodd" d={svgE1.p25dc38a0} fill="#121E6C" fillRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[96px]">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[343px]">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative">
            <div className="bg-white h-[40px] relative rounded-[30px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center pl-[12px] pr-[16px] py-[12px] relative size-full">
                  <div className="overflow-clip relative shrink-0 size-[24px]">
                    <div className="absolute inset-[4.17%_8.33%_6.57%_8.33%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.4221">
                        <path clipRule="evenodd" d={svgE1.p2ea251f0} fill="#606060" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-[1_0_0] min-w-px relative">
                    <div className="content-stretch flex items-start px-[4px] py-[8px] relative size-full">
                      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Light',sans-serif] font-light justify-center leading-[0] relative shrink-0 text-[#606060] text-[14px] whitespace-nowrap">
                        <p className="leading-[20px]">Buscar ítem</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex h-[40px] items-center justify-center py-[12px] relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[16.67%_0_15.81%_0]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 16.2048">
                  <path clipRule="evenodd" d={svgE1.p2ff2ec40} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p33334580} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p369c000} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p259bc880} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p2f036500} fill="#121E6C" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgE1.p3848dc00} fill="#121E6C" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="content-stretch flex items-center pl-[8px] relative rounded-[100px] shrink-0">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[12px] text-center whitespace-nowrap">
                <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Filtrar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-0 top-[152px] bottom-[88px] w-full overflow-y-auto">
        <div className="py-[12px]">
          <div className="flex flex-col items-center gap-[12px] px-[16px]">
            {/* Feedback card */}
            <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full">
                    <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
                      <p className="leading-[20px]">{hasProducts ? "Cobra seleccionando tu producto" : "Crea un producto o servicio"}</p>
                    </div>
                    <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
                  </div>
                </div>
                <PieChart label={hasProducts ? "2/2" : "1/2"} full={hasProducts} />
              </div>
              <button
                onClick={hasProducts ? onContinueToCobro : onCreateProduct}
                className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full cursor-pointer"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                    <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                      {hasProducts ? "Cobrar con mis productos" : "Crear producto o servicio"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
            {products.map((p) => <ProductCard key={p.id} product={p} onClick={() => onViewProduct(p)} />)}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute backdrop-blur-[1px] bottom-0 left-0 right-0 content-stretch flex flex-col items-center justify-center px-[16px] py-[20px]"
        style={{ backgroundImage: "linear-gradient(0.584414deg, rgb(247,248,251) 35.923%, rgba(247,248,251,0) 98.003%)" }}>
        <button onClick={onCreateProduct} className="bg-[#ff2947] h-[48px] relative rounded-[100px] shrink-0 w-full cursor-pointer">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[16px] py-[12px] relative size-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                <p className="leading-[20px]">Crear producto o servicio</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Page 3 sub: Create product form ─────────────────────────────────────────

function CreateProductPage({
  formName, formPrice, formHasPhoto,
  onNameChange, onPriceChange, onHasPhotoChange,
  onSave, onBack, onClose,
  editMode = false,
}: {
  formName: string; formPrice: string; formHasPhoto: boolean;
  onNameChange: (v: string) => void; onPriceChange: (v: string) => void;
  onHasPhotoChange: (v: boolean) => void;
  onSave: (name: string, price: string, hasPhoto: boolean) => void;
  onBack: () => void; onClose: () => void;
  editMode?: boolean;
}) {
  const [includeTax, setIncludeTax] = useState(false);
  const isValid = formName.trim().length > 0 && formPrice.trim().length > 0;
  return (
    <div className="bg-[#f7f8fb] relative size-full">
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">
                  {editMode ? "Editar producto" : "Nuevo producto o servicio"}
                </p>
              </div>
              <CloseXButton onPress={onClose} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable fields — stops above fixed button */}
      <div className="absolute left-[16px] right-[16px] top-[96px] bottom-[88px] overflow-y-auto">
        <div className="flex flex-col gap-[32px] items-center pb-[16px]">
          {/* Photo — tap to add the example sneaker photo */}
          <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            {formHasPhoto ? (
              <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[79px]">
                <img alt="Zapatillas Nike SB" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgSneaker} />
              </div>
            ) : (
              <ShoppingBagIllustration size={79} />
            )}
            <button
              onClick={() => onHasPhotoChange(!formHasPhoto)}
              className="bg-[#f1f2f6] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[311px] cursor-pointer"
            >
              <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                {formHasPhoto ? "Editar foto" : "Agregar foto"}
              </p>
            </button>
          </div>

          {/* Nombre * */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p><span className="leading-[20px]">Nombre del producto o servicio </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Ej. Zapatillas Nike SB"
                    className="flex-1 min-w-0 font-['Montserrat:Medium',sans-serif] font-medium text-[14px] leading-[20px] text-[#1e1e1e] outline-none bg-transparent placeholder:text-[#9a9a9a] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Precio * */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Precio de venta (impuesto incluido) <span className="text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center pl-[12px] pr-[8px] py-[12px] relative size-full gap-[4px]">
                  <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] shrink-0">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formPrice}
                    onChange={(e) => onPriceChange(e.target.value)}
                    placeholder="0"
                    className="flex-1 min-w-0 font-['Montserrat:Medium',sans-serif] font-medium text-[14px] leading-[20px] text-[#1e1e1e] outline-none bg-transparent placeholder:text-[#9a9a9a] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Ingresa el precio que pagará tu cliente.</p>
            </div>
          </div>

          {/* Categoría */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Categoría</p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px relative">
                    <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                      <p className="leading-[20px]">General</p>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px]">
                    <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4">
                      <ChevronSvg />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle impuesto — starts OFF, controls tax fields visibility */}
          <button
            onClick={() => setIncludeTax(!includeTax)}
            className="content-stretch flex gap-[59px] items-center justify-end shrink-0 w-full cursor-pointer"
          >
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Medium',sans-serif] font-medium leading-[20px] min-w-px relative text-[#121e6c] text-[14px]">¿Producto incluye impuesto?</p>
            <div className="h-[28px] relative shrink-0 w-[52px]">
              {includeTax ? (
                /* ON: red track, circle on the right */
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                  <path d={svgCP.p9c7c300} fill="#FF2947" />
                  <path d={svgCP.p24e980} fill="white" />
                </svg>
              ) : (
                /* OFF: gray track, circle on the left */
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                  <path d={svgCP.p9c7c300} fill="#CBCED4" />
                  <path d="M26 14C26 20.6274 20.6274 26 14 26C7.37258 26 2 20.6274 2 14C2 7.37258 7.37258 2 14 2C20.6274 2 26 7.37258 26 14Z" fill="white" />
                </svg>
              )}
            </div>
          </button>

          {/* Impuesto * — visible only when toggle is ON */}
          {includeTax && (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
                <p><span className="leading-[20px]">Impuesto </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
              </div>
              <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                    <div className="flex-[1_0_0] h-full min-w-px relative">
                      <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                        <p className="leading-[20px]">IVA 5%</p>
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4"><ChevronSvg /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtotal — visible only when toggle is ON */}
          {includeTax && (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
                <p className="leading-[20px]">Subtotal sin impuestos</p>
              </div>
              <div className="bg-white h-[40px] opacity-50 relative rounded-[12px] shrink-0 w-full">
                <div className="flex flex-row items-center justify-end size-full">
                  <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                      <p className="leading-[20px]">Se calcula automáticamente</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[20px] relative shrink-0 w-full">
                <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Este valor se calcula según el precio y el impuesto.</p>
              </div>
            </div>
          )}

          {/* Unidad de medida * */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p><span className="leading-[20px]">Unidad de medida </span><span className="leading-[20px] text-[#c31a2f]">*</span></p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
                  <div className="flex-[1_0_0] h-full min-w-px relative">
                    <div className="[word-break:break-word] absolute flex flex-col font-['Montserrat:Medium',sans-serif] font-medium inset-0 justify-center leading-[0] text-[#1e1e1e] text-[14px]">
                      <p className="leading-[20px]">Unidades</p>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-[24px]">
                    <div className="absolute bottom-[26.39%] left-[8.33%] right-[8.33%] top-1/4"><ChevronSvg /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Selecciona cómo se mide o vende este producto (ej. unidad, kilo, litro).</p>
            </div>
          </div>

          {/* Código */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[14px]">
              <p className="leading-[20px]">Código del producto</p>
            </div>
            <div className="bg-white h-[40px] relative rounded-[12px] shrink-0 w-full">
              <div className="flex flex-row items-center justify-end size-full">
                <div className="content-stretch flex gap-[12px] items-center justify-end p-[12px] relative size-full">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] text-[#606060] text-[14px]">
                    <p className="leading-[20px]">Ej. PROD01</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[20px] relative shrink-0 w-full">
              <p className="[word-break:break-word] absolute font-['Montserrat:Regular',sans-serif] font-normal inset-[0_0_20%_0] leading-[16px] text-[#969696] text-[12px]">Código único para identificar tu producto</p>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed action button — anchored at bottom, always visible */}
      <div
        className="absolute bottom-0 left-0 right-0 px-[16px] py-[20px] backdrop-blur-[1px]"
        style={{ backgroundImage: "linear-gradient(0deg, rgb(247,248,251) 40%, rgba(247,248,251,0) 100%)" }}
      >
        <button
          onClick={() => isValid && onSave(formName.trim(), formPrice.trim(), formHasPhoto)}
          className={`h-[48px] relative rounded-[100px] transition-colors w-full ${isValid ? "bg-[#ff2947] cursor-pointer" : "bg-[#ffb2bc] cursor-not-allowed"}`}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[12px] relative size-full">
              <div className={`[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center whitespace-nowrap ${isValid ? "text-white" : "text-[#ffdfe4]"}`}>
                <p className="leading-[20px]">{editMode ? "Guardar cambios" : "Crear producto"}</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Success bottom sheet ─────────────────────────────────────────────────────

function SuccessSheet({
  product, celebrate = false, onContinue, onCreateAnother,
}: {
  product: Product; celebrate?: boolean; onContinue: () => void; onCreateAnother: () => void;
}) {
  const displayPrice = product.price.startsWith("$") ? product.price : "$" + product.price;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confeti: se dispara una sola vez al aparecer el modal del primer producto.
  // Se limpia al cerrar (unmount) para no dejar el efecto corriendo.
  useEffect(() => {
    if (!celebrate || !canvasRef.current) return;
    const fire = confetti.create(canvasRef.current, { resize: true, useWorker: true });
    const timer = window.setTimeout(() => {
      fire({ particleCount: 140, spread: 80, startVelocity: 42, origin: { y: 0.45 }, ticks: 220 });
    }, 150);
    return () => {
      window.clearTimeout(timer);
      fire.reset();
    };
  }, [celebrate]);

  return (
    <div className="absolute inset-0 bg-[rgba(30,30,30,0.7)] flex flex-col items-center justify-end overflow-clip">
      {celebrate && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none size-full z-10" />}
      <div className="bg-white drop-shadow-[0px_-4px_4px_rgba(0,0,0,0.12)] relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 w-full">
        <div className="flex flex-col items-center justify-end size-full">
          <div className="content-stretch flex flex-col gap-[16px] items-center justify-end pb-[20px] pt-[12px] px-[16px] relative size-full">
            <div className="content-stretch flex gap-[20px] items-center py-[12px] relative shrink-0 w-full">
              <div className="relative shrink-0 size-[24px]" />
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] min-w-px not-italic relative text-[#121e6c] text-[16px] text-center">
                <p className="leading-[20px]">¡Creaste tu primer producto!</p>
              </div>
              <div className="relative shrink-0 size-[24px]" />
            </div>
            <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1e1e1e] text-[14px] text-center w-full">Ahora podrás seleccionarlo desde el cobro para vender de forma más ágil.</p>
            <div className="bg-[#f7f8fb] content-stretch flex flex-col gap-[16px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
              <ProductPhoto product={product} size={112} />
              <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-full">
                  <p className="leading-[16px]">{product.name}</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[24px] text-center whitespace-nowrap">
                  <p className="leading-[28px]">{displayPrice}</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-center justify-end pt-[8px] relative shrink-0 w-full">
              <button onClick={onContinue} className="bg-[#ff2947] flex-[1_0_0] h-[48px] min-w-px relative rounded-[100px] cursor-pointer w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[16px] items-center justify-center px-[25px] py-[12px] relative size-full">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                      <p className="leading-[20px]">Continuar</p>
                    </div>
                  </div>
                </div>
              </button>
              <button onClick={onCreateAnother} className="content-stretch flex gap-[8px] items-center justify-center py-[12px] relative shrink-0 w-full cursor-pointer">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff2947] text-[12px] text-center whitespace-nowrap">
                  <p className="[text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] underline">Crear otro producto o servicio</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page 4: Flujo de cobro (dos tabs: Monto | Productos) ────────────────────

function CobroPage({
  products,
  onBack,
  defaultTab,
  onCreateProduct,
  onCobrar,
}: {
  products: Product[];
  onBack: () => void;
  defaultTab: "monto" | "productos";
  onCreateProduct: () => void;
  onCobrar: (items: CheckoutItem[]) => void;
}) {
  const [tab, setTab] = useState<"monto" | "productos">(defaultTab);
  const [amount, setAmount] = useState("0");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [salePrices, setSalePrices] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [categoryTab, setCategoryTab] = useState<"todos" | "favoritos" | "general" | "tecnologia">("todos");
  const [editingPriceFor, setEditingPriceFor] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState("");

  const hasRealProducts = products.some(p => !p.isExample);

  const parsePrice = (price: string) =>
    parseInt(price.replace(/\./g, "").replace(/[^0-9]/g, ""), 10) || 0;

  const getEffectivePrice = (p: Product) => salePrices[p.id] ?? parsePrice(p.price);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    return sum + qty * getEffectivePrice(p);
  }, 0);

  const displayAmount = formatCOP(parseInt(amount, 10) || 0);

  const handleDigit = (d: string) =>
    setAmount(prev => prev === "0" ? d : prev.length < 10 ? prev + d : prev);
  const handleErase = () =>
    setAmount(prev => prev.length <= 1 ? "0" : prev.slice(0, -1));

  const addToCart = (id: string) =>
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) =>
    setCart(prev => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) { const next = { ...prev }; delete next[id]; return next; }
      return { ...prev, [id]: qty };
    });

  const filteredProducts = products.filter(p => {
    if (categoryTab === "favoritos") return favorites[p.id];
    if (categoryTab === "general") return true;
    if (categoryTab === "tecnologia") return false;
    return true;
  });

  const openEditPrice = (p: Product) => {
    setEditingPriceFor(p.id);
    setEditPriceInput(String(getEffectivePrice(p)));
  };
  const saveEditPrice = () => {
    if (!editingPriceFor) return;
    const val = parseInt(editPriceInput.replace(/\./g, "").replace(/[^0-9]/g, ""), 10) || 0;
    setSalePrices(prev => ({ ...prev, [editingPriceFor]: val }));
    setEditingPriceFor(null);
  };

  const pill = (
    <div className={`flex gap-[4px] items-center rounded-[100px] px-[4px] py-[4px] w-[205px] ${tab === "monto" ? "bg-[#f7f8fb]" : "bg-white"}`}>
      {(["monto", "productos"] as const).map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`flex flex-1 items-center justify-center px-[12px] py-[8px] rounded-[100px] ${tab === t ? "bg-[#121e6c] drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)]" : ""}`}
        >
          <span className={`text-[14px] leading-[20px] ${tab === t ? "font-['Montserrat:Bold',sans-serif] font-bold text-white" : "font-['Montserrat:Regular',sans-serif] font-normal text-[#121e6c]"}`}>
            {t === "monto" ? "Monto" : "Productos"}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col size-full ${tab === "monto" ? "bg-white" : "bg-[#f7f8fb]"}`}>

      {/* ── Header ── */}
      <div className="flex-none flex flex-col gap-[12px] pb-[16px]">
        <StatusBar />
        <div className="flex items-center justify-between px-[16px] h-[40px]">
          <BackButton onPress={onBack} />
          {pill}
          {tab === "monto" ? (
            <div className="bg-[#f4fdf9] flex h-[28px] w-[48px] items-center justify-center rounded-[100px] shrink-0">
              <svg viewBox="0 0 20 20" className="size-[20px]" fill="none">
                <circle cx="10" cy="10" r="3.5" fill="#6CDCAB" />
                <circle cx="10" cy="10" r="7" stroke="#6CDCAB" strokeWidth="1.5" opacity="0.4" fill="none" />
              </svg>
            </div>
          ) : (
            <div className="relative size-[24px]">
              <svg viewBox="0 0 24 24" className="size-full" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#121E6C" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#121E6C" strokeWidth="1.5" />
                <path d="M16 10a4 4 0 01-8 0" stroke="#121E6C" strokeWidth="1.5" />
              </svg>
              {cartCount > 0 && (
                <div className="absolute -top-[6px] -right-[6px] bg-[#ff2947] rounded-full size-[16px] flex items-center justify-center">
                  <span className="font-['Montserrat:Bold',sans-serif] font-bold text-white leading-none" style={{ fontSize: 9 }}>{cartCount > 9 ? "9+" : cartCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {tab === "productos" && (
          <div className="flex gap-[16px] items-center px-[16px]">
            <div className="flex-1 bg-white h-[40px] rounded-[30px] flex items-center gap-[12px] px-[12px]">
              <svg viewBox="0 0 20 20" className="shrink-0 size-[20px]" fill="none">
                <path clipRule="evenodd" d="M9 2a7 7 0 100 14A7 7 0 009 2zM2 9a7 7 0 1112.452 4.391l3.328 3.329a1 1 0 11-1.414 1.414l-3.329-3.328A7 7 0 012 9z" fill="#606060" fillRule="evenodd" />
              </svg>
              <span className="font-['Montserrat:Light',sans-serif] font-light text-[14px] text-[#606060]">Buscar</span>
            </div>
            <button onClick={onCreateProduct} className="flex items-center gap-[4px] h-[40px] cursor-pointer">
              <svg viewBox="0 0 24 24" className="size-[16px]" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#121E6C" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[12px] text-[#121e6c] underline">Nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* ── TAB MONTO ── */}
      {tab === "monto" && (
        <>
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center justify-center h-[56px] mt-[8px]">
              <span className="font-['Montserrat:Light',sans-serif] font-light text-[52px] leading-none text-[#1e1e1e] whitespace-nowrap">
                {displayAmount}
              </span>
            </div>
            <div className="flex items-center justify-center mt-[16px]">
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[12px] text-[#babdd3] underline">Describe tu venta</span>
            </div>
            <div className="flex gap-[12px] items-center mt-[20px]">
              <div className="bg-white drop-shadow-[0px_4px_4px_rgba(18,30,108,0.04)] flex items-center justify-center px-[16px] py-[6px] rounded-[100px]">
                <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#d2d4e1] whitespace-nowrap">Con impuesto</span>
              </div>
              <div className="bg-white drop-shadow-[0px_4px_4px_rgba(18,30,108,0.04)] flex items-center justify-center px-[16px] py-[6px] rounded-[100px]">
                <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#d2d4e1] whitespace-nowrap">Sin impuesto</span>
              </div>
            </div>
            <div className="mt-[28px] grid grid-cols-3 gap-x-[24px] gap-y-[16px]">
              {(["1","2","3","4","5","6","7","8","9","00","0","⌫"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => key === "⌫" ? handleErase() : handleDigit(key)}
                  className="bg-[#f7f8fb] flex items-center justify-center rounded-[16px] h-[48px] w-[80px] cursor-pointer"
                >
                  {key === "⌫" ? (
                    <svg viewBox="0 0 24 24" className="size-[20px]" fill="none">
                      <path d="M9 3H19a2 2 0 012 2v14a2 2 0 01-2 2H9l-7-9 7-9z" stroke="#121E6C" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M14 9l-4 6M10 9l4 6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[16px] leading-[24px] text-[#121e6c]">{key}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-none px-[16px] pb-[24px] pt-[12px]" style={{ backgroundImage: "linear-gradient(0deg, white 70%, rgba(255,255,255,0) 100%)" }}>
            <button
              className={`w-full h-[48px] rounded-[100px] font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white uppercase tracking-wide ${amount !== "0" ? "bg-[#ff2947] cursor-pointer" : "bg-[#f59fa5] cursor-not-allowed"}`}
            >
              CONTINUAR
            </button>
          </div>
        </>
      )}

      {/* ── TAB PRODUCTOS ── */}
      {tab === "productos" && (
        <>
          {/* Category tabs */}
          <div className="flex-none border-b border-[#e8e9f0]">
            <div className="flex px-[16px]">
              {(["todos", "favoritos", "general", "tecnologia"] as const).map(ct => {
                const label = ct === "todos" ? "Todos" : ct === "favoritos" ? "Favoritos" : ct === "general" ? "General" : "Tecnología";
                const active = categoryTab === ct;
                return (
                  <button
                    key={ct}
                    onClick={() => setCategoryTab(ct)}
                    className="flex flex-col items-center flex-1 cursor-pointer"
                  >
                    <span className={`text-[12px] leading-[16px] py-[10px] ${active ? "font-['Montserrat:Semibold',sans-serif] font-semibold text-[#121e6c]" : "font-['Montserrat:Regular',sans-serif] font-normal text-[#121e6c]"}`}>
                      {label}
                    </span>
                    <div className={`h-[2px] w-full rounded-t-full ${active ? "bg-[#ff2947]" : "bg-transparent"}`} />
                  </button>
                );
              })}
              <button className="flex flex-col items-center px-[10px] cursor-pointer">
                <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#121e6c] leading-[16px] py-[10px]">+</span>
                <div className="h-[2px] w-full rounded-t-full bg-transparent" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-[12px]">
            <div className="flex flex-col gap-[12px] items-center px-[16px]">

              {/* Feedback card */}
              <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] w-full max-w-[343px]">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[#1e1e1e] w-full">
                      <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] w-full">
                        <p className="leading-[20px]">{hasRealProducts ? "Cobra seleccionando tu producto" : "Crea un producto o servicio"}</p>
                      </div>
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] w-full">Cobra en segundos y visualiza los productos más vendidos</p>
                    </div>
                  </div>
                  <PieChart label={hasRealProducts ? "2/2" : "1/2"} full={hasRealProducts} />
                </div>
                {!hasRealProducts && (
                  <button
                    onClick={onCreateProduct}
                    className="bg-[#f1f2f6] relative rounded-[12px] shrink-0 w-full cursor-pointer"
                  >
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative size-full">
                        <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Crear producto o servicio</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Lista de productos */}
              {filteredProducts.map(p => {
                const qty = cart[p.id] || 0;
                const isSelected = qty > 0;
                const unitPrice = getEffectivePrice(p);
                const totalLine = unitPrice * qty;
                return (
                  <div
                    key={p.id}
                    onClick={() => { if (!isSelected) addToCart(p.id); }}
                    className={`bg-white drop-shadow-[0px_8px_10px_rgba(18,30,108,0.08)] flex gap-[12px] items-start p-[12px] relative rounded-[16px] w-full max-w-[343px] ${isSelected ? "border border-[#ff2947]" : "cursor-pointer"}`}
                  >
                    {/* Product image with heart badge */}
                    <div className="relative shrink-0">
                      <div className="size-[72px] rounded-[12px] overflow-hidden">
                        <div className="size-full">
                          <ProductPhoto product={p} size={72} />
                        </div>
                      </div>
                      {/* Heart badge — stopPropagation para no agregar al carrito */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setFavorites(prev => ({ ...prev, [p.id]: !prev[p.id] })); }}
                        className="absolute left-[6px] top-[6px] backdrop-blur-[2px] bg-[rgba(255,255,255,0.5)] p-[4px] rounded-[8px] size-[28px] flex items-center justify-center cursor-pointer"
                      >
                        <svg viewBox="0 0 20 18" className="size-[16px]" fill="none">
                          {favorites[p.id] ? (
                            <path d="M10 16.5C10 16.5 1.5 11 1.5 5.5C1.5 3.01 3.51 1 6 1C7.74 1 9.26 1.93 10 3.34C10.74 1.93 12.26 1 14 1C16.49 1 18.5 3.01 18.5 5.5C18.5 11 10 16.5 10 16.5Z" fill="#ff2947" />
                          ) : (
                            <path d="M10 16.5C10 16.5 1.5 11 1.5 5.5C1.5 3.01 3.51 1 6 1C7.74 1 9.26 1.93 10 3.34C10.74 1.93 12.26 1 14 1C16.49 1 18.5 3.01 18.5 5.5C18.5 11 10 16.5 10 16.5Z" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          )}
                        </svg>
                      </button>
                    </div>

                    {/* Info section */}
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0 pt-[4px]">
                      {/* Name */}
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#1e1e1e] leading-[16px]">{p.name}</p>

                      {isSelected ? (
                        <>
                          {/* Total line */}
                          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px] whitespace-nowrap">
                            {formatCOP(totalLine)} &nbsp;({qty} un)
                          </p>
                          {/* Unit price */}
                          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] whitespace-nowrap">
                            {formatCOP(unitPrice)}
                          </p>
                          {/* Stepper + Editar precio row */}
                          <div className="flex items-center justify-between w-full">
                            {/* Stepper */}
                            <div className="bg-[#f7f8fb] flex gap-[2px] items-center justify-center p-[8px] rounded-[100px]">
                              <button
                                onClick={() => removeFromCart(p.id)}
                                className="size-[24px] flex items-center justify-center cursor-pointer"
                              >
                                {qty === 1 ? (
                                  <svg viewBox="0 0 20 22" className="size-[18px]" fill="none">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M7 0a1 1 0 000 2h6a1 1 0 100-2H7zM1 5a1 1 0 011-1h16a1 1 0 110 2H2a1 1 0 01-1-1zM3 8a1 1 0 011 1v9a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 112 0v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9a1 1 0 011-1z" fill="#121E6C" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 20 2" className="size-[16px]" fill="none">
                                    <path d="M1 1h18" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </button>
                              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#121e6c] leading-[20px] w-[32px] text-center">{qty}</span>
                              <button
                                onClick={() => addToCart(p.id)}
                                className="size-[24px] flex items-center justify-center cursor-pointer"
                              >
                                <svg viewBox="0 0 20 20" className="size-[16px]" fill="none">
                                  <path d="M10 1v18M1 10h18" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>
                            {/* Editar precio */}
                            <button
                              onClick={() => openEditPrice(p)}
                              className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#ff2947] underline cursor-pointer"
                            >
                              Editar precio
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] whitespace-nowrap">
                          {formatCOP(unitPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center gap-[8px] py-[32px]">
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#606060]">Sin productos en esta categoría</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex-none flex items-center gap-[12px] px-[16px] py-[20px] backdrop-blur-[6px]"
            style={{ background: "rgba(247,248,251,0.9)" }}>
            <div className="flex-1 flex flex-col gap-[2px]">
              <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">
                {cartCount} {cartCount === 1 ? "Producto" : "Productos"}
              </span>
              <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[16px] text-[#1e1e1e] leading-[20px]">
                {formatCOP(cartTotal)}
              </span>
            </div>
            <button
              onClick={() => {
                if (cartCount === 0) return;
                const items: CheckoutItem[] = products
                  .filter(p => (cart[p.id] || 0) > 0)
                  .map(p => ({
                    id: p.id,
                    name: p.name,
                    qty: cart[p.id],
                    unitPrice: getEffectivePrice(p),
                    hasPhoto: p.hasPhoto,
                    photoType: p.photoType,
                  }));
                onCobrar(items);
              }}
              className={`flex items-center justify-center w-[140px] h-[48px] rounded-[100px] font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white ${cartCount > 0 ? "bg-[#ff2947] cursor-pointer" : "bg-[#ffb2bc] cursor-not-allowed"}`}
            >
              Cobrar
            </button>
          </div>
        </>
      )}

      {/* ── Editar precio drop-up ── */}
      {editingPriceFor && (
        <div className="absolute inset-0 flex flex-col justify-end z-50" style={{ background: "rgba(30,30,30,0.7)" }}>
          <div className="bg-white rounded-tl-[32px] rounded-tr-[32px] flex flex-col gap-[24px] px-[16px] py-[12px]">
            {/* Header */}
            <div className="flex gap-[20px] items-center py-[12px]">
              <button onClick={() => setEditingPriceFor(null)} className="size-[24px] flex items-center justify-center cursor-pointer shrink-0">
                <svg viewBox="0 0 24 24" className="size-full" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="flex-1 text-center font-['Montserrat:Semibold',sans-serif] font-semibold text-[16px] text-[#121e6c] leading-[24px]">Editar precio unitario</span>
              <button onClick={() => setEditingPriceFor(null)} className="size-[24px] flex items-center justify-center cursor-pointer shrink-0">
                <svg viewBox="0 0 24 24" className="size-full" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {/* Input */}
            <div className="flex flex-col gap-[8px]">
              <input
                type="number"
                value={editPriceInput}
                onChange={e => setEditPriceInput(e.target.value)}
                className="bg-[#f7f8fb] h-[40px] rounded-[12px] pl-[12px] font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] outline-none w-full"
              />
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">IVA (5%) incluido en el precio unitario</p>
            </div>
            {/* Guardar */}
            <button
              onClick={saveEditPrice}
              className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer mb-[8px]"
            >
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Guardar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page: Product Detail ─────────────────────────────────────────────────────

function ProductDetailPage({
  product,
  onBack,
  onEdit,
  onClose,
  onDelete,
}: {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const displayPrice = product.price.startsWith("$") ? product.price : "$" + product.price;

  return (
    <div className="bg-[#f7f8fb] relative size-full">
      {/* Header */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-0 pb-[16px] top-0 w-full">
        <StatusBar />
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row justify-center size-full">
            <div className="content-stretch flex items-start justify-between px-[12px] relative size-full">
              <BackButton onPress={onBack} />
              <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-w-px relative self-stretch">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px] text-center">Detalle del producto</p>
              </div>
              <CloseXButton onPress={onClose} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-[16px] right-[16px] top-[96px] bottom-0 overflow-y-auto">
        <div className="flex flex-col gap-[24px] items-center pb-[32px]">

          {/* InfoGeneral card */}
          <div className="bg-white content-stretch flex flex-col gap-[24px] items-center overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            {/* Product image */}
            <ProductPhoto product={product} size={112} />
            {/* Details: name + price */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[311px]">
                <p className="leading-[16px]">{product.name}</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[24px] text-center whitespace-nowrap">
                  <p className="leading-[28px]">{displayPrice}</p>
                </div>
              </div>
            </div>
            {/* Heart badge */}
            <div className="absolute backdrop-blur-[2px] bg-[#fff2f4] content-stretch flex items-center p-[4px] right-[16px] rounded-[8px] top-[16px]">
              <div className="relative shrink-0 size-[24px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPV.p39393500} fill="#FF2947" />
                </svg>
              </div>
            </div>
            {/* Eliminar / Editar */}
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
              {/* Eliminar */}
              <button onClick={onDelete} className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px] cursor-pointer">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute inset-[4.44%_9.46%]">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.46 21.87">
                          <path clipRule="evenodd" d={svgPV.p288a3180} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p3fd74800} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p3420f340} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p10d46d00} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p2fb24200} fill="#121E6C" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPV.p15ffbc80} fill="#121E6C" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Eliminar</p>
                  </div>
                </div>
              </button>
              {/* Editar */}
              <button
                onClick={onEdit}
                className="bg-[#f1f2f6] flex-[1_0_0] h-[40px] min-w-px relative rounded-[12px] cursor-pointer"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative size-full">
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute inset-[4.17%_4.17%_4.19%_4.17%]">
                        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 21.9948">
                          <path d={svgPV.p26ae3500} fill="#121E6C" />
                          <path d={svgPV.p276e25f0} fill="#121E6C" />
                        </svg>
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['Montserrat:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Editar</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Status card */}
          <div className="bg-white content-stretch flex gap-[96px] items-center px-[16px] py-[12px] relative rounded-[16px] shrink-0 w-[343px]">
            <div className="bg-[#f4fdf9] content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[12px] relative rounded-[100px] shrink-0">
              <div className="relative shrink-0 size-[24px]">
                <div className="absolute inset-1/4">
                  <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" fill="#6CDCAB" r="6" />
                  </svg>
                </div>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1b8959] text-[14px] text-center whitespace-nowrap">
                <p className="leading-[20px]">Producto activo</p>
              </div>
            </div>
            <div className="h-[28px] relative shrink-0 w-[52px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 28">
                <path d={svgCP.p9c7c300} fill="#FF2947" />
                <path d={svgCP.p24e980} fill="white" />
              </svg>
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-white content-stretch flex flex-col gap-[20px] items-start pb-[16px] pt-[20px] px-[16px] relative rounded-[16px] shrink-0 w-[343px]">
            {/* Más información heading */}
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[4.29%_14.06%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.25 21.94">
                      <path clipRule="evenodd" d={svgPV.p8bb1070} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p2d013e00} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p17e54280} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p4b3c800} fill="#121E6C" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPV.p23dc2680} fill="#121E6C" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col h-[24px] items-start justify-center min-w-px relative">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1e1e1e] text-[14px] w-full">
                    <p className="leading-[20px]">Más información</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute inset-[-0.25px_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
                  <path d="M0.25 0.25H311.25" stroke="#D2D4E1" strokeLinecap="round" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            {/* Category / Unit / Code */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {[
                { label: "Categoría", value: "General" },
                { label: "Unidad de medida", value: "Unidades" },
                { label: "Código del producto", value: "PROD01" },
              ].map(({ label, value }) => (
                <div key={label} className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                  <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                    <p className="leading-[16px]">{label}</p>
                  </div>
                  <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                    <p className="leading-[16px]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Divider */}
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute inset-[-0.25px_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311.5 0.5">
                  <path d="M0.25 0.25H311.25" stroke="#D2D4E1" strokeLinecap="round" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            {/* Tax breakdown */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                  <p className="leading-[16px]">Impuesto (5%)</p>
                </div>
                <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                  <p className="leading-[16px]">$26.619,05</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-start leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center min-w-px relative">
                  <p className="leading-[16px]">Subtotal</p>
                </div>
                <div className="flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center relative shrink-0 text-right whitespace-nowrap">
                  <p className="leading-[16px]">$532.380,95</p>
                </div>
              </div>
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className="flex flex-[1_0_0] flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center min-w-px relative text-[12px]">
                  <p className="leading-[16px]">Precio de venta total</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[14px] text-right whitespace-nowrap">
                  <p className="leading-[20px]">{displayPrice}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Page: Productos a cobrar ─────────────────────────────────────────────────

function ProductosACobrarPage({
  initialItems,
  onBack,
  onClose,
  onContinue,
}: {
  initialItems: CheckoutItem[];
  onBack: () => void;
  onClose: () => void;
  onContinue: (items: CheckoutItem[]) => void;
}) {
  const [items, setItems] = useState<CheckoutItem[]>(initialItems);
  const [editingFor, setEditingFor] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const addQty = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const removeQty = (id: string) => setItems(prev => {
    const item = prev.find(i => i.id === id);
    if (!item) return prev;
    if (item.qty <= 1) return prev.filter(i => i.id !== id);
    return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
  });
  const openEditPrice = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setEditingFor(id);
    setEditInput(String(item.unitPrice));
  };
  const saveEditPrice = () => {
    if (!editingFor) return;
    const val = parseInt(editInput.replace(/\./g, "").replace(/[^0-9]/g, ""), 10) || 0;
    setItems(prev => prev.map(i => i.id === editingFor ? { ...i, unitPrice: val } : i));
    setEditingFor(null);
  };

  return (
    <div className="bg-[#f7f8fb] flex flex-col size-full relative">
      {/* Header */}
      <div className="flex-none flex flex-col gap-[20px] pb-[16px]">
        <StatusBar />
        <div className="flex gap-[8px] items-center px-[12px]">
          <BackButton onPress={onBack} />
          <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[18px] leading-[24px] text-[#121e6c] text-center">Productos a cobrar</p>
          <CloseXButton onPress={onClose} />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto pb-[96px]">
        <div className="px-[16px] flex flex-col gap-[12px]">
          {/* Label row */}
          <div className="flex items-center gap-[12px] h-[20px]">
            <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[14px] leading-[20px] text-[#121e6c]">
              {totalQty} {totalQty === 1 ? "producto" : "productos"}
            </p>
            <button onClick={() => setItems([])} className="flex gap-[4px] items-center cursor-pointer">
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[12px] text-[#121e6c] underline leading-[16px]">Eliminar todos</span>
              <svg viewBox="0 0 20 22" className="size-[20px]" fill="none">
                <path clipRule="evenodd" fillRule="evenodd" d="M7 0a1 1 0 000 2h6a1 1 0 100-2H7zM1 5a1 1 0 011-1h16a1 1 0 110 2H2a1 1 0 01-1-1zM3 8a1 1 0 011 1v9a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 112 0v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9a1 1 0 011-1z" fill="#121E6C" />
              </svg>
            </button>
          </div>

          {/* Cards */}
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[16px] p-[12px] flex gap-[12px] items-start">
              <div className="size-[72px] rounded-[12px] overflow-hidden shrink-0">
                {item.photoType === "water-bottle"
                  ? <WaterBottleIllustration size={72} />
                  : <ShoppingBagIllustration size={72} />}
              </div>
              <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0 justify-center">
                {/* Name + trash */}
                <div className="flex gap-[4px] items-start w-full">
                  <div className="flex flex-1 flex-col gap-[4px] min-w-0">
                    <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#1e1e1e] leading-[16px] truncate">{item.name}</p>
                    <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px] whitespace-nowrap">
                      {formatCOP(item.unitPrice * item.qty)}&nbsp;({item.qty} un)
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="size-[20px] flex items-center justify-center cursor-pointer shrink-0 mt-[2px]">
                    <svg viewBox="0 0 20 22" className="size-full" fill="none">
                      <path clipRule="evenodd" fillRule="evenodd" d="M7 0a1 1 0 000 2h6a1 1 0 100-2H7zM1 5a1 1 0 011-1h16a1 1 0 110 2H2a1 1 0 01-1-1zM3 8a1 1 0 011 1v9a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 112 0v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9a1 1 0 011-1z" fill="#121E6C" />
                    </svg>
                  </button>
                </div>
                {/* Unit price */}
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] whitespace-nowrap">{formatCOP(item.unitPrice)}</p>
                {/* Stepper + Editar precio */}
                <div className="flex items-center justify-between w-full">
                  <div className="bg-[#f7f8fb] flex gap-[2px] items-center p-[8px] rounded-[100px]">
                    <button onClick={() => removeQty(item.id)} className="size-[24px] flex items-center justify-center cursor-pointer">
                      {item.qty === 1
                        ? <svg viewBox="0 0 20 22" className="size-[16px]" fill="none"><path clipRule="evenodd" fillRule="evenodd" d="M7 0a1 1 0 000 2h6a1 1 0 100-2H7zM1 5a1 1 0 011-1h16a1 1 0 110 2H2a1 1 0 01-1-1zM3 8a1 1 0 011 1v9a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 112 0v9a3 3 0 01-3 3H5a3 3 0 01-3-3V9a1 1 0 011-1z" fill="#121E6C" /></svg>
                        : <svg viewBox="0 0 20 2" className="size-[14px]" fill="none"><path d="M1 1h18" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                    </button>
                    <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[16px] text-[#121e6c] text-center w-[48px] leading-[20px]">{item.qty}</span>
                    <button onClick={() => addQty(item.id)} className="size-[24px] flex items-center justify-center cursor-pointer">
                      <svg viewBox="0 0 20 20" className="size-[14px]" fill="none"><path d="M10 1v18M1 10h18" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                  <button onClick={() => openEditPrice(item.id)} className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#ff2947] underline cursor-pointer">
                    Editar precio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-[12px] px-[16px] py-[20px] backdrop-blur-[6px]"
        style={{ background: "rgba(247,248,251,0.9)" }}>
        <div className="flex-1 flex flex-col gap-[2px]">
          <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">
            {totalQty} {totalQty === 1 ? "Producto" : "Productos"}
          </span>
          <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[16px] text-[#1e1e1e] leading-[20px]">{formatCOP(total)}</span>
        </div>
        <button
          onClick={() => items.length > 0 && onContinue(items)}
          className={`flex items-center justify-center w-[174px] h-[48px] rounded-[100px] font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white ${items.length > 0 ? "bg-[#ff2947] cursor-pointer" : "bg-[#ffb2bc] cursor-not-allowed"}`}
        >
          Continuar
        </button>
      </div>

      {/* Editar precio drop-up */}
      {editingFor && (
        <div className="absolute inset-0 flex flex-col justify-end z-50" style={{ background: "rgba(30,30,30,0.7)" }}>
          <div className="bg-white rounded-tl-[32px] rounded-tr-[32px] flex flex-col gap-[24px] px-[16px] py-[12px]">
            <div className="flex gap-[20px] items-center py-[12px]">
              <button onClick={() => setEditingFor(null)} className="size-[24px] flex items-center justify-center cursor-pointer shrink-0">
                <svg viewBox="0 0 24 24" className="size-full" fill="none"><path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="flex-1 text-center font-['Montserrat:Semibold',sans-serif] font-semibold text-[16px] text-[#121e6c] leading-[24px]">Editar precio unitario</span>
              <button onClick={() => setEditingFor(null)} className="size-[24px] flex items-center justify-center cursor-pointer shrink-0">
                <svg viewBox="0 0 24 24" className="size-full" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-[8px]">
              <input type="number" value={editInput} onChange={e => setEditInput(e.target.value)}
                className="bg-[#f7f8fb] h-[40px] rounded-[12px] pl-[12px] font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] outline-none w-full" />
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">IVA (5%) incluido en el precio unitario</p>
            </div>
            <button onClick={saveEditPrice} className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer mb-[8px]">
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Guardar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page: Detalle a cobrar (drop-up) ────────────────────────────────────────

function DetallePage({
  items,
  onBack,
  onCobrar,
}: {
  items: CheckoutItem[];
  onBack: () => void;
  onCobrar: () => void;
}) {
  const [tipEnabled, setTipEnabled] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tip = tipEnabled ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + tip;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="relative size-full">
      <div className="absolute inset-0 bg-[#f7f8fb]" />
      <div className="absolute inset-0" style={{ background: "rgba(30,30,30,0.7)" }} />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[32px] rounded-tr-[32px] flex flex-col px-[18px] pt-[12px] pb-[28px]">
        {/* Header */}
        <div className="flex items-center gap-[20px]">
          <button onClick={onBack} className="flex items-center py-[16px] cursor-pointer shrink-0">
            <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[18px] leading-[24px] text-[#121e6c] text-center py-[12px]">Detalle a cobrar</p>
          <div className="size-[24px] shrink-0" />
        </div>

        <div className="flex flex-col gap-[16px]">
          {/* Amount + dividir */}
          <div className="flex flex-col gap-[20px] items-center">
            <p className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[24px] leading-[36px] text-[#1e1e1e]">{formatCOP(total)}</p>
            <button className="bg-[#f1f2f6] flex gap-[8px] h-[48px] items-center justify-center w-full rounded-[12px] cursor-pointer">
              <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
                <rect x="2" y="7" width="20" height="13" rx="2" stroke="#121E6C" strokeWidth="1.5" />
                <path d="M2 11h20M8 7V5a2 2 0 014 0v2" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="15" r="1.5" fill="#121E6C" />
              </svg>
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#121e6c] leading-[20px]">Dividir cobro</span>
            </button>
          </div>

          {/* Breakdown rows */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">Subtotal</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(subtotal)}</p>
            </div>
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">INC (0 %)</p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(0)}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#e8e9f0]" />

          {/* Second group */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Productos y servicios</p>
              <button className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[14px] text-[#121e6c] underline leading-[20px] cursor-pointer">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </button>
            </div>
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Agregar propina</p>
              <button onClick={() => setTipEnabled(!tipEnabled)} className="cursor-pointer shrink-0">
                <div className={`relative h-[28px] w-[47px] rounded-[99px] transition-colors ${tipEnabled ? "bg-[#ff2947]" : "bg-[#d2d4e1]"}`}>
                  <div className={`absolute top-[2px] size-[24px] bg-white rounded-full drop-shadow-[0px_4px_4px_rgba(0,0,0,0.08)] transition-all ${tipEnabled ? "left-[21px]" : "left-[2px]"}`} />
                </div>
              </button>
            </div>
            {tipEnabled && (
              <div className="flex items-center">
                <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px]">Propina (10%)</p>
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(tip)}</p>
              </div>
            )}
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">Total a cobrar</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e] leading-[20px]">{formatCOP(total)}</p>
            </div>
          </div>

          {/* Cobrar button */}
          <button onClick={onCobrar} className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer">
            <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Cobrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page: ¿Cómo quieres cobrar? (drop-up) ───────────────────────────────────

function MediosDePagoPage({
  items,
  onBack,
  onDatafono,
}: {
  items: CheckoutItem[];
  onBack: () => void;
  onDatafono: () => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <div className="relative size-full bg-[#f7f8fb]">
      {/* Background: summary card */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="px-[16px] pt-[60px] flex flex-col gap-[12px]">
          <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#121e6c] leading-[20px]">Detalle a cobrar</p>
          <div className="bg-white rounded-[12px] px-[16px] py-[12px] flex flex-col gap-[12px]">
            {[
              { label: "Subtotal", value: formatCOP(subtotal), bold: true },
              { label: "Descuento", value: formatCOP(0), bold: false },
              { label: "Sin impuesto", value: formatCOP(0), bold: false },
            ].map(({ label, value, bold }) => (
              <div key={label} className="flex items-center">
                <p className={`flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#1e1e1e]`}>{label}</p>
                <p className={`text-[12px] text-[#1e1e1e] ${bold ? "font-['Montserrat:Semibold',sans-serif] font-semibold" : "font-['Montserrat:Regular',sans-serif] font-normal"}`}>{value}</p>
              </div>
            ))}
            <div className="h-px bg-[#e8e9f0]" />
            <div className="flex items-center">
              <p className="flex-1 font-['Montserrat:Semibold',sans-serif] font-semibold text-[14px] text-[#1e1e1e]">Total a facturar</p>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-[#1e1e1e]">{formatCOP(subtotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(30,30,30,0.7)" }} />

      {/* Drop-up sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-tl-[24px] rounded-tr-[24px] flex flex-col gap-[16px] pb-[32px]">
        {/* Header */}
        <div className="flex items-start px-[16px] pt-[12px]">
          <button onClick={onBack} className="flex items-center py-[12px] cursor-pointer shrink-0">
            <svg viewBox="0 0 24 24" className="size-[24px]" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="flex-1 font-['Montserrat:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#121e6c] text-center py-[12px]">¿Cómo quieres cobrar?</p>
          <div className="size-[24px] shrink-0 mt-[12px]" />
        </div>

        {/* Payment methods grid */}
        <div className="flex flex-wrap gap-[12px] px-[16px]">
          {[
            {
              label: "Datáfono",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <rect x="6" y="4" width="20" height="24" rx="3" stroke="#121E6C" strokeWidth="1.5" />
                  <rect x="9" y="8" width="14" height="7" rx="1.5" fill="#121E6C" opacity="0.12" />
                  <circle cx="16" cy="11" r="2" fill="#ff2947" opacity="0.6" />
                  <circle cx="11" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="16" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="21" cy="19" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="11" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="16" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                  <circle cx="21" cy="24" r="1.5" fill="#121E6C" opacity="0.3" />
                </svg>
              ),
              action: onDatafono,
              interactive: true,
            },
            {
              label: "Link de pago",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <path d="M13 19a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 13a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              action: null,
              interactive: false,
            },
            {
              label: "Efectivo",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <rect x="3" y="10" width="26" height="14" rx="3" stroke="#121E6C" strokeWidth="1.5" />
                  <circle cx="16" cy="17" r="3.5" stroke="#121E6C" strokeWidth="1.5" />
                  <path d="M7 14v6M25 14v6" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
              action: null,
              interactive: false,
            },
            {
              label: "Nequi",
              icon: (
                <svg viewBox="0 0 32 32" className="size-[32px]" fill="none">
                  <path d="M9 25V7l14 18V7" stroke="#7B2FBE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              action: null,
              interactive: false,
            },
          ].map(({ label, icon, action, interactive }) => (
            <button
              key={label}
              onClick={() => action?.()}
              className={`bg-[#f7f8fb] flex flex-1 flex-col gap-[12px] items-center justify-center min-w-[136px] max-w-[163px] h-[134px] px-[4px] py-[16px] rounded-[16px] ${interactive ? "cursor-pointer" : "cursor-default"}`}
            >
              {icon}
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1e1e1e] leading-[20px] text-center">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page: Acerca, inserta o desliza ─────────────────────────────────────────

function AcercaInsertaPage({
  total,
  onCancel,
  onSuccess,
}: {
  total: number;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onSuccess, 2500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white relative size-full flex flex-col">
      {/* Header */}
      <div className="flex-none">
        <StatusBar />
        <div className="flex items-center justify-between px-[4px] pr-[16px] h-[40px]">
          <button onClick={onCancel} className="flex items-center px-[12px] gap-[4px] cursor-pointer">
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#ff2947" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[12px] text-[#ff2947] underline leading-[16px]">Cancelar</span>
          </button>
          <div className="bg-[#f4fdf9] flex gap-[4px] h-[28px] items-center justify-center px-[12px] rounded-[100px]">
            <svg viewBox="0 0 24 24" className="size-[20px]" fill="none">
              <circle cx="12" cy="12" r="3.5" fill="#6CDCAB" />
              <circle cx="12" cy="12" r="7" stroke="#6CDCAB" strokeWidth="1.5" opacity="0.4" fill="none" />
            </svg>
            <span className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#1b8959] leading-[20px]">Conectado</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-[48px] gap-[24px]">
        <p className="font-['Montserrat:ExtraBold',sans-serif] font-extrabold text-[20px] leading-[28px] text-[#111e6c] text-center px-[24px]">
          Acerca, inserta o desliza la tarjeta del tu cliente
        </p>
        <div className="flex flex-col items-center gap-[4px]">
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[16px] text-[#969696] leading-[24px]">Monto a cobrar</p>
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[32px] text-[#1e1e1e] leading-[40px]">{formatCOP(total)}</p>
        </div>

        {/* Datáfono illustration */}
        <div className="flex items-center justify-center mt-[16px]">
          <svg viewBox="0 0 160 200" className="w-[160px] h-[200px]" fill="none">
            <defs>
              <radialGradient id="devBg" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#ff2947" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#121e6c" stopOpacity="0.15" />
              </radialGradient>
            </defs>
            <ellipse cx="80" cy="185" rx="70" ry="18" fill="url(#devBg)" />
            <rect x="30" y="15" width="100" height="160" rx="16" fill="#f1f2f6" />
            <rect x="30" y="15" width="100" height="160" rx="16" stroke="#d2d4e1" strokeWidth="1" />
            <rect x="42" y="30" width="76" height="46" rx="6" fill="#121e6c" opacity="0.08" />
            <rect x="42" y="30" width="76" height="46" rx="6" stroke="#d2d4e1" strokeWidth="1" />
            <circle cx="80" cy="53" r="7" fill="#ff2947" opacity="0.5" />
            <circle cx="52" cy="103" r="6" fill="#d2d4e1" /><circle cx="80" cy="103" r="6" fill="#d2d4e1" /><circle cx="108" cy="103" r="6" fill="#d2d4e1" />
            <circle cx="52" cy="124" r="6" fill="#d2d4e1" /><circle cx="80" cy="124" r="6" fill="#d2d4e1" /><circle cx="108" cy="124" r="6" fill="#d2d4e1" />
            <circle cx="52" cy="145" r="6" fill="#d2d4e1" /><circle cx="80" cy="145" r="6" fill="#d2d4e1" /><circle cx="108" cy="145" r="6" fill="#d2d4e1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Cobro exitoso ──────────────────────────────────────────────────────

function CobroExitosoPage({
  items,
  onNuevoCobro,
}: {
  items: CheckoutItem[];
  onNuevoCobro: () => void;
}) {
  const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} - ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <div className="flex items-start">
      <p className={`flex-1 text-[12px] leading-[16px] text-[#606060] ${bold ? "font-['Montserrat:Bold',sans-serif] font-bold text-[#1e1e1e]" : "font-['Montserrat:Regular',sans-serif] font-normal"}`}>{label}</p>
      <p className={`text-[12px] leading-[16px] text-right ${bold ? "font-['Montserrat:Bold',sans-serif] font-bold text-[#1e1e1e]" : "font-['Montserrat:Medium',sans-serif] font-medium text-[#1e1e1e]"}`}>{value}</p>
    </div>
  );

  const Divider = () => (
    <div className="h-px w-full bg-[#e8e9f0]" />
  );

  return (
    <div className="bg-[#f7f8fb] flex flex-col size-full">
      <div className="flex-none">
        <StatusBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-[32px] px-[16px] py-[24px]">
          {/* Receipt card */}
          <div className="bg-white w-full rounded-[16px] drop-shadow-[0px_8px_8px_rgba(18,30,108,0.04)] flex flex-col gap-[28px] items-center px-[16px] py-[24px]">
            {/* Header: icon + title + amount */}
            <div className="flex flex-col gap-[8px] items-center">
              <div className="size-[40px] bg-[#6CDCAB] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-[22px]" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-['Montserrat:Bold',sans-serif] font-bold text-[16px] leading-[24px] text-[#1e1e1e] text-center">Cobro exitoso</p>
              <p className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[32px] leading-[40px] text-[#121e6c] text-center whitespace-nowrap">{formatCOP(total)}</p>
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#606060] text-center">{dateStr}</p>
              <button className="flex gap-[8px] items-center">
                <svg viewBox="0 0 22 22" className="size-[22px]" fill="none">
                  <path d="M3 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M11 2v12M7 8l4 4 4-4" stroke="#121E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#121e6c] underline leading-[16px]">
                  Ver productos y servicios
                </span>
              </button>
            </div>

            {/* Transaction info */}
            <div className="flex flex-col gap-[16px] w-full">
              <div className="flex flex-col gap-[8px]">
                <Row label="Comercio" value="Vinos y vinilos" />
                <Row label="Dirección" value="Calle 123 # 24 - 32" />
              </div>
              <Divider />
              <div className="flex flex-col gap-[8px]">
                <Row label="Código único" value="17385253" />
                <Row label="Terminal" value="9B00L648" />
                <Row label="Código de autorización" value="000000-0" />
                <Row label="ID transacción Bold" value="000000-0" />
                <div className="flex items-center">
                  <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">Método de pago</p>
                  <div className="flex items-center gap-[4px]">
                    <div className="flex items-center gap-[1px]">
                      <div className="size-[12px] rounded-full bg-[#EB001B]" />
                      <div className="size-[12px] rounded-full bg-[#F79E1B] -ml-[4px]" />
                    </div>
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[12px] text-[#1e1e1e] leading-[16px]">**** **** **** 7711</p>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col gap-[8px]">
                <Row label="Subtotal" value={formatCOP(total)} />
                <Row label="Sin impuesto" value={formatCOP(0)} />
                <Row label={`${itemCount} productos`} value="" />
                <Row label="Total de la venta" value={`COP ${formatCOP(total)}`} bold />
              </div>
              <Divider />
              <div className="flex items-center">
                <p className="flex-1 font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969696] leading-[16px]">Detalle</p>
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[12px] text-[#969696] leading-[16px]">Pago sin contacto</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-[8px] items-center w-full">
            <button onClick={onNuevoCobro} className="bg-[#ff2947] h-[48px] rounded-[100px] w-full flex items-center justify-center cursor-pointer">
              <span className="font-['Montserrat:Bold',sans-serif] font-bold text-[14px] text-white leading-[20px]">Nuevo cobro</span>
            </button>
            <button className="flex items-center justify-center py-[12px] cursor-pointer">
              <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[12px] text-[#ff2947] underline leading-[16px]">Compartir</span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-[8px] items-center pb-[16px]">
            <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[14px] text-[#606060] leading-[20px] text-center">
              Si tienes dudas escríbenos a{" "}
              <span className="font-['Montserrat:Semibold',sans-serif] font-semibold text-[#121e6c] underline">soporte@bold.co</span>
            </p>
            <div className="flex flex-col items-center gap-[2px]">
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969bbd] leading-[16px]">Bold.co S.A.S NIT 901281572-4</p>
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#969bbd] leading-[16px]">www.bold.co</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

const SEED_PRODUCTS: Product[] = [
  { id: "example-1", name: "Botella de agua", price: "5.000", hasPhoto: true, photoType: "water-bottle", isExample: true },
  { id: "example-2", name: "Servicio de ejemplo", price: "50.000", isExample: true },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home-payments");
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cobroDefaultTab, setCobroDefaultTab] = useState<"monto" | "productos">("monto");
  const [cobroBackScreen, setCobroBackScreen] = useState<AppScreen>("home-productos");
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [celebrateFirst, setCelebrateFirst] = useState(false);
  const [lastCreated, setLastCreated] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formHasPhoto, setFormHasPhoto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleSave = (name: string, price: string, hasPhoto: boolean) => {
    if (editingProductId) {
      setProducts((prev) => prev.map((p) =>
        p.id === editingProductId ? { ...p, name, price, hasPhoto } : p
      ));
      const updated = { id: editingProductId, name, price, hasPhoto };
      setSelectedProduct(updated);
      setEditingProductId(null);
      setScreen("product-detail");
    } else {
      const isFirstReal = !products.some(p => !p.isExample);
      const product: Product = { id: Date.now().toString(), name, price, hasPhoto };
      setProducts((prev) => {
        const base = isFirstReal ? prev.filter(p => !p.isExample) : prev;
        return [...base, product];
      });
      setLastCreated(product);
      setCelebrateFirst(isFirstReal);
      setShowSuccess(true);
    }
  };

  const goToCreate = () => {
    setFormName("");
    setFormPrice("");
    setFormHasPhoto(false);
    setEditingProductId(null);
    setShowSuccess(false);
    setScreen("create-product");
  };

  const goToEdit = (product: Product) => {
    setFormName(product.name);
    setFormPrice(product.price);
    setFormHasPhoto(product.hasPhoto || false);
    setEditingProductId(product.id);
    setShowSuccess(false);
    setScreen("create-product");
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen("product-detail");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
    setScreen("tus-productos");
  };

  const navigateToCobro = (tab: "monto" | "productos", backScreen: AppScreen) => {
    setCobroDefaultTab(tab);
    setCobroBackScreen(backScreen);
    setScreen("cobro");
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: 'env(safe-area-inset-top, 0px)',
          bottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {screen === "home-payments" && (
          <HomePaymentsPage
            onProductosYServicios={() => setScreen("home-productos")}
            onCobrar={() => navigateToCobro("monto", "home-payments")}
          />
        )}
        {screen === "home-productos" && (
          <HomeProductosPage
            products={products}
            onBack={() => setScreen("home-payments")}
            onCreateProduct={goToCreate}
            onTusProductos={() => setScreen("tus-productos")}
            onCobrar={() => navigateToCobro("productos", "home-productos")}
          />
        )}
        {screen === "tus-productos" && (
          <TusProductosPage
            products={products}
            onBack={() => setScreen("home-productos")}
            onCreateProduct={goToCreate}
            onContinueToCobro={() => navigateToCobro("productos", "tus-productos")}
            onViewProduct={viewProduct}
          />
        )}
        {screen === "create-product" && (
          <>
            <CreateProductPage
              formName={formName}
              formPrice={formPrice}
              formHasPhoto={formHasPhoto}
              onNameChange={setFormName}
              onPriceChange={setFormPrice}
              onHasPhotoChange={setFormHasPhoto}
              onSave={handleSave}
              editMode={!!editingProductId}
              onBack={() => editingProductId ? setScreen("product-detail") : setScreen("tus-productos")}
              onClose={() => editingProductId ? setScreen("product-detail") : setScreen("tus-productos")}
            />
            {showSuccess && lastCreated && (
              <SuccessSheet
                product={lastCreated}
                celebrate={celebrateFirst}
                onContinue={() => { setShowSuccess(false); setCelebrateFirst(false); setScreen("tus-productos"); }}
                onCreateAnother={() => { setShowSuccess(false); setCelebrateFirst(false); setFormName(""); setFormPrice(""); setFormHasPhoto(false); }}
              />
            )}
          </>
        )}
        {screen === "product-detail" && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setScreen("tus-productos")}
            onEdit={() => goToEdit(selectedProduct)}
            onClose={() => setScreen("tus-productos")}
            onDelete={() => deleteProduct(selectedProduct.id)}
          />
        )}
        {screen === "cobro" && (
          <CobroPage
            products={products}
            onBack={() => setScreen(cobroBackScreen)}
            defaultTab={cobroDefaultTab}
            onCreateProduct={goToCreate}
            onCobrar={(items) => {
              setCheckoutItems(items);
              setScreen("cobro-productos");
            }}
          />
        )}
        {screen === "cobro-productos" && (
          <ProductosACobrarPage
            initialItems={checkoutItems}
            onBack={() => setScreen("cobro")}
            onClose={() => setScreen("cobro")}
            onContinue={(updatedItems) => {
              setCheckoutItems(updatedItems);
              setScreen("cobro-detalle");
            }}
          />
        )}
        {screen === "cobro-detalle" && (
          <DetallePage
            items={checkoutItems}
            onBack={() => setScreen("cobro-productos")}
            onCobrar={() => setScreen("cobro-medios")}
          />
        )}
        {screen === "cobro-medios" && (
          <MediosDePagoPage
            items={checkoutItems}
            onBack={() => setScreen("cobro-detalle")}
            onDatafono={() => setScreen("cobro-captura")}
          />
        )}
        {screen === "cobro-captura" && (
          <AcercaInsertaPage
            total={checkoutItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)}
            onCancel={() => setScreen("cobro-medios")}
            onSuccess={() => setScreen("cobro-exitoso")}
          />
        )}
        {screen === "cobro-exitoso" && (
          <CobroExitosoPage
            items={checkoutItems}
            onNuevoCobro={() => {
              setCheckoutItems([]);
              navigateToCobro("productos", "home-productos");
            }}
          />
        )}
      </div>
    </div>
  );
}

