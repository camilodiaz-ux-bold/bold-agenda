import type { Appointment, Professional, Service } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  onTap: () => void;
}

export function AppointmentCard({ appointment, professional, service, onTap }: Props) {
  const isDimmed = appointment.status === 'completada' || appointment.status === 'no-show';

  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white rounded-2xl overflow-hidden transition-all active:scale-[0.98] active:shadow-none border border-gray-100"
      style={{
        boxShadow: '0px 1px 4px rgba(18, 30, 108, 0.05)',
        opacity: isDimmed ? 0.72 : 1,
      }}
    >
      <div className="flex">
        {/* Time column */}
        <div className="pl-3 pr-2 py-3 w-[58px] shrink-0 flex flex-col items-end justify-start">
          <span className="text-sm font-bold text-[#121e6c] leading-tight tabular-nums">
            {appointment.startTime}
          </span>
          <span className="text-[11px] text-[#b0b5c8] leading-tight mt-0.5">
            {formatDuration(service.duration)}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-100 my-3 shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0 py-3 px-3">
          {/* Row 1: client name (primary) + appointment status */}
          <div className="flex items-start justify-between gap-2">
            <span className={`text-sm font-bold leading-tight ${appointment.clientName ? 'text-[#1e1e1e]' : 'text-[#b0b5c8] italic'}`}>
              {appointment.clientName ?? 'Sin cliente asociado'}
            </span>
            <div className="shrink-0 mt-0.5">
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Row 2: service name + price */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-xs text-[#969696] truncate">{service.name}</span>
            <span className="text-xs font-semibold text-[#121e6c] shrink-0 tabular-nums">
              {formatCOP(service.price)}
            </span>
          </div>

          {/* Row 3: professional (secondary) + payment status (subtle) */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#e8eaf0' }}
              >
                <span className="text-[8px] font-bold leading-none" style={{ color: '#606060' }}>
                  {professional.initials.slice(0, 1)}
                </span>
              </div>
              <span className="text-[11px] text-[#969696]">
                {professional.name.split(' ')[0]}
              </span>
            </div>
            <StatusBadge status={appointment.paymentStatus} subtle />
          </div>
        </div>
      </div>
    </button>
  );
}
