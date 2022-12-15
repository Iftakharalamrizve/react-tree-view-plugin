import { render, screen } from '@testing-library/react';
import { ContextMenu } from '../components/ContextMenu';
import { ContextMenuProvider } from '../components/ContextMenuProvider';

describe('Context menu', () => {
  test('Empty render, click expan', async () => {
    render(
      <ContextMenuProvider>
        <ContextMenu
          entries={[{ label: 'Hello' }]}
          visible={true}
          xPos={0}
          yPos={0}
        />
      </ContextMenuProvider>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
