import {
  Calendar,
  CheckCircle2,
  UserX,
  CalendarClock,
  Clock,
  CreditCard,
} from 'lucide-react';
import type { AppointmentStatus, PaymentStatus } from '../types';

type BadgeStatus = AppointmentStatus | PaymentStatus;

interface Config {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  bg: string;
  color: string;
}

const CONFIGS: Record<string, Config> = {
  confirmada: {
    label: 'Confirmada',
    Icon: Calendar,
    bg: '#EFF6FF',
    color: '#1D4ED8',
  },
  completada: {
    label: 'Completada',
    Icon: CheckCircle2,
    bg: '#F0FDF4',
    color: '#15803D',
  },
  'no-show': {
    label: 'No llegó',
    Icon: UserX,
    bg: '#FFF1F2',
    color: '#BE123C',
  },
  reprogramada: {
    label: 'Reprogramada',
    Icon: CalendarClock,
    bg: '#F3F4F6',
    color: '#4B5563',
  },
  pendiente: {
    label: 'Por cobrar',
    Icon: Clock,
    bg: '#FFFBEB',
    color: '#B45309',
  },
  pagado: {
    label: 'Pagado',
    Icon: CheckCircle2,
    bg: '#F0FDF4',
    color: '#15803D',
  },
  'pagado-anticipado': {
    label: 'Prepagado',
    Icon: CreditCard,
    bg: '#FFF1F2',
    color: '#E8194B',
  },
};

interface Props {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const config = CONFIGS[status] ?? CONFIGS['confirmada'];
  const { label, Icon, bg, color } = config;

  const isMd = size === 'md';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap"
      style={{
        backgroundColor: bg,
        color,
        fontSize: isMd ? '12px' : '11px',
        padding: isMd ? '3px 8px' : '2px 7px',
      }}
    >
      <Icon size={isMd ? 12 : 11} color={color} strokeWidth={2.5} />
      {label}
    </span>
  );
}
