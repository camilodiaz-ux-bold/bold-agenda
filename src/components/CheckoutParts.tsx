import { useState, type ReactNode } from 'react';
import { Check, CheckCircle2, UserPlus, X, Search, ChevronRight, Loader2, ChevronDown } from 'lucide-react';
import type { SaleLineItem, Client, Service, Professional } from '../types';
import { formatCOP } from '../data/appointments';

// Tokens compartidos con Detalle de la cita (mismo lenguaje full-screen).
export const SECTION_LABEL = 'text-[12px] font-normal text-[#606060] leading-4';
export const FIELD_LABEL = 'text-[12px] font-bold text-[#121e6c] leading-4';
export const FIELD_VALUE = 'text-[14px] text-[#1e1e1e] leading-5';

export function Divider() {
  return <div className="h-px bg-gray-200 w-full" />;
}

export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>{label}</p>
      {children}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl p-4 flex flex-col gap-4 ${className}`}>{children}</div>;
}

// ── Campos y botones (frame Figma 29725:6812) ──────────────────────────────
/** Campo de formulario: label 14 semibold + caja blanca 40px radio 12. Con onClick es un selector (chevron). */
export function Field({ label, value, placeholder, onClick }: {
  label: string; value?: string; placeholder?: string; onClick?: () => void;
}) {
  const content = (
    <>
      <span className={`flex-1 min-w-0 text-left truncate text-[14px] leading-5 font-medium ${value ? 'text-[#1e1e1e]' : 'italic text-[#b0b5c8] font-normal'}`}>
        {value || placeholder}
      </span>
      {onClick && <ChevronDown size={24} color="#121e6c" strokeWidth={2} className="shrink-0" />}
    </>
  );
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[14px] leading-5 font-semibold text-[#121e6c]">{label}</span>
      {onClick ? (
        <button onClick={onClick} className="h-10 bg-white rounded-xl px-3 py-2 flex items-center gap-3 active:opacity-70">{content}</button>
      ) : (
        <div className="h-10 bg-white rounded-xl px-3 py-2 flex items-center gap-3">{content}</div>
      )}
    </div>
  );
}

/** Botón de segundo nivel dentro del contenido (Figma "APP Button / Action"). */
export function ActionButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-xl px-4 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#121e6c] active:opacity-70 transition-opacity disabled:opacity-40"
      style={{ backgroundColor: '#F1F2F6' }}
    >
      {children}
    </button>
  );
}

/** CTA de la barra inferior (coral, píldora, 48px). */
export function PrimaryButton({ children, onClick, disabled, loading }: {
  children: ReactNode; onClick: () => void; disabled?: boolean; loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-12 rounded-full px-4 flex items-center justify-center gap-2 font-bold text-[14px] leading-5 text-white whitespace-nowrap transition-all active:scale-[0.98] disabled:opacity-40"
      style={{ backgroundColor: '#FF2947' }}
    >
      {loading && <Loader2 size={16} color="white" className="animate-spin" />}
      {children}
    </button>
  );
}

// ── Línea de servicio (Figma "APP Card / Ecommerce") ────────────────────────
export function ServiceLine({ item, detail, onRemove }: {
  item: SaleLineItem; detail?: string; onRemove?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 text-[14px] leading-5 text-[#1e1e1e]">
          <span className="truncate">{item.serviceName}{detail ? ` · ${detail}` : ''}</span>
          <span className="font-bold shrink-0">x1</span>
        </div>
        <span className="text-[14px] leading-5 font-medium text-[#1e1e1e] tabular-nums shrink-0">{formatCOP(item.price)}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            aria-label={`Quitar ${item.serviceName}`}
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-opacity active:opacity-60"
            style={{ backgroundColor: '#FFF1F2' }}
          >
            <X size={12} color="#BE123C" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <p className="text-[12px] leading-4 text-[#606060]">
        {item.origin === 'agendado' ? 'Agendado' : 'Agregado en la sesión'}
        {item.prepaid ? ' · Prepagado' : ''}
      </p>
    </div>
  );
}

// ── Totales ─────────────────────────────────────────────────────────────────
export function TotalsSummary({ total, prepaid, balance }: { total: number; prepaid: number; balance: number }) {
  const row = (label: string, value: string, color = '#1e1e1e') => (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] text-[#606060]">{label}</span>
      <span className="text-[14px] font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
  return (
    <Card className="gap-3">
      {row('Total', formatCOP(total))}
      {prepaid > 0 && row('Prepagado', `-${formatCOP(prepaid)}`, '#15803D')}
      <Divider />
      <div className="flex items-center justify-between gap-3">
        <span className={FIELD_LABEL}>Saldo por cobrar</span>
        <span className="text-[16px] font-bold tabular-nums" style={{ color: '#121e6c' }}>{formatCOP(balance)}</span>
      </div>
    </Card>
  );
}

// ── Pantalla de estado (procesando, pendiente, no aprobado, error, éxito…) ───
const TONES = {
  success: { bg: '#F0FDF4', fg: '#15803D' },
  warning: { bg: '#FFF8EB', fg: '#B45309' },
  danger: { bg: '#FFF1F2', fg: '#BE123C' },
  neutral: { bg: '#E8EAF3', fg: '#121e6c' },
} as const;

export function CheckoutStatusScreen({ tone, icon, title, description, note, checklist }: {
  tone: keyof typeof TONES;
  icon: ReactNode;
  title: string;
  description?: string;
  note?: string;
  checklist?: string[];
}) {
  const t = TONES[tone];
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-6 text-center pb-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: t.bg, color: t.fg }}>
        {icon}
      </div>
      <div className="flex flex-col gap-2 px-4">
        <p className="text-[18px] font-bold text-[#121e6c] leading-6">{title}</p>
        {description && <p className="text-[14px] text-[#1e1e1e] leading-5">{description}</p>}
        {note && <p className="text-[12px] leading-4" style={{ color: '#6C759F' }}>{note}</p>}
      </div>
      {checklist && checklist.length > 0 && (
        <Card className="w-full gap-3 text-left">
          {checklist.map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 size={14} color="#15803D" strokeWidth={2.5} className="mt-0.5 shrink-0" />
              <span className="text-[14px] text-[#606060] leading-5">{text}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── Selector / creación de cliente ──────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2 h-11 rounded-2xl bg-white px-4">
      <Search size={15} color="#969696" strokeWidth={2} />
      <input
        autoFocus
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14px] text-[#1e1e1e] outline-none placeholder-[#b0b5c8]"
      />
      {value && <button onClick={() => onChange('')} aria-label="Limpiar"><X size={14} color="#969696" strokeWidth={2} /></button>}
    </div>
  );
}

export function ClientPicker({ clients, onSelect, onClear }: {
  clients: Client[];
  onSelect: (c: Client, isNew: boolean) => void;
  /** Si hay un cliente elegido en el cierre, permite quitarlo. */
  onClear?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', cedula: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const q = query.trim().toLowerCase();
  const filtered = q
    ? clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.cedula.includes(q))
    : clients;

  function create() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';
    if (!form.cedula.trim()) e.cedula = 'Requerido';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSelect({
      id: `c_${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      cedula: form.cedula.trim(),
      email: form.email.trim() || undefined,
      totalSpent: 0,
      visitCount: 0,
    }, true);
  }

  if (creating) {
    return (
      <Section label="Nuevo cliente">
        <Card>
          {([
            { key: 'name', label: 'Nombre completo', type: 'text' },
            { key: 'phone', label: 'Teléfono', type: 'tel' },
            { key: 'cedula', label: 'Número de identificación', type: 'text' },
            { key: 'email', label: 'Email (opcional)', type: 'email' },
          ] as const).map(({ key, label, type }) => (
            <div key={key} className="flex flex-col gap-2">
              <label className={FIELD_LABEL}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="h-10 rounded-xl border px-3 text-[14px] text-[#1e1e1e] outline-none"
                style={{ borderColor: errors[key] ? '#BE123C' : '#d2d4e1' }}
              />
              {errors[key] && <span className="text-[12px] text-[#BE123C]">{errors[key]}</span>}
            </div>
          ))}
          <PrimaryButton onClick={create}>Guardar y asociar</PrimaryButton>
          <button onClick={() => setCreating(false)} className="text-[14px] font-bold text-[#121e6c] active:opacity-60">
            Volver a la búsqueda
          </button>
        </Card>
      </Section>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} placeholder="Buscar por nombre, teléfono o cédula" />
      <Section label="Clientes">
        <div className="bg-white rounded-2xl px-4 flex flex-col">
          <button onClick={() => setCreating(true)} className="flex items-center gap-3 py-4 text-left active:opacity-70">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
              <UserPlus size={16} color="#121e6c" strokeWidth={2} />
            </div>
            <span className="text-[14px] font-bold text-[#121e6c]">Crear nuevo cliente</span>
          </button>
          {onClear && (
            <>
              <Divider />
              <button onClick={onClear} className="flex items-center gap-3 py-4 text-left active:opacity-70">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF1F2' }}>
                  <X size={16} color="#BE123C" strokeWidth={2} />
                </div>
                <span className="text-[14px] font-bold text-[#BE123C]">Quitar cliente</span>
              </button>
            </>
          )}
          {filtered.map(c => (
            <div key={c.id}>
              <Divider />
              <button onClick={() => onSelect(c, false)} className="flex items-center gap-3 py-3 text-left w-full active:opacity-70">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
                  <span className="text-[14px]" style={{ color: '#3E4983' }}>{initials(c.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#121e6c] truncate">{c.name}</p>
                  <p className="text-[12px]" style={{ color: '#6C759F' }}>{c.phone}</p>
                </div>
                <ChevronRight size={14} color="#b0b5c8" strokeWidth={2} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && query && (
            <p className="text-[14px] text-[#969696] py-4 text-center">Sin resultados para "{query}"</p>
          )}
        </div>
      </Section>
    </div>
  );
}

// ── Selector de profesional (pantalla completa) ─────────────────────────────
export function ProfessionalPicker({ professionals, selectedId, onSelect }: {
  professionals: Professional[];
  selectedId: string;
  onSelect: (p: Professional) => void;
}) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = professionals
    .filter(p => p.active !== false)
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} placeholder="Buscar profesional" />
      <Section label="Profesionales">
        {list.length === 0 ? (
          <p className="text-[14px] text-[#969696] text-center py-4">Sin resultados para "{query}"</p>
        ) : (
          <div className="bg-white rounded-2xl px-4 flex flex-col">
            {list.map((p, i) => (
              <div key={p.id}>
                {i > 0 && <Divider />}
                <button onClick={() => onSelect(p)} className="flex items-center gap-3 py-3 text-left w-full active:opacity-70">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F7F8FB' }}>
                    <span className="text-[14px]" style={{ color: '#3E4983' }}>{p.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#121e6c] truncate">{p.name}</p>
                    <p className="text-[12px]" style={{ color: '#6C759F' }}>{p.role}</p>
                  </div>
                  {p.id === selectedId && <Check size={16} color="#121e6c" strokeWidth={2.5} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Selector de servicio a agregar ──────────────────────────────────────────
export function ServicePicker({ services, onSelect }: { services: Service[]; onSelect: (s: Service) => void }) {
  const [query, setQuery] = useState('');
  const available = services
    .filter(s => s.active !== false)
    .filter(s => !query.trim() || s.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} placeholder="Buscar servicio" />
      <Section label="Servicios">
        {available.length === 0 ? (
          <p className="text-[14px] text-[#969696] text-center py-4">No hay servicios para agregar</p>
        ) : (
          <div className="bg-white rounded-2xl px-4 flex flex-col">
            {available.map((svc, i) => (
              <div key={svc.id}>
                {i > 0 && <Divider />}
                <button onClick={() => onSelect(svc)} className="w-full flex items-center justify-between gap-3 py-4 text-left active:opacity-70">
                  <span className={FIELD_LABEL}>{svc.name}</span>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: '#121e6c' }}>{formatCOP(svc.price)}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Panel de prototipo (NO es parte del producto; se elimina después) ───────
export type MockResult = 'confirmado' | 'pendiente' | 'no-pagado' | 'falla-registro';

export function PrototypePanel({ mock, onMock, onMethodsDown }: {
  mock: MockResult;
  onMock: (m: MockResult) => void;
  onMethodsDown: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-2xl border border-dashed border-[#d2d4e1] px-3 py-2 flex flex-col gap-2">
      <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between text-left">
        <span className="text-[10px] font-semibold text-[#b0b5c8] uppercase tracking-widest">Prototipo · simular respuesta</span>
        <ChevronDown size={14} color="#b0b5c8" style={{ transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      {open && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {([
              ['confirmado', 'Confirmado'],
              ['pendiente', 'Pendiente'],
              ['no-pagado', 'No pagado'],
              ['falla-registro', 'Confirmado + falla registro'],
            ] as [MockResult, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onMock(key)}
                className="h-7 px-3 rounded-full text-[11px] font-semibold border active:opacity-70"
                style={{
                  backgroundColor: mock === key ? '#121e6c' : '#fff',
                  color: mock === key ? '#fff' : '#606060',
                  borderColor: mock === key ? '#121e6c' : '#d2d4e1',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={onMethodsDown} className="self-start text-[11px] font-semibold text-[#606060] underline active:opacity-60">
            Simular medios de pago no disponibles
          </button>
        </>
      )}
    </div>
  );
}
