import {describe, expect, it} from 'vitest';
import {starterLessons} from '../content/learning-path';
import {
  buildWorkspaceTree,
  createEmptyWorkspace,
  createWorkspaceZipBytes,
  ensureLessonModule,
  getWorkspaceLessonCount,
  lessonModulePath,
  updateWorkspaceFile,
} from './myai-workspace';

describe('MyAI workspace', () => {
  it('creates stable module paths that form a Python package', () => {
    expect(lessonModulePath('smart-machine')).toBe('my_ai/modules/01_smart_machine.py');
    expect(lessonModulePath('first-language-model')).toBe('my_ai/modules/15_first_language_model.py');
  });

  it('accumulates one persistent module per visited Engineer lesson', () => {
    let workspace = createEmptyWorkspace('2026-08-16T10:00:00.000Z');
    workspace = ensureLessonModule(workspace, 'smart-machine', 'print("one")', '2026-08-16T10:01:00.000Z');
    workspace = ensureLessonModule(workspace, 'data-to-meaning', 'print("two")', '2026-08-16T10:02:00.000Z');
    workspace = ensureLessonModule(workspace, 'smart-machine', 'print("replacement")', '2026-08-16T10:03:00.000Z');

    expect(getWorkspaceLessonCount(workspace)).toBe(2);
    expect(workspace.files[lessonModulePath('smart-machine')].content).toBe('print("one")');
  });

  it('keeps edits separate from the original starter code', () => {
    let workspace = createEmptyWorkspace('2026-08-16T10:00:00.000Z');
    workspace = ensureLessonModule(workspace, 'trainable-parameters', 'return ...', '2026-08-16T10:01:00.000Z');
    const path = lessonModulePath('trainable-parameters');
    workspace = updateWorkspaceFile(workspace, path, 'return x * w + b', '2026-08-16T10:02:00.000Z');

    expect(workspace.files[path].content).toBe('return x * w + b');
    expect(workspace.files[path].starterContent).toBe('return ...');
  });

  it('builds a folder-first file tree', () => {
    const workspace = ensureLessonModule(createEmptyWorkspace(), 'smart-machine', 'pass');
    const tree = buildWorkspaceTree(workspace);

    expect(tree[0].name).toBe('my_ai');
    expect(tree.some((node) => node.name === 'README.md')).toBe(true);
  });

  it('exports a valid store-mode ZIP containing workspace files and manifest', () => {
    const workspace = ensureLessonModule(
      createEmptyWorkspace('2026-08-16T10:00:00.000Z'),
      starterLessons[0].id,
      'print("hello")',
      '2026-08-16T10:01:00.000Z',
    );
    const bytes = createWorkspaceZipBytes(workspace, '2026-08-16T10:02:00.000Z');
    const text = new TextDecoder().decode(bytes);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(text).toContain('README.md');
    expect(text).toContain('my_ai/modules/01_smart_machine.py');
    expect(text).toContain('ai-lab-project.json');
  });
});
