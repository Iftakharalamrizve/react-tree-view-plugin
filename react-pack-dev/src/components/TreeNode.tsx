import React, { Key, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  CaretDownFill,
  CaretRight,
  CaretRightFill,
  ExclamationCircleFill,
} from 'react-bootstrap-icons';
import { iMenuItem, MenuContext } from './ContextMenuProvider';
import { iNodeUpdate, TreeOfNodesContext } from './TreeOfNodesContext';
import { WordEntry } from './WordEntry';

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

export const TreeNode = ({
  id,
  canRemove,
  canRename,
  canAddChildren,
  canRemoveChildren,
  canRenameChildren,
}: TreeNodeProps): JSX.Element => {
  // Contexts
  const treeContext = useContext(TreeOfNodesContext);
  const menuContext = useContext(MenuContext);

  // Node information
  const thisNode = useMemo(
    () => treeContext.nodeList.find((n) => n.id === id),
    [id, treeContext.nodeList],
  );
  const childNodes = useMemo(
    () => treeContext.nodeList.filter((n) => n.parentId === id),
    [id, treeContext.nodeList],
  );

  // State
  const loading = useMemo<boolean>(
    () => treeContext.nodeList.findIndex((n) => n.id === id) === -1,
    [id, treeContext.nodeList],
  );
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrotText] = useState<string | null>(null);
  const expanded = useMemo(() => {
    return (treeContext.expandedNodes?.findIndex((e) => e === id) ?? -1) > -1;
  }, [id, treeContext.expandedNodes]);

  // // Apply selected borer
  const currentBorder = useMemo<string>(() => {
    return id === treeContext.selectedId ? '1px solid black' : '';
  }, [id, treeContext.selectedId]);

  // New node parameters
  const newNameRef = useRef<HTMLInputElement | null>(null);
  const [showNewNode, setShowNewNode] = useState<boolean>(false);
  const [savingNewNode, setSavingNewNode] = useState<boolean>(false);

  // Rename parameters
  const currentNameRef = useRef<HTMLInputElement | null>(null);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [updatingNode, setUpdatingNode] = useState<boolean>(false);

  // Context functions
  const handleReturn = useCallback((ret: iNodeUpdate) => {
    if (!ret.success) {
      setError(true);
      setErrotText(ret.ErrorText ?? 'An unknown error has occured');
    } else {
      setError(false);
      setErrotText(null);
    }
  }, []);

  const confirmNewNode = useCallback(
    async (label: string) => {
      setSavingNewNode(true);
      if (treeContext.onAddChild) {
        handleReturn(await treeContext.onAddChild(id, label));
      }
      setSavingNewNode(false);
      setShowNewNode(false);
    },
    [handleReturn, id, treeContext],
  );

  const renameNode = useCallback(
    async (newLabel: string) => {
      setRenaming(false);
      setUpdatingNode(true);
      if (treeContext.onRename) {
        handleReturn(await treeContext.onRename(id, newLabel));
      }
      setUpdatingNode(false);
    },
    [handleReturn, id, treeContext],
  );

  const deleteThis = useCallback(async () => {
    setUpdatingNode(true);
    if (treeContext.onRemove) {
      handleReturn(await treeContext.onRemove(id));
    }
    setUpdatingNode(false);
  }, [handleReturn, id, treeContext]);

  // Context actions
  const addChild = useCallback(() => {
    if (menuContext.set) {
      menuContext.set({ visible: false });
      setShowNewNode(true);
      treeContext.handleExpandClick && treeContext.handleExpandClick(id, true);
    }
  }, [id, menuContext, treeContext]);
  useEffect(() => {
    if (showNewNode === true && newNameRef.current) newNameRef.current.focus();
  }, [showNewNode]);
  const renameThis = useCallback(() => {
    if (menuContext.set) {
      menuContext.set({ visible: false });
      setRenaming(true);
    }
  }, [menuContext]);
  useEffect(() => {
    if (renaming === true && currentNameRef.current) currentNameRef.current.focus();
  }, [renaming]);
  const removeThis = useCallback(() => {
    if (menuContext.set) {
      menuContext.set({ visible: false });
      deleteThis();
    }
  }, [menuContext, deleteThis]);

  // Context menu
  const showMenu = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const menuItems: iMenuItem[] = [];
      if (canAddChildren) {
        menuItems.push({ label: 'Add', action: addChild });
      }
      if (canRename) {
        menuItems.push({ label: 'Rename', action: renameThis });
      }
      if (canRemove && (childNodes === undefined || childNodes.length === 0)) {
        menuItems.push({ label: 'Delete', action: removeThis });
      }
      if (typeof menuContext.set === 'function') {
        menuContext.set({
          visible: true,
          y: e.pageY,
          x: e.pageX,
          menuItems: menuItems,
        });
      }
    },
    [
      addChild,
      canAddChildren,
      canRemove,
      canRename,
      childNodes,
      menuContext,
      removeThis,
      renameThis,
    ],
  );

  // Return node
  return (
    <div
      id={`${treeContext.id}-treenode-${id}`}
      className='treenode'
      onClickCapture={() => treeContext.handleSelect && treeContext.handleSelect(id)}
      onContextMenuCapture={() => treeContext.handleSelect && treeContext.handleSelect(id)}
      onFocusCapture={() => treeContext.handleSelect && treeContext.handleSelect(id)}
    >
      {error ? (
        <>
          <ExclamationCircleFill color='var(--bs-danger)' />{' '}
          {errorText && errorText !== '' ? errorText : 'An unknown error has occured'}
        </>
      ) : loading ? (
        <>
          <Spinner
            size='sm'
            animation='border'
          />{' '}
          Loading...
        </>
      ) : (
        <span onContextMenu={showMenu}>
          {childNodes !== undefined && childNodes.length > 0 ? (
            !expanded ? (
              <CaretRightFill
                role='button'
                aria-expanded={false}
                id={`${treeContext.id}-treenode-caret-${id}`}
                onClick={() => treeContext.handleExpandClick && treeContext.handleExpandClick(id)}
              />
            ) : (
              <CaretDownFill
                role='button'
                aria-expanded={true}
                id={`${treeContext.id}-treenode-caret-${id}`}
                onClick={() => treeContext.handleExpandClick && treeContext.handleExpandClick(id)}
              />
            )
          ) : (
            <CaretRight
              role='button'
              aria-expanded={false}
              aria-disabled={true}
            />
          )}
          {thisNode && (
            <WordEntry
              id={`${treeContext.id}-treenode-entry-${id}`}
              ref={currentNameRef}
              value={thisNode.label}
              editing={renaming}
              saving={updatingNode}
              setValue={(ret) => renameNode(ret)}
              sendEscape={() => setRenaming(false)}
              style={{
                border: currentBorder,
                margin: currentBorder === '' ? '1px' : '',
                backgroundColor: currentBorder === '' ? '' : 'lightgrey',
              }}
            />
          )}
        </span>
      )}
      {childNodes !== undefined &&
        childNodes.map((h, i) => (
          <span
            key={h.id}
            id={`${treeContext.id}-treenode-child-${h.id}`}
            style={{
              marginLeft: '16px',
              display: 'block',
              maxHeight: expanded ? '99999px' : '0px',
              height: expanded ? 'auto' : '0px',
              overflowY: 'hidden',
              visibility: expanded ? 'inherit' : 'hidden',
              opacity: expanded ? 1 : 0,
              transition: 'visibility .3s, opacity .3s ease-in-out, max-height 0.3s ease-in-out',
            }}
          >
            <TreeNode
              id={h.id}
              canRemove={canRemoveChildren}
              canRename={canRenameChildren}
              canAddChildren={canAddChildren}
              canRemoveChildren={canRemoveChildren}
              canRenameChildren={canRenameChildren}
            />
          </span>
        ))}
      {showNewNode && (
        <div>
          <WordEntry
            style={{ marginLeft: '14px' }}
            id={`treenode-new-${id}`}
            ref={newNameRef}
            editing={true}
            setValue={(ret) => {
              confirmNewNode(ret);
            }}
            saving={savingNewNode}
            sendEscape={() => {
              setShowNewNode(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
