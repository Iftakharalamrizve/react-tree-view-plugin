import { TreeNodeData } from 'components/TreeOfNodesContext';

export const mockNodes: TreeNodeData<{ value: number } | number | undefined>[] = [
  { id: 0, label: 'Root', data: { value: 0 } },
  { id: 'A', parentId: 0, label: 'A', data: { value: 3 } },
  { id: 'B', parentId: 'A', label: 'Be', data: { value: 9 } },
  { id: 'X', label: 'Ex', data: 16 },
  { id: 'Y', parentId: 'X', label: 'Why?', data: { value: 18 } },
  { id: 'Z', parentId: 'X', label: 'Zed', data: -23 },
  { id: 1, parentId: 0, label: 'One', data: undefined },
  { id: 2, parentId: 1, label: 'One.Two', data: { value: 32 } },
  { id: 3, parentId: 1, label: 'One.Three', data: { value: 12 } },
  { id: 4, parentId: 1, label: 'One.Four', data: -1 },
];
