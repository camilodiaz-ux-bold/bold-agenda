import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2, UserX, CalendarClock, CreditCard, Smartphone, Link2, Check, UserPlus,
  Plus, X, Search, ChevronLeft, ChevronRight, Loader2, Clock, AlertTriangle, RefreshCw,
} from 'lucide-react';
import type { Appointment, Professional, Service, PaymentMethod, SaleLineItem, Client } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';
import {
  calcTip, calcTotals, canRemoveLine, makeLineItem, totalCommission,
  type ClosureResult, type TipPreset,
} from '../lib/closure';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  services: Service[];
  clients: Client[];
  defaultTipPercent?: number;
  onClose: () => void;
  onComplete: (result: ClosureResult) => void;
  onPaymentPending: (appointmentId: string, method: PaymentMethod) => void;
  onBusyChange?: (busy: boolean) => void;
  onReschedule: () => void;
}

type Step = 'outcome' | 'items' | 'payment' | 'noshow-confirm' | 'done';
type Outcome = 'completada' | 'no-show';
type PayState = 'idle' | 'processing' | 'pending' | 'declined' | 'register-failed';
type MockResult = 'confirmado' | 'pendiente' | 'no-pagado' | 'falla-registro';
type MethodsState = 'ok' | 'loading' | 'error';
type DraftClient = { client: Client; isNew: boolean };

// Mock de los medios de Bold POS.
const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
  { method: 'datafono', label: 'Datáfono', Icon: CreditCard },
  { method: 'qr', label: 'QR Pago', Icon: Smartphone },
  { method: 'link', label: 'Link de pago', Icon: Link2 },
];

const PROCESSING_MS = 1800;

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

// ── Selector / creación de cliente (reutiliza los campos del alta existente) ──
function ClientPicker({ clients, onSelect, onCancel }: {
  clients: Client[];
  onSelect: (c: Client, isNew: boolean) => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', cedula: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const q = query.trim().toLowerCase();
  const filtered = q
    ? clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.cedula.includes(q))
    : clients;

  function create() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';
    if (!form.cedula.trim()) e.cedula = 'Requerido';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSelect({
      id: `c_${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      cedula: form.cedula.trim(),
      email: form.email.trim() || undefined,
      totalSpent: 0,
      visitCount: 0,
    }, true);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#121e6c]">{creating ? 'Nuevo cliente' : 'Agregar cliente'}</p>
          <button onClick={creating ? () => setCreating(false) : onCancel} className="text-xs font-semibold text-[#969696] active:opacity-60">
            {creating ? 'Volver a la búsqueda' : 'Cancelar'}
          </button>
        </div>

        {creating ? (
          <>
            {([
              { key: 'name', label: 'Nombre completo', type: 'text' },
              { key: 'phone', label: 'Teléfono', type: 'tel' },
              { key: 'cedula', label: 'Cédula', type: 'text' },
              { key: 'email', label: 'Email (opcional)', type: 'email' },
            ] as const).map(({ key, label, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#606060]">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="h-10 rounded-xl border px-3 text-sm text-[#1e1e1e] outline-none"
                  style={{ borderColor: errors[key] ? '#BE123C' : '#d2d4e1' }}
                />
                {errors[key] && <span className="text-xs text-[#BE123C]">{errors[key]}</span>}
              </div>
            ))}
            <button
              onClick={create}
              className="w-full h-12 rounded-full font-bold text-sm text-white mt-1 transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#FF2947' }}
            >
              Guardar y asociar
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 h-10 rounded-xl border px-3" style={{ borderColor: '#d2d4e1', backgroundColor: '#f7f8fb' }}>
              <Search size={15} color="#969696" strokeWidth={2} />
              <input
                autoFocus
                type="text"
                placeholder="Buscar por nombre, teléfono o cédula"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
              />
              {query && (
                <button onClick={() => setQuery('')}><X size={14} color="#969696" strokeWidth={2} /></button>
              )}
            </div>
            <div className="flex flex-col">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c, false)}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 active:opacity-70 text-left w-full"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
                    <span className="text-[14px]" style={{ color: '#3E4983' }}>{initials(c.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1e1e1e] truncate">{c.name}</p>
                    <p className="text-xs text-[#969696]">{c.phone}</p>
                  </div>
                  <ChevronRight size={14} color="#b0b5c8" strokeWidth={2} />
                </button>
              ))}
              {filtered.length === 0 && query && (
                <p className="text-sm text-[#969696] py-4 text-center">Sin resultados para "{query}"</p>
              )}
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-[#121e6c] active:opacity-70"
            >
              <UserPlus size={16} color="#121e6c" strokeWidth={2} />
              Crear nuevo cliente
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ServiceClosureDrawer({
  appointment, professional, service, services, clients, defaultTipPercent = 0,
  onClose, onComplete, onPaymentPending, onBusyChange, onReschedule,
}: Props) {
  const [step, setStep] = useState<Step>('outcome');
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const isPrepaid = appointment.paymentStatus === 'pagado-anticipado';
  const [items, setItems] = useState<SaleLineItem[]>([
    makeLineItem(service, appointment.originalPrice ?? service.price, 'agendado', isPrepaid),
  ]);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [serviceQuery, setServiceQuery] = useState('');

  const [pickingClient, setPickingClient] = useState(false);
  const [draftClient, setDraftClient] = useState<DraftClient | null>(null);

  const [tipPreset, setTipPreset] = useState<TipPreset>(() =>
    defaultTipPercent === 5 || defaultTipPercent === 10 ? defaultTipPercent : defaultTipPercent > 0 ? 'custom' : 0);
  const [customTip, setCustomTip] = useState(() =>
    defaultTipPercent > 0 && defaultTipPercent !== 5 && defaultTipPercent !== 10
      ? String(Math.round(((appointment.originalPrice ?? service.price) * defaultTipPercent) / 100))
      : '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const [payState, setPayState] = useState<PayState>('idle');
  const [mock, setMock] = useState<MockResult>('confirmado');
  const [methodsState, setMethodsState] = useState<MethodsState>('ok');
  const [retryingRegister, setRetryingRegister] = useState(false);

  const submittingRef = useRef(false);
  const closureRef = useRef(`cl-${Date.now().toString(36)}`);
  const paymentRefRef = useRef<string | null>(null);
  const registerFailedOnceRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  const busy = payState === 'processing' || payState === 'register-failed';
  useEffect(() => {
    onBusyChange?.(busy);
    return () => onBusyChange?.(false);
  }, [busy, onBusyChange]);

  function later(ms: number, fn: () => void) {
    timersRef.current.push(setTimeout(fn, ms));
  }

  const clientName = draftClient?.client.name ?? appointment.clientName;
  const hasClient = Boolean(clientName);

  const { subtotal, prepaid: prepagoAplicado, balance: saldoPendiente } = calcTotals(items);
  const { amount: rawTip, error: tipError } = calcTip(subtotal, tipPreset, customTip);
  const tipAmount = saldoPendiente > 0 && !tipError ? rawTip : 0;
  const chargeNow = saldoPendiente + tipAmount;
  const commissionTotal = totalCommission(items);
  const methodLabel = PAYMENT_OPTIONS.find(o => o.method === paymentMethod)?.label ?? '';

  const availableServices = services
    .filter(s => s.active !== false)
    .filter(s => !serviceQuery.trim() || s.name.toLowerCase().includes(serviceQuery.trim().toLowerCase()));

  function addServiceItem(svc: Service) {
    setItems(prev => [...prev, makeLineItem(svc, svc.price, 'agregado')]);
    setShowServicePicker(false);
    setServiceQuery('');
  }

  function removeItem(idx: number) {
    setItems(prev => canRemoveLine(prev, idx) ? prev.filter((_, i) => i !== idx) : prev);
  }

  function handleOutcomeSelect(o: Outcome | 'reprogramar') {
    if (o === 'reprogramar') { onReschedule(); return; }
    setOutcome(o);
    setStep(o === 'no-show' ? 'noshow-confirm' : 'items');
  }

  function buildCompletedResult(): ClosureResult {
    return {
      closureRef: closureRef.current,
      appointmentId: appointment.id,
      outcome: 'completada',
      items,
      subtotal,
      prepaid: prepagoAplicado,
      tip: tipAmount,
      charged: chargeNow,
      paymentMethod: chargeNow > 0 ? paymentMethod ?? undefined : undefined,
      paymentRef: paymentRefRef.current ?? undefined,
      client: draftClient ?? undefined,
    };
  }

  function finishCompleted() {
    onComplete(buildCompletedResult());
    setPayState('idle');
    setStep('done');
  }

  // Saldo $0: no hay cobro, solo se registra el cierre.
  function handleFinalize() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    finishCompleted();
  }

  function attemptRegister() {
    if (mock === 'falla-registro' && !registerFailedOnceRef.current) {
      registerFailedOnceRef.current = true;
      submittingRef.current = false;
      setRetryingRegister(false);
      setPayState('register-failed');
      return;
    }
    finishCompleted();
  }

  function handleCharge() {
    if (submittingRef.current || !paymentMethod || tipError || methodsState !== 'ok' || chargeNow <= 0) return;
    submittingRef.current = true;
    setPayState('processing');
    later(PROCESSING_MS, () => {
      if (mock === 'pendiente') {
        onPaymentPending(appointment.id, paymentMethod);
        submittingRef.current = false;
        setPayState('pending');
      } else if (mock === 'no-pagado') {
        submittingRef.current = false;
        setPayState('declined');
      } else {
        paymentRefRef.current = paymentRefRef.current ?? `pay-${closureRef.current}`;
        attemptRegister();
      }
    });
  }

  // Reintento de registro: el pago ya está confirmado, no se vuelve a cobrar.
  function handleRetryRegister() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setRetryingRegister(true);
    later(700, attemptRegister);
  }

  function handleConfirmNoShow() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    const prepaidLines = items.filter(i => i.prepaid);
    const retained = prepaidLines.reduce((s, i) => s + i.price, 0);
    onComplete({
      closureRef: closureRef.current,
      appointmentId: appointment.id,
      outcome: 'no-show',
      items: prepaidLines,
      subtotal: retained,
      prepaid: retained,
      tip: 0,
      charged: 0,
    });
    setStep('done');
  }

  function reloadMethods() {
    setMethodsState('loading');
    later(700, () => setMethodsState('ok'));
  }

  function simulateMethodsDown() {
    setPaymentMethod(null);
    setMethodsState('error');
  }

  // ── Selector de cliente (el draft del cierre permanece intacto) ────────
  if (pickingClient) {
    return (
      <ClientPicker
        clients={clients}
        onCancel={() => setPickingClient(false)}
        onSelect={(client, isNew) => { setDraftClient({ client, isNew }); setPickingClient(false); }}
      />
    );
  }

  const clientRow = (
    <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
      {hasClient ? (
        <>
          <p className="text-sm font-bold text-[#1e1e1e] truncate">{clientName}</p>
          {draftClient && (
            <button
              onClick={() => setDraftClient(null)}
              aria-label="Quitar cliente"
              className="text-xs font-semibold text-[#969696] shrink-0 active:opacity-60"
            >
              Quitar
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-sm italic text-[#b0b5c8]">Sin cliente asociado</p>
          <button
            onClick={() => setPickingClient(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#121e6c] shrink-0 active:opacity-70"
          >
            <UserPlus size={14} color="#121e6c" strokeWidth={2} />
            Agregar cliente
          </button>
        </>
      )}
    </div>
  );

  // ── Paso 1: ¿Cómo terminó la cita? ─────────────────────────────────────
  if (step === 'outcome') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold ${appointment.clientName ? 'text-[#1e1e1e]' : 'text-[#b0b5c8] italic'}`}>
                {appointment.clientName ?? 'Sin cliente asociado'}
              </p>
              <p className="text-xs text-[#969696] mt-0.5">{service.name} · {formatDuration(service.duration)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(appointment.originalPrice ?? service.price)}</p>
              <p className="text-[11px] text-[#969696] mt-0.5">{professional.name.split(' ')[0]}</p>
            </div>
          </div>

          <p className="text-sm font-bold text-[#121e6c]">¿Cómo terminó la cita?</p>

          <button
            onClick={() => handleOutcomeSelect('completada')}
            className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-left transition-all active:border-[#FF2947] active:bg-[#FFF1F2]"
          >
            <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} color="#15803D" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1e1e1e]">Completada</p>
              <p className="text-xs text-[#969696] mt-0.5">El servicio se realizó correctamente</p>
            </div>
          </button>

          <button
            onClick={() => handleOutcomeSelect('no-show')}
            className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-left transition-all active:border-[#BE123C] active:bg-[#FFF1F2]"
          >
            <div className="w-9 h-9 rounded-full bg-[#FFF1F2] flex items-center justify-center shrink-0">
              <UserX size={18} color="#BE123C" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1e1e1e]">El cliente no llegó</p>
              <p className="text-xs text-[#969696] mt-0.5">Se registrará como no-show</p>
            </div>
          </button>

          <button
            onClick={() => handleOutcomeSelect('reprogramar')}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#969696] py-1.5 transition-opacity active:opacity-60"
          >
            <CalendarClock size={15} color="#969696" strokeWidth={2} />
            ¿La cita se movió? Reprogramar
          </button>
        </div>
      </div>
    );
  }

  // ── No-show: confirmación ───────────────────────────────────────────────
  if (step === 'noshow-confirm') {
    const retained = items.filter(i => i.prepaid).reduce((s, i) => s + i.price, 0);
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-6 flex flex-col gap-3">
          <div className="rounded-2xl px-4 py-3 bg-[#f7f8fb]">
            <p className="text-sm font-bold text-[#1e1e1e] mb-1">
              {appointment.clientName ? `${appointment.clientName} no se presentó` : 'El cliente no se presentó'}
            </p>
            <p className="text-xs text-[#969696] leading-relaxed">
              {retained > 0
                ? `El prepago de ${formatCOP(retained)} queda retenido según la política de cancelación.`
                : 'No se generará ningún cobro.'}
            </p>
          </div>

          <button
            onClick={handleConfirmNoShow}
            className="w-full h-12 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#BE123C' }}
          >
            <UserX size={17} color="white" strokeWidth={2} />
            Confirmar no-show
          </button>

          <button
            onClick={() => setStep('outcome')}
            className="w-full h-12 rounded-full font-semibold text-sm text-[#121e6c] border border-[#d2d4e1] bg-white flex items-center justify-center transition-all active:scale-[0.98]"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Paso 2: Servicios realizados ───────────────────────────────────────
  if (step === 'items') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-6 flex flex-col gap-3">
          <button
            onClick={() => setStep('outcome')}
            className="self-start flex items-center gap-1 text-xs font-semibold text-[#969696] -ml-1 active:opacity-60"
          >
            <ChevronLeft size={14} color="#969696" strokeWidth={2.4} />
            ¿Cómo terminó la cita?
          </button>

          {clientRow}

          <p className="text-sm font-bold text-[#121e6c]">Servicios realizados</p>

          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border-2 border-gray-100 rounded-2xl px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1e1e1e] truncate">{item.serviceName}</p>
                  <p className="text-xs text-[#969696] mt-0.5">
                    {item.origin === 'agendado' ? 'Agendado' : 'Agregado en la sesión'}
                    {item.prepaid ? ' · Prepagado' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(item.price)}</span>
                  {canRemoveLine(items, idx) && (
                    <button
                      onClick={() => removeItem(idx)}
                      aria-label={`Quitar ${item.serviceName}`}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity active:opacity-60"
                      style={{ backgroundColor: '#FFF1F2' }}
                    >
                      <X size={13} color="#BE123C" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!showServicePicker ? (
            <button
              onClick={() => setShowServicePicker(true)}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[#121e6c] py-1.5 transition-opacity active:opacity-60"
            >
              <Plus size={15} color="#121e6c" strokeWidth={2.5} />
              Agregar servicio
            </button>
          ) : (
            <div className="flex flex-col gap-2 bg-[#f7f8fb] rounded-2xl p-2">
              <div className="flex items-center gap-2 h-9 rounded-xl border px-3 bg-white" style={{ borderColor: '#d2d4e1' }}>
                <Search size={14} color="#969696" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Buscar servicio"
                  value={serviceQuery}
                  onChange={e => setServiceQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
                />
              </div>
              {availableServices.length === 0 ? (
                <p className="text-xs text-[#969696] text-center py-2">No hay servicios para agregar</p>
              ) : (
                availableServices.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => addServiceItem(svc)}
                    className="w-full flex items-center justify-between bg-white rounded-xl px-3 py-2.5 text-left transition-all active:opacity-70"
                  >
                    <span className="text-sm font-semibold text-[#1e1e1e]">{svc.name}</span>
                    <span className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(svc.price)}</span>
                  </button>
                ))
              )}
              <button
                onClick={() => { setShowServicePicker(false); setServiceQuery(''); }}
                className="w-full h-9 rounded-full text-xs font-semibold text-[#606060] border transition-opacity active:opacity-70"
                style={{ borderColor: '#d2d4e1' }}
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="bg-[#f7f8fb] rounded-xl px-4 py-3 flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#606060]">Total</span>
              <span className="text-sm font-semibold text-[#1e1e1e] tabular-nums">{formatCOP(subtotal)}</span>
            </div>
            {prepagoAplicado > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#606060]">Prepagado</span>
                <span className="text-sm font-semibold text-[#15803D] tabular-nums">-{formatCOP(prepagoAplicado)}</span>
              </div>
            )}
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#121e6c]">Saldo por cobrar</span>
              <span className="text-base font-bold text-[#121e6c] tabular-nums">{formatCOP(saldoPendiente)}</span>
            </div>
          </div>

          <button
            onClick={() => saldoPendiente > 0 ? setStep('payment') : handleFinalize()}
            className="w-full rounded-full font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#FF2947', height: '52px' }}
          >
            <CheckCircle2 size={19} color="white" strokeWidth={2.5} />
            {saldoPendiente > 0 ? 'Continuar al cobro' : 'Finalizar servicio'}
          </button>
        </div>
      </div>
    );
  }

  // ── Paso 3: Cobro ──────────────────────────────────────────────────────
  if (step === 'payment') {
    if (payState === 'processing') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 pb-10 text-center">
          <Loader2 size={40} color="#121e6c" strokeWidth={2} className="animate-spin" />
          <div>
            <p className="text-base font-bold text-[#121e6c]">Procesando pago</p>
            <p className="text-sm text-[#969696] mt-1">
              Cobrando {formatCOP(chargeNow)} con {methodLabel}.
            </p>
            <p className="text-xs text-[#b0b5c8] mt-3">No cierres esta pantalla.</p>
          </div>
        </div>
      );
    }

    if (payState === 'pending') {
      return (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF8EB' }}>
              <Clock size={24} color="#B45309" strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-bold text-[#1e1e1e]">Pago pendiente</p>
              <p className="text-sm text-[#969696] mt-1 leading-relaxed">El pago todavía está siendo confirmado.</p>
              <p className="text-xs text-[#b0b5c8] mt-2 leading-relaxed">
                La cita sigue abierta y quedó marcada como Pendiente. El servicio se cerrará cuando el pago se confirme.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#FF2947' }}
            >
              Volver a la cita
            </button>
          </div>
        </div>
      );
    }

    if (payState === 'register-failed') {
      return (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF8EB' }}>
              <AlertTriangle size={24} color="#B45309" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1e1e1e] leading-relaxed">
                El pago fue confirmado, pero no pudimos terminar de registrar el servicio.
              </p>
              <p className="text-xs text-[#969696] mt-2 leading-relaxed">
                Reintentar el registro no vuelve a cobrar. Referencia de pago: {paymentRefRef.current}
              </p>
            </div>
            <button
              onClick={handleRetryRegister}
              disabled={retryingRegister}
              className="w-full h-12 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: '#FF2947' }}
            >
              {retryingRegister
                ? <><Loader2 size={16} color="white" className="animate-spin" /> Registrando…</>
                : <><RefreshCw size={16} color="white" strokeWidth={2.5} /> Reintentar registro</>}
            </button>
          </div>
        </div>
      );
    }

    const canCharge = Boolean(paymentMethod) && !tipError && methodsState === 'ok';
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-6 flex flex-col gap-4">
          <button
            onClick={() => setStep('items')}
            className="self-start flex items-center gap-1 text-xs font-semibold text-[#969696] -ml-1 active:opacity-60"
          >
            <ChevronLeft size={14} color="#969696" strokeWidth={2.4} />
            Servicios realizados
          </button>

          {clientRow}

          {payState === 'declined' && (
            <div className="rounded-xl bg-[#FFF1F2] border border-[#fecdd3] px-3 py-2 flex items-start gap-2">
              <AlertTriangle size={14} color="#BE123C" strokeWidth={2} className="mt-0.5 shrink-0" />
              <p className="text-xs text-[#BE123C]">
                No se pudo procesar el pago. Reintenta con el mismo método o elige otro.
              </p>
            </div>
          )}

          <div className="bg-[#f7f8fb] rounded-xl px-4 py-3 flex flex-col gap-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-[#606060]">{item.serviceName}</span>
                <span className="text-sm font-semibold text-[#1e1e1e] tabular-nums">{formatCOP(item.price)}</span>
              </div>
            ))}
            {prepagoAplicado > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#606060]">Prepagado</span>
                <span className="text-sm font-semibold text-[#15803D] tabular-nums">-{formatCOP(prepagoAplicado)}</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#606060]">Propina</span>
                <span className="text-sm font-semibold text-[#15803D] tabular-nums">+{formatCOP(tipAmount)}</span>
              </div>
            )}
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#121e6c]">Saldo por cobrar</span>
              <span className="text-base font-bold text-[#121e6c] tabular-nums">{formatCOP(chargeNow)}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Propina</p>
            <div className="flex gap-2">
              {([0, 5, 10, 'custom'] as TipPreset[]).map(preset => {
                const isActive = tipPreset === preset;
                return (
                  <button
                    key={String(preset)}
                    onClick={() => setTipPreset(preset)}
                    className="flex-1 h-9 rounded-full text-xs font-semibold border transition-all active:opacity-70"
                    style={{
                      backgroundColor: isActive ? '#121e6c' : '#fff',
                      color: isActive ? '#fff' : '#606060',
                      borderColor: isActive ? '#121e6c' : '#d2d4e1',
                    }}
                  >
                    {preset === 0 ? 'Sin propina' : preset === 'custom' ? 'Otra' : `${preset}%`}
                  </button>
                );
              })}
            </div>
            {tipPreset === 'custom' && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ingresa el monto"
                  value={customTip}
                  onChange={e => setCustomTip(e.target.value)}
                  className="mt-2 w-full h-10 rounded-xl bg-[#f7f8fb] border px-3 text-sm text-[#1e1e1e] outline-none focus:border-[#121e6c]"
                  style={{ borderColor: tipError ? '#BE123C' : '#d2d4e1' }}
                />
                {tipError && <p className="text-xs text-[#BE123C] mt-1">{tipError}</p>}
              </>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Método de pago</p>
            {methodsState === 'loading' && (
              <div className="flex items-center justify-center gap-2 py-6">
                <Loader2 size={18} color="#121e6c" className="animate-spin" />
                <span className="text-sm text-[#969696]">Cargando medios de pago…</span>
              </div>
            )}
            {methodsState === 'error' && (
              <div className="rounded-2xl border-2 border-gray-100 px-4 py-4 flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-semibold text-[#1e1e1e]">No pudimos cargar los medios de pago</p>
                <button
                  onClick={reloadMethods}
                  className="flex items-center gap-1.5 text-sm font-bold text-[#121e6c] active:opacity-60"
                >
                  <RefreshCw size={14} color="#121e6c" strokeWidth={2.5} />
                  Reintentar
                </button>
              </div>
            )}
            {methodsState === 'ok' && (
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map(({ method, label, Icon }) => {
                  const isActive = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className="w-full flex items-center gap-3 border-2 rounded-2xl px-4 py-3 text-left transition-all active:opacity-70"
                      style={{
                        borderColor: isActive ? '#121e6c' : '#e5e7eb',
                        backgroundColor: isActive ? '#f7f8fb' : '#fff',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: isActive ? '#121e6c' : '#f3f3f3' }}
                      >
                        <Icon size={16} color={isActive ? '#fff' : '#606060'} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>
                        {label}
                      </span>
                      {isActive && <Check size={15} color="#121e6c" strokeWidth={2.5} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleCharge}
            disabled={!canCharge}
            className="w-full rounded-full font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: '#FF2947', height: '52px' }}
          >
            <CheckCircle2 size={19} color="white" strokeWidth={2.5} />
            {payState === 'declined' ? `Reintentar ${formatCOP(chargeNow)}` : `Cobrar ${formatCOP(chargeNow)}`}
          </button>

          {/* Controles solo de prototipo: simulan la respuesta de Bold POS */}
          <div className="rounded-2xl border border-dashed border-[#d2d4e1] px-3 py-3 flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-[#b0b5c8] uppercase tracking-widest">Prototipo · simular respuesta</p>
            <div className="flex flex-wrap gap-1.5">
              {([
                ['confirmado', 'Confirmado'],
                ['pendiente', 'Pendiente'],
                ['no-pagado', 'No pagado'],
                ['falla-registro', 'Confirmado + falla registro'],
              ] as [MockResult, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMock(key)}
                  className="h-7 px-3 rounded-full text-[11px] font-semibold border transition-all active:opacity-70"
                  style={{
                    backgroundColor: mock === key ? '#121e6c' : '#fff',
                    color: mock === key ? '#fff' : '#606060',
                    borderColor: mock === key ? '#121e6c' : '#d2d4e1',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={simulateMethodsDown}
              className="self-start text-[11px] font-semibold text-[#606060] underline active:opacity-60"
            >
              Simular medios de pago no disponibles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Éxito ──────────────────────────────────────────────────────────────
  if (step === 'done') {
    const isNoShow = outcome === 'no-show';
    const retained = items.filter(i => i.prepaid).reduce((s, i) => s + i.price, 0);
    const retainedCommission = totalCommission(items.filter(i => i.prepaid));
    const who = isNoShow ? appointment.clientName : clientName;
    const check = (text: string) => (
      <div className="flex items-center gap-2">
        <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
        <span className="text-xs text-[#606060]">{text}</span>
      </div>
    );
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isNoShow ? '#FFF1F2' : '#F0FDF4' }}
          >
            {isNoShow
              ? <UserX size={24} color="#BE123C" strokeWidth={2} />
              : <CheckCircle2 size={24} color="#15803D" strokeWidth={2} />}
          </div>

          <div>
            <p className="text-base font-bold text-[#1e1e1e]">
              {isNoShow ? 'No-show registrado' : 'Servicio cerrado'}
            </p>
            <p className="text-sm text-[#969696] mt-1 leading-relaxed">
              {isNoShow
                ? (who ? `${who} no se presentó a su cita.` : 'El cliente no se presentó a su cita.')
                : chargeNow > 0
                  ? (who ? `${formatCOP(chargeNow)} cobrado a ${who}.` : `${formatCOP(chargeNow)} cobrado.`)
                  : (who ? `Servicio de ${who} cubierto por el prepago.` : 'Servicio cubierto por el prepago.')}
            </p>
            {!isNoShow && !hasClient && (
              <p className="text-xs text-[#b0b5c8] mt-1">El servicio quedó registrado sin cliente.</p>
            )}
          </div>

          <div className="w-full bg-[#f7f8fb] rounded-2xl px-4 py-3 flex flex-col gap-2 text-left">
            {check('La cita fue actualizada en la agenda')}
            {isNoShow ? (
              retained > 0 ? (
                <>
                  {check(`Prepago retenido ${formatCOP(retained)}`)}
                  {check('Venta registrada')}
                  {check(`Comisión total → ${formatCOP(retainedCommission)}`)}
                </>
              ) : check('No se generó ningún cobro')
            ) : (
              <>
                {check(items.map(i => i.serviceName).join(', '))}
                {check(`Comisión total → ${formatCOP(commissionTotal)}`)}
                {tipAmount > 0 && check(`Propina ${formatCOP(tipAmount)} (100% tuya)`)}
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: '#FF2947' }}
          >
            Volver a la agenda
          </button>
        </div>
      </div>
    );
  }

  return null;
}
