import { Check, AlertCircle, Calendar, BadgeCheck } from 'lucide-react';
import type { Appointment, Service } from '../types';

interface Props {
  appointment: Appointment;
  service: Service;
  topPx: number;
  heightPx: number;
  column?: number;
  totalColumns?: number;
  row3Label?: string;
  onTap: () => void;
}

type Variant = 'finalizada' | 'no-asiste' | 'agendada' | 'pagada';

function getVariant(status: string, paymentStatus: string): Variant {
  if (status === 'no-show') return 'no-asiste';
  if (paymentStatus === 'pagado' || paymentStatus === 'pagado-anticipado') return 'pagada';
  if (status === 'completada') return 'finalizada';
  return 'agendada';
}

type IconComp = React.ComponentType<{ size: number; color: string; strokeWidth: number }>;

const VARIANTS: Record<Variant, {
  bg: string; border: string; text: string; label: string; Icon: IconComp;
}> = {
  finalizada: { bg: '#F4FDF9', border: '#1B8959', text: '#1B8959', label: 'Finalizada', Icon: Check },
  'no-asiste': { bg: '#FBF3F5', border: '#910022', text: '#910022', label: 'No asiste', Icon: AlertCircle },
  agendada:    { bg: '#F1F9FF', border: '#0A53A5', text: '#0A53A5', label: 'Agendada',  Icon: Calendar },
  pagada:      { bg: '#F7F8FB', border: '#3E4983', text: '#3E4983', label: 'Pagada',     Icon: BadgeCheck },
};

function addMin(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function AppointmentBlock({
  appointment, service, topPx, heightPx,
  column = 0, totalColumns = 1, row3Label, onTap,
}: Props) {
  const endTime = addMin(appointment.startTime, service.duration);
  const isCompact = heightPx <= 60;
  const v = VARIANTS[getVariant(appointment.status, appointment.paymentStatus)];

  const colPct = 100 / totalColumns;
  const leftPct = column * colPct;

  return (
    <button
      onClick={onTap}
      className="absolute text-left active:opacity-75 transition-opacity"
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: `${leftPct}%`,
        width: `${colPct}%`,
        zIndex: 2,
        padding: '0 2px',
      }}
    >
      <div
        className="h-full rounded-[16px] overflow-hidden flex flex-col"
        style={{
          backgroundColor: v.bg,
          padding: isCompact ? '6px 12px' : '12px',
        }}
      >
        {/* Row 1: nombre cliente + tag servicio */}
        <div className="flex items-center justify-between gap-[6px]">
          <span
            className="flex-1 min-w-0 text-[14px] font-medium leading-[20px] truncate"
            style={{ color: '#1E1E1E' }}
          >
            {appointment.clientName ?? 'Sin cliente'}
          </span>
          <div
            className="shrink-0 inline-flex items-center justify-center rounded-[100px]"
            style={{ height: '25px', backgroundColor: '#fff', padding: '0 10px' }}
          >
            <span
              className="text-[11px] font-medium leading-none"
              style={{ color: '#3E4983', maxWidth: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {service.name}
            </span>
          </div>
        </div>

        {/* Row 2: horario */}
        <span
          className="text-[12px] font-medium leading-[16px] whitespace-nowrap mt-[2px]"
          style={{ color: '#1E1E1E' }}
        >
          {appointment.startTime} – {endTime}
        </span>

        {/* Row 3: label izquierda + tag estado (solo cards completas) */}
        {!isCompact && (
          <div className="flex items-center justify-between gap-[6px] mt-auto">
            {row3Label ? (
              <span
                className="flex-1 min-w-0 text-[12px] font-normal leading-[16px] truncate"
                style={{ color: '#1E1E1E' }}
              >
                {row3Label}
              </span>
            ) : (
              <span />
            )}
            <div
              className="shrink-0 inline-flex items-center gap-[4px] rounded-[100px]"
              style={{
                height: '22px',
                padding: '0 8px',
                border: `1px solid ${v.border}`,
                backgroundColor: v.bg,
              }}
            >
              <v.Icon size={11} color={v.text} strokeWidth={2} />
              <span className="text-[10px] font-medium leading-none" style={{ color: v.text }}>
                {v.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
