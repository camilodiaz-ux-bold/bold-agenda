import { type ReactNode } from 'react';
import { CAL_START_H, CAL_END_H, HOUR_H, SLOT_H, CAL_H, TIME_COL_W, DAY_SLOTS, timeToPx } from '../lib/calendarMath';

interface Props {
  children?: ReactNode;
  onSlotTap?: (time: string) => void;
}

const HOURS = Array.from({ length: CAL_END_H - CAL_START_H + 1 }, (_, i) => CAL_START_H + i);

// Las líneas se implementan como background-image CSS en lugar de elementos DOM.
// Esto garantiza que SIEMPRE queden detrás de las cards, incluyendo sus esquinas
// redondeadas (que son transparentes y dejarían ver líneas DOM con z-index).
const GRID_BACKGROUND = [
  // Media hora — línea sutil al 50% de cada bloque horario
  `repeating-linear-gradient(to bottom,`,
  `  transparent 0px, transparent ${SLOT_H - 0.5}px,`,
  `  rgba(186,189,211,0.45) ${SLOT_H - 0.5}px, rgba(186,189,211,0.45) ${SLOT_H + 0.5}px,`,
  `  transparent ${SLOT_H + 0.5}px, transparent ${HOUR_H}px`,
  `),`,
  // Hora entera — línea más definida al inicio de cada bloque
  `repeating-linear-gradient(to bottom,`,
  `  rgba(186,189,211,0.85) 0px, rgba(186,189,211,0.85) 1px,`,
  `  transparent 1px, transparent ${HOUR_H}px`,
  `),`,
  // Fondo blanco base
  `#ffffff`,
].join(' ');

export function CalendarGrid({ children, onSlotTap }: Props) {
  return (
    // bg-white cubre también la columna de etiquetas (izq. de TIME_COL_W)
    <div className="relative w-full select-none bg-white" style={{ height: `${CAL_H}px` }}>

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

      {/* Zona de contenido: background-image con líneas + slot buttons + bloques posicionados */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: `${TIME_COL_W}px`,
          right: 0,
          backgroundImage: GRID_BACKGROUND,
        }}
      >

        {/* Slot buttons — z-index 0, reciben taps en espacios vacíos */}
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
