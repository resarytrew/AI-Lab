'use client';

import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from 'react';
import {getChapterContent} from '@/content/chapter-content';
import {localize, type StarterLessonId} from '@/content/learning-path';
import {
  ensureLessonModule,
  lessonModulePath,
  loadMyAiWorkspace,
  persistMyAiWorkspace,
  resetWorkspaceFile,
  updateWorkspaceFile,
} from '@/lib/myai-workspace';
import {
  buildReferenceSource,
  PythonLabClient,
  type PythonRunResult,
  type PythonRuntimeState,
  resolvePythonWorkerUrl,
} from '@/lib/python-lab';
import chapterStyles from './chapter-experience.module.css';
import monacoStyles from './monaco-python-editor.module.css';

type DepthMode = 'math' | 'engineer' | 'researcher';

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function runtimeLabel(locale: string, state: PythonRuntimeState) {
  const labels: Record<PythonRuntimeState, [string, string]> = {
    idle: ['Python не запущен', 'Python is idle'],
    loading: ['Загружаем Python…', 'Loading Python…'],
    ready: ['Python готов', 'Python ready'],
    running: ['Выполняем код…', 'Running code…'],
    error: ['Runtime остановлен', 'Runtime stopped'],
  };
  const [ru, en] = labels[state];
  return tr(locale, ru, en);
}

export function ChapterExperience({lessonId, locale}: {lessonId: StarterLessonId; locale: string}) {
  const content = getChapterContent(lessonId);
  const workspacePath = lessonModulePath(lessonId);
  const [visualIndex, setVisualIndex] = useState(0);
  const [workedVisible, setWorkedVisible] = useState(1);
  const [mode, setMode] = useState<DepthMode>('math');
  const [mathVisible, setMathVisible] = useState(1);
  const [editorCode, setEditorCode] = useState(content.engineer.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [hypothesis, setHypothesis] = useState<number | null>(null);
  const [experimentRan, setExperimentRan] = useState(false);
  const [runtimeState, setRuntimeState] = useState<PythonRuntimeState>('idle');
  const [pythonVersion, setPythonVersion] = useState('');
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const runtimeRef = useRef<PythonLabClient | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const current = loadMyAiWorkspace();
    const workspace = ensureLessonModule(current, lessonId, content.engineer.starterCode);
    if (workspace !== current) persistMyAiWorkspace(workspace);
    setEditorCode(workspace.files[workspacePath]?.content ?? content.engineer.starterCode);
    setShowSolution(false);
    setRunResult(null);
  }, [content.engineer.starterCode, lessonId, workspacePath]);

  useEffect(() => {
    if (
      mode !== 'engineer' ||
      runtimeState !== 'idle' ||
      runtimeRef.current ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const client = new PythonLabClient(resolvePythonWorkerUrl(window.location));
    runtimeRef.current = client;
    setRuntimeState('loading');
    setRunResult(null);

    client
      .init()
      .then((response) => {
        if (runtimeRef.current !== client) return;
        setPythonVersion(response.pythonVersion ?? '');
        setRuntimeState('ready');
      })
      .catch((error: unknown) => {
        if (runtimeRef.current !== client) return;
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
      });
  }, [mode, runtimeState]);

  useEffect(
    () => () => {
      runtimeRef.current?.terminate();
      runtimeRef.current = null;
    },
    [],
  );

  const activeVisual = content.visualNodes[visualIndex];
  const runtimeBusy = runtimeState === 'loading' || runtimeState === 'running';

  function persistEditorCode(value: string) {
    setEditorCode(value);
    setRunResult(null);
    if (typeof window === 'undefined') return;

    const current = loadMyAiWorkspace();
    const ensured = ensureLessonModule(current, lessonId, content.engineer.starterCode);
    const next = updateWorkspaceFile(ensured, workspacePath, value);
    if (next !== current) persistMyAiWorkspace(next);
  }

  function restoreStarterCode() {
    if (typeof window === 'undefined') return;
    const current = loadMyAiWorkspace();
    const ensured = ensureLessonModule(current, lessonId, content.engineer.starterCode);
    const next = resetWorkspaceFile(ensured, workspacePath);
    if (next !== current) persistMyAiWorkspace(next);
    setEditorCode(next.files[workspacePath]?.content ?? content.engineer.starterCode);
    setRunResult(null);
  }

  async function executePython(withTests: boolean) {
    const client = runtimeRef.current;
    if (!client || runtimeState !== 'ready') return;

    setRuntimeState('running');
    setRunResult(null);

    try {
      const response = withTests
        ? await client.test(
            editorCode,
            buildReferenceSource(content.engineer.starterCode, content.engineer.expected),
          )
        : await client.run(editorCode);
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
          ? tr(
              locale,
              'Выполнение остановлено: программа работала слишком долго. Runtime перезапущен, чтобы бесконечный цикл не зависил страницу.',
              'Execution stopped: the program ran for too long. The runtime was reset so an infinite loop cannot freeze the page.',
            )
          : error instanceof Error
            ? error.message
            : String(error),
        durationMs: 0,
      });
      setRuntimeState('error');
    }
  }

  function retryRuntime() {
    runtimeRef.current?.terminate();
    runtimeRef.current = null;
    setRunResult(null);
    setPythonVersion('');
    setRuntimeState('idle');
  }

  return (
    <div className={chapterStyles.experience}>
      <section className={chapterStyles.visualLab}>
        <div className={chapterStyles.sectionHeading}>
          <p>{tr(locale, 'МИНИ-СХЕМА · исследуй механизм', 'MINI DIAGRAM · explore the mechanism')}</p>
          <h3>{localize(content.visualTitle, locale)}</h3>
          <span>{localize(content.visualCaption, locale)}</span>
        </div>

        <fieldset className={chapterStyles.visualTrack} aria-label={localize(content.visualTitle, locale)}>
          {content.visualNodes.map((node, index) => (
            <div className={chapterStyles.visualUnit} key={`${lessonId}-${node.label.en}`}>
              {index > 0 && <span className={chapterStyles.arrow}>→</span>}
              <button
                type="button"
                className={index === visualIndex ? chapterStyles.visualNodeActive : chapterStyles.visualNode}
                onClick={() => setVisualIndex(index)}
              >
                <small>{String(index + 1).padStart(2, '0')}</small>
                <b>{localize(node.label, locale)}</b>
              </button>
            </div>
          ))}
        </fieldset>

        {activeVisual && (
          <div className={chapterStyles.visualExplanation}>
            <span>{tr(locale, 'Сейчас рассматриваем', 'Now inspecting')}</span>
            <b>{localize(activeVisual.label, locale)}</b>
            <p>{localize(activeVisual.detail, locale)}</p>
          </div>
        )}
      </section>

      <section className={chapterStyles.workedExample}>
        <div className={chapterStyles.sectionHeading}>
          <p>{tr(locale, 'РАЗОБРАННЫЙ ПРИМЕР · шаг за шагом', 'WORKED EXAMPLE · step by step')}</p>
          <h3>{localize(content.workedTitle, locale)}</h3>
          <span>{localize(content.workedScenario, locale)}</span>
        </div>

        <div className={chapterStyles.workedSteps}>
          {content.workedSteps.slice(0, workedVisible).map((step, index) => (
            <article key={`${lessonId}-worked-${step.label.en}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h4>{localize(step.label, locale)}</h4>
                {step.expression && <code>{step.expression}</code>}
                <p>{localize(step.explanation, locale)}</p>
              </div>
            </article>
          ))}
        </div>

        {workedVisible < content.workedSteps.length ? (
          <button
            type="button"
            className={chapterStyles.revealButton}
            onClick={() => setWorkedVisible((value) => value + 1)}
          >
            {tr(locale, 'Показать следующий шаг', 'Reveal next step')} →
          </button>
        ) : (
          <div className={chapterStyles.exampleDone}>✓ {tr(locale, 'Пример разобран полностью', 'Worked example complete')}</div>
        )}
      </section>

      <section className={chapterStyles.depthStudio}>
        <div className={chapterStyles.depthIntro}>
          <p>{tr(locale, 'ТРИ УРОВНЯ ГЛУБИНЫ', 'THREE DEPTH LEVELS')}</p>
          <h3>{tr(locale, 'Теперь открой тот же механизм с другой стороны', 'Now open the same mechanism from another angle')}</h3>
          <span>{tr(locale, 'Core уже объяснил идею. Ниже — математика, код и исследовательский эксперимент. Это не три разных курса, а три представления одного знания.', 'Core explained the idea. Below are math, code, and a research experiment. These are not three different courses, but three views of the same knowledge.')}</span>
        </div>

        <div className={chapterStyles.modeTabs} role="tablist" aria-label={tr(locale, 'Уровни глубины', 'Depth levels')}>
          <button type="button" role="tab" aria-selected={mode === 'math'} className={mode === 'math' ? chapterStyles.modeActive : ''} onClick={() => setMode('math')}>
            <small>01</small><b>{tr(locale, 'Открой капот', 'Open the hood')}</b><span>{tr(locale, 'Математика и механизм', 'Math & mechanism')}</span>
          </button>
          <button type="button" role="tab" aria-selected={mode === 'engineer'} className={mode === 'engineer' ? chapterStyles.modeActive : ''} onClick={() => setMode('engineer')}>
            <small>02</small><b>Engineer</b><span>Code</span>
          </button>
          <button type="button" role="tab" aria-selected={mode === 'researcher'} className={mode === 'researcher' ? chapterStyles.modeActive : ''} onClick={() => setMode('researcher')}>
            <small>03</small><b>Researcher</b><span>Experiment</span>
          </button>
        </div>

        {mode === 'math' && (
          <div className={chapterStyles.depthPanel}>
            <div className={chapterStyles.depthCopy}>
              <p className={chapterStyles.modeEyebrow}>{tr(locale, 'ОТКРОЙ КАПОТ · МАТЕМАТИКА И МЕХАНИЗМ', 'OPEN THE HOOD · MATH & MECHANISM')}</p>
              <h4>{localize(content.math.lead, locale)}</h4>
              {content.math.formula && <div className={chapterStyles.formula}>{content.math.formula}</div>}
              <div className={chapterStyles.symbolGrid}>
                {content.math.symbols.map((symbol) => (
                  <div key={`${lessonId}-${symbol.symbol}`}><code>{symbol.symbol}</code><span>{localize(symbol.meaning, locale)}</span></div>
                ))}
              </div>
              <div className={chapterStyles.mechanismCard}>
                <small>{tr(locale, 'ЧТО ПРОИСХОДИТ ВНУТРИ', 'WHAT HAPPENS INSIDE')}</small>
                <p>{localize(content.math.mechanism, locale)}</p>
              </div>
            </div>

            <div className={chapterStyles.byHand}>
              <p>{tr(locale, 'ПОСЧИТАЙ РУКАМИ', 'BY HAND')}</p>
              {content.math.byHand.slice(0, mathVisible).map((step, index) => (
                <article key={`${lessonId}-math-${step.label.en}`}>
                  <span>{index + 1}</span>
                  <div><b>{localize(step.label, locale)}</b>{step.expression && <code>{step.expression}</code>}<p>{localize(step.explanation, locale)}</p></div>
                </article>
              ))}
              {mathVisible < content.math.byHand.length && (
                <button type="button" onClick={() => setMathVisible((value) => value + 1)}>{tr(locale, 'Следующий шаг вычисления', 'Next calculation step')} →</button>
              )}
            </div>
          </div>
        )}

        {mode === 'engineer' && (
          <div className={chapterStyles.depthPanel}>
            <div className={chapterStyles.depthCopy}>
              <p className={chapterStyles.modeEyebrow}>ENGINEER · CODE</p>
              <h4>{localize(content.engineer.goal, locale)}</h4>
              <div className={chapterStyles.checkpoints}>
                {content.engineer.checkpoints.map((checkpoint, index) => (
                  <div key={`${lessonId}-checkpoint-${checkpoint.en}`}><span>{index + 1}</span><p>{localize(checkpoint, locale)}</p></div>
                ))}
              </div>
              <div className={chapterStyles.challengeCard}>
                <small>{tr(locale, 'ТВОЯ ЗАДАЧА', 'YOUR TASK')}</small>
                <p>{localize(content.engineer.challenge, locale)}</p>
                <div className={monacoStyles.editorInstruction}>
                  {tr(
                    locale,
                    'Исправь код справа. Это файл твоего MyAI-проекта: изменения сохраняются автоматически и останутся после перехода к следующему уроку. ▶ Запустить выполняет настоящий Python, а Проверить тестами сравнивает поведение программы с эталоном.',
                    'Edit the code on the right. This is a real file in your MyAI project: changes are autosaved and remain when you move to another lesson. ▶ Run executes real Python, while Check tests compares your program behavior with the reference.',
                  )}
                </div>

                <div className={monacoStyles.runtimeLine}>
                  <span className={monacoStyles.runtimeDot} data-state={runtimeState} />
                  <b>{runtimeLabel(locale, runtimeState)}</b>
                  {pythonVersion && <code>Python {pythonVersion} · Pyodide</code>}
                </div>

                <div className={chapterStyles.challengeActions}>
                  <button type="button" disabled={runtimeBusy || runtimeState !== 'ready'} onClick={() => void executePython(false)}>
                    ▶ {tr(locale, 'Запустить', 'Run')}
                  </button>
                  <button type="button" disabled={runtimeBusy || runtimeState !== 'ready'} onClick={() => void executePython(true)}>
                    ✓ {tr(locale, 'Проверить тестами', 'Check tests')}
                  </button>
                  <button type="button" className={chapterStyles.textButton} onClick={restoreStarterCode}>
                    {tr(locale, 'Сбросить файл', 'Reset file')}
                  </button>
                  {runtimeState === 'error' && (
                    <button type="button" className={chapterStyles.textButton} onClick={retryRuntime}>
                      {tr(locale, 'Перезапустить Python', 'Restart Python')}
                    </button>
                  )}
                  <button type="button" className={chapterStyles.textButton} onClick={() => setShowSolution((value) => !value)}>
                    {showSolution ? tr(locale, 'Скрыть решение', 'Hide solution') : tr(locale, 'Показать решение', 'Show solution')}
                  </button>
                </div>

                {runResult?.tests.length ? (
                  <div className={runResult.testsPassed ? chapterStyles.correct : chapterStyles.incorrect}>
                    {runResult.testsPassed
                      ? tr(locale, '✓ Все runtime-тесты прошли. Файл сохранён в MyAI. Теперь объясни, почему код работает.', '✓ All runtime tests passed. The file is saved in MyAI. Now explain why the code works.')
                      : tr(locale, 'Не все тесты прошли. Посмотри результаты в консоли и исправь программу.', 'Some tests failed. Inspect the console results and fix the program.')}
                  </div>
                ) : null}
                {showSolution && <code className={chapterStyles.solution}>{content.engineer.solution}</code>}
              </div>
            </div>

            <div className={chapterStyles.codeWindow}>
              <div>
                <span /><span /><span /><b>{workspacePath}</b>
                <strong className={monacoStyles.languageBadge}>Python · autosave</strong>
              </div>
              <section className={monacoStyles.editorFrame}>
                <Editor
                  height="100%"
                  language="python"
                  path={workspacePath}
                  theme="vs-dark"
                  value={editorCode}
                  onChange={(value) => persistEditorCode(value ?? '')}
                  loading={<div className={monacoStyles.editorLoading}>{tr(locale, 'Загружаем Monaco Editor…', 'Loading Monaco Editor…')}</div>}
                  options={{
                    automaticLayout: true,
                    accessibilitySupport: 'auto',
                    ariaLabel: tr(locale, 'Python-редактор задания Engineer', 'Engineer Python editor'),
                    cursorBlinking: 'smooth',
                    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                    fontLigatures: true,
                    fontSize: 14,
                    lineHeight: 23,
                    lineNumbersMinChars: 3,
                    minimap: {enabled: false},
                    padding: {top: 18, bottom: 18},
                    renderLineHighlight: 'all',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    tabSize: 4,
                    insertSpaces: true,
                    wordWrap: 'on',
                  }}
                />
              </section>

              <section className={monacoStyles.consolePanel} aria-live="polite">
                <div className={monacoStyles.consoleHeader}>
                  <b>{tr(locale, 'КОНСОЛЬ', 'CONSOLE')}</b>
                  {runResult && <span>{runResult.durationMs} ms</span>}
                </div>

                {!runResult && (
                  <p className={monacoStyles.consoleEmpty}>
                    {runtimeState === 'loading'
                      ? tr(locale, 'Первый запуск загружает Python/WebAssembly. Следующие запуски будут быстрее.', 'The first run loads Python/WebAssembly. Later runs will be faster.')
                      : tr(locale, 'Файл уже автосохранён. Нажми ▶ Запустить, чтобы увидеть stdout, результат или traceback.', 'The file is already autosaved. Press ▶ Run to see stdout, a result, or a traceback.')}
                  </p>
                )}

                {runResult?.stdout && (
                  <div className={monacoStyles.outputBlock}>
                    <small>STDOUT</small>
                    <pre>{runResult.stdout}</pre>
                  </div>
                )}
                {runResult?.result && (
                  <div className={monacoStyles.outputBlock}>
                    <small>RESULT</small>
                    <pre>{runResult.result}</pre>
                  </div>
                )}
                {runResult?.stderr && (
                  <div className={monacoStyles.errorBlock}>
                    <small>STDERR</small>
                    <pre>{runResult.stderr}</pre>
                  </div>
                )}
                {runResult?.traceback && (
                  <div className={monacoStyles.errorBlock}>
                    <small>TRACEBACK</small>
                    <pre>{runResult.traceback}</pre>
                  </div>
                )}
                {runResult?.tests.length ? (
                  <div className={monacoStyles.testSuite}>
                    <small>UNIT TESTS</small>
                    {runResult.tests.map((test) => (
                      <div key={`${lessonId}-${test.name}`} data-passed={test.passed}>
                        <span>{test.passed ? '✓' : '×'}</span>
                        <div><b>{test.name}</b><p>{test.detail}</p></div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>

              <footer className={monacoStyles.editorStatus}>
                <span>Python</span>
                <span>UTF-8</span>
                <span>Autosave: MyAI</span>
                <span>Monaco + Pyodide Worker</span>
              </footer>
            </div>
          </div>
        )}

        {mode === 'researcher' && (
          <div className={chapterStyles.depthPanel}>
            <div className={chapterStyles.depthCopy}>
              <p className={chapterStyles.modeEyebrow}>RESEARCHER · EXPERIMENT</p>
              <h4>{localize(content.researcher.question, locale)}</h4>
              <div className={chapterStyles.hypotheses}>
                <small>{tr(locale, 'СНАЧАЛА ВЫБЕРИ ГИПОТЕЗУ', 'CHOOSE A HYPOTHESIS FIRST')}</small>
                {content.researcher.hypotheses.map((item, index) => (
                  <button type="button" key={`${lessonId}-hypothesis-${item.en}`} className={hypothesis === index ? chapterStyles.hypothesisActive : ''} onClick={() => {setHypothesis(index); setExperimentRan(false);}}>
                    <span>{String.fromCharCode(65 + index)}</span>{localize(item, locale)}
                  </button>
                ))}
              </div>

              <div className={chapterStyles.variableGrid}>
                {content.researcher.variables.map((item) => <div key={`${lessonId}-variable-${item.en}`}>{localize(item, locale)}</div>)}
              </div>
            </div>

            <div className={chapterStyles.experimentBench}>
              <p>{tr(locale, 'ПРОТОКОЛ', 'PROTOCOL')}</p>
              <ol>{content.researcher.procedure.map((item) => <li key={`${lessonId}-procedure-${item.en}`}>{localize(item, locale)}</li>)}</ol>
              <button type="button" disabled={hypothesis === null} onClick={() => setExperimentRan(true)}>{hypothesis === null ? tr(locale, 'Сначала выбери гипотезу', 'Choose a hypothesis first') : tr(locale, 'Запустить эксперимент', 'Run experiment')} →</button>

              {experimentRan && (
                <div className={chapterStyles.observations}>
                  <small>{tr(locale, 'НАБЛЮДЕНИЯ', 'OBSERVATIONS')}</small>
                  {content.researcher.observations.map((item) => <p key={`${lessonId}-observation-${item.en}`}>• {localize(item, locale)}</p>)}
                  <div><b>{tr(locale, 'Вывод', 'Conclusion')}</b><p>{localize(content.researcher.conclusion, locale)}</p></div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
