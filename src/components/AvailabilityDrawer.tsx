import { useState, useMemo } from 'react';
import { AlertTriangle, Check, CheckCircle2 } from 'lucide-react';
import type { Appointment, AvailabilityBlock, Professional, Role } from '../types';
import { findConflictingAppointments, PROTOTYPE_TODAY } from '../store/prototypeStore';
import { SERVICES } from '../data/appointments';

interface Props {
  professionals: Professional[];
  appointments: Appointment[];
  existingBlocks: AvailabilityBlock[];
  role: Role;
  currentProfId: string;
  onSave: (block: AvailabilityBlock) => void;
  onClose: () => void;
  onEditConflict: (apt: Appointment) => void;
}

const WEEKDAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const REASONS = ['Descanso', 'Cita médica', 'Capacitación', 'Asunto personal', 'Otro'];

function getNextDays(n: number): string[] {
  const days: string[] = [];
  const [y, m, d] = PROTOTYPE_TODAY.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  for (let i = 0; i < n; i++) {
    const nd = new Date(base);
    nd.setDate(base.getDate() + i);
    days.push(`${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`);
  }
  return days;
}

const TIME_OPTIONS: string[] = [];
for (let h = 8; h <= 19; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 19) TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`);
}

type AvailStep = 'form' | 'conflict' | 'done';

export function AvailabilityDrawer({
  professionals, appointments, role, currentProfId, onSave, onClose, onEditConflict,
}: Props) {
  const isAdmin = role === 'admin';
  const [step, setStep] = useState<AvailStep>('form');
  const [selProfId, setSelProfId] = useState(currentProfId);
  const [selDate, setSelDate] = useState('');
  const [blockType, setBlockType] = useState<'full-day' | 'range'>('full-day');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [conflicts, setConflicts] = useState<Appointment[]>([]);

  const days = useMemo(() => getNextDays(21), []);

  function buildBlock(): AvailabilityBlock {
    return {
      id: `b_${Date.now()}`,
      professionalId: selProfId,
      date: selDate,
      type: blockType,
      startTime: blockType === 'range' ? startTime : undefined,
      endTime: blockType === 'range' ? endTime : undefined,
      reason: reason || undefined,
    };
  }

  function handleSubmit() {
    const block = buildBlock();
    const found = findConflictingAppointments(block, appointments);
    if (found.length > 0) {
      setConflicts(found);
      setStep('conflict');
    } else {
      onSave(block);
      setStep('done');
    }
  }

  function handleConfirmWithConflict() {
    onSave(buildBlock());
    setStep('done');
  }

  const selProf = professionals.find(p => p.id === selProfId);

  if (step === 'done') {
    return (
      <div className="px-5 pb-8 pt-2 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
          <CheckCircle2 size={26} color="#15803D" strokeWidth={2} />
        </div>
        <div>
          <p className="text-base font-bold text-[#1e1e1e]">Bloqueo guardado</p>
          <p className="text-sm text-[#969696] mt-1">
            {selProf?.name.split(' ')[0]} · {selDate}
            {blockType === 'range' ? ` · ${startTime}–${endTime}` : ' · Día completo'}
          </p>
        </div>
        {conflicts.length > 0 && (
          <div className="w-full bg-[#FFFBEB] rounded-xl px-4 py-3 text-left">
            <p className="text-xs font-semibold text-[#B45309] mb-2">Citas afectadas — requieren reprogramación</p>
            {conflicts.map(apt => {
              const svc = SERVICES.find(s => s.id === apt.serviceId);
              return (
                <button key={apt.id} onClick={() => onEditConflict(apt)}
                  className="w-full flex items-center justify-between py-1.5 text-left active:opacity-70">
                  <span className="text-xs text-[#606060]">{apt.clientName} · {svc?.name} · {apt.startTime}</span>
                  <span className="text-xs font-semibold text-[#E8194B]">Editar</span>
                </button>
              );
            })}
          </div>
        )}
        <button onClick={onClose} className="w-full h-12 rounded-full font-bold text-sm text-white" style={{ backgroundColor: '#121e6c' }}>
          Listo
        </button>
      </div>
    );
  }

  if (step === 'conflict') {
    return (
      <div className="px-5 pb-8 flex flex-col gap-4">
        <div className="bg-[#FFFBEB] rounded-2xl px-4 py-3 flex gap-3">
          <AlertTriangle size={18} color="#B45309" strokeWidth={2} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#B45309]">Conflicto con citas existentes</p>
            <p className="text-xs text-[#606060] mt-1 leading-relaxed">
              Este bloqueo coincide con {conflicts.length} cita{conflicts.length > 1 ? 's' : ''} ya agendadas. Puedes guardar el bloqueo y reprogramar las citas después.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {conflicts.map(apt => {
            const svc = SERVICES.find(s => s.id === apt.serviceId);
            return (
              <div key={apt.id} className="px-4 py-3">
                <p className="text-sm font-semibold text-[#1e1e1e]">{apt.clientName}</p>
                <p className="text-xs text-[#969696] mt-0.5">{svc?.name} · {apt.startTime}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirmWithConflict}
          className="w-full h-12 rounded-full font-bold text-sm text-white"
          style={{ backgroundColor: '#E8194B' }}
        >
          Guardar bloqueo con conflicto conocido
        </button>
        <button onClick={() => setStep('form')} className="w-full h-10 text-sm font-semibold text-[#121e6c]">
          Volver y ajustar
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8 flex flex-col gap-4">
      {/* Professional (admin only) */}
      {isAdmin && (
        <div>
          <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Profesional</p>
          <div className="flex flex-col gap-1.5">
            {professionals.map(prof => {
              const isActive = prof.id === selProfId;
              return (
                <button
                  key={prof.id}
                  onClick={() => setSelProfId(prof.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all"
                  style={{ borderColor: isActive ? '#121e6c' : '#e8eaf0', backgroundColor: isActive ? '#f7f8fb' : '#fff' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isActive ? '#121e6c' : '#e8eaf0' }}>
                    <span className="text-xs font-bold" style={{ color: isActive ? '#fff' : '#606060' }}>{prof.initials}</span>
                  </div>
                  <span className="text-sm font-semibold flex-1 text-left" style={{ color: isActive ? '#121e6c' : '#1e1e1e' }}>{prof.name}</span>
                  {isActive && <Check size={14} color="#121e6c" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Block type */}
      <div>
        <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Tipo de bloqueo</p>
        <div className="flex gap-2">
          {(['full-day', 'range'] as const).map(t => {
            const isActive = t === blockType;
            return (
              <button
                key={t}
                onClick={() => setBlockType(t)}
                className="flex-1 h-10 rounded-full text-xs font-semibold border-2 transition-all"
                style={{ backgroundColor: isActive ? '#121e6c' : '#fff', color: isActive ? '#fff' : '#606060', borderColor: isActive ? '#121e6c' : '#d2d4e1' }}
              >
                {t === 'full-day' ? 'Día completo' : 'Rango de horas'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date strip */}
      <div>
        <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Fecha</p>
        <div className="overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-2 w-max pb-1">
            {days.map(dateStr => {
              const d = new Date(dateStr + 'T12:00:00');
              const isSelected = dateStr === selDate;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelDate(dateStr)}
                  className="flex flex-col items-center gap-1 py-2 w-11 rounded-2xl border-2 transition-all"
                  style={{ backgroundColor: isSelected ? '#121e6c' : '#fff', borderColor: isSelected ? '#121e6c' : '#e8eaf0' }}
                >
                  <span className="text-[10px] font-semibold" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#969696' }}>
                    {WEEKDAY_SHORT[d.getDay()]}
                  </span>
                  <span className="text-sm font-bold" style={{ color: isSelected ? '#fff' : '#121e6c' }}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time range */}
      {blockType === 'range' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-1.5">Desde</p>
            <select
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#d2d4e1] px-2 text-sm text-[#1e1e1e] bg-white outline-none"
            >
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-1.5">Hasta</p>
            <select
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#d2d4e1] px-2 text-sm text-[#1e1e1e] bg-white outline-none"
            >
              {TIME_OPTIONS.filter(t => t > startTime).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Reason */}
      <div>
        <p className="text-xs font-semibold text-[#b0b5c8] uppercase tracking-widest mb-2">Motivo (interno, opcional)</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {REASONS.map(r => {
            const isActive = reason === r;
            return (
              <button
                key={r}
                onClick={() => setReason(isActive ? '' : r)}
                className="rounded-full px-3 h-8 text-xs font-semibold border transition-all"
                style={{ backgroundColor: isActive ? '#121e6c' : '#fff', color: isActive ? '#fff' : '#606060', borderColor: isActive ? '#121e6c' : '#d2d4e1' }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selDate || !selProfId}
        className="w-full h-12 rounded-full font-bold text-sm text-white transition-all active:scale-[0.98] disabled:opacity-40"
        style={{ backgroundColor: '#E8194B' }}
      >
        Guardar bloqueo
      </button>
    </div>
  );
}
