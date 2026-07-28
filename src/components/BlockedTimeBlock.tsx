import { AlertTriangle } from 'lucide-react';
import type { AvailabilityBlock, Professional } from '../types';

interface Props {
  block: AvailabilityBlock;
  professional: Professional;
  topPx: number;
  heightPx: number;
  onClick?: () => void;
}

/**
 * Blocked time block — positioned absolutely within a CalendarGrid content zone.
 * Figma: bg #FFF3D1 (warning/10), title "Espacio bloqueado" in #5B3100.
 */
export function BlockedTimeBlock({ block, professional, topPx, heightPx, onClick }: Props) {
  const startTime = block.type === 'full-day' ? '08:00' : (block.startTime ?? '08:00');
  const endTime   = block.type === 'full-day' ? '20:00' : (block.endTime ?? '20:00');
  const isCompact = heightPx < 70;

  return (
    <button
      onClick={onClick}
      className="absolute left-0 right-0 rounded-[16px] overflow-hidden text-left active:opacity-80 transition-opacity"
      style={{ top: `${topPx}px`, height: `${heightPx}px`, backgroundColor: '#FFF3D1', zIndex: 1 }}
    >
      <div
        className={`flex gap-[12px] h-full ${isCompact ? 'items-center px-[12px] py-[4px]' : 'items-start p-[12px]'}`}
      >
        <AlertTriangle size={24} color="#F59E0B" strokeWidth={2} className="shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
          {/* Fila 1 — título + tag profesional */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex-1 min-w-0 text-[12px] font-semibold leading-[16px] truncate" style={{ color: '#5B3100' }}>
              Espacio bloqueado
            </span>
            <div
              className="shrink-0 inline-flex items-center rounded-[100px] px-[12px]"
              style={{ height: '25px', backgroundColor: '#F7F8FB' }}
            >
              <span className="text-[12px] font-medium leading-[16px]" style={{ color: '#3E4983' }}>
                {professional.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Fila 2 — rango horario (solo modo completo) */}
          {!isCompact && (
            <span className="text-[12px] font-medium leading-[16px] whitespace-nowrap" style={{ color: '#5B3100' }}>
              {startTime} - {endTime}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
