import { useState, useMemo, type ReactNode } from 'react';
import { Bell, ChevronDown, AlertTriangle, CalendarOff } from 'lucide-react';
import { PROFESSIONALS, SERVICES, formatCOP, formatDuration } from '../data/appointments';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { ServiceClosureDrawer, type ClosureResult } from '../components/ServiceClosureDrawer';
import { timeToMin, minToTime } from '../store/prototypeStore';
import type { Appointment, Professional, Service, SaleRecord, Role, AvailabilityBlock } from '../types';

interface Props {
  role: Role;
  onRoleChange: (r: Role) => void;
  appointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
  onUpdateAppointment: (updated: Appointment) => void;
  onAddSaleRecord: (sale: SaleRecord) => void;
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
  onOpenEdit: (apt: Appointment) => void;
  onOpenAvailability: (showProfSelector: boolean) => void;
}

const DEMO_NOW = '13:30';
const TODAY = '2026-07-16';
const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const STAFF_PROF_ID = 'p1';

function getWeekDates(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return WEEK_LABELS.map((label, i) => {
    const nd = new Date(y, m - 1, d + mondayOffset + i);
    const ds = `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`;
    return { label, dateNum: nd.getDate(), dateStr: ds };
  });
}

function formatDateHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('es-CO', { weekday: 'long' });
  const rest = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return dateStr === TODAY ? `Hoy, ${rest}` : `${cap(weekday)}, ${rest}`;
}

interface ConflictInfo {
  profName: string;
  startTime: string;
  endTime: string;
}

function getConflictInfo(apt: Appointment, blocks: AvailabilityBlock[], services: Service[]): ConflictInfo | null {
  if (['cancelada', 'cancelada-tarde', 'completada', 'no-show'].includes(apt.status)) return null;
  const profBlocks = blocks.filter(b => b.professionalId === apt.professionalId && b.date === apt.date);
  const prof = PROFESSIONALS.find(p => p.id === apt.professionalId);
  const profName = prof?.name.split(' ')[0] ?? 'la profesional';

  const fullDay = profBlocks.find(b => b.type === 'full-day');
  if (fullDay) {
    return { profName, startTime: '08:00', endTime: '19:00' };
  }

  const svc = services.find(s => s.id === apt.serviceId);
  if (!svc) return null;
  const aptStart = timeToMin(apt.startTime);
  const aptEnd = aptStart + svc.duration;

  for (const b of profBlocks) {
    if (b.type !== 'range') continue;
    const bStart = timeToMin(b.startTime!);
    const bEnd = timeToMin(b.endTime!);
    if (aptStart < bEnd && aptEnd > bStart) {
      return { profName, startTime: b.startTime!, endTime: b.endTime! };
    }
  }
  return null;
}

export function AgendaPage({
  role, appointments, availabilityBlocks,
  onUpdateAppointment, onAddSaleRecord, onOpenDrawer, onCloseDrawer, onOpenEdit, onOpenAvailability,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [profFilter, setProfFilter] = useState<string>('all');
  const [viewScope, setViewScope] = useState<'team' | 'mine'>('team');

  const isAdmin = role === 'admin';
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const dayAppointments = useMemo<Appointment[]>(() => {
    let apts = appointments.filter(a => a.date === selectedDate);
    if (role === 'staff' || viewScope === 'mine') {
      apts = apts.filter(a => a.professionalId === STAFF_PROF_ID);
    } else if (profFilter !== 'all') {
      apts = apts.filter(a => a.professionalId === profFilter);
    }
    return [...apts].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate, profFilter, role, viewScope]);

  const metrics = useMemo(() => {
    const base = appointments.filter(a => {
      if (a.date !== selectedDate) return false;
      if (role === 'staff' || viewScope === 'mine') return a.professionalId === STAFF_PROF_ID;
      return true;
    });
    const total = base.filter(a => !['cancelada', 'cancelada-tarde'].includes(a.status)).length;
    const confirmadas = base.filter(a => a.status === 'confirmada').length;
    const ingresos = base
      .filter(a => !['no-show', 'cancelada', 'cancelada-tarde'].includes(a.status))
      .reduce((sum, a) => {
        const svc = SERVICES.find(s => s.id === a.serviceId);
        return sum + (a.originalPrice ?? svc?.price ?? 0);
      }, 0);
    return { total, confirmadas, ingresos };
  }, [appointments, selectedDate, role, viewScope]);

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
      <ServiceClosureDrawer
        appointment={apt}
        professional={prof}
        service={svc}
        onClose={onCloseDrawer}
        onComplete={handleClosure}
        onReschedule={() => { onCloseDrawer(); setTimeout(() => onOpenEdit(apt), 320); }}
      />,
      'Cierre del servicio',
      '78%'
    );
  }

  function openDetail(apt: Appointment) {
    const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
    const svc = SERVICES.find(s => s.id === apt.serviceId)!;
    onOpenDrawer(
      <AppointmentDetailDrawer
        appointment={apt}
        professional={prof}
        service={svc}
        onClosure={() => openClosure(apt, prof, svc)}
        onEdit={() => { onCloseDrawer(); setTimeout(() => onOpenEdit(apt), 320); }}
        onViewClient={onCloseDrawer}
      />,
      undefined,
      '88%'
    );
  }

  const isToday = selectedDate === TODAY;
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
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-[#121e6c] leading-tight">Salón Camila</h1>
            <p className="text-xs text-[#969696] mt-0.5">{formatDateHeader(selectedDate)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Scope selector — admin only */}
            {isAdmin && (
              <button
                onClick={() => {
                  setViewScope(s => s === 'team' ? 'mine' : 'team');
                  setProfFilter('all');
                }}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all active:opacity-70"
                style={{
                  backgroundColor: viewScope === 'team' ? '#121e6c' : '#f7f8fb',
                  color: viewScope === 'team' ? '#fff' : '#606060',
                  borderColor: viewScope === 'team' ? '#121e6c' : '#d2d4e1',
                }}
              >
                {viewScope === 'team' ? 'Agenda del equipo' : 'Mi agenda'}
                <ChevronDown size={11} color={viewScope === 'team' ? '#fff' : '#606060'} strokeWidth={2.5} />
              </button>
            )}
            {/* Block availability — admin only */}
            {isAdmin && (
              <button
                onClick={() => onOpenAvailability(viewScope === 'team')}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity active:opacity-60"
                style={{ backgroundColor: '#f7f8fb' }}
                title="Bloquear disponibilidad"
              >
                <CalendarOff size={18} color="#121e6c" strokeWidth={1.8} />
              </button>
            )}
            <button className="w-9 h-9 flex items-center justify-center transition-opacity active:opacity-60">
              <Bell size={20} color="#121e6c" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Week strip */}
        <div className="flex gap-1 -mx-1 mb-3">
          {weekDates.map(({ label, dateNum, dateStr }) => {
            const isSelected = dateStr === selectedDate;
            const hasDot = appointments.some(a => a.date === dateStr && !['cancelada', 'cancelada-tarde'].includes(a.status));
            return (
              <button
                key={dateStr}
                onClick={() => { setSelectedDate(dateStr); setProfFilter('all'); }}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all active:opacity-70"
                style={{ backgroundColor: isSelected ? '#E8194B' : 'transparent' }}
              >
                <span className="text-[10px] font-semibold leading-none"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : '#969696' }}>{label}</span>
                <span className="text-[13px] font-bold leading-none"
                  style={{ color: isSelected ? '#fff' : '#121e6c' }}>{dateNum}</span>
                <div className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: hasDot ? (isSelected ? 'rgba(255,255,255,0.6)' : '#E8194B') : 'transparent' }} />
              </button>
            );
          })}
        </div>

        {/* Metrics */}
        <div className="flex gap-2 pb-3">
          {[
            { label: 'Citas', value: String(metrics.total) },
            { label: 'Confirmadas', value: String(metrics.confirmadas) },
            { label: 'Ingresos est.', value: formatCOP(metrics.ingresos) },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 bg-[#f7f8fb] rounded-xl px-2 py-2 flex flex-col items-center gap-0.5">
              <span className="text-base font-bold text-[#121e6c] leading-none tabular-nums">{value}</span>
              <span className="text-[10px] text-[#969696] leading-none text-center">{label}</span>
            </div>
          ))}
        </div>

        {/* Pro filter — admin team scope only */}
        {isAdmin && viewScope === 'team' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setProfFilter('all')}
              className="flex items-center gap-1.5 rounded-full px-3 h-8 shrink-0 text-xs font-semibold border transition-all active:opacity-70"
              style={{ backgroundColor: profFilter === 'all' ? '#121e6c' : '#fff', color: profFilter === 'all' ? '#fff' : '#606060', borderColor: profFilter === 'all' ? '#121e6c' : '#d2d4e1' }}
            >
              Todos
            </button>
            {PROFESSIONALS.map(prof => {
              const isActive = profFilter === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => setProfFilter(isActive ? 'all' : prof.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 h-8 shrink-0 text-xs font-semibold border transition-all active:opacity-70"
                  style={{ backgroundColor: isActive ? '#121e6c' : '#fff', color: isActive ? '#fff' : '#606060', borderColor: isActive ? '#121e6c' : '#d2d4e1' }}
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#e8eaf0' }}>
                    <span className="text-[8px] font-bold leading-none"
                      style={{ color: isActive ? '#fff' : '#606060' }}>{prof.initials.slice(0, 1)}</span>
                  </div>
                  {prof.name.split(' ')[0]}
                </button>
              );
            })}
            <div className="w-2 shrink-0" />
          </div>
        )}

        <div className="h-px bg-gray-100 -mx-4" />
      </div>

      {/* ── Appointment list ── */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
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
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#E8194B' }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8194B', opacity: 0.3 }} />
                  <span className="text-[11px] font-bold tabular-nums shrink-0" style={{ color: '#E8194B' }}>{DEMO_NOW}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8194B', opacity: 0.3 }} />
                  <span className="text-[10px] font-bold shrink-0 tracking-wide" style={{ color: '#E8194B' }}>AHORA</span>
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
                <AppointmentCard
                  appointment={apt}
                  professional={prof}
                  service={svc}
                  onTap={() => openDetail(apt)}
                />
              </div>
            );
          })
        )}
        <div className="h-36" />
      </div>
    </div>
  );
}
