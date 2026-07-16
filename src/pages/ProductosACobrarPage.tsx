import { useState } from "react";
import type { CheckoutItem } from "../types";
import { formatCOP } from "../utils/format";
import { StatusBar } from "../components/StatusBar";
import { BackButton } from "../components/BackButton";
import { CloseXButton } from "../components/CloseXButton";
import { ShoppingBagIllustration } from "../components/ShoppingBagIllustration";
import { WaterBottleIllustration } from "../components/WaterBottleIllustration";

export function ProductosACobrarPage({
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
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[14px] text-[#1e1e1e] leading-[20px] whitespace-nowrap">{formatCOP(item.unitPrice)}</p>
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
