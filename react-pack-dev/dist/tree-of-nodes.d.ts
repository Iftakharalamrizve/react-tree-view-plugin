/// <reference types="react" />
import React, { Key } from 'react';

interface contextMenuProps {
    entries: iMenuItem[];
    visible: boolean;
    xPos: number;
    yPos: number;
}
interface iMenuItem {
    label?: string;
    action?: () => void;
}
interface iContextMenuProvider {
    children: React.ReactNode;
}
declare const ContextMenuProvider: ({ children }: iContextMenuProvider) => JSX.Element;

declare const ContextMenu: React.ForwardRefExoticComponent<contextMenuProps & React.RefAttributes<HTMLDivElement>>;

interface TreeNodeProps {
    id: Key;
    indentLevel?: number;
    canRemove?: boolean;
    canRename?: boolean;
    canAddChildren?: boolean;
    canRemoveChildren?: boolean;
    canRenameChildren?: boolean;
    refresh?: () => void;
}
declare const TreeNode: ({ id, canRemove, canRename, canAddChildren, canRemoveChildren, canRenameChildren, }: TreeNodeProps) => JSX.Element;

interface iNodeUpdate {
    success: boolean;
    ErrorText?: string;
}
interface TreeNodeBase {
    id: Key;
    label: string;
    parentId?: Key;
}
interface TreeNodeData<T> {
    id: Key;
    label: string;
    parentId?: Key;
    data: T;
}

interface iTreeOfNodes<T> {
    id: string;
    nodeList: TreeNodeData<T>[];
    roots: Key[];
    selectedId?: Key;
    handleSelect?: (ret: Key) => void;
    onAdd?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
    onRename?: (childId: Key, newName: string) => Promise<iNodeUpdate>;
    onRemove?: (childId: Key) => Promise<iNodeUpdate>;
    canAddRoot?: boolean;
    canRemoveRoot?: boolean;
    canRenameRoot?: boolean;
    canAddChildren?: boolean;
    canRemoveChildren?: boolean;
    canRenameChildren?: boolean;
}
declare const TreeOfNodes: <T extends unknown>({ id, nodeList, roots, canRemoveRoot, canRenameRoot, canAddChildren, canRemoveChildren, canRenameChildren, selectedId, handleSelect, onAdd, onRename, onRemove, }: iTreeOfNodes<T>) => JSX.Element;

interface WordEntryProps {
    id: Key;
    value?: string;
    editing?: boolean;
    saving?: boolean;
    setValue?: (ret: string) => void;
    sendEscape?: () => void;
    style?: React.CSSProperties;
}
declare const WordEntry: React.ForwardRefExoticComponent<WordEntryProps & React.RefAttributes<HTMLInputElement>>;

interface Props {
    title: string;
}
declare function ComputeMenu(props: Props): JSX.Element;

export { ComputeMenu, ContextMenu, ContextMenuProvider, TreeNode, TreeNodeBase, TreeNodeData, TreeOfNodes, WordEntry, iNodeUpdate };
