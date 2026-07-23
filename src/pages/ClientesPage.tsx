import { useState, useMemo, type ReactNode } from 'react';
import { Search, Users } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ClientDetailDrawer } from '../components/ClientDetailDrawer';
import { formatCOP } from '../data/appointments';
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
    <div className="flex flex-col h-full">
      <PageHeader title="Clientes" subtitle="Salón Camila" />

      {/* Search bar */}
      <div className="bg-white px-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-[#f3f3f3] rounded-xl px-3 py-2.5">
          <Search size={16} color="#969696" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o celular"
            className="flex-1 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder-[#969696]"
          />
        </div>
      </div>

      {/* Role filter badge */}
      {role === 'staff' && (
        <div className="bg-[#EFF6FF] px-4 py-2 flex items-center gap-2">
          <Users size={12} color="#1D4ED8" strokeWidth={2.5} />
          <p className="text-xs font-semibold text-[#1D4ED8]">Mostrando solo tus clientes</p>
        </div>
      )}

      {/* Count */}
      <div className="px-4 py-3">
        <p className="text-xs text-[#969696]">
          {visibleClients.length} cliente{visibleClients.length !== 1 ? 's' : ''}
          {query ? ` para "${query}"` : ''}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col gap-2">
        {visibleClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(18,30,108,0.08)' }}>
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
              appointments={appointments}
              services={services}
              professionals={professionals}
              onTap={() => openClientDetail(client)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ClientRow({
  client, appointments, services, professionals, onTap,
}: {
  client: Client;
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  onTap: () => void;
}) {
  const lastApt = appointments
    .filter(a => a.clientPhone === client.phone || a.clientCedula === client.cedula)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const lastSvc = lastApt ? services.find(s => s.id === lastApt.serviceId) : null;
  const preferredProf = professionals.find(p => p.id === client.preferredProfessionalId);

  const initials = client.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hasActive = appointments.some(a =>
    (a.clientPhone === client.phone || a.clientCedula === client.cedula) &&
    ['confirmada', 'reprogramada'].includes(a.status)
  );

  return (
    <button
      onClick={onTap}
      className="w-full bg-white rounded-2xl px-4 py-3.5 text-left flex items-center gap-3 border border-gray-100 transition-all active:opacity-70"
      style={{ boxShadow: '0 1px 4px rgba(18,30,108,0.04)' }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative" style={{ backgroundColor: '#121e6c' }}>
        <span className="text-sm font-bold text-white">{initials}</span>
        {hasActive && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: '#FF2947' }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#1e1e1e] truncate">{client.name}</p>
          <p className="text-sm font-bold text-[#121e6c] tabular-nums shrink-0">{formatCOP(client.totalSpent)}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-[#969696] truncate">
            {lastSvc?.name ?? (lastApt ? 'Servicio' : 'Sin citas')}
            {preferredProf ? ` · ${preferredProf.name.split(' ')[0]}` : ''}
          </p>
          <span className="text-[10px] text-[#b0b5c8] shrink-0">
            {client.visitCount} {client.visitCount === 1 ? 'visita' : 'visitas'}
          </span>
        </div>
      </div>
    </button>
  );
}
