import { Key } from 'react';
import { iNodeUpdate, TreeNodeData } from './TreeOfNodesContext';
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
export declare const TreeOfNodes: <T extends unknown>({ id, nodeList, roots, canRemoveRoot, canRenameRoot, canAddChildren, canRemoveChildren, canRenameChildren, selectedId, handleSelect, onAdd, onRename, onRemove, }: iTreeOfNodes<T>) => JSX.Element;
export {};
