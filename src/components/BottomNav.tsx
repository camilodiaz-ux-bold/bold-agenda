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

export function BottomNav({ active, onChange }: Props) {
  return (
    <div
      className="shrink-0 px-5 pt-5 pb-6"
      style={{ background: 'linear-gradient(to top, #f7f8fb 55%, rgba(247,248,251,0) 100%)' }}
    >
      <nav
        className="flex items-center px-[10px] rounded-[100px] border relative"
        style={{
          height: '62px',
          borderColor: 'rgba(210,212,225,0.5)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0px 10px 18.7px 0px rgba(18,30,108,0.09), inset 0px -2px 4px 0px white, inset 0px 3px 7.5px 0px rgba(18,30,108,0.13)',
        }}
      >
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60"
            >
              <Icon
                size={22}
                color="#121e6c"
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[11px] leading-[16px] text-[#121e6c]"
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
