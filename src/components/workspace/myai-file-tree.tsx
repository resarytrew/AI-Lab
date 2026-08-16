'use client';

import type {WorkspaceTreeNode} from '../../lib/myai-workspace';
import styles from './myai-workspace.module.css';

type FileTreeProps = {
  nodes: WorkspaceTreeNode[];
  activePath?: string | null;
  onSelect?: (path: string) => void;
  compact?: boolean;
};

function iconFor(node: WorkspaceTreeNode) {
  if (node.type === 'folder') return '▾';
  if (node.kind === 'python') return 'Py';
  if (node.kind === 'markdown') return 'Md';
  if (node.kind === 'json') return '{}';
  return '·';
}

function TreeLevel({
  nodes,
  activePath,
  onSelect,
  depth,
}: {
  nodes: WorkspaceTreeNode[];
  activePath?: string | null;
  onSelect?: (path: string) => void;
  depth: number;
}) {
  return (
    <div className={styles.treeLevel}>
      {nodes.map((node) => (
        <div key={node.path}>
          {node.type === 'folder' ? (
            <div className={styles.folderRow} style={{paddingLeft: `${depth * 13 + 8}px`}}>
              <span>{iconFor(node)}</span>
              <b>{node.name}</b>
            </div>
          ) : (
            <button
              type="button"
              className={node.path === activePath ? styles.fileRowActive : styles.fileRow}
              style={{paddingLeft: `${depth * 13 + 8}px`}}
              onClick={() => onSelect?.(node.path)}
              disabled={!onSelect}
              title={node.path}
            >
              <span>{iconFor(node)}</span>
              <b>{node.name}</b>
            </button>
          )}
          {node.children?.length ? (
            <TreeLevel
              nodes={node.children}
              activePath={activePath}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function MyAiFileTree({nodes, activePath, onSelect, compact = false}: FileTreeProps) {
  return (
    <aside className={compact ? styles.fileTreeCompact : styles.fileTree} aria-label="MyAI workspace files">
      <div className={styles.treeHeader}>
        <span>MYAI</span>
        <small>WORKSPACE</small>
      </div>
      <TreeLevel nodes={nodes} activePath={activePath} onSelect={onSelect} depth={0} />
    </aside>
  );
}
