import type { AvailabilityBlock } from '../types';

interface Props {
  block: AvailabilityBlock;
  topPx: number;
  heightPx: number;
  onClick?: () => void;
}

export function BlockedTimeBlock({ block, topPx, heightPx, onClick }: Props) {
  const startTime = block.type === 'full-day' ? '08:00' : (block.startTime ?? '08:00');
  const endTime   = block.type === 'full-day' ? '20:00' : (block.endTime ?? '20:00');
  const isCompact = heightPx <= 60;

  return (
    <button
      onClick={onClick}
      className="absolute left-0 right-0 rounded-[16px] overflow-hidden text-left active:opacity-80 transition-opacity"
      style={{ top: `${topPx}px`, height: `${heightPx}px`, backgroundColor: '#FFF3D1', zIndex: 1 }}
    >
      <div
        className="flex flex-col h-full justify-end p-[12px]"
        style={{ padding: isCompact ? '4px 12px' : '12px' }}
      >
        <span className="text-[14px] font-medium leading-[20px] truncate" style={{ color: '#1E1E1E' }}>
          Agenda bloqueada
        </span>
        {!isCompact && (
          <span className="text-[12px] font-medium leading-[16px] whitespace-nowrap" style={{ color: '#1E1E1E' }}>
            {startTime} – {endTime}
          </span>
        )}
      </div>
    </button>
  );
}
