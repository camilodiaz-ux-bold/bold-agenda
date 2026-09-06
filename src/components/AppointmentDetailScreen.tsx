import { useState } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import type { Appointment, Professional, Service, Client, SaleRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { DetailPageShell } from './DetailPageShell';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  services: Service[];
  saleRecord?: SaleRecord;
  clients?: Client[];
  onBack: () => void;
  onClosure: () => void;
  onEdit: () => void;
  onAssignClient?: (client: Client) => void;
}

const SECTION_LABEL = 'text-[12px] font-normal text-[#3e4983] leading-4';
const FIELD_LABEL = 'text-[12px] font-bold text-[#121e6c] leading-4';
const FIELD_VALUE = 'text-[14px] text-[#1e1e1e] leading-5';

const PM_LABELS: Record<string, string> = {
  datafono: 'Datáfono',
  qr: 'QR Pago',
  link: 'Link de pago',
  anticipado: 'Pago anticipado',
};

function Divider() {
  return <div className="h-px bg-gray-200 w-full" />;
}

function formatPhone(phone: string): string {
  return `+57 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

function formatFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase());
}

function addMinutes(time: string, minutes: number): string {
  const [h, mn] = time.split(':').map(Number);
  const total = h * 60 + mn + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function AppointmentDetailScreen({
  appointment, professional, service, services, saleRecord, clients = [],
  onBack, onClosure, onEdit, onAssignClient,
}: Props) {
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const endTime = addMinutes(appointment.startTime, service.duration);
  const isCloseable = appointment.status === 'confirmada';
  const isEditable = appointment.status === 'confirmada' || appointment.status === 'reprogramada';
  const hasClient = Boolean(appointment.clientName);

  // A closed appointment may carry more than one performed service (added during
  // cierre del servicio) — use the frozen sale record when it exists, never
  // recompute historical prices/commissions from the current service catalog.
  const lineItems = saleRecord
    ? saleRecord.items.map(it => ({
        name: it.serviceName,
        price: it.price,
        duration: services.find(s => s.id === it.serviceId)?.duration ?? service.duration,
      }))
    : [{ name: service.name, price: service.price, duration: service.duration }];
  const isMulti = lineItems.length > 1;
  const commissionTotal = saleRecord
    ? saleRecord.commission
    : Math.round(service.price * (service.commissionPercent / 100));
  const tip = saleRecord ? saleRecord.tip : (appointment.tip ?? 0);

  const filteredClients = clientSearch.trim()
    ? clients.filter(c => {
        const q = clientSearch.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.cedula.includes(q);
      })
    : clients;

  return (
    <DetailPageShell
      title="Detalle de la cita"
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
      footer={isCloseable ? (
        <button
          onClick={onClosure}
          className="w-full h-12 rounded-full flex items-center justify-center font-bold text-sm text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#FF2947' }}
        >
          Cerrar servicio
        </button>
      ) : undefined}
    >
      <div className="flex flex-col gap-8">

        {/* ── Profesional ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-3 py-4 flex items-center gap-4 w-full">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
            <span className="text-[14px]" style={{ color: '#3E4983' }}>{professional.initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#121e6c] leading-5">{professional.name}</p>
            <p className="text-[12px] leading-4" style={{ color: '#6C759F' }}>{professional.role}</p>
          </div>
        </div>

        {/* ── Cliente ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Cliente</p>
          {showClientSearch ? (
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className={FIELD_LABEL}>Agregar cliente</p>
                <button onClick={() => { setShowClientSearch(false); setClientSearch(''); }}>
                  <X size={16} color="#969696" strokeWidth={2} />
                </button>
              </div>
              <div className="flex items-center gap-2 h-10 rounded-xl border px-3 mb-2" style={{ borderColor: '#d2d4e1', backgroundColor: '#f7f8fb' }}>
                <Search size={15} color="#969696" strokeWidth={2} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Nombre, teléfono o cédula"
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
                />
                {clientSearch && (
                  <button onClick={() => setClientSearch('')}><X size={14} color="#969696" strokeWidth={2} /></button>
                )}
              </div>
              <div className="flex flex-col gap-0">
                {filteredClients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => { onAssignClient?.(client); setShowClientSearch(false); setClientSearch(''); }}
                    className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 active:opacity-70 text-left w-full"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#f0f1f5' }}>
                      <span className="text-[10px] font-bold text-[#121e6c]">
                        {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1e1e1e] truncate">{client.name}</p>
                      <p className="text-xs text-[#969696]">{client.phone}</p>
                    </div>
                  </button>
                ))}
                {filteredClients.length === 0 && clientSearch && (
                  <p className="text-sm text-[#969696] py-3 text-center">Sin resultados</p>
                )}
              </div>
            </div>
          ) : hasClient ? (
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <p className={FIELD_LABEL}>Nombre</p>
                  <button onClick={onBack} className="shrink-0 rounded-full px-2 py-1" style={{ backgroundColor: '#F1F2F6' }}>
                    <span className="text-[12px] font-medium text-[#121e6c]">Ver perfil</span>
                  </button>
                </div>
                <p className={FIELD_VALUE}>{appointment.clientName}</p>
              </div>
              <Divider />
              <div className="flex flex-col gap-2">
                <p className={FIELD_LABEL}>Teléfono</p>
                <p className={FIELD_VALUE}>{appointment.clientPhone ? formatPhone(appointment.clientPhone) : '—'}</p>
              </div>
              <Divider />
              <div className="flex flex-col gap-2">
                <p className={FIELD_LABEL}>Número de identificación</p>
                <p className={FIELD_VALUE}>{appointment.clientCedula ? `CC ${appointment.clientCedula}` : '—'}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <p className="text-[14px] italic" style={{ color: '#b0b5c8' }}>Sin cliente asociado</p>
              {onAssignClient && (
                <button
                  onClick={() => setShowClientSearch(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#121e6c] active:opacity-70"
                >
                  <UserPlus size={14} color="#121e6c" strokeWidth={2} />
                  Agregar cliente
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Servicio ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Servicio</p>
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            {lineItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className={`${FIELD_LABEL} flex-1 min-w-0`}>{item.name}</p>
                    <p className="text-[12px] font-bold shrink-0 tabular-nums" style={{ color: '#121e6c' }}>{formatCOP(item.price)}</p>
                  </div>
                  <p className={FIELD_VALUE}>{formatDuration(item.duration)}</p>
                </div>
                <Divider />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <p className={FIELD_LABEL}>Tipo de pago</p>
                <StatusBadge status={appointment.paymentStatus} size="md" />
              </div>
              {appointment.paymentMethod && (
                <p className={FIELD_VALUE}>{PM_LABELS[appointment.paymentMethod] ?? appointment.paymentMethod}</p>
              )}
            </div>

            {appointment.status !== 'no-show' && (
              <>
                <Divider />
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className={FIELD_LABEL}>
                      {isMulti ? 'Comisión total' : (appointment.status === 'completada' ? 'Tu comisión' : 'Comisión estimada')}
                      {!isMulti && (
                        <span className="ml-1 font-normal" style={{ color: '#b0b5c8' }}>({service.commissionPercent}%)</span>
                      )}
                    </p>
                    <p className="text-[12px] font-bold shrink-0 tabular-nums" style={{ color: '#910022' }}>{formatCOP(commissionTotal)}</p>
                  </div>
                  {tip > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px]" style={{ color: '#606060' }}>Propina (100% tuya)</span>
                      <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#15803D' }}>+ {formatCOP(tip)}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Divider />
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <p className={FIELD_LABEL}>Fecha</p>
                <StatusBadge status={appointment.status} size="md" />
              </div>
              <p className={FIELD_VALUE}>{formatFullDate(appointment.date)}</p>
            </div>

            <Divider />
            <div className="flex flex-col gap-2">
              <p className={FIELD_LABEL}>Hora</p>
              <p className={FIELD_VALUE}>{appointment.startTime} – {endTime}</p>
            </div>
          </div>
        </div>

        {/* ── Editar cita (secundaria) ────────────────────────────── */}
        {isEditable && (
          <button
            onClick={onEdit}
            className="w-full bg-white rounded-2xl px-3 py-3 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <span className="text-[14px] font-bold text-[#121e6c]">Editar cita</span>
          </button>
        )}
      </div>
    </DetailPageShell>
  );
}
