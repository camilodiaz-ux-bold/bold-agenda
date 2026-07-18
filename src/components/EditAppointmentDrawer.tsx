import { useState, useMemo } from 'react';
import { Check, CheckCircle2, Smartphone } from 'lucide-react';
import type { Appointment, Professional, Service, AvailabilityBlock, Role } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';
import { getAvailableSlots, resolveProf, addMinutes, PROTOTYPE_TODAY } from '../store/prototypeStore';

interface Props {
  appointment: Appointment;
  appointments: Appointment[];
  professionals: Professional[];
  services: Service[];
  availabilityBlocks: AvailabilityBlock[];
  role: Role;
  onSave: (updated: Appointment) => void;
  onClose: () => void;
}

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function getNextDays(n: number, from = PROTOTYPE_TODAY): string[] {
  const days: string[] = [];
  const [y, m, d] = from.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  for (let i = 0; i < n; i++) {
    const nd = new Date(base);
    nd.setDate(base.getDate() + i);
    days.push(`${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`);
  }
  return days;
}

function formatBookingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
}

type EditStep = 'form' | 'confirm';

export function EditAppointmentDrawer({
  appointment, appointments, professionals, services, availabilityBlocks, role, onSave, onClose,
}: Props) {
  const [step, setStep] = useState<EditStep>('form');
  const isAdmin = role === 'admin';

  const [selProfId, setSelProfId] = useState(appointment.professionalId);
  const [selSvcId, setSelSvcId] = useState(appointment.serviceId);
  const [selDate, setSelDate] = useState(appointment.date);
  const [selTime, setSelTime] = useState('');

  const days = useMemo(() => getNextDays(21), []);
  const selSvc = useMemo(() => services.find(s => s.id === selSvcId)!, [services, selSvcId]);

  const slots = useMemo(() => {
    if (!selSvc || !selDate) return [];
    return getAvailableSlots(selSvc, selDate, selProfId, appointments, availabilityBlocks, appointment.id);
  }, [selSvc, selDate, selProfId, appointments, availabilityBlocks, appointment.id]);

  const hasChanges = selProfId !== appointment.professionalId
    || selSvcId !== appointment.serviceId
    || selDate !== appointment.date
    || (selTime !== '' && selTime !== appointment.startTime);

  const canSave = selTime !== '' && hasChanges;

  function handleSave() {
    const finalProfId = selProfId === 'any'
      ? resolveProf(selSvc, selDate, selTime, appointments, availabilityBlocks)
      : selProfId;
    const updated: Appointment = {
      ...appointment,
      professionalId: finalProfId,
      serviceId: selSvcId,
      date: selDate,
      startTime: selTime,
      status: 'reprogramada',
      originalPrice: appointment.originalPrice ?? services.find(s => s.id === appointment.serviceId)?.price,
    };
    onSave(updated);
    setStep('confirm');
  }

  // ── Confirm step ──────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-8 pt-2 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
            <CheckCircle2 size={26} color="#15803D" strokeWidth={2} />
          </div>
          <div>
            <p className="text-base font-bold text-[#1e1e1e]">Cita actualizada</p>
            <p className="text-sm text-[#969696] mt-1">{formatBookingDate(selDate)} · {selTime}</p>
          </div>
          <div className="w-full bg-[#f7f8fb] rounded-2xl px-4 py-3 text-left flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
              <span className="text-xs text-[#606060]">Agenda actualizada</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={13} color="#15803D" strokeWidth={2.5} />
              <span className="text-xs text-[#606060]">Confirmación enviada por WhatsApp a {appointment.clientName}</span>
            </div>
            {appointment.paymentStatus === 'pagado-anticipado' && (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} color="#0D9488" strokeWidth={2.5} />
                <span className="text-xs text-[#0D9488] font-semibold">Pago anticipado conservado — no se cobra de nuevo</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full font-bold text-sm text-white"
            style={{ backgroundColor: '#E8194B' }}
          >
            Listo
          </button>
        </div>
      </div>
    );
  }

  // ── Form step — scrollable body + sticky footer ───────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-2 flex flex-col gap-4">
        {/* Client context */}
        <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5">
          <p className="text-sm font-bold text-[#1e1e1e]">{appointment.clientName}</p>
          <p className="text-xs text-[#969696] mt-0.5">
            {services.find(s => s.id === appointment.serviceId)?.name} · {appointment.date} · {appointment.startTime}
          </p>
        </div>

        {appointment.paymentStatus === 'pagado-anticipado' && (
          <div className="bg-[#F0FDFA] rounded-xl px-3 py-2.5 flex items-center gap-2">
            <CheckCircle2 size={14} color="#0D9488" strokeWidth={2} />
            <p className="text-xs text-[#0D9488] font-semibold">
              Prepagado · {formatCOP(appointment.originalPrice ?? services.find(s => s.id === appointment.serviceId)?.price ?? 0)} — no se cobra de nuevo
            </p>
          </div>
        )}

        {/* Professional (admin only) */}
        {isAdmin && (
          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Profesional</p>
            <div className="flex flex-col gap-1.5">
              {professionals.map(prof => {
                const isActive = prof.id === selProfId;
                return (
                  <button
                    key={prof.id}
                    onClick={() => { setSelProfId(prof.id); setSelTime(''); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all"
                    style={{ borderColor: isActive ? '#121e6c' : '#e8eaf0', backgroundColor: isActive ? '#f7f8fb' : '#fff' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isActive ? '#121e6c' : '#e8eaf0' }}>
                      <span className="text-xs font-bold" style={{ color: isActive ? '#fff' : '#606060' }}>{prof.initials}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>{prof.name}</p>
                      <p className="text-xs text-[#969696]">{prof.role}</p>
                    </div>
                    {isActive && <Check size={14} color="#121e6c" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Service (admin only) */}
        {isAdmin && (
          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Servicio</p>
            <div className="flex flex-col gap-1.5">
              {services.filter(s => (s as any).active !== false).map(svc => {
                const isActive = svc.id === selSvcId;
                return (
                  <button
                    key={svc.id}
                    onClick={() => { setSelSvcId(svc.id); setSelTime(''); }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all"
                    style={{ borderColor: isActive ? '#121e6c' : '#e8eaf0', backgroundColor: isActive ? '#f7f8fb' : '#fff' }}
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>{svc.name}</p>
                      <p className="text-xs text-[#969696]">{formatDuration(svc.duration)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tabular-nums" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>{formatCOP(svc.price)}</span>
                      {isActive && <Check size={14} color="#121e6c" strokeWidth={2.5} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Date strip */}
        <div>
          <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Fecha</p>
          <div className="overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
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
        {selSvc && selDate && (
          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Hora</p>
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
            {selTime && selSvc && (
              <p className="text-xs text-[#969696] mt-2">
                {selTime} – {addMinutes(selTime, selSvc.duration)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-5 pt-3 pb-6 border-t border-gray-100 bg-white">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: '#E8194B' }}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
