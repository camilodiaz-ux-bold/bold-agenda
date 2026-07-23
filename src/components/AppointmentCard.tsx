import type { Appointment, Professional, Service } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  onTap: () => void;
}

const STATUS_DOT: Record<string, string> = {
  confirmada: '#121e6c',
  completada: '#22c55e',
  'no-show': '#BE123C',
  reprogramada: '#9ca3af',
  cancelada: '#9ca3af',
  'cancelada-tarde': '#BE123C',
  pendiente: '#d97706',
  pagado: '#22c55e',
  'pagado-anticipado': '#0D9488',
  reembolsado: '#22c55e',
};

const STATUS_LABEL: Record<string, string> = {
  confirmada: 'Confirmada',
  completada: 'Completado',
  'no-show': 'No llegó',
  reprogramada: 'Reprogramada',
  cancelada: 'Cancelada',
  'cancelada-tarde': 'Cancelación tardía',
  pendiente: 'Por cobrar',
  pagado: 'Pagado',
  'pagado-anticipado': 'Prepagado',
  reembolsado: 'Reembolsado',
};

function StatusDot({ status }: { status: string }) {
  const color = STATUS_DOT[status] ?? '#9ca3af';
  const label = STATUS_LABEL[status] ?? status;
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span className="w-[8px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[12px] font-medium text-[#1e1e1e] whitespace-nowrap leading-[16px]">{label}</span>
    </span>
  );
}

export function AppointmentCard({ appointment, professional, service, onTap }: Props) {
  const isDimmed = appointment.status === 'completada' || appointment.status === 'no-show';

  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white rounded-[16px] transition-all active:scale-[0.98] active:shadow-none"
      style={{
        boxShadow: '0px 4px 6px rgba(18, 30, 108, 0.08)',
        opacity: isDimmed ? 0.72 : 1,
      }}
    >
      <div className="flex gap-[10px] items-start px-4 py-3">

        {/* Time column — 41px, semibold 14px navy */}
        <div className="w-[41px] h-[40px] flex items-center justify-start shrink-0">
          <span className="text-[14px] font-semibold text-[#121e6c] tabular-nums leading-[20px]">
            {appointment.startTime}
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-gray-200 self-stretch shrink-0" />

        {/* Info column */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">

          {/* Level 1 — client name + duration */}
          <div className="flex items-center justify-between gap-2 min-h-[40px]">
            <span className={`text-[14px] font-semibold leading-[20px] truncate ${appointment.clientName ? 'text-[#1e1e1e]' : 'text-[#b0b5c8] italic'}`}>
              {appointment.clientName ?? 'Sin cliente asociado'}
            </span>
            <span className="text-[14px] font-semibold text-[#1e1e1e] shrink-0 whitespace-nowrap leading-[20px]">
              {formatDuration(service.duration)}
            </span>
          </div>

          {/* Level 2 — service + price */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px] truncate">{service.name}</span>
            <span className="text-[12px] font-medium text-[#1e1e1e] shrink-0 tabular-nums leading-[16px]">{formatCOP(service.price)}</span>
          </div>

          {/* Level 3 — professional */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">Profesional</span>
            <span className="text-[12px] font-medium text-[#1e1e1e] shrink-0 leading-[16px]">{professional.name.split(' ')[0]}</span>
          </div>

          {/* Level 4 — appointment status */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">Estado del servicio</span>
            <StatusDot status={appointment.status} />
          </div>

          {/* Level 5 — payment status */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">Estado del pago</span>
            <StatusDot status={appointment.paymentStatus} />
          </div>

        </div>
      </div>
    </button>
  );
}
