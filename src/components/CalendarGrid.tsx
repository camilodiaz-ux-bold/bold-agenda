import { type ReactNode } from 'react';
import { CAL_START_H, CAL_END_H, HOUR_H, SLOT_H, CAL_H, TIME_COL_W, DAY_SLOTS, timeToPx } from '../lib/calendarMath';

interface Props {
  children?: ReactNode;
  onSlotTap?: (time: string) => void;
}

const HOURS = Array.from({ length: CAL_END_H - CAL_START_H + 1 }, (_, i) => CAL_START_H + i);
const HALF_HOUR_INDICES = Array.from({ length: CAL_END_H - CAL_START_H }, (_, i) => i);

export function CalendarGrid({ children, onSlotTap }: Props) {
  return (
    <div className="relative w-full select-none" style={{ height: `${CAL_H}px` }}>

      {/* Etiquetas de hora — top-aligned a la línea (Figma: 14px Semibold #606060) */}
      {HOURS.map((h, i) => (
        <div
          key={h}
          className="absolute"
          style={{ top: `${i * HOUR_H}px`, left: 0, width: `${TIME_COL_W}px`, height: 0 }}
        >
          <span
            className="absolute right-0 pr-[8px] text-[14px] font-semibold leading-none whitespace-nowrap pointer-events-none"
            style={{ color: '#606060', top: 0 }}
          >
            {String(h).padStart(2, '0')}:00
          </span>
        </div>
      ))}

      {/* Zona de contenido: líneas + botones de slot + bloques posicionados */}
      <div className="absolute top-0 bottom-0" style={{ left: `${TIME_COL_W}px`, right: 0 }}>

        {/* Líneas de hora — z-index 0, DETRÁS de las cards (cards en z-index 2) */}
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: `${i * HOUR_H}px`, backgroundColor: '#BABDD3', zIndex: 0 }}
          />
        ))}

        {/* Líneas de media hora — más sutiles, también detrás de las cards */}
        {HALF_HOUR_INDICES.map(i => (
          <div
            key={`hh-${i}`}
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: `${i * HOUR_H + SLOT_H}px`, backgroundColor: '#BABDD3', opacity: 0.35, zIndex: 0 }}
          />
        ))}

        {/* Botones de slot vacío — z-index 0, atrás de los bloques */}
        {onSlotTap && DAY_SLOTS.map(slot => (
          <button
            key={slot}
            className="absolute left-0 right-0 transition-colors active:bg-[rgba(18,30,108,0.04)]"
            style={{ top: `${timeToPx(slot)}px`, height: `${SLOT_H}px`, zIndex: 0 }}
            onClick={() => onSlotTap(slot)}
            aria-label={`Nueva cita a las ${slot}`}
          />
        ))}

        {/* Bloques posicionados: AppointmentBlock, BlockedTimeBlock, indicador NOW */}
        {children}
      </div>
    </div>
  );
}
