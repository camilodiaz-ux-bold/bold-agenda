import type { Appointment, AvailabilityBlock, Professional, Service } from '../types';
import { store, getSlotsForProf, timeToMin, PROTOTYPE_NOW } from '../store/prototypeStore';

/**
 * Booking público: simulación de hold de horario (sin backend).
 * El hold vive en memoria: mientras existe, el slot no se ofrece a otra reserva;
 * al confirmar se consume y al expirar o abandonarse se libera.
 */
export const HOLD_TTL_MS = 5 * 60 * 1000;
/** Aviso discreto cuando falta poco para que venza. */
export const HOLD_WARN_MS = 60 * 1000;

export interface SlotHold {
  id: string;
  professionalId: string;
  date: string;
  time: string;
  duration: number;
  expiresAt: number;
}

export type HoldCheck = 'ok' | 'expired' | 'taken';

let holds: SlotHold[] = [];

function purge() {
  const now = Date.now();
  holds = holds.filter(h => h.expiresAt > now);
}

function overlaps(h: SlotHold, profId: string, date: string, time: string, duration: number) {
  if (h.professionalId !== profId || h.date !== date) return false;
  const s = timeToMin(time);
  const hs = timeToMin(h.time);
  return s < hs + h.duration && s + duration > hs;
}

/** Profesionales activos que realizan TODOS los servicios indicados. */
export function eligibleProfessionals(services: Service[]): Professional[] {
  return store.get().professionals.filter(
    p => p.active !== false && services.length > 0 && services.every(s => p.serviceIds.includes(s.id)),
  );
}

/**
 * Horarios ofrecidos para el servicio. Con profesional específico, solo los suyos;
 * con 'any', la unión de los elegibles. Cada horario trae los profesionales que lo soportan.
 * Los holds vigentes de otras reservas se descuentan (el propio se ignora).
 */
export function getBookingSlots({ service, date, profId, eligible, appointments, blocks, ownHoldId }: {
  service: Service;
  date: string;
  profId: string | 'any';
  eligible: Professional[];
  appointments: Appointment[];
  blocks: AvailabilityBlock[];
  ownHoldId?: string;
}): { time: string; professionalIds: string[] }[] {
  purge();
  const pool = profId === 'any' ? eligible : eligible.filter(p => p.id === profId);
  const byTime = new Map<string, string[]>();
  for (const p of pool) {
    for (const time of getSlotsForProf(service, date, p.id, appointments, blocks)) {
      if (new Date(`${date}T${time}:00`) <= PROTOTYPE_NOW) continue; // no ofrecer horas ya pasadas
      const held = holds.some(h => h.id !== ownHoldId && overlaps(h, p.id, date, time, service.duration));
      if (held) continue;
      byTime.set(time, [...(byTime.get(time) ?? []), p.id]);
    }
  }
  return [...byTime.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, professionalIds]) => ({ time, professionalIds }));
}

/** Crea el hold del horario elegido; reemplaza el anterior de la misma reserva. */
export function createHold(prev: string | undefined, professionalId: string, date: string, time: string, duration: number): SlotHold {
  releaseHold(prev);
  const hold: SlotHold = {
    id: `hold_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    professionalId, date, time, duration,
    expiresAt: Date.now() + HOLD_TTL_MS,
  };
  holds.push(hold);
  return hold;
}

export function releaseHold(id: string | undefined) {
  if (id) holds = holds.filter(h => h.id !== id);
}

export function holdMsLeft(id: string | undefined): number | null {
  const h = holds.find(x => x.id === id);
  return h ? h.expiresAt - Date.now() : null;
}

// Escenarios de prototipo: ?simulate=expired | taken fuerzan el error la primera vez que se confirma.
let simulated = false;
function simulatedResult(): HoldCheck | null {
  if (simulated) return null;
  const q = new URLSearchParams(window.location.search).get('simulate');
  if (q === 'expired' || q === 'taken') {
    simulated = true;
    return q;
  }
  return null;
}

/** Revalida antes de crear la cita: hold vigente y horario todavía libre. */
export function validateHold(id: string | undefined, service: Service): HoldCheck {
  const forced = simulatedResult();
  if (forced) {
    releaseHold(id);
    return forced;
  }
  purge();
  const hold = holds.find(h => h.id === id);
  if (!hold) return 'expired';
  const s = store.get();
  const stillFree = getSlotsForProf(service, hold.date, hold.professionalId, s.appointments, s.availabilityBlocks)
    .includes(hold.time);
  const otherHold = holds.some(h => h.id !== hold.id && overlaps(h, hold.professionalId, hold.date, hold.time, hold.duration));
  if (!stillFree || otherHold) {
    releaseHold(id);
    return 'taken';
  }
  return 'ok';
}

/** Consume el hold al convertirlo en cita. */
export function consumeHold(id: string | undefined) {
  releaseHold(id);
}
