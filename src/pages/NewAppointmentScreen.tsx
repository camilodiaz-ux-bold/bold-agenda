import { useState, useMemo } from 'react';
import { Check, CheckCircle2, ChevronRight, Search, UserPlus, Smartphone, X, UserX } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { formatCOP, formatDuration } from '../data/appointments';
import { getAvailableSlots, addMinutes, PROTOTYPE_TODAY } from '../store/prototypeStore';
import type { Appointment, Client, Professional, Service, AvailabilityBlock, Role, BookingPolicy } from '../types';

interface Props {
  role: Role;
  viewScope: 'team' | 'mine';
  currentProfId: string;
  professionals: Professional[];
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
  bookingPolicy: BookingPolicy;
  onBack: () => void;
  onCreated: (apt: Appointment, newClient?: Client) => void;
}

type Step = 'service' | 'professional' | 'client' | 'datetime' | 'summary' | 'done';

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function getNextDays(n: number): string[] {
  const [y, m, d] = PROTOTYPE_TODAY.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  return Array.from({ length: n }, (_, i) => {
    const nd = new Date(base);
    nd.setDate(base.getDate() + i);
    return `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`;
  });
}

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
}

const STEP_TITLES: Record<Step, string> = {
  service: 'Servicio',
  professional: 'Profesional',
  client: 'Cliente',
  datetime: 'Fecha y hora',
  summary: 'Resumen',
  done: 'Cita creada',
};

export function NewAppointmentScreen({
  role, viewScope, currentProfId, professionals, services, clients,
  appointments, availabilityBlocks, bookingPolicy, onBack, onCreated,
}: Props) {
  const isAdmin = role === 'admin';
  const showProfSelector = isAdmin && viewScope === 'team';

  const [step, setStep] = useState<Step>('service');
  const [selSvc, setSelSvc] = useState<Service | null>(null);
  const [selProfId, setSelProfId] = useState<string>(currentProfId);
  const [selClient, setSelClient] = useState<Client | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: '', phone: '', cedula: '', email: '' });
  const [newClientErrors, setNewClientErrors] = useState<Record<string, string>>({});
  const [clientSearch, setClientSearch] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selDate, setSelDate] = useState('');
  const [selTime, setSelTime] = useState('');
  const [note, setNote] = useState('');

  const days = useMemo(() => getNextDays(28), []);

  const activeServices = useMemo(() => services.filter(s => (s as any).active !== false), [services]);
  const activeProfs = useMemo(() => professionals.filter(p => (p as any).active !== false), [professionals]);

  const slots = useMemo(() => {
    if (!selSvc || !selDate) return [];
    return getAvailableSlots(selSvc, selDate, selProfId, appointments, availabilityBlocks);
  }, [selSvc, selDate, selProfId, appointments, availabilityBlocks]);

  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.cedula.includes(q)
    );
  }, [clients, clientSearch]);

  function goToStep(next: Step) {
    setStep(next);
  }

  function selectService(svc: Service) {
    setSelSvc(svc);
    setSelDate('');
    setSelTime('');
    if (showProfSelector) {
      goToStep('professional');
    } else {
      setSelProfId(currentProfId);
      goToStep('client');
    }
  }

  function selectProfessional(profId: string) {
    setSelProfId(profId);
    setSelDate('');
    setSelTime('');
    goToStep('client');
  }

  function validateNewClient(): boolean {
    const errors: Record<string, string> = {};
    if (!newClientForm.name.trim()) errors.name = 'Requerido';
    if (!newClientForm.phone.trim()) errors.phone = 'Requerido';
    if (!newClientForm.cedula.trim()) errors.cedula = 'Requerido';
    setNewClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function confirmNewClient() {
    if (!validateNewClient()) return;
    const newClient: Client = {
      id: `c_${Date.now()}`,
      name: newClientForm.name.trim(),
      phone: newClientForm.phone.trim(),
      cedula: newClientForm.cedula.trim(),
      email: newClientForm.email.trim() || undefined,
      totalSpent: 0,
      visitCount: 0,
    };
    setSelClient(newClient);
    setIsNewClient(true);
    goToStep('datetime');
  }

  function selectExistingClient(client: Client) {
    setSelClient(client);
    setIsNewClient(false);
    goToStep('datetime');
  }

  function continueWithoutClient() {
    setSelClient(null);
    setIsNewClient(false);
    goToStep('datetime');
  }

  function confirmDateTime() {
    if (selDate && selTime) goToStep('summary');
  }

  function createAppointment() {
    if (!selSvc || !selDate || !selTime) return;
    const apt: Appointment = {
      id: `apt_${Date.now()}`,
      professionalId: selProfId,
      serviceId: selSvc.id,
      ...(selClient ? { clientName: selClient.name, clientPhone: selClient.phone, clientCedula: selClient.cedula } : {}),
      date: selDate,
      startTime: selTime,
      status: 'confirmada',
      paymentStatus: 'pendiente',
      notes: note.trim() || undefined,
      policySnapshot: { cancellationWindowHours: bookingPolicy.cancellationWindowHours },
      originalPrice: selSvc.price,
    };
    setStep('done');
    onCreated(apt, isNewClient ? selClient ?? undefined : undefined);
  }

  const selProf = professionals.find(p => p.id === selProfId);

  // ── Done ──────────────────────────────────────────────────────────────
  if (step === 'done') {
    const isWalkIn = !selClient;
    return (
      <div className="flex flex-col h-full bg-white">
        <PageHeader title="Cita creada" onBack={onBack} border />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: isWalkIn ? '#f0f1f5' : '#F0FDF4' }}>
            {isWalkIn
              ? <UserX size={30} color="#606060" strokeWidth={1.8} />
              : <CheckCircle2 size={30} color="#15803D" strokeWidth={2} />}
          </div>
          <div>
            {isWalkIn
              ? <p className="text-base font-bold text-[#b0b5c8] italic">Sin cliente asociado</p>
              : <p className="text-base font-bold text-[#1e1e1e]">{selClient?.name}</p>}
            <p className="text-sm text-[#969696] mt-1">{selSvc?.name} · {formatFullDate(selDate)}</p>
            <p className="text-sm text-[#969696]">{selTime} – {selSvc && addMinutes(selTime, selSvc.duration)}</p>
          </div>
          <div className="w-full bg-[#f7f8fb] rounded-2xl px-4 py-3 text-left flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
              <span className="text-xs text-[#606060]">Cita confirmada en la agenda</span>
            </div>
            {!isWalkIn && (
              <div className="flex items-center gap-2">
                <Smartphone size={13} color="#15803D" strokeWidth={2.5} />
                <span className="text-xs text-[#606060]">Recordatorio enviado por WhatsApp</span>
              </div>
            )}
            {isWalkIn && (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} color="#b0b5c8" strokeWidth={2.5} />
                <span className="text-xs text-[#969696]">Puedes agregar el cliente desde el detalle de la cita</span>
              </div>
            )}
            {selSvc?.requiresDeposit && (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} color="#B45309" strokeWidth={2.5} />
                <span className="text-xs text-[#B45309] font-semibold">Requiere pago anticipado — pendiente de cobro</span>
              </div>
            )}
          </div>
          <button
            onClick={onBack}
            className="w-full h-12 rounded-full font-bold text-sm text-white"
            style={{ backgroundColor: '#FF2947' }}
          >
            Volver a la agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader title={STEP_TITLES[step]} onBack={() => {
        if (step === 'service') onBack();
        else if (step === 'professional') goToStep('service');
        else if (step === 'client') goToStep(showProfSelector ? 'professional' : 'service');
        else if (step === 'datetime') goToStep('client');
        else if (step === 'summary') goToStep('datetime');
      }} border />

      {/* ── Service step ─────────────────────────────────────────────── */}
      {step === 'service' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {activeServices.map(svc => (
            <button
              key={svc.id}
              onClick={() => selectService(svc)}
              className="w-full flex items-center justify-between bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-left active:border-[#FF2947] active:bg-[#FFF1F2] transition-all"
            >
              <div>
                <p className="text-sm font-semibold text-[#1e1e1e]">{svc.name}</p>
                <p className="text-xs text-[#969696] mt-0.5">
                  {formatDuration(svc.duration)}{svc.requiresDeposit ? ' · Pago anticipado requerido' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(svc.price)}</span>
                <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Professional step ─────────────────────────────────────────── */}
      {step === 'professional' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {activeProfs.map(prof => {
            const isActive = selProfId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => selectProfessional(prof.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
                style={{ borderColor: isActive ? '#121e6c' : '#e8eaf0', backgroundColor: isActive ? '#f7f8fb' : '#fff' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#121e6c' }}>
                  <span className="text-sm font-bold text-white">{prof.initials}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>{prof.name}</p>
                  <p className="text-xs text-[#969696]">{prof.role}</p>
                </div>
                {isActive && <Check size={16} color="#121e6c" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Client step ──────────────────────────────────────────────── */}
      {step === 'client' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 h-10 rounded-xl border px-3" style={{ borderColor: '#d2d4e1', backgroundColor: '#f7f8fb' }}>
              <Search size={15} color="#969696" strokeWidth={2} />
              <input
                autoFocus
                type="text"
                placeholder="Buscar por nombre, teléfono o cédula"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
              />
              {clientSearch && (
                <button onClick={() => setClientSearch('')}>
                  <X size={14} color="#969696" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {showNewClientForm ? (
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest">Nuevo cliente</p>
              {([
                { key: 'name', label: 'Nombre completo', required: true, type: 'text' },
                { key: 'phone', label: 'Teléfono', required: true, type: 'tel' },
                { key: 'cedula', label: 'Cédula', required: true, type: 'text' },
                { key: 'email', label: 'Email (opcional)', required: false, type: 'email' },
              ] as const).map(({ key, label, type }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#606060]">{label}</label>
                  <input
                    type={type}
                    value={newClientForm[key]}
                    onChange={e => setNewClientForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-10 rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none transition-colors"
                    style={{ borderColor: newClientErrors[key] ? '#BE123C' : '#d2d4e1' }}
                  />
                  {newClientErrors[key] && <span className="text-xs text-[#BE123C]">{newClientErrors[key]}</span>}
                </div>
              ))}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setShowNewClientForm(false)}
                  className="flex-1 h-10 rounded-full border text-xs font-semibold text-[#606060]"
                  style={{ borderColor: '#d2d4e1' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmNewClient}
                  className="flex-1 h-10 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#FF2947' }}
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-1">
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => selectExistingClient(client)}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 active:opacity-70 text-left w-full"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#f0f1f5' }}>
                    <span className="text-xs font-bold text-[#121e6c]">
                      {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e1e1e] truncate">{client.name}</p>
                    <p className="text-xs text-[#969696]">{client.phone}</p>
                  </div>
                  <ChevronRight size={14} color="#b0b5c8" strokeWidth={2} />
                </button>
              ))}
              {filteredClients.length === 0 && clientSearch && (
                <p className="text-sm text-[#969696] py-4 text-center">Sin resultados para "{clientSearch}"</p>
              )}
              <button
                onClick={() => setShowNewClientForm(true)}
                className="flex items-center gap-2 py-3 text-sm font-semibold text-[#121e6c] active:opacity-70 mt-1"
              >
                <UserPlus size={16} color="#121e6c" strokeWidth={2} />
                Crear nuevo cliente
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={continueWithoutClient}
                className="flex items-center gap-2 py-3 text-sm font-semibold text-[#969696] active:opacity-70"
              >
                <UserX size={16} color="#969696" strokeWidth={2} />
                Continuar sin cliente
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Date + Time step ─────────────────────────────────────────── */}
      {step === 'datetime' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 flex flex-col gap-4">
            {/* Date strip */}
            <div>
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Fecha</p>
              <div className="overflow-x-auto -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                <div className="flex gap-2 w-max pb-1">
                  {days.map(dateStr => {
                    const d = new Date(dateStr + 'T12:00:00');
                    const isSelected = dateStr === selDate;
                    const isOff = d.getDay() === 0;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => { setSelDate(dateStr); setSelTime(''); }}
                        disabled={isOff}
                        className="flex flex-col items-center gap-1 py-2 w-11 rounded-2xl border-2 transition-all"
                        style={{ backgroundColor: isSelected ? '#121e6c' : '#fff', borderColor: isSelected ? '#121e6c' : '#e8eaf0', opacity: isOff ? 0.3 : 1 }}
                      >
                        <span className="text-[10px] font-semibold" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#969696' }}>
                          {WEEKDAY_SHORT[d.getDay()]}
                        </span>
                        <span className="text-sm font-bold" style={{ color: isSelected ? '#fff' : '#121e6c' }}>{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time slots */}
            {selDate && (
              <div>
                <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Hora disponible</p>
                {slots.length === 0 ? (
                  <p className="text-sm text-[#969696] py-2">Sin horarios disponibles para este día</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map(slot => {
                      const isActive = slot === selTime;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelTime(slot)}
                          className="w-[calc(33.333%-6px)] h-10 rounded-xl text-sm font-semibold border-2 transition-all"
                          style={{ backgroundColor: isActive ? '#121e6c' : '#fff', color: isActive ? '#fff' : '#121e6c', borderColor: isActive ? '#121e6c' : '#e8eaf0' }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
                {selTime && selSvc && (
                  <p className="text-xs text-[#969696] mt-2">{selTime} – {addMinutes(selTime, selSvc.duration)}</p>
                )}
              </div>
            )}

            {/* Note */}
            <div>
              <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Nota interna (opcional)</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Preferencias, alergias, indicaciones..."
                className="w-full rounded-xl border px-3 py-2.5 text-sm text-[#1e1e1e] outline-none resize-none leading-relaxed"
                style={{ borderColor: '#d2d4e1' }}
              />
            </div>
          </div>

          <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
            <button
              onClick={confirmDateTime}
              disabled={!selDate || !selTime}
              className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ backgroundColor: '#FF2947' }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ── Summary step ─────────────────────────────────────────────── */}
      {step === 'summary' && selSvc && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            <div className="bg-[#f7f8fb] rounded-2xl px-4 py-4 flex flex-col gap-3">
              <SummaryRow label="Cliente" value={selClient?.name ?? 'Sin cliente asociado'} muted={!selClient} />
              <SummaryRow label="Servicio" value={selSvc.name} />
              <SummaryRow label="Profesional" value={selProf?.name ?? '—'} />
              <SummaryRow label="Fecha" value={formatFullDate(selDate)} />
              <SummaryRow label="Hora" value={`${selTime} – ${addMinutes(selTime, selSvc.duration)}`} />
              <SummaryRow label="Duración" value={formatDuration(selSvc.duration)} />
              <div className="h-px bg-gray-200" />
              <SummaryRow label="Precio" value={formatCOP(selSvc.price)} bold />
              {selSvc.requiresDeposit && (
                <div className="flex items-start gap-2 bg-[#FFFBEB] rounded-xl px-3 py-2.5">
                  <span className="text-xs text-[#B45309] font-semibold leading-snug">
                    Este servicio requiere pago anticipado. El cliente recibirá instrucciones de pago por WhatsApp.
                  </span>
                </div>
              )}
              {note && <SummaryRow label="Nota" value={note} />}
            </div>
          </div>

          <div className="shrink-0 px-4 pt-3 pb-6 border-t border-gray-100">
            <button
              onClick={createAppointment}
              className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#FF2947' }}
            >
              Crear cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-[#969696] shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-right ${bold ? 'font-bold text-[#121e6c]' : muted ? 'font-normal text-[#b0b5c8] italic' : 'font-medium text-[#1e1e1e]'}`}>{value}</span>
    </div>
  );
}
