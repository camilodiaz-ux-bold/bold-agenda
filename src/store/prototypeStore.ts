import {
  APPOINTMENTS, CLIENTS, INITIAL_SALE_RECORDS, PROFESSIONALS, SERVICES,
  SEED_AVAILABILITY_BLOCKS, SEED_BUSINESS_PROFILE, SEED_BOOKING_POLICY,
} from '../data/appointments';
import type {
  Appointment, Client, SaleRecord, Professional, Service,
  AvailabilityBlock, BookingPolicy, BusinessProfile,
} from '../types';

export interface PrototypeState {
  appointments: Appointment[];
  clients: Client[];
  saleRecords: SaleRecord[];
  availabilityBlocks: AvailabilityBlock[];
  professionals: Professional[];
  services: Service[];
  businessProfile: BusinessProfile;
  bookingPolicy: BookingPolicy;
}

const STORAGE_KEY = 'bold_agenda_v4';

function seedState(): PrototypeState {
  return {
    appointments: JSON.parse(JSON.stringify(APPOINTMENTS)),
    clients: JSON.parse(JSON.stringify(CLIENTS)),
    saleRecords: JSON.parse(JSON.stringify(INITIAL_SALE_RECORDS)),
    availabilityBlocks: JSON.parse(JSON.stringify(SEED_AVAILABILITY_BLOCKS)),
    professionals: JSON.parse(JSON.stringify(PROFESSIONALS)),
    services: JSON.parse(JSON.stringify(SERVICES)),
    businessProfile: { ...SEED_BUSINESS_PROFILE },
    bookingPolicy: { ...SEED_BOOKING_POLICY },
  };
}

let _cache: PrototypeState | null = null;

function load(): PrototypeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PrototypeState;
  } catch { /* storage unavailable */ }
  return seedState();
}

function persist(state: PrototypeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* storage full or unavailable */ }
  _cache = state;
}

export const store = {
  get(): PrototypeState {
    if (!_cache) _cache = load();
    return _cache;
  },

  set(updater: (s: PrototypeState) => PrototypeState): void {
    persist(updater(this.get()));
  },

  reset(): void {
    const s = seedState();
    persist(s);
  },
};

// Convenience helpers used across surfaces
export function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function addMinutes(time: string, duration: number): string {
  return minToTime(timeToMin(time) + duration);
}

// Prototype "now" — fixed for consistent demo behaviour
export const PROTOTYPE_NOW = new Date('2026-07-16T13:30:00');
export const PROTOTYPE_TODAY = '2026-07-16';

export function hoursUntilAppointment(apt: Appointment): number {
  const aptTime = new Date(`${apt.date}T${apt.startTime}:00`);
  return (aptTime.getTime() - PROTOTYPE_NOW.getTime()) / 3600000;
}

export function isWithinCancellationWindow(apt: Appointment, policy: BookingPolicy): boolean {
  const windowHours = apt.policySnapshot?.cancellationWindowHours ?? policy.cancellationWindowHours;
  return hoursUntilAppointment(apt) >= windowHours;
}

/** Returns time slots for a specific professional on a date, excluding blocks and occupied appointments.
 *  Pass excludeAptId to omit the current appointment from conflict calculation (for rescheduling). */
export function getSlotsForProf(
  service: Service,
  date: string,
  profId: string,
  allAppointments: Appointment[],
  availabilityBlocks: AvailabilityBlock[],
  excludeAptId?: string,
): string[] {
  const block = availabilityBlocks.find(
    b => b.professionalId === profId && b.date === date && b.type === 'full-day'
  );
  if (block) return [];

  const START = 8 * 60;
  const END = 19 * 60;
  const slots: string[] = [];
  for (let m = START; m + service.duration <= END; m += 30) {
    slots.push(minToTime(m));
  }

  const rangeBlocks = availabilityBlocks.filter(
    b => b.professionalId === profId && b.date === date && b.type === 'range'
  );

  const busy = allAppointments.filter(
    a => a.date === date && a.professionalId === profId
      && a.id !== excludeAptId
      && a.status !== 'no-show' && a.status !== 'cancelada' && a.status !== 'cancelada-tarde' && a.status !== 'completada'
  );

  return slots.filter(slot => {
    const sStart = timeToMin(slot);
    const sEnd = sStart + service.duration;

    // Check range blocks
    for (const rb of rangeBlocks) {
      const bStart = timeToMin(rb.startTime!);
      const bEnd = timeToMin(rb.endTime!);
      if (sStart < bEnd && sEnd > bStart) return false;
    }

    // Check appointments
    for (const a of busy) {
      const svc = store.get().services.find(sv => sv.id === a.serviceId);
      if (!svc) continue;
      const aStart = timeToMin(a.startTime);
      const aEnd = aStart + svc.duration;
      if (sStart < aEnd && sEnd > aStart) return false;
    }

    return true;
  });
}

export function getAvailableSlots(
  service: Service,
  date: string,
  profId: string | 'any',
  allAppointments: Appointment[],
  availabilityBlocks: AvailabilityBlock[],
  excludeAptId?: string,
): string[] {
  const isDayOff = (d: string) => new Date(d + 'T12:00:00').getDay() === 0;
  if (isDayOff(date)) return [];
  const profs = store.get().professionals;
  if (profId !== 'any') return getSlotsForProf(service, date, profId, allAppointments, availabilityBlocks, excludeAptId);
  const all = new Set<string>();
  profs.forEach(p => getSlotsForProf(service, date, p.id, allAppointments, availabilityBlocks, excludeAptId).forEach(s => all.add(s)));
  return [...all].sort();
}

export function resolveProf(
  service: Service, date: string, time: string,
  allAppointments: Appointment[], availabilityBlocks: AvailabilityBlock[],
): string {
  const profs = store.get().professionals;
  for (const prof of profs) {
    if (getSlotsForProf(service, date, prof.id, allAppointments, availabilityBlocks).includes(time)) return prof.id;
  }
  return profs[0].id;
}

export function findConflictingAppointments(
  block: AvailabilityBlock,
  appointments: Appointment[],
): Appointment[] {
  return appointments.filter(apt => {
    if (apt.professionalId !== block.professionalId) return false;
    if (apt.date !== block.date) return false;
    if (['cancelada', 'cancelada-tarde', 'completada', 'no-show'].includes(apt.status)) return false;
    if (block.type === 'full-day') return true;
    const svc = store.get().services.find(s => s.id === apt.serviceId);
    if (!svc) return false;
    const aptStart = timeToMin(apt.startTime);
    const aptEnd = aptStart + svc.duration;
    const bStart = timeToMin(block.startTime!);
    const bEnd = timeToMin(block.endTime!);
    return aptStart < bEnd && aptEnd > bStart;
  });
}
