import React from 'react';
export interface iContextMenuSettings {
    visible?: boolean;
    x?: number;
    y?: number;
    set?: (ret: {
        visible?: boolean;
        x?: number;
        y?: number;
        menuItems?: iMenuItem[];
    }) => void;
}
export interface contextMenuProps {
    entries: iMenuItem[];
    visible: boolean;
    xPos: number;
    yPos: number;
}
export interface iMenuItem {
    label?: string;
    action?: () => void;
}
export declare const MenuContext: React.Context<iContextMenuSettings>;
interface iContextMenuProvider {
    children: React.ReactNode;
}
export declare const ContextMenuProvider: ({ children }: iContextMenuProvider) => JSX.Element;
export {};
