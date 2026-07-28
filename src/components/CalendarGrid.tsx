import { type ReactNode } from 'react';

export const HOUR_HEIGHT = 102;       // px per hour — from Figma calendar-card blocks
export const TIME_COL = 48;           // px — matches Figma w-[48px] time column
export const CAL_START = 8;           // 08:00
export const CAL_END = 20;            // 20:00
export const PX_PER_MIN = HOUR_HEIGHT / 60;
export const CARD_INSET = 10;         // px gap below hour separator before card starts
export const CARD_MIN_H = 55;         // minimum card height (Figma compact card)

/** Convert HH:MM to px from top of calendar grid */
export function timeToPx(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return Math.round(((h - CAL_START) * 60 + m) * PX_PER_MIN);
}

/** Duration in minutes → pixels */
export function durationToPx(minutes: number): number {
  return Math.round(minutes * PX_PER_MIN);
}

/** Card top px (with inset below separator) */
export function cardTop(startTime: string): number {
  return timeToPx(startTime) + CARD_INSET;
}

/** Card height in px (proportional, with minimum) */
export function cardHeight(durationMin: number): number {
  return Math.max(CARD_MIN_H, durationToPx(durationMin) - CARD_INSET);
}

interface Props {
  /** Positioned blocks (AppointmentBlock, BlockedTimeBlock, now indicator) */
  children?: ReactNode;
}

export function CalendarGrid({ children }: Props) {
  const hourCount = CAL_END - CAL_START;
  const totalH = hourCount * HOUR_HEIGHT;

  return (
    <div className="relative w-full" style={{ height: `${totalH}px` }}>

      {/* Hour labels */}
      {Array.from({ length: hourCount + 1 }, (_, i) => {
        const h = CAL_START + i;
        return (
          <span
            key={h}
            className="absolute text-[14px] font-semibold leading-[20px]"
            style={{ top: `${i * HOUR_HEIGHT}px`, left: 0, width: `${TIME_COL}px`, color: '#606060' }}
          >
            {String(h).padStart(2, '0')}:00
          </span>
        );
      })}

      {/* Content zone: separator lines + positioned children */}
      <div className="absolute top-0 bottom-0" style={{ left: `${TIME_COL}px`, right: 0 }}>

        {/* Hour separator lines */}
        {Array.from({ length: hourCount + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${i * HOUR_HEIGHT}px`, backgroundColor: '#babdd3' }}
          />
        ))}

        {/* Blocks (absolutely positioned by consumers) */}
        {children}
      </div>
    </div>
  );
}
