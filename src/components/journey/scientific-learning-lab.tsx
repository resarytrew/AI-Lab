'use client';

import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {getChapterContent} from '@/content/chapter-content';
import {getStarterLesson, localize, starterLessonHref, type StarterLessonId} from '@/content/learning-path';
import {getLessonTheory} from '@/content/lesson-theory';
import {readLearningLab, runLearningSteps, updateLearningLab, type LearningLabSnapshot} from '@/lib/learning-lab-model';
import {buildReferenceSource, PythonLabClient, type PythonRunResult, resolvePythonWorkerUrl} from '@/lib/python-lab';
import {lessonModulePath} from '@/lib/myai-workspace';
import {useMyAiWorkspace} from '@/lib/use-myai-workspace';
import styles from './scientific-learning-lab.module.css';

type WorkbenchTab = 'code' | 'theory' | 'experiment';
type RuntimeState = 'idle' | 'loading' | 'ready' | 'running' | 'error';
type MissionState = {prediction: boolean; error: boolean; betterWeight: boolean; update: boolean};

type NavItem = {
  id: string;
  glyph: string;
  labelRu: string;
  labelEn: string;
  lesson: StarterLessonId;
};

const lessonId = 'measure-error' as const;
const progressKey = 'ai-lab:learning-journey:v2';
const initialSnapshot: LearningLabSnapshot = {x: 3, target: 5, weight: 1.2, bias: 0, learningRate: 0.05};
const initialLoss = readLearningLab(initialSnapshot).loss;

const labNavigation: readonly NavItem[] = [
  {id: 'intelligence', glyph: '⌘', labelRu: 'Интеллект', labelEn: 'Intelligence', lesson: 'smart-machine'},
  {id: 'data', glyph: '◉', labelRu: 'Данные', labelEn: 'Data', lesson: 'data-to-meaning'},
  {id: 'rules', glyph: '▤', labelRu: 'Правила', labelEn: 'Rules', lesson: 'knowledge-as-rules'},
  {id: 'learning', glyph: '△', labelRu: 'Обучение', labelEn: 'Learning', lesson: 'measure-error'},
  {id: 'network', glyph: '◇', labelRu: 'Нейросеть', labelEn: 'Neural net', lesson: 'first-neuron'},
  {id: 'language', glyph: '○', labelRu: 'Язык', labelEn: 'Language', lesson: 'text-as-data'},
];

const graphTicks = ['1', '3', '5', '7', '9', '11', '13', '15'] as const;

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function saveLessonComplete() {
  try {
    const raw = window.localStorage.getItem(progressKey);
    const current = raw ? JSON.parse(raw) : [];
    const ids = Array.isArray(current) ? current : [];
    if (!ids.includes(lessonId)) window.localStorage.setItem(progressKey, JSON.stringify([...ids, lessonId]));
  } catch {
    window.localStorage.setItem(progressKey, JSON.stringify([lessonId]));
  }
}

function Panel({title, meta, children, className = ''}: {title: string; meta?: ReactNode; children: ReactNode; className?: string}) {
  return <section className={`${styles.paperPanel} ${className}`}>
    <span className={styles.screw} data-corner="tl" aria-hidden="true" />
    <span className={styles.screw} data-corner="br" aria-hidden="true" />
    <header className={styles.panelHeader}><b>{title}</b>{meta ? <span>{meta}</span> : null}</header>
    <div className={styles.panelBody}>{children}</div>
  </section>;
}

function MissionLine({done, children}: {done: boolean; children: ReactNode}) {
  return <div className={done ? styles.missionDone : styles.missionTodo}>
    <i aria-hidden="true">{done ? '✓' : '○'}</i><span>{children}</span>
  </div>;
}

function ParameterControl({id, label, value, min, max, step, onChange, onReset, digits = 2}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onReset: () => void;
  digits?: number;
}) {
  return <div className={styles.parameterRow}>
    <label htmlFor={id}>{label}</label>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    <output htmlFor={id}>{value.toFixed(digits)}</output>
    <button type="button" onClick={onReset} aria-label={`${label}: reset`}>↺</button>
  </div>;
}

function LossGraph({history, currentLoss}: {history: readonly number[]; currentLoss: number}) {
  const values = useMemo(() => {
    if (history.length > 1) return history.slice(-16);
    return [currentLoss * 6.2, currentLoss * 4.4, currentLoss * 3.1, currentLoss * 2.2, currentLoss * 1.55, currentLoss];
  }, [history, currentLoss]);
  const maximum = Math.max(...values, 0.1);
  const minimum = Math.min(...values, 0);
  const span = Math.max(0.0001, maximum - minimum);
  const points = values.map((value, index) => {
    const x = 4 + (index / Math.max(1, values.length - 1)) * 92;
    const y = 39 - ((value - minimum) / span) * 31;
    return `${x},${y}`;
  }).join(' ');

  return <div className={styles.graphArea}>
    <div className={styles.graphScale}><span>10</span><span>1</span><span>0.1</span></div>
    <svg viewBox="0 0 100 43" preserveAspectRatio="none" role="img" aria-label="Loss history">
      <line x1="4" x2="96" y1="8" y2="8" />
      <line x1="4" x2="96" y1="23" y2="23" />
      <line x1="4" x2="96" y1="39" y2="39" />
      <polyline points={points} />
    </svg>
    <div className={styles.graphTicks}>{graphTicks.map((tick) => <span key={tick}>{tick}</span>)}</div>
  </div>;
}

function Metric({label, value, tone = 'normal'}: {label: string; value: string; tone?: 'normal' | 'good' | 'cool' | 'hot'}) {
  return <div className={styles.metric} data-tone={tone}><span>{label}</span><b>{value}</b></div>;
}

function ToolTabs({locale, active, onChange}: {locale: string; active: WorkbenchTab; onChange: (tab: WorkbenchTab) => void}) {
  const tabs: readonly {id: WorkbenchTab; glyph: string; ru: string; en: string}[] = [
    {id: 'code', glyph: '</>', ru: 'Код', en: 'Code'},
    {id: 'theory', glyph: '▤', ru: 'Теория', en: 'Theory'},
    {id: 'experiment', glyph: '⌬', ru: 'Эксперимент', en: 'Experiment'},
  ];
  return <div className={styles.workbenchTabs} role="tablist" aria-label={tr(locale, 'Инструменты лаборатории', 'Laboratory tools')}>
    {tabs.map((tab) => <button type="button" role="tab" aria-selected={active === tab.id} key={tab.id} data-active={active === tab.id} onClick={() => onChange(tab.id)}><span>{tab.glyph}</span>{tr(locale, tab.ru, tab.en)}</button>)}
  </div>;
}

export function ScientificLearningLab({locale}: {locale: string}) {
  const lesson = getStarterLesson(lessonId);
  const chapter = getChapterContent(lessonId);
  const theory = getLessonTheory(lessonId);
  const {workspace, ensureLessonFile, saveFile, resetFile} = useMyAiWorkspace();
  const path = lessonModulePath(lessonId);
  const activeFile = workspace?.files[path];

  const [snapshot, setSnapshot] = useState<LearningLabSnapshot>(initialSnapshot);
  const [history, setHistory] = useState<number[]>([initialLoss]);
  const [mission, setMission] = useState<MissionState>({prediction: true, error: true, betterWeight: false, update: false});
  const [tab, setTab] = useState<WorkbenchTab>('code');
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [pythonVersion, setPythonVersion] = useState('');
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<string>('');
  const [experimentComplete, setExperimentComplete] = useState(false);
  const runtimeRef = useRef<PythonLabClient | null>(null);

  useEffect(() => {
    ensureLessonFile(lessonId, chapter.engineer.starterCode);
  }, [chapter.engineer.starterCode, ensureLessonFile]);

  useEffect(() => () => {
    runtimeRef.current?.terminate();
    runtimeRef.current = null;
  }, []);

  if (!lesson) return null;

  const reading = readLearningLab(snapshot);
  const alternateLocale = locale === 'en' ? 'ru' : 'en';
  const allProjectFiles = workspace ? Object.values(workspace.files).filter((file) => file.sourceLessonId) : [];
  const projectFiles = [...allProjectFiles].sort((left, right) => (left.sourceLessonId ?? '').localeCompare(right.sourceLessonId ?? '')).slice(0, 6);
  const projectProgress = Math.min(100, Math.round((allProjectFiles.length / 15) * 100));

  function completeIfNeeded(nextMission: MissionState) {
    if (nextMission.prediction && nextMission.error && nextMission.betterWeight && nextMission.update) saveLessonComplete();
  }

  function updateSnapshot(patch: Partial<LearningLabSnapshot>, trackBetter = false) {
    const nextSnapshot = {...snapshot, ...patch};
    const nextLoss = readLearningLab(nextSnapshot).loss;
    const nextMission = trackBetter
      ? {...mission, betterWeight: mission.betterWeight || nextLoss < initialLoss - 0.01}
      : mission;
    setSnapshot(nextSnapshot);
    setHistory((current) => [...current, nextLoss].slice(-16));
    if (nextMission !== mission) {
      setMission(nextMission);
      completeIfNeeded(nextMission);
    }
  }

  function updateOnce() {
    const nextSnapshot = updateLearningLab(snapshot);
    const nextLoss = readLearningLab(nextSnapshot).loss;
    const nextMission = {...mission, update: true, betterWeight: mission.betterWeight || nextLoss < initialLoss - 0.01};
    setSnapshot(nextSnapshot);
    setHistory((current) => [...current, nextLoss].slice(-16));
    setMission(nextMission);
    completeIfNeeded(nextMission);
  }

  function autoTrain() {
    const result = runLearningSteps(snapshot, 10);
    const nextMission = {...mission, update: true, betterWeight: true};
    setSnapshot(result.snapshot);
    setHistory((current) => [...current, ...result.history.slice(1)].slice(-16));
    setMission(nextMission);
    setExperimentComplete(true);
    completeIfNeeded(nextMission);
  }

  function resetExperiment() {
    setSnapshot(initialSnapshot);
    setHistory([initialLoss]);
    setMission({prediction: true, error: true, betterWeight: false, update: false});
    setExperimentComplete(false);
  }

  async function ensureRuntime() {
    if (runtimeRef.current && runtimeState === 'ready') return runtimeRef.current;
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
      setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0});
      return null;
    }
  }

  async function runCode(withTests: boolean) {
    if (!activeFile || runtimeState === 'loading' || runtimeState === 'running') return;
    const client = await ensureRuntime();
    if (!client) return;
    setRuntimeState('running');
    setRunResult(null);
    try {
      const result = withTests
        ? await client.test(activeFile.content, buildReferenceSource(chapter.engineer.starterCode, chapter.engineer.expected))
        : await client.run(activeFile.content);
      setRunResult(result);
      setRuntimeState('ready');
    } catch (error) {
      client.terminate();
      runtimeRef.current = null;
      setRuntimeState('error');
      setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0});
    }
  }

  const hint = reading.loss < 0.12
    ? tr(locale, 'Отлично: loss уже очень мал. Теперь сравни устойчивость при другом learning rate.', 'Great: loss is already very small. Now compare stability with another learning rate.')
    : reading.loss < initialLoss
      ? tr(locale, 'Ты движешься в правильную сторону. Сравни новый loss с исходным 1.96.', 'You are moving in the right direction. Compare the new loss with the initial 1.96.')
      : tr(locale, 'Попробуй менять w и b так, чтобы prediction приближался к target. Чем меньше loss, тем точнее модель.', 'Change w and b so prediction moves toward target. The smaller the loss, the more accurate the model.');

  return <main className={styles.screen}>
    <div className={styles.shellFrame}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href={`/${locale}/`}>AI <span>LAB</span></Link>
        <nav className={styles.labNav} aria-label={tr(locale, 'Лаборатории', 'Laboratories')}>
          {labNavigation.map((item) => <Link key={item.id} href={starterLessonHref(locale, item.lesson)} data-active={item.id === 'learning'}><i aria-hidden="true">{item.glyph}</i><span>{tr(locale, item.labelRu, item.labelEn)}</span></Link>)}
        </nav>
        <div className={styles.sessionNote}>
          <code>›› session: ai_lab_07</code>
          <code>›› status: training</code>
          <code>›› user: researcher</code>
          <code>›› mode: tuning</code>
        </div>
        <div className={styles.modelStatus}>
          <header><span>MODEL STATUS</span><i aria-hidden="true" /></header>
          <strong>ACTIVE</strong>
          <div className={styles.sparkline} aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <footer><span>LOSS</span><b>{reading.loss.toFixed(2)}</b></footer>
          <small>ML-LAB v1.2.0</small>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.labName}><span aria-hidden="true">△</span><b>{tr(locale, 'Лаборатория обучения', 'Learning laboratory')}</b></div>
          <div className={styles.lessonProgress}><b>{tr(locale, 'Урок', 'Lesson')} 7/15</b><span><i /></span></div>
          <div className={styles.topActions}><Link href={`/${alternateLocale}/journey/${lesson.slug}`}>{alternateLocale.toUpperCase()}</Link><Link className={styles.myAiLink} href={`/${locale}/my-ai/`}><span aria-hidden="true">▣</span> MyAI⌄</Link></div>
        </header>

        <div className={styles.mainGrid}>
          <section className={styles.lessonBoard}>
            <div className={styles.boardIntro}>
              <div><span className={styles.referenceCode}>ref: model_v1.0e</span><h1>{tr(locale, 'Настрой модель', 'Tune the model')} <small>⌕</small></h1><p>{tr(locale, 'Измени параметры модели и посмотри, как меняются предсказание и ошибка.', 'Change the model parameters and observe how prediction and error change.')}</p></div>
              <section className={styles.missionCard}><b>{tr(locale, 'МИССИЯ', 'MISSION')}</b><MissionLine done={mission.prediction}>{tr(locale, 'Получить prediction', 'Get a prediction')}</MissionLine><MissionLine done={mission.error}>{tr(locale, 'Измерить ошибку', 'Measure the error')}</MissionLine><MissionLine done={mission.betterWeight}>{tr(locale, 'Найти параметры с меньшим loss', 'Find parameters with lower loss')}</MissionLine><MissionLine done={mission.update}>{tr(locale, 'Запустить обучение', 'Run training')}</MissionLine></section>
            </div>

            <div className={styles.boardCards}>
              <Panel title={tr(locale, 'ПАРАМЕТРЫ', 'PARAMETERS')} className={styles.parametersCard}>
                <ParameterControl id="lab-x" label={tr(locale, 'x (вход)', 'x (input)')} value={snapshot.x} min={-5} max={8} step={0.1} digits={2} onChange={(x) => updateSnapshot({x}, true)} onReset={() => updateSnapshot({x: initialSnapshot.x}, true)} />
                <ParameterControl id="lab-w" label="w" value={snapshot.weight} min={-5} max={5} step={0.05} digits={2} onChange={(weight) => updateSnapshot({weight}, true)} onReset={() => updateSnapshot({weight: initialSnapshot.weight}, true)} />
                <ParameterControl id="lab-b" label="b" value={snapshot.bias} min={-5} max={5} step={0.05} digits={2} onChange={(bias) => updateSnapshot({bias}, true)} onReset={() => updateSnapshot({bias: initialSnapshot.bias}, true)} />
                <ParameterControl id="lab-target" label="target (y)" value={snapshot.target} min={-5} max={10} step={0.1} digits={2} onChange={(target) => updateSnapshot({target}, true)} onReset={() => updateSnapshot({target: initialSnapshot.target}, true)} />
                <ParameterControl id="lab-lr" label="learning rate (η)" value={snapshot.learningRate} min={0.001} max={0.2} step={0.001} digits={3} onChange={(learningRate) => updateSnapshot({learningRate})} onReset={() => updateSnapshot({learningRate: initialSnapshot.learningRate})} />
              </Panel>

              <Panel title={tr(locale, 'ФОРМУЛЫ', 'FORMULAS')} className={styles.formulaCard}>
                <div className={styles.formula}>ŷ = w · x + b</div>
                <div className={styles.formula}>L = (ŷ − y)²</div>
                <dl><div><dt>ŷ</dt><dd>{tr(locale, 'предсказание', 'prediction')}</dd></div><div><dt>y</dt><dd>{tr(locale, 'цель (target)', 'target')}</dd></div><div><dt>L</dt><dd>{tr(locale, 'ошибка (loss)', 'loss')}</dd></div><div><dt>η</dt><dd>{tr(locale, 'скорость обучения', 'learning rate')}</dd></div></dl>
              </Panel>

              <Panel title={tr(locale, 'РЕЗУЛЬТАТЫ', 'RESULTS')} className={styles.resultsCard}>
                <Metric label="prediction (ŷ)" value={reading.prediction.toFixed(2)} tone="good" />
                <Metric label="target (y)" value={snapshot.target.toFixed(2)} tone="good" />
                <Metric label="error (ŷ − y)" value={reading.error.toFixed(2)} tone="cool" />
                <Metric label="loss (MSE)" value={reading.loss.toFixed(2)} tone="hot" />
              </Panel>

              <Panel title="LOSS (MSE)" meta={<span className={styles.live}><i/> LIVE</span>} className={styles.lossCard}><LossGraph history={history} currentLoss={reading.loss}/><div className={styles.trainingActions}><button type="button" onClick={updateOnce}>▶ {tr(locale, 'ШАГ', 'STEP')}</button><button type="button" onClick={autoTrain}>×10 {tr(locale, 'ОБУЧИТЬ', 'TRAIN')}</button><button type="button" onClick={resetExperiment}>↺ {tr(locale, 'СБРОС', 'RESET')}</button></div></Panel>

              <Panel title={tr(locale, 'ПОДСКАЗКА', 'HINT')} className={styles.hintCard}><p>{hint}</p><div className={styles.hintSketch} aria-hidden="true"><span/><i/><b>min</b></div></Panel>
            </div>
          </section>

          <aside className={styles.workbench}>
            <ToolTabs locale={locale} active={tab} onChange={setTab} />
            {tab === 'code' ? <>
              <div className={styles.fileBar}><code>{path}</code><span className={styles.runtimeLed} data-state={runtimeState} aria-hidden="true" /></div>
              <div className={styles.editorArea}>{activeFile ? <Editor height="100%" language="python" path={activeFile.path} theme="vs-dark" value={activeFile.content} onChange={(value) => {saveFile(path, value ?? ''); setRunResult(null);}} options={{automaticLayout: true, accessibilitySupport: 'auto', ariaLabel: tr(locale, 'Python-редактор MyAI', 'MyAI Python editor'), fontSize: 13, lineHeight: 21, minimap: {enabled: false}, padding: {top: 14, bottom: 12}, scrollBeyondLastLine: false, tabSize: 4, insertSpaces: true, wordWrap: 'on'}} /> : null}</div>
              <div className={styles.codeActions}><button type="button" data-primary="true" disabled={!activeFile || runtimeState === 'loading' || runtimeState === 'running'} onClick={() => void runCode(false)}>▶ RUN</button><button type="button" disabled={!activeFile || runtimeState === 'loading' || runtimeState === 'running'} onClick={() => void runCode(true)}>⌬ TESTS</button><button type="button" disabled={!activeFile?.starterContent} onClick={() => {resetFile(path); setRunResult(null);}}>↺ {tr(locale, 'СБРОС', 'RESET')}</button></div>
              <div className={styles.console}><header><b>{tr(locale, 'КОНСОЛЬ', 'CONSOLE')}</b><span>{activeFile ? `✓ ${tr(locale, 'СОХРАНЕНО', 'SAVED')}` : runtimeState}</span></header>{!runResult ? <pre>› {runtimeState === 'loading' ? tr(locale, 'загрузка Python…', 'loading Python…') : tr(locale, 'готово к запуску', 'ready to run')}</pre> : <><pre>{runResult.stdout || runResult.result || `prediction (ŷ): ${reading.prediction.toFixed(2)}\ntarget (y): ${snapshot.target.toFixed(2)}\nerror (ŷ - y): ${reading.error.toFixed(2)}\nloss (MSE): ${reading.loss.toFixed(2)}`}</pre>{runResult.tests.map((test) => <p key={test.name} data-pass={test.passed}>› {test.passed ? '✓' : '×'} {test.name}</p>)}{runResult.stderr || runResult.traceback ? <pre data-error="true">{runResult.stderr || runResult.traceback}</pre> : null}</>}</div>
            </> : null}

            {tab === 'theory' ? <div className={styles.darkDocument}><span className={styles.documentLabel}>THEORY NOTE · 07</span><h2>{localize(theory.intro, locale)}</h2>{theory.sections.slice(0, 3).map((section) => <article key={section.title.en}><b>{localize(section.title, locale)}</b><p>{localize(section.body, locale)}</p></article>)}<div className={styles.mechanismBox}><code>{chapter.math.formula}</code><p>{localize(chapter.math.mechanism, locale)}</p></div></div> : null}

            {tab === 'experiment' ? <div className={styles.darkDocument}><span className={styles.documentLabel}>RESEARCH PROTOCOL · 07</span><h2>{localize(chapter.researcher.question, locale)}</h2><div className={styles.hypotheses}>{chapter.researcher.hypotheses.map((hypothesis) => <label key={hypothesis.en} data-selected={selectedHypothesis === hypothesis.en}><input type="radio" name="hypothesis" checked={selectedHypothesis === hypothesis.en} onChange={() => setSelectedHypothesis(hypothesis.en)} /><span>{localize(hypothesis, locale)}</span></label>)}</div><ol>{chapter.researcher.procedure.map((step) => <li key={step.en}>{localize(step, locale)}</li>)}</ol><div className={styles.researchActions}><button type="button" disabled={!selectedHypothesis} onClick={() => {autoTrain(); setExperimentComplete(true);}}>▶ {tr(locale, 'ЗАПУСТИТЬ ОПЫТ', 'RUN EXPERIMENT')}</button></div>{experimentComplete ? <section className={styles.observation}><b>{tr(locale, 'НАБЛЮДЕНИЕ', 'OBSERVATION')}</b>{chapter.researcher.observations.map((item) => <p key={item.en}>› {localize(item, locale)}</p>)}<strong>{localize(chapter.researcher.conclusion, locale)}</strong></section> : null}</div> : null}

            <div className={styles.toolRail} aria-hidden="true"><span>›_</span><span>&lt;/&gt;</span><span>▦</span></div>
          </aside>
        </div>

        <div className={styles.bottomGrid}>
          <section className={styles.labNotebook}>
            <header><b>{tr(locale, 'ЛАБОРАТОРНЫЙ ЖУРНАЛ', 'LAB NOTEBOOK')}</b><span>20.05.2024 · AUTOSAVE</span></header>
            <div className={styles.journalEntries}>
              <article><time>19:42</time><div><b>{tr(locale, 'Гипотеза', 'Hypothesis')}</b><p>w = {snapshot.weight.toFixed(2)}, b = {snapshot.bias.toFixed(2)}, lr = {snapshot.learningRate.toFixed(3)}</p></div></article>
              <article><time>19:45</time><div><b>{tr(locale, 'Наблюдение', 'Observation')}</b><p>x = {snapshot.x.toFixed(2)}, target = {snapshot.target.toFixed(2)} → prediction = {reading.prediction.toFixed(2)}, error = {reading.error.toFixed(2)}, loss = {reading.loss.toFixed(2)}</p></div></article>
              <article data-star="true"><time>19:47</time><div><b>{tr(locale, 'Вывод', 'Conclusion')}</b><p>{mission.betterWeight ? tr(locale, 'Параметры изменили качество модели: loss удалось уменьшить.', 'Parameters changed model quality: loss was reduced.') : tr(locale, 'Изменяй w и/или b, чтобы уменьшить ошибку. Модель ещё обучаема.', 'Change w and/or b to reduce the error. The model can still learn.')}</p></div></article>
            </div>
          </section>

          <section className={styles.projectPanel}>
            <header><b>▱ MyAI PROJECT</b><Link href={`/${locale}/my-ai/`}>+ {tr(locale, 'Новый', 'New')}</Link></header>
            <div className={styles.projectFiles}>{projectFiles.length ? projectFiles.map((file) => <Link href={`/${locale}/my-ai/`} key={file.path} data-current={file.path === path}><span aria-hidden="true">♙</span><code>{file.path.split('/').at(-1)}</code><i>{file.path === path ? '●' : '✓'}</i></Link>) : <p>{tr(locale, 'Модули MyAI появятся здесь после работы с кодом.', 'MyAI modules will appear here after coding.')}</p>}</div>
            <footer><span>{tr(locale, 'Прогресс проекта', 'Project progress')}: {allProjectFiles.length}/15</span><div><i style={{width: `${projectProgress}%`}} /></div></footer>
          </section>
        </div>
      </div>
    </div>
  </main>;
}
