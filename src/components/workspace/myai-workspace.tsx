'use client';

import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {useEffect, useMemo, useRef, useState} from 'react';
import {starterLessons} from '../../content/learning-path';
import {
  buildWorkspaceTree,
  downloadMyAiWorkspace,
  getWorkspaceLessonCount,
  type MyAiWorkspace,
  type MyAiWorkspaceFile,
} from '../../lib/myai-workspace';
import {PythonLabClient, type PythonRunResult, resolvePythonWorkerUrl} from '../../lib/python-lab';
import {useMyAiWorkspace} from '../../lib/use-myai-workspace';
import {MyAiFileTree} from './myai-file-tree';
import styles from './myai-workspace.module.css';

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function editorLanguage(file?: MyAiWorkspaceFile) {
  if (file?.kind === 'python') return 'python';
  if (file?.kind === 'markdown') return 'markdown';
  if (file?.kind === 'json') return 'json';
  return 'plaintext';
}

function defaultPath(workspace: MyAiWorkspace) {
  const lessonFile = Object.values(workspace.files)
    .filter((file) => file.sourceLessonId)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
  return lessonFile?.path ?? 'README.md';
}

export function MyAiWorkspaceScreen({locale}: {locale: string}) {
  const {workspace, ready, saveFile, resetFile} = useMyAiWorkspace();
  const [activePath, setActivePath] = useState<string | null>(null);
  const [runtimeState, setRuntimeState] = useState<'idle' | 'loading' | 'ready' | 'running' | 'error'>('idle');
  const [pythonVersion, setPythonVersion] = useState('');
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const runtimeRef = useRef<PythonLabClient | null>(null);

  useEffect(() => {
    if (!workspace) return;
    if (!activePath || !workspace.files[activePath]) setActivePath(defaultPath(workspace));
  }, [activePath, workspace]);

  useEffect(
    () => () => {
      runtimeRef.current?.terminate();
      runtimeRef.current = null;
    },
    [],
  );

  const activeFile = activePath && workspace ? workspace.files[activePath] : undefined;
  const tree = useMemo(() => (workspace ? buildWorkspaceTree(workspace) : []), [workspace]);
  const moduleCount = workspace ? getWorkspaceLessonCount(workspace) : 0;
  const fileCount = workspace ? Object.keys(workspace.files).length : 0;
  const alternateLocale = locale === 'en' ? 'ru' : 'en';
  const runtimeBusy = runtimeState === 'loading' || runtimeState === 'running';

  async function ensureRuntime() {
    if (runtimeRef.current && (runtimeState === 'ready' || runtimeState === 'running')) {
      return runtimeRef.current;
    }
    if (typeof window === 'undefined') return null;

    const client = new PythonLabClient(resolvePythonWorkerUrl(window.location));
    runtimeRef.current = client;
    setRuntimeState('loading');
    setRunResult(null);

    try {
      const response = await client.init();
      if (runtimeRef.current !== client) return null;
      setPythonVersion(response.pythonVersion ?? '');
      setRuntimeState('ready');
      return client;
    } catch (error) {
      client.terminate();
      runtimeRef.current = null;
      setRuntimeState('error');
      setRunResult({
        ok: false,
        stdout: '',
        stderr: '',
        result: '',
        tests: [],
        traceback: error instanceof Error ? error.message : String(error),
        durationMs: 0,
      });
      return null;
    }
  }

  async function runActiveFile() {
    if (!activeFile || activeFile.kind !== 'python' || runtimeBusy) return;
    const client = await ensureRuntime();
    if (!client) return;

    setRuntimeState('running');
    setRunResult(null);
    try {
      const response = await client.run(activeFile.content);
      setRunResult(response);
      setRuntimeState('ready');
    } catch (error) {
      client.terminate();
      runtimeRef.current = null;
      const timedOut = error instanceof Error && error.message === 'PYTHON_TIMEOUT';
      setRunResult({
        ok: false,
        stdout: '',
        stderr: '',
        result: '',
        tests: [],
        traceback: timedOut
          ? tr(locale, 'Программа остановлена по таймауту. Python runtime сброшен.', 'Program stopped after the timeout. The Python runtime was reset.')
          : error instanceof Error
            ? error.message
            : String(error),
        durationMs: 0,
      });
      setRuntimeState('error');
    }
  }

  function restoreStarter() {
    if (!activePath || !activeFile?.starterContent) return;
    const accepted = window.confirm(
      tr(
        locale,
        'Вернуть этот модуль к стартовому коду урока? Текущие изменения в файле будут заменены.',
        'Restore this module to the lesson starter code? Current changes in this file will be replaced.',
      ),
    );
    if (accepted) {
      resetFile(activePath);
      setRunResult(null);
    }
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <Link href={`/${locale}/`} className={styles.brand}>AI LAB</Link>
        <div className={styles.headerTitle}>
          <small>PROJECT WORKSPACE</small>
          <b>MyAI</b>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/journey/${starterLessons[0].slug}`} className={styles.backLink}>
            {tr(locale, 'К урокам', 'Lessons')}
          </Link>
          <Link href={`/${alternateLocale}/my-ai/`} className={styles.localeLink}>{alternateLocale.toUpperCase()}</Link>
          <button
            type="button"
            className={styles.exportButton}
            disabled={!workspace}
            onClick={() => workspace && downloadMyAiWorkspace(workspace)}
          >
            ↓ {tr(locale, 'Экспорт .zip', 'Export .zip')}
          </button>
        </div>
      </header>

      <section className={styles.workspaceGrid}>
        <MyAiFileTree nodes={tree} activePath={activePath} onSelect={(path) => {
          setActivePath(path);
          setRunResult(null);
        }} />

        <section className={styles.editorColumn}>
          <div className={styles.editorTopbar}>
            <code>{activePath ?? tr(locale, 'Загрузка workspace…', 'Loading workspace…')}</code>
            <span>{activeFile?.kind === 'python' ? 'PYTHON' : activeFile?.kind?.toUpperCase()}</span>
          </div>
          <div className={styles.editorShell}>
            {ready && activeFile ? (
              <Editor
                height="100%"
                language={editorLanguage(activeFile)}
                path={activeFile.path}
                theme="vs-dark"
                value={activeFile.content}
                onChange={(value) => {
                  saveFile(activeFile.path, value ?? '');
                  setRunResult(null);
                }}
                options={{
                  automaticLayout: true,
                  accessibilitySupport: 'auto',
                  ariaLabel: tr(locale, 'Редактор проекта MyAI', 'MyAI project editor'),
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                  fontSize: 14,
                  lineHeight: 23,
                  minimap: {enabled: false},
                  padding: {top: 18, bottom: 18},
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: 'on',
                }}
              />
            ) : null}
          </div>

          <section className={styles.console} aria-live="polite">
            <div className={styles.consoleHeader}>
              <b>TERMINAL · PYODIDE</b>
              {runResult ? <span>{runResult.durationMs} ms</span> : <span>{pythonVersion ? `Python ${pythonVersion}` : runtimeState}</span>}
            </div>
            {!runResult ? (
              <p className={styles.consoleEmpty}>
                {activeFile?.kind === 'python'
                  ? tr(locale, 'Запусти активный .py файл. Первый запуск загрузит Python/WebAssembly.', 'Run the active .py file. The first run loads Python/WebAssembly.')
                  : tr(locale, 'Для запуска выбери Python-файл в дереве проекта.', 'Select a Python file in the project tree to run it.')}
              </p>
            ) : null}
            {runResult?.stdout ? <pre>{runResult.stdout}</pre> : null}
            {runResult?.result ? <pre>{runResult.result}</pre> : null}
            {runResult?.stderr ? <div className={styles.consoleError}><pre>{runResult.stderr}</pre></div> : null}
            {runResult?.traceback ? <div className={styles.consoleError}><pre>{runResult.traceback}</pre></div> : null}
          </section>

          <footer className={styles.statusBar}>
            <span>AUTOSAVE</span>
            <span>{tr(locale, 'локально сохранено', 'saved locally')}</span>
            <span>{activeFile?.kind ?? '—'}</span>
            <span>{fileCount} files</span>
          </footer>
        </section>

        <aside className={styles.inspector}>
          <p className={styles.inspectorEyebrow}>BUILD MyAI</p>
          <h1>{tr(locale, 'Твой проект растёт вместе с курсом', 'Your project grows with the course')}</h1>
          <p className={styles.inspectorText}>
            {tr(
              locale,
              'Каждый Engineer-урок создаёт настоящий Python-модуль в этом дереве. Ты можешь вернуться к старому файлу, изменить его и затем забрать весь проект одним ZIP-архивом.',
              'Each Engineer lesson creates a real Python module in this tree. You can revisit older files, change them, and export the whole project as one ZIP archive.',
            )}
          </p>

          <div className={styles.metricGrid}>
            <div><b>{moduleCount}</b><span>{tr(locale, 'модулей уроков', 'lesson modules')}</span></div>
            <div><b>{starterLessons.length}</b><span>{tr(locale, 'в первой дуге', 'in the first arc')}</span></div>
          </div>

          <div className={styles.actionStack}>
            <button
              type="button"
              className={styles.runButton}
              disabled={!activeFile || activeFile.kind !== 'python' || runtimeBusy}
              onClick={() => void runActiveFile()}
            >
              {runtimeBusy ? tr(locale, 'Python работает…', 'Python is running…') : `▶ ${tr(locale, 'Запустить файл', 'Run file')}`}
            </button>
            <button
              type="button"
              className={styles.resetButton}
              disabled={!activeFile?.starterContent}
              onClick={restoreStarter}
            >
              ↺ {tr(locale, 'Стартовый код урока', 'Lesson starter code')}
            </button>
          </div>

          <div className={styles.saveNote}>
            <b>Autosave</b>
            {tr(
              locale,
              'Изменения сохраняются сразу в workspace этого браузера и остаются после перехода на другой урок или перезапуска страницы.',
              'Changes are saved immediately in this browser workspace and survive navigation to another lesson or a page reload.',
            )}
          </div>

          <div className={styles.runtimeNote}>
            <b>{tr(locale, 'Переносимость', 'Portability')}</b>
            {tr(
              locale,
              'Экспорт создаёт обычный ZIP с README, пакетом my_ai, всеми накопленными модулями и manifest-файлом проекта.',
              'Export creates a normal ZIP with README, the my_ai package, every accumulated module, and a project manifest.',
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
