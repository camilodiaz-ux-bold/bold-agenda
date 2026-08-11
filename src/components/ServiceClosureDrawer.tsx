import { useState } from 'react';
import {
  CheckCircle2, UserX, CalendarClock, CreditCard, Smartphone, Link2, Check, UserPlus,
  Plus, X, AlertTriangle,
} from 'lucide-react';
import type { Appointment, Professional, Service, PaymentMethod, SaleLineItem } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  services: Service[];
  onClose: () => void;
  onComplete: (result: ClosureResult) => void;
  onReschedule: () => void;
}

export interface ClosureResult {
  appointmentId: string;
  outcome: 'completada' | 'no-show';
  items: SaleLineItem[];
  subtotal: number;
  tip: number;
  saldoPendiente: number;
  paymentMethod?: PaymentMethod;
}

type Step = 'outcome' | 'add-client' | 'items' | 'payment' | 'noshow-confirm' | 'done';
type Outcome = 'completada' | 'no-show' | 'reprogramar';
type TipPreset = 0 | 5 | 10 | 'custom';

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
  { method: 'datafono', label: 'Datáfono', Icon: CreditCard },
  { method: 'qr', label: 'QR Pago', Icon: Smartphone },
  { method: 'link', label: 'Link de pago', Icon: Link2 },
];

function calcTip(basePrice: number, preset: TipPreset, customAmount: string): number {
  if (preset === 0) return 0;
  if (preset === 'custom') return parseInt(customAmount.replace(/\D/g, ''), 10) || 0;
  return Math.round(basePrice * (preset / 100));
}

function makeLineItem(svc: Service, price: number, origin: SaleLineItem['origin']): SaleLineItem {
  return {
    serviceId: svc.id,
    serviceName: svc.name,
    price,
    commissionPercent: svc.commissionPercent,
    commissionAmount: Math.round(price * (svc.commissionPercent / 100)),
    origin,
  };
}

export function ServiceClosureDrawer({ appointment, professional, service, services, onClose, onComplete, onReschedule }: Props) {
  const [step, setStep] = useState<Step>('outcome');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [items, setItems] = useState<SaleLineItem[]>([
    makeLineItem(service, appointment.originalPrice ?? service.price, 'agendado'),
  ]);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [tipPreset, setTipPreset] = useState<TipPreset>(0);
  const [customTip, setCustomTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const isPrepaid = appointment.paymentStatus === 'pagado-anticipado';
  const hasClient = Boolean(appointment.clientName);

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const prepagoAplicado = isPrepaid ? (appointment.originalPrice ?? service.price) : 0;
  const saldoBruto = subtotal - prepagoAplicado;
  const saldoPendiente = Math.max(0, saldoBruto);
  const saldoAFavor = Math.max(0, -saldoBruto);

  const tipAmount = calcTip(subtotal, tipPreset, customTip);
  const chargeNow = saldoPendiente + tipAmount;
  const totalCommission = items.reduce((s, i) => s + i.commissionAmount, 0);

  const availableServices = services.filter(s => s.active !== false);

  function addServiceItem(svc: Service) {
    setItems(prev => [...prev, makeLineItem(svc, svc.price, 'agregado')]);
    setShowServicePicker(false);
  }

  function removeItem(idx: number) {
    setItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  }

  function handleOutcomeSelect(o: Outcome) {
    setOutcome(o);
    if (o === 'no-show') {
      setStep('noshow-confirm');
    } else if (o === 'reprogramar') {
      onReschedule();
    } else if (!hasClient) {
      setStep('add-client');
    } else {
      setStep('items');
    }
  }

  function handleConfirmClosure() {
    const isNoShow = outcome === 'no-show';
    onComplete({
      appointmentId: appointment.id,
      outcome: outcome as 'completada' | 'no-show',
      items: isNoShow ? [] : items,
      subtotal: isNoShow ? 0 : subtotal,
      tip: isNoShow ? 0 : tipAmount,
      saldoPendiente: isNoShow ? 0 : saldoPendiente,
      paymentMethod: paymentMethod ?? undefined,
    });
    setStep('done');
  }

  // ── Step: Outcome ──────────────────────────────────────────────────────
  if (step === 'outcome') {
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-3">
        {/* Service context */}
        <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className={`text-sm font-bold ${appointment.clientName ? 'text-[#1e1e1e]' : 'text-[#b0b5c8] italic'}`}>
              {appointment.clientName ?? 'Sin cliente asociado'}
            </p>
            <p className="text-xs text-[#969696] mt-0.5">{service.name} · {formatDuration(service.duration)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(service.price)}</p>
            <p className="text-[11px] text-[#969696] mt-0.5">{professional.name.split(' ')[0]}</p>
          </div>
        </div>

        <p className="text-sm font-bold text-[#121e6c]">¿Cómo terminó la cita?</p>

        {/* Option: Completada */}
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

        {/* Option: No llegó */}
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

        {/* Secondary: Reprogramar */}
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

  // ── Step: Add client (non-blocking, walk-in only) ─────────────────────
  if (step === 'add-client') {
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="w-12 h-12 rounded-full bg-[#f0f1f5] flex items-center justify-center">
            <UserPlus size={22} color="#121e6c" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1e1e1e]">¿Deseas agregar un cliente?</p>
            <p className="text-xs text-[#969696] mt-1 leading-relaxed">
              Puedes asociarlo ahora o hacerlo después desde el detalle de la cita.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep('items')}
          className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#FF2947' }}
        >
          Continuar sin cliente
        </button>

        <button
          onClick={() => setStep('outcome')}
          className="w-full h-10 flex items-center justify-center text-sm text-[#969696] transition-opacity active:opacity-60"
        >
          Volver
        </button>
      </div>
      </div>
    );
  }

  // ── Step: No-show confirm ──────────────────────────────────────────────
  if (step === 'noshow-confirm') {
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-2xl px-4 py-3 bg-[#f7f8fb]">
          <p className="text-sm font-bold text-[#1e1e1e] mb-1">
            {appointment.clientName ? `${appointment.clientName} no se presentó` : 'El cliente no se presentó'}
          </p>
          <p className="text-xs text-[#969696] leading-relaxed">
            {isPrepaid
              ? 'El valor prepagado queda retenido según la política de cancelación del salón. Esta decisión debe confirmarse con la administración.'
              : 'No se generará ningún cobro por esta cita.'}
          </p>
        </div>

        <button
          onClick={handleConfirmClosure}
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

  // ── Step: Items — servicios realmente realizados ──────────────────────
  if (step === 'items') {
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-3">
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
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-[#121e6c] tabular-nums">{formatCOP(item.price)}</span>
                {items.length > 1 && (
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
            {availableServices.length === 0 ? (
              <p className="text-xs text-[#969696] text-center py-2">No hay servicios activos para agregar</p>
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
              onClick={() => setShowServicePicker(false)}
              className="w-full h-9 rounded-full text-xs font-semibold text-[#606060] border transition-opacity active:opacity-70"
              style={{ borderColor: '#d2d4e1' }}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Totals */}
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

        {saldoAFavor > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 flex items-start gap-2">
            <AlertTriangle size={14} color="#b45309" strokeWidth={2} className="mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              El prepago ({formatCOP(prepagoAplicado)}) es mayor al nuevo total. Queda un saldo a favor de {formatCOP(saldoAFavor)} — revísalo manualmente, este prototipo no genera devoluciones automáticas.
            </p>
          </div>
        )}

        <button
          onClick={() => saldoPendiente > 0 ? setStep('payment') : handleConfirmClosure()}
          className="w-full h-13 rounded-full font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#FF2947', height: '52px' }}
        >
          <CheckCircle2 size={19} color="white" strokeWidth={2.5} />
          {saldoPendiente > 0 ? 'Continuar al cobro' : 'Finalizar servicio'}
        </button>
      </div>
      </div>
    );
  }

  // ── Step: Payment ──────────────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 flex flex-col gap-4">
        {/* Price summary */}
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
              <span className="text-sm font-semibold text-[#15803D] tabular-nums">+ {formatCOP(tipAmount)}</span>
            </div>
          )}
          <div className="h-px bg-gray-200" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#121e6c]">Saldo por cobrar</span>
            <span className="text-base font-bold text-[#121e6c] tabular-nums">{formatCOP(chargeNow)}</span>
          </div>
        </div>

        {/* Tip selector */}
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
            <input
              type="number"
              placeholder="Ingresa el monto"
              value={customTip}
              onChange={e => setCustomTip(e.target.value)}
              className="mt-2 w-full h-10 rounded-xl bg-[#f7f8fb] border border-[#d2d4e1] px-3 text-sm text-[#1e1e1e] outline-none focus:border-[#121e6c]"
            />
          )}
        </div>

        {/* Payment method */}
        <div>
          <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Método de pago</p>
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
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <Check size={15} color="#121e6c" strokeWidth={2.5} className="ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirmClosure}
          disabled={!paymentMethod}
          className="w-full h-13 rounded-full font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: '#FF2947', height: '52px' }}
        >
          <CheckCircle2 size={19} color="white" strokeWidth={2.5} />
          {`Cobrar ${formatCOP(chargeNow)}`}
        </button>
      </div>
      </div>
    );
  }

  // ── Step: Done ─────────────────────────────────────────────────────────
  if (step === 'done') {
    const isNoShow = outcome === 'no-show';
    return (
      <div className="flex-1 overflow-y-auto">
      <div className="px-5 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: isNoShow ? '#FFF1F2' : '#F0FDF4' }}
        >
          {isNoShow
            ? <UserX size={24} color="#BE123C" strokeWidth={2} />
            : <CheckCircle2 size={24} color="#15803D" strokeWidth={2} />
          }
        </div>

        {/* Title + description */}
        <div>
          <p className="text-base font-bold text-[#1e1e1e]">
            {isNoShow ? 'No-show registrado' : 'Servicio cerrado'}
          </p>
          <p className="text-sm text-[#969696] mt-1 leading-relaxed">
            {isNoShow
              ? (appointment.clientName ? `${appointment.clientName} no se presentó a su cita.` : 'El cliente no se presentó a su cita.')
              : chargeNow > 0
                ? (appointment.clientName ? `${formatCOP(chargeNow)} cobrado a ${appointment.clientName}.` : `${formatCOP(chargeNow)} cobrado.`)
                : (appointment.clientName ? `Servicio de ${appointment.clientName} confirmado.` : 'Servicio confirmado.')
            }
          </p>
          {!isNoShow && !hasClient && (
            <p className="text-xs text-[#b0b5c8] mt-1">El servicio quedó registrado sin cliente.</p>
          )}
        </div>

        {/* Confirmation bullets */}
        <div className="w-full bg-[#f7f8fb] rounded-2xl px-4 py-3 flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
            <span className="text-xs text-[#606060]">La cita fue actualizada en la agenda</span>
          </div>
          {isNoShow ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
              <span className="text-xs text-[#606060]">No se generó ningún cobro</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
                <span className="text-xs text-[#606060]">
                  {items.map(i => i.serviceName).join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
                <span className="text-xs text-[#606060]">
                  Comisión total → {formatCOP(totalCommission)}
                </span>
              </div>
              {tipAmount > 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} color="#15803D" strokeWidth={2.5} />
                  <span className="text-xs text-[#606060]">
                    Propina {formatCOP(tipAmount)} (100% tuya)
                  </span>
                </div>
              )}
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
