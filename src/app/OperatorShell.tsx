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
              <div className="px-5 py-8 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFF1F2] flex items-center justify-center">
                  <CalendarPlus size={22} color="#E8194B" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold text-[#121e6c]">Nueva cita</p>
                <p className="text-xs text-[#969696] max-w-[200px]">
                  El flujo completo de agendar una cita estará disponible en Slice 1.
                </p>
              </div>,
              'Nueva cita',
              '40%'
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
