import React from 'react';
import { contextMenuProps } from './ContextMenuProvider';
import './ContextMenu.css';

export const ContextMenu = React.forwardRef<HTMLDivElement, contextMenuProps>(
  ({ entries, visible, xPos, yPos }, ref): JSX.Element => {
    ContextMenu.displayName = 'ContextMenu';

    return (
      <div
        ref={ref}
        className={`context-menu ${visible ? 'visible' : ''}`}
        style={{
          top: `${yPos}px`,
          left: `${xPos}px`,
        }}
      >
        {entries.map((e, i) => (
          <div
            key={i}
            className='context-menu-item'
            onClick={() => {
              e.action && e.action();
            }}
          >
            {e.label ?? ''}
          </div>
        ))}
      </div>
    );
  },
);
