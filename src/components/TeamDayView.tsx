import { useMemo, useRef, type CSSProperties } from 'react';
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

// Tratamiento visual para horas fuera del turno laboral.
// Patrón diagonal sutil — claramente deshabilitado, sin competir con citas ni bloqueos.
const OFFHOURS_BG: CSSProperties = {
  backgroundColor: 'rgba(18,30,108,0.025)',
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(18,30,108,0.06) 0px, rgba(18,30,108,0.06) 1px, transparent 1px, transparent 8px)',
  pointerEvents: 'none' as const,
};

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

  // Refs para sincronizar el header horizontal con el scroll del body
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);

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
  const totalColsW = dayData.length * COL_W;

  // Sincroniza el desplazamiento horizontal del header con el del body via transform (GPU).
  // No relayout: solo composite layer.
  function handleBodyScroll() {
    if (!bodyRef.current || !headerInnerRef.current) return;
    headerInnerRef.current.style.transform = `translateX(-${bodyRef.current.scrollLeft}px)`;
  }

  return (
    <div
      className="flex-1 min-h-0 bg-white"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >

      {/* ── Header row — sticky, siempre visible durante el scroll vertical ── */}
      {/* Separado del scroll body; posición horizontal sincronizada por JS.    */}
      <div style={{
        display: 'flex',
        flexShrink: 0,
        borderBottom: '1px solid #e8eaf0',
        backgroundColor: 'white',
        zIndex: 10,
      }}>
        {/* Esquina: espacio libre alineado con el eje horario */}
        <div style={{ width: TIME_COL_W, flexShrink: 0, height: HEADER_H }} />

        {/* Chips de profesionales — overflow hidden, se desplazan vía transform */}
        <div style={{ flex: 1, overflow: 'hidden', height: HEADER_H }}>
          <div
            ref={headerInnerRef}
            style={{ display: 'flex', minWidth: totalColsW, willChange: 'transform' }}
          >
            {dayData.map(({ prof }) => (
              <div
                key={prof.id}
                style={{
                  width: COL_W,
                  flexShrink: 0,
                  height: HEADER_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid #e8eaf0',
                  backgroundColor: 'white',
                }}
              >
                <span style={{
                  fontSize: 12, fontWeight: 600, color: '#1e1e1e',
                  backgroundColor: '#F1F2F6',
                  borderRadius: 100, padding: '3px 10px',
                }}>
                  {prof.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cuerpo con scroll — único contenedor de scroll (x e y) ─────────── */}
      {/* overflow-x + overflow-y en el mismo div evita la competencia de scrolls. */}
      {/* overscroll-behavior: contain impide que el scroll se propague a la página. */}
      <div
        ref={bodyRef}
        onScroll={handleBodyScroll}
        className="[&::-webkit-scrollbar]:hidden"
        style={{
          flex: 1,
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ display: 'flex', paddingBottom: 200, minWidth: TIME_COL_W + totalColsW }}>

          {/* Eje horario — sticky horizontal (se queda a la izquierda al hacer scroll h) */}
          <div style={{
            width: TIME_COL_W,
            flexShrink: 0,
            position: 'sticky',
            left: 0,
            zIndex: 5,
            backgroundColor: 'white',
          }}>
            <div style={{ position: 'relative', height: CAL_H }}>
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  style={{ position: 'absolute', top: i * HOUR_H, right: 0, width: TIME_COL_W, height: 0 }}
                >
                  <span style={{
                    position: 'absolute', right: 8, top: 0,
                    fontSize: 11, fontWeight: 600, color: '#606060',
                    lineHeight: 1, whiteSpace: 'nowrap',
                  }}>
                    {String(h).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Columnas de profesionales — sin headers (están en el row sticky de arriba) */}
          <div style={{ display: 'flex', minWidth: totalColsW }}>
            {dayData.map(({ prof, avail, profApts, profBlocks }) => {
              const working = avail.working;
              // Huecos fuera de horario: antes del primer bloque, entre bloques, y después del último.
              const offHoursGaps: Array<{ start: number; end: number }> = [];
              if (working.length > 0) {
                if (working[0].start > gridStart) {
                  offHoursGaps.push({ start: gridStart, end: working[0].start });
                }
                for (let i = 0; i < working.length - 1; i++) {
                  offHoursGaps.push({ start: working[i].end, end: working[i + 1].start });
                }
                const last = working[working.length - 1];
                if (last.end < gridEnd) {
                  offHoursGaps.push({ start: last.end, end: gridEnd });
                }
              }

              return (
                <div
                  key={prof.id}
                  style={{ width: COL_W, flexShrink: 0, borderLeft: '1px solid #e8eaf0' }}
                >
                  {/* Cuerpo del calendario */}
                  <div style={{ position: 'relative', height: CAL_H }}>

                    {/* Líneas de hora */}
                    {HOURS.map((h, i) => (
                      <div key={h} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: i * HOUR_H, height: 1,
                        backgroundColor: '#BABDD3', zIndex: 0, pointerEvents: 'none',
                      }} />
                    ))}
                    {/* Líneas de media hora */}
                    {HALF_HOURS.map(i => (
                      <div key={`hh-${i}`} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: i * HOUR_H + SLOT_H, height: 1,
                        backgroundColor: '#BABDD3', opacity: 0.35,
                        zIndex: 0, pointerEvents: 'none',
                      }} />
                    ))}

                    {/* Fuera de horario: no trabaja este día */}
                    {working.length === 0 && (
                      <div style={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        ...OFFHOURS_BG,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 10, color: '#b0b5c8', fontWeight: 500, textAlign: 'center', padding: '0 8px' }}>
                          No trabaja
                        </span>
                      </div>
                    )}

                    {/* Fuera de horario: antes del primer bloque, entre bloques, después del último */}
                    {offHoursGaps.map((gap, i) => (
                      <div key={i} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: timeToPx(minToTime(gap.start)),
                        height: timeToPx(minToTime(gap.end)) - timeToPx(minToTime(gap.start)),
                        zIndex: 1,
                        ...OFFHOURS_BG,
                      }} />
                    ))}

                    {/* Botones de slot — solo intervalos libres */}
                    {onSlotTap && avail.free.map((interval) => {
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

                    {/* Bloques de disponibilidad bloqueada */}
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

                    {/* Citas */}
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

                    {/* Línea de "ahora" */}
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
  );
}
