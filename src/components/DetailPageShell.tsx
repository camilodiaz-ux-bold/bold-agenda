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
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F7F8FB' }}>
      <PageHeader title={title} onBack={onBack} rightAction={rightAction} centerTitle bg="#F7F8FB" />
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-4 pb-6">
        {children}
      </div>
      {footer && (
        <div
          className="shrink-0 px-4 pt-5 pb-6"
          style={{ backgroundImage: 'linear-gradient(180deg, rgba(247,248,251,0) 0%, #F7F8FB 40%)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
