import { useState, useEffect, Fragment } from 'react';
import {
  Briefcase, Users, ShoppingBag, Shield, ChevronRight,
  Check, AlertTriangle, RotateCcw, ToggleLeft, ToggleRight,
  ArrowLeft,
} from 'lucide-react';
import { formatCOP, formatDuration } from '../data/appointments';
import type { Role, Professional, Service, BusinessProfile, BookingPolicy, Appointment, WeeklySchedule, Weekday, WorkingDay } from '../types';
import { getWeekday, DEFAULT_WEEKLY_SCHEDULE } from '../lib/availability';
import { store, PROTOTYPE_TODAY } from '../store/prototypeStore';
import { timeToMin, minToTime } from '../lib/calendarMath';
import {
  SERVICE_ICON_OPTIONS, SERVICE_COLORS, SERVICE_CATEGORIES,
  getServiceIcon, getServiceColor,
} from '../lib/serviceVisuals';

interface Props {
  role: Role;
  professionals: Professional[];
  services: Service[];
  businessProfile: BusinessProfile;
  bookingPolicy: BookingPolicy;
  appointments: Appointment[];
  onUpdateProfessionals: (profs: Professional[]) => void;
  onUpdateServices: (svcs: Service[]) => void;
  onUpdateBusinessProfile: (bp: BusinessProfile) => void;
  onUpdateBookingPolicy: (bp: BookingPolicy) => void;
  onSecondLevelChange?: (active: boolean) => void;
  onReset: () => void;
}

type DetailView =
  | null
  | { screen: 'perfil' }
  | { screen: 'equipo' }
  | { screen: 'equipo-prof'; profId: string }
  | { screen: 'servicios' }
  | { screen: 'servicios-svc'; svcId: string }
  | { screen: 'politica' };

const LABEL_CLZ = 'text-xs font-semibold text-[#606060]';
const INPUT_CLZ = 'w-full rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none transition-colors bg-white';
const INPUT_STYLE = { borderColor: '#d2d4e1' };

function aptCount(appointments: Appointment[], filter: (a: Appointment) => boolean) {
  return appointments.filter(a => filter(a) && ['confirmada', 'reprogramada'].includes(a.status)).length;
}

export function AjustesPage({
  role, professionals, services, businessProfile, bookingPolicy,
  appointments, onUpdateProfessionals, onUpdateServices,
  onUpdateBusinessProfile, onUpdateBookingPolicy, onSecondLevelChange, onReset,
}: Props) {
  const [detail, setDetail] = useState<DetailView>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const isAdmin = role === 'admin';

  useEffect(() => {
    const isSecondLevel = detail?.screen === 'equipo-prof' || detail?.screen === 'servicios-svc';
    onSecondLevelChange?.(isSecondLevel);
    return () => onSecondLevelChange?.(false);
  }, [detail?.screen, onSecondLevelChange]);

  // ── Perfil detail ──────────────────────────────────────────────────────
  if (detail?.screen === 'perfil') {
    return (
      <PerfilDetail
        profile={businessProfile}
        isAdmin={isAdmin}
        onSave={onUpdateBusinessProfile}
        onBack={() => setDetail(null)}
      />
    );
  }

  // ── Equipo prof detail ─────────────────────────────────────────────────
  if (detail?.screen === 'equipo-prof') {
    const prof = professionals.find(p => p.id === detail.profId)!;
    return (
      <ProfDetail
        prof={prof}
        services={services}
        appointments={appointments}
        isAdmin={isAdmin}
        onSave={(updated) => {
          const next = professionals.map(p => p.id === updated.id ? updated : p);
          onUpdateProfessionals(next);
        }}
        onBack={() => setDetail({ screen: 'equipo' })}
      />
    );
  }

  // ── Equipo list detail ─────────────────────────────────────────────────
  if (detail?.screen === 'equipo') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
        <DetailHeader title="Equipo" onBack={() => setDetail(null)} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-2">
            {professionals.map(prof => {
              const active = (prof as any).active !== false;
              const count = aptCount(appointments, a => a.professionalId === prof.id);
              return (
                <button
                  key={prof.id}
                  onClick={() => setDetail({ screen: 'equipo-prof', profId: prof.id })}
                  className="flex items-center gap-3 bg-white rounded-[16px] p-[12px] active:opacity-70 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#F7F8FB', opacity: active ? 1 : 0.4 }}
                  >
                    <span className="text-[14px] font-normal leading-[20px]" style={{ color: '#3E4983' }}>{prof.initials}</span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-[#1e1e1e]">{prof.name}</p>
                    <p className="text-xs text-[#969696] mt-0.5">{prof.role}</p>
                    {!active && <p className="text-[10px] text-[#969696] mt-0.5">Inactiva</p>}
                    {active && count > 0 && <p className="text-[10px] text-[#b0b5c8] mt-0.5">{count} cita{count > 1 ? 's' : ''} pendiente{count > 1 ? 's' : ''}</p>}
                  </div>
                  <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Servicio detail ─────────────────────────────────────────────────────
  if (detail?.screen === 'servicios-svc') {
    const svc = services.find(s => s.id === detail.svcId)!;
    return (
      <ServiceDetail
        svc={svc}
        appointments={appointments}
        isAdmin={isAdmin}
        onSave={(updated) => {
          const next = services.map(s => s.id === updated.id ? updated : s);
          onUpdateServices(next);
        }}
        onBack={() => setDetail({ screen: 'servicios' })}
      />
    );
  }

  // ── Servicios list detail ───────────────────────────────────────────────
  if (detail?.screen === 'servicios') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
        <DetailHeader title="Servicios" onBack={() => setDetail(null)} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-2">
            {services.map(svc => {
              const active = (svc as any).active !== false;
              const count = aptCount(appointments, a => a.serviceId === svc.id);
              return (
                <button
                  key={svc.id}
                  onClick={() => setDetail({ screen: 'servicios-svc', svcId: svc.id })}
                  className="flex items-center gap-3 bg-white rounded-[16px] p-[12px] active:opacity-70 transition-all"
                  style={{ opacity: active ? 1 : 0.55 }}
                >
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1e1e1e]">{svc.name}</p>
                      {!active && <span className="text-[10px] font-semibold text-[#969696] bg-gray-100 rounded-full px-1.5 py-0.5">Inactivo</span>}
                    </div>
                    <p className="text-xs text-[#969696] mt-0.5">
                      {formatDuration(svc.duration)}{svc.requiresDeposit ? ' · Pago anticipado' : ''}
                    </p>
                    {count > 0 && <p className="text-[10px] text-[#b0b5c8] mt-0.5">{count} cita{count > 1 ? 's' : ''} activa{count > 1 ? 's' : ''}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold tabular-nums text-[#121e6c]">{formatCOP(svc.price)}</span>
                    <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Política detail ─────────────────────────────────────────────────────
  if (detail?.screen === 'politica') {
    return (
      <PoliticaDetail
        policy={bookingPolicy}
        isAdmin={isAdmin}
        onSave={onUpdateBookingPolicy}
        onBack={() => setDetail(null)}
      />
    );
  }

  // ── Index ───────────────────────────────────────────────────────────────
  const activeProfs = professionals.filter(p => (p as any).active !== false).length;
  const activeSvcs = services.filter(s => (s as any).active !== false).length;

  const NAV_ITEMS = [
    {
      key: 'perfil' as const,
      Icon: Briefcase,
      title: 'Perfil del negocio',
      counter: null as string | null,
      detail: { screen: 'perfil' } as DetailView,
    },
    {
      key: 'equipo' as const,
      Icon: Users,
      title: 'Equipo',
      counter: `${activeProfs} Disponible${activeProfs !== 1 ? 's' : ''}`,
      detail: { screen: 'equipo' } as DetailView,
    },
    {
      key: 'servicios' as const,
      Icon: ShoppingBag,
      title: 'Servicios',
      counter: `${activeSvcs} Disponible${activeSvcs !== 1 ? 's' : ''}`,
      detail: { screen: 'servicios' } as DetailView,
    },
    {
      key: 'politica' as const,
      Icon: Shield,
      title: 'Política de reservas',
      counter: null as string | null,
      detail: { screen: 'politica' } as DetailView,
    },
  ];

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-4">
        <div className="flex items-center" style={{ height: '36px' }}>
          <span className="text-[16px] font-bold text-[#121e6c] leading-[20px]">Ajustes</span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 px-4 pb-32">

        {/* Setting group — gap-[32px] between card and buttons */}
        <div className="flex flex-col gap-8 w-full">

          {/* APP Setting card */}
          <div className="bg-white rounded-[16px] px-3">
            {NAV_ITEMS.map(({ key, Icon, title, counter, detail: target }, i) => (
              <Fragment key={key}>
                <button
                  onClick={() => (isAdmin || key !== 'politica') ? setDetail(target) : undefined}
                  disabled={!isAdmin && key === 'politica'}
                  className="w-full flex items-center gap-3 py-3 text-left transition-opacity active:opacity-70 disabled:opacity-40"
                >
                  <Icon size={20} color="#121e6c" strokeWidth={1.5} className="shrink-0" />
                  <span className="flex-1 text-[14px] font-normal text-[#1e1e1e] leading-[20px]">{title}</span>
                  {counter && (
                    <span
                      className="text-[14px] font-normal leading-[20px] whitespace-nowrap shrink-0"
                      style={{ color: '#babdd3' }}
                    >
                      {counter}
                    </span>
                  )}
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <ChevronRight size={14} color="#babdd3" strokeWidth={2} />
                  </div>
                </button>
                {i < NAV_ITEMS.length - 1 && (
                  <div className="h-px w-full" style={{ backgroundColor: 'rgba(210,212,225,0.4)' }} />
                )}
              </Fragment>
            ))}
          </div>

          {/* Action buttons — gap-[8px] */}
          <div className="flex flex-col gap-2 items-center w-full">
            {/* Cerrar sesión — card style */}
            <button
              className="w-full bg-white rounded-[16px] px-3 flex items-center justify-center active:opacity-70 transition-opacity"
              style={{ height: '44px' }}
            >
              <span className="text-[14px] font-bold text-[#121e6c] leading-[20px]">Cerrar sesión</span>
            </button>

            {/* Desactivar cuenta — link style */}
            <button className="flex items-center justify-center py-3 active:opacity-70 transition-opacity">
              <span className="text-[12px] font-semibold text-[#121e6c] underline leading-[16px]">
                Desactivar cuenta
              </span>
            </button>
          </div>
        </div>

        {/* Prototype reset — admin only, retained for prototype utility */}
        {isAdmin && (
          <div className="bg-white rounded-2xl px-4 py-4 border border-gray-100">
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-3">Datos del prototipo</p>
            {showResetConfirm ? (
              <div className="flex flex-col gap-3">
                <div className="bg-[#FFF1F2] rounded-xl px-3 py-3 flex gap-2">
                  <AlertTriangle size={14} color="#BE123C" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <p className="text-xs text-[#BE123C] leading-relaxed">
                    Esto restaurará todas las citas, clientes, ventas y ajustes al estado inicial del prototipo.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onReset(); setShowResetConfirm(false); setDetail(null); }}
                    className="flex-1 h-10 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#FF2947' }}
                  >
                    Sí, restablecer
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 h-10 rounded-full text-xs font-bold border border-gray-200 text-[#606060]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 text-sm font-semibold text-[#969696] transition-all active:opacity-70"
              >
                <RotateCcw size={15} color="#969696" strokeWidth={2} />
                Restablecer datos del prototipo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared detail header ─────────────────────────────────────────────────────

function DetailHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="bg-white px-4 pt-4 pb-3 flex items-center gap-2 border-b border-gray-100 flex-shrink-0">
      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center -ml-2 shrink-0 transition-opacity active:opacity-60"
      >
        <ArrowLeft size={22} color="#121e6c" strokeWidth={2} />
      </button>
      <h1 className="text-lg font-bold text-[#121e6c] leading-tight">{title}</h1>
    </header>
  );
}

// ── Perfil detail screen ──────────────────────────────────────────────────────

function PerfilDetail({ profile, isAdmin, onSave, onBack }: {
  profile: BusinessProfile; isAdmin: boolean;
  onSave: (bp: BusinessProfile) => void; onBack: () => void;
}) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const fields: Array<{ key: keyof BusinessProfile; label: string; multiline?: boolean }> = [
    { key: 'name', label: 'Nombre del negocio' },
    { key: 'address', label: 'Dirección' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'schedule', label: 'Horario' },
    { key: 'description', label: 'Descripción', multiline: true },
  ];

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <DetailHeader title="Perfil del negocio" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {fields.map(({ key, label, multiline }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className={LABEL_CLZ}>{label}</label>
            {isAdmin ? (
              multiline ? (
                <textarea
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  rows={3}
                  className={`${INPUT_CLZ} py-2.5 resize-none leading-relaxed`}
                  style={INPUT_STYLE}
                />
              ) : (
                <input
                  type="text"
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className={`${INPUT_CLZ} h-10`}
                  style={INPUT_STYLE}
                />
              )
            ) : (
              <p className="text-sm text-[#1e1e1e] bg-[#f7f8fb] rounded-xl px-3 py-2.5 leading-relaxed">{form[key]}</p>
            )}
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: saved ? '#15803D' : '#FF2947' }}
          >
            {saved && <Check size={16} color="#fff" strokeWidth={2.5} />}
            {saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Helpers de horario ───────────────────────────────────────────────────────

const DAYS_ES: { key: Weekday; name: string }[] = [
  { key: 'mon', name: 'Lunes' },
  { key: 'tue', name: 'Martes' },
  { key: 'wed', name: 'Miércoles' },
  { key: 'thu', name: 'Jueves' },
  { key: 'fri', name: 'Viernes' },
  { key: 'sat', name: 'Sábado' },
  { key: 'sun', name: 'Domingo' },
];

const TIME_OPTIONS: string[] = (() => {
  const opts: string[] = [];
  for (let m = 7 * 60; m <= 20 * 60; m += 30) {
    opts.push(minToTime(m));
  }
  return opts;
})();

const MAX_INTERVALS_PER_DAY = 3;

function formatDaySchedule(day: WorkingDay): string {
  if (!day.enabled || day.intervals.length === 0) return 'No trabaja';
  return day.intervals.map(iv => `${iv.startTime}–${iv.endTime}`).join(' · ');
}

function validateDayIntervals(day: WorkingDay): string | null {
  if (!day.enabled) return null;
  if (day.intervals.length === 0) return 'Agrega al menos un bloque horario.';
  const sorted = [...day.intervals].sort((a, b) => timeToMin(a.startTime) - timeToMin(b.startTime));
  for (let i = 0; i < sorted.length; i++) {
    if (timeToMin(sorted[i].endTime) <= timeToMin(sorted[i].startTime)) {
      return 'La hora de cierre debe ser posterior a la de apertura.';
    }
    if (i > 0 && timeToMin(sorted[i].startTime) < timeToMin(sorted[i - 1].endTime)) {
      return 'Los bloques no pueden solaparse.';
    }
  }
  return null;
}

function countScheduleConflicts(
  profId: string, newSchedule: WeeklySchedule, appointments: Appointment[],
): number {
  const { services } = store.get();
  return appointments.filter(a => {
    if (a.professionalId !== profId) return false;
    if (a.date < PROTOTYPE_TODAY) return false;
    if (['cancelada', 'cancelada-tarde', 'completada', 'no-show'].includes(a.status)) return false;
    const wd = newSchedule[getWeekday(a.date)];
    const svc = services.find(s => s.id === a.serviceId);
    const aptStart = timeToMin(a.startTime);
    const aptEnd = aptStart + (svc?.duration ?? 60);
    if (!wd.enabled || wd.intervals.length === 0) return true;
    const fitsSomeInterval = wd.intervals.some(
      iv => aptStart >= timeToMin(iv.startTime) && aptEnd <= timeToMin(iv.endTime)
    );
    return !fitsSomeInterval;
  }).length;
}

function serviceIdsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function scheduleEqual(a: WeeklySchedule, b: WeeklySchedule): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ── Prof detail screen ────────────────────────────────────────────────────────

function ProfDetail({ prof, services, appointments, isAdmin, onSave, onBack }: {
  prof: Professional; services: Service[]; appointments: Appointment[]; isAdmin: boolean;
  onSave: (p: Professional) => void; onBack: () => void;
}) {
  const [active, setActive] = useState((prof as any).active !== false);
  const [serviceIds, setServiceIds] = useState<string[]>(prof.serviceIds ?? []);
  const [showServicesEdit, setShowServicesEdit] = useState(false);
  const [servicesDraft, setServicesDraft] = useState<string[]>(serviceIds);

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(
    prof.weeklySchedule ?? DEFAULT_WEEKLY_SCHEDULE,
  );
  const [showScheduleEdit, setShowScheduleEdit] = useState(false);
  const [draft, setDraft] = useState<WeeklySchedule>(weeklySchedule);
  const [scheduleConflicts, setScheduleConflicts] = useState(0);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const count = aptCount(appointments, a => a.professionalId === prof.id);
  const servicesDirty = !serviceIdsEqual(servicesDraft, serviceIds);
  const scheduleDirty = !scheduleEqual(draft, weeklySchedule);

  function handleToggleActive() {
    const next = !active;
    setActive(next);
    onSave({ ...prof, active: next, weeklySchedule, serviceIds });
  }

  function handleSaveServices() {
    setServiceIds(servicesDraft);
    onSave({ ...prof, active, weeklySchedule, serviceIds: servicesDraft });
    setShowServicesEdit(false);
  }

  function handleSaveSchedule() {
    let err: string | null = null;
    for (const { key, name } of DAYS_ES) {
      const dayErr = validateDayIntervals(draft[key]);
      if (dayErr) { err = `${name}: ${dayErr}`; break; }
    }
    if (err) { setScheduleError(err); return; }
    setScheduleError(null);
    const conflicts = countScheduleConflicts(prof.id, draft, appointments);
    setScheduleConflicts(conflicts);
    setWeeklySchedule(draft);
    onSave({ ...prof, active, weeklySchedule: draft, serviceIds });
    setShowScheduleEdit(false);
  }

  function toggleDay(key: Weekday) {
    setDraft(d => {
      const wd = d[key];
      if (wd.enabled) return { ...d, [key]: { ...wd, enabled: false } };
      return {
        ...d,
        [key]: {
          ...wd,
          enabled: true,
          intervals: wd.intervals.length ? wd.intervals : [{ startTime: '08:00', endTime: '18:00' }],
        },
      };
    });
  }

  function addInterval(key: Weekday) {
    setDraft(d => {
      const wd = d[key];
      if (wd.intervals.length >= MAX_INTERVALS_PER_DAY) return d;
      return { ...d, [key]: { ...wd, intervals: [...wd.intervals, { startTime: '08:00', endTime: '18:00' }] } };
    });
  }

  function removeInterval(key: Weekday, idx: number) {
    setDraft(d => ({ ...d, [key]: { ...d[key], intervals: d[key].intervals.filter((_, i) => i !== idx) } }));
  }

  function updateInterval(key: Weekday, idx: number, field: 'startTime' | 'endTime', value: string) {
    setDraft(d => ({
      ...d,
      [key]: {
        ...d[key],
        intervals: d[key].intervals.map((iv, i) => i === idx ? { ...iv, [field]: value } : iv),
      },
    }));
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <DetailHeader title={prof.name.split(' ')[0]} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3 bg-[#f7f8fb] rounded-2xl px-4 py-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FFFFFF', opacity: active ? 1 : 0.4 }}
          >
            <span className="text-[14px] font-normal leading-[20px]" style={{ color: '#121e6c' }}>{prof.initials}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1e1e1e]">{prof.name}</p>
            <p className="text-xs text-[#969696] mt-0.5">{prof.role}</p>
            {count > 0 && (
              <p className="text-[10px] text-[#b0b5c8] mt-1">
                {count} cita{count > 1 ? 's' : ''} pendiente{count > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Active toggle */}
        {isAdmin && (
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#1e1e1e]">Profesional activa</p>
              <p className="text-xs text-[#969696] mt-0.5">
                {active ? 'Aparece en agenda y reservas' : 'Oculta en agenda y reservas'}
              </p>
            </div>
            <button onClick={handleToggleActive} className="shrink-0 ml-3 transition-all active:opacity-70">
              {active
                ? <ToggleRight size={28} color="#121e6c" strokeWidth={1.8} />
                : <ToggleLeft size={28} color="#969696" strokeWidth={1.8} />}
            </button>
          </div>
        )}

        {/* Servicios */}
        <div className="flex flex-col gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1e1e1e]">Servicios</p>
              <p className="text-xs text-[#969696] mt-0.5">
                {serviceIds.length} servicio{serviceIds.length !== 1 ? 's' : ''} asignado{serviceIds.length !== 1 ? 's' : ''}
              </p>
            </div>
            {isAdmin && !showServicesEdit && (
              <button
                onClick={() => { setServicesDraft(serviceIds); setShowServicesEdit(true); }}
                className="text-[12px] font-semibold text-[#121e6c] active:opacity-60 transition-opacity"
              >
                Gestionar
              </button>
            )}
          </div>

          {showServicesEdit && (
            <div className="flex flex-col gap-2">
              {services.map(svc => {
                const checked = servicesDraft.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    onClick={() => setServicesDraft(d => checked ? d.filter(id => id !== svc.id) : [...d, svc.id])}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 bg-[#f7f8fb] transition-opacity active:opacity-70"
                  >
                    <span className="text-xs font-medium text-[#1e1e1e]">{svc.name}</span>
                    {checked
                      ? <Check size={16} color="#121e6c" strokeWidth={2.5} />
                      : <div className="w-4 h-4 rounded border" style={{ borderColor: '#d2d4e1' }} />}
                  </button>
                );
              })}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowServicesEdit(false)}
                  className="flex-1 h-9 rounded-full border text-xs font-semibold text-[#606060] active:opacity-70 transition-opacity"
                  style={{ borderColor: '#d2d4e1' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveServices}
                  disabled={!servicesDirty}
                  className="flex-1 h-9 rounded-full text-xs font-semibold text-white transition-opacity disabled:opacity-40 active:opacity-80"
                  style={{ backgroundColor: '#121e6c' }}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Horario laboral */}
        <div className="flex flex-col gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1e1e1e]">Horario laboral</p>
            {isAdmin && !showScheduleEdit && (
              <button
                onClick={() => {
                  setDraft(weeklySchedule);
                  setScheduleConflicts(0);
                  setScheduleError(null);
                  setShowScheduleEdit(true);
                }}
                className="text-[12px] font-semibold text-[#121e6c] active:opacity-60 transition-opacity"
              >
                Editar
              </button>
            )}
          </div>

          {/* Vista lectura */}
          {!showScheduleEdit && (
            <div className="flex flex-col gap-2">
              {DAYS_ES.map(({ key, name }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#1e1e1e] shrink-0">{name}</span>
                  <span className="text-xs text-[#969696] text-right">{formatDaySchedule(weeklySchedule[key])}</span>
                </div>
              ))}
            </div>
          )}

          {/* Editor de bloques por día */}
          {showScheduleEdit && (
            <div className="flex flex-col gap-4">
              {DAYS_ES.map(({ key, name }) => {
                const wd = draft[key];
                return (
                  <div key={key} className="flex flex-col gap-2 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1e1e1e]">{name}</span>
                      <button onClick={() => toggleDay(key)} className="transition-all active:opacity-70">
                        {wd.enabled
                          ? <ToggleRight size={24} color="#121e6c" strokeWidth={1.8} />
                          : <ToggleLeft size={24} color="#969696" strokeWidth={1.8} />
                        }
                      </button>
                    </div>

                    {wd.enabled ? (
                      <div className="flex flex-col gap-2">
                        {wd.intervals.map((iv, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <select
                              value={iv.startTime}
                              onChange={e => updateInterval(key, idx, 'startTime', e.target.value)}
                              className={INPUT_CLZ}
                              style={{ ...INPUT_STYLE, height: 36, flex: 1 }}
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <span className="text-xs text-[#969696] shrink-0">a</span>
                            <select
                              value={iv.endTime}
                              onChange={e => updateInterval(key, idx, 'endTime', e.target.value)}
                              className={INPUT_CLZ}
                              style={{ ...INPUT_STYLE, height: 36, flex: 1 }}
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {wd.intervals.length > 1 && (
                              <button
                                onClick={() => removeInterval(key, idx)}
                                className="text-[11px] font-semibold text-[#BE123C] shrink-0 active:opacity-70 transition-opacity"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        ))}
                        {wd.intervals.length < MAX_INTERVALS_PER_DAY && (
                          <button
                            onClick={() => addInterval(key)}
                            className="text-[12px] font-semibold text-[#121e6c] text-left active:opacity-60 transition-opacity"
                          >
                            + Agregar horario
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#b0b5c8]">No trabaja</p>
                    )}
                  </div>
                );
              })}

              {scheduleError && (
                <p className="text-xs text-red-500">{scheduleError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowScheduleEdit(false);
                    setScheduleConflicts(0);
                    setScheduleError(null);
                  }}
                  className="flex-1 h-9 rounded-full border text-xs font-semibold text-[#606060] active:opacity-70 transition-opacity"
                  style={{ borderColor: '#d2d4e1' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={!scheduleDirty}
                  className="flex-1 h-9 rounded-full text-xs font-semibold text-white transition-opacity disabled:opacity-40 active:opacity-80"
                  style={{ backgroundColor: '#121e6c' }}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
        </div>

        {scheduleConflicts > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 flex items-start gap-2">
            <AlertTriangle size={14} color="#b45309" strokeWidth={2} className="mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Este cambio deja {scheduleConflicts} cita{scheduleConflicts !== 1 ? 's' : ''} fuera del horario de {prof.name.split(' ')[0]}. Las citas no se modificarán y podrás revisarlas desde la agenda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Service detail screen ─────────────────────────────────────────────────────

const DURATION_OPTIONS: number[] = [15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 210, 240, 300];

function ServiceDetail({ svc, appointments, isAdmin, onSave, onBack }: {
  svc: Service; appointments: Appointment[]; isAdmin: boolean;
  onSave: (s: Service) => void; onBack: () => void;
}) {
  const [name, setName] = useState(svc.name);
  const [description, setDescription] = useState(svc.description ?? '');
  const [duration, setDuration] = useState(svc.duration);
  const [price, setPrice] = useState(String(svc.price));
  const [commissionPercent, setCommissionPercent] = useState(String(svc.commissionPercent));
  const [requiresDeposit, setRequiresDeposit] = useState(svc.requiresDeposit);
  const [active, setActive] = useState((svc as any).active !== false);
  const [category, setCategory] = useState(svc.category ?? SERVICE_CATEGORIES[0]);
  const [icon, setIcon] = useState(svc.icon ?? SERVICE_ICON_OPTIONS[0].key);
  const [color, setColor] = useState(svc.color ?? Object.keys(SERVICE_COLORS)[0]);
  const count = aptCount(appointments, a => a.serviceId === svc.id);

  const parsedPrice = parseInt(price.replace(/\D/g, ''), 10);
  const parsedCommission = parseInt(commissionPercent.replace(/\D/g, ''), 10);

  const candidate: Service = {
    ...svc,
    name,
    description,
    duration,
    price: isNaN(parsedPrice) ? svc.price : parsedPrice,
    commissionPercent: isNaN(parsedCommission) ? svc.commissionPercent : Math.min(100, parsedCommission),
    requiresDeposit,
    active,
    category,
    icon,
    color,
  };
  // Normalize the original the same way local state defaults optional fields,
  // so an untouched form (e.g. active undefined → true) doesn't read as dirty.
  const originalNormalized: Service = { ...svc, active: (svc as any).active !== false };
  const dirty = JSON.stringify(candidate) !== JSON.stringify(originalNormalized);

  function handleSave() {
    onSave(candidate);
  }

  function handleBack() {
    if (dirty && !window.confirm('Tienes cambios sin guardar. ¿Quieres salir sin guardarlos?')) return;
    onBack();
  }

  const PreviewIcon = getServiceIcon(icon);
  const previewColor = getServiceColor(color);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <DetailHeader title={svc.name} onBack={handleBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {count > 0 && (
          <p className="text-[10px] text-[#b0b5c8]">{count} cita{count > 1 ? 's' : ''} activa{count > 1 ? 's' : ''}</p>
        )}

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLZ}>Nombre</label>
          {isAdmin ? (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`${INPUT_CLZ} h-10`}
              style={INPUT_STYLE}
            />
          ) : (
            <p className="text-sm font-semibold text-[#1e1e1e] bg-[#f7f8fb] rounded-xl px-3 py-2.5">{name}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLZ}>Descripción</label>
          {isAdmin ? (
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe el servicio para el catálogo público…"
              className={`${INPUT_CLZ} py-2.5 resize-none leading-relaxed`}
              style={INPUT_STYLE}
            />
          ) : (
            <p className="text-sm text-[#1e1e1e] bg-[#f7f8fb] rounded-xl px-3 py-2.5 leading-relaxed">{description || '—'}</p>
          )}
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLZ}>Duración</label>
          {isAdmin ? (
            <select
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className={`${INPUT_CLZ} h-10`}
              style={INPUT_STYLE}
            >
              {DURATION_OPTIONS.map(d => <option key={d} value={d}>{formatDuration(d)}</option>)}
            </select>
          ) : (
            <p className="text-sm font-semibold text-[#1e1e1e] bg-[#f7f8fb] rounded-xl px-3 py-2.5">{formatDuration(duration)}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLZ}>Precio</label>
          {isAdmin ? (
            <div className="flex items-center gap-2 h-10 rounded-xl border px-3 bg-white" style={INPUT_STYLE}>
              <span className="text-sm text-[#969696]">$</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-sm font-bold text-[#121e6c] outline-none tabular-nums"
              />
            </div>
          ) : (
            <p className="text-sm font-bold text-[#121e6c] bg-[#f7f8fb] rounded-xl px-3 py-2.5">{formatCOP(svc.price)}</p>
          )}
        </div>

        {/* Commission */}
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLZ}>Comisión %</label>
          {isAdmin ? (
            <div className="flex items-center gap-2 h-10 rounded-xl border px-3 bg-white" style={INPUT_STYLE}>
              <input
                type="number"
                min={0}
                max={100}
                value={commissionPercent}
                onChange={e => setCommissionPercent(e.target.value)}
                className="flex-1 bg-transparent text-sm font-bold text-[#121e6c] outline-none tabular-nums"
              />
              <span className="text-sm text-[#969696]">%</span>
            </div>
          ) : (
            <p className="text-sm font-bold text-[#121e6c] bg-[#f7f8fb] rounded-xl px-3 py-2.5">{svc.commissionPercent}%</p>
          )}
        </div>

        {/* Requires deposit */}
        {isAdmin && (
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#1e1e1e]">Pago anticipado</p>
              <p className="text-xs text-[#969696] mt-0.5">
                {requiresDeposit ? 'El cliente paga antes de confirmar' : 'Sin requisito de pago previo'}
              </p>
            </div>
            <button onClick={() => setRequiresDeposit(!requiresDeposit)} className="shrink-0 ml-3 transition-all active:opacity-70">
              {requiresDeposit
                ? <ToggleRight size={28} color="#121e6c" strokeWidth={1.8} />
                : <ToggleLeft size={28} color="#969696" strokeWidth={1.8} />}
            </button>
          </div>
        )}

        {/* Active */}
        {isAdmin && (
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#1e1e1e]">Servicio activo</p>
              <p className="text-xs text-[#969696] mt-0.5">
                {active ? 'Disponible para agendar' : 'Oculto en agenda y reservas'}
              </p>
            </div>
            <button onClick={() => setActive(!active)} className="shrink-0 ml-3 transition-all active:opacity-70">
              {active
                ? <ToggleRight size={28} color="#121e6c" strokeWidth={1.8} />
                : <ToggleLeft size={28} color="#969696" strokeWidth={1.8} />}
            </button>
          </div>
        )}

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLZ}>Categoría</label>
          <div className="flex gap-2 flex-wrap">
            {SERVICE_CATEGORIES.map(cat => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => isAdmin && setCategory(cat)}
                  disabled={!isAdmin}
                  className="h-9 px-3.5 rounded-full text-xs font-semibold border transition-all active:opacity-70 disabled:opacity-60"
                  style={{
                    backgroundColor: isActive ? '#121e6c' : '#fff',
                    color: isActive ? '#fff' : '#606060',
                    borderColor: isActive ? '#121e6c' : '#d2d4e1',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon + color preview */}
        <div className="flex items-center gap-3 bg-[#f7f8fb] rounded-2xl px-4 py-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: previewColor.bg }}
          >
            <PreviewIcon size={22} color={previewColor.color} strokeWidth={1.8} />
          </div>
          <p className="text-xs text-[#969696]">Así se verá en el catálogo público</p>
        </div>

        {/* Icon picker */}
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLZ}>Icono</label>
          <div className="flex gap-2 flex-wrap">
            {SERVICE_ICON_OPTIONS.map(({ key, label }) => {
              const Icon = getServiceIcon(key);
              const isActive = icon === key;
              return (
                <button
                  key={key}
                  onClick={() => isAdmin && setIcon(key)}
                  disabled={!isAdmin}
                  aria-label={label}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all active:opacity-70 disabled:opacity-60"
                  style={{
                    borderColor: isActive ? '#121e6c' : '#d2d4e1',
                    backgroundColor: isActive ? '#EEF0FB' : '#fff',
                  }}
                >
                  <Icon size={18} color={isActive ? '#121e6c' : '#606060'} strokeWidth={1.8} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLZ}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(SERVICE_COLORS).map(([key, meta]) => {
              const isActive = color === key;
              return (
                <button
                  key={key}
                  onClick={() => isAdmin && setColor(key)}
                  disabled={!isAdmin}
                  aria-label={meta.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all active:opacity-70 disabled:opacity-60"
                  style={{ borderColor: isActive ? meta.color : 'transparent' }}
                >
                  <span className="w-7 h-7 rounded-full" style={{ backgroundColor: meta.color }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#FF2947' }}
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}

// ── Política detail screen ────────────────────────────────────────────────────

function PoliticaDetail({ policy, isAdmin, onSave, onBack }: {
  policy: BookingPolicy; isAdmin: boolean;
  onSave: (p: BookingPolicy) => void; onBack: () => void;
}) {
  const [hours, setHours] = useState(policy.cancellationWindowHours);
  const [publicEnabled, setPublicEnabled] = useState(policy.publicBookingEnabled);
  const [saved, setSaved] = useState(false);
  const HOUR_OPTIONS = [12, 24, 48, 72];

  function handleSave() {
    onSave({ cancellationWindowHours: hours, publicBookingEnabled: publicEnabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <DetailHeader title="Política de reservas" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {/* Cancellation window */}
        <div>
          <label className={LABEL_CLZ}>Ventana de cancelación gratuita</label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {HOUR_OPTIONS.map(h => {
              const isActive = hours === h;
              return (
                <button
                  key={h}
                  onClick={() => isAdmin && setHours(h)}
                  disabled={!isAdmin}
                  className="flex-1 h-10 rounded-full text-xs font-semibold border-2 min-w-[60px] transition-all"
                  style={{
                    backgroundColor: isActive ? '#121e6c' : '#fff',
                    color: isActive ? '#fff' : '#606060',
                    borderColor: isActive ? '#121e6c' : '#d2d4e1',
                    opacity: isAdmin ? 1 : 0.6,
                  }}
                >
                  {h}h
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#969696] mt-2">
            Los clientes pueden cancelar sin cargo hasta {hours}h antes de la cita.
          </p>
        </div>

        {/* Public booking toggle */}
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#1e1e1e]">Reservas en línea</p>
            <p className="text-xs text-[#969696] mt-0.5">
              {publicEnabled ? 'Habilitadas — los clientes pueden reservar desde el sitio público' : 'Deshabilitadas — sitio público muestra contacto'}
            </p>
          </div>
          <button
            onClick={() => isAdmin && setPublicEnabled(!publicEnabled)}
            disabled={!isAdmin}
            className="shrink-0 ml-3 transition-all active:opacity-70"
          >
            {publicEnabled
              ? <ToggleRight size={28} color="#121e6c" strokeWidth={1.8} />
              : <ToggleLeft size={28} color="#969696" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: saved ? '#15803D' : '#FF2947' }}
          >
            {saved && <Check size={16} color="#fff" strokeWidth={2.5} />}
            {saved ? 'Guardado' : 'Guardar política'}
          </button>
        </div>
      )}
    </div>
  );
}
