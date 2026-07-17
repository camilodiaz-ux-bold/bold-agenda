import { useState, type ReactNode } from 'react';
import { CalendarPlus } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { FAB } from '../components/FAB';
import { Drawer } from '../components/Drawer';
import { AgendaPage } from '../pages/AgendaPage';
import { VentasPage } from '../pages/VentasPage';
import { ClientesPage } from '../pages/ClientesPage';
import { AjustesPage } from '../pages/AjustesPage';
import type { OperatorSection } from '../types';

interface DrawerState {
  title?: string;
  content: ReactNode;
  height?: string;
}

export function OperatorShell() {
  const [section, setSection] = useState<OperatorSection>('agenda');
  const [drawer, setDrawer] = useState<DrawerState | null>(null);

  const openDrawer = (content: ReactNode, title?: string, height?: string) => {
    setDrawer({ content, title, height });
  };

  const closeDrawer = () => setDrawer(null);

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#f7f8fb' }}
    >
      {/* Scrollable main content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {section === 'agenda' && (
          <AgendaPage onOpenDrawer={openDrawer} onCloseDrawer={closeDrawer} />
        )}
        {section === 'ventas' && <VentasPage />}
        {section === 'clientes' && <ClientesPage />}
        {section === 'ajustes' && <AjustesPage />}
      </div>

      {/* FAB — only on Agenda */}
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
                    Selecciona servicio, profesional, cliente y horario disponible.
                  </p>
                </div>
                <div className="w-full bg-[#f7f8fb] rounded-2xl px-4 py-3 text-left flex flex-col gap-2">
                  {['Servicio', 'Profesional', 'Cliente', 'Fecha y hora'].map(label => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d2d4e1]" />
                      <span className="text-xs text-[#b0b5c8]">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#c0c4d3]">Disponible en la próxima versión</p>
              </div>,
              'Nueva cita',
              '52%'
            )
          }
        />
      )}

      {/* Bottom navigation */}
      <BottomNav active={section} onChange={(s) => { setSection(s); closeDrawer(); }} />

      {/* Drawer overlay */}
      {drawer && (
        <Drawer
          title={drawer.title}
          onClose={closeDrawer}
          height={drawer.height}
        >
          {drawer.content}
        </Drawer>
      )}
    </div>
  );
}
