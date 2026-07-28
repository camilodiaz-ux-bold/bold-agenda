import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { Bell, ChevronDown, Users, User } from 'lucide-react';
import { PROFESSIONALS, SERVICES } from '../data/appointments';
import { AppointmentBlock } from '../components/AppointmentBlock';
import { BlockedTimeBlock } from '../components/BlockedTimeBlock';
import { CalendarGrid, timeToPx, durationToPx, cardTop, cardHeight, CAL_START, CAL_END, HOUR_HEIGHT, CARD_INSET } from '../components/CalendarGrid';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { ServiceClosureDrawer, type ClosureResult } from '../components/ServiceClosureDrawer';
import { timeToMin, PROTOTYPE_TODAY } from '../store/prototypeStore';
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
  // In team view: which professional tab is selected. No 'all' option.
  const [profFilter, setProfFilter] = useState<string>(PROFESSIONALS[0].id);
  const [showScopeSheet, setShowScopeSheet] = useState(false);
  const [showBranchSheet, setShowBranchSheet] = useState(false);
  const [viewProfId, setViewProfId] = useState(STAFF_PROF_ID);

  const isAdmin = role === 'admin';
  const isTeam = isAdmin && viewScope === 'team';

  const activeBranch = branches.find(b => b.id === activeBranchId);

  useEffect(() => {
    if (jumpToDate) {
      setSelectedDate(jumpToDate);
      onJumpHandled();
    }
  }, [jumpToDate]);

  const selectedWeekIdx = useMemo(
    () => ALL_WEEKS.findIndex(week => isSameWeek(week[0], selectedDate)),
    [selectedDate]
  );

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

  const branchApts = useMemo(
    () => appointments.filter(a => (a.branchId ?? 'norte') === activeBranchId),
    [appointments, activeBranchId]
  );

  // Active professional for the current view
  const activeProfId = useMemo(() => {
    if (role === 'staff') return STAFF_PROF_ID;
    if (viewScope === 'mine') return viewProfId;
    return profFilter;
  }, [role, viewScope, viewProfId, profFilter]);

  const dayAppointments = useMemo<Appointment[]>(() => {
    const apts = branchApts
      .filter(a => a.date === selectedDate && a.professionalId === activeProfId);
    return [...apts].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [branchApts, selectedDate, activeProfId]);

  const calendarBlocks = useMemo(
    () => availabilityBlocks.filter(b => b.date === selectedDate && b.professionalId === activeProfId),
    [availabilityBlocks, selectedDate, activeProfId]
  );

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
  const nowPx = timeToPx(DEMO_NOW);

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-4">
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

        {/* Week day strip */}
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
                    onClick={() => setSelectedDate(dateStr)}
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

      {/* ── Content area ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[16px] px-4 pt-2 pb-2">

        {/* Context card — Figma: icon + name + date / two action buttons */}
        <div className="bg-white rounded-[16px] flex flex-col gap-[16px] p-[12px]">
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

        {/* APP Tabs — team view only, one tab per professional, no "Todos" */}
        {isTeam && (
          <div className="flex items-start border-b border-[#e8eaf0]" style={{ height: '28px' }}>
            {PROFESSIONALS.map(prof => {
              const isActive = profFilter === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => setProfFilter(prof.id)}
                  className="flex-1 flex flex-col items-center pb-[4px] active:opacity-70 transition-opacity"
                >
                  <span
                    className="text-[14px] leading-[20px] text-[#121e6c]"
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {prof.name.split(' ')[0]}
                  </span>
                  {isActive && (
                    <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: '#121e6c' }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Calendar Grid ────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pt-3 pb-36 overflow-y-auto">
        <CalendarGrid>

          {/* NOW indicator */}
          {isToday && nowPx > 0 && (
            <div
              className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
              style={{ top: `${nowPx}px` }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#FF2947', marginLeft: '-4px' }} />
              <div className="flex-1 h-px" style={{ backgroundColor: '#FF2947', opacity: 0.5 }} />
            </div>
          )}

          {/* Availability blocks (blocked times) */}
          {calendarBlocks.map(block => {
            const prof = PROFESSIONALS.find(p => p.id === block.professionalId)!;
            let top: number;
            let h: number;
            if (block.type === 'full-day') {
              top = CARD_INSET;
              h = (CAL_END - CAL_START) * HOUR_HEIGHT - CARD_INSET * 2;
            } else {
              const startMin = timeToMin(block.startTime ?? '08:00');
              const endMin = timeToMin(block.endTime ?? '20:00');
              top = timeToPx(block.startTime ?? '08:00') + CARD_INSET;
              h = Math.max(55, durationToPx(endMin - startMin) - CARD_INSET);
            }
            return (
              <BlockedTimeBlock
                key={block.id}
                block={block}
                professional={prof}
                topPx={top}
                heightPx={h}
                onClick={() => onOpenAvailability(isTeam)}
              />
            );
          })}

          {/* Appointment blocks */}
          {dayAppointments.map(apt => {
            const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
            const svc = SERVICES.find(s => s.id === apt.serviceId)!;
            return (
              <AppointmentBlock
                key={apt.id}
                appointment={apt}
                professional={prof}
                service={svc}
                topPx={cardTop(apt.startTime)}
                heightPx={cardHeight(svc.duration)}
                onTap={() => openDetail(apt)}
              />
            );
          })}

          {/* Empty day placeholder — rendered inside the grid at 10:00 */}
          {dayAppointments.length === 0 && calendarBlocks.length === 0 && (
            <div
              className="absolute left-0 right-0 flex flex-col items-center gap-2"
              style={{ top: `${2 * HOUR_HEIGHT + 16}px` }}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 2px 8px rgba(18,30,108,0.08)' }}>
                <Bell size={22} color="#d2d4e1" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[#121e6c]">Sin citas este día</p>
              <p className="text-xs text-[#969696]">Tarde libre</p>
            </div>
          )}

        </CalendarGrid>
      </div>

      {/* ── Branch selector sheet ────────────────────────────────────────── */}
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

      {/* ── Scope sheet ──────────────────────────────────────────────────── */}
      {showScopeSheet && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowScopeSheet(false)} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl px-5 pt-4 pb-10">
            <div className="w-9 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Cambiar vista</p>

            <button
              onClick={() => {
                onViewScopeChange('team');
                setProfFilter(PROFESSIONALS[0].id);
                setShowScopeSheet(false);
              }}
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

            <button
              onClick={() => {
                onViewScopeChange('mine');
                setViewProfId(STAFF_PROF_ID);
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
