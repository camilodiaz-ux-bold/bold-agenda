import type { Appointment, Client, PaymentMethod, SaleLineItem, SaleRecord, Service } from '../types';

export type TipPreset = 0 | 5 | 10 | 'custom';

export function lineCommission(price: number, commissionPercent: number): number {
  return Math.round((price * commissionPercent) / 100);
}

export function makeLineItem(
  svc: Service, price: number, origin: SaleLineItem['origin'], prepaid = false,
): SaleLineItem {
  return {
    serviceId: svc.id,
    serviceName: svc.name,
    price,
    commissionPercent: svc.commissionPercent,
    commissionAmount: lineCommission(price, svc.commissionPercent),
    origin,
    ...(prepaid ? { prepaid: true } : {}),
  };
}

export function calcTotals(items: SaleLineItem[]) {
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const prepaid = items.reduce((s, i) => s + (i.prepaid ? i.price : 0), 0);
  return { subtotal, prepaid, balance: Math.max(0, subtotal - prepaid) };
}

export function totalCommission(items: SaleLineItem[]): number {
  return items.reduce((s, i) => s + i.commissionAmount, 0);
}

export function canRemoveLine(items: SaleLineItem[], idx: number): boolean {
  const item = items[idx];
  if (!item || item.prepaid) return false;
  if (item.origin === 'agregado') return true;
  return items.length > 1;
}

export function parseTipInput(raw: string): { value: number; error: string | null } {
  const t = raw.trim();
  if (t === '') return { value: 0, error: null };
  if (!/^\d+$/.test(t)) return { value: 0, error: 'Ingresa un monto entero mayor o igual a 0.' };
  return { value: parseInt(t, 10), error: null };
}

export function calcTip(subtotal: number, preset: TipPreset, customRaw: string): { amount: number; error: string | null } {
  if (preset === 0) return { amount: 0, error: null };
  if (preset === 'custom') {
    const { value, error } = parseTipInput(customRaw);
    return { amount: value, error };
  }
  return { amount: Math.round((subtotal * preset) / 100), error: null };
}

export interface ClosureResult {
  closureRef: string;
  appointmentId: string;
  outcome: 'completada' | 'no-show';
  items: SaleLineItem[];
  subtotal: number;
  prepaid: number;
  tip: number;
  charged: number;
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  client?: { client: Client; isNew: boolean };
}

export interface ClosureSlice {
  appointments: Appointment[];
  clients: Client[];
  saleRecords: SaleRecord[];
}

/**
 * Single commit of a closure: appointment, sale, client history. Returns null
 * when the closure was already applied (idempotent against double submits).
 */
export function applyClosure(
  state: ClosureSlice, r: ClosureResult, when: { date: string; iso: string },
): ClosureSlice | null {
  const apt = state.appointments.find(a => a.id === r.appointmentId);
  if (!apt) return null;
  if (apt.status === 'completada' || apt.status === 'no-show') return null;
  if (state.saleRecords.some(s => s.closureRef === r.closureRef)) return null;

  const completed = r.outcome === 'completada';
  let clients = state.clients;
  let target: Client | undefined;

  if (completed) {
    if (r.client) {
      const picked = r.client.client;
      target = clients.find(c => c.id === picked.id) ?? picked;
      if (!clients.some(c => c.id === picked.id)) clients = [...clients, picked];
    } else if (apt.clientName) {
      target = clients.find(c =>
        (apt.clientPhone && c.phone === apt.clientPhone) || (apt.clientCedula && c.cedula === apt.clientCedula));
    }
    if (target) {
      const t = target;
      clients = clients.map(c => c.id === t.id ? {
        ...c,
        totalSpent: c.totalSpent + r.subtotal + r.tip,
        visitCount: c.visitCount + 1,
        lastVisit: !c.lastVisit || c.lastVisit < when.date ? when.date : c.lastVisit,
      } : c);
    }
  }

  const assoc = completed && r.client
    ? { clientName: r.client.client.name, clientPhone: r.client.client.phone, clientCedula: r.client.client.cedula }
    : {};

  const nextApt: Appointment = completed
    ? {
        ...apt, ...assoc,
        status: 'completada',
        paymentStatus: 'pagado',
        paymentMethod: r.paymentMethod ?? 'anticipado',
        tip: r.tip,
      }
    : { ...apt, status: 'no-show' };

  const sale: SaleRecord | null = completed || r.prepaid > 0
    ? {
        id: `sr-${r.closureRef}`,
        appointmentId: apt.id,
        clientName: nextApt.clientName,
        professionalId: apt.professionalId,
        items: r.items,
        serviceValue: r.subtotal,
        tip: r.tip,
        total: r.subtotal + r.tip,
        paymentMethod: completed ? (r.paymentMethod ?? 'anticipado') : 'anticipado',
        paymentStatus: completed ? 'pagado' : 'pagado-anticipado',
        commission: totalCommission(r.items),
        completedAt: when.iso,
        kind: completed ? 'servicio' : 'no-show',
        prepaid: r.prepaid,
        charged: r.charged,
        closureRef: r.closureRef,
        paymentRef: r.paymentRef,
        ...(completed ? {} : { note: 'No-show' }),
      }
    : null;

  return {
    appointments: state.appointments.map(a => a.id === apt.id ? nextApt : a),
    clients,
    saleRecords: sale ? [...state.saleRecords, sale] : state.saleRecords,
  };
}
