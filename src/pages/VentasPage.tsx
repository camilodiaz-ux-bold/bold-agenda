import { useState, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { formatCOP, PROFESSIONALS, SERVICES, HISTORICAL_SALE_RECORDS } from '../data/appointments';
import { SaleDetailDrawer } from '../components/SaleDetailDrawer';
import type { SaleRecord, Role } from '../types';

interface Props {
  role: Role;
  salesRecords: SaleRecord[];
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
}

const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const STAFF_PROF_ID = 'p1';

const MONTH_NAMES_ES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Earliest month with data
const MIN_YEAR = 2026;
const MIN_MONTH = 5;

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR',
  link: 'Link',
  anticipado: 'Prepagado',
};

function formatSaleDate(completedAt: string): string {
  const [y, m, d] = completedAt.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function monthPrefix(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function VentasPage({ role, salesRecords, onOpenDrawer, onCloseDrawer }: Props) {
  const [viewYear, setViewYear] = useState(CURRENT_YEAR);
  const [viewMonth, setViewMonth] = useState(CURRENT_MONTH);

  const isCurrentMonth = viewYear === CURRENT_YEAR && viewMonth === CURRENT_MONTH;
  const canGoBack = !(viewYear === MIN_YEAR && viewMonth === MIN_MONTH);
  const canGoForward = !isCurrentMonth;

  function prevMonth() {
    if (!canGoBack) return;
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (!canGoForward) return;
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  // Merge dynamic store records with static historical records (dedup by id)
  const allRecords = useMemo(() => {
    const ids = new Set(salesRecords.map(r => r.id));
    return [...salesRecords, ...HISTORICAL_SALE_RECORDS.filter(r => !ids.has(r.id))];
  }, [salesRecords]);

  const filtered = useMemo(() => {
    const prefix = monthPrefix(viewYear, viewMonth);
    let records = allRecords.filter(r => r.completedAt.startsWith(prefix));
    if (role === 'staff') records = records.filter(r => r.professionalId === STAFF_PROF_ID);
    return [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }, [allRecords, viewYear, viewMonth, role]);

  const metrics = useMemo(() => ({
    ventas: filtered.reduce((s, r) => s + r.total, 0),
    servicios: filtered.length,
    propinas: filtered.reduce((s, r) => s + r.tip, 0),
    comisiones: filtered.reduce((s, r) => s + r.commission, 0),
  }), [filtered]);

  const isAdmin = role === 'admin';

  const metricCards = isAdmin
    ? [
        { label: 'Ventas totales', value: formatCOP(metrics.ventas) },
        { label: 'Servicios', value: String(metrics.servicios) },
        { label: 'Propinas', value: formatCOP(metrics.propinas) },
        { label: 'Comisiones equipo', value: formatCOP(metrics.comisiones) },
      ]
    : [
        { label: 'Mis ventas', value: formatCOP(metrics.ventas) },
        { label: 'Servicios', value: String(metrics.servicios) },
        { label: 'Mis propinas', value: formatCOP(metrics.propinas) },
        { label: 'Mi comisión', value: formatCOP(metrics.comisiones) },
      ];

  function openSaleDetail(record: SaleRecord) {
    onOpenDrawer(
      <SaleDetailDrawer record={record} onClose={onCloseDrawer} />,
      undefined,
      '82%'
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Ventas" subtitle={isAdmin ? 'Resumen del salón' : 'Tu resumen'} />

      {/* Month navigator */}
      <div className="bg-white px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            disabled={!canGoBack}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
            style={{ backgroundColor: '#f7f8fb' }}
          >
            <ChevronLeft size={18} color="#121e6c" strokeWidth={2.5} />
          </button>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-base font-bold text-[#121e6c] leading-none">
              {MONTH_NAMES_ES[viewMonth]} {viewYear}
            </span>
            {!isCurrentMonth && (
              <button
                onClick={() => { setViewYear(CURRENT_YEAR); setViewMonth(CURRENT_MONTH); }}
                className="text-[11px] font-semibold transition-opacity active:opacity-60"
                style={{ color: '#E8194B' }}
              >
                Ir al mes actual
              </button>
            )}
          </div>

          <button
            onClick={nextMonth}
            disabled={!canGoForward}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
            style={{ backgroundColor: '#f7f8fb' }}
          >
            <ChevronRight size={18} color="#121e6c" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {metricCards.map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl px-3 py-3 flex flex-col gap-1"
              style={{ boxShadow: '0px 1px 4px rgba(18,30,108,0.05)' }}
            >
              <span className="text-[10px] font-semibold text-[#b0b5c8] uppercase tracking-widest leading-none">
                {label}
              </span>
              <span className="text-base font-bold text-[#121e6c] tabular-nums leading-tight">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Sales list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-sm font-semibold text-[#121e6c]">Sin ventas en este periodo</p>
            <p className="text-xs text-[#969696]">Los cierres de servicio aparecerán aquí</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-20">
            {filtered.map(record => {
              const svc = SERVICES.find(s => s.id === record.serviceId);
              const prof = PROFESSIONALS.find(p => p.id === record.professionalId);
              return (
                <button
                  key={record.id}
                  onClick={() => openSaleDetail(record)}
                  className="w-full bg-white rounded-2xl px-3 py-3 text-left flex items-center gap-3 border border-gray-100 transition-all active:opacity-70"
                  style={{ boxShadow: '0px 1px 4px rgba(18,30,108,0.05)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: '#e8eaf0' }}
                  >
                    <span className="text-xs font-bold" style={{ color: '#606060' }}>
                      {prof?.initials ?? '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1e1e1e] truncate">{record.clientName}</span>
                      <span className="text-sm font-bold text-[#121e6c] tabular-nums shrink-0">
                        {formatCOP(record.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-[#969696] truncate">{svc?.name ?? '—'}</span>
                      <span className="text-xs text-[#b0b5c8] shrink-0">
                        {PM_LABELS[record.paymentMethod] ?? record.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] text-[#b0b5c8]">
                        {prof?.name.split(' ')[0] ?? '—'} · {formatSaleDate(record.completedAt)} · {record.completedAt.slice(11, 16)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
