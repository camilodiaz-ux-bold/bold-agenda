import { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, MapPin, Clock, CreditCard, Link2,
  ChevronRight, Smartphone,
} from 'lucide-react';
import { PROFESSIONALS, SERVICES, APPOINTMENTS, SALON, formatCOP, formatDuration } from '../data/appointments';
import type { Service } from '../types';

type BookingStep = 'landing' | 'professional' | 'datetime' | 'clientinfo' | 'otp' | 'payment' | 'confirmed';

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function getNextDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${day}`);
  }
  return days;
}

function isDayOff(dateStr: string): boolean {
  return new Date(dateStr + 'T12:00:00').getDay() === 0;
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

function addMinutes(time: string, duration: number): string {
  return minToTime(timeToMin(time) + duration);
}

function getSlotsForProf(service: Service, date: string, profId: string): string[] {
  const START = 8 * 60;
  const END = 19 * 60;
  const slots: string[] = [];
  for (let m = START; m + service.duration <= END; m += 30) {
    slots.push(minToTime(m));
  }
  const busy = APPOINTMENTS.filter(a => a.date === date && a.professionalId === profId && a.status !== 'no-show');
  return slots.filter(slot => {
    const sStart = timeToMin(slot);
    const sEnd = sStart + service.duration;
    return !busy.some(a => {
      const svc = SERVICES.find(s => s.id === a.serviceId)!;
      const aStart = timeToMin(a.startTime);
      const aEnd = aStart + svc.duration;
      return sStart < aEnd && sEnd > aStart;
    });
  });
}

function getAvailableSlots(service: Service, date: string, profId: string | 'any'): string[] {
  if (isDayOff(date)) return [];
  if (profId !== 'any') return getSlotsForProf(service, date, profId);
  const all = new Set<string>();
  PROFESSIONALS.forEach(p => getSlotsForProf(service, date, p.id).forEach(s => all.add(s)));
  return [...all].sort();
}

function resolveProf(service: Service, date: string, time: string): string {
  for (const prof of PROFESSIONALS) {
    if (getSlotsForProf(service, date, prof.id).includes(time)) return prof.id;
  }
  return PROFESSIONALS[0].id;
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

const STEP_TITLES: Partial<Record<BookingStep, string>> = {
  professional: 'Elige tu profesional',
  datetime: 'Fecha y hora',
  clientinfo: 'Tus datos',
  otp: 'Verificación',
  payment: 'Pago anticipado',
  confirmed: '¡Reservado!',
};

export function BookingSite() {
  const [step, setStep] = useState<BookingStep>('landing');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfId, setSelectedProfId] = useState<string | 'any'>('any');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [resolvedProfId, setResolvedProfId] = useState('');

  // Client info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCedula, setClientCedula] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // OTP
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'link' | null>(null);

  // Avísame toast
  const [avismeMsgVisible, setAvismeMsgVisible] = useState(false);

  const days = getNextDays(14);

  useEffect(() => {
    if (step !== 'otp' || otpCountdown <= 0) return;
    const id = setInterval(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [step, otpCountdown]);

  function goBack() {
    switch (step) {
      case 'professional': return setStep('landing');
      case 'datetime': return setStep('professional');
      case 'clientinfo': return setStep('datetime');
      case 'otp': return setStep('clientinfo');
      case 'payment': return setStep('otp');
      default: return;
    }
  }

  function selectService(svc: Service) {
    setSelectedService(svc);
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
    const resolved = selectedProfId === 'any'
      ? resolveProf(selectedService!, date, time)
      : selectedProfId;
    setResolvedProfId(resolved);
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
    if (validateClientInfo()) {
      setOtpValue('');
      setOtpError('');
      setOtpCountdown(30);
      setStep('otp');
    }
  }

  function submitOtp() {
    if (otpValue === '123456') {
      if (selectedService?.requiresDeposit) {
        setStep('payment');
      } else {
        setStep('confirmed');
      }
    } else {
      setOtpError('Código incorrecto. Intenta de nuevo.');
    }
  }

  function submitPayment(method: 'card' | 'link') {
    setPaymentMethod(method);
    setStep('confirmed');
  }

  function showAviseme() {
    setAvismeMsgVisible(true);
    setTimeout(() => setAvismeMsgVisible(false), 2500);
  }

  const resolvedProf = PROFESSIONALS.find(p => p.id === resolvedProfId);

  // ── Header ─────────────────────────────────────────────────────────────────
  const showHeader = step !== 'landing';
  const showBack = step !== 'confirmed' && step !== 'landing';

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#f7f8fb' }}>
      {/* Step header */}
      {showHeader && (
        <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 flex-shrink-0 border-b border-gray-100">
          {showBack && (
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:bg-gray-100 mr-1"
            >
              <ArrowLeft size={18} color="#121e6c" strokeWidth={2} />
            </button>
          )}
          <h1 className="text-base font-bold text-[#121e6c]">
            {STEP_TITLES[step] ?? ''}
          </h1>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── LANDING ─────────────────────────────────────────────────────── */}
        {step === 'landing' && (
          <div className="flex flex-col">
            {/* Salon hero */}
            <div className="px-5 pt-6 pb-5" style={{ backgroundColor: '#121e6c' }}>
              <h1 className="text-2xl font-bold text-white leading-tight">{SALON.name}</h1>
              <div className="flex items-center gap-1.5 mt-2">
                <MapPin size={13} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                <p className="text-xs text-white/60">{SALON.address}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={13} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                <p className="text-xs text-white/60">{SALON.schedule}</p>
              </div>
            </div>

            <div className="px-4 pt-5 pb-20 flex flex-col gap-3">
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">Servicios disponibles</p>
              {SERVICES.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => selectService(svc)}
                  className="w-full bg-white rounded-2xl px-4 py-4 text-left flex items-center gap-4 border border-gray-100 transition-all active:opacity-70"
                  style={{ boxShadow: '0px 1px 4px rgba(18,30,108,0.05)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#1e1e1e]">{svc.name}</p>
                      <p className="text-sm font-bold text-[#121e6c] tabular-nums shrink-0">
                        {formatCOP(svc.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#969696]">{formatDuration(svc.duration)}</span>
                      {svc.requiresDeposit && (
                        <span className="text-[10px] font-semibold text-[#0D9488] bg-[#F0FDFA] px-2 py-0.5 rounded-full">
                          Pago anticipado
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PROFESSIONAL ────────────────────────────────────────────────── */}
        {step === 'professional' && selectedService && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-3">
            {/* Service context chip */}
            <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between border border-gray-100">
              <span className="text-sm font-bold text-[#121e6c]">{selectedService.name}</span>
              <span className="text-sm font-semibold text-[#969696] tabular-nums">
                {formatCOP(selectedService.price)}
              </span>
            </div>

            {/* Cualquiera option */}
            <button
              onClick={() => selectProf('any')}
              className="w-full bg-white rounded-2xl px-4 py-4 text-left flex items-center gap-3 border-2 border-gray-100 transition-all active:opacity-70"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#e8eaf0' }}
              >
                <span className="text-sm font-bold" style={{ color: '#606060' }}>★</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1e1e1e]">Cualquiera</p>
                <p className="text-xs text-[#969696] mt-0.5">Te asignamos al mejor disponible</p>
              </div>
              <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
            </button>

            {PROFESSIONALS.map(prof => (
              <button
                key={prof.id}
                onClick={() => selectProf(prof.id)}
                className="w-full bg-white rounded-2xl px-4 py-4 text-left flex items-center gap-3 border-2 border-gray-100 transition-all active:opacity-70"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#e8eaf0' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#606060' }}>
                    {prof.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1e1e1e]">{prof.name}</p>
                  <p className="text-xs text-[#969696] mt-0.5">{prof.role}</p>
                </div>
                <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
              </button>
            ))}
          </div>
        )}

        {/* ── DATETIME ────────────────────────────────────────────────────── */}
        {step === 'datetime' && selectedService && (
          <div className="flex flex-col pb-20">
            {/* Date strip */}
            <div
              className="overflow-x-auto py-4 px-4"
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="flex gap-2 w-max">
                {days.map(dateStr => {
                  const d = new Date(dateStr + 'T12:00:00');
                  const dow = d.getDay();
                  const dayNum = d.getDate();
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
                      <span
                        className="text-[10px] font-semibold leading-none"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#969696' }}
                      >
                        {WEEKDAY_SHORT[dow]}
                      </span>
                      <span
                        className="text-sm font-bold leading-none"
                        style={{ color: isSelected ? '#fff' : '#121e6c' }}
                      >
                        {dayNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate ? (
              <div className="px-4">
                {(() => {
                  const slots = getAvailableSlots(selectedService, selectedDate, selectedProfId);
                  if (slots.length === 0) {
                    return (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <p className="text-sm font-semibold text-[#121e6c] text-center">
                          No hay horarios disponibles
                        </p>
                        <p className="text-xs text-[#969696] text-center max-w-[240px]">
                          {isDayOff(selectedDate)
                            ? 'El salón no trabaja los domingos. Elige otro día.'
                            : 'No hay horarios libres para este día. Elige otra fecha.'}
                        </p>
                        <button
                          onClick={showAviseme}
                          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-all active:opacity-70"
                          style={{ borderColor: '#121e6c', color: '#121e6c', backgroundColor: '#fff' }}
                        >
                          <Smartphone size={14} color="#121e6c" strokeWidth={2} />
                          Avísame cuando haya disponibilidad
                        </button>
                        {avismeMsgVisible && (
                          <div
                            className="text-xs font-semibold px-4 py-2 rounded-full"
                            style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}
                          >
                            ¡Te avisaremos por WhatsApp!
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <>
                      <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">
                        Horarios disponibles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slots.map(slot => {
                          const isSelected = slot === selectedTime;
                          return (
                            <button
                              key={slot}
                              onClick={() => selectDateTime(selectedDate, slot)}
                              className="w-[calc(33.333%-6px)] h-10 rounded-xl text-sm font-semibold border-2 transition-all active:opacity-70"
                              style={{
                                backgroundColor: isSelected ? '#121e6c' : '#fff',
                                color: isSelected ? '#fff' : '#121e6c',
                                borderColor: isSelected ? '#121e6c' : '#e8eaf0',
                              }}
                            >
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
                <p className="text-sm text-[#969696] text-center py-8">
                  Selecciona una fecha para ver horarios
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── CLIENT INFO ─────────────────────────────────────────────────── */}
        {step === 'clientinfo' && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-4">
            {/* Booking summary chip */}
            {selectedService && selectedDate && selectedTime && (
              <div className="bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                <p className="text-xs font-semibold text-[#121e6c]">{selectedService.name}</p>
                <p className="text-xs text-[#969696] mt-0.5">
                  {formatBookingDate(selectedDate)} · {selectedTime}
                </p>
              </div>
            )}

            {/* Form fields */}
            {([
              { key: 'name', label: 'Nombre completo', value: clientName, onChange: setClientName, type: 'text', placeholder: 'Tu nombre completo', required: true },
              { key: 'phone', label: 'Celular WhatsApp', value: clientPhone, onChange: setClientPhone, type: 'tel', placeholder: '3001234567', required: true },
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
                  style={{
                    borderColor: clientErrors[key] ? '#E8194B' : '#d2d4e1',
                    backgroundColor: '#fff',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#121e6c'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = clientErrors[key] ? '#E8194B' : '#d2d4e1'; }}
                />
                {clientErrors[key] && (
                  <p className="text-xs" style={{ color: '#E8194B' }}>{clientErrors[key]}</p>
                )}
              </div>
            ))}

            <button
              onClick={submitClientInfo}
              className="w-full h-12 rounded-full font-bold text-sm text-white mt-2 transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#E8194B' }}
            >
              Continuar
            </button>

            <p className="text-[11px] text-[#b0b5c8] text-center leading-relaxed">
              Al continuar aceptas los términos del servicio y la política de privacidad del salón.
            </p>
          </div>
        )}

        {/* ── OTP ─────────────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <div className="px-4 pt-6 pb-20 flex flex-col items-center gap-5">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#EEF0FB' }}
            >
              <Smartphone size={26} color="#121e6c" strokeWidth={1.8} />
            </div>

            <div className="text-center">
              <p className="text-base font-bold text-[#1e1e1e]">Código de verificación</p>
              <p className="text-sm text-[#969696] mt-1 leading-relaxed">
                Enviamos un código a<br />
                <span className="font-semibold text-[#1e1e1e]">{formatPhone(clientPhone)}</span>
              </p>
            </div>

            {/* OTP input */}
            <div className="w-full flex flex-col items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpValue}
                onChange={e => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                placeholder="_ _ _ _ _ _"
                className="w-48 h-14 rounded-2xl border-2 text-2xl font-bold text-center tracking-[0.4em] outline-none transition-colors"
                style={{
                  borderColor: otpError ? '#E8194B' : '#d2d4e1',
                  backgroundColor: '#fff',
                  color: '#121e6c',
                  letterSpacing: '0.4em',
                }}
              />
              {otpError && (
                <p className="text-xs text-center" style={{ color: '#E8194B' }}>{otpError}</p>
              )}
            </div>

            <button
              onClick={submitOtp}
              disabled={otpValue.length < 6}
              className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ backgroundColor: '#E8194B' }}
            >
              Verificar código
            </button>

            {/* Countdown / resend */}
            <p className="text-xs text-[#969696]">
              {otpCountdown > 0
                ? `Reenviar en ${otpCountdown}s`
                : (
                  <button
                    onClick={() => setOtpCountdown(30)}
                    className="text-[#121e6c] font-semibold"
                  >
                    Reenviar código
                  </button>
                )}
            </p>

            {/* Prototype hint */}
            <div
              className="w-full rounded-xl px-4 py-3 text-center"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <p className="text-xs text-[#B45309]">Para prueba usa: <strong>123456</strong></p>
            </div>
          </div>
        )}

        {/* ── PAYMENT ─────────────────────────────────────────────────────── */}
        {step === 'payment' && selectedService && (
          <div className="px-4 pt-4 pb-20 flex flex-col gap-4">
            {/* Service + amount */}
            <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 border border-gray-100">
              <p className="text-sm font-bold text-[#1e1e1e]">{selectedService.name}</p>
              <p className="text-2xl font-bold text-[#121e6c] tabular-nums mt-1">
                {formatCOP(selectedService.price)}
              </p>
            </div>

            <div className="bg-[#FFFBEB] rounded-xl px-4 py-3">
              <p className="text-xs text-[#B45309] leading-relaxed">
                Este servicio requiere pago anticipado para confirmar la reserva. El monto completo se cobra ahora y queda asegurado tu turno.
              </p>
            </div>

            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">
              Elige tu método de pago
            </p>

            {/* Payment options */}
            {([
              { method: 'card' as const, label: 'Tarjeta · Checkout Bold', sub: 'Débito o crédito', Icon: CreditCard },
              { method: 'link' as const, label: 'Link de pago', sub: 'Recibirás un link por WhatsApp', Icon: Link2 },
            ]).map(({ method, label, sub, Icon }) => (
              <button
                key={method}
                onClick={() => submitPayment(method)}
                className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-4 text-left transition-all active:opacity-70"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#EEF0FB' }}
                >
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

        {/* ── CONFIRMED ───────────────────────────────────────────────────── */}
        {step === 'confirmed' && selectedService && selectedDate && selectedTime && (
          <div className="px-4 pt-8 pb-20 flex flex-col items-center gap-5">
            {/* Success icon */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F0FDF4' }}
            >
              <CheckCircle2 size={32} color="#15803D" strokeWidth={2} />
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-[#1e1e1e]">¡Cita confirmada!</p>
              <p className="text-sm text-[#969696] mt-1.5 leading-relaxed">
                Te enviaremos recordatorios por WhatsApp 24h y 2h antes de tu cita.
              </p>
            </div>

            {/* Booking summary card */}
            <div
              className="w-full bg-white rounded-2xl px-4 py-4 flex flex-col gap-3 border border-gray-100"
              style={{ boxShadow: '0px 2px 8px rgba(18,30,108,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#121e6c' }}
                >
                  <span className="text-sm font-bold text-white">
                    {resolvedProf?.initials ?? 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1e1e1e]">{selectedService.name}</p>
                  <p className="text-xs text-[#969696] mt-0.5">{resolvedProf?.name ?? 'Profesional asignada'}</p>
                </div>
                <p className="ml-auto text-sm font-bold text-[#121e6c] tabular-nums">
                  {formatCOP(selectedService.price)}
                </p>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Fecha</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">
                    {formatBookingDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Hora</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">
                    {selectedTime} – {addMinutes(selectedTime, selectedService.duration)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Lugar</span>
                  <span className="text-xs font-semibold text-[#1e1e1e]">{SALON.address}</span>
                </div>
                {paymentMethod && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#b0b5c8] w-16 shrink-0">Pago</span>
                    <span className="text-xs font-semibold text-[#0D9488]">
                      Prepagado · {formatCOP(selectedService.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setStep('landing');
                setSelectedService(null);
                setSelectedDate('');
                setSelectedTime('');
                setClientName('');
                setClientPhone('');
                setClientCedula('');
                setClientEmail('');
                setOtpValue('');
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
    </div>
  );
}
