import { PageHeader } from '../components/PageHeader';
import { ChevronRight, Store, Users, Scissors, Shield, Sparkles } from 'lucide-react';

const SECTIONS = [
  { Icon: Store, label: 'Perfil del negocio', sub: 'Nombre, dirección, horario' },
  { Icon: Users, label: 'Equipo', sub: '3 profesionales activos' },
  { Icon: Scissors, label: 'Servicios', sub: '5 servicios configurados' },
  { Icon: Shield, label: 'Política de reservas', sub: 'Cancelación con 24h de anticipación' },
];

export function AjustesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ajustes" subtitle="Salón Camila" />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* White-glove banner */}
        <div className="bg-[#FFF1F2] rounded-2xl p-4 flex gap-3">
          <Sparkles size={20} color="#E8194B" strokeWidth={1.8} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#E8194B] leading-snug">Configuración asistida</p>
            <p className="text-xs text-[#606060] mt-0.5 leading-snug">
              El equipo Bold configuró este negocio junto a ti. Puedes editar cualquier ajuste en cualquier momento.
            </p>
          </div>
        </div>

        {/* Section list */}
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
          {SECTIONS.map(({ Icon, label, sub }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-4 transition-colors active:bg-gray-50"
            >
              <div className="w-9 h-9 rounded-xl bg-[#f3f3f3] flex items-center justify-center shrink-0">
                <Icon size={18} color="#121e6c" strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-[#121e6c]">{label}</p>
                <p className="text-xs text-[#969696] mt-0.5">{sub}</p>
              </div>
              <ChevronRight size={18} color="#969696" strokeWidth={2} />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[#969696] mt-2">
          Edición completa disponible en Slice 6
        </p>
      </div>
    </div>
  );
}
