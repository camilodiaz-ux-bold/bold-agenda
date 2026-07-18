import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, RotateCcw, XCircle, CalendarClock } from 'lucide-react';
import {
  store, getAvailableSlots, addMinutes, PROTOTYPE_TODAY,
  isWithinCancellationWindow, hoursUntilAppointment,
} from '../store/prototypeStore';
import { formatCOP, formatDuration } from '../data/appointments';
import type { Appointment, Service } from '../types';

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function getNextDays(n: number): string[] {
  const [y, m, d] = PROTOTYPE_TODAY.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  return Array.from({ length: n }, (_, i) => {
    const nd = new Date(base);
    nd.setDate(base.getDate() + i);
    return `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`;
  });
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
}

type ManageStep = 'loading' | 'not-found' | 'detail' | 'reschedule' | 'reschedule-confirm' | 'reschedule-done' | 'cancel-confirm' | 'cancel-done';

export function ManageSite() {
  const params = new URLSearchParams(window.location.search);
  const appointmentId = params.get('appointmentId') ?? '';

  const s = store.get();
  const apt = s.appointments.find(a => a.id === appointmentId);
  const policy = s.bookingPolicy;
  const salonProfile = s.businessProfile;

  const service: Service | null = apt ? (s.services.find(sv => sv.id === apt.serviceId) ?? null) : null;
  const professional = apt ? (s.professionals.find(p => p.id === apt.professionalId) ?? null) : null;

  const [step, setStep] = useState<ManageStep>(apt ? 'detail' : appointmentId ? 'not-found' : 'not-found');
  const [selDate, setSelDate] = useState(apt?.date ?? '');
  const [selTime, setSelTime] = useState('');
  const [localApt, setLocalApt] = useState<Appointment | null>(apt ?? null);

  const days = getNextDays(21);

  const withinWindow = useMemo(() => {
    if (!localApt || !service) return false;
    return isWithinCancellationWindow(localApt, policy);
  }, [localApt, service, policy]);

  const slots = useMemo(() => {
    if (!service || !selDate) return [];
    const cs = store.get();
    return getAvailableSlots(service, selDate, localApt?.professionalId ?? 'any', cs.appointments, cs.availabilityBlocks, localApt?.id);
  }, [service, selDate, localApt]);

  function doReschedule() {
    if (!localApt || !selTime) return;
    const updated: Appointment = {
      ...localApt,
      date: selDate,
      startTime: selTime,
      status: 'reprogramada',
    };
    store.set(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === localApt.id ? updated : a),
    }));
    setLocalApt(updated);
    setStep('reschedule-done');
  }

  function doCancel() {
    if (!localApt) return;
    const isEarly = isWithinCancellationWindow(localApt, policy);
    const updated: Appointment = {
      ...localApt,
      status: isEarly ? 'cancelada' : 'cancelada-tarde',
      paymentStatus: isEarly && localApt.paymentStatus === 'pagado-anticipado' ? 'reembolsado' : localApt.paymentStatus,
    };
    store.set(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === localApt.id ? updated : a),
    }));
    setLocalApt(updated);
    setStep('cancel-done');
  }

  const apt_ = localApt;

  // ── Not found ──────────────────────────────────────────────────────────────
  if (step === 'not-found' || !apt_) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5 px-8" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(18,30,108,0.1)' }}>
          <XCircle size={24} color="#969696" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-[#121e6c]">{salonProfile.name}</p>
          <p className="text-sm text-[#969696] mt-2 leading-relaxed">
            No encontramos tu cita. Es posible que el enlace sea incorrecto o que la cita ya no exista.
          </p>
          <p className="text-xs text-[#b0b5c8] mt-3">ID: {appointmentId || '(vacío)'}</p>
        </div>
      </div>
    );
  }

  const displayService: Service | null = service;
  const hoursLeft = hoursUntilAppointment(apt_);
  const alreadyCancelled = apt_.status === 'cancelada' || apt_.status === 'cancelada-tarde';
  const alreadyCompleted = apt_.status === 'completada' || apt_.status === 'no-show';
  const canManage = !alreadyCancelled && !alreadyCompleted;

  // ── Detail ─────────────────────────────────────────────────────────────────
  if (step === 'detail') {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="bg-white px-5 pt-5 pb-4 flex-shrink-0">
          <p className="text-xs text-[#969696] mb-1">{salonProfile.name}</p>
          <h1 className="text-xl font-bold text-[#121e6c] leading-tight">Tu cita</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {/* Appointment summary card */}
          <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-3" style={{ boxShadow: '0 1px 4px rgba(18,30,108,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#121e6c' }}>
                <span className="text-sm font-bold text-white">{professional?.initials ?? 'S'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1e1e1e]">{displayService?.name ?? 'Servicio'}</p>
                <p className="text-xs text-[#969696] mt-0.5">{professional?.name}</p>
              </div>
              {displayService && (
                <p className="text-sm font-bold text-[#121e6c] tabular-nums shrink-0">
                  {formatCOP(apt_.originalPrice ?? displayService.price)}
                </p>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex flex-col gap-1.5">
              <Row label="Fecha" value={formatDate(apt_.date)} />
              <Row label="Hora" value={`${apt_.startTime}${displayService ? ` – ${addMinutes(apt_.startTime, displayService.duration)}` : ''}`} />
              {displayService && <Row label="Duración" value={formatDuration(displayService.duration)} />}
              <Row label="Estado" value={statusLabel(apt_.status)} />
              {apt_.paymentStatus === 'pagado-anticipado' && <Row label="Pago" value="Prepagado ✓" />}
              {apt_.paymentStatus === 'reembolsado' && <Row label="Pago" value="Reembolso procesado ✓" />}
            </div>

            {!canManage && (
              <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-[#969696]">
                  {alreadyCancelled ? 'Esta cita ha sido cancelada.' : 'Esta cita ya fue completada.'}
                </p>
              </div>
            )}
          </div>

          {/* Policy info */}
          {canManage && hoursLeft > 0 && (
            <div className="bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0 1px 4px rgba(18,30,108,0.06)' }}>
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Política de cancelación</p>
              <p className="text-xs text-[#606060] leading-relaxed">
                Cancelación gratuita hasta {policy.cancellationWindowHours}h antes de tu cita.{' '}
                {withinWindow
                  ? `Tienes ${Math.floor(hoursLeft)}h disponibles.`
                  : 'El plazo gratuito ya venció — el pago anticipado no se reembolsa.'}
              </p>
            </div>
          )}

          {/* Actions */}
          {canManage && (
            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={() => { setSelDate(apt_.date); setSelTime(''); setStep('reschedule'); }}
                className="w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98]"
                style={{ backgroundColor: '#121e6c' }}
              >
                <CalendarClock size={16} color="#fff" strokeWidth={2} />
                Reprogramar cita
              </button>
              <button
                onClick={() => setStep('cancel-confirm')}
                className="w-full h-12 rounded-full font-bold text-sm border-2 text-[#E8194B] transition-all active:scale-[0.98]"
                style={{ borderColor: '#E8194B', backgroundColor: '#fff' }}
              >
                Cancelar cita
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Reschedule ─────────────────────────────────────────────────────────────
  if (step === 'reschedule') {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 flex-shrink-0 border-b border-gray-100">
          <button onClick={() => setStep('detail')} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
            <ArrowLeft size={18} color="#121e6c" strokeWidth={2} />
          </button>
          <h1 className="text-base font-bold text-[#121e6c]">Reprogramar cita</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl px-3 py-2.5 border border-gray-100">
            <p className="text-xs font-semibold text-[#121e6c]">{displayService?.name}</p>
            <p className="text-xs text-[#969696] mt-0.5">Original: {apt_.date} · {apt_.startTime}</p>
          </div>

          {apt_.paymentStatus === 'pagado-anticipado' && (
            <div className="bg-[#F0FDFA] rounded-xl px-3 py-2.5 flex items-center gap-2">
              <CheckCircle2 size={14} color="#0D9488" strokeWidth={2} />
              <p className="text-xs text-[#0D9488] font-semibold">
                Pago anticipado conservado — no se cobra de nuevo
              </p>
            </div>
          )}

          {/* Date strip */}
          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Nueva fecha</p>
            <div className="overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              <div className="flex gap-2 w-max pb-1">
                {days.map(dateStr => {
                  const d = new Date(dateStr + 'T12:00:00');
                  const isSelected = dateStr === selDate;
                  const isOff = d.getDay() === 0;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => { setSelDate(dateStr); setSelTime(''); }}
                      disabled={isOff}
                      className="flex flex-col items-center gap-1 py-2 w-11 rounded-2xl border-2 transition-all"
                      style={{
                        backgroundColor: isSelected ? '#121e6c' : '#fff',
                        borderColor: isSelected ? '#121e6c' : '#e8eaf0',
                        opacity: isOff ? 0.3 : 1,
                      }}
                    >
                      <span className="text-[10px] font-semibold" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#969696' }}>
                        {WEEKDAY_SHORT[d.getDay()]}
                      </span>
                      <span className="text-sm font-bold" style={{ color: isSelected ? '#fff' : '#121e6c' }}>{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time slots */}
          {selDate && (
            <div>
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Nueva hora</p>
              {slots.length === 0 ? (
                <p className="text-sm text-[#969696] py-2">No hay horarios disponibles para este día</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map(slot => {
                    const isActive = slot === selTime;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelTime(slot)}
                        className="w-[calc(33.333%-6px)] h-10 rounded-xl text-sm font-semibold border-2 transition-all"
                        style={{
                          backgroundColor: isActive ? '#121e6c' : '#fff',
                          color: isActive ? '#fff' : '#121e6c',
                          borderColor: isActive ? '#121e6c' : '#e8eaf0',
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
              {selTime && displayService && (
                <p className="text-xs text-[#969696] mt-2">{selTime} – {addMinutes(selTime, displayService.duration)}</p>
              )}
            </div>
          )}

          <button
            onClick={() => setStep('reschedule-confirm')}
            disabled={!selTime || (selDate === apt_.date && selTime === apt_.startTime)}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#E8194B' }}
          >
            Confirmar reprogramación
          </button>

          <div className="h-6" />
        </div>
      </div>
    );
  }

  // ── Reschedule confirm ─────────────────────────────────────────────────────
  if (step === 'reschedule-confirm') {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 flex-shrink-0 border-b border-gray-100">
          <button onClick={() => setStep('reschedule')} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
            <ArrowLeft size={18} color="#121e6c" strokeWidth={2} />
          </button>
          <h1 className="text-base font-bold text-[#121e6c]">Confirmar cambio</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
          <div className="bg-white rounded-2xl px-4 py-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">Antes</p>
            <p className="text-sm font-semibold text-[#969696]">{formatDate(apt_.date)} · {apt_.startTime}</p>
            <div className="h-px bg-gray-100" />
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">Después</p>
            <p className="text-sm font-bold text-[#121e6c]">{formatDate(selDate)} · {selTime}</p>
          </div>

          {apt_.paymentStatus === 'pagado-anticipado' && (
            <div className="bg-[#F0FDFA] rounded-xl px-4 py-3 flex gap-2">
              <CheckCircle2 size={14} color="#0D9488" strokeWidth={2} className="mt-0.5 shrink-0" />
              <p className="text-xs text-[#0D9488] leading-relaxed font-semibold">
                Tu pago anticipado queda vinculado a la nueva fecha. No necesitas pagar de nuevo.
              </p>
            </div>
          )}

          <button
            onClick={doReschedule}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#121e6c' }}
          >
            Sí, reprogramar
          </button>

          <button onClick={() => setStep('reschedule')} className="w-full h-10 text-sm font-semibold text-[#969696]">
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Reschedule done ────────────────────────────────────────────────────────
  if (step === 'reschedule-done') {
    return (
      <SuccessScreen
        icon={<CheckCircle2 size={28} color="#15803D" strokeWidth={2} />}
        iconBg="#F0FDF4"
        title="¡Cita reprogramada!"
        body={`Nueva fecha: ${formatDate(selDate)} · ${selTime}`}
        sub={apt_.paymentStatus === 'pagado-anticipado' ? 'Tu pago anticipado queda vinculado a la nueva fecha.' : undefined}
        subColor="#0D9488"
        subBg="#F0FDFA"
        salonName={salonProfile.name}
      />
    );
  }

  // ── Cancel confirm ─────────────────────────────────────────────────────────
  if (step === 'cancel-confirm') {
    const isEarly = withinWindow;
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#f7f8fb' }}>
        <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 flex-shrink-0 border-b border-gray-100">
          <button onClick={() => setStep('detail')} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
            <ArrowLeft size={18} color="#121e6c" strokeWidth={2} />
          </button>
          <h1 className="text-base font-bold text-[#121e6c]">Cancelar cita</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
          <div className={`rounded-2xl px-4 py-4 flex gap-3 ${isEarly ? 'bg-[#F0FDF4]' : 'bg-[#FFF1F2]'}`}>
            {isEarly
              ? <CheckCircle2 size={18} color="#15803D" strokeWidth={2} className="shrink-0 mt-0.5" />
              : <AlertTriangle size={18} color="#BE123C" strokeWidth={2} className="shrink-0 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-bold ${isEarly ? 'text-[#15803D]' : 'text-[#BE123C]'}`}>
                {isEarly ? 'Cancelación gratuita' : 'Cancelación fuera de ventana'}
              </p>
              <p className={`text-xs mt-1 leading-relaxed ${isEarly ? 'text-[#166534]' : 'text-[#9F1239]'}`}>
                {isEarly
                  ? `Tu cita es en ${Math.floor(hoursLeft)}h — dentro del plazo de ${policy.cancellationWindowHours}h. Si tenías pago anticipado, se procesará el reembolso.`
                  : `El plazo gratuito de ${policy.cancellationWindowHours}h ya venció. Si tenías pago anticipado, no se reembolsa.`
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3">
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Cita a cancelar</p>
            <p className="text-sm font-bold text-[#1e1e1e]">{displayService?.name}</p>
            <p className="text-xs text-[#969696] mt-0.5">{formatDate(apt_.date)} · {apt_.startTime}</p>
            {apt_.paymentStatus === 'pagado-anticipado' && (
              <p className="text-xs font-semibold mt-2" style={{ color: isEarly ? '#0D9488' : '#E8194B' }}>
                {isEarly ? `Reembolso: ${formatCOP(apt_.originalPrice ?? displayService?.price ?? 0)}` : `Retenido: ${formatCOP(apt_.originalPrice ?? displayService?.price ?? 0)}`}
              </p>
            )}
          </div>

          <button
            onClick={doCancel}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#E8194B' }}
          >
            Confirmar cancelación
          </button>
          <button onClick={() => setStep('detail')} className="w-full h-10 text-sm font-semibold text-[#969696]">
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Cancel done ────────────────────────────────────────────────────────────
  const wasEarlyCancel = localApt?.status === 'cancelada';
  return (
    <SuccessScreen
      icon={wasEarlyCancel
        ? <RotateCcw size={28} color="#15803D" strokeWidth={2} />
        : <XCircle size={28} color="#BE123C" strokeWidth={2} />}
      iconBg={wasEarlyCancel ? '#F0FDF4' : '#FFF1F2'}
      title="Cita cancelada"
      body={wasEarlyCancel
        ? 'Tu cita fue cancelada y el reembolso será procesado en 3–5 días hábiles.'
        : 'Tu cita fue cancelada. El pago anticipado fue retenido según la política del salón.'}
      salonName={salonProfile.name}
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#b0b5c8] w-16 shrink-0">{label}</span>
      <span className="text-xs font-semibold text-[#1e1e1e]">{value}</span>
    </div>
  );
}

function SuccessScreen({
  icon, iconBg, title, body, sub, subColor, subBg, salonName,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
  sub?: string;
  subColor?: string;
  subBg?: string;
  salonName: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 px-8" style={{ backgroundColor: '#f7f8fb' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-[#1e1e1e]">{title}</p>
        <p className="text-sm text-[#969696] mt-2 leading-relaxed max-w-[280px]">{body}</p>
      </div>
      {sub && (
        <div className="w-full max-w-sm rounded-xl px-4 py-3" style={{ backgroundColor: subBg }}>
          <p className="text-xs text-center font-semibold" style={{ color: subColor }}>{sub}</p>
        </div>
      )}
      <p className="text-xs text-[#b0b5c8] text-center mt-2">{salonName}</p>
    </div>
  );
}

function statusLabel(status: string): string {
  const MAP: Record<string, string> = {
    confirmada: 'Confirmada',
    completada: 'Completada',
    reprogramada: 'Reprogramada',
    cancelada: 'Cancelada',
    'cancelada-tarde': 'Cancelación tardía',
    'no-show': 'No llegó',
  };
  return MAP[status] ?? status;
}
