import { useMemo } from 'react';
import {
  CAL_START_H, CAL_END_H, HOUR_H, CAL_H, TIME_COL_W,
  timeToPx, durationToPx, cardTop, cardHeight, CARD_MIN_H,
  timeToMin, minToTime, SLOT_H,
} from '../lib/calendarMath';
import { computeDayAvailability } from '../lib/availability';
import { AppointmentBlock } from './AppointmentBlock';
import { BlockedTimeBlock } from './BlockedTimeBlock';
import { store } from '../store/prototypeStore';
import type { Appointment, AvailabilityBlock } from '../types';

const COL_W = 240;
const HEADER_H = 36;
const SLOT_MIN = 30;
const HOURS = Array.from({ length: CAL_END_H - CAL_START_H + 1 }, (_, i) => CAL_START_H + i);
const HALF_HOURS = Array.from({ length: CAL_END_H - CAL_START_H }, (_, i) => i);

interface Props {
  date: string;
  appointments: Appointment[];
  availabilityBlocks: AvailabilityBlock[];
  isToday: boolean;
  nowPx: number;
  onSlotTap?: (date: string, time: string, professionalId: string) => void;
  onAptTap: (apt: Appointment) => void;
  onBlockTap?: () => void;
}

export function TeamDayView({
  date, appointments, availabilityBlocks, isToday, nowPx,
  onSlotTap, onAptTap, onBlockTap,
}: Props) {
  const { professionals, services } = store.get();

  const dayData = useMemo(() => professionals.map(prof => {
    const avail = computeDayAvailability({
      professional: prof, date,
      appointments, blocks: availabilityBlocks, services,
    });
    const profApts = appointments.filter(
      a => a.professionalId === prof.id && a.date === date
        && !['cancelada', 'cancelada-tarde'].includes(a.status)
    );
    const profBlocks = availabilityBlocks.filter(
      b => b.professionalId === prof.id && b.date === date
    );
    return { prof, avail, profApts, profBlocks };
  }), [date, appointments, availabilityBlocks]);

  const gridStart = CAL_START_H * 60;
  const gridEnd = CAL_END_H * 60;

  return (
    <div className="flex-1 min-h-0 bg-white" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', paddingBottom: 200 }}>

          {/* Time axis — always visible, aligned with column bodies */}
          <div style={{ width: TIME_COL_W, flexShrink: 0, position: 'relative' }}>
            {/* Spacer matching the column header height */}
            <div style={{ height: HEADER_H }} />
            {/* Hour labels, matching CalendarGrid positioning */}
            <div style={{ position: 'relative', height: CAL_H }}>
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  style={{ position: 'absolute', top: i * HOUR_H, right: 0, width: TIME_COL_W, height: 0 }}
                >
                  <span
                    style={{
                      position: 'absolute', right: 8, top: 0,
                      fontSize: 11, fontWeight: 600, color: '#606060',
                      lineHeight: 1, whiteSpace: 'nowrap',
                    }}
                  >
                    {String(h).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional columns (horizontal scroll) */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ display: 'flex', minWidth: dayData.length * COL_W }}>

              {dayData.map(({ prof, avail, profApts, profBlocks }) => {
                const workStart = avail.working?.start ?? null;
                const workEnd = avail.working?.end ?? null;

                return (
                  <div
                    key={prof.id}
                    style={{ width: COL_W, flexShrink: 0, borderLeft: '1px solid #e8eaf0' }}
                  >
                    {/* Column header */}
                    <div style={{
                      height: HEADER_H,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderBottom: '1px solid #e8eaf0',
                      backgroundColor: 'white',
                      position: 'sticky', top: 0, zIndex: 5,
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, color: '#1e1e1e',
                        backgroundColor: '#F1F2F6',
                        borderRadius: 100, padding: '3px 10px',
                        letterSpacing: 0,
                      }}>
                        {prof.name.split(' ')[0]}
                      </span>
                    </div>

                    {/* Calendar body */}
                    <div style={{ position: 'relative', height: CAL_H }}>

                      {/* Hour lines */}
                      {HOURS.map((h, i) => (
                        <div key={h} style={{
                          position: 'absolute', left: 0, right: 0,
                          top: i * HOUR_H, height: 1,
                          backgroundColor: '#BABDD3', zIndex: 0, pointerEvents: 'none',
                        }} />
                      ))}
                      {/* Half-hour lines */}
                      {HALF_HOURS.map(i => (
                        <div key={`hh-${i}`} style={{
                          position: 'absolute', left: 0, right: 0,
                          top: i * HOUR_H + SLOT_H, height: 1,
                          backgroundColor: '#BABDD3', opacity: 0.35,
                          zIndex: 0, pointerEvents: 'none',
                        }} />
                      ))}

                      {/* Non-working: doesn't work this day */}
                      {!avail.working && (
                        <div style={{
                          position: 'absolute', inset: 0, zIndex: 1,
                          backgroundColor: 'rgba(18,30,108,0.04)', pointerEvents: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: 10, color: '#b0b5c8', fontWeight: 500, textAlign: 'center', padding: '0 8px' }}>
                            No trabaja
                          </span>
                        </div>
                      )}

                      {/* Non-working: before schedule start */}
                      {workStart !== null && workStart > gridStart && (
                        <div style={{
                          position: 'absolute', left: 0, right: 0, top: 0,
                          height: timeToPx(minToTime(workStart)),
                          backgroundColor: 'rgba(18,30,108,0.04)',
                          zIndex: 1, pointerEvents: 'none',
                        }} />
                      )}

                      {/* Non-working: after schedule end */}
                      {workEnd !== null && workEnd < gridEnd && (
                        <div style={{
                          position: 'absolute', left: 0, right: 0,
                          top: timeToPx(minToTime(workEnd)),
                          height: CAL_H - timeToPx(minToTime(workEnd)),
                          backgroundColor: 'rgba(18,30,108,0.04)',
                          zIndex: 1, pointerEvents: 'none',
                        }} />
                      )}

                      {/* Slot tap buttons — free intervals only */}
                      {onSlotTap && avail.free.map((interval, _fi) => {
                        const lo = Math.max(interval.start, gridStart);
                        const hi = Math.min(interval.end, gridEnd);
                        const start = Math.ceil(lo / SLOT_MIN) * SLOT_MIN;
                        const buttons = [];
                        for (let m = start; m + SLOT_MIN <= hi; m += SLOT_MIN) {
                          const t = minToTime(m);
                          buttons.push(
                            <button
                              key={t}
                              style={{
                                position: 'absolute', left: 0, right: 0,
                                top: timeToPx(t), height: SLOT_H,
                                zIndex: 2,
                              }}
                              className="transition-colors active:bg-[rgba(18,30,108,0.04)]"
                              onClick={() => onSlotTap!(date, t, prof.id)}
                              aria-label={`Nueva cita a las ${t} con ${prof.name.split(' ')[0]}`}
                            />
                          );
                        }
                        return buttons;
                      })}

                      {/* Availability blocks */}
                      {profBlocks.map(block => {
                        const top = block.type === 'full-day'
                          ? 0
                          : timeToPx(block.startTime ?? '08:00');
                        const h = block.type === 'full-day'
                          ? (CAL_END_H - CAL_START_H) * HOUR_H
                          : Math.max(CARD_MIN_H, durationToPx(
                              timeToMin(block.endTime ?? '20:00') - timeToMin(block.startTime ?? '08:00')
                            ));
                        return (
                          <BlockedTimeBlock
                            key={block.id}
                            block={block}
                            topPx={top}
                            heightPx={h}
                            onClick={onBlockTap}
                          />
                        );
                      })}

                      {/* Appointments */}
                      {profApts.map(apt => {
                        const svc = services.find(s => s.id === apt.serviceId);
                        if (!svc) return null;
                        return (
                          <AppointmentBlock
                            key={apt.id}
                            appointment={apt}
                            service={svc}
                            topPx={cardTop(apt.startTime)}
                            heightPx={cardHeight(svc.duration)}
                            column={0}
                            totalColumns={1}
                            row3Label={svc.name}
                            onTap={() => onAptTap(apt)}
                          />
                        );
                      })}

                      {/* Now line */}
                      {isToday && nowPx > 0 && (
                        <div style={{
                          position: 'absolute', left: 0, right: 0,
                          top: nowPx, zIndex: 10, pointerEvents: 'none',
                          display: 'flex', alignItems: 'center',
                        }}>
                          <div style={{ flex: 1, height: 1, backgroundColor: '#FF2947', opacity: 0.6 }} />
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
