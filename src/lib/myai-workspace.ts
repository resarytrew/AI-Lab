import {starterLessons, type StarterLessonId} from '../content/learning-path';

export const MYAI_WORKSPACE_STORAGE_KEY = 'ai-lab:my-ai-workspace:v1';
export const MYAI_WORKSPACE_EVENT = 'ai-lab:my-ai-workspace-changed';

export type WorkspaceFileKind = 'python' | 'markdown' | 'json' | 'text';

export type MyAiWorkspaceFile = {
  path: string;
  content: string;
  kind: WorkspaceFileKind;
  sourceLessonId?: StarterLessonId;
  starterContent?: string;
  createdAt: string;
  updatedAt: string;
};

export type MyAiWorkspace = {
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
  files: Record<string, MyAiWorkspaceFile>;
};

export type WorkspaceTreeNode = {
  name: string;
  path: string;
  type: 'folder' | 'file';
  kind?: WorkspaceFileKind;
  children?: WorkspaceTreeNode[];
};

const BASE_README = `# MyAI

This project grows with you through AI Lab.

- \`my_ai/modules/\` contains the Python modules you build in Engineer lessons.
- Every edit is saved in the browser workspace automatically.
- Export the project whenever you want a portable copy.

The code is intentionally small and readable: each module should explain one idea before the final model connects them together.
`;

function nowIso() {
  return new Date().toISOString();
}

function fileKind(path: string): WorkspaceFileKind {
  if (path.endsWith('.py')) return 'python';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.json')) return 'json';
  return 'text';
}

function createFile(
  path: string,
  content: string,
  createdAt: string,
  options: Pick<MyAiWorkspaceFile, 'sourceLessonId' | 'starterContent'> = {},
): MyAiWorkspaceFile {
  return {
    path,
    content,
    kind: fileKind(path),
    createdAt,
    updatedAt: createdAt,
    ...options,
  };
}

export function createEmptyWorkspace(createdAt = nowIso()): MyAiWorkspace {
  const files = [
    createFile('README.md', BASE_README, createdAt),
    createFile('my_ai/__init__.py', '"""MyAI package built through AI Lab."""\n', createdAt),
    createFile('my_ai/modules/__init__.py', '"""Learning modules accumulated lesson by lesson."""\n', createdAt),
  ];

  return {
    schemaVersion: 1,
    createdAt,
    updatedAt: createdAt,
    files: Object.fromEntries(files.map((file) => [file.path, file])),
  };
}

export function lessonModulePath(lessonId: StarterLessonId) {
  const lesson = starterLessons.find((candidate) => candidate.id === lessonId);
  const index = (lesson?.index ?? 0) + 1;
  const safeName = lessonId.replaceAll('-', '_');
  return `my_ai/modules/${String(index).padStart(2, '0')}_${safeName}.py`;
}

export function ensureLessonModule(
  workspace: MyAiWorkspace,
  lessonId: StarterLessonId,
  starterCode: string,
  updatedAt = nowIso(),
): MyAiWorkspace {
  const path = lessonModulePath(lessonId);
  if (workspace.files[path]) return workspace;

  return {
    ...workspace,
    updatedAt,
    files: {
      ...workspace.files,
      [path]: createFile(path, starterCode, updatedAt, {
        sourceLessonId: lessonId,
        starterContent: starterCode,
      }),
    },
  };
}

export function updateWorkspaceFile(
  workspace: MyAiWorkspace,
  path: string,
  content: string,
  updatedAt = nowIso(),
): MyAiWorkspace {
  const current = workspace.files[path];
  if (!current || current.content === content) return workspace;

  return {
    ...workspace,
    updatedAt,
    files: {
      ...workspace.files,
      [path]: {
        ...current,
        content,
        updatedAt,
      },
    },
  };
}

export function resetWorkspaceFile(
  workspace: MyAiWorkspace,
  path: string,
  updatedAt = nowIso(),
): MyAiWorkspace {
  const current = workspace.files[path];
  if (!current?.starterContent) return workspace;
  return updateWorkspaceFile(workspace, path, current.starterContent, updatedAt);
}

function normalizeWorkspace(value: unknown): MyAiWorkspace {
  const fallback = createEmptyWorkspace();
  if (!value || typeof value !== 'object') return fallback;

  const candidate = value as Partial<MyAiWorkspace>;
  if (candidate.schemaVersion !== 1 || !candidate.files || typeof candidate.files !== 'object') {
    return fallback;
  }

  const base = createEmptyWorkspace(candidate.createdAt || fallback.createdAt);
  const files: Record<string, MyAiWorkspaceFile> = {...base.files};

  for (const [path, rawFile] of Object.entries(candidate.files)) {
    if (!rawFile || typeof rawFile !== 'object') continue;
    const file = rawFile as Partial<MyAiWorkspaceFile>;
    if (typeof file.content !== 'string') continue;
    files[path] = {
      path,
      content: file.content,
      kind: file.kind ?? fileKind(path),
      sourceLessonId: file.sourceLessonId,
      starterContent: file.starterContent,
      createdAt: file.createdAt ?? candidate.createdAt ?? fallback.createdAt,
      updatedAt: file.updatedAt ?? candidate.updatedAt ?? fallback.updatedAt,
    };
  }

  return {
    schemaVersion: 1,
    createdAt: candidate.createdAt ?? fallback.createdAt,
    updatedAt: candidate.updatedAt ?? fallback.updatedAt,
    files,
  };
}

export function loadMyAiWorkspace(storage?: Pick<Storage, 'getItem'>): MyAiWorkspace {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
  if (!target) return createEmptyWorkspace();

  try {
    const raw = target.getItem(MYAI_WORKSPACE_STORAGE_KEY);
    return raw ? normalizeWorkspace(JSON.parse(raw)) : createEmptyWorkspace();
  } catch {
    return createEmptyWorkspace();
  }
}

export function persistMyAiWorkspace(
  workspace: MyAiWorkspace,
  storage?: Pick<Storage, 'setItem'>,
) {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
  if (!target) return;
  target.setItem(MYAI_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MYAI_WORKSPACE_EVENT));
}

export function buildWorkspaceTree(workspace: MyAiWorkspace): WorkspaceTreeNode[] {
  const root: WorkspaceTreeNode[] = [];

  for (const file of Object.values(workspace.files).sort((left, right) => left.path.localeCompare(right.path))) {
    const segments = file.path.split('/');
    let level = root;
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isFile = index === segments.length - 1;
      let node = level.find((candidate) => candidate.name === segment);

      if (!node) {
        node = isFile
          ? {name: segment, path: currentPath, type: 'file', kind: file.kind}
          : {name: segment, path: currentPath, type: 'folder', children: []};
        level.push(node);
      }

      if (!isFile) level = node.children ?? [];
    });
  }

  const sortNodes = (nodes: WorkspaceTreeNode[]) => {
    nodes.sort((left, right) => {
      if (left.type !== right.type) return left.type === 'folder' ? -1 : 1;
      return left.name.localeCompare(right.name);
    });
    for (const node of nodes) if (node.children) sortNodes(node.children);
  };

  sortNodes(root);
  return root;
}

export function getWorkspaceLessonCount(workspace: MyAiWorkspace) {
  return new Set(
    Object.values(workspace.files)
      .map((file) => file.sourceLessonId)
      .filter((lessonId): lessonId is StarterLessonId => Boolean(lessonId)),
  ).size;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const year = Math.max(1980, date.getFullYear());
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = (year - 1980) << 9 | (date.getMonth() + 1) << 5 | date.getDate();
  return {time, day};
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}

function concatBytes(chunks: Uint8Array[]) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

type ArchiveEntry = {path: string; content: string};

export function createWorkspaceZipBytes(
  workspace: MyAiWorkspace,
  exportedAt = nowIso(),
): Uint8Array {
  const encoder = new TextEncoder();
  const entries: ArchiveEntry[] = Object.values(workspace.files)
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((file) => ({path: file.path, content: file.content}));

  entries.push({
    path: 'ai-lab-project.json',
    content: `${JSON.stringify({
      schemaVersion: workspace.schemaVersion,
      exportedAt,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      lessonModules: getWorkspaceLessonCount(workspace),
      files: entries.map((entry) => entry.path),
    }, null, 2)}\n`,
  });

  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let localOffset = 0;
  const {time, day} = dosDateTime(new Date(exportedAt));

  for (const entry of entries) {
    const name = encoder.encode(entry.path);
    const data = encoder.encode(entry.content);
    const checksum = crc32(data);

    const localHeader = new Uint8Array(30 + name.byteLength);
    const localView = new DataView(localHeader.buffer);
    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0x0800);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, time);
    writeUint16(localView, 12, day);
    writeUint32(localView, 14, checksum);
    writeUint32(localView, 18, data.byteLength);
    writeUint32(localView, 22, data.byteLength);
    writeUint16(localView, 26, name.byteLength);
    writeUint16(localView, 28, 0);
    localHeader.set(name, 30);
    localChunks.push(localHeader, data);

    const centralHeader = new Uint8Array(46 + name.byteLength);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0x0800);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, time);
    writeUint16(centralView, 14, day);
    writeUint32(centralView, 16, checksum);
    writeUint32(centralView, 20, data.byteLength);
    writeUint32(centralView, 24, data.byteLength);
    writeUint16(centralView, 28, name.byteLength);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, localOffset);
    centralHeader.set(name, 46);
    centralChunks.push(centralHeader);

    localOffset += localHeader.byteLength + data.byteLength;
  }

  const localBytes = concatBytes(localChunks);
  const centralBytes = concatBytes(centralChunks);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralBytes.byteLength);
  writeUint32(endView, 16, localBytes.byteLength);
  writeUint16(endView, 20, 0);

  return concatBytes([localBytes, centralBytes, end]);
}

export function downloadMyAiWorkspace(workspace: MyAiWorkspace) {
  if (typeof window === 'undefined') return;
  const bytes = createWorkspaceZipBytes(workspace);
  const blob = new Blob([bytes], {type: 'application/zip'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'my-ai-project.zip';
  anchor.click();
  URL.revokeObjectURL(url);
}
