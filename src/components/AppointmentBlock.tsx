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
  const v = VARIANTS[getVariant(appointment.status, appointment.paymentStatus)];

  // Cards < 90px (30-60 min): 2 filas con padding reducido.
  // Cards ≥ 90px (≥ 60 min): 3 filas con padding completo.
  const isCompact = heightPx < 90;
  // Para cards muy cortas (< 60px, ej. 30 min = 51px) reducir padding vertical más.
  const isTiny = heightPx < 60;

  const colPct = 100 / totalColumns;
  const leftPct = column * colPct;

  // Separación de 2px entre columnas solapadas (se descuenta del ancho, no del fondo)
  const rightGap = totalColumns > 1 && column < totalColumns - 1 ? 2 : 0;

  return (
    <button
      onClick={onTap}
      className="absolute text-left active:opacity-75 transition-opacity rounded-[16px] overflow-hidden flex flex-col"
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left: `${leftPct}%`,
        width: `calc(${colPct}% - ${rightGap}px)`,
        zIndex: 2,
        backgroundColor: v.bg,
        padding: isTiny ? '4px 12px' : (isCompact ? '6px 12px' : '12px'),
      }}
    >
      {/* Row 1: nombre cliente + tag servicio */}
      <div className="flex items-center justify-between gap-[6px] min-w-0">
        <span
          className="flex-1 min-w-0 text-[14px] font-medium leading-[20px] truncate"
          style={{ color: '#1E1E1E' }}
        >
          {appointment.clientName ?? 'Sin cliente'}
        </span>
        {!isTiny && (
          <div
            className="shrink-0 inline-flex items-center justify-center rounded-[100px]"
            style={{ height: '24px', backgroundColor: '#fff', padding: '0 8px', flexShrink: 0 }}
          >
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: '#3E4983', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {service.name}
            </span>
          </div>
        )}
      </div>

      {/* Row 2: horario */}
      <span
        className="text-[12px] font-medium leading-[16px] whitespace-nowrap mt-[2px]"
        style={{ color: '#1E1E1E' }}
      >
        {appointment.startTime} – {endTime}
      </span>

      {/* Row 3: label izquierda + tag estado — solo cards completas (≥ 90px) */}
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
    </button>
  );
}
