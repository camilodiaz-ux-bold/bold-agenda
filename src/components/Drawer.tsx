import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  height?: string;
}

export function Drawer({ title, onClose, children, height = '90%' }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: visible ? 'rgba(18, 30, 108, 0.35)' : 'rgba(18, 30, 108, 0)' }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl flex flex-col transition-transform duration-300 ease-out"
        style={{
          height,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header — stable, never scrolls */}
        {title && (
          <div className="flex items-center justify-between px-5 pb-4 flex-shrink-0">
            <h2 className="text-base font-bold text-[#121e6c]">{title}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition-opacity active:opacity-60"
            >
              <X size={16} color="#606060" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Scrollable body — children manage their own scroll and sticky footer */}
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
