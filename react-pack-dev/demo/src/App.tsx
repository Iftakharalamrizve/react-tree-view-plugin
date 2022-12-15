import React, { Key, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { TreeNodeData, TreeOfNodes } from '../../src/main';

export default () => {
  const [nodeList, setNodeList] = useState<TreeNodeData<{ value: number } | number | undefined>[]>([
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
  ]);
  const [selectedId, setSelectedId] = useState<Key>();

  return (
    <Container>
      <Row
        style={{
          margin: '1rem',
          border: '1px solid black',
          borderRadius: '4px',
          backgroundColor: 'white',
        }}
      >
        <Col
          sm={12}
          style={{ height: '600px' }}
        >
          <h4>Tree of nodes</h4>
          <TreeOfNodes<{ value: number } | number | undefined>
            id={'nodetree'}
            nodeList={nodeList}
            roots={[0, 'X']}
            canAddChildren
            canRemoveChildren
            canRenameChildren
            canRenameRoot
            canRemoveRoot
            selectedId={selectedId}
            handleSelect={async (i) => setSelectedId(i)}
            onAdd={async (p, n) => {
              const newId =
                (Math.max(
                  ...nodeList.filter((n) => typeof n.id === 'number').map((n) => n.id as number),
                ) ?? 0) + 1;
              setNodeList([...nodeList, { id: newId, parentId: p, label: n, data: newId }]);
              return { success: true };
            }}
            onRename={async (i, n) => {
              const ix = nodeList.findIndex((n) => n.id === i);
              if (ix === -1) return { success: false };
              const newNodes = [...nodeList];
              newNodes.splice(ix, 1, { ...nodeList[ix], label: n });
              setNodeList(newNodes);
              return { success: true };
            }}
            onRemove={async (i) => {
              const ix = nodeList.findIndex((n) => n.id === i);
              if (ix === -1) return { success: false };
              const newNodes = [...nodeList];
              newNodes.splice(ix, 1);
              setNodeList(newNodes);
              return { success: true };
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};
