import { useState, useCallback } from 'react';
import {
  ArrowLeft, CheckCircle2, MapPin, Clock, CreditCard, Link2,
  ChevronRight, Smartphone, CalendarOff, Star, Search, Plus,
  Minus, X, Scissors, Sparkles, Leaf, Navigation, Copy, Phone,
  Users,
} from 'lucide-react';
import { formatCOP, formatDuration } from '../data/appointments';
import { BOOKING_BRANCHES, type BookingBranch, type BookingService, type BookingProfessional } from '../data/bookingData';
import {
  store, getAvailableSlots, resolveProf as resolveStoreProf,
  addMinutes, PROTOTYPE_TODAY,
} from '../store/prototypeStore';
import type { Service, Appointment, Client } from '../types';

type BookingStep = 'branch-select' | 'landing' | 'professional' | 'datetime' | 'clientinfo' | 'payment' | 'confirmed';

type SelectedItems = Record<string, { service: BookingService; qty: number }>;

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function getNextDays(n: number): string[] {
  const days: string[] = [];
  const [y, m, d] = PROTOTYPE_TODAY.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  for (let i = 0; i < n; i++) {
    const nd = new Date(base);
    nd.setDate(base.getDate() + i);
    days.push(`${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`);
  }
  return days;
}

function isDayOff(dateStr: string): boolean {
  return new Date(dateStr + 'T12:00:00').getDay() === 0;
}

function formatBookingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
}

function formatPhone(p: string): string {
  const digits = p.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return `+57 ${digits}`;
  if (digits.length < 7) return `+57 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          color={i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </div>
  );
}

const CATEGORY_META: Record<string, { bg: string; color: string; Icon: typeof Scissors }> = {
  Corte: { bg: '#EEF0FB', color: '#121e6c', Icon: Scissors },
  Color: { bg: '#F5F3FF', color: '#7C3AED', Icon: Sparkles },
  Tratamientos: { bg: '#F0FDF4', color: '#15803D', Icon: Leaf },
  Uñas: { bg: '#FFF0F3', color: '#E8194B', Icon: Star },
  Barbería: { bg: '#FFFBEB', color: '#B45309', Icon: Scissors },
};

function ServiceCategoryIcon({ category, size = 20, boxSize = 48 }: { category: string; size?: number; boxSize?: number }) {
  const meta = CATEGORY_META[category] ?? { bg: '#f7f8fb', color: '#606060', Icon: Star };
  const { bg, color, Icon } = meta;
  return (
    <div
      className="flex items-center justify-center rounded-2xl shrink-0"
      style={{ width: boxSize, height: boxSize, backgroundColor: bg }}
    >
      <Icon size={size} color={color} strokeWidth={1.8} />
    </div>
  );
}

// Hero gradient div for branches (tasteful gradient placeholder)
function BranchHero({ branch, height = 200, children }: { branch: BookingBranch; height?: number; children?: React.ReactNode }) {
  return (
    <div
      className="relative w-full shrink-0 flex flex-col justify-end"
      style={{
        height,
        background: `linear-gradient(145deg, ${branch.heroFrom} 0%, ${branch.heroTo} 100%)`,
      }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.2) 0%, transparent 50%)',
      }} />
      {/* Large initial letter watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-black leading-none select-none pointer-events-none" style={{ fontSize: 120 }}>
        {branch.shortName[0]}
      </div>
      {children}
    </div>
  );
}

export function BookingSite() {
  const storeState = store.get();
  const storePolicy = storeState.bookingPolicy;

  const [step, setStep] = useState<BookingStep>('branch-select');
  const [selectedBranch, setSelectedBranch] = useState<BookingBranch | null>(null);
  const [activeTab, setActiveTab] = useState<'servicios' | 'detalles' | 'resenas'>('servicios');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [serviceDetail, setServiceDetail] = useState<BookingService | null>(null);
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [copyMsg, setCopyMsg] = useState(false);

  // Downstream booking state
  const [selectedProfId, setSelectedProfId] = useState<string | 'any'>('any');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [resolvedProfId, setResolvedProfId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCedula, setClientCedula] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'link' | null>(null);
  const [avismeMsgVisible, setAvismeMsgVisible] = useState(false);

  const days = getNextDays(14);

  // Derived
  const totalItems = Object.values(selectedItems).reduce((s, { qty }) => s + qty, 0);
  const totalPrice = Object.values(selectedItems).reduce((s, { service, qty }) => s + service.price * qty, 0);

  // First service for downstream booking slot calc (prototype simplification)
  const firstItem = Object.values(selectedItems)[0];
  const selectedServiceForFlow: Service | null = firstItem
    ? { id: firstItem.service.id, name: firstItem.service.name, duration: firstItem.service.duration, price: firstItem.service.price, requiresDeposit: firstItem.service.requiresDeposit }
    : null;

  const branchCategories = selectedBranch
    ? ['Todos', ...Array.from(new Set(selectedBranch.services.map(s => s.category)))]
    : [];

  const filteredServices = selectedBranch?.services.filter(svc => {
    const matchesSearch = !searchQuery || svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || svc.category === activeCategory;
    return matchesSearch && matchesCategory;
  }) ?? [];

  const resolvedProf = selectedBranch?.professionals.find(p => p.id === resolvedProfId)
    ?? storeState.professionals.find(p => p.id === resolvedProfId);

  function addService(svc: BookingService) {
    setSelectedItems(prev => ({
      ...prev,
      [svc.id]: { service: svc, qty: (prev[svc.id]?.qty ?? 0) + 1 },
    }));
  }

  function removeService(svcId: string) {
    setSelectedItems(prev => {
      const curr = prev[svcId];
      if (!curr || curr.qty <= 1) {
        const next = { ...prev };
        delete next[svcId];
        return next;
      }
      return { ...prev, [svcId]: { ...curr, qty: curr.qty - 1 } };
    });
  }

  function selectBranch(branch: BookingBranch) {
    setSelectedBranch(branch);
    setSelectedItems({});
    setActiveTab('servicios');
    setSearchQuery('');
    setActiveCategory('Todos');
    setStep('landing');
  }

  function goBack() {
    switch (step) {
      case 'landing': return setStep('branch-select');
      case 'professional': return setStep('landing');
      case 'datetime': return setStep('professional');
      case 'clientinfo': return setStep('datetime');
      case 'payment': return setStep('clientinfo');
      default: return;
    }
  }

  function goToReservar() {
    setSelectedProfId('any');
    setSelectedDate('');
    setSelectedTime('');
    setStep('professional');
  }

  function selectProf(profId: string | 'any') {
    setSelectedProfId(profId);
    setSelectedDate('');
    setSelectedTime('');
    setStep('datetime');
  }

  function selectDateTime(date: string, time: string) {
    setSelectedDate(date);
    setSelectedTime(time);
    const s = store.get();
    const profId = selectedProfId === 'any'
      ? resolveStoreProf(selectedServiceForFlow!, date, time, s.appointments, s.availabilityBlocks)
      : selectedProfId;
    setResolvedProfId(profId);
    setStep('clientinfo');
  }

  function validateClientInfo(): boolean {
    const errors: Record<string, string> = {};
    if (!clientName.trim()) errors.name = 'Campo requerido';
    if (clientPhone.replace(/\D/g, '').length < 10) errors.phone = 'Ingresa un número válido de 10 dígitos';
    if (!clientCedula.trim()) errors.cedula = 'Campo requerido';
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function submitClientInfo() {
    if (!validateClientInfo()) return;
    if (selectedServiceForFlow?.requiresDeposit) {
      setStep('payment');
    } else {
      finalizeBooking(null);
    }
  }

  const copyAddress = useCallback(() => {
    const addr = selectedBranch ? `${selectedBranch.address}, ${selectedBranch.neighborhood}` : '';
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopyMsg(true);
    setTimeout(() => setCopyMsg(false), 2000);
  }, [selectedBranch]);

  function finalizeBooking(method: 'card' | 'link' | null = null) {
    if (!selectedServiceForFlow) return;
    const s = store.get();
    const profId = selectedProfId === 'any'
      ? resolveStoreProf(selectedServiceForFlow, selectedDate, selectedTime, s.appointments, s.availabilityBlocks)
      : selectedProfId;
    setResolvedProfId(profId);

    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      professionalId: profId,
      serviceId: selectedServiceForFlow.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.replace(/\D/g, ''),
      clientCedula: clientCedula.trim(),
      date: selectedDate,
      startTime: selectedTime,
      status: 'confirmada',
      paymentStatus: selectedServiceForFlow.requiresDeposit ? 'pagado-anticipado' : 'pendiente',
      paymentMethod: selectedServiceForFlow.requiresDeposit ? 'anticipado' : undefined,
      policySnapshot: { cancellationWindowHours: s.bookingPolicy.cancellationWindowHours },
      originalPrice: selectedServiceForFlow.requiresDeposit ? selectedServiceForFlow.price : undefined,
    };

    const phone = clientPhone.replace(/\D/g, '');
    const updatedClients = [...s.clients];
    const existingIdx = updatedClients.findIndex(c => c.phone === phone || c.cedula === clientCedula.trim());
    if (existingIdx >= 0) {
      const ec = updatedClients[existingIdx];
      updatedClients[existingIdx] = { ...ec, visitCount: ec.visitCount + 1, lastVisit: selectedDate };
    } else {
      const newClient: Client = {
        id: `c_${Date.now()}`, name: clientName.trim(), phone, cedula: clientCedula.trim(),
        email: clientEmail.trim() || undefined, totalSpent: 0, visitCount: 1, lastVisit: selectedDate,
      };
      updatedClients.push(newClient);
    }

    store.set(prev => ({ ...prev, appointments: [...prev.appointments, newApt], clients: updatedClients }));
    if (method !== null) setPaymentMethod(method);
    setStep('confirmed');
  }

  function showAviseme() {
    setAvismeMsgVisible(true);
    setTimeout(() => setAvismeMsgVisible(false), 2500);
  }

  // Public booking disabled
  if (!storePolicy.publicBookingEnabled && step === 'branch-select') {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5 px-8" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(18,30,108,0.1)' }}>
          <CalendarOff size={28} color="#969696" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#121e6c]">Salón Camila</p>
          <p className="text-sm text-[#969696] mt-2 leading-relaxed">Las reservas en línea no están disponibles ahora. Contáctanos directamente.</p>
        </div>
        <a href={`tel:3101234567`} className="flex items-center gap-2 rounded-full px-6 h-12 font-bold text-sm text-white" style={{ backgroundColor: '#121e6c' }}>
          <Phone size={16} color="#fff" strokeWidth={2} />
          Llamar al salón
        </a>
      </div>
    );
  }

  // Step-level header (for steps after landing)
  const STEP_TITLES: Partial<Record<BookingStep, string>> = {
    professional: 'Elige tu profesional',
    datetime: 'Fecha y hora',
    clientinfo: 'Tus datos',
    payment: 'Pago anticipado',
    confirmed: '¡Reservado!',
  };

  const showGlobalHeader = !['branch-select', 'landing'].includes(step);
  const showBack = !['branch-select', 'landing', 'confirmed'].includes(step);

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f7f8fb' }}>

      {/* Global header for downstream steps */}
      {showGlobalHeader && (
        <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 shrink-0 border-b border-gray-100">
          {showBack && (
            <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:bg-gray-100 mr-1">
              <ArrowLeft size={18} color="#121e6c" strokeWidth={2} />
            </button>
          )}
          <h1 className="text-base font-bold text-[#121e6c]">{STEP_TITLES[step] ?? ''}</h1>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ══════════════════════════════════════════════════
            BRANCH SELECT
        ══════════════════════════════════════════════════ */}
        {step === 'branch-select' && (
          <div className="flex flex-col pb-10">
            {/* Top banner */}
            <div className="px-5 pt-8 pb-6 bg-white border-b border-gray-100">
              <p className="text-[11px] font-bold text-[#b0b5c8] uppercase tracking-widest mb-1">Reserva en línea</p>
              <h1 className="text-2xl font-black text-[#121e6c] leading-tight">Salón Camila</h1>
              <p className="text-sm text-[#969696] mt-1">Elige la sucursal más cercana a ti</p>
            </div>

            <div className="px-4 pt-5 flex flex-col gap-4">
              {BOOKING_BRANCHES.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => selectBranch(branch)}
                  className="w-full text-left rounded-3xl overflow-hidden bg-white transition-all active:scale-[0.98]"
                  style={{ boxShadow: '0px 2px 12px rgba(18,30,108,0.09)' }}
                >
                  {/* Hero */}
                  <BranchHero branch={branch} height={140} />
                  {/* Info */}
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-base font-black text-[#121e6c] leading-tight">{branch.name}</p>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" strokeWidth={1.5} />
                        <span className="text-xs font-bold text-[#1e1e1e]">{branch.rating}</span>
                        <span className="text-xs text-[#969696]">({branch.reviewCount})</span>
                      </div>
                    </div>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                      style={{ backgroundColor: '#EEF0FB', color: '#121e6c' }}>
                      {branch.category}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} color="#969696" strokeWidth={2} />
                      <p className="text-xs text-[#606060]">{branch.address} · {branch.neighborhood}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={12} color="#969696" strokeWidth={2} />
                      <p className="text-xs text-[#606060]">{branch.hours}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-[#969696]">{branch.services.length} servicios disponibles</span>
                      <div className="flex items-center gap-1 text-[#E8194B] text-xs font-bold">
                        Ver servicios <ChevronRight size={14} color="#E8194B" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            BRANCH LANDING
        ══════════════════════════════════════════════════ */}
        {step === 'landing' && selectedBranch && (
          <div className="flex flex-col min-h-full">
            {/* Hero + back */}
            <div className="relative shrink-0">
              <BranchHero branch={selectedBranch} height={200}>
                <button
                  onClick={goBack}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all active:opacity-70"
                  style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
                >
                  <ArrowLeft size={18} color="#fff" strokeWidth={2} />
                </button>
              </BranchHero>
            </div>

            {/* Branch info card */}
            <div className="bg-white px-5 pt-4 pb-0 shrink-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h1 className="text-xl font-black text-[#121e6c] leading-tight">{selectedBranch.name}</h1>
              </div>
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: '#EEF0FB', color: '#121e6c' }}>
                {selectedBranch.category}
              </span>
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin size={12} color="#969696" strokeWidth={2} />
                <p className="text-xs text-[#606060]">{selectedBranch.address} · {selectedBranch.neighborhood}</p>
              </div>

              {/* Stats row */}
              <div className="flex gap-0 border border-gray-100 rounded-2xl overflow-hidden mb-4">
                {[
                  { value: selectedBranch.rating.toFixed(1), label: 'Calificación' },
                  { value: String(selectedBranch.services.length), label: 'Servicios' },
                  { value: String(selectedBranch.reviewCount), label: 'Reseñas' },
                ].map(({ value, label }, i, arr) => (
                  <div key={label} className="flex-1 flex flex-col items-center py-3"
                    style={{ borderRight: i < arr.length - 1 ? '1px solid #f0f0f4' : 'none' }}>
                    <span className="text-lg font-black text-[#121e6c] leading-none">{value}</span>
                    <span className="text-[10px] text-[#969696] mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-gray-100 -mx-5 px-5">
                {(['servicios', 'detalles', 'resenas'] as const).map(tab => {
                  const labels = { servicios: 'Servicios', detalles: 'Detalles', resenas: 'Reseñas' };
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-2.5 text-sm font-bold transition-colors relative"
                      style={{ color: isActive ? '#121e6c' : '#969696' }}
                    >
                      {labels[tab]}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full" style={{ backgroundColor: '#E8194B' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 min-h-0 overflow-y-auto">

              {/* ── Servicios tab ─────────────────────────────── */}
              {activeTab === 'servicios' && (
                <div className="pb-40">
                  {/* Search */}
                  <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-gray-100">
                      <Search size={15} color="#969696" strokeWidth={2} />
                      <input
                        type="text"
                        placeholder="Buscar servicio…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 text-sm text-[#1e1e1e] outline-none bg-transparent placeholder-[#b0b5c8]"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')}>
                          <X size={14} color="#969696" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category chips */}
                  <div className="flex gap-2 overflow-x-auto py-2 px-4" style={{ scrollbarWidth: 'none' }}>
                    {branchCategories.map(cat => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold border transition-all active:opacity-70"
                          style={{
                            backgroundColor: isActive ? '#121e6c' : '#fff',
                            color: isActive ? '#fff' : '#606060',
                            borderColor: isActive ? '#121e6c' : '#d2d4e1',
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                    <div className="w-2 shrink-0" />
                  </div>

                  {/* Service list */}
                  <div className="px-4 flex flex-col gap-3 pt-1">
                    {filteredServices.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-sm font-semibold text-[#121e6c]">Sin resultados</p>
                        <p className="text-xs text-[#969696] mt-1">Intenta con otro término</p>
                      </div>
                    ) : (
                      filteredServices.map(svc => {
                        const qty = selectedItems[svc.id]?.qty ?? 0;
                        const isSelected = qty > 0;
                        return (
                          <div
                            key={svc.id}
                            className="bg-white rounded-2xl overflow-hidden transition-all"
                            style={{
                              border: isSelected ? '2px solid #E8194B' : '1.5px solid #f0f0f4',
                              boxShadow: '0px 1px 4px rgba(18,30,108,0.05)',
                            }}
                          >
                            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                              <ServiceCategoryIcon category={svc.category} size={22} boxSize={52} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#1e1e1e] leading-snug">{svc.name}</p>
                                <p className="text-xs text-[#969696] mt-0.5 leading-snug line-clamp-2">{svc.description}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className="text-xs text-[#b0b5c8]">{formatDuration(svc.duration)}</span>
                                  <span className="text-xs font-bold text-[#121e6c]">{formatCOP(svc.price)}</span>
                                  {svc.requiresDeposit && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{ backgroundColor: '#F0FDFA', color: '#0D9488' }}>
                                      Pago anticipado
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Footer: Ver más + stepper */}
                            <div className="flex items-center justify-between px-4 pb-3">
                              <button
                                onClick={() => setServiceDetail(svc)}
                                className="text-xs font-semibold transition-opacity active:opacity-60"
                                style={{ color: '#121e6c' }}
                              >
                                Ver más →
                              </button>
                              {isSelected ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => removeService(svc.id)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:opacity-70"
                                    style={{ backgroundColor: '#f7f8fb', border: '1.5px solid #d2d4e1' }}
                                  >
                                    <Minus size={14} color="#121e6c" strokeWidth={2.5} />
                                  </button>
                                  <span className="w-6 text-center text-sm font-bold text-[#121e6c] tabular-nums">{qty}</span>
                                  <button
                                    onClick={() => addService(svc)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:opacity-70"
                                    style={{ backgroundColor: '#E8194B' }}
                                  >
                                    <Plus size={14} color="#fff" strokeWidth={2.5} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addService(svc)}
                                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:opacity-70"
                                  style={{ backgroundColor: '#E8194B' }}
                                >
                                  <Plus size={14} color="#fff" strokeWidth={2.5} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ── Detalles tab ───────────────────────────────── */}
              {activeTab === 'detalles' && (
                <div className="px-4 pt-4 pb-20 flex flex-col gap-3">
                  {/* Address card */}
                  <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-3" style={{ border: '1.5px solid #f0f0f4' }}>
                    <p className="text-xs font-bold text-[#b0b5c8] uppercase tracking-widest">Dirección</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} color="#E8194B" strokeWidth={2} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-[#1e1e1e]">{selectedBranch.address}</p>
                        <p className="text-xs text-[#969696]">{selectedBranch.neighborhood}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyAddress}
                        className="flex items-center gap-1.5 flex-1 h-9 rounded-xl justify-center text-xs font-semibold border transition-all active:opacity-70"
                        style={{ borderColor: '#d2d4e1', color: '#606060', backgroundColor: '#f7f8fb' }}
                      >
                        <Copy size={13} color="#606060" strokeWidth={2} />
                        {copyMsg ? '¡Copiado!' : 'Copiar dirección'}
                      </button>
                      <button
                        onClick={() => setShowNavSheet(true)}
                        className="flex items-center gap-1.5 flex-1 h-9 rounded-xl justify-center text-xs font-bold transition-all active:opacity-70"
                        style={{ backgroundColor: '#121e6c', color: '#fff' }}
                      >
                        <Navigation size={13} color="#fff" strokeWidth={2} />
                        Abrir en Maps
                      </button>
                    </div>
                  </div>

                  {/* Hours card */}
                  <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-2" style={{ border: '1.5px solid #f0f0f4' }}>
                    <p className="text-xs font-bold text-[#b0b5c8] uppercase tracking-widest mb-1">Horario</p>
                    <div className="flex items-center gap-2">
                      <Clock size={15} color="#E8194B" strokeWidth={2} />
                      <p className="text-sm font-semibold text-[#1e1e1e]">{selectedBranch.hours}</p>
                    </div>
                    <p className="text-xs text-[#969696]">Domingo: Cerrado</p>
                  </div>

                  {/* Contact card */}
                  <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-2" style={{ border: '1.5px solid #f0f0f4' }}>
                    <p className="text-xs font-bold text-[#b0b5c8] uppercase tracking-widest mb-1">Contacto</p>
                    <a
                      href={`tel:${selectedBranch.phone}`}
                      className="flex items-center gap-2 h-10 active:opacity-70"
                    >
                      <Phone size={15} color="#E8194B" strokeWidth={2} />
                      <span className="text-sm font-semibold text-[#121e6c]">{formatPhone(selectedBranch.phone)}</span>
                    </a>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-2xl px-4 py-4" style={{ border: '1.5px solid #f0f0f4' }}>
                    <p className="text-xs font-bold text-[#b0b5c8] uppercase tracking-widest mb-2">Sobre nosotros</p>
                    <p className="text-sm text-[#606060] leading-relaxed">{selectedBranch.description}</p>
                  </div>
                </div>
              )}

              {/* ── Reseñas tab ────────────────────────────────── */}
              {activeTab === 'resenas' && (
                <div className="px-4 pt-4 pb-20 flex flex-col gap-3">
                  {/* Summary */}
                  <div className="bg-white rounded-2xl px-4 py-4 flex items-center gap-5" style={{ border: '1.5px solid #f0f0f4' }}>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-black text-[#121e6c] leading-none">{selectedBranch.rating.toFixed(1)}</span>
                      <StarRow rating={selectedBranch.rating} size={14} />
                      <span className="text-[11px] text-[#969696] mt-1">{selectedBranch.reviewCount} reseñas</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      {[5, 4, 3].map(n => {
                        const pct = n === 5 ? 72 : n === 4 ? 20 : 8;
                        return (
                          <div key={n} className="flex items-center gap-2">
                            <span className="text-[10px] text-[#969696] w-2 shrink-0">{n}</span>
                            <Star size={10} fill="#F59E0B" color="#F59E0B" strokeWidth={1} />
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0f0f4' }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#F59E0B' }} />
                            </div>
                            <span className="text-[10px] text-[#b0b5c8] w-5 text-right shrink-0">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review list */}
                  {selectedBranch.reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-2xl px-4 py-4" style={{ border: '1.5px solid #f0f0f4' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-bold text-[#1e1e1e]">{review.clientName}</p>
                        <span className="text-[11px] text-[#b0b5c8]">{review.date}</span>
                      </div>
                      <StarRow rating={review.rating} size={11} />
                      {review.serviceName && (
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 mb-1"
                          style={{ backgroundColor: '#EEF0FB', color: '#121e6c' }}>
                          {review.serviceName}
                        </span>
                      )}
                      <p className="text-sm text-[#606060] leading-relaxed mt-1.5">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Bottom summary bar ─────────────────────────── */}
            {totalItems > 0 && (
              <div
                className="absolute left-0 right-0 bottom-0 px-4 pt-3 pb-6 bg-white border-t border-gray-100 flex items-center gap-3"
                style={{ boxShadow: '0px -4px 16px rgba(18,30,108,0.08)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#969696]">
                    {totalItems} {totalItems === 1 ? 'servicio' : 'servicios'} seleccionado{totalItems !== 1 ? 's' : ''}
                  </p>
                  <p className="text-base font-black text-[#121e6c] leading-tight tabular-nums">{formatCOP(totalPrice)}</p>
                </div>
                <button
                  onClick={goToReservar}
                  className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-sm text-white transition-all active:scale-[0.97]"
                  style={{ backgroundColor: '#E8194B' }}
                >
                  Reservar <ChevronRight size={16} color="#fff" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            PROFESSIONAL SELECTION
        ══════════════════════════════════════════════════ */}
        {step === 'professional' && selectedBranch && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-3">
            {/* Selected services summary */}
            <div className="flex flex-col gap-1.5">
              {Object.values(selectedItems).map(({ service, qty }) => (
                <div key={service.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5"
                  style={{ border: '1.5px solid #f0f0f4' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <ServiceCategoryIcon category={service.category} size={14} boxSize={28} />
                    <span className="text-sm font-semibold text-[#121e6c] truncate">{service.name}</span>
                    {qty > 1 && <span className="text-xs text-[#E8194B] font-bold shrink-0">×{qty}</span>}
                  </div>
                  <span className="text-sm font-bold text-[#969696] tabular-nums shrink-0">{formatCOP(service.price * qty)}</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mt-1">¿Con quién quieres tu cita?</p>

            {/* Cualquiera */}
            <button
              onClick={() => selectProf('any')}
              className="w-full bg-white rounded-2xl px-4 py-4 text-left flex items-center gap-3 transition-all active:opacity-70"
              style={{ border: '1.5px solid #f0f0f4' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#EEF0FB' }}>
                <Users size={20} color="#121e6c" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1e1e1e]">Cualquiera disponible</p>
                <p className="text-xs text-[#969696] mt-0.5">Te asignamos al profesional con el mejor horario</p>
              </div>
              <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
            </button>

            {/* Professional cards */}
            {selectedBranch.professionals.map(prof => (
              <ProfessionalCard key={prof.id} prof={prof} onSelect={() => selectProf(prof.id)} />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            DATETIME
        ══════════════════════════════════════════════════ */}
        {step === 'datetime' && selectedServiceForFlow && (
          <div className="flex flex-col pb-20">
            <div className="overflow-x-auto py-4 px-4" style={{ scrollbarWidth: 'none' }}>
              <div className="flex gap-2 w-max">
                {days.map(dateStr => {
                  const d = new Date(dateStr + 'T12:00:00');
                  const isSelected = dateStr === selectedDate;
                  const isOff = isDayOff(dateStr);
                  return (
                    <button
                      key={dateStr}
                      onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                      disabled={isOff}
                      className="flex flex-col items-center gap-1 py-2 w-12 rounded-2xl transition-all active:opacity-70"
                      style={{
                        backgroundColor: isSelected ? '#121e6c' : '#fff',
                        opacity: isOff ? 0.35 : 1,
                        border: isSelected ? '2px solid #121e6c' : '2px solid #e8eaf0',
                      }}
                    >
                      <span className="text-[10px] font-semibold leading-none" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#969696' }}>
                        {WEEKDAY_SHORT[d.getDay()]}
                      </span>
                      <span className="text-sm font-bold leading-none" style={{ color: isSelected ? '#fff' : '#121e6c' }}>
                        {d.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate ? (
              <div className="px-4">
                {(() => {
                  const s = store.get();
                  const slots = getAvailableSlots(selectedServiceForFlow, selectedDate, selectedProfId, s.appointments, s.availabilityBlocks);
                  if (slots.length === 0) {
                    return (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <p className="text-sm font-semibold text-[#121e6c] text-center">No hay horarios disponibles</p>
                        <p className="text-xs text-[#969696] text-center max-w-[240px]">
                          {isDayOff(selectedDate) ? 'El salón no trabaja los domingos.' : 'No hay horarios libres. Elige otra fecha.'}
                        </p>
                        <button onClick={showAviseme} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-all active:opacity-70"
                          style={{ borderColor: '#121e6c', color: '#121e6c', backgroundColor: '#fff' }}>
                          <Smartphone size={14} color="#121e6c" strokeWidth={2} />
                          Avísame cuando haya disponibilidad
                        </button>
                        {avismeMsgVisible && (
                          <div className="text-xs font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>
                            ¡Te avisaremos por WhatsApp!
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <>
                      <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Horarios disponibles</p>
                      <div className="flex flex-wrap gap-2">
                        {slots.map(slot => {
                          const isSel = slot === selectedTime;
                          return (
                            <button key={slot} onClick={() => selectDateTime(selectedDate, slot)}
                              className="w-[calc(33.333%-6px)] h-10 rounded-xl text-sm font-semibold border-2 transition-all active:opacity-70"
                              style={{ backgroundColor: isSel ? '#121e6c' : '#fff', color: isSel ? '#fff' : '#121e6c', borderColor: isSel ? '#121e6c' : '#e8eaf0' }}>
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="px-4">
                <p className="text-sm text-[#969696] text-center py-8">Selecciona una fecha para ver horarios</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CLIENT INFO
        ══════════════════════════════════════════════════ */}
        {step === 'clientinfo' && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-4">
            {selectedServiceForFlow && selectedDate && selectedTime && (
              <div className="bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                <p className="text-xs font-semibold text-[#121e6c]">{selectedServiceForFlow.name}</p>
                <p className="text-xs text-[#969696] mt-0.5">{formatBookingDate(selectedDate)} · {selectedTime}</p>
              </div>
            )}
            {([
              { key: 'name', label: 'Nombre completo', value: clientName, onChange: setClientName, type: 'text', placeholder: 'Tu nombre completo', required: true },
              { key: 'phone', label: 'Teléfono de contacto', value: clientPhone, onChange: setClientPhone, type: 'tel', placeholder: '3001234567', required: true },
              { key: 'cedula', label: 'Número de cédula', value: clientCedula, onChange: setClientCedula, type: 'number', placeholder: '12345678', required: true },
              { key: 'email', label: 'Email (opcional)', value: clientEmail, onChange: setClientEmail, type: 'email', placeholder: 'tucorreo@gmail.com', required: false },
            ] as const).map(({ key, label, value, onChange, type, placeholder, required }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#606060]">
                  {label}{required && <span style={{ color: '#E8194B' }}> *</span>}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-11 rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none transition-colors"
                  style={{ borderColor: clientErrors[key] ? '#E8194B' : '#d2d4e1', backgroundColor: '#fff' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#121e6c'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = clientErrors[key] ? '#E8194B' : '#d2d4e1'; }}
                />
                {clientErrors[key] && <p className="text-xs" style={{ color: '#E8194B' }}>{clientErrors[key]}</p>}
              </div>
            ))}
            <button onClick={submitClientInfo} className="w-full h-12 rounded-full font-bold text-sm text-white mt-2 transition-all active:scale-[0.98]" style={{ backgroundColor: '#E8194B' }}>
              Continuar
            </button>
            <p className="text-[11px] text-[#b0b5c8] text-center leading-relaxed">
              Al continuar aceptas los términos del servicio y la política de privacidad del salón.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            PAYMENT
        ══════════════════════════════════════════════════ */}
        {step === 'payment' && selectedServiceForFlow && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-4">
            <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 border border-gray-100">
              <p className="text-sm font-bold text-[#1e1e1e]">{selectedServiceForFlow.name}</p>
              <p className="text-2xl font-bold text-[#121e6c] tabular-nums mt-1">{formatCOP(selectedServiceForFlow.price)}</p>
            </div>
            <div className="bg-[#FFFBEB] rounded-xl px-4 py-3">
              <p className="text-xs text-[#B45309] leading-relaxed">Este servicio requiere pago anticipado para confirmar la reserva.</p>
            </div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">Elige tu método de pago</p>
            {([
              { method: 'card' as const, label: 'Tarjeta · Checkout Bold', sub: 'Débito o crédito', Icon: CreditCard },
              { method: 'link' as const, label: 'Link de pago', sub: 'Recibirás un link por WhatsApp', Icon: Link2 },
            ]).map(({ method, label, sub, Icon }) => (
              <button key={method} onClick={() => finalizeBooking(method)}
                className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-4 text-left transition-all active:opacity-70">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#EEF0FB' }}>
                  <Icon size={18} color="#121e6c" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1e1e1e]">{label}</p>
                  <p className="text-xs text-[#969696] mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
              </button>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CONFIRMED
        ══════════════════════════════════════════════════ */}
        {step === 'confirmed' && selectedServiceForFlow && selectedDate && selectedTime && (
          <div className="px-4 pt-8 pb-20 flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircle2 size={32} color="#15803D" strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#1e1e1e]">¡Reserva confirmada!</p>
              <p className="text-sm text-[#969696] mt-1.5 leading-relaxed max-w-[280px]">
                Enviamos una confirmación a tu WhatsApp. Desde ese mensaje puedes consultar, reprogramar o cancelar tu cita.
              </p>
            </div>
            <div className="w-full bg-white rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100" style={{ boxShadow: '0px 2px 8px rgba(18,30,108,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#121e6c' }}>
                  <span className="text-sm font-bold text-white">
                    {(selectedBranch?.professionals.find(p => p.id === resolvedProfId) ?? storeState.professionals.find(p => p.id === resolvedProfId))?.initials ?? 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1e1e1e]">{selectedServiceForFlow.name}</p>
                  <p className="text-xs text-[#969696] mt-0.5">{resolvedProf?.name ?? 'Profesional asignada'}</p>
                </div>
                <p className="ml-auto text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(selectedServiceForFlow.price)}</p>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Fecha</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">{formatBookingDate(selectedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Hora</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">{selectedTime} – {addMinutes(selectedTime, selectedServiceForFlow.duration)}</span>
                </div>
                {selectedBranch && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Lugar</span>
                    <span className="text-xs font-semibold text-[#1e1e1e]">{selectedBranch.address}, {selectedBranch.neighborhood}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Cliente</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">{clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">WhatsApp</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">{formatPhone(clientPhone)}</span>
                </div>
                {paymentMethod && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Pago</span>
                    <span className="text-xs font-semibold" style={{ color: '#0D9488' }}>Prepagado · {formatCOP(selectedServiceForFlow.price)}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setStep('branch-select');
                setSelectedBranch(null);
                setSelectedItems({});
                setSelectedDate('');
                setSelectedTime('');
                setClientName(''); setClientPhone(''); setClientCedula(''); setClientEmail('');
                setPaymentMethod(null);
              }}
              className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#121e6c' }}
            >
              Listo
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          SERVICE DETAIL BOTTOM SHEET
      ══════════════════════════════════════════════════ */}
      {serviceDetail && (
        <div className="absolute inset-0" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setServiceDetail(null)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl flex flex-col max-h-[85%]">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0">
              <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 12 }} />
              <div className="w-6" />
              <div className="flex-1" />
              <button onClick={() => setServiceDetail(null)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
                <X size={16} color="#606060" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-2 pt-3">
              {/* Icon */}
              <ServiceCategoryIcon category={serviceDetail.category} size={28} boxSize={72} />

              {/* Name + category */}
              <h2 className="text-xl font-black text-[#121e6c] mt-4 mb-1 leading-tight">{serviceDetail.name}</h2>
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-4"
                style={{ backgroundColor: CATEGORY_META[serviceDetail.category]?.bg ?? '#f7f8fb', color: CATEGORY_META[serviceDetail.category]?.color ?? '#606060' }}>
                {serviceDetail.category}
              </span>

              {/* Description */}
              <p className="text-sm text-[#606060] leading-relaxed mb-5">{serviceDetail.description}</p>

              {/* Duration + price row */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-[#f7f8fb] rounded-xl px-3 py-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock size={13} color="#969696" strokeWidth={2} />
                    <span className="text-[10px] text-[#969696] font-semibold uppercase tracking-wide">Duración</span>
                  </div>
                  <p className="text-sm font-bold text-[#1e1e1e]">{formatDuration(serviceDetail.duration)}</p>
                </div>
                <div className="flex-1 bg-[#f7f8fb] rounded-xl px-3 py-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-[#969696] font-semibold uppercase tracking-wide">Precio</span>
                  </div>
                  <p className="text-sm font-bold text-[#121e6c]">{formatCOP(serviceDetail.price)}</p>
                </div>
              </div>

              {/* Deposit note */}
              {serviceDetail.requiresDeposit && (
                <div className="bg-[#FFFBEB] rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-[#B45309] leading-relaxed font-medium">
                    Este servicio requiere <strong>pago anticipado</strong> al confirmar la reserva. El monto se aplica al valor final del servicio.
                  </p>
                </div>
              )}
            </div>

            {/* CTA footer */}
            <div className="px-5 pt-3 pb-7 border-t border-gray-100 shrink-0">
              {(() => {
                const qty = selectedItems[serviceDetail.id]?.qty ?? 0;
                if (qty > 0) {
                  return (
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeService(serviceDetail.id)}
                        className="w-12 h-12 rounded-full flex items-center justify-center border transition-all active:opacity-70"
                        style={{ borderColor: '#d2d4e1', backgroundColor: '#f7f8fb' }}>
                        <Minus size={18} color="#121e6c" strokeWidth={2.5} />
                      </button>
                      <span className="flex-1 text-center text-lg font-black text-[#121e6c] tabular-nums">{qty} agregado{qty !== 1 ? 's' : ''}</span>
                      <button onClick={() => addService(serviceDetail)}
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:opacity-70"
                        style={{ backgroundColor: '#E8194B' }}>
                        <Plus size={18} color="#fff" strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    onClick={() => { addService(serviceDetail); setServiceDetail(null); }}
                    className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: '#E8194B' }}
                  >
                    Agregar al reserva
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          NAVIGATION SHEET (Maps / Waze)
      ══════════════════════════════════════════════════ */}
      {showNavSheet && selectedBranch && (
        <div className="absolute inset-0" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNavSheet(false)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Abrir navegación</p>
            <p className="text-sm text-[#606060] mb-4">{selectedBranch.address}, {selectedBranch.neighborhood}</p>
            {[
              { label: 'Google Maps', sub: 'Abre en Google Maps', color: '#4285F4', onClick: () => setShowNavSheet(false) },
              { label: 'Waze', sub: 'Abre en Waze', color: '#33CCFF', onClick: () => setShowNavSheet(false) },
            ].map(({ label, sub, color, onClick }) => (
              <button key={label} onClick={onClick}
                className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0 active:opacity-70">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: color }}>
                  <Navigation size={18} color="#fff" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1e1e1e]">{label}</p>
                  <p className="text-xs text-[#969696]">{sub}</p>
                </div>
                <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} className="ml-auto" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Professional card (extracted to avoid repetition) ──────────────────────
function ProfessionalCard({ prof, onSelect }: { prof: BookingProfessional; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full bg-white rounded-2xl px-4 py-4 text-left flex items-start gap-3 transition-all active:opacity-70"
      style={{ border: '1.5px solid #f0f0f4' }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
        style={{ backgroundColor: prof.color }}
      >
        {prof.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#1e1e1e]">{prof.name}</p>
          {prof.available && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>
              Disponible
            </span>
          )}
        </div>
        <p className="text-xs text-[#969696] mt-0.5">{prof.role}</p>
        <p className="text-xs text-[#b0b5c8] mt-0.5 truncate">{prof.specialty}</p>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <StarRow rating={prof.rating} size={11} />
            <span className="text-xs font-bold text-[#1e1e1e] ml-0.5">{prof.rating}</span>
            <span className="text-[11px] text-[#969696]">({prof.reviewCount})</span>
          </div>
          <span className="text-[11px] text-[#b0b5c8]">{prof.yearsExp} años de exp.</span>
        </div>
      </div>

      <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} className="shrink-0 mt-1" />
    </button>
  );
}
