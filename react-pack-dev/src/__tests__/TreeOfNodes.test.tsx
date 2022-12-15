import { queryByAttribute, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeOfNodes } from '../components/TreeOfNodes';
import { mockNodes } from '../__mocks__/mockNodes';

const getById = queryByAttribute.bind(null, 'id');

describe('Tree of node', () => {
  test('Empty render, click expand', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TreeOfNodes
        id={'node-tree'}
        nodeList={mockNodes}
        roots={[0]}
      />,
    );
    const child = getById(container, 'node-tree-treenode-child-A');
    const expander = getById(container, 'node-tree-treenode-caret-0');
    expect(child?.style.visibility).toEqual('hidden');
    await user.click(expander as HTMLElement);
    expect(child?.style.visibility).toEqual('inherit');
    const closer = getById(container, 'node-tree-treenode-caret-0');
    await user.click(closer as HTMLElement);
    expect(child?.style.visibility).toEqual('hidden');
  });
});
