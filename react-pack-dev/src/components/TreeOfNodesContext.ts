import { createContext, Key } from 'react';

export interface iNodeUpdate {
  success: boolean;
  ErrorText?: string;
}

export interface TreeNodeBase {
  id: Key;
  label: string;
  parentId?: Key;
}

export interface TreeNodeData<T> {
  id: Key;
  label: string;
  parentId?: Key;
  data: T;
}

export interface TreeOfNodesContextData<T> {
  id: string;
  nodeList: TreeNodeData<T>[];
  selectedId?: Key;
  handleSelect?: (ret: Key) => void;
  expandedNodes?: Key[];
  handleExpandClick?: (ret: Key, force?: boolean) => void;
  onAddChild?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRename?: (id: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (id: Key) => Promise<iNodeUpdate>;
}

export const TreeOfNodesContext = createContext<TreeOfNodesContextData<unknown>>({
  id: 'tree-of-nodes',
  nodeList: [],
});
