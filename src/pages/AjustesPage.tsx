import { useState, type ReactNode } from 'react';
import {
  Store, Users, Scissors, Shield, ChevronDown, ChevronRight,
  Check, AlertTriangle, Sparkles, RotateCcw, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { formatCOP } from '../data/appointments';
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
  onOpenEdit: (apt: Appointment) => void;
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
}

type SectionKey = 'perfil' | 'equipo' | 'servicios' | 'politica';

const SECTION_ICONS: Record<SectionKey, typeof Store> = {
  perfil: Store,
  equipo: Users,
  servicios: Scissors,
  politica: Shield,
};

const SECTION_LABELS: Record<SectionKey, string> = {
  perfil: 'Perfil del negocio',
  equipo: 'Equipo',
  servicios: 'Servicios',
  politica: 'Política de reservas',
};

export function AjustesPage({
  role, professionals, services, businessProfile, bookingPolicy,
  appointments, onUpdateProfessionals, onUpdateServices,
  onUpdateBusinessProfile, onUpdateBookingPolicy, onReset,
}: Props) {
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const isAdmin = role === 'admin';

  function toggle(key: SectionKey) {
    setOpenSection(prev => (prev === key ? null : key));
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ajustes" subtitle="Salón Camila" />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* White-glove banner */}
        <div className="bg-[#FFF1F2] rounded-2xl p-4 flex gap-3">
          <Sparkles size={18} color="#E8194B" strokeWidth={1.8} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#E8194B] leading-snug">Configuración asistida</p>
            <p className="text-xs text-[#606060] mt-0.5 leading-snug">
              {isAdmin ? 'Puedes editar cualquier ajuste en cualquier momento.' : 'Solo el administrador puede editar estos ajustes.'}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {(['perfil', 'equipo', 'servicios', 'politica'] as SectionKey[]).map(key => {
            const Icon = SECTION_ICONS[key];
            const isOpen = openSection === key;
            return (
              <div key={key}>
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 px-4 py-4 transition-colors active:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#f3f3f3] flex items-center justify-center shrink-0">
                    <Icon size={18} color="#121e6c" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-[#121e6c]">{SECTION_LABELS[key]}</p>
                    <p className="text-xs text-[#969696] mt-0.5">{sectionSubtitle(key, professionals, services, bookingPolicy)}</p>
                  </div>
                  {isOpen
                    ? <ChevronDown size={16} color="#969696" strokeWidth={2} />
                    : <ChevronRight size={16} color="#969696" strokeWidth={2} />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    {key === 'perfil' && (
                      <PerfilSection
                        profile={businessProfile}
                        isAdmin={isAdmin}
                        onSave={onUpdateBusinessProfile}
                      />
                    )}
                    {key === 'equipo' && (
                      <EquipoSection
                        professionals={professionals}
                        appointments={appointments}
                        isAdmin={isAdmin}
                        onSave={onUpdateProfessionals}
                      />
                    )}
                    {key === 'servicios' && (
                      <ServiciosSection
                        services={services}
                        appointments={appointments}
                        isAdmin={isAdmin}
                        onSave={onUpdateServices}
                      />
                    )}
                    {key === 'politica' && (
                      <PoliticaSection
                        policy={bookingPolicy}
                        isAdmin={isAdmin}
                        onSave={onUpdateBookingPolicy}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reset */}
        {isAdmin && (
          <div className="bg-white rounded-2xl px-4 py-4">
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
                    onClick={() => { onReset(); setShowResetConfirm(false); }}
                    className="flex-1 h-10 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#E8194B' }}
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

// ── Perfil ──────────────────────────────────────────────────────────────────

function PerfilSection({
  profile, isAdmin, onSave,
}: { profile: BusinessProfile; isAdmin: boolean; onSave: (bp: BusinessProfile) => void }) {
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
    <div className="flex flex-col gap-3 pt-1">
      {fields.map(({ key, label, multiline }) => (
        <Field
          key={key}
          label={label}
          value={form[key]}
          isAdmin={isAdmin}
          multiline={multiline}
          onChange={v => setForm(prev => ({ ...prev, [key]: v }))}
        />
      ))}
      {isAdmin && (
        <button
          onClick={handleSave}
          className="self-end flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-bold text-white mt-1 transition-all active:opacity-70"
          style={{ backgroundColor: saved ? '#15803D' : '#121e6c' }}
        >
          {saved && <Check size={12} color="#fff" strokeWidth={2.5} />}
          {saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      )}
    </div>
  );
}

// ── Equipo ──────────────────────────────────────────────────────────────────

function EquipoSection({
  professionals, appointments, isAdmin, onSave,
}: { professionals: Professional[]; appointments: Appointment[]; isAdmin: boolean; onSave: (p: Professional[]) => void }) {
  const [profs, setProfs] = useState(professionals);

  function aptCount(profId: string) {
    return appointments.filter(a => a.professionalId === profId && ['confirmada', 'reprogramada'].includes(a.status)).length;
  }

  return (
    <div className="flex flex-col gap-2 pt-1">
      {profs.map(prof => {
        const active = (prof as any).active !== false;
        const count = aptCount(prof.id);
        return (
          <div key={prof.id} className="bg-[#f7f8fb] rounded-xl px-3 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#121e6c', opacity: active ? 1 : 0.4 }}>
              <span className="text-xs font-bold text-white">{prof.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1e1e1e]">{prof.name}</p>
              <p className="text-xs text-[#969696] mt-0.5">{prof.role} · {Math.round(prof.commissionRate * 100)}% comisión</p>
              <p className="text-[10px] text-[#b0b5c8] mt-0.5">{count > 0 ? `${count} cita${count > 1 ? 's' : ''} pendiente${count > 1 ? 's' : ''}` : 'Sin citas pendientes'}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  const updated = profs.map(p =>
                    p.id === prof.id ? { ...p, active: !active } as Professional : p
                  );
                  setProfs(updated);
                  onSave(updated);
                }}
                className="shrink-0 transition-all active:opacity-70"
              >
                {active
                  ? <ToggleRight size={24} color="#121e6c" strokeWidth={1.8} />
                  : <ToggleLeft size={24} color="#969696" strokeWidth={1.8} />}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Servicios ───────────────────────────────────────────────────────────────

function ServiciosSection({
  services, appointments, isAdmin, onSave,
}: { services: Service[]; appointments: Appointment[]; isAdmin: boolean; onSave: (s: Service[]) => void }) {
  const [svcs, setSvcs] = useState(services);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  function futureAptCount(svcId: string) {
    return appointments.filter(a => a.serviceId === svcId && ['confirmada', 'reprogramada'].includes(a.status)).length;
  }

  function startEdit(svc: Service) {
    setEditId(svc.id);
    setEditPrice(String(svc.price));
  }

  function savePrice(svcId: string) {
    const price = parseInt(editPrice.replace(/\D/g, ''), 10);
    if (isNaN(price) || price <= 0) return;
    const updated = svcs.map(s => s.id === svcId ? { ...s, price } : s);
    setSvcs(updated);
    onSave(updated);
    setEditId(null);
    setSaved(svcId);
    setTimeout(() => setSaved(null), 1800);
  }

  function toggleActive(svcId: string) {
    const svc = svcs.find(s => s.id === svcId);
    if (!svc) return;
    const active = (svc as any).active !== false;
    const updated = svcs.map(s => s.id === svcId ? { ...s, active: !active } : s);
    setSvcs(updated);
    onSave(updated);
  }

  return (
    <div className="flex flex-col gap-2 pt-1">
      {svcs.map(svc => {
        const active = (svc as any).active !== false;
        const count = futureAptCount(svc.id);
        const isEditing = editId === svc.id;
        const isSaved = saved === svc.id;
        return (
          <div key={svc.id} className="bg-[#f7f8fb] rounded-xl px-3 py-3" style={{ opacity: active ? 1 : 0.55 }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e1e1e]">{svc.name}</p>
                <p className="text-xs text-[#969696] mt-0.5">{svc.duration} min{svc.requiresDeposit ? ' · Pago anticipado' : ''}</p>
                {count > 0 && (
                  <p className="text-[10px] text-[#b0b5c8] mt-0.5">{count} cita{count > 1 ? 's' : ''} activa{count > 1 ? 's' : ''}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#969696]">$</span>
                    <input
                      autoFocus
                      type="number"
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      className="w-24 h-8 rounded-lg border border-[#121e6c] px-2 text-sm font-bold text-[#121e6c] outline-none tabular-nums"
                      onKeyDown={e => { if (e.key === 'Enter') savePrice(svc.id); if (e.key === 'Escape') setEditId(null); }}
                    />
                    <button onClick={() => savePrice(svc.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#121e6c' }}>
                      <Check size={12} color="#fff" strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => isAdmin && startEdit(svc)}
                    disabled={!isAdmin}
                    className="text-sm font-bold tabular-nums text-right"
                    style={{ color: isSaved ? '#15803D' : '#121e6c' }}
                  >
                    {isSaved ? '✓ ' : ''}{formatCOP(svc.price)}
                  </button>
                )}

                {isAdmin && !isEditing && (
                  <button onClick={() => toggleActive(svc.id)} className="transition-all active:opacity-70">
                    {active
                      ? <ToggleRight size={22} color="#121e6c" strokeWidth={1.8} />
                      : <ToggleLeft size={22} color="#969696" strokeWidth={1.8} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {isAdmin && (
        <p className="text-[11px] text-[#969696] px-1 mt-1 leading-relaxed">
          Toca el precio para editarlo. Los cambios no afectan las citas con precio original guardado.
        </p>
      )}
    </div>
  );
}

// ── Política ────────────────────────────────────────────────────────────────

function PoliticaSection({
  policy, isAdmin, onSave,
}: { policy: BookingPolicy; isAdmin: boolean; onSave: (p: BookingPolicy) => void }) {
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
    <div className="flex flex-col gap-4 pt-1">
      {/* Cancellation window */}
      <div>
        <p className="text-xs font-semibold text-[#606060] mb-2">Ventana de cancelación gratuita</p>
        <div className="flex gap-2 flex-wrap">
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
          Los clientes pueden cancelar gratis hasta {hours}h antes de la cita.
        </p>
      </div>

      {/* Public booking toggle */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-semibold text-[#1e1e1e]">Reservas en línea</p>
          <p className="text-xs text-[#969696] mt-0.5">
            {publicEnabled ? 'Habilitadas — los clientes pueden reservar desde el sitio público' : 'Deshabilitadas — sitio público muestra mensaje de contacto'}
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

      {isAdmin && (
        <button
          onClick={handleSave}
          className="self-end flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-bold text-white transition-all active:opacity-70"
          style={{ backgroundColor: saved ? '#15803D' : '#121e6c' }}
        >
          {saved && <Check size={12} color="#fff" strokeWidth={2.5} />}
          {saved ? 'Guardado' : 'Guardar política'}
        </button>
      )}
    </div>
  );
}

// ── Shared ───────────────────────────────────────────────────────────────────

function Field({
  label, value, isAdmin, multiline, onChange,
}: {
  label: string;
  value: string;
  isAdmin: boolean;
  multiline?: boolean;
  onChange: (v: string) => void;
}) {
  const base = "w-full rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none transition-colors bg-white";
  const style = { borderColor: '#d2d4e1' };
  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#121e6c';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#d2d4e1';
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#606060]">{label}</label>
      {isAdmin ? (
        multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={2}
            className={`${base} py-2.5 resize-none leading-relaxed`}
            style={style}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${base} h-10`}
            style={style}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        )
      ) : (
        <p className="text-sm text-[#1e1e1e] bg-[#f7f8fb] rounded-xl px-3 py-2.5 leading-relaxed">{value}</p>
      )}
    </div>
  );
}

function sectionSubtitle(
  key: SectionKey,
  professionals: Professional[],
  services: Service[],
  policy: BookingPolicy,
): string {
  switch (key) {
    case 'perfil': return 'Nombre, dirección, horario';
    case 'equipo': return `${professionals.filter(p => (p as any).active !== false).length} profesionales activos`;
    case 'servicios': return `${services.filter(s => (s as any).active !== false).length} servicios activos`;
    case 'politica': return `Cancelación ${policy.cancellationWindowHours}h · ${policy.publicBookingEnabled ? 'Reservas abiertas' : 'Reservas cerradas'}`;
  }
}
