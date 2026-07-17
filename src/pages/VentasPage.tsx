import { PageHeader } from '../components/PageHeader';

export function VentasPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ventas" subtitle="Salón Camila" />

      {/* Period selector */}
      <div className="bg-white px-4 pb-3 border-b border-gray-100">
        <div className="flex bg-[#f3f3f3] rounded-full p-1 gap-1">
          {['Hoy', 'Semana', 'Mes'].map((p, i) => (
            <div
              key={p}
              className="flex-1 text-center py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: i === 0 ? '#fff' : 'transparent',
                color: i === 0 ? '#121e6c' : '#969696',
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" style={{ opacity: 0.5 }} />
          ))}
        </div>
        <p className="text-center text-xs text-[#969696] mt-4">
          Próximamente
        </p>
      </div>
    </div>
  );
}
