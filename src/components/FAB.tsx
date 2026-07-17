import { Plus } from 'lucide-react';

interface Props {
  onPress: () => void;
  label?: string;
}

export function FAB({ onPress, label = 'Nueva cita' }: Props) {
  return (
    <button
      onClick={onPress}
      className="absolute right-4 flex items-center gap-1.5 rounded-full h-12 px-4 shadow-md transition-all active:scale-95"
      style={{
        backgroundColor: '#E8194B',
        bottom: '76px',
        zIndex: 30,
        // Minimum 44px touch target preserved even though visual is h-12 (48px)
      }}
    >
      <Plus size={18} color="white" strokeWidth={2.5} />
      <span className="text-white text-sm font-bold">{label}</span>
    </button>
  );
}
