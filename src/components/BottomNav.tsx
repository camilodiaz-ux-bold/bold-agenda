import { Calendar, TrendingUp, Users, Settings } from 'lucide-react';
import type { OperatorSection } from '../types';

interface Props {
  active: OperatorSection;
  onChange: (section: OperatorSection) => void;
}

const TABS: { key: OperatorSection; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
  { key: 'agenda', label: 'Agenda', Icon: Calendar },
  { key: 'ventas', label: 'Ventas', Icon: TrendingUp },
  { key: 'clientes', label: 'Clientes', Icon: Users },
  { key: 'ajustes', label: 'Ajustes', Icon: Settings },
];

const ACTIVE_COLOR = '#E8194B';
const INACTIVE_COLOR = '#969696';

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="bg-white border-t border-gray-100 flex items-stretch flex-shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-opacity active:opacity-60"
          >
            <Icon
              size={22}
              color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className="text-[11px] font-semibold leading-none"
              style={{ color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
