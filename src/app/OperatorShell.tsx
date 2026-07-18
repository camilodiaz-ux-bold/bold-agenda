import { useState, type ReactNode } from 'react';
import { CalendarPlus } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { FAB } from '../components/FAB';
import { Drawer } from '../components/Drawer';
import { AgendaPage } from '../pages/AgendaPage';
import { VentasPage } from '../pages/VentasPage';
import { ClientesPage } from '../pages/ClientesPage';
import { AjustesPage } from '../pages/AjustesPage';
import { AvailabilityDrawer } from '../components/AvailabilityDrawer';
import { EditAppointmentDrawer } from '../components/EditAppointmentDrawer';
import type { OperatorSection, Role, SaleRecord, Appointment, AvailabilityBlock } from '../types';
import { store } from '../store/prototypeStore';

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
  const [role, setRole] = useState<Role>('admin');

  // All shared state initialised from store
  const [appointments, setAppointments] = useState<Appointment[]>(initial.appointments);
  const [salesRecords, setSalesRecords] = useState<SaleRecord[]>(initial.saleRecords);
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>(initial.availabilityBlocks);
  const [professionals, setProfessionals] = useState(initial.professionals);
  const [services, setServices] = useState(initial.services);
  const [clients, setClients] = useState(initial.clients);
  const [businessProfile, setBusinessProfile] = useState(initial.businessProfile);
  const [bookingPolicy, setBookingPolicy] = useState(initial.bookingPolicy);

  function persist(updates: Partial<ReturnType<typeof store.get>>) {
    store.set(s => ({ ...s, ...updates }));
  }

  const openDrawer = (content: ReactNode, title?: string, height?: string) => {
    setDrawer({ content, title, height });
  };
  const closeDrawer = () => setDrawer(null);

  function updateAppointment(updated: Appointment) {
    setAppointments(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      persist({ appointments: next });
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

  function openAvailabilityDrawer(showProfSelector: boolean) {
    openDrawer(
      <AvailabilityDrawer
        professionals={professionals}
        appointments={appointments}
        existingBlocks={availabilityBlocks}
        role={role}
        currentProfId={STAFF_PROF_ID}
        showProfSelector={showProfSelector}
        onSave={(block) => {
          addAvailabilityBlock(block);
        }}
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
        onSave={(updated) => {
          updateAppointment(updated);
        }}
        onClose={closeDrawer}
      />,
      'Editar cita',
      '92%'
    );
  }

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#f7f8fb' }}
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        {section === 'agenda' && (
          <AgendaPage
            role={role}
            onRoleChange={setRole}
            appointments={appointments}
            availabilityBlocks={availabilityBlocks}
            onUpdateAppointment={updateAppointment}
            onAddSaleRecord={addSaleRecord}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
            onOpenEdit={openEditDrawer}
            onOpenAvailability={(showProfSelector) => openAvailabilityDrawer(showProfSelector)}
          />
        )}
        {section === 'ventas' && (
          <VentasPage
            role={role}
            salesRecords={salesRecords}
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
            onUpdateClient={(c) => {
              setClients(prev => {
                const next = prev.map(x => x.id === c.id ? c : x);
                persist({ clients: next });
                return next;
              });
            }}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
            onOpenEdit={openEditDrawer}
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
            }}
            onOpenEdit={openEditDrawer}
            onOpenDrawer={openDrawer}
            onCloseDrawer={closeDrawer}
          />
        )}
      </div>

      {/* FAB — Agenda: new appointment */}
      {section === 'agenda' && (
        <FAB
          onPress={() =>
            openDrawer(
              <div className="px-5 py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] flex items-center justify-center">
                  <CalendarPlus size={26} color="#E8194B" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-base font-bold text-[#121e6c]">Agendar nueva cita</p>
                  <p className="text-xs text-[#969696] mt-1.5 max-w-[220px] leading-relaxed">
                    Disponible en la próxima versión.
                  </p>
                </div>
              </div>,
              'Nueva cita',
              '44%'
            )
          }
        />
      )}

      <BottomNav active={section} onChange={(s) => { setSection(s); closeDrawer(); }} />

      {drawer && (
        <Drawer title={drawer.title} onClose={closeDrawer} height={drawer.height}>
          {drawer.content}
        </Drawer>
      )}
    </div>
  );
}
