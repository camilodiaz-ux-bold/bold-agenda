import { useState, useMemo, type ReactNode } from 'react';
import { Bell, ChevronDown, Edit3 } from 'lucide-react';
import {
  APPOINTMENTS,
  PROFESSIONALS,
  SERVICES,
  formatCOP,
  formatDuration,
} from '../data/appointments';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentDetailDrawer } from '../components/AppointmentDetailDrawer';
import { ServiceClosureDrawer, type ClosureResult } from '../components/ServiceClosureDrawer';
import type { Appointment, Professional, Service, SaleRecord, Role } from '../types';

interface Props {
  role: Role;
  onRoleChange: (r: Role) => void;
  onAddSaleRecord: (sale: SaleRecord) => void;
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
}

// Fixed at midday so "Ahora" falls between morning and afternoon appointments.
const DEMO_NOW = '13:30';
const TODAY = '2026-07-16';
const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function getWeekDates(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return WEEK_LABELS.map((label, i) => {
    const nd = new Date(y, m - 1, d + mondayOffset + i);
    const ds = `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`;
    return { label, dateNum: nd.getDate(), dateStr: ds };
  });
}

function hasApptsOnDate(allApts: Appointment[], dateStr: string) {
  return allApts.some(a => a.date === dateStr);
}

function formatDateHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('es-CO', { weekday: 'long' });
  const rest = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return dateStr === TODAY ? `Hoy, ${rest}` : `${cap(weekday)}, ${rest}`;
}

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export function AgendaPage({ role, onRoleChange, onAddSaleRecord, onOpenDrawer, onCloseDrawer }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [profFilter, setProfFilter] = useState<string>('all');

  const STAFF_PROF_ID = 'p1'; // Camila Vargas for prototype

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const dayAppointments = useMemo<Appointment[]>(() => {
    let apts = appointments.filter(a => a.date === selectedDate);
    if (role === 'staff') {
      apts = apts.filter(a => a.professionalId === STAFF_PROF_ID);
    } else if (profFilter !== 'all') {
      apts = apts.filter(a => a.professionalId === profFilter);
    }
    return [...apts].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate, profFilter, role]);

  const metrics = useMemo(() => {
    const base = appointments.filter(a => {
      if (a.date !== selectedDate) return false;
      return role === 'staff' ? a.professionalId === STAFF_PROF_ID : true;
    });
    const total = base.length;
    const confirmadas = base.filter(a => a.status === 'confirmada').length;
    const ingresos = base
      .filter(a => a.status !== 'no-show')
      .reduce((sum, a) => {
        const svc = SERVICES.find(s => s.id === a.serviceId);
        return sum + (svc?.price ?? 0);
      }, 0);
    return { total, confirmadas, ingresos };
  }, [appointments, selectedDate, role]);

  function updateAppointment(result: ClosureResult) {
    const apt = appointments.find(a => a.id === result.appointmentId);
    const svc = apt ? SERVICES.find(s => s.id === apt.serviceId) : null;
    const prof = apt ? PROFESSIONALS.find(p => p.id === apt.professionalId) : null;

    setAppointments(prev =>
      prev.map(a => {
        if (a.id !== result.appointmentId) return a;
        return {
          ...a,
          status: result.outcome === 'no-show' ? 'no-show' : 'completada',
          paymentStatus: result.paymentMethod ? 'pagado' : a.paymentStatus,
          paymentMethod: result.paymentMethod ?? a.paymentMethod,
          tip: result.tip > 0 ? result.tip : a.tip,
        };
      })
    );

    if (result.outcome === 'completada' && apt && svc && prof) {
      const newSale: SaleRecord = {
        id: `sr-${Date.now()}`,
        appointmentId: result.appointmentId,
        clientName: apt.clientName,
        serviceId: svc.id,
        professionalId: prof.id,
        serviceValue: svc.price,
        tip: result.tip,
        total: svc.price + result.tip,
        paymentMethod: result.paymentMethod ?? 'anticipado',
        paymentStatus: result.paymentMethod ? 'pagado' : 'pagado-anticipado',
        commission: Math.round(svc.price * prof.commissionRate),
        completedAt: new Date().toISOString(),
      };
      onAddSaleRecord(newSale);
    }
  }

  function openEdit(apt: Appointment, svc: Service) {
    onOpenDrawer(
      <div className="px-5 pb-6 flex flex-col gap-4">
        {/* Appointment context */}
        <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5">
          <p className="text-sm font-bold text-[#1e1e1e]">{apt.clientName}</p>
          <p className="text-xs text-[#969696] mt-0.5">{svc.name} · {apt.date} · {apt.startTime}</p>
        </div>
        {/* Field previews — inactive, visual placeholder */}
        <div className="flex flex-col gap-2">
          {[
            { label: 'Servicio', value: svc.name },
            { label: 'Profesional', value: PROFESSIONALS.find(p => p.id === apt.professionalId)?.name.split(' ')[0] ?? '—' },
            { label: 'Fecha', value: apt.date },
            { label: 'Hora', value: apt.startTime },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-white border border-[#e8eaf0] rounded-xl">
              <span className="text-xs text-[#b0b5c8]">{label}</span>
              <span className="text-sm font-semibold text-[#1e1e1e]">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 py-4">
          <Edit3 size={14} color="#b0b5c8" strokeWidth={2} />
          <p className="text-xs text-[#b0b5c8]">Edición completa disponible en la próxima versión</p>
        </div>
      </div>,
      'Editar cita',
      '56%'
    );
  }

  function openClosure(apt: Appointment, prof: Professional, svc: Service) {
    onOpenDrawer(
      <ServiceClosureDrawer
        appointment={apt}
        professional={prof}
        service={svc}
        onClose={onCloseDrawer}
        onComplete={(result) => {
          updateAppointment(result);
          // Keep drawer open — "done" step shown; user closes with "Volver a la agenda"
        }}
        onReschedule={() => openEdit(apt, svc)}
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
        onEdit={() => openEdit(apt, svc)}
        onViewClient={onCloseDrawer}
      />,
      undefined,
      '88%'
    );
  }

  // Build the agenda list: appointments interleaved with free-time gaps and the AHORA marker.
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
        // Free block before this appointment — show it, then AHORA if it falls inside.
        items.push({
          type: 'gap',
          fromTime: minToTime(maxEndMin),
          toTime: minToTime(startMin),
          durationMin: startMin - maxEndMin,
        });
        if (!nowInserted && nowMin >= maxEndMin && nowMin <= startMin) {
          items.push({ type: 'now' });
          nowInserted = true;
        }
      } else if (!nowInserted && nowMin >= 0 && nowMin <= startMin) {
        // AHORA is right at or just before this appointment (gap ≤ 15 min).
        items.push({ type: 'now' });
        nowInserted = true;
      }

      items.push({ type: 'appointment', apt });
      maxEndMin = maxEndMin < 0 ? endMin : Math.max(maxEndMin, endMin);
    }

    if (!nowInserted) items.push({ type: 'now' });
    return items;
  }, [dayAppointments, isToday]);

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ─────────────────────────────── */}
      <div className="bg-white px-4 pt-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-[#121e6c] leading-tight">Salón Camila</h1>
            <p className="text-xs text-[#969696] mt-0.5">{formatDateHeader(selectedDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Prototype role toggle */}
            <button
              onClick={() => { onRoleChange(role === 'admin' ? 'staff' : 'admin'); setProfFilter('all'); }}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all active:opacity-70"
              style={{
                backgroundColor: role === 'admin' ? '#121e6c' : '#f7f8fb',
                color: role === 'admin' ? '#fff' : '#606060',
                borderColor: role === 'admin' ? '#121e6c' : '#d2d4e1',
              }}
            >
              {role === 'admin' ? 'Admin' : 'Mi agenda'}
              <ChevronDown size={11} color={role === 'admin' ? '#fff' : '#606060'} strokeWidth={2.5} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center transition-opacity active:opacity-60">
              <Bell size={20} color="#121e6c" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* ── Week strip ─────────────────────── */}
        <div className="flex gap-1 -mx-1 mb-3">
          {weekDates.map(({ label, dateNum, dateStr }) => {
            const isSelected = dateStr === selectedDate;
            const hasDot = hasApptsOnDate(appointments, dateStr);
            return (
              <button
                key={dateStr}
                onClick={() => { setSelectedDate(dateStr); setProfFilter('all'); }}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all active:opacity-70"
                style={{ backgroundColor: isSelected ? '#E8194B' : 'transparent' }}
              >
                <span className="text-[10px] font-semibold leading-none"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : '#969696' }}>
                  {label}
                </span>
                <span className="text-[13px] font-bold leading-none"
                  style={{ color: isSelected ? '#fff' : '#121e6c' }}>
                  {dateNum}
                </span>
                <div className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: hasDot ? (isSelected ? 'rgba(255,255,255,0.6)' : '#E8194B') : 'transparent' }} />
              </button>
            );
          })}
        </div>

        {/* ── Metrics ────────────────────────── */}
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

        {/* ── Professional filter (admin only) ── */}
        {role === 'admin' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setProfFilter('all')}
              className="flex items-center gap-1.5 rounded-full px-3 h-8 shrink-0 text-xs font-semibold border transition-all active:opacity-70"
              style={{
                backgroundColor: profFilter === 'all' ? '#121e6c' : '#fff',
                color: profFilter === 'all' ? '#fff' : '#606060',
                borderColor: profFilter === 'all' ? '#121e6c' : '#d2d4e1',
              }}
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
                  style={{
                    backgroundColor: isActive ? '#121e6c' : '#fff',
                    color: isActive ? '#fff' : '#606060',
                    borderColor: isActive ? '#121e6c' : '#d2d4e1',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#e8eaf0' }}
                  >
                    <span
                      className="text-[8px] font-bold leading-none"
                      style={{ color: isActive ? '#fff' : '#606060' }}
                    >
                      {prof.initials.slice(0, 1)}
                    </span>
                  </div>
                  {prof.name.split(' ')[0]}
                </button>
              );
            })}
            {/* Trailing spacer so the last chip is never clipped by the scroll boundary */}
            <div className="w-2 shrink-0" />
          </div>
        )}

        <div className="h-px bg-gray-100 -mx-4" />
      </div>

      {/* ── Appointment list ───────────────────── */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        {dayAppointments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0px 2px 8px rgba(18,30,108,0.08)' }}>
              <Bell size={24} color="#d2d4e1" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#121e6c]">Sin citas este día</p>
              <p className="text-xs text-[#969696] mt-1">Tarde libre — usa el botón para agendar</p>
            </div>
          </div>
        ) : (
          listItems.map((item, idx) => {
            if (item.type === 'now') {
              return (
                <div key="ahora" className="flex items-center gap-2 my-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#E8194B' }} />
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8194B', opacity: 0.3 }} />
                  <span className="text-[11px] font-bold tabular-nums shrink-0" style={{ color: '#E8194B' }}>
                    {DEMO_NOW}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8194B', opacity: 0.3 }} />
                  <span className="text-[10px] font-bold shrink-0 tracking-wide" style={{ color: '#E8194B' }}>
                    AHORA
                  </span>
                </div>
              );
            }
            if (item.type === 'gap') {
              return (
                <div key={`gap-${item.fromTime}`} className="flex items-center gap-3 py-0.5">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaf0' }} />
                  <span className="text-[11px] font-medium shrink-0" style={{ color: '#b0b5c8' }}>
                    libre {formatDuration(item.durationMin)}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#e8eaf0' }} />
                </div>
              );
            }
            const apt = item.apt;
            const prof = PROFESSIONALS.find(p => p.id === apt.professionalId)!;
            const svc = SERVICES.find(s => s.id === apt.serviceId)!;
            return (
              <AppointmentCard
                key={apt.id + String(idx)}
                appointment={apt}
                professional={prof}
                service={svc}
                onTap={() => openDetail(apt)}
              />
            );
          })
        )}
        {/* FAB clearance — must exceed FAB top edge (h-12 button at bottom-76px above nav-64px) */}
        <div className="h-36" />
      </div>
    </div>
  );
}
