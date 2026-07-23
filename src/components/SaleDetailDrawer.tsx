import { Calendar, Clock } from 'lucide-react';
import type { SaleRecord } from '../types';
import { PROFESSIONALS, SERVICES, formatCOP } from '../data/appointments';
import { StatusBadge } from './StatusBadge';

interface Props {
  record: SaleRecord;
  onClose: () => void;
}

const SECTION_LABEL = 'text-[10px] font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2';

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR Pago',
  link: 'Link de pago',
  anticipado: 'Prepagado',
};

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase());
}

export function SaleDetailDrawer({ record }: Props) {
  const prof = PROFESSIONALS.find(p => p.id === record.professionalId);
  const svc = SERVICES.find(s => s.id === record.serviceId);
  const dateStr = record.completedAt.slice(0, 10);
  const timeStr = record.completedAt.slice(11, 16);

  return (
    <div className="flex flex-col">
      {/* Professional bar */}
      <div
        className="mx-5 mt-1 mb-5 rounded-xl px-3 py-2.5 flex items-center gap-3"
        style={{ backgroundColor: '#f0f1f5' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#121e6c' }}
        >
          <span className="text-sm font-bold text-white">{prof?.initials ?? '?'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#121e6c] leading-tight">{prof?.name ?? '—'}</p>
          <p className="text-xs text-[#969696] leading-tight mt-0.5">{prof?.role ?? '—'}</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-8">
        {/* Cliente */}
        <div>
          <p className={SECTION_LABEL}>Cliente</p>
          <p className="text-sm font-bold text-[#1e1e1e]">{record.clientName}</p>
        </div>

        {/* Servicio + financial */}
        <div>
          <p className={SECTION_LABEL}>Servicio</p>
          <div className="bg-[#f7f8fb] rounded-xl px-3 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#1e1e1e]">{svc?.name ?? '—'}</p>
              <p className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(record.serviceValue)}</p>
            </div>
            <div className="h-px bg-gray-200 mt-2.5 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#606060]">
                Comisión ({prof ? Math.round(prof.commissionRate * 100) : '—'}%)
              </span>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#FF2947' }}>
                {formatCOP(record.commission)}
              </span>
            </div>
            {record.tip > 0 && (
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-[#606060]">Propina (100% tuya)</span>
                <span className="text-xs font-semibold text-[#15803D] tabular-nums">
                  + {formatCOP(record.tip)}
                </span>
              </div>
            )}
            <div className="h-px bg-gray-200 mt-2.5 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#121e6c]">Total cobrado</span>
              <span className="text-base font-bold text-[#121e6c] tabular-nums">
                {formatCOP(record.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Fecha y hora */}
        <div>
          <p className={SECTION_LABEL}>Fecha y hora</p>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} color="#b0b5c8" strokeWidth={2} />
            <p className="text-xs text-[#606060]">{formatFullDate(dateStr)}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock size={13} color="#b0b5c8" strokeWidth={2} />
            <p className="text-xs text-[#606060]">{timeStr}</p>
          </div>
        </div>

        {/* Pago */}
        <div>
          <p className={SECTION_LABEL}>Pago</p>
          <div className="flex items-center gap-2">
            <StatusBadge status={record.paymentStatus} size="md" />
            <span className="text-xs text-[#606060]">
              {PM_LABELS[record.paymentMethod] ?? record.paymentMethod}
            </span>
          </div>
        </div>

        {/* Reference */}
        {record.appointmentId && (
          <div>
            <p className={SECTION_LABEL}>Referencia de cita</p>
            <p className="text-xs text-[#b0b5c8] font-mono">{record.appointmentId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
