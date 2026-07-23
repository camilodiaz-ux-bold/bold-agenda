import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { Bell, ChevronDown, AlertTriangle, CalendarOff, Users } from 'lucide-react';
import { PROFESSIONALS, SERVICES, formatDuration } from '../data/appointments';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { ServiceClosureDrawer, type ClosureResult } from '../components/ServiceClosureDrawer';
import { timeToMin, minToTime, PROTOTYPE_TODAY } from '../store/prototypeStore';
import type { Appointment, Professional, Service, SaleRecord, Role, AvailabilityBlock, Branch, Client } from '../types';

interface Props {
  role: Role;
  viewScope: 'team' | 'mine';
  onViewScopeChange: (scope: 'team' | 'mine') => void;
  appointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
  activeBranchId: string;
  branches: Branch[];
  clients?: Client[];
  onBranchChange: (id: string) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onAddSaleRecord: (sale: SaleRecord) => void;
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
  onOpenEdit: (apt: Appointment) => void;
  onOpenAvailability: (showProfSelector: boolean) => void;
  jumpToDate?: string;
  onJumpHandled: () => void;
}

const DEMO_NOW = '13:30';
const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const STAFF_PROF_ID = 'p1';
const TOTAL_WEEKS = 5;
const CENTER_WEEK_IDX = 2;

function shiftDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getMondayOf(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  return new Date(y, m - 1, d + offset);
}

function getMondayStr(dateStr: string): string {
  const mon = getMondayOf(dateStr);
  return `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, '0')}-${String(mon.getDate()).padStart(2, '0')}`;
}

function isSameWeek(a: string, b: string): boolean {
  return getMondayStr(a) === getMondayStr(b);
}

function formatDateHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString('es-CO', { month: 'long' });
  const dayAndMonth = `${dayNum} de ${monthName}`;
  if (dateStr === PROTOTYPE_TODAY) return `Hoy, ${dayAndMonth}`;
  if (dateStr === shiftDate(PROTOTYPE_TODAY, 1)) return `Mañana, ${dayAndMonth}`;
  const weekday = date.toLocaleDateString('es-CO', { weekday: 'long' });
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dayAndMonth}`;
}

interface ConflictInfo { profName: string; startTime: string; endTime: string }

function getConflictInfo(apt: Appointment, blocks: AvailabilityBlock[], services: Service[]): ConflictInfo | null {
  if (['cancelada', 'cancelada-tarde', 'completada', 'no-show'].includes(apt.status)) return null;
  const profBlocks = blocks.filter(b => b.professionalId === apt.professionalId && b.date === apt.date);
  const profName = PROFESSIONALS.find(p => p.id === apt.professionalId)?.name.split(' ')[0] ?? 'la profesional';
  const fullDay = profBlocks.find(b => b.type === 'full-day');
  if (fullDay) return { profName, startTime: '08:00', endTime: '19:00' };
  const svc = services.find(s => s.id === apt.serviceId);
  if (!svc) return null;
  const aptStart = timeToMin(apt.startTime);
  const aptEnd = aptStart + svc.duration;
  for (const b of profBlocks) {
    if (b.type !== 'range') continue;
    const bStart = timeToMin(b.startTime!);
    const bEnd = timeToMin(b.endTime!);
    if (aptStart < bEnd && aptEnd > bStart) return { profName, startTime: b.startTime!, endTime: b.endTime! };
  }
  return null;
}

// Generate 5 weeks (2 before + current + 2 after) relative to PROTOTYPE_TODAY
function buildAllWeeks(): string[][] {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const weekMon = getMondayStr(shiftDate(PROTOTYPE_TODAY, (i - CENTER_WEEK_IDX) * 7));
    return Array.from({ length: 7 }, (_, j) => shiftDate(weekMon, j));
  });
}

const ALL_WEEKS = buildAllWeeks();

export function AgendaPage({
  role, viewScope, onViewScopeChange, appointments, availabilityBlocks,
  activeBranchId, branches, clients = [],
  onBranchChange, onUpdateAppointment, onAddSaleRecord, onOpenDrawer, onCloseDrawer, onOpenEdit,
  onOpenAvailability, jumpToDate, onJumpHandled,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(PROTOTYPE_TODAY);
  const [profFilter, setProfFilter] = useState<string>('all');
  const [showScopeSheet, setShowScopeSheet] = useState(false);
  const [showBranchSheet, setShowBranchSheet] = useState(false);
  const [viewProfId, setViewProfId] = useState(STAFF_PROF_ID);

  const isAdmin = role === 'admin';
  const isTeam = isAdmin && viewScope === 'team';

  const activeBranch = branches.find(b => b.id === activeBranchId);

  // Jump to date from external (e.g. after creating appointment)
  useEffect(() => {
    if (jumpToDate) {
      setSelectedDate(jumpToDate);
      onJumpHandled();
    }
  }, [jumpToDate]);

  // Which week index contains selectedDate
  const selectedWeekIdx = useMemo(
    () => ALL_WEEKS.findIndex(week => isSameWeek(week[0], selectedDate)),
    [selectedDate]
  );

  // Day strip scroll logic
  const stripRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const ignoreScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const targetLeft = selectedWeekIdx * el.offsetWidth;

    if (!initializedRef.current) {
      const frame = requestAnimationFrame(() => {
        el.scrollLeft = selectedWeekIdx * el.offsetWidth;
        initializedRef.current = true;
      });
      return () => cancelAnimationFrame(frame);
    }

    if (Math.abs(el.scrollLeft - targetLeft) < 5) return;
    ignoreScrollRef.current = true;
    el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    const t = setTimeout(() => { ignoreScrollRef.current = false; }, 500);
    return () => clearTimeout(t);
  }, [selectedWeekIdx]);

  function handleStripScroll() {
    if (ignoreScrollRef.current) return;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const el = stripRef.current;
      if (!el) return;
      const weekIdx = Math.round(el.scrollLeft / el.offsetWidth);
      if (weekIdx === selectedWeekIdx) return;
      const week = ALL_WEEKS[weekIdx];
      if (!week) return;
      const dow = new Date(selectedDate + 'T12:00:00').getDay();
      const sameDay = week.find(d => new Date(d + 'T12:00:00').getDay() === dow) ?? week[1];
      setSelectedDate(sameDay);
    }, 150);
  }

  // Filter appointments to active branch then apply scope/prof filters
  const branchApts = useMemo(
    () => appointments.filter(a => (a.branchId ?? 'norte') === activeBranchId),
    [appointments, activeBranchId]
  );

  const dayAppointments = useMemo<Appointment[]>(() => {
    let apts = branchApts.filter(a => a.date === selectedDate);
    if (role === 'staff') {
      apts = apts.filter(a => a.professionalId === STAFF_PROF_ID);
    } else if (viewScope === 'mine') {
      apts = apts.filter(a => a.professionalId === viewProfId);
    } else if (profFilter !== 'all') {
      apts = apts.filter(a => a.professionalId === profFilter);
    }
    return [...apts].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [branchApts, selectedDate, profFilter, role, viewScope, viewProfId]);

  const metrics = useMemo(() => {
    const base = branchApts.filter(a => {
      if (a.date !== selectedDate) return false;
      if (role === 'staff') return a.professionalId === STAFF_PROF_ID;
      if (viewScope === 'mine') return a.professionalId === viewProfId;
      if (profFilter !== 'all') return a.professionalId === profFilter;
      return true;
    });
    const total = base.filter(a => !['cancelada', 'cancelada-tarde'].includes(a.status)).length;
    const confirmadas = base.filter(a => a.status === 'confirmada').length;
    return { total, confirmadas };
  }, [branchApts, selectedDate, role, viewScope, profFilter]);

  function handleClosure(result: ClosureResult) {
    const apt = appointments.find(a => a.id === result.appointmentId);
    const svc = apt ? SERVICES.find(s => s.id === apt.serviceId) : null;
    const prof = apt ? PROFESSIONALS.find(p => p.id === apt.professionalId) : null;
    if (apt) {
      onUpdateAppointment({
        ...apt,
        status: result.outcome === 'no-show' ? 'no-show' : 'completada',
        paymentStatus: result.paymentMethod ? 'pagado' : apt.paymentStatus,
        paymentMethod: result.paymentMethod ?? apt.paymentMethod,
        tip: result.tip > 0 ? result.tip : apt.tip,
      });
    }
    if (result.outcome === 'completada' && apt && svc && prof) {
      onAddSaleRecord({
        id: `sr-${Date.now()}`,
        appointmentId: result.appointmentId,
        clientName: apt.clientName,
        serviceId: svc.id,
        professionalId: prof.id,
        serviceValue: apt.originalPrice ?? svc.price,
        tip: result.tip,
        total: (apt.originalPrice ?? svc.price) + result.tip,
        paymentMethod: result.paymentMethod ?? 'anticipado',
        paymentStatus: result.paymentMethod ? 'pagado' : 'pagado-anticipado',
        commission: Math.round((apt.originalPrice ?? svc.price) * prof.commissionRate),
        completedAt: new Date().toISOString(),
      });
    }
  }

  function openClosure(apt: Appointment, prof: Professional, svc: Service) {
    onOpenDrawer(
      <ServiceClosureDrawer appointment={apt} professional={prof} service={svc}
        onClose={onCloseDrawer} onComplete={handleClosure}
        onReschedule={() => { onCloseDrawer(); setTimeout(() => onOpenEdit(apt), 320); }}
      />, 'Cierre del servicio', '78%'
    );
  }

  function openDetail(apt: Appointment) {
    const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
    const svc = SERVICES.find(s => s.id === apt.serviceId)!;
    onOpenDrawer(
      <AppointmentDetailDrawer appointment={apt} professional={prof} service={svc}
        clients={clients}
        onClosure={() => openClosure(apt, prof, svc)}
        onEdit={() => { onCloseDrawer(); setTimeout(() => onOpenEdit(apt), 320); }}
        onViewClient={onCloseDrawer}
        onAssignClient={(client) => {
          onUpdateAppointment({ ...apt, clientName: client.name, clientPhone: client.phone, clientCedula: client.cedula });
          onCloseDrawer();
        }}
      />, undefined, '88%'
    );
  }

  const isToday = selectedDate === PROTOTYPE_TODAY;

  type ListItem =
    | { type: 'appointment'; apt: Appointment }
    | { type: 'now' }
    | { type: 'gap'; fromTime: string; toTime: string; durationMin: number };

  const listItems = useMemo<ListItem[]>(() => {
    if (dayAppointments.length === 0) return [];
    const nowMin = isToday ? timeToMin(DEMO_NOW) : -1;
    const items: ListItem[] = [];
    let maxEndMin = -1;
    let nowInserted = !isToday;
    for (const apt of dayAppointments) {
      const svc = SERVICES.find(s => s.id === apt.serviceId)!;
      const startMin = timeToMin(apt.startTime);
      const endMin = startMin + svc.duration;
      if (maxEndMin >= 0 && startMin - maxEndMin > 15) {
        items.push({ type: 'gap', fromTime: minToTime(maxEndMin), toTime: minToTime(startMin), durationMin: startMin - maxEndMin });
        if (!nowInserted && nowMin >= maxEndMin && nowMin <= startMin) { items.push({ type: 'now' }); nowInserted = true; }
      } else if (!nowInserted && nowMin >= 0 && nowMin <= startMin) {
        items.push({ type: 'now' }); nowInserted = true;
      }
      items.push({ type: 'appointment', apt });
      maxEndMin = maxEndMin < 0 ? endMin : Math.max(maxEndMin, endMin);
    }
    if (!nowInserted) items.push({ type: 'now' });
    return items;
  }, [dayAppointments, isToday]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-white px-4 pt-3 pb-3 rounded-b-[24px]">

        {/* Row 1: Branch selector + notification bell */}
        <div className="flex items-center -mx-1">
          <button
            onClick={() => setShowBranchSheet(true)}
            className="flex items-center gap-1 flex-1 min-w-0 px-1 h-11 active:opacity-70 transition-opacity"
          >
            <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] truncate">
              {activeBranch?.name ?? 'Salón Camila Norte'}
            </span>
            <ChevronDown size={14} color="#1e1e1e" strokeWidth={2.5} className="shrink-0" />
          </button>
          <button
            className="w-11 h-11 flex items-center justify-center transition-opacity active:opacity-60 shrink-0"
            aria-label="Notificaciones"
          >
            <Bell size={22} color="#121e6c" strokeWidth={1.8} />
          </button>
        </div>

        {/* Day strip: swipeable 5 weeks, navy active pill */}
        <div
          ref={stripRef}
          onScroll={handleStripScroll}
          className="flex overflow-x-auto -mx-4 mt-1"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {ALL_WEEKS.map((week, wi) => (
            <div
              key={wi}
              className="flex shrink-0"
              style={{ minWidth: '100%', scrollSnapAlign: 'start', padding: '0 16px' }}
            >
              {week.map((dateStr, di) => {
                const isSelected = dateStr === selectedDate;
                const hasDot = branchApts.some(a => a.date === dateStr && !['cancelada', 'cancelada-tarde'].includes(a.status));
                const label = WEEK_LABELS[di];
                const dayNum = parseInt(dateStr.split('-')[2], 10);
                return (
                  <button
                    key={dateStr}
                    onClick={() => { setSelectedDate(dateStr); setProfFilter('all'); }}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-full transition-all active:opacity-70"
                    style={{ backgroundColor: isSelected ? '#121e6c' : 'transparent' }}
                  >
                    <span className="text-[10px] font-normal leading-none"
                      style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#121e6c' }}>{label}</span>
                    <span className="text-[13px] font-bold leading-none"
                      style={{ color: isSelected ? '#fff' : '#121e6c' }}>{dayNum}</span>
                    <div className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: hasDot ? (isSelected ? 'rgba(255,255,255,0.5)' : '#121e6c') : 'transparent' }} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 px-4 pt-4">{/* gap-[24px] per Figma */}

        {/* Info card: scope + date + availability icon + metrics */}
        <div
          className="bg-white rounded-[12px] px-4 py-3 flex flex-col gap-5"
          style={{ boxShadow: '0px 4px 6px rgba(18,30,108,0.08)' }}
        >
          {/* Card header */}
          <div className="flex items-start gap-1">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* Scope selector */}
              {isAdmin ? (
                <button
                  onClick={() => setShowScopeSheet(true)}
                  className="flex items-center gap-1 active:opacity-70 transition-opacity w-fit"
                >
                  <span className="text-[14px] font-bold text-[#121e6c] leading-[20px]">
                    {viewScope === 'team'
                      ? 'Agenda del equipo'
                      : (PROFESSIONALS.find(p => p.id === viewProfId)?.name ?? 'Camila Vargas')}
                  </span>
                  <ChevronDown size={14} color="#121e6c" strokeWidth={2.5} className="shrink-0" />
                </button>
              ) : (
                <span className="text-[14px] font-bold text-[#121e6c] leading-[20px]">Mi agenda</span>
              )}
              {/* Date subtitle */}
              <p className="text-[12px] font-normal text-[#1e1e1e] leading-[16px]">
                {formatDateHeader(selectedDate)}
              </p>
            </div>
            {/* CalendarOff / block availability */}
            {isAdmin && (
              <button
                onClick={() => onOpenAvailability(viewScope === 'team')}
                className="w-9 h-9 flex items-center justify-center transition-opacity active:opacity-60 shrink-0"
                aria-label="Bloquear disponibilidad"
              >
                <CalendarOff size={22} color="#121e6c" strokeWidth={1.8} />
              </button>
            )}
          </div>

          {/* Metric cells */}
          <div className="flex gap-2">
            <div className="flex-1 rounded-[12px] px-3 py-[10px] flex flex-col gap-1" style={{ backgroundColor: '#f3f3f3' }}>
              <span className="text-[10px] font-normal text-[#1e1e1e] leading-[16px]">Citas</span>
              <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] tabular-nums">{metrics.total}</span>
            </div>
            <div className="flex-1 rounded-[12px] px-3 py-[10px] flex flex-col gap-1" style={{ backgroundColor: '#f4fdf9' }}>
              <span className="text-[10px] font-normal text-[#1e1e1e] leading-[16px]">Confirmadas</span>
              <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] tabular-nums">{metrics.confirmadas}</span>
            </div>
          </div>
        </div>

        {/* Filter tabs — underline style, visible only in team view */}
        {isTeam && (
          <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {/* All */}
            <button
              onClick={() => setProfFilter('all')}
              className="flex flex-col items-center gap-1 shrink-0 pb-0.5 active:opacity-70"
            >
              <span
                className="text-[14px] leading-[20px] whitespace-nowrap"
                style={{ fontWeight: profFilter === 'all' ? 600 : 400, color: '#121e6c' }}
              >
                Todos
              </span>
              <div
                className="h-0.5 w-full rounded-full transition-all"
                style={{ backgroundColor: profFilter === 'all' ? '#121e6c' : 'transparent' }}
              />
            </button>
            {PROFESSIONALS.map(prof => {
              const isActive = profFilter === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => setProfFilter(isActive ? 'all' : prof.id)}
                  className="flex flex-col items-center gap-1 shrink-0 pb-0.5 active:opacity-70"
                >
                  <span
                    className="text-[14px] leading-[20px] whitespace-nowrap"
                    style={{ fontWeight: isActive ? 600 : 400, color: '#121e6c' }}
                  >
                    {prof.name.split(' ')[0]}
                  </span>
                  <div
                    className="h-0.5 w-full rounded-full transition-all"
                    style={{ backgroundColor: isActive ? '#121e6c' : 'transparent' }}
                  />
                </button>
              );
            })}
            <div className="w-2 shrink-0" />
          </div>
        )}
      </div>

      {/* ── Appointment list ──────────────────────────────────────────── */}
      <div className="flex-1 px-4 pt-3 pb-4 flex flex-col gap-3">
        {dayAppointments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0px 2px 8px rgba(18,30,108,0.08)' }}>
              <Bell size={24} color="#d2d4e1" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#121e6c]">Sin citas este día</p>
              <p className="text-xs text-[#969696] mt-1">Tarde libre</p>
            </div>
          </div>
        ) : (
          listItems.map((item, idx) => {
            if (item.type === 'now') {
              return (
                <div key="ahora" className="flex items-center gap-2 my-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#FF2947' }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: '#FF2947', opacity: 0.3 }} />
                  <span className="text-[11px] font-bold tabular-nums shrink-0" style={{ color: '#FF2947' }}>{DEMO_NOW}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#FF2947', opacity: 0.3 }} />
                  <span className="text-[10px] font-bold shrink-0 tracking-wide" style={{ color: '#FF2947' }}>AHORA</span>
                </div>
              );
            }
            if (item.type === 'gap') {
              return (
                <div key={`gap-${item.fromTime}`} className="flex items-center gap-3 py-0.5">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaf0' }} />
                  <span className="text-[11px] font-medium shrink-0" style={{ color: '#b0b5c8' }}>libre {formatDuration(item.durationMin)}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaf0' }} />
                </div>
              );
            }
            const apt = item.apt;
            const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
            const svc = SERVICES.find(s => s.id === apt.serviceId)!;
            const conflictInfo = getConflictInfo(apt, availabilityBlocks, SERVICES);
            return (
              <div key={apt.id + String(idx)}>
                {conflictInfo && (
                  <button
                    onClick={() => onOpenEdit(apt)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl mb-1 text-left active:opacity-70"
                    style={{ backgroundColor: '#FFFBEB' }}
                  >
                    <AlertTriangle size={12} color="#B45309" strokeWidth={2} className="shrink-0" />
                    <span className="text-[11px] text-[#B45309] font-semibold">
                      Esta cita se cruza con un bloqueo de {conflictInfo.profName}, {conflictInfo.startTime}–{conflictInfo.endTime}
                    </span>
                  </button>
                )}
                <AppointmentCard appointment={apt} professional={prof} service={svc} onTap={() => openDetail(apt)} />
              </div>
            );
          })
        )}
        <div className="h-36" />
      </div>

      {/* Branch selector sheet */}
      {showBranchSheet && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowBranchSheet(false)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Cambiar sucursal</p>
            {branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => { onBranchChange(branch.id); setShowBranchSheet(false); }}
                className="w-full flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 active:opacity-70"
              >
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold" style={{ color: activeBranchId === branch.id ? '#121e6c' : '#1e1e1e' }}>
                    {branch.name}
                  </p>
                  <p className="text-xs text-[#969696]">{branch.address} · {branch.neighborhood}</p>
                </div>
                {activeBranchId === branch.id && (
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#FF2947' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scope sheet */}
      {showScopeSheet && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowScopeSheet(false)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Cambiar vista</p>

            {/* Team option */}
            <button
              onClick={() => { onViewScopeChange('team'); setProfFilter('all'); setShowScopeSheet(false); }}
              className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100 active:opacity-70"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: viewScope === 'team' ? '#121e6c' : '#f7f8fb' }}>
                <Users size={16} color={viewScope === 'team' ? '#fff' : '#606060'} strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: viewScope === 'team' ? '#121e6c' : '#1e1e1e' }}>
                  Agenda del equipo
                </p>
                <p className="text-xs text-[#969696]">Todas las agendas</p>
              </div>
              {viewScope === 'team' && (
                <span className="text-xs font-bold shrink-0" style={{ color: '#FF2947' }}>✓</span>
              )}
            </button>

            {/* Individual professional options */}
            {PROFESSIONALS.map((prof, i) => {
              const isActive = viewScope === 'mine' && viewProfId === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => {
                    onViewScopeChange('mine');
                    setViewProfId(prof.id);
                    setProfFilter('all');
                    setShowScopeSheet(false);
                  }}
                  className="w-full flex items-center gap-3 py-3.5 active:opacity-70"
                  style={{ borderBottom: i < PROFESSIONALS.length - 1 ? '1px solid #f3f3f3' : 'none' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ backgroundColor: isActive ? prof.color : '#f7f8fb', color: isActive ? '#fff' : '#606060' }}
                  >
                    {prof.initials}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>
                      {prof.name}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-xs font-bold shrink-0" style={{ color: '#FF2947' }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
