import { useState } from 'react';
import {
  Store, Users, Scissors, Shield, ChevronRight,
  Check, AlertTriangle, Sparkles, RotateCcw, ToggleLeft, ToggleRight,
  ArrowLeft,
} from 'lucide-react';
import { formatCOP, formatDuration } from '../data/appointments';
import type { Role, Professional, Service, BusinessProfile, BookingPolicy, Appointment } from '../types';

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
  onUpdateBusinessProfile, onUpdateBookingPolicy, onReset,
}: Props) {
  const [detail, setDetail] = useState<DetailView>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const isAdmin = role === 'admin';

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
        appointments={appointments}
        isAdmin={isAdmin}
        onSave={(updated) => {
          const next = professionals.map(p => p.id === updated.id ? updated : p);
          onUpdateProfessionals(next);
          setDetail({ screen: 'equipo' });
        }}
        onBack={() => setDetail({ screen: 'equipo' })}
      />
    );
  }

  // ── Equipo list detail ─────────────────────────────────────────────────
  if (detail?.screen === 'equipo') {
    return (
      <div className="flex flex-col h-full bg-white">
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
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 active:bg-gray-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#121e6c', opacity: active ? 1 : 0.4 }}>
                    <span className="text-sm font-bold text-white">{prof.initials}</span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-[#1e1e1e]">{prof.name}</p>
                    <p className="text-xs text-[#969696] mt-0.5">
                      {prof.role} · {Math.round(prof.commissionRate * 100)}% comisión
                    </p>
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
          setDetail({ screen: 'servicios' });
        }}
        onBack={() => setDetail({ screen: 'servicios' })}
      />
    );
  }

  // ── Servicios list detail ───────────────────────────────────────────────
  if (detail?.screen === 'servicios') {
    return (
      <div className="flex flex-col h-full bg-white">
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
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 active:bg-gray-50 transition-all"
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
      Icon: Store,
      title: 'Perfil del negocio',
      desc: 'Nombre, dirección, horario y descripción',
      detail: { screen: 'perfil' } as DetailView,
    },
    {
      key: 'equipo' as const,
      Icon: Users,
      title: 'Equipo',
      desc: `${activeProfs} profesional${activeProfs !== 1 ? 'es' : ''} activa${activeProfs !== 1 ? 's' : ''}`,
      detail: { screen: 'equipo' } as DetailView,
    },
    {
      key: 'servicios' as const,
      Icon: Scissors,
      title: 'Servicios',
      desc: `${activeSvcs} servicio${activeSvcs !== 1 ? 's' : ''} activo${activeSvcs !== 1 ? 's' : ''}`,
      detail: { screen: 'servicios' } as DetailView,
    },
    {
      key: 'politica' as const,
      Icon: Shield,
      title: 'Política de reservas',
      desc: `Cancelación ${bookingPolicy.cancellationWindowHours}h · ${bookingPolicy.publicBookingEnabled ? 'Reservas abiertas' : 'Reservas cerradas'}`,
      detail: { screen: 'politica' } as DetailView,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-[#121e6c]">Ajustes</h1>
        <p className="text-xs text-[#969696] mt-0.5">Salón Camila</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="bg-[#FFF1F2] rounded-2xl p-4 flex gap-3">
          <Sparkles size={18} color="#FF2947" strokeWidth={1.8} className="shrink-0 mt-0.5" />
          <p className="text-xs text-[#606060] leading-snug">
            {isAdmin ? 'Puedes editar cualquier ajuste en cualquier momento.' : 'Solo el administrador puede editar estos ajustes.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
          {NAV_ITEMS.map(({ key, Icon, title, desc, detail: target }) => (
            <button
              key={key}
              onClick={() => (isAdmin || key === 'perfil' || key === 'equipo' || key === 'servicios') ? setDetail(target) : null}
              disabled={!isAdmin && key === 'politica'}
              className="w-full flex items-center gap-3 px-4 py-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#f3f3f3] flex items-center justify-center shrink-0">
                <Icon size={18} color="#121e6c" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#121e6c]">{title}</p>
                <p className="text-xs text-[#969696] mt-0.5 truncate">{desc}</p>
              </div>
              <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
            </button>
          ))}
        </div>

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
        <div className="h-16" />
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
    <div className="flex flex-col h-full bg-white">
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

// ── Prof detail screen ────────────────────────────────────────────────────────

function ProfDetail({ prof, appointments, isAdmin, onSave, onBack }: {
  prof: Professional; appointments: Appointment[]; isAdmin: boolean;
  onSave: (p: Professional) => void; onBack: () => void;
}) {
  const [active, setActive] = useState((prof as any).active !== false);
  const count = aptCount(appointments, a => a.professionalId === prof.id);

  return (
    <div className="flex flex-col h-full bg-white">
      <DetailHeader title={prof.name.split(' ')[0]} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3 bg-[#f7f8fb] rounded-2xl px-4 py-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#121e6c', opacity: active ? 1 : 0.4 }}>
            <span className="text-sm font-bold text-white">{prof.initials}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1e1e1e]">{prof.name}</p>
            <p className="text-xs text-[#969696] mt-0.5">{prof.role}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          <div className="flex-1 bg-[#f7f8fb] rounded-xl px-3 py-3 text-center">
            <p className="text-base font-bold text-[#121e6c]">{Math.round(prof.commissionRate * 100)}%</p>
            <p className="text-[10px] text-[#969696] mt-0.5">Comisión</p>
          </div>
          <div className="flex-1 bg-[#f7f8fb] rounded-xl px-3 py-3 text-center">
            <p className="text-base font-bold text-[#121e6c]">{count}</p>
            <p className="text-[10px] text-[#969696] mt-0.5">Citas pendientes</p>
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
            <button onClick={() => setActive(!active)} className="shrink-0 ml-3 transition-all active:opacity-70">
              {active
                ? <ToggleRight size={28} color="#121e6c" strokeWidth={1.8} />
                : <ToggleLeft size={28} color="#969696" strokeWidth={1.8} />}
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
          <button
            onClick={() => onSave({ ...prof, active } as Professional)}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#FF2947' }}
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}

// ── Service detail screen ─────────────────────────────────────────────────────

function ServiceDetail({ svc, appointments, isAdmin, onSave, onBack }: {
  svc: Service; appointments: Appointment[]; isAdmin: boolean;
  onSave: (s: Service) => void; onBack: () => void;
}) {
  const [price, setPrice] = useState(String(svc.price));
  const [requiresDeposit, setRequiresDeposit] = useState(svc.requiresDeposit);
  const [active, setActive] = useState((svc as any).active !== false);
  const count = aptCount(appointments, a => a.serviceId === svc.id);

  function handleSave() {
    const parsedPrice = parseInt(price.replace(/\D/g, ''), 10);
    onSave({ ...svc, price: isNaN(parsedPrice) ? svc.price : parsedPrice, requiresDeposit, active });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <DetailHeader title={svc.name} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Info card */}
        <div className="bg-[#f7f8fb] rounded-2xl px-4 py-3 flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#1e1e1e]">{svc.name}</p>
          <p className="text-xs text-[#969696]">{formatDuration(svc.duration)}</p>
          {count > 0 && <p className="text-[10px] text-[#b0b5c8]">{count} cita{count > 1 ? 's' : ''} activa{count > 1 ? 's' : ''}</p>}
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
      </div>

      {isAdmin && (
        <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
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
    <div className="flex flex-col h-full bg-white">
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
