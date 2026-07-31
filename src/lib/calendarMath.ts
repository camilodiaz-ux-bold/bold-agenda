// Single source of truth — geometría del calendario.
// Fórmula canónica:
//   top    = (startMin - CAL_START_MIN) * PX_PER_MIN  → timeToPx(startTime)
//   height = durationMin * PX_PER_MIN                 → durationToPx(durationMin)
// No hay inset ni padding extra en el posicionamiento. Las cards empiezan exactamente
// en la línea de inicio y terminan exactamente en la línea de fin.

export const CAL_START_H = 8;
export const CAL_END_H   = 20;
export const SLOT_MIN    = 30;

// 102px/h validado contra Figma (card de 60 min tiene h=[102px])
export const PX_PER_MIN  = 102 / 60;              // 1.7 px/min
export const HOUR_H      = PX_PER_MIN * 60;       // 102px por hora
export const SLOT_H      = PX_PER_MIN * SLOT_MIN; // 51px por slot de 30 min
export const CAL_H       = (CAL_END_H - CAL_START_H) * HOUR_H; // 1224px total
export const TIME_COL_W  = 48;                    // ancho columna de etiquetas (Figma)

// Altura mínima de card = slot mínimo (30 min = 51px).
// No se infla artificialmente: deja las cards del tamaño exacto de su duración.
export const CARD_MIN_H = Math.round(SLOT_MIN * PX_PER_MIN); // 51

// ─── Tiempo ────────────────────────────────────────────────────────────────────

export function timeToMin(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minToTime(totalMin: number): string {
  const c = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMin)));
  return `${String(Math.floor(c / 60)).padStart(2, '0')}:${String(c % 60).padStart(2, '0')}`;
}

/** HH:MM → px desde el borde superior del grid. */
export function timeToPx(time: string): number {
  const offsetMin = timeToMin(time) - CAL_START_H * 60;
  return Math.round(Math.max(0, offsetMin) * PX_PER_MIN);
}

/** Duración en minutos → px. */
export function durationToPx(minutes: number): number {
  return Math.round(minutes * PX_PER_MIN);
}

/** Top de una card = exactamente la línea de inicio (sin inset). */
export function cardTop(startTime: string): number {
  return timeToPx(startTime);
}

/**
 * Altura de una card.
 * Para el prototipo, el mínimo es un slot de 30 min (51 px).
 * Para duraciones ≥ 30 min, height = durationToPx(duration) — geometría pura.
 */
export function cardHeight(durationMin: number): number {
  return Math.max(CARD_MIN_H, durationToPx(durationMin));
}

// ─── Slots ─────────────────────────────────────────────────────────────────────

export function getDaySlots(): string[] {
  const slots: string[] = [];
  for (let min = CAL_START_H * 60; min < CAL_END_H * 60; min += SLOT_MIN) {
    slots.push(minToTime(min));
  }
  return slots;
}

export const DAY_SLOTS = getDaySlots();

// ─── Layout de solapamientos ──────────────────────────────────────────────────

export interface CalEvent {
  id: string;
  startMin: number;
  endMin: number;
}

export interface LayoutCol {
  column: number;
  totalColumns: number;
}

export function layoutEvents(events: CalEvent[]): Map<string, LayoutCol> {
  const result = new Map<string, LayoutCol>();
  if (!events.length) return result;

  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);

  const groups: CalEvent[][] = [];
  let current: CalEvent[] = [];
  let maxEnd = -Infinity;

  for (const evt of sorted) {
    if (!current.length || evt.startMin < maxEnd) {
      current.push(evt);
      maxEnd = Math.max(maxEnd, evt.endMin);
    } else {
      groups.push(current);
      current = [evt];
      maxEnd = evt.endMin;
    }
  }
  if (current.length) groups.push(current);

  for (const group of groups) {
    const colEnds: number[] = [];
    const assignments: number[] = [];

    for (const evt of group) {
      const freeCol = colEnds.findIndex(end => end <= evt.startMin);
      const col = freeCol === -1 ? colEnds.length : freeCol;
      colEnds[col] = evt.endMin;
      assignments.push(col);
    }

    const total = colEnds.length;
    group.forEach((evt, i) => result.set(evt.id, { column: assignments[i], totalColumns: total }));
  }

  return result;
}
