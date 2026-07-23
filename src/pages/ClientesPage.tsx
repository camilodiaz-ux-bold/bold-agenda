import { useState, useMemo, type ReactNode } from 'react';
import { Bell, ChevronDown, ChevronRight, Search, UserPlus, Users } from 'lucide-react';
import { ClientDetailDrawer } from '../components/ClientDetailDrawer';
import type { Client, Appointment, SaleRecord, Professional, Service, Role } from '../types';

interface Props {
  role: Role;
  clients: Client[];
  appointments: Appointment[];
  salesRecords: SaleRecord[];
  professionals: Professional[];
  services: Service[];
  onUpdateClient: (c: Client) => void;
  onOpenDrawer: (content: ReactNode, title?: string, height?: string) => void;
  onCloseDrawer: () => void;
  onOpenEdit: (apt: Appointment) => void;
}

const STAFF_PROF_ID = 'p1';

export function ClientesPage({
  role, clients, appointments, professionals, services,
  onUpdateClient, onOpenDrawer, onCloseDrawer, onOpenEdit,
}: Props) {
  const [query, setQuery] = useState('');

  const visibleClients = useMemo(() => {
    let base = clients;

    if (role === 'staff') {
      const servedPhones = new Set(
        appointments
          .filter(a => a.professionalId === STAFF_PROF_ID)
          .map(a => a.clientPhone)
      );
      base = base.filter(c => servedPhones.has(c.phone));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      base = base.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
      );
    }

    return [...base].sort((a, b) => {
      const aLast = a.lastVisit ?? '';
      const bLast = b.lastVisit ?? '';
      return bLast.localeCompare(aLast);
    });
  }, [clients, role, appointments, query]);

  function openClientDetail(client: Client) {
    onOpenDrawer(
      <ClientDetailDrawer
        client={client}
        appointments={appointments}
        services={services}
        professionals={professionals}
        role={role}
        onSave={(updated) => { onUpdateClient(updated); }}
        onOpenEdit={onOpenEdit}
        onClose={onCloseDrawer}
      />,
      client.name,
      '92%'
    );
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-4">
        <div className="relative flex items-center" style={{ height: '36px' }}>
          <span className="text-[16px] font-bold text-[#121e6c] leading-[20px]">Clientes</span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-[2px]" style={{ maxWidth: '180px' }}>
              <span className="text-[14px] font-semibold text-[#1e1e1e] leading-[20px] truncate">
                Salón Camila Norte
              </span>
              <ChevronDown size={16} color="#1e1e1e" strokeWidth={2.5} className="shrink-0" />
            </div>
          </div>
          <button
            className="absolute right-0 w-6 h-6 flex items-center justify-center transition-opacity active:opacity-60"
            aria-label="Notificaciones"
          >
            <Bell size={24} color="#121e6c" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Body list ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pb-28">

        {/* Search bar + Crear row */}
        <div className="flex items-center gap-4">
          {/* Search bar: white, rounded-[30px], h-[40px] */}
          <div
            className="flex-1 flex items-center gap-3 bg-white rounded-[30px] px-3"
            style={{ height: '40px' }}
          >
            <Search size={24} color="#606060" strokeWidth={1.8} className="shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar cliente"
              className="flex-1 bg-transparent text-[14px] font-normal text-[#1e1e1e] outline-none placeholder:text-[#606060]"
            />
          </div>

          {/* Crear: icon + underlined text */}
          <button
            className="flex items-center shrink-0 active:opacity-70 transition-opacity"
            style={{ height: '40px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <UserPlus size={24} color="#121e6c" strokeWidth={1.8} />
            <span className="pl-2 text-[12px] font-bold text-[#121e6c] underline leading-[16px]">
              Crear
            </span>
          </button>
        </div>

        {/* Client cards */}
        {visibleClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 2px 8px rgba(18,30,108,0.08)' }}
            >
              <Users size={20} color="#d2d4e1" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-[#121e6c]">Sin resultados</p>
            <p className="text-xs text-[#969696]">
              {query ? 'Intenta con otro término de búsqueda.' : 'No hay clientes en este perfil.'}
            </p>
          </div>
        ) : (
          visibleClients.map(client => (
            <ClientRow
              key={client.id}
              client={client}
              onTap={() => openClientDetail(client)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ClientRow({ client, onTap }: { client: Client; onTap: () => void }) {
  const initials = client.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <button
      onClick={onTap}
      className="w-full bg-white rounded-[16px] text-left flex items-center gap-3 transition-all active:opacity-70"
      style={{ paddingLeft: '12px', paddingRight: '8px', paddingTop: '12px', paddingBottom: '12px' }}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: '40px', height: '40px', backgroundColor: '#F7F8FB' }}
      >
        <span
          className="text-[14px] font-normal leading-[20px]"
          style={{ color: '#3E4983' }}
        >
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center">
        <p className="text-[14px] font-bold text-[#121e6c] leading-[20px] truncate">
          {client.name}
        </p>
        <p className="text-[14px] font-normal text-[#1e1e1e] leading-[20px]">
          {client.visitCount} {client.visitCount === 1 ? 'Visita' : 'Visitas'}
        </p>
      </div>

      {/* Chevron right — 28px container matching Figma AtomSelectionType */}
      <div className="w-7 h-7 flex items-center justify-center shrink-0">
        <ChevronRight size={18} color="#121e6c" strokeWidth={2} />
      </div>
    </button>
  );
}
