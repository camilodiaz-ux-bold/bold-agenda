import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CheckCircle2, UserX, CalendarClock, UserPlus, Plus, X, ChevronRight,
  Loader2, Clock, AlertTriangle, RefreshCw, XCircle,
} from 'lucide-react';
import type { Appointment, Professional, Service, PaymentMethod, SaleLineItem, Client, ClosureResult } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';
import {
  calcTip, calcTotals, canRemoveLine, makeLineItem, totalCommission,
  type TipPreset,
} from '../lib/closure';
import { DetailPageShell } from './DetailPageShell';
import {
  Card, Divider, Section, FIELD_LABEL, FIELD_VALUE, PrimaryButton, SecondaryButton,
  ServiceLine, TotalsSummary, PaymentMethodSelector, PAYMENT_OPTIONS, CheckoutStatusScreen,
  ClientPicker, ServicePicker, PrototypePanel, type MockResult,
} from './CheckoutParts';

interface Props {
  appointment: Appointment;
  professional: Professional;
  service: Service;
  services: Service[];
  clients: Client[];
  defaultTipPercent?: number;
  /** Abandona el checkout y vuelve a Detalle de la cita (también tras pago pendiente). */
  onExit: () => void;
  /** Termina el flujo (éxito / no-show registrado) y vuelve a la Agenda. */
  onFinish: () => void;
  onComplete: (result: ClosureResult) => void;
  onPaymentPending: (result: ClosureResult) => void;
  onReschedule: () => void;
}

type Step = 'outcome' | 'items' | 'payment' | 'noshow-confirm' | 'done';
type Overlay = 'client' | 'service' | null;
type Outcome = 'completada' | 'no-show';
type PayState = 'idle' | 'processing' | 'pending' | 'declined' | 'register-failed';
type MethodsState = 'ok' | 'loading' | 'error';
type DraftClient = { client: Client; isNew: boolean };

const PROCESSING_MS = 1800;

export function ServiceClosureScreen({
  appointment, professional, service, services, clients, defaultTipPercent = 0,
  onExit, onFinish, onComplete, onPaymentPending, onReschedule,
}: Props) {
  const [step, setStep] = useState<Step>('outcome');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const isPrepaid = appointment.paymentStatus === 'pagado-anticipado';
  const [items, setItems] = useState<SaleLineItem[]>([
    makeLineItem(service, appointment.originalPrice ?? service.price, 'agendado', isPrepaid),
  ]);
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

  // Un pago en curso, o un pago confirmado sin registrar, no se puede abandonar.
  const busy = payState === 'processing' || payState === 'register-failed';

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

  function addServiceItem(svc: Service) {
    setItems(prev => [...prev, makeLineItem(svc, svc.price, 'agregado')]);
    setOverlay(null);
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
      paymentRefRef.current = paymentRefRef.current ?? `pay-${closureRef.current}`;
      if (mock === 'pendiente') {
        onPaymentPending(buildCompletedResult());
        submittingRef.current = false;
        setPayState('pending');
      } else if (mock === 'no-pagado') {
        submittingRef.current = false;
        setPayState('declined');
      } else {
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

  // ── Bloques reutilizados entre pasos ────────────────────────────────────
  const clientSection = (
    <Section label="Cliente">
      <Card className="gap-0">
        {hasClient ? (
          <div className="flex items-center justify-between gap-3">
            <p className={`${FIELD_VALUE} font-bold truncate`}>{clientName}</p>
            {draftClient && (
              <button
                onClick={() => setDraftClient(null)}
                aria-label="Quitar cliente"
                className="text-[12px] font-semibold shrink-0 active:opacity-60"
                style={{ color: '#6C759F' }}
              >
                Quitar
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[14px] italic" style={{ color: '#b0b5c8' }}>Sin cliente asociado</p>
            <button
              onClick={() => setOverlay('client')}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#121e6c] shrink-0 active:opacity-70"
            >
              <UserPlus size={14} color="#121e6c" strokeWidth={2} />
              Agregar cliente
            </button>
          </div>
        )}
      </Card>
    </Section>
  );

  // ── Composición por estado: título, navegación, contenido, CTA ──────────
  let body: ReactNode = null;
  let footer: ReactNode;
  let onBack: (() => void) | undefined = onExit;
  let showClose = true;
  let viewKey: string = step;

  if (overlay === 'client') {
    viewKey = 'overlay-client';
    onBack = () => setOverlay(null);
    body = (
      <ClientPicker
        clients={clients}
        onSelect={(client, isNew) => { setDraftClient({ client, isNew }); setOverlay(null); }}
      />
    );
  } else if (overlay === 'service') {
    viewKey = 'overlay-service';
    onBack = () => setOverlay(null);
    body = <ServicePicker services={services} onSelect={addServiceItem} />;
  } else if (step === 'outcome') {
    body = (
      <div className="flex flex-col gap-8">
        <Section label="Cita">
          <Card className="gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex flex-col gap-2">
                <p className={`${FIELD_LABEL} truncate`}>{service.name}</p>
                <p className={FIELD_VALUE}>{formatDuration(service.duration)} · {professional.name.split(' ')[0]}</p>
              </div>
              <p className="text-[12px] font-bold shrink-0 tabular-nums" style={{ color: '#121e6c' }}>
                {formatCOP(appointment.originalPrice ?? service.price)}
              </p>
            </div>
            <Divider />
            <p className={appointment.clientName ? FIELD_VALUE : 'text-[14px] italic text-[#b0b5c8]'}>
              {appointment.clientName ?? 'Sin cliente asociado'}
            </p>
          </Card>
        </Section>

        <Section label="¿Cómo terminó la cita?">
          <div className="bg-white rounded-2xl px-4 flex flex-col">
            <button onClick={() => handleOutcomeSelect('completada')} className="flex items-center gap-3 py-4 text-left active:opacity-70">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} color="#15803D" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className={FIELD_LABEL}>Completada</p>
                <p className="text-[14px] text-[#1e1e1e] leading-5">El servicio se realizó correctamente</p>
              </div>
              <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
            </button>
            <Divider />
            <button onClick={() => handleOutcomeSelect('no-show')} className="flex items-center gap-3 py-4 text-left active:opacity-70">
              <div className="w-9 h-9 rounded-full bg-[#FFF1F2] flex items-center justify-center shrink-0">
                <UserX size={18} color="#BE123C" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className={FIELD_LABEL}>El cliente no llegó</p>
                <p className="text-[14px] text-[#1e1e1e] leading-5">Se registrará como no-show</p>
              </div>
              <ChevronRight size={16} color="#b0b5c8" strokeWidth={2} />
            </button>
          </div>
        </Section>

        <button
          onClick={() => handleOutcomeSelect('reprogramar')}
          className="w-full bg-white rounded-2xl px-3 py-3 flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
        >
          <CalendarClock size={16} color="#121e6c" strokeWidth={2} />
          <span className="text-[14px] font-bold text-[#121e6c]">¿La cita se movió? Reprogramar</span>
        </button>
      </div>
    );
  } else if (step === 'noshow-confirm') {
    const retained = items.filter(i => i.prepaid).reduce((s, i) => s + i.price, 0);
    onBack = () => setStep('outcome');
    body = (
      <CheckoutStatusScreen
        tone="danger"
        icon={<UserX size={28} strokeWidth={2} />}
        title={appointment.clientName ? `${appointment.clientName} no se presentó` : 'El cliente no se presentó'}
        description={retained > 0
          ? `El prepago de ${formatCOP(retained)} queda retenido según la política de cancelación.`
          : 'No se generará ningún cobro.'}
      />
    );
    footer = (
      <div className="flex flex-col gap-2">
        <button
          onClick={handleConfirmNoShow}
          className="w-full h-12 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ backgroundColor: '#BE123C' }}
        >
          <UserX size={17} color="white" strokeWidth={2} />
          Confirmar no-show
        </button>
        <SecondaryButton onClick={() => setStep('outcome')}>Volver</SecondaryButton>
      </div>
    );
  } else if (step === 'items') {
    onBack = () => setStep('outcome');
    body = (
      <div className="flex flex-col gap-8">
        {clientSection}

        <Section label="Servicios realizados">
          <Card>
            {items.map((_, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {idx > 0 && <Divider />}
                <ServiceLine items={items} index={idx} onRemove={removeItem} />
              </div>
            ))}
            <Divider />
            <button
              onClick={() => setOverlay('service')}
              className="flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#121e6c] active:opacity-60"
            >
              <Plus size={15} color="#121e6c" strokeWidth={2.5} />
              Agregar servicio
            </button>
          </Card>
        </Section>

        <Section label="Resumen">
          <TotalsSummary total={subtotal} prepaid={prepagoAplicado} balance={saldoPendiente} />
        </Section>
      </div>
    );
    footer = (
      <PrimaryButton onClick={() => saldoPendiente > 0 ? setStep('payment') : handleFinalize()}>
        {saldoPendiente > 0 ? 'Continuar al cobro' : 'Finalizar servicio'}
      </PrimaryButton>
    );
  } else if (step === 'payment') {
    if (payState === 'processing') {
      viewKey = 'processing';
      onBack = undefined;
      body = (
        <CheckoutStatusScreen
          tone="neutral"
          icon={<Loader2 size={30} strokeWidth={2} className="animate-spin" />}
          title="Procesando pago"
          description={`Cobrando ${formatCOP(chargeNow)} con ${methodLabel}.`}
          note="No cierres esta pantalla."
        />
      );
    } else if (payState === 'pending') {
      viewKey = 'pending';
      onBack = undefined;
      showClose = false;
      body = (
        <CheckoutStatusScreen
          tone="warning"
          icon={<Clock size={28} strokeWidth={2} />}
          title="Pago pendiente"
          description="Estamos esperando la confirmación del pago."
          note="Puedes volver a la cita. Actualizaremos el estado automáticamente cuando recibamos la respuesta."
        />
      );
      footer = <PrimaryButton onClick={onExit}>Volver a la cita</PrimaryButton>;
    } else if (payState === 'register-failed') {
      viewKey = 'register-failed';
      onBack = undefined;
      body = (
        <CheckoutStatusScreen
          tone="warning"
          icon={<AlertTriangle size={28} strokeWidth={2} />}
          title="Pago confirmado"
          description="No pudimos registrar el cierre."
          note={`Reintentar el registro no vuelve a cobrar. Referencia de pago: ${paymentRefRef.current}`}
        />
      );
      footer = (
        <PrimaryButton onClick={handleRetryRegister} loading={retryingRegister}>
          {retryingRegister ? 'Registrando…' : <><RefreshCw size={16} color="white" strokeWidth={2.5} /> Reintentar registro</>}
        </PrimaryButton>
      );
    } else if (payState === 'declined') {
      viewKey = 'declined';
      onBack = () => setPayState('idle');
      body = (
        <CheckoutStatusScreen
          tone="danger"
          icon={<XCircle size={30} strokeWidth={2} />}
          title="Pago no aprobado"
          description="No se pudo procesar el pago. Reintenta con el mismo método o elige otro."
          note={methodLabel ? `Método: ${methodLabel} · ${formatCOP(chargeNow)}` : undefined}
        />
      );
      footer = (
        <div className="flex flex-col gap-2">
          <PrimaryButton onClick={handleCharge}>Reintentar {formatCOP(chargeNow)}</PrimaryButton>
          <SecondaryButton onClick={() => setPayState('idle')}>Cambiar método</SecondaryButton>
        </div>
      );
    } else {
      const canCharge = Boolean(paymentMethod) && !tipError && methodsState === 'ok';
      onBack = () => setStep('items');
      body = (
        <div className="flex flex-col gap-8">
          <Section label="Resumen">
            <TotalsSummary lines={items} total={subtotal} prepaid={prepagoAplicado} tip={tipAmount} balance={chargeNow} />
          </Section>

          <Section label="Propina">
            <Card className="gap-3">
              <div className="flex gap-2">
                {([0, 5, 10, 'custom'] as TipPreset[]).map(preset => {
                  const active = tipPreset === preset;
                  return (
                    <button
                      key={String(preset)}
                      onClick={() => setTipPreset(preset)}
                      className="flex-1 h-9 rounded-full text-[12px] font-semibold border transition-all active:opacity-70"
                      style={{
                        backgroundColor: active ? '#121e6c' : '#fff',
                        color: active ? '#fff' : '#606060',
                        borderColor: active ? '#121e6c' : '#d2d4e1',
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
                    className="w-full h-10 rounded-xl bg-[#f7f8fb] border px-3 text-[14px] text-[#1e1e1e] outline-none focus:border-[#121e6c]"
                    style={{ borderColor: tipError ? '#BE123C' : '#d2d4e1' }}
                  />
                  {tipError && <p className="text-[12px] text-[#BE123C]">{tipError}</p>}
                </>
              )}
            </Card>
          </Section>

          <Section label="Método de pago">
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} state={methodsState} onReload={reloadMethods} />
          </Section>

          <PrototypePanel mock={mock} onMock={setMock} onMethodsDown={simulateMethodsDown} />
        </div>
      );
      footer = (
        <PrimaryButton onClick={handleCharge} disabled={!canCharge}>
          Cobrar {formatCOP(chargeNow)}
        </PrimaryButton>
      );
    }
  } else if (step === 'done') {
    const isNoShow = outcome === 'no-show';
    const retained = items.filter(i => i.prepaid).reduce((s, i) => s + i.price, 0);
    const retainedCommission = totalCommission(items.filter(i => i.prepaid));
    const who = isNoShow ? appointment.clientName : clientName;
    onBack = undefined;
    showClose = false;

    const checklist = ['La cita fue actualizada en la agenda'];
    if (isNoShow) {
      if (retained > 0) {
        checklist.push(`Prepago retenido ${formatCOP(retained)}`, 'Venta registrada', `Comisión total → ${formatCOP(retainedCommission)}`);
      } else {
        checklist.push('No se generó ningún cobro');
      }
    } else {
      checklist.push(items.map(i => i.serviceName).join(', '), `Comisión total → ${formatCOP(commissionTotal)}`);
      if (tipAmount > 0) checklist.push(`Propina ${formatCOP(tipAmount)} (100% tuya)`);
    }

    body = (
      <CheckoutStatusScreen
        tone={isNoShow ? 'danger' : 'success'}
        icon={isNoShow ? <UserX size={28} strokeWidth={2} /> : <CheckCircle2 size={30} strokeWidth={2} />}
        title={isNoShow ? 'No-show registrado' : 'Servicio cerrado'}
        description={isNoShow
          ? (who ? `${who} no se presentó a su cita.` : 'El cliente no se presentó a su cita.')
          : chargeNow > 0
            ? (who ? `${formatCOP(chargeNow)} cobrado a ${who}` : `${formatCOP(chargeNow)} cobrado`)
            : 'Servicio cubierto por el prepago.'}
        note={!isNoShow && !hasClient ? 'El servicio quedó registrado sin cliente.' : undefined}
        checklist={checklist}
      />
    );
    footer = <PrimaryButton onClick={onFinish}>Volver a la agenda</PrimaryButton>;
  }

  return (
    <DetailPageShell
      key={viewKey}
      title="Cierre del servicio"
      onBack={onBack}
      backDisabled={busy}
      rightAction={showClose ? (
        <button
          onClick={onExit}
          disabled={busy}
          aria-label="Abandonar cierre"
          className="w-10 h-10 -mr-2 flex items-center justify-center shrink-0 transition-opacity active:opacity-60 disabled:opacity-30"
        >
          <X size={22} color="#121e6c" strokeWidth={2} />
        </button>
      ) : undefined}
      footer={footer}
    >
      {body}
    </DetailPageShell>
  );
}
