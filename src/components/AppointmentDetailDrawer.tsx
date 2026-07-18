import { Phone, Calendar, Clock, ChevronRight, Edit3, CheckSquare } from 'lucide-react';
import type { Appointment, Professional, Service } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  onClosure: () => void;
  onEdit: () => void;
  onViewClient: () => void;
}

function formatPhone(phone: string): string {
  return `+57 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function addMinutes(time: string, minutes: number): string {
  const [h, mn] = time.split(':').map(Number);
  const total = h * 60 + mn + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const SECTION_LABEL = 'text-[10px] font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2';

export function AppointmentDetailDrawer({
  appointment,
  professional,
  service,
  onClosure,
  onEdit,
  onViewClient,
}: Props) {
  const endTime = addMinutes(appointment.startTime, service.duration);
  const isCloseable = appointment.status === 'confirmada';
  const isEditable = appointment.status === 'confirmada' || appointment.status === 'reprogramada';

  return (
    <div className="flex flex-col flex-1 min-h-0">
    <div className="flex-1 overflow-y-auto">

      {/* ── Professional bar ───────────────────────── */}
      <div
        className="mx-5 mt-1 mb-5 rounded-xl px-3 py-2.5 flex items-center gap-3"
        style={{ backgroundColor: '#f0f1f5' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#121e6c' }}
        >
          <span className="text-sm font-bold text-white">{professional.initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#121e6c] leading-tight">{professional.name}</p>
          <p className="text-xs text-[#969696] leading-tight mt-0.5">{professional.role}</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5">

        {/* ── Client ─────────────────────────────────
            Plain text — no card container needed; content is self-explanatory */}
        <div>
          <p className={SECTION_LABEL}>Cliente</p>
          <p className="text-sm font-bold text-[#1e1e1e]">{appointment.clientName}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Phone size={12} color="#b0b5c8" strokeWidth={2} />
            <p className="text-xs text-[#606060]">{formatPhone(appointment.clientPhone)}</p>
          </div>
          <p className="text-xs text-[#b0b5c8] mt-0.5">CC {appointment.clientCedula}</p>
        </div>

        {/* ── Service + Commission ───────────────────
            Card: financial data benefits from visual grouping */}
        <div>
          <p className={SECTION_LABEL}>Servicio</p>
          <div className="bg-[#f7f8fb] rounded-xl px-3 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#1e1e1e]">{service.name}</p>
              <p className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(service.price)}</p>
            </div>
            <p className="text-xs text-[#969696] mt-1">{formatDuration(service.duration)}</p>
            {service.requiresDeposit && (
              <span className="inline-block mt-1.5 text-[10px] font-semibold text-[#0D9488] bg-[#F0FDFA] px-2 py-0.5 rounded-full">
                Pago anticipado
              </span>
            )}

            {/* Commission — except no-show */}
            {appointment.status !== 'no-show' && (
              <>
                <div className="h-px bg-gray-200 mt-2.5 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#606060]">
                    {appointment.status === 'completada' ? 'Tu comisión' : 'Comisión estimada'}
                    <span className="ml-1 text-[#b0b5c8]">({Math.round(professional.commissionRate * 100)}%)</span>
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: '#E8194B' }}>
                    {formatCOP(Math.round(service.price * professional.commissionRate))}
                  </span>
                </div>
                {appointment.tip != null && appointment.tip > 0 && (
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-[#606060]">Propina (100% tuya)</span>
                    <span className="text-xs font-semibold text-[#15803D] tabular-nums">
                      + {formatCOP(appointment.tip)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Date & time ────────────────────────────
            Plain text with icons — icons carry the context, no card needed */}
        <div>
          <p className={SECTION_LABEL}>Fecha y hora</p>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} color="#b0b5c8" strokeWidth={2} />
            <p className="text-xs text-[#606060]">
              {formatFullDate(appointment.date).replace(/^\w/, c => c.toUpperCase())}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock size={13} color="#b0b5c8" strokeWidth={2} />
            <p className="text-xs text-[#606060]">
              {appointment.startTime} – {endTime}
            </p>
          </div>
        </div>

        {/* ── Status row ─────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={appointment.status} size="md" />
          <StatusBadge status={appointment.paymentStatus} size="md" />
        </div>

        {/* ── Notes ──────────────────────────────── */}
        {appointment.notes && (
          <div className="bg-[#FFFBEB] rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider mb-1">Nota</p>
            <p className="text-xs text-[#606060] leading-relaxed">{appointment.notes}</p>
          </div>
        )}

        {/* ── Actions ────────────────────────────── */}
        <div className="flex flex-col gap-2 pb-6">
          {isCloseable && (
            <button
              onClick={onClosure}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#E8194B' }}
            >
              <CheckSquare size={18} color="white" strokeWidth={2.5} />
              Cerrar servicio
            </button>
          )}

          {isEditable && (
            <button
              onClick={onEdit}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-sm text-[#121e6c] border border-[#d2d4e1] bg-white transition-all active:scale-[0.98]"
            >
              <Edit3 size={16} color="#121e6c" strokeWidth={2} />
              Editar cita
            </button>
          )}

          <button
            onClick={onViewClient}
            className="w-full h-10 flex items-center justify-center gap-1 text-sm text-[#969696] transition-opacity active:opacity-60"
          >
            Ver perfil del cliente
            <ChevronRight size={14} color="#969696" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
