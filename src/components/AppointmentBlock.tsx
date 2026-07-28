import { Check, X, Calendar, CalendarClock, Clock } from 'lucide-react';
import type { Appointment, Professional, Service } from '../types';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  topPx: number;
  heightPx: number;
  onTap: () => void;
}

function addMin(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const ICON_CFG: Record<string, { bg: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }> = {
  confirmada:        { bg: '#3E4983', Icon: Calendar },
  completada:        { bg: '#1B8959', Icon: Check },
  'no-show':         { bg: '#BE123C', Icon: X },
  reprogramada:      { bg: '#969696', Icon: CalendarClock },
  cancelada:         { bg: '#969696', Icon: X },
  'cancelada-tarde': { bg: '#BE123C', Icon: X },
  pendiente:         { bg: '#969696', Icon: Clock },
};

const PAYMENT_CFG: Record<string, { bg: string; color: string; label: string }> = {
  'pagado':           { bg: '#F4FDF9', color: '#1B8959', label: 'Pagada' },
  'pagado-anticipado':{ bg: '#F4FDF9', color: '#1B8959', label: 'Prepagada' },
  'pendiente':        { bg: '#F3F3F3', color: '#1E1E1E', label: 'Por cobrar' },
  'reembolsado':      { bg: '#F4FDF9', color: '#1B8959', label: 'Reembolsado' },
};

function StatusCircle({ status }: { status: string }) {
  const { bg, Icon } = ICON_CFG[status] ?? ICON_CFG.confirmada;
  return (
    <div className="shrink-0 size-6 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
      <Icon size={13} color="white" strokeWidth={2.5} />
    </div>
  );
}

/**
 * Appointment card positioned absolutely within a CalendarGrid content zone.
 * topPx and heightPx must be computed by the parent using cardTop() and cardHeight().
 */
export function AppointmentBlock({ appointment, professional, service, topPx, heightPx, onTap }: Props) {
  const endTime = addMin(appointment.startTime, service.duration);
  const isCompact = heightPx < 70;
  const paymentCfg = PAYMENT_CFG[appointment.paymentStatus] ?? PAYMENT_CFG['pendiente'];

  return (
    <button
      onClick={onTap}
      className="absolute left-0 right-0 bg-white rounded-[16px] overflow-hidden text-left active:opacity-70 transition-opacity"
      style={{ top: `${topPx}px`, height: `${heightPx}px` }}
    >
      <div
        className={`flex gap-[12px] h-full ${isCompact ? 'items-center px-[12px] py-[4px]' : 'items-start p-[12px]'}`}
      >
        <StatusCircle status={appointment.status} />

        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
          {/* Fila 1 — nombre + tag profesional */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="flex-1 min-w-0 text-[12px] font-semibold leading-[16px] truncate"
              style={{ color: appointment.clientName ? '#1E1E1E' : '#969696' }}
            >
              {appointment.clientName ?? 'Sin cliente'}
            </span>
            <div
              className="shrink-0 inline-flex items-center rounded-[100px] px-[12px]"
              style={{ height: '25px', backgroundColor: '#F7F8FB' }}
            >
              <span className="text-[12px] font-medium leading-[16px]" style={{ color: '#3E4983' }}>
                {professional.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Fila 2 — horario */}
          <span className="text-[12px] font-medium leading-[16px] whitespace-nowrap" style={{ color: '#1E1E1E' }}>
            {appointment.startTime} - {endTime}
          </span>

          {/* Fila 3 — servicio + tag pago (solo modo completo) */}
          {!isCompact && (
            <div className="flex items-center justify-between gap-2 mt-[2px]">
              <span className="flex-1 min-w-0 text-[12px] font-normal leading-[16px] truncate" style={{ color: '#606060' }}>
                {service.name}
              </span>
              <div
                className="shrink-0 inline-flex items-center rounded-[100px] px-[12px]"
                style={{ height: '25px', backgroundColor: paymentCfg.bg }}
              >
                <span className="text-[12px] font-medium leading-[16px]" style={{ color: paymentCfg.color }}>
                  {paymentCfg.label}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
