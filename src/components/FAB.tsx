import { Plus, X } from 'lucide-react';

interface Props {
  onPress: () => void;
  isOpen?: boolean;
}

export function FAB({ onPress, isOpen = false }: Props) {
  return (
    <button
      onClick={onPress}
      className="absolute right-5 flex items-center justify-center transition-transform active:scale-95"
      style={{
        width: '53px',
        height: '53px',
        borderRadius: '32px',
        backgroundColor: '#FF2947',
        bottom: '120px',
        zIndex: 30,
        boxShadow: '0px 4px 16px rgba(255,41,71,0.40)',
      }}
    >
      {isOpen
        ? <X size={22} color="white" strokeWidth={2.5} />
        : <Plus size={22} color="white" strokeWidth={2.5} />
      }
    </button>
  );
}
