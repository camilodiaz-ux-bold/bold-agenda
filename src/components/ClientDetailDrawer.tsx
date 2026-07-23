import { useState } from 'react';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';
import type { Client, Appointment, Service, Professional, Role } from '../types';
import { formatCOP } from '../data/appointments';

interface Props {
  client: Client;
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  role: Role;
  onSave: (updated: Client) => void;
  onOpenEdit: (apt: Appointment) => void;
  onClose: () => void;
}

function appointmentLabel(apt: Appointment, services: Service[]): string {
  const svc = services.find(s => s.id === apt.serviceId);
  return svc?.name ?? 'Servicio';
}

function statusColor(status: string): string {
  if (status === 'completada') return '#15803D';
  if (status === 'cancelada' || status === 'cancelada-tarde' || status === 'no-show') return '#B45309';
  return '#121e6c';
}

function statusLabel(status: string): string {
  const m: Record<string, string> = {
    confirmada: 'Confirmada',
    completada: 'Completada',
    reprogramada: 'Reprogramada',
    cancelada: 'Cancelada',
    'cancelada-tarde': 'Canc. tardía',
    'no-show': 'No llegó',
  };
  return m[status] ?? status;
}

export function ClientDetailDrawer({
  client, appointments, services, professionals, role, onSave, onOpenEdit, onClose,
}: Props) {
  const [notes, setNotes] = useState(client.notes ?? '');
  const [saved, setSaved] = useState(false);

  const clientApts = appointments
    .filter(a => a.clientPhone === client.phone || a.clientCedula === client.cedula)
    .sort((a, b) => b.date.localeCompare(a.date));

  const preferredProf = professionals.find(p => p.id === client.preferredProfessionalId);

  function handleSaveNotes() {
    onSave({ ...client, notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Client header */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#121e6c' }}>
            <span className="text-base font-bold text-white">{client.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#1e1e1e]">{client.name}</p>
            <p className="text-xs text-[#969696] mt-0.5">{client.phone} · CC {client.cedula}</p>
            {client.email && <p className="text-xs text-[#969696]">{client.email}</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mt-4">
          <StatCard label="Visitas" value={String(client.visitCount)} />
          <StatCard label="Total" value={formatCOP(client.totalSpent)} />
          <StatCard label="Última" value={client.lastVisit ? client.lastVisit.slice(5).replace('-', '/') : '—'} />
        </div>

        {preferredProf && (
          <p className="text-xs text-[#969696] mt-2.5">
            Prefiere: <span className="font-semibold text-[#121e6c]">{preferredProf.name}</span>
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-5 pb-8">
        {/* Notes */}
        <div>
          <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Notas internas</p>
          {role === 'admin' ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Alergias, preferencias, notas del estilista…"
                rows={3}
                className="w-full rounded-xl border px-3 py-2.5 text-sm text-[#1e1e1e] resize-none outline-none leading-relaxed"
                style={{ borderColor: '#d2d4e1', backgroundColor: '#fff' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#121e6c'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#d2d4e1'; }}
              />
              <button
                onClick={handleSaveNotes}
                className="self-end flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-semibold text-white transition-all active:opacity-70"
                style={{ backgroundColor: saved ? '#15803D' : '#121e6c' }}
              >
                {saved ? <CheckCircle2 size={12} color="#fff" strokeWidth={2.5} /> : null}
                {saved ? 'Guardado' : 'Guardar nota'}
              </button>
            </div>
          ) : (
            <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5">
              <p className="text-sm text-[#606060] leading-relaxed">{notes || <span className="text-[#969696] italic">Sin notas</span>}</p>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">
            Historial de citas ({clientApts.length})
          </p>
          {clientApts.length === 0 ? (
            <p className="text-sm text-[#969696] py-2">Sin citas registradas</p>
          ) : (
            <div className="flex flex-col gap-2">
              {clientApts.map(apt => {
                const svc = services.find(s => s.id === apt.serviceId);
                const prof = professionals.find(p => p.id === apt.professionalId);
                const isActive = ['confirmada', 'reprogramada'].includes(apt.status);
                return (
                  <div key={apt.id} className="bg-white rounded-xl px-3 py-3 border border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {apt.status === 'completada'
                            ? <CheckCircle2 size={12} color="#15803D" strokeWidth={2.5} />
                            : apt.paymentStatus === 'pagado-anticipado'
                              ? <CreditCard size={12} color="#0D9488" strokeWidth={2.5} />
                              : <Clock size={12} color="#969696" strokeWidth={2.5} />
                          }
                          <p className="text-xs font-bold text-[#1e1e1e]">{appointmentLabel(apt, services)}</p>
                        </div>
                        <p className="text-[11px] text-[#969696] mt-0.5">{apt.date} · {apt.startTime} · {prof?.name.split(' ')[0]}</p>
                        {svc && (
                          <p className="text-xs font-semibold text-[#121e6c] tabular-nums mt-1">
                            {formatCOP(apt.originalPrice ?? svc.price)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                          color: statusColor(apt.status),
                          backgroundColor: apt.status === 'completada' ? '#F0FDF4' : apt.status === 'confirmada' ? '#EFF6FF' : '#F7F8FB',
                        }}>
                          {statusLabel(apt.status)}
                        </span>
                        {isActive && (
                          <button
                            onClick={() => { onClose(); setTimeout(() => onOpenEdit(apt), 320); }}
                            className="text-[10px] font-semibold text-[#FF2947] active:opacity-70"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 bg-[#f7f8fb] rounded-xl px-2 py-2 flex flex-col items-center gap-0.5">
      <span className="text-sm font-bold text-[#121e6c] leading-none tabular-nums">{value}</span>
      <span className="text-[10px] text-[#969696] leading-none">{label}</span>
    </div>
  );
}
