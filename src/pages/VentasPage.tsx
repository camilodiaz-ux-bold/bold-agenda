import { useState, useMemo, type ReactNode } from 'react';
import { Bell, ChevronDown, ChevronLeft, ChevronRight, X, Calendar, CreditCard, Link, Clock, QrCode, EyeOff } from 'lucide-react';
import { formatCOP, PROFESSIONALS, SERVICES, HISTORICAL_SALE_RECORDS } from '../data/appointments';
import { SaleDetailDrawer } from '../components/SaleDetailDrawer';
import { PROTOTYPE_TODAY } from '../store/prototypeStore';
import type { SaleRecord, Role, Branch } from '../types';

interface Props {
  role: Role;
  salesRecords: SaleRecord[];
  activeBranchId?: string;
  branches?: Branch[];
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
}

type Period = 'hoy' | 'semana' | 'mes' | 'personalizado';

const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 7;
const STAFF_PROF_ID = 'p1';
const MIN_WEEK_START = '2026-05-04';
const MIN_YEAR = 2026;
const MIN_MONTH = 5;

const MONTH_NAMES_ES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR',
  link: 'Link de pago',
  anticipado: 'Prepagado',
};

const PM_ICON: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  datafono: CreditCard,
  qr: QrCode,
  link: Link,
  anticipado: Clock,
};

function fmtDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getMondayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + offset);
  return fmtDate(date);
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return fmtDate(date);
}

function formatWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(y, m - 1, d + 6);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const endMonth = end.toLocaleDateString('es-CO', { month: 'short' });
  const endYear = end.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    return `${startDay}–${endDay} ${endMonth} ${endYear}`;
  }
  const startMonth = start.toLocaleDateString('es-CO', { month: 'short' });
  return `${startDay} ${startMonth}–${endDay} ${endMonth} ${endYear}`;
}

function monthPrefix(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatSaleDate(completedAt: string): string {
  const [y, m, d] = completedAt.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

export function VentasPage({ role, salesRecords, activeBranchId, branches, onOpenDrawer, onCloseDrawer }: Props) {
  const [period, setPeriod] = useState<Period>('hoy');
  const [viewYear, setViewYear] = useState(CURRENT_YEAR);
  const [viewMonth, setViewMonth] = useState(CURRENT_MONTH);
  const [viewWeekStart, setViewWeekStart] = useState(() => getMondayOf(PROTOTYPE_TODAY));
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [draftStart, setDraftStart] = useState('');
  const [draftEnd, setDraftEnd] = useState('');
  const [showCustomSheet, setShowCustomSheet] = useState(false);

  const currentWeekStart = getMondayOf(PROTOTYPE_TODAY);
  const isCurrentMonth = viewYear === CURRENT_YEAR && viewMonth === CURRENT_MONTH;
  const isCurrentWeek = viewWeekStart === currentWeekStart;
  const canGoBackMonth = !(viewYear === MIN_YEAR && viewMonth === MIN_MONTH);
  const canGoForwardMonth = !isCurrentMonth;
  const canGoBackWeek = viewWeekStart > MIN_WEEK_START;
  const canGoForwardWeek = !isCurrentWeek;

  const activeBranch = branches?.find(b => b.id === activeBranchId);
  const branchName = activeBranch?.name ?? 'Salón Camila Norte';

  function prevMonth() {
    if (!canGoBackMonth) return;
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (!canGoForwardMonth) return;
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  function prevWeek() {
    if (!canGoBackWeek) return;
    setViewWeekStart(w => addDays(w, -7));
  }

  function nextWeek() {
    if (!canGoForwardWeek) return;
    setViewWeekStart(w => addDays(w, 7));
  }

  const allRecords = useMemo(() => {
    const ids = new Set(salesRecords.map(r => r.id));
    return [...salesRecords, ...HISTORICAL_SALE_RECORDS.filter(r => !ids.has(r.id))];
  }, [salesRecords]);

  const filtered = useMemo(() => {
    let records: SaleRecord[];
    switch (period) {
      case 'hoy':
        records = allRecords.filter(r => r.completedAt.startsWith(PROTOTYPE_TODAY));
        break;
      case 'semana': {
        const weekEnd = addDays(viewWeekStart, 6);
        records = allRecords.filter(r => {
          const d = r.completedAt.slice(0, 10);
          return d >= viewWeekStart && d <= weekEnd;
        });
        break;
      }
      case 'mes':
        records = allRecords.filter(r => r.completedAt.startsWith(monthPrefix(viewYear, viewMonth)));
        break;
      case 'personalizado':
        if (customStart) {
          const end = customEnd >= customStart ? customEnd : customStart;
          records = allRecords.filter(r => {
            const d = r.completedAt.slice(0, 10);
            return d >= customStart && d <= end;
          });
        } else {
          records = [];
        }
        break;
      default:
        records = [];
    }
    if (role === 'staff') records = records.filter(r => r.professionalId === STAFF_PROF_ID);
    return [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }, [allRecords, period, viewYear, viewMonth, viewWeekStart, customStart, customEnd, role]);

  const metrics = useMemo(() => ({
    ventas: filtered.reduce((s, r) => s + r.total, 0),
    servicios: filtered.length,
    propinas: filtered.reduce((s, r) => s + r.tip, 0),
    comisiones: filtered.reduce((s, r) => s + r.commission, 0),
  }), [filtered]);

  const isAdmin = role === 'admin';

  function openSaleDetail(record: SaleRecord) {
    onOpenDrawer(
      <SaleDetailDrawer record={record} onClose={onCloseDrawer} />,
      undefined,
      '82%'
    );
  }

  function applyCustomRange() {
    if (!draftStart) return;
    setCustomStart(draftStart);
    setCustomEnd(draftEnd && draftEnd >= draftStart ? draftEnd : draftStart);
    setShowCustomSheet(false);
  }

  const resolvedEnd = customEnd && customEnd >= customStart ? customEnd : customStart;
  const customRangeLabel = customStart
    ? customStart === resolvedEnd
      ? formatDisplayDate(customStart)
      : `${formatDisplayDate(customStart)} – ${formatDisplayDate(resolvedEnd)}`
    : 'Seleccionar rango…';

  const showDashboard = period !== 'personalizado' || !!customStart;

  return (
    <div className="flex flex-col min-h-full relative">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-4">
        <div className="relative flex items-center" style={{ height: '36px' }}>
          <span className="text-[16px] font-bold text-[#121e6c] leading-[20px]">Ventas</span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-[2px]" style={{ maxWidth: '180px' }}>
              <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] truncate">
                {branchName}
              </span>
              <ChevronDown size={16} color="#1e1e1e" strokeWidth={2.5} className="shrink-0" />
            </div>
          </div>
          <button
            className="absolute right-0 w-6 h-6 flex items-center justify-center transition-opacity active:opacity-60"
            aria-label="Notificaciones"
          >
            <Bell size={24} color="#121e6c" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 px-4 pt-6">

        {/* APP Tabs */}
        <div className="flex gap-2" style={{ height: '37px' }}>
          {(['hoy', 'semana', 'mes'] as Period[]).map(p => {
            const isActive = p === period;
            const label = p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Esta semana' : 'Este mes';
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="flex items-center justify-center rounded-[100px] shrink-0 whitespace-nowrap transition-all active:opacity-80"
                style={{
                  height: '37px',
                  paddingLeft: isActive ? '20px' : '16px',
                  paddingRight: isActive ? '20px' : '16px',
                  backgroundColor: isActive ? '#121e6c' : 'white',
                  color: isActive ? 'white' : '#121e6c',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                }}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={() => setPeriod('personalizado')}
            className="flex items-center justify-center rounded-[100px] shrink-0 transition-all active:opacity-80"
            style={{
              width: '52px',
              height: '37px',
              backgroundColor: period === 'personalizado' ? '#121e6c' : 'white',
            }}
          >
            <Calendar size={20} color={period === 'personalizado' ? 'white' : '#121e6c'} strokeWidth={1.8} />
          </button>
        </div>

        {/* Sub-navigation — Semana */}
        {period === 'semana' && (
          <div className="flex items-center justify-between">
            <button
              onClick={prevWeek}
              disabled={!canGoBackWeek}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
              style={{ backgroundColor: '#f7f8fb' }}
            >
              <ChevronLeft size={16} color="#121e6c" strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-[#121e6c]">{formatWeekLabel(viewWeekStart)}</span>
              {!isCurrentWeek && (
                <button
                  onClick={() => setViewWeekStart(currentWeekStart)}
                  className="text-[11px] font-semibold active:opacity-60"
                  style={{ color: '#FF2947' }}
                >
                  Semana actual
                </button>
              )}
            </div>
            <button
              onClick={nextWeek}
              disabled={!canGoForwardWeek}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
              style={{ backgroundColor: '#f7f8fb' }}
            >
              <ChevronRight size={16} color="#121e6c" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Sub-navigation — Mes */}
        {period === 'mes' && (
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              disabled={!canGoBackMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
              style={{ backgroundColor: '#f7f8fb' }}
            >
              <ChevronLeft size={16} color="#121e6c" strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-[#121e6c]">{MONTH_NAMES_ES[viewMonth]} {viewYear}</span>
              {!isCurrentMonth && (
                <button
                  onClick={() => { setViewYear(CURRENT_YEAR); setViewMonth(CURRENT_MONTH); }}
                  className="text-[11px] font-semibold active:opacity-60"
                  style={{ color: '#FF2947' }}
                >
                  Mes actual
                </button>
              )}
            </div>
            <button
              onClick={nextMonth}
              disabled={!canGoForwardMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:opacity-60 disabled:opacity-25"
              style={{ backgroundColor: '#f7f8fb' }}
            >
              <ChevronRight size={16} color="#121e6c" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Sub-navigation — Personalizado */}
        {period === 'personalizado' && (
          <button
            onClick={() => { setDraftStart(customStart); setDraftEnd(customEnd); setShowCustomSheet(true); }}
            className="w-full h-9 rounded-xl border text-sm font-semibold px-3 flex items-center justify-between active:opacity-70 transition-opacity"
            style={{
              borderColor: customStart ? '#121e6c' : '#d2d4e1',
              backgroundColor: '#fff',
              color: customStart ? '#121e6c' : '#b0b5c8',
            }}
          >
            <span>{customRangeLabel}</span>
            <ChevronRight size={14} color={customStart ? '#121e6c' : '#b0b5c8'} strokeWidth={2} />
          </button>
        )}

        {/* APP Card / Dashboard */}
        {showDashboard && (
          <div
            className="bg-white rounded-[16px] p-[16px] flex flex-col gap-4"
            style={{ boxShadow: '0px 4px 6px rgba(18,30,108,0.08)' }}
          >
            {/* Primary info */}
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium text-[#1e1e1e] leading-[16px]">
                {isAdmin ? 'Ventas totales' : 'Mis ventas'}
              </span>
              <div className="flex items-center gap-5">
                <span className="text-[24px] font-normal text-[#1e1e1e] leading-[28px] tabular-nums">
                  {formatCOP(metrics.ventas)}
                </span>
                <EyeOff size={24} color="#1e1e1e" strokeWidth={1.5} />
              </div>
            </div>
            {/* Secondary info */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">Servicios</span>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#1e1e1e] leading-[20px] tabular-nums">
                    {metrics.servicios}
                  </span>
                  <EyeOff size={17} color="#1e1e1e" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">
                  {isAdmin ? 'Propinas' : 'Mis propinas'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#1e1e1e] leading-[20px] tabular-nums">
                    {formatCOP(metrics.propinas)}
                  </span>
                  <EyeOff size={17} color="#1e1e1e" strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">
                  {isAdmin ? 'Comisiones' : 'Mi comisión'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#1e1e1e] leading-[20px] tabular-nums">
                    {formatCOP(metrics.comisiones)}
                  </span>
                  <EyeOff size={17} color="#1e1e1e" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sale list / Empty state */}
        {period === 'personalizado' && !customStart ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-sm font-semibold text-[#121e6c]">Selecciona un rango de fechas</p>
            <p className="text-xs text-[#969696]">Toca el selector de arriba para elegir las fechas</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-sm font-semibold text-[#121e6c]">Sin ventas en este periodo</p>
            <p className="text-xs text-[#969696]">Los cierres de servicio aparecerán aquí</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-28">
            {filtered.map(record => {
              const svc = SERVICES.find(s => s.id === record.serviceId);
              const prof = PROFESSIONALS.find(p => p.id === record.professionalId);
              const Icon = PM_ICON[record.paymentMethod] ?? CreditCard;
              return (
                <button
                  key={record.id}
                  onClick={() => openSaleDetail(record)}
                  className="w-full bg-white rounded-[16px] text-left flex items-start gap-3 transition-all active:opacity-70"
                  style={{
                    padding: '12px 16px',
                    boxShadow: '0px 4px 6px rgba(18,30,108,0.08)',
                  }}
                >
                  {/* Icon container */}
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: '40px', height: '40px', backgroundColor: '#f7f8fb', padding: '8px' }}
                  >
                    <Icon size={24} color="#121e6c" strokeWidth={1.8} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Level 1: name + amount */}
                    <div className="flex items-center" style={{ height: '40px' }}>
                      <span className="flex-1 min-w-0 text-[14px] font-semibold text-[#1e1e1e] leading-[20px] truncate">
                        {record.clientName ?? 'Sin cliente'}
                      </span>
                      <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] tabular-nums whitespace-nowrap ml-2 shrink-0">
                        {formatCOP(record.total)}
                      </span>
                    </div>

                    {/* Level 2-5: key-value rows */}
                    <div className="flex flex-col gap-1">
                      {([
                        ['Servicio', svc?.name ?? '—'],
                        ['Método de cobro', PM_LABELS[record.paymentMethod] ?? record.paymentMethod],
                        ['Fecha y hora', `${formatSaleDate(record.completedAt)} · ${record.completedAt.slice(11, 16)}`],
                        ['Profesional', prof?.name.split(' ')[0] ?? '—'],
                      ] as [string, string][]).map(([label, value]) => (
                        <div key={label} className="flex items-start w-full">
                          <div className="flex-1 min-w-0">
                            <span className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">{label}</span>
                          </div>
                          <div className="shrink-0 ml-2">
                            <span className="text-[12px] font-medium text-[#1e1e1e] leading-[16px] whitespace-nowrap">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom range bottom sheet */}
      {showCustomSheet && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCustomSheet(false)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-1" />
            <div className="flex items-center justify-between mb-5 mt-2">
              <p className="text-sm font-bold text-[#121e6c]">Rango personalizado</p>
              <button onClick={() => setShowCustomSheet(false)} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100">
                <X size={16} color="#606060" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#606060]">Desde</label>
                <input
                  type="date"
                  value={draftStart}
                  max={PROTOTYPE_TODAY}
                  min="2026-05-01"
                  onChange={e => setDraftStart(e.target.value)}
                  className="w-full h-11 rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none"
                  style={{ borderColor: '#d2d4e1' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#606060]">Hasta</label>
                <input
                  type="date"
                  value={draftEnd}
                  min={draftStart || '2026-05-01'}
                  max={PROTOTYPE_TODAY}
                  onChange={e => setDraftEnd(e.target.value)}
                  className="w-full h-11 rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none"
                  style={{ borderColor: '#d2d4e1' }}
                />
              </div>
              <button
                onClick={applyCustomRange}
                disabled={!draftStart}
                className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ backgroundColor: '#FF2947' }}
              >
                Aplicar rango
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
