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
      className="w-full text-left bg-white rounded-2xl overflow-hidden transition-all active:scale-[0.98] active:shadow-none"
      style={{
        boxShadow: '0px 2px 8px rgba(18, 30, 108, 0.06)',
        opacity: isDimmed ? 0.75 : 1,
      }}
    >
      <div className="flex" style={{ borderLeft: `4px solid ${professional.color}` }}>
        {/* Time column */}
        <div className="pl-3 pr-2 py-3 w-[58px] shrink-0 flex flex-col items-end justify-start">
          <span className="text-sm font-bold text-[#121e6c] leading-tight tabular-nums">
            {appointment.startTime}
          </span>
          <span className="text-[11px] text-[#969696] leading-tight mt-0.5">
            {formatDuration(service.duration)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-3 pr-3 border-l border-gray-100">
          {/* Row 1: client name + appointment status */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-[#1e1e1e] leading-tight">
              {appointment.clientName}
            </span>
            <div className="shrink-0 mt-0.5">
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Row 2: service + price */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-xs text-[#606060] truncate">{service.name}</span>
            <span className="text-xs font-bold text-[#121e6c] shrink-0 tabular-nums">
              {formatCOP(service.price)}
            </span>
          </div>

          {/* Row 3: professional + payment status */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: professional.color }}
              >
                <span className="text-[8px] font-bold text-white leading-none">
                  {professional.initials.slice(0, 1)}
                </span>
              </div>
              <span className="text-[11px] text-[#969696]">
                {professional.name.split(' ')[0]}
              </span>
            </div>
            <StatusBadge status={appointment.paymentStatus} />
          </div>
        </div>
      </div>
    </button>
  );
}
