import { PageHeader } from '../components/PageHeader';
import { Search } from 'lucide-react';

export function ClientesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Clientes" subtitle="Salón Camila" />

      {/* Search bar */}
      <div className="bg-white px-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-[#f3f3f3] rounded-xl px-3 py-2.5">
          <Search size={16} color="#969696" strokeWidth={2} />
          <span className="text-sm text-[#969696]">Buscar por nombre o celular</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {/* Client row skeletons */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" style={{ opacity: 0.5 }} />
        ))}
        <p className="text-center text-xs text-[#969696] mt-4">
          Próximamente
        </p>
      </div>
    </div>
  );
}
