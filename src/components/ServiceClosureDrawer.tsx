import { useState } from 'react';
import { CheckCircle2, UserX, CalendarClock, CreditCard, Smartphone, Link2, Check } from 'lucide-react';
import type { Appointment, Professional, Service, PaymentMethod } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  onClose: () => void;
  onComplete: (result: ClosureResult) => void;
  onReschedule: () => void;
}

export interface ClosureResult {
  appointmentId: string;
  outcome: 'completada' | 'no-show';
  tip: number;
  paymentMethod?: PaymentMethod;
}

type Step = 'outcome' | 'payment' | 'noshow-confirm' | 'done';
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

export function ServiceClosureDrawer({ appointment, professional, service, onClose, onComplete, onReschedule }: Props) {
  const [step, setStep] = useState<Step>('outcome');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [tipPreset, setTipPreset] = useState<TipPreset>(0);
  const [customTip, setCustomTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const isPrepaid = appointment.paymentStatus === 'pagado-anticipado';
  const tipAmount = calcTip(service.price, tipPreset, customTip);
  const total = service.price + tipAmount;

  function handleOutcomeSelect(o: Outcome) {
    setOutcome(o);
    if (o === 'no-show') {
      setStep('noshow-confirm');
    } else if (o === 'reprogramar') {
      onReschedule();
    } else {
      setStep('payment');
    }
  }

  function handleConfirmClosure() {
    onComplete({
      appointmentId: appointment.id,
      outcome: outcome as 'completada' | 'no-show',
      tip: tipAmount,
      paymentMethod: paymentMethod ?? undefined,
    });
    setStep('done');
  }

  // ── Step: Outcome ──────────────────────────────────────────────────────
  if (step === 'outcome') {
    return (
      <div className="px-5 pb-6 flex flex-col gap-3">
        {/* Service context */}
        <div className="bg-[#f7f8fb] rounded-xl px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1e1e1e]">{appointment.clientName}</p>
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
          className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-left transition-all active:border-[#E8194B] active:bg-[#FFF1F2]"
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
    );
  }

  // ── Step: No-show confirm ──────────────────────────────────────────────
  if (step === 'noshow-confirm') {
    return (
      <div className="px-5 pb-6 flex flex-col gap-3">
        <div className="rounded-2xl px-4 py-3 bg-[#f7f8fb]">
          <p className="text-sm font-bold text-[#1e1e1e] mb-1">
            {appointment.clientName} no se presentó
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
    );
  }

  // ── Step: Payment ──────────────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="px-5 pb-6 flex flex-col gap-4">
        {/* Price summary */}
        <div className="bg-[#f7f8fb] rounded-xl px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#606060]">{service.name}</span>
            <span className="text-sm font-semibold text-[#1e1e1e] tabular-nums">{formatCOP(service.price)}</span>
          </div>
          {tipAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#606060]">Propina</span>
              <span className="text-sm font-semibold text-[#15803D] tabular-nums">+ {formatCOP(tipAmount)}</span>
            </div>
          )}
          <div className="h-px bg-gray-200" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#121e6c]">Total</span>
            <span className="text-base font-bold text-[#121e6c] tabular-nums">{formatCOP(total)}</span>
          </div>
        </div>

        {/* Tip selector */}
        {!isPrepaid && (
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
        )}

        {isPrepaid ? (
          /* Prepaid confirmation — calm, positive */
          <div className="bg-[#F0FDFA] rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 size={17} color="#0D9488" strokeWidth={2} />
            <p className="text-sm text-[#0D9488] font-semibold">
              Prepagado · {formatCOP(service.price)} ya recibido
            </p>
          </div>
        ) : (
          /* Payment method */
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
        )}

        {/* CTA */}
        <button
          onClick={handleConfirmClosure}
          disabled={!isPrepaid && !paymentMethod}
          className="w-full h-13 rounded-full font-bold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: '#E8194B', height: '52px' }}
        >
          <CheckCircle2 size={19} color="white" strokeWidth={2.5} />
          {isPrepaid ? 'Confirmar servicio' : `Cobrar ${formatCOP(total)}`}
        </button>
      </div>
    );
  }

  // ── Step: Done ─────────────────────────────────────────────────────────
  if (step === 'done') {
    const isNoShow = outcome === 'no-show';
    return (
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
              ? `${appointment.clientName} no se presentó a su cita.`
              : isPrepaid
                ? `Servicio de ${appointment.clientName} confirmado.`
                : `${formatCOP(total)} cobrado a ${appointment.clientName}.`
            }
          </p>
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
                  Comisión {Math.round(professional.commissionRate * 100)}%  →  {formatCOP(Math.round(service.price * professional.commissionRate))}
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
          style={{ backgroundColor: '#121e6c' }}
        >
          Volver a la agenda
        </button>
      </div>
    );
  }

  return null;
}
