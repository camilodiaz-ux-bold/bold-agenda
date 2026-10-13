import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, UserX, Plus, Loader2, Clock, AlertTriangle, XCircle } from 'lucide-react';
import type { Appointment, Professional, Service, PaymentMethod, SaleLineItem, Client, ClosureResult } from '../types';
import { formatCOP, formatDuration } from '../data/appointments';
import {
  calcTip, calcTotals, canRemoveLine, makeLineItem, totalCommission,
  type TipPreset,
} from '../lib/closure';
import { CheckoutStepLayout } from './CheckoutStepLayout';
import {
  Card, Section, Field, ActionButton, PrimaryButton, ServiceLine, TotalsSummary,
  PaymentMethodSelector, PAYMENT_OPTIONS, CheckoutStatusScreen, ClientPicker, ServicePicker,
  PrototypePanel, type MockResult,
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

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeRange(start: string, minutes: number): string {
  const [h, mn] = start.split(':').map(Number);
  const end = h * 60 + mn + minutes;
  return `${start} – ${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
}

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

  const serviceCount = `${items.length} ${items.length === 1 ? 'Servicio' : 'Servicios'}`;
  const summary = { label: serviceCount, value: formatCOP(subtotal) };
  const durationOf = (item: SaleLineItem) => {
    const d = services.find(sv => sv.id === item.serviceId)?.duration ?? (item.serviceId === service.id ? service.duration : undefined);
    return d ? formatDuration(d) : undefined;
  };

  // Campo Cliente: selector solo si la cita no trae cliente propio.
  const clientField = (
    <Field
      label="Cliente"
      value={clientName}
      placeholder="Sin cliente asociado"
      onClick={appointment.clientName ? undefined : () => setOverlay('client')}
    />
  );

  // ── Composición por estado: navegación, contenido, barra inferior ───────
  let body: ReactNode = null;
  let cta: ReactNode;
  let ctaSummary: { label: string; value: string } | undefined = summary;
  let onBack: (() => void) | undefined = onExit;
  let onClose: (() => void) | undefined = onExit;
  let viewKey: string = step;

  if (overlay === 'client') {
    viewKey = 'overlay-client';
    onBack = () => setOverlay(null);
    ctaSummary = undefined;
    body = (
      <ClientPicker
        clients={clients}
        onClear={draftClient ? () => { setDraftClient(null); setOverlay(null); } : undefined}
        onSelect={(client, isNew) => { setDraftClient({ client, isNew }); setOverlay(null); }}
      />
    );
  } else if (overlay === 'service') {
    viewKey = 'overlay-service';
    onBack = () => setOverlay(null);
    ctaSummary = undefined;
    body = <ServicePicker services={services} onSelect={addServiceItem} />;
  } else if (step === 'outcome') {
    body = (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {clientField}
            <Field label="Profesional" value={professional.name.split(' ')[0]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha" value={formatShortDate(appointment.date)} />
            <Field label="Hora" value={timeRange(appointment.startTime, service.duration)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton onClick={() => handleOutcomeSelect('reprogramar')}>Reprogramar</ActionButton>
          <ActionButton onClick={() => handleOutcomeSelect('no-show')}>Cliente no llegó</ActionButton>
        </div>

        <Section label="Servicios de la cita">
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => <ServiceLine key={idx} item={item} detail={durationOf(item)} />)}
          </div>
        </Section>
      </div>
    );
    cta = <PrimaryButton onClick={() => handleOutcomeSelect('completada')}>Completada</PrimaryButton>;
  } else if (step === 'noshow-confirm') {
    const retained = items.filter(i => i.prepaid).reduce((s, i) => s + i.price, 0);
    onBack = () => setStep('outcome');
    ctaSummary = undefined;
    body = (
      <div className="flex flex-col gap-6">
        <CheckoutStatusScreen
          tone="danger"
          icon={<UserX size={28} strokeWidth={2} />}
          title={appointment.clientName ? `${appointment.clientName} no se presentó` : 'El cliente no se presentó'}
          description={retained > 0
            ? `El prepago de ${formatCOP(retained)} queda retenido según la política de cancelación.`
            : 'No se generará ningún cobro.'}
        />
        <ActionButton onClick={() => setStep('outcome')}>Volver</ActionButton>
      </div>
    );
    cta = <PrimaryButton onClick={handleConfirmNoShow}>Confirmar no-show</PrimaryButton>;
  } else if (step === 'items') {
    onBack = () => setStep('outcome');
    body = (
      <div className="flex flex-col gap-8">
        {clientField}

        <Section label="Servicios realizados">
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => (
              <ServiceLine
                key={idx}
                item={item}
                detail={durationOf(item)}
                onRemove={canRemoveLine(items, idx) ? () => removeItem(idx) : undefined}
              />
            ))}
            <ActionButton onClick={() => setOverlay('service')}>
              <Plus size={16} color="#121e6c" strokeWidth={2.5} />
              Agregar servicio
            </ActionButton>
          </div>
        </Section>

        <Section label="Resumen">
          <TotalsSummary total={subtotal} prepaid={prepagoAplicado} balance={saldoPendiente} />
        </Section>
      </div>
    );
    cta = (
      <PrimaryButton onClick={() => saldoPendiente > 0 ? setStep('payment') : handleFinalize()}>
        {saldoPendiente > 0 ? 'Continuar al cobro' : 'Finalizar servicio'}
      </PrimaryButton>
    );
  } else if (step === 'payment') {
    ctaSummary = undefined;
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
      onClose = undefined;
      body = (
        <CheckoutStatusScreen
          tone="warning"
          icon={<Clock size={28} strokeWidth={2} />}
          title="Pago pendiente"
          description="Estamos esperando la confirmación del pago."
          note="Puedes volver a la cita. Actualizaremos el estado automáticamente cuando recibamos la respuesta."
        />
      );
      cta = <PrimaryButton onClick={onExit}>Volver a la cita</PrimaryButton>;
    } else if (payState === 'register-failed') {
      viewKey = 'register-failed';
      onBack = undefined;
      body = (
        <CheckoutStatusScreen
          tone="warning"
          icon={<AlertTriangle size={28} strokeWidth={2} />}
          title="Pago confirmado"
          description="No pudimos terminar de registrar el servicio."
          note={`Reintentar el registro no vuelve a cobrar. Referencia de pago: ${paymentRefRef.current}`}
        />
      );
      cta = (
        <PrimaryButton onClick={handleRetryRegister} loading={retryingRegister}>
          {retryingRegister ? 'Registrando…' : 'Reintentar registro'}
        </PrimaryButton>
      );
    } else if (payState === 'declined') {
      viewKey = 'declined';
      onBack = () => setPayState('idle');
      body = (
        <div className="flex flex-col gap-6">
          <CheckoutStatusScreen
            tone="danger"
            icon={<XCircle size={30} strokeWidth={2} />}
            title="Pago no aprobado"
            description="No se pudo procesar el pago. Reintenta con el mismo método o elige otro."
            note={methodLabel ? `Método: ${methodLabel} · ${formatCOP(chargeNow)}` : undefined}
          />
          <ActionButton onClick={() => setPayState('idle')}>Cambiar método</ActionButton>
        </div>
      );
      cta = <PrimaryButton onClick={handleCharge}>Reintentar</PrimaryButton>;
    } else {
      const canCharge = Boolean(paymentMethod) && !tipError && methodsState === 'ok';
      onBack = () => setStep('items');
      ctaSummary = summary;
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
      cta = (
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
    onClose = undefined;
    ctaSummary = undefined;

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
    cta = <PrimaryButton onClick={onFinish}>Volver a la agenda</PrimaryButton>;
  }

  return (
    <CheckoutStepLayout
      key={viewKey}
      onBack={onBack}
      backDisabled={busy}
      onClose={onClose}
      closeDisabled={busy}
      summary={cta ? ctaSummary : undefined}
      cta={cta}
    >
      {body}
    </CheckoutStepLayout>
  );
}
