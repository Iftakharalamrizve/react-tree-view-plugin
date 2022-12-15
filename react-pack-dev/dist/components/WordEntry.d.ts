import React, { Key } from 'react';
interface WordEntryProps {
    id: Key;
    value?: string;
    editing?: boolean;
    saving?: boolean;
    setValue?: (ret: string) => void;
    sendEscape?: () => void;
    style?: React.CSSProperties;
}
export declare const WordEntry: React.ForwardRefExoticComponent<WordEntryProps & React.RefAttributes<HTMLInputElement>>;
export {};
