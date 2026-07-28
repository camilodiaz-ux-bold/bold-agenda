// Single source of truth for all calendar geometry.

export const CAL_START_H = 8;           // primera hora visible (08:00)
export const CAL_END_H = 20;            // última hora visible (20:00, exclusiva)
export const SLOT_MIN = 30;             // intervalo base en minutos
export const PX_PER_MIN = 102 / 60;    // 1.7 px/min — de bloques Figma calendar-card
export const HOUR_H = PX_PER_MIN * 60; // 102px por hora
export const SLOT_H = PX_PER_MIN * SLOT_MIN; // 51px por slot de 30 min
export const CAL_H = (CAL_END_H - CAL_START_H) * HOUR_H; // 1224px total
export const TIME_COL_W = 52;          // ancho columna izquierda (etiquetas de hora)
export const CARD_INSET = 2;           // px de separación entre línea y borde superior de card
export const CARD_TRAIL = 2;           // px de separación entre borde inferior de card y línea siguiente
export const CARD_MIN_H = 46;          // altura mínima de cualquier card

// ─── Conversión de tiempo ─────────────────────────────────────────────────────

export function timeToMin(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minToTime(totalMin: number): string {
  const c = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMin)));
  return `${String(Math.floor(c / 60)).padStart(2, '0')}:${String(c % 60).padStart(2, '0')}`;
}

/** HH:MM → px desde el borde superior del grid */
export function timeToPx(time: string): number {
  const offsetMin = timeToMin(time) - CAL_START_H * 60;
  return Math.round(Math.max(0, offsetMin) * PX_PER_MIN);
}

/** Duración en minutos → píxeles */
export function durationToPx(minutes: number): number {
  return Math.round(minutes * PX_PER_MIN);
}

/** Top de una card incluyendo el inset bajo la línea de hora */
export function cardTop(startTime: string): number {
  return timeToPx(startTime) + CARD_INSET;
}

/** Altura proporcional de una card (con mínimo) */
export function cardHeight(durationMin: number): number {
  return Math.max(CARD_MIN_H, durationToPx(durationMin) - CARD_INSET - CARD_TRAIL);
}

// ─── Slots disponibles ────────────────────────────────────────────────────────

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

/**
 * Asigna columnas a eventos que se solapan para renderizarlos en paralelo.
 * Eventos sin solapamiento reciben column=0, totalColumns=1.
 */
export function layoutEvents(events: CalEvent[]): Map<string, LayoutCol> {
  const result = new Map<string, LayoutCol>();
  if (!events.length) return result;

  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);

  // Agrupar eventos que se solapan entre sí
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
    // Asignación greedy de columnas
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
