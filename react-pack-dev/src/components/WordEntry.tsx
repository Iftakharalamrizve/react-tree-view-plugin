import React, { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface WordEntryProps {
  id: Key;
  value?: string;
  editing?: boolean;
  saving?: boolean;
  setValue?: (ret: string) => void;
  sendEscape?: () => void;
  style?: React.CSSProperties;
}

export const WordEntry = React.forwardRef<HTMLInputElement, WordEntryProps>(
  ({ id, value, editing, saving, setValue, sendEscape, style }, ref): JSX.Element => {
    WordEntry.displayName = 'WordEntry';
    const currentStyle = useMemo<React.CSSProperties>(() => {
      return {
        display: 'inline-block',
        padding: '1px',
        paddingLeft: '3px',
        paddingRight: '3px',
        border: '1px',
        borderRadius: '3px',
        ...style,
      };
    }, [style]);

    const [currentValue, setCurrentValue] = useState<string>(value ?? '');
    useEffect(() => {
      setCurrentValue(value ?? '');
    }, [value]);

    const returnData = useCallback(() => {
      setValue && setValue(currentValue);
    }, [currentValue, setValue]);

    const keyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.code === 'Escape') {
          setCurrentValue(value ?? '');
          sendEscape && sendEscape();
        } else if (e.code === 'Enter') {
          returnData();
        }
      },
      [returnData, sendEscape, value],
    );

    // Simple if not editing
    if (!editing) {
      return (
        <span
          style={currentStyle}
          id={String(id)}
        >
          {value}
        </span>
      );
    }

    return (
      <div
        style={currentStyle}
        id={`${id}-holder`}
      >
        {saving && (
          <Spinner
            id={`${id}-spinner`}
            size='sm'
            animation='border'
          />
        )}
        <input
          id={String(id)}
          ref={ref}
          type='text'
          style={{
            lineHeight: '0.75rem',
            border: '1px dotted black',
            width: 'auto',
            minWidth: '0',
          }}
          value={currentValue}
          disabled={saving}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={returnData}
          onKeyDownCapture={keyPress}
        />
      </div>
    );
  },
);
