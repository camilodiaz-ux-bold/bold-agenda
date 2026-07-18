import { useState, useMemo, type ReactNode } from 'react';
import { PageHeader } from '../components/PageHeader';
import { formatCOP, PROFESSIONALS, SERVICES } from '../data/appointments';
import { SaleDetailDrawer } from '../components/SaleDetailDrawer';
import type { SaleRecord, Role } from '../types';

interface Props {
  role: Role;
  salesRecords: SaleRecord[];
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
}

type Period = 'hoy' | 'semana' | 'mes';

const TODAY = '2026-07-16';
const WEEK_START = '2026-07-13';
const WEEK_END = '2026-07-19';
const MONTH_PREFIX = '2026-07';
const STAFF_PROF_ID = 'p1';

const PERIOD_LABELS: Record<Period, string> = { hoy: 'Hoy', semana: 'Semana', mes: 'Mes' };

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR',
  link: 'Link',
  anticipado: 'Prepagado',
};

function filterByPeriod(records: SaleRecord[], period: Period): SaleRecord[] {
  const dateOf = (r: SaleRecord) => r.completedAt.slice(0, 10);
  switch (period) {
    case 'hoy': return records.filter(r => dateOf(r) === TODAY);
    case 'semana': return records.filter(r => dateOf(r) >= WEEK_START && dateOf(r) <= WEEK_END);
    case 'mes': return records.filter(r => dateOf(r).startsWith(MONTH_PREFIX));
  }
}

function formatSaleDate(completedAt: string): string {
  const [y, m, d] = completedAt.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export function VentasPage({ role, salesRecords, onOpenDrawer, onCloseDrawer }: Props) {
  const [period, setPeriod] = useState<Period>('hoy');

  const filtered = useMemo(() => {
    let records = filterByPeriod(salesRecords, period);
    if (role === 'staff') records = records.filter(r => r.professionalId === STAFF_PROF_ID);
    return [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }, [salesRecords, period, role]);

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

      {/* Period selector */}
      <div className="bg-white px-4 pb-3 border-b border-gray-100">
        <div className="flex bg-[#f3f3f3] rounded-full p-1 gap-0.5">
          {(['hoy', 'semana', 'mes'] as Period[]).map(p => {
            const isActive = p === period;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="flex-1 text-center py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#121e6c' : '#969696',
                  boxShadow: isActive ? '0 1px 3px rgba(18,30,108,0.08)' : 'none',
                }}
              >
                {PERIOD_LABELS[p]}
              </button>
            );
          })}
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
                  {/* Professional avatar */}
                  <div
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: '#e8eaf0' }}
                  >
                    <span className="text-xs font-bold" style={{ color: '#606060' }}>
                      {prof?.initials ?? '?'}
                    </span>
                  </div>
                  {/* Content */}
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
