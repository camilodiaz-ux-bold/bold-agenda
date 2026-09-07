import { useState, type ReactNode } from 'react';
import { Plus, Lock } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { FAB } from '../components/FAB';
import { Drawer } from '../components/Drawer';
import { AgendaPage } from '../pages/AgendaPage';
import { VentasPage } from '../pages/VentasPage';
import { ClientesPage } from '../pages/ClientesPage';
import { AjustesPage } from '../pages/AjustesPage';
import { NewAppointmentScreen } from '../pages/NewAppointmentScreen';
import { AvailabilityDrawer } from '../components/AvailabilityDrawer';
import { EditAppointmentDrawer } from '../components/EditAppointmentDrawer';
import type { OperatorSection, Role, SaleRecord, Appointment, AvailabilityBlock, Client } from '../types';
import { store } from '../store/prototypeStore';
import { BRANCHES } from '../data/appointments';

interface DrawerState {
  title?: string;
  content: ReactNode;
  height?: string;
}

const STAFF_PROF_ID = 'p1';

export function OperatorShell() {
  const initial = store.get();

  const [section, setSection] = useState<OperatorSection>('agenda');
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [role] = useState<Role>('admin');
  const [viewScope, setViewScope] = useState<'team' | 'mine'>('team');
  const [ajustesSecondLevel, setAjustesSecondLevel] = useState(false);
  const [agendaSecondLevel, setAgendaSecondLevel] = useState(false);
  const [clientesSecondLevel, setClientesSecondLevel] = useState(false);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [newApptSlot, setNewApptSlot] = useState<{ date: string; time: string; professionalId?: string } | null>(null);
  const [agendaJumpDate, setAgendaJumpDate] = useState<string | undefined>(undefined);
  const [activeBranchId, setActiveBranchId] = useState(initial.activeBranchId ?? 'norte');

  const [appointments, setAppointments] = useState<Appointment[]>(initial.appointments);
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(initial.saleRecords);
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>(initial.availabilityBlocks);
  const [professionals, setProfessionals] = useState(initial.professionals);
  const [services, setServices] = useState(initial.services);
  const [clients, setClients] = useState<Client[]>(initial.clients);
  const [businessProfile, setBusinessProfile] = useState(initial.businessProfile);
  const [bookingPolicy, setBookingPolicy] = useState(initial.bookingPolicy);

  function persist(updates: Partial<ReturnType<typeof store.get>>) {
    store.set(s => ({ ...s, ...updates }));
  }

  function handleBranchChange(id: string) {
    setActiveBranchId(id);
    persist({ activeBranchId: id });
  }

  const openDrawer = (content: ReactNode, title?: string, height?: string) => setDrawer({ content, title, height });
  const closeDrawer = () => setDrawer(null);

  function updateAppointment(updated: Appointment) {
    setAppointments(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      persist({ appointments: next });
      return next;
    });
  }

  function updateClient(updated: Client) {
    setClients(prev => {
      const next = prev.map(c => c.id === updated.id ? updated : c);
      persist({ clients: next });
      return next;
    });
  }

  function addSaleRecord(sale: SaleRecord) {
    setSalesRecords(prev => {
      const next = [...prev, sale];
      persist({ saleRecords: next });
      return next;
    });
  }

  function addAvailabilityBlock(block: AvailabilityBlock) {
    setAvailabilityBlocks(prev => {
      const next = [...prev, block];
      persist({ availabilityBlocks: next });
      return next;
    });
  }

  function handleNewApptCreated(apt: Appointment, newClient?: Client) {
    setAppointments(prev => {
      const next = [...prev, apt];
      persist({ appointments: next });
      return next;
    });
    if (newClient) {
      setClients(prev => {
        const next = [...prev, newClient];
        persist({ clients: next });
        return next;
      });
    }
    setSection('agenda');
    setAgendaJumpDate(apt.date);
    setShowNewAppt(false);
  }

  function openAvailabilityDrawer(showProfSelector: boolean) {
    openDrawer(
      <AvailabilityDrawer
        professionals={professionals}
        appointments={appointments}
        existingBlocks={availabilityBlocks}
        role={role}
        currentProfId={STAFF_PROF_ID}
        showProfSelector={showProfSelector}
        onSave={(block) => addAvailabilityBlock(block)}
        onClose={closeDrawer}
        onEditConflict={(apt) => {
          closeDrawer();
          setTimeout(() => openEditDrawer(apt), 320);
        }}
      />,
      'Bloquear disponibilidad',
      '88%'
    );
  }

  function openEditDrawer(apt: Appointment) {
    openDrawer(
      <EditAppointmentDrawer
        appointment={apt}
        appointments={appointments}
        professionals={professionals}
        services={services}
        availabilityBlocks={availabilityBlocks}
        role={role}
        onSave={updateAppointment}
        onClose={closeDrawer}
      />,
      'Editar cita',
      '92%'
    );
  }

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(178.5deg, rgba(247,248,251,0.032) 1.07%, rgba(4,7,245,0.051) 100%), linear-gradient(90deg, rgb(247,248,251) 0%, rgb(247,248,251) 100%)' }}
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        {section === 'agenda' && (
          <AgendaPage
            role={role}
            viewScope={viewScope}
            onViewScopeChange={setViewScope}
            appointments={appointments}
            availabilityBlocks={availabilityBlocks}
            activeBranchId={activeBranchId}
            branches={BRANCHES}
            clients={clients}
            services={services}
            saleRecords={salesRecords}
            onBranchChange={handleBranchChange}
            onUpdateAppointment={updateAppointment}
            onUpdateClient={updateClient}
            onAddSaleRecord={addSaleRecord}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
            onOpenEdit={openEditDrawer}
            onOpenAvailability={(showProfSelector) => openAvailabilityDrawer(showProfSelector)}
            onNewApptAtSlot={(date, time, professionalId) => { setNewApptSlot({ date, time, professionalId }); setShowNewAppt(true); }}
            jumpToDate={agendaJumpDate}
            onJumpHandled={() => setAgendaJumpDate(undefined)}
            onSecondLevelChange={setAgendaSecondLevel}
          />
        )}
        {section === 'ventas' && (
          <VentasPage
            role={role}
            salesRecords={salesRecords}
            activeBranchId={activeBranchId}
            branches={BRANCHES}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
          />
        )}
        {section === 'clientes' && (
          <ClientesPage
            role={role}
            clients={clients}
            appointments={appointments}
            salesRecords={salesRecords}
            professionals={professionals}
            services={services}
            onUpdateClient={updateClient}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
            onOpenEdit={openEditDrawer}
            onSecondLevelChange={setClientesSecondLevel}
          />
        )}
        {section === 'ajustes' && (
          <AjustesPage
            role={role}
            professionals={professionals}
            services={services}
            businessProfile={businessProfile}
            bookingPolicy={bookingPolicy}
            appointments={appointments}
            onUpdateProfessionals={(profs) => { setProfessionals(profs); persist({ professionals: profs }); }}
            onUpdateServices={(svcs) => { setServices(svcs); persist({ services: svcs }); }}
            onUpdateBusinessProfile={(bp) => { setBusinessProfile(bp); persist({ businessProfile: bp }); }}
            onUpdateBookingPolicy={(bp) => { setBookingPolicy(bp); persist({ bookingPolicy: bp }); }}
            onSecondLevelChange={setAjustesSecondLevel}
            onReset={() => {
              store.reset();
              const fresh = store.get();
              setAppointments(fresh.appointments);
              setSalesRecords(fresh.saleRecords);
              setAvailabilityBlocks(fresh.availabilityBlocks);
              setProfessionals(fresh.professionals);
              setServices(fresh.services);
              setClients(fresh.clients);
              setBusinessProfile(fresh.businessProfile);
              setBookingPolicy(fresh.bookingPolicy);
              setActiveBranchId(fresh.activeBranchId ?? 'norte');
            }}
          />
        )}
      </div>

      {/* FAB — speed-dial con "Nueva cita" y "Bloquear agenda" */}
      {section === 'agenda' && !agendaSecondLevel && (
        <>
          {fabMenuOpen && (
            <div
              className="absolute inset-0 bg-black/20"
              style={{ zIndex: 29 }}
              onClick={() => setFabMenuOpen(false)}
            />
          )}
          {fabMenuOpen && (
            <div
              className="absolute right-5 flex flex-col items-end gap-[12px]"
              style={{ bottom: '186px', zIndex: 30 }}
            >
              <button
                onClick={() => { setFabMenuOpen(false); setNewApptSlot(null); setShowNewAppt(true); }}
                className="flex items-center gap-[8px] rounded-full active:opacity-80 transition-opacity"
                style={{ height: '40px', padding: '0 20px', backgroundColor: '#FF2947', boxShadow: '0px 4px 12px rgba(255,41,71,0.35)' }}
              >
                <Plus size={16} color="white" strokeWidth={2.5} />
                <span className="text-white text-[13px] font-semibold">Nueva cita</span>
              </button>
              <button
                onClick={() => { setFabMenuOpen(false); openAvailabilityDrawer(viewScope === 'team'); }}
                className="flex items-center gap-[8px] rounded-full active:opacity-80 transition-opacity"
                style={{ height: '40px', padding: '0 20px', backgroundColor: '#121E6C', boxShadow: '0px 4px 12px rgba(18,30,108,0.30)' }}
              >
                <Lock size={16} color="white" strokeWidth={2} />
                <span className="text-white text-[13px] font-semibold">Bloquear agenda</span>
              </button>
            </div>
          )}
          <FAB onPress={() => setFabMenuOpen(v => !v)} isOpen={fabMenuOpen} />
        </>
      )}

      {!ajustesSecondLevel && !agendaSecondLevel && !clientesSecondLevel && (
        <BottomNav active={section} onChange={(s) => { setSection(s); closeDrawer(); setFabMenuOpen(false); }} />
      )}

      {drawer && (
        <Drawer title={drawer.title} onClose={closeDrawer} height={drawer.height}>
          {drawer.content}
        </Drawer>
      )}

      {/* New Appointment full-screen overlay */}
      {showNewAppt && (
        <div className="absolute inset-0 bg-white" style={{ zIndex: 40 }}>
          <NewAppointmentScreen
            role={role}
            viewScope={viewScope}
            currentProfId={STAFF_PROF_ID}
            professionals={professionals}
            services={services}
            clients={clients}
            appointments={appointments}
            availabilityBlocks={availabilityBlocks}
            bookingPolicy={bookingPolicy}
            defaultDate={newApptSlot?.date}
            defaultTime={newApptSlot?.time}
            defaultProfId={newApptSlot?.professionalId}
            onBack={() => { setNewApptSlot(null); setShowNewAppt(false); }}
            onCreated={handleNewApptCreated}
          />
        </div>
      )}
    </div>
  );
}
