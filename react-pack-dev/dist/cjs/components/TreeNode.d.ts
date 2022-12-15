import { Key } from 'react';
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
export declare const TreeNode: ({ id, canRemove, canRename, canAddChildren, canRemoveChildren, canRenameChildren, }: TreeNodeProps) => JSX.Element;
export {};
