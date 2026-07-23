import { Plus } from 'lucide-react';

interface Props {
  onPress: () => void;
  label?: string;
}

export function FAB({ onPress, label = 'Nueva cita' }: Props) {
  return (
    <button
      onClick={onPress}
      className="absolute right-5 flex items-center gap-2 rounded-full px-5 transition-all active:scale-95"
      style={{
        backgroundColor: '#FF2947',
        height: '46px',
        bottom: '96px',
        zIndex: 30,
        boxShadow: '0px 4px 12px rgba(255,41,71,0.35)',
      }}
    >
      <Plus size={20} color="white" strokeWidth={2.5} />
      <span className="text-white text-[14px] font-bold leading-[20px]">{label}</span>
    </button>
  );
}
