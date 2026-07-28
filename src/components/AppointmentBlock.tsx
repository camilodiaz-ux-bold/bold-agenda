import { Check, X, Calendar, CalendarClock, Clock, AlertTriangle } from 'lucide-react';
import type { Appointment, Professional, Service } from '../types';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  topPx: number;
  heightPx: number;
  column?: number;       // columna en grupo de solapamiento (0-indexed, default: 0)
  totalColumns?: number; // total de columnas en el grupo (default: 1)
  hasConflict?: boolean; // esta cita coincide con un bloqueo de disponibilidad
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
  'pagado':            { bg: '#F4FDF9', color: '#1B8959', label: 'Pagada' },
  'pagado-anticipado': { bg: '#F4FDF9', color: '#1B8959', label: 'Prepagada' },
  'pendiente':         { bg: '#F3F3F3', color: '#1E1E1E', label: 'Por cobrar' },
  'reembolsado':       { bg: '#F4FDF9', color: '#1B8959', label: 'Reembolsado' },
};

function StatusCircle({ status }: { status: string }) {
  const { bg, Icon } = ICON_CFG[status] ?? ICON_CFG.confirmada;
  return (
    <div className="shrink-0 size-6 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
      <Icon size={13} color="white" strokeWidth={2.5} />
    </div>
  );
}

export function AppointmentBlock({
  appointment, professional, service, topPx, heightPx,
  column = 0, totalColumns = 1, hasConflict = false, onTap,
}: Props) {
  const endTime = addMin(appointment.startTime, service.duration);
  const isCompact = heightPx < 72;
  const paymentCfg = PAYMENT_CFG[appointment.paymentStatus] ?? PAYMENT_CFG['pendiente'];

  // Distribución de ancho para columnas en solapamiento
  const colPct = 100 / totalColumns;
  const leftPct = column * colPct;

  return (
    <button
      onClick={onTap}
      className="absolute text-left active:opacity-75 transition-opacity overflow-hidden rounded-[14px]"
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: `${leftPct}%`,
        width: `${colPct}%`,
        zIndex: 2,
      }}
    >
      <div
        className="relative h-full bg-white rounded-[14px] overflow-hidden"
        style={{
          boxShadow: '0px 1px 4px rgba(18,30,108,0.10), 0px 0px 0px 1px rgba(18,30,108,0.06)',
          display: 'flex',
          gap: '10px',
          padding: isCompact ? '4px 10px' : '10px',
          alignItems: isCompact ? 'center' : 'flex-start',
        }}
      >
        <StatusCircle status={appointment.status} />

        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
          {/* Nombre + tag profesional */}
          <div className="flex items-center justify-between gap-1">
            <span
              className="flex-1 min-w-0 text-[12px] font-semibold leading-[16px] truncate"
              style={{ color: '#1E1E1E' }}
            >
              {appointment.clientName ?? 'Sin cliente'}
            </span>
            {!isCompact && (
              <div
                className="shrink-0 inline-flex items-center rounded-[100px] px-[8px]"
                style={{ height: '22px', backgroundColor: '#F7F8FB' }}
              >
                <span className="text-[11px] font-medium leading-[16px]" style={{ color: '#3E4983' }}>
                  {professional.name.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Horario */}
          <span className="text-[11px] font-medium leading-[14px] whitespace-nowrap" style={{ color: '#606060' }}>
            {appointment.startTime} – {endTime}
          </span>

          {/* Servicio + pago (solo modo completo) */}
          {!isCompact && (
            <div className="flex items-center justify-between gap-1 mt-[2px]">
              <span className="flex-1 min-w-0 text-[11px] font-normal leading-[14px] truncate" style={{ color: '#969696' }}>
                {service.name}
              </span>
              <div
                className="shrink-0 inline-flex items-center rounded-[100px] px-[8px]"
                style={{ height: '22px', backgroundColor: paymentCfg.bg }}
              >
                <span className="text-[11px] font-medium leading-[16px]" style={{ color: paymentCfg.color }}>
                  {paymentCfg.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Indicador de conflicto con bloqueo */}
        {hasConflict && (
          <div className="absolute top-[4px] right-[4px] pointer-events-none">
            <AlertTriangle size={12} color="#F59E0B" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </button>
  );
}
