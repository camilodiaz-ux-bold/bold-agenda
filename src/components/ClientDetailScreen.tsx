import { useState } from 'react';
import { X, Calendar, Receipt, CreditCard, Smartphone, Link2, CheckCircle2 } from 'lucide-react';
import type { Client, Appointment, Professional, Service, SaleRecord, Role } from '../types';
import { StatusBadge } from './StatusBadge';
import { DetailPageShell } from './DetailPageShell';
import { formatCOP } from '../data/appointments';

interface Props {
  client: Client;
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  saleRecords?: SaleRecord[];
  role: Role;
  onBack: () => void;
  onSave: (updated: Client) => void;
  onOpenEdit: (apt: Appointment) => void;
}

const SECTION_LABEL = 'text-[12px] font-normal text-[#3e4983] leading-4';
const FIELD_LABEL = 'text-[12px] font-bold text-[#121e6c] leading-4';

const PM_ICONS: Record<string, typeof CreditCard> = {
  datafono: CreditCard,
  qr: Smartphone,
  link: Link2,
  anticipado: CreditCard,
};

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR Pago',
  link: 'Link de pago',
  anticipado: 'Pago anticipado',
};

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '');
}

export function ClientDetailScreen({
  client, appointments, services, professionals, saleRecords = [], role,
  onBack, onSave, onOpenEdit,
}: Props) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(client.notes ?? '');
  const [saved, setSaved] = useState(false);

  const clientApts = appointments
    .filter(a => a.clientPhone === client.phone || a.clientCedula === client.cedula)
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleSaveNotes() {
    onSave({ ...client, notes });
    setEditingNotes(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <DetailPageShell
      title="Cliente"
      onBack={onBack}
      rightAction={
        <button
          onClick={onBack}
          aria-label="Cerrar"
          className="w-10 h-10 -mr-2 flex items-center justify-center shrink-0 transition-opacity active:opacity-60"
        >
          <X size={22} color="#121e6c" strokeWidth={2} />
        </button>
      }
    >
      <div className="flex flex-col gap-8">

        {/* ── Identidad del cliente ───────────────────────────────── */}
        <div className="bg-white rounded-2xl px-3 py-4 flex items-center gap-4 w-full">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
            <span className="text-[14px]" style={{ color: '#3E4983' }}>
              {client.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#121e6c] leading-5">{client.name}</p>
            <p className="text-[12px] leading-4" style={{ color: '#6C759F' }}>CC {client.cedula}</p>
          </div>
        </div>

        {/* ── Métricas ────────────────────────────────────────────── */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col gap-5">
            <Calendar size={24} color="#121e6c" strokeWidth={1.8} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px]" style={{ color: '#606060' }}>Visitas</span>
              <span className="text-[20px] font-medium text-[#1e1e1e] leading-6">{client.visitCount}</span>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col gap-5">
            <Receipt size={24} color="#121e6c" strokeWidth={1.8} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px]" style={{ color: '#606060' }}>Total</span>
              <span className="text-[20px] font-medium text-[#1e1e1e] leading-6 tabular-nums">{formatCOP(client.totalSpent)}</span>
            </div>
          </div>
        </div>

        {/* ── Notas internas ──────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Cliente</p>
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <p className={FIELD_LABEL}>Notas internas</p>
              {role === 'admin' && !editingNotes && (
                saved ? (
                  <span className="shrink-0 flex items-center gap-1 text-[12px] font-medium" style={{ color: '#15803D' }}>
                    <CheckCircle2 size={12} color="#15803D" strokeWidth={2.5} /> Guardado
                  </span>
                ) : (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="shrink-0 rounded-full px-2 py-1"
                    style={{ backgroundColor: '#F1F2F6' }}
                  >
                    <span className="text-[12px] font-medium text-[#121e6c]">Editar</span>
                  </button>
                )
              )}
            </div>
            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  autoFocus
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
                  style={{ backgroundColor: '#121e6c' }}
                >
                  Guardar nota
                </button>
              </div>
            ) : (
              <p className="text-[14px] text-[#1e1e1e] leading-5">
                {notes || <span className="italic" style={{ color: '#b0b5c8' }}>Sin notas</span>}
              </p>
            )}
          </div>
        </div>

        {/* ── Historial ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Servicio</p>
          {clientApts.length === 0 ? (
            <div className="bg-white rounded-2xl p-4">
              <p className="text-[14px] italic" style={{ color: '#b0b5c8' }}>Sin citas registradas</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clientApts.map(apt => {
                const sale = apt.status === 'completada' ? saleRecords.find(sr => sr.appointmentId === apt.id) : undefined;
                const svc = services.find(s => s.id === apt.serviceId);
                const name = sale ? sale.items.map(i => i.serviceName).join(', ') : (svc?.name ?? 'Servicio');
                const price = sale ? sale.total : (apt.originalPrice ?? svc?.price ?? 0);
                const prof = professionals.find(p => p.id === apt.professionalId);
                const isEditable = apt.status === 'confirmada' || apt.status === 'reprogramada';
                const PMIcon = (apt.paymentMethod && PM_ICONS[apt.paymentMethod]) || Calendar;
                return (
                  <div key={apt.id} className="bg-white rounded-2xl p-3 flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
                      <PMIcon size={24} color="#121e6c" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[14px] font-medium text-[#1e1e1e] truncate">{name}</p>
                        <p className="text-[14px] font-medium text-[#1e1e1e] shrink-0 tabular-nums">{formatCOP(price)}</p>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <StatusBadge status={apt.status} subtle />
                        {apt.paymentMethod && (
                          <span className="text-[12px] shrink-0" style={{ color: '#606060' }}>
                            {PM_LABELS[apt.paymentMethod] ?? apt.paymentMethod}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px]" style={{ color: '#606060' }}>
                        {prof?.name.split(' ')[0] ?? '—'} ({formatShortDate(apt.date)} · {apt.startTime})
                      </p>
                      {isEditable && (
                        <button
                          onClick={() => onOpenEdit(apt)}
                          className="text-[12px] font-semibold underline self-start active:opacity-70"
                          style={{ color: '#121e6c' }}
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DetailPageShell>
  );
}
