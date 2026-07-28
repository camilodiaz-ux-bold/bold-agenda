import { Check, X, Calendar, CalendarClock, Clock, User, CreditCard } from 'lucide-react';
import type { Appointment, Professional, Service } from '../types';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  onTap: () => void;
}

function addMin(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const ICON_CONFIG: Record<string, { bg: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }> = {
  confirmada:       { bg: '#3E4983', Icon: Calendar },
  completada:       { bg: '#1B8959', Icon: Check },
  'no-show':        { bg: '#BE123C', Icon: X },
  reprogramada:     { bg: '#969696', Icon: CalendarClock },
  cancelada:        { bg: '#969696', Icon: X },
  'cancelada-tarde':{ bg: '#BE123C', Icon: X },
  pendiente:        { bg: '#969696', Icon: Clock },
};

const STATUS_LABEL: Record<string, string> = {
  confirmada:       'Confirmada',
  completada:       'Completada',
  'no-show':        'No asistió',
  reprogramada:     'Reprogramada',
  cancelada:        'Cancelada',
  'cancelada-tarde':'Cancelada',
  pendiente:        'Por confirmar',
};

const PAYMENT_CONFIG: Record<string, { bg: string; color: string; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }> = {
  'pagado':          { bg: '#F4FDF9', color: '#1B8959', label: 'Pagada',      Icon: CreditCard },
  'pagado-anticipado':{ bg: '#F4FDF9', color: '#1B8959', label: 'Prepagada', Icon: CreditCard },
  'pendiente':       { bg: '#F3F3F3', color: '#1E1E1E', label: 'Por cobrar',  Icon: Clock },
  'reembolsado':     { bg: '#F4FDF9', color: '#1B8959', label: 'Reembolsado', Icon: Check },
};

function StatusCircle({ status }: { status: string }) {
  const cfg = ICON_CONFIG[status] ?? ICON_CONFIG.confirmada;
  const { bg, Icon } = cfg;
  return (
    <div
      className="shrink-0 size-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <Icon size={13} color="white" strokeWidth={2.5} />
    </div>
  );
}

export function AppointmentCard({ appointment, professional, service, onTap }: Props) {
  const endTime = addMin(appointment.startTime, service.duration);
  const statusLabel = STATUS_LABEL[appointment.status] ?? appointment.status;
  const paymentCfg = PAYMENT_CONFIG[appointment.paymentStatus] ?? PAYMENT_CONFIG['pendiente'];
  const PayIcon = paymentCfg.Icon;

  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white rounded-[16px] active:opacity-70 transition-opacity"
    >
      <div className="flex gap-[12px] items-start p-[12px]">

        {/* Icono de estado — círculo coloreado 24px */}
        <StatusCircle status={appointment.status} />

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">

          {/* Fila 1 — nombre + estado */}
          <div className="flex items-start justify-between gap-2">
            <span
              className="flex-1 min-w-0 text-[14px] font-medium leading-[20px] truncate"
              style={{ color: appointment.clientName ? '#1E1E1E' : '#969696', fontStyle: appointment.clientName ? 'normal' : 'italic' }}
            >
              {appointment.clientName ?? 'Sin cliente'}
            </span>
            <span className="text-[12px] font-normal leading-[16px] shrink-0 whitespace-nowrap" style={{ color: '#969696' }}>
              {statusLabel}
            </span>
          </div>

          {/* Fila 2 — hora + servicio */}
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] font-medium leading-[20px]" style={{ color: '#1E1E1E' }}>
              {appointment.startTime} -{endTime}
            </span>
            <span className="text-[12px] font-normal leading-[16px]" style={{ color: '#606060' }}>
              {service.name}
            </span>
          </div>

          {/* Fila 3 — tags */}
          <div className="flex items-center justify-between">
            {/* Tag profesional */}
            <div
              className="inline-flex items-center gap-[6px] rounded-[100px] px-[10px]"
              style={{ height: '25px', backgroundColor: '#F7F8FB' }}
            >
              <User size={12} color="#3E4983" strokeWidth={2} />
              <span className="text-[12px] font-medium leading-[16px]" style={{ color: '#3E4983' }}>
                {professional.name.split(' ')[0]}
              </span>
            </div>

            {/* Tag pago */}
            <div
              className="inline-flex items-center gap-[6px] rounded-[100px] px-[10px]"
              style={{ height: '25px', backgroundColor: paymentCfg.bg }}
            >
              <PayIcon size={12} color={paymentCfg.color} strokeWidth={2} />
              <span className="text-[12px] font-medium leading-[16px]" style={{ color: paymentCfg.color }}>
                {paymentCfg.label}
              </span>
            </div>
          </div>

        </div>
      </div>
    </button>
  );
}
