import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { Bell, ChevronDown, AlertTriangle, Users, User, Plus } from 'lucide-react';
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
  onNewApptAtSlot?: (date: string, time: string) => void;
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
  onOpenAvailability, onNewApptAtSlot, jumpToDate, onJumpHandled,
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
      <div className="px-4 pt-10 pb-4">

        {/* Row 1: Title | Branch (truly centered) | Bell */}
        <div className="relative flex items-center" style={{ height: '36px' }}>
          <span className="text-[16px] font-bold text-[#121e6c] leading-[20px]">Agenda</span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={() => setShowBranchSheet(true)}
              className="pointer-events-auto flex items-center gap-[2px] active:opacity-70 transition-opacity"
              style={{ maxWidth: '180px' }}
            >
              <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] truncate">
                {activeBranch?.name ?? 'Salón Camila Norte'}
              </span>
              <ChevronDown size={16} color="#1e1e1e" strokeWidth={2.5} className="shrink-0" />
            </button>
          </div>
          <button
            className="absolute right-0 w-6 h-6 flex items-center justify-center transition-opacity active:opacity-60"
            aria-label="Notificaciones"
          >
            <Bell size={24} color="#121e6c" strokeWidth={1.8} />
          </button>
        </div>

        {/* Day strip: swipeable 5 weeks, navy active pill */}
        <div
          ref={stripRef}
          onScroll={handleStripScroll}
          className="flex overflow-x-auto -mx-4 mt-3"
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
      <div className="flex flex-col gap-6 px-4 pt-4">

        {/* APP Card / Context — Figma: icon + name + date / two action buttons */}
        <div className="bg-white rounded-[16px] flex flex-col gap-[16px] p-[12px]">

          {/* Fila 1: icono + nombre + fecha */}
          <div className="flex items-center gap-[16px]">
            <div className="shrink-0">
              {isTeam
                ? <Users size={24} color="#3E4983" strokeWidth={2} />
                : <User size={24} color="#3E4983" strokeWidth={2} />
              }
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <span className="flex-1 min-w-0 text-[16px] font-medium leading-[22px] truncate" style={{ color: '#1E1E1E' }}>
                {isTeam
                  ? 'Equipo'
                  : isAdmin
                    ? (PROFESSIONALS.find(p => p.id === viewProfId)?.name ?? 'Camila Vargas')
                    : (PROFESSIONALS.find(p => p.id === STAFF_PROF_ID)?.name ?? 'Mi agenda')}
              </span>
              <span className="text-[12px] font-normal leading-[16px] shrink-0 whitespace-nowrap" style={{ color: '#606060' }}>
                {formatDateHeader(selectedDate)}
              </span>
            </div>
          </div>

          {/* Fila 2: botones de acción — solo admin */}
          {isAdmin && (
            <div className="flex items-center gap-[8px]">
              <button
                onClick={() => onOpenAvailability(isTeam)}
                className="flex-1 flex items-center justify-center rounded-[12px] h-[40px] active:opacity-70 transition-opacity"
                style={{ backgroundColor: '#F1F2F6' }}
              >
                <span className="text-[14px] font-semibold leading-[20px]" style={{ color: '#121E6C' }}>Bloquear</span>
              </button>
              <button
                onClick={() => setShowScopeSheet(true)}
                className="flex-1 flex items-center justify-center rounded-[12px] h-[40px] active:opacity-70 transition-opacity"
                style={{ backgroundColor: '#F1F2F6' }}
              >
                <span className="text-[14px] font-semibold leading-[20px]" style={{ color: '#121E6C' }}>
                  {isTeam ? 'Ver mi agenda' : 'Ver equipo'}
                </span>
              </button>
            </div>
          )}
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

      {/* ── Lista de citas — Figma: cards en columna, sin pista temporal ── */}
      <div className="flex-1 px-4 pt-3 pb-4">
        {dayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
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
          <div className="flex flex-col gap-[14px]">
            {listItems.map((item, idx) => {

              /* ── Indicador AHORA ─────────────────────────────────────── */
              if (item.type === 'now') {
                return (
                  <div key="ahora" className="flex items-center gap-2 py-[2px]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#FF2947' }} />
                    <div className="flex-1 h-px" style={{ backgroundColor: '#FF2947', opacity: 0.3 }} />
                    <span className="text-[11px] font-bold tracking-wide shrink-0 tabular-nums" style={{ color: '#FF2947' }}>
                      {DEMO_NOW}
                    </span>
                  </div>
                );
              }

              /* ── Espacio libre ───────────────────────────────────────── */
              if (item.type === 'gap') {
                return (
                  <button
                    key={`gap-${item.fromTime}`}
                    onClick={() => onNewApptAtSlot?.(selectedDate, item.fromTime)}
                    className="w-full flex items-center gap-[12px] rounded-[16px] text-left active:opacity-60 transition-opacity p-[12px]"
                    style={{
                      backgroundColor: '#f7f8fb',
                      border: '1.5px dashed rgba(18,30,108,0.14)',
                    }}
                  >
                    <div
                      className="size-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(18,30,108,0.06)' }}
                    >
                      <Plus size={13} color="#b0b5c8" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold leading-[20px]" style={{ color: '#b0b5c8' }}>
                        Disponible · {formatDuration(item.durationMin)}
                      </p>
                      <p className="text-[12px] font-normal leading-[16px]" style={{ color: '#d2d4e1' }}>
                        {item.fromTime} – {item.toTime}
                      </p>
                    </div>
                  </button>
                );
              }

              /* ── Card de cita ────────────────────────────────────────── */
              const apt = item.apt;
              const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
              const svc = SERVICES.find(s => s.id === apt.serviceId)!;
              const conflictInfo = getConflictInfo(apt, availabilityBlocks, SERVICES);
              return (
                <div key={apt.id + String(idx)} className="flex flex-col gap-[6px]">
                  {conflictInfo && (
                    <button
                      onClick={() => onOpenEdit(apt)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left active:opacity-70"
                      style={{ backgroundColor: '#FFFBEB' }}
                    >
                      <AlertTriangle size={12} color="#B45309" strokeWidth={2} className="shrink-0" />
                      <span className="text-[11px] text-[#B45309] font-semibold">
                        Cruce con bloqueo de {conflictInfo.profName}, {conflictInfo.startTime}–{conflictInfo.endTime}
                      </span>
                    </button>
                  )}
                  <AppointmentCard appointment={apt} professional={prof} service={svc} onTap={() => openDetail(apt)} />
                </div>
              );
            })}

            <div className="h-36" />
          </div>
        )}
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

            {/* Opción: Agenda del equipo */}
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

            {/* Opción: Mi agenda (admin) */}
            <button
              onClick={() => {
                onViewScopeChange('mine');
                setViewProfId(STAFF_PROF_ID);
                setProfFilter('all');
                setShowScopeSheet(false);
              }}
              className="w-full flex items-center gap-3 py-3.5 active:opacity-70"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: viewScope === 'mine' ? '#121e6c' : '#f7f8fb' }}>
                <User size={16} color={viewScope === 'mine' ? '#fff' : '#606060'} strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: viewScope === 'mine' ? '#121e6c' : '#1e1e1e' }}>
                  Mi agenda
                </p>
                <p className="text-xs text-[#969696]">
                  {PROFESSIONALS.find(p => p.id === STAFF_PROF_ID)?.name ?? 'Mi cuenta'}
                </p>
              </div>
              {viewScope === 'mine' && (
                <span className="text-xs font-bold shrink-0" style={{ color: '#FF2947' }}>✓</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
