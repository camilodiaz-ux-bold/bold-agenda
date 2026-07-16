import { Plus } from 'lucide-react';

interface Props {
  onPress: () => void;
  label?: string;
}

export function FAB({ onPress, label = 'Nueva cita' }: Props) {
  return (
    <button
      onClick={onPress}
      className="absolute right-4 flex items-center gap-2 rounded-full h-14 px-5 shadow-lg transition-all active:scale-95"
      style={{
        backgroundColor: '#E8194B',
        bottom: '76px',
        zIndex: 30,
      }}
    >
      <Plus size={20} color="white" strokeWidth={2.5} />
      <span className="text-white text-sm font-bold">{label}</span>
    </button>
  );
}
