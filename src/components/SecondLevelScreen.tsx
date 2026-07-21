import type { ReactNode } from 'react';
import { PageHeader } from './PageHeader';

interface Props {
  title: string;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function SecondLevelScreen({ title, onBack, children, footer }: Props) {
  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader title={title} onBack={onBack} border />
      <div className="flex-1 overflow-y-auto min-h-0">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 px-5 pt-3 pb-6 border-t border-gray-100 bg-white">
          {footer}
        </div>
      )}
    </div>
  );
}
