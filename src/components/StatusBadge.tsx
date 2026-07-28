import {
  Calendar,
  CheckCircle2,
  UserX,
  CalendarClock,
  Clock,
  CreditCard,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import type { AppointmentStatus, PaymentStatus } from '../types';

type BadgeStatus = AppointmentStatus | PaymentStatus;

interface Config {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  bg: string;
  color: string;
  subtleColor: string;
}

const CONFIGS: Record<string, Config> = {
  confirmada: {
    label: 'Confirmada',
    Icon: Calendar,
    bg: '#F7F8FB',
    color: '#3E4983',
    subtleColor: '#3E4983',
  },
  completada: {
    label: 'Completada',
    Icon: CheckCircle2,
    bg: '#F4FDF9',
    color: '#1B8959',
    subtleColor: '#1B8959',
  },
  'no-show': {
    label: 'No llegó',
    Icon: UserX,
    bg: '#FFF1F2',
    color: '#BE123C',
    subtleColor: '#BE123C',
  },
  reprogramada: {
    label: 'Reprogramada',
    Icon: CalendarClock,
    bg: '#F7F8FB',
    color: '#606060',
    subtleColor: '#606060',
  },
  pendiente: {
    label: 'Por cobrar',
    Icon: Clock,
    bg: '#F3F3F3',
    color: '#1E1E1E',
    subtleColor: '#969696',
  },
  pagado: {
    label: 'Pagado',
    Icon: CheckCircle2,
    bg: '#F4FDF9',
    color: '#1B8959',
    subtleColor: '#1B8959',
  },
  'pagado-anticipado': {
    label: 'Prepagado',
    Icon: CreditCard,
    bg: '#F4FDF9',
    color: '#1B8959',
    subtleColor: '#1B8959',
  },
  cancelada: {
    label: 'Cancelada',
    Icon: XCircle,
    bg: '#F3F3F3',
    color: '#606060',
    subtleColor: '#606060',
  },
  'cancelada-tarde': {
    label: 'Cancelación tardía',
    Icon: XCircle,
    bg: '#FFF1F2',
    color: '#BE123C',
    subtleColor: '#BE123C',
  },
  reembolsado: {
    label: 'Reembolsado',
    Icon: RotateCcw,
    bg: '#F4FDF9',
    color: '#1B8959',
    subtleColor: '#1B8959',
  },
};

interface Props {
  status: BadgeStatus;
  size?: 'sm' | 'md';
  /** Subtle mode: text + tiny icon only, no pill background. For payment status in cards. */
  subtle?: boolean;
}

export function StatusBadge({ status, size = 'sm', subtle = false }: Props) {
  const config = CONFIGS[status] ?? CONFIGS['confirmada'];
  const { label, Icon, bg, color, subtleColor } = config;

  if (subtle) {
    return (
      <span
        className="inline-flex items-center gap-0.5 whitespace-nowrap font-medium"
        style={{ fontSize: '10px', color: subtleColor }}
      >
        <Icon size={9} color={subtleColor} strokeWidth={2.5} />
        {label}
      </span>
    );
  }

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
