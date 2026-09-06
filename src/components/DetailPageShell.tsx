import type { ReactNode } from 'react';
import { PageHeader } from './PageHeader';

interface Props {
  title: string;
  onBack: () => void;
  rightAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Full-screen "second level" surface for detail views that are too rich for a
 * Drawer/Bottom Sheet: multiple sections, cross-entity data, primary + secondary
 * actions, navigation. Reuse this for future detail screens (cliente, profesional,
 * servicio, venta) instead of stacking more content into a Drawer.
 */
export function DetailPageShell({ title, onBack, rightAction, children, footer }: Props) {
  return (
    <div className="relative flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <PageHeader title={title} onBack={onBack} rightAction={rightAction} centerTitle bg="#F7F8FB" />
      <div
        className="flex-1 overflow-y-auto min-h-0 px-4 pt-4"
        style={{ paddingBottom: footer ? 'calc(104px + env(safe-area-inset-bottom))' : '24px' }}
      >
        {children}
      </div>
      {/* Persistent CTA — floats above the scrollable content (not part of its flow), so it never scrolls away. */}
      {footer && (
        <div
          className="absolute left-0 right-0 bottom-0 px-4 pt-5"
          style={{
            backdropFilter: 'blur(1px)',
            backgroundImage: 'linear-gradient(180deg, rgba(247,248,251,0) 0%, #F7F8FB 40%)',
            paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
