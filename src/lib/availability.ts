import type {
  Professional, Appointment, AvailabilityBlock, Service, WeeklySchedule, Weekday,
} from '../types';
import { timeToMin, minToTime, CAL_START_H, CAL_END_H } from './calendarMath';

const WEEKDAY_IDX: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SLOT_MIN = 30;

export function getWeekday(dateStr: string): Weekday {
  return WEEKDAY_IDX[new Date(dateStr + 'T12:00:00').getDay()];
}

export function getWorkingIntervals(
  schedule: WeeklySchedule,
  date: string,
): Array<{ start: number; end: number }> {
  const day = schedule[getWeekday(date)];
  if (!day.enabled || !day.intervals.length) return [];
  return day.intervals
    .map(iv => ({ start: timeToMin(iv.startTime), end: timeToMin(iv.endTime) }))
    .sort((a, b) => a.start - b.start);
}

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  mon: { enabled: true, intervals: [{ startTime: '08:00', endTime: '18:00' }] },
  tue: { enabled: true, intervals: [{ startTime: '08:00', endTime: '18:00' }] },
  wed: { enabled: true, intervals: [{ startTime: '08:00', endTime: '18:00' }] },
  thu: { enabled: true, intervals: [{ startTime: '08:00', endTime: '18:00' }] },
  fri: { enabled: true, intervals: [{ startTime: '08:00', endTime: '18:00' }] },
  sat: { enabled: false, intervals: [] },
  sun: { enabled: false, intervals: [] },
};

export interface BusyInterval {
  start: number;
  end: number;
  aptId: string;
  status: string;
}

export interface BlockInterval {
  start: number;
  end: number;
  blockId: string;
  reason?: string;
  fullDay: boolean;
}

export interface DayAvailability {
  working: Array<{ start: number; end: number }>;
  busy: BusyInterval[];
  blocked: BlockInterval[];
  free: Array<{ start: number; end: number }>;
  conflictAptIds: string[];
}

export function computeDayAvailability({
  professional,
  date,
  appointments,
  blocks,
  services,
}: {
  professional: Professional;
  date: string;
  appointments: Appointment[];
  blocks: AvailabilityBlock[];
  services: Service[];
}): DayAvailability {
  const working = getWorkingIntervals(professional.weeklySchedule, date);

  const profApts = appointments.filter(
    a => a.professionalId === professional.id && a.date === date
      && !['cancelada', 'cancelada-tarde'].includes(a.status)
  );
  const profBlocks = blocks.filter(
    b => b.professionalId === professional.id && b.date === date
  );

  const fullDayBlock = profBlocks.find(b => b.type === 'full-day');

  const busy: BusyInterval[] = profApts.map(a => {
    const svc = services.find(s => s.id === a.serviceId);
    const start = timeToMin(a.startTime);
    return { start, end: start + (svc?.duration ?? 60), aptId: a.id, status: a.status };
  });

  const blocked: BlockInterval[] = fullDayBlock
    ? [{ start: 0, end: 24 * 60, blockId: fullDayBlock.id, reason: fullDayBlock.reason, fullDay: true }]
    : profBlocks.filter(b => b.type === 'range').map(b => ({
        start: timeToMin(b.startTime!),
        end: timeToMin(b.endTime!),
        blockId: b.id,
        reason: b.reason,
        fullDay: false,
      }));

  // Active = not already finished or absent; these can conflict and block new slots
  const activeBusy = busy.filter(b => b.status !== 'completada' && b.status !== 'no-show');

  const conflictAptIds: string[] = [];
  activeBusy.forEach(b => {
    const fitsSomeInterval = working.some(w => b.start >= w.start && b.end <= w.end);
    if (!fitsSomeInterval) {
      conflictAptIds.push(b.aptId);
    }
  });

  let free: Array<{ start: number; end: number }> = working.map(w => ({ ...w }));

  for (const occ of [...activeBusy, ...blocked]) {
    free = free.flatMap(f => {
      if (occ.end <= f.start || occ.start >= f.end) return [f];
      const parts: Array<{ start: number; end: number }> = [];
      if (occ.start > f.start) parts.push({ start: f.start, end: occ.start });
      if (occ.end < f.end) parts.push({ start: occ.end, end: f.end });
      return parts;
    });
  }

  return { working, busy, blocked, free, conflictAptIds };
}

export function getSlotsFromSchedule({
  professional,
  date,
  service,
  appointments,
  blocks,
  services,
  excludeAptId,
}: {
  professional: Professional;
  date: string;
  service: Service;
  appointments: Appointment[];
  blocks: AvailabilityBlock[];
  services: Service[];
  excludeAptId?: string;
}): string[] {
  const filteredApts = excludeAptId
    ? appointments.filter(a => a.id !== excludeAptId)
    : appointments;

  const avail = computeDayAvailability({
    professional, date, appointments: filteredApts, blocks, services,
  });

  if (!avail.working.length) return [];

  // Clamp to visible calendar bounds so off-grid hours don't surface as slots
  const gridStart = CAL_START_H * 60;
  const gridEnd = CAL_END_H * 60;

  const slots = new Set<string>();
  for (const interval of avail.free) {
    const lo = Math.max(interval.start, gridStart);
    const hi = Math.min(interval.end, gridEnd);
    const start = Math.ceil(lo / SLOT_MIN) * SLOT_MIN;
    for (let m = start; m + service.duration <= hi; m += SLOT_MIN) {
      slots.add(minToTime(m));
    }
  }

  return [...slots].sort();
}
