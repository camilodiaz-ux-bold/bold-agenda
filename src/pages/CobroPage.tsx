import { useState } from "react";
import type { Product, CheckoutItem } from "../types";
import { formatCOP } from "../utils/format";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { PieChart } from "../components/PieChart";
import { ProductPhoto } from "../components/ProductPhoto";

export function CobroPage({
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

      {/* Header */}
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

      {/* TAB MONTO */}
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

      {/* TAB PRODUCTOS */}
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

              {/* Product list */}
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
                    <div className="relative shrink-0">
                      <div className="size-[72px] rounded-[12px] overflow-hidden">
                        <div className="size-full">
                          <ProductPhoto product={p} size={72} />
                        </div>
                      </div>
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

                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0 pt-[4px]">
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#1e1e1e] leading-[16px]">{p.name}</p>

                      {isSelected ? (
                        <>
                          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px] whitespace-nowrap">
                            {formatCOP(totalLine)} &nbsp;({qty} un)
                          </p>
                          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] whitespace-nowrap">
                            {formatCOP(unitPrice)}
                          </p>
                          <div className="flex items-center justify-between w-full">
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

      {/* Editar precio drop-up */}
      {editingPriceFor && (
        <div className="absolute inset-0 flex flex-col justify-end z-50" style={{ background: "rgba(30,30,30,0.7)" }}>
          <div className="bg-white rounded-tl-[32px] rounded-tr-[32px] flex flex-col gap-[24px] px-[16px] py-[12px]">
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
            <div className="flex flex-col gap-[8px]">
              <input
                type="number"
                value={editPriceInput}
                onChange={e => setEditPriceInput(e.target.value)}
                className="bg-[#f7f8fb] h-[40px] rounded-[12px] pl-[12px] font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] outline-none w-full"
              />
              <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-[#606060] leading-[16px]">IVA (5%) incluido en el precio unitario</p>
            </div>
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
