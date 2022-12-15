import { act, fireEvent, queryByAttribute, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenuProvider, MenuContext } from '../components/ContextMenuProvider';
import { TreeNode } from '../components/TreeNode';
import { TreeOfNodesContext } from '../components/TreeOfNodesContext';
import { mockNodes } from '../__mocks__/mockNodes';

const getById = queryByAttribute.bind(null, 'id');

describe('Tree node', () => {
  test('Empty render', async () => {
    const { container } = render(<TreeNode id={'test'} />);
    const tn = container.querySelector('#tree-of-nodes-treenode-test') as HTMLElement;
    expect(tn).toBeInTheDocument();
  });

  test('Render with context', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <MenuContext.Provider value={{}}>
          <TreeOfNodesContext.Provider value={{ id: 'test-tree', nodeList: mockNodes }}>
            <TreeNode id={0} />
          </TreeOfNodesContext.Provider>
        </MenuContext.Provider>,
        { container },
      );
    });
    const tn = container.querySelector('#test-tree-treenode-0') as HTMLElement;
    expect(tn).toBeInTheDocument();
  });

  test('Context menu actions, nowt', async () => {
    const user = userEvent.setup();
    const mockRename = jest.fn(async () => {
      return { success: true };
    });
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <ContextMenuProvider>
          <TreeOfNodesContext.Provider
            value={{
              id: 'test-tree',
              nodeList: mockNodes,
              expandedNodes: mockNodes.map((n) => n.id),
              onRename: mockRename,
            }}
          >
            <TreeNode
              id={0}
              canRename={true}
            />
          </TreeOfNodesContext.Provider>
        </ContextMenuProvider>,
        { container },
      );
    });
    const we = screen.getByText('Root');
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const ren = screen.getByText('Rename');
    const child = screen.getByText('One.Four');
    expect(child).toBeInTheDocument();
    await user.click(child);
  });

  test('Context menu actions, rename', async () => {
    const user = userEvent.setup();
    const mockRename = jest.fn(async () => {
      return { success: true };
    });
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <ContextMenuProvider>
          <TreeOfNodesContext.Provider
            value={{
              id: 'test-tree',
              nodeList: mockNodes,
              expandedNodes: mockNodes.map((n) => n.id),
              onRename: mockRename,
            }}
          >
            <TreeNode
              id={0}
              canRename={true}
            />
          </TreeOfNodesContext.Provider>
        </ContextMenuProvider>,
        { container },
      );
    });
    const we = screen.getByText('Root');
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const ren = screen.getByText('Rename');
    expect(ren).toBeInTheDocument();
    await user.click(ren);
    const rootInput = getById(container, 'test-tree-treenode-entry-0');
    expect(rootInput).toBeInTheDocument();
    expect(rootInput?.tagName).toEqual('INPUT');
    await act(async () => {
      await user.clear(rootInput as HTMLInputElement);
      await user.type(rootInput as HTMLInputElement, 'new name');
      fireEvent.blur(rootInput as HTMLInputElement);
    });
    expect(mockRename).toHaveBeenCalledWith(0, 'new name');
  });

  test('Context menu actions, remove', async () => {
    const user = userEvent.setup();
    const mockRemove = jest.fn(async () => {
      return { success: false };
    });
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <ContextMenuProvider>
          <TreeOfNodesContext.Provider
            value={{
              id: 'test-tree',
              nodeList: mockNodes,
              expandedNodes: mockNodes.map((n) => n.id),
              onRemove: mockRemove,
              selectedId: 4,
            }}
          >
            <TreeNode
              id={4}
              canRemove={true}
            />
          </TreeOfNodesContext.Provider>
        </ContextMenuProvider>,
        { container },
      );
    });
    const we = screen.getByText('One.Four');
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const del = screen.getByText('Delete');
    expect(del).toBeInTheDocument();
    await user.click(del);
    expect(screen.getByText('An unknown error has occured')).toBeInTheDocument();
  });

  test('Context menu actions, add', async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <ContextMenuProvider>
          <TreeOfNodesContext.Provider
            value={{
              id: 'test-tree',
              nodeList: mockNodes,
              expandedNodes: mockNodes.map((n) => n.id),
              onAddChild: mockAdd,
              handleSelect: mockSelect,
              handleExpandClick: mockExpand,
              selectedId: 4,
            }}
          >
            <TreeNode
              id={4}
              canAddChildren={true}
            />
          </TreeOfNodesContext.Provider>
        </ContextMenuProvider>,
        { container },
      );
    });
    const we = screen.getByText('One.Four');
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    expect(mockSelect).toHaveBeenCalled();
    const add = screen.getByText('Add');
    expect(add).toBeInTheDocument();
    await user.click(add);
    const newNode = getById(container, 'treenode-new-4');
    expect(newNode?.tagName).toEqual('INPUT');
    await act(async () => {
      await user.clear(newNode as HTMLInputElement);
      await user.type(newNode as HTMLInputElement, 'new name');
      fireEvent.blur(newNode as HTMLInputElement);
    });
    expect(mockAdd).toHaveBeenCalledWith(4, 'new name');
    expect(mockExpand).toHaveBeenCalled();
  });

  test('Context menu actions, add + escape', async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      render(
        <ContextMenuProvider>
          <TreeOfNodesContext.Provider
            value={{
              id: 'test-tree',
              nodeList: mockNodes,
              expandedNodes: mockNodes.map((n) => n.id),
              onAddChild: mockAdd,
              handleSelect: mockSelect,
              handleExpandClick: mockExpand,
              selectedId: 4,
            }}
          >
            <TreeNode
              id={4}
              canAddChildren={true}
            />
          </TreeOfNodesContext.Provider>
        </ContextMenuProvider>,
        { container },
      );
    });
    const we = screen.getByText('One.Four');
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    expect(mockSelect).toHaveBeenCalled();
    const add = screen.getByText('Add');
    expect(add).toBeInTheDocument();
    await user.click(add);
    const newNode = getById(container, 'treenode-new-4');
    expect(newNode?.tagName).toEqual('INPUT');
    await act(async () => {
      await user.clear(newNode as HTMLInputElement);
      await user.type(newNode as HTMLInputElement, 'new name');
      await user.keyboard('{Escape}');
    });
    expect(mockAdd).not.toHaveBeenCalledWith(4, 'new name');
    expect(newNode).not.toBeInTheDocument();
  });
});
