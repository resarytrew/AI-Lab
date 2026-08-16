'use client';

import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getChapterContent} from '@/content/chapter-content';
import {getStarterLesson, localize, starterLessonHref, starterLessons, type StarterLessonId} from '@/content/learning-path';
import {getLessonTheory} from '@/content/lesson-theory';
import {readLearningLab, runLearningSteps, updateLearningLab, type LearningLabSnapshot} from '@/lib/learning-lab-model';
import {buildReferenceSource, PythonLabClient, type PythonRunResult, resolvePythonWorkerUrl} from '@/lib/python-lab';
import {lessonModulePath} from '@/lib/myai-workspace';
import {useMyAiWorkspace} from '@/lib/use-myai-workspace';
import styles from './reference-learning-lab.module.css';

type ToolId = 'parameters' | 'measurements' | 'graph' | 'code' | 'theory';
type RuntimeState = 'idle' | 'loading' | 'ready' | 'running' | 'error';
type MissionState = {prediction: boolean; error: boolean; betterWeight: boolean; update: boolean};

const lessonId = 'measure-error' as const;
const progressKey = 'ai-lab:learning-journey:v2';
const initialSnapshot: LearningLabSnapshot = {x: 3, target: 5, weight: 1.2, bias: 0, learningRate: 0.05};
const initialLoss = readLearningLab(initialSnapshot).loss;

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

function Icon({name}: {name: 'brain' | 'data' | 'rules' | 'flask' | 'network' | 'language' | 'help' | 'settings'}) {
  const common = {width: 25, height: 25, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (name === 'brain') return <svg {...common}><path d="M9.5 4.3A3.2 3.2 0 0 0 4 6.6a3.2 3.2 0 0 0-1.4 5.8A3.4 3.4 0 0 0 6 17.5a3.1 3.1 0 0 0 5.4 1.6V5.8A2.4 2.4 0 0 0 9.5 4.3Z"/><path d="M14.5 4.3A3.2 3.2 0 0 1 20 6.6a3.2 3.2 0 0 1 1.4 5.8 3.4 3.4 0 0 1-3.4 5.1 3.1 3.1 0 0 1-5.4 1.6V5.8a2.4 2.4 0 0 1 1.9-1.5Z"/><path d="M7 9.2c1.6.1 2.7.8 3.3 2.1M17 9.2c-1.6.1-2.7.8-3.3 2.1M7 15.2c1.5-.2 2.6-1 3.2-2.2M17 15.2c-1.5-.2-2.6-1-3.2-2.2"/></svg>;
  if (name === 'data') return <svg {...common}><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/></svg>;
  if (name === 'rules') return <svg {...common}><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/><circle cx="4.5" cy="18" r="1.5"/></svg>;
  if (name === 'flask') return <svg {...common}><path d="M9 3h6M10 3v5l-5.4 9.1A2.6 2.6 0 0 0 6.8 21h10.4a2.6 2.6 0 0 0 2.2-3.9L14 8V3"/><path d="M7.2 16h9.6"/></svg>;
  if (name === 'network') return <svg {...common}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="m6.5 10.5 4-4M13.5 6.5l4 4M17.5 13.5l-4 4M10.5 17.5l-4-4"/></svg>;
  if (name === 'language') return <svg {...common}><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>;
  if (name === 'help') return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a7 7 0 0 0-1.8 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a7 7 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></svg>;
}

const labs = [
  {id: 'intelligence', labelRu: 'Интеллект', labelEn: 'Intelligence', icon: 'brain' as const, lesson: 'smart-machine' as StarterLessonId},
  {id: 'data', labelRu: 'Данные', labelEn: 'Data', icon: 'data' as const, lesson: 'data-to-meaning' as StarterLessonId},
  {id: 'rules', labelRu: 'Правила', labelEn: 'Rules', icon: 'rules' as const, lesson: 'knowledge-as-rules' as StarterLessonId},
  {id: 'learning', labelRu: 'Обучение', labelEn: 'Learning', icon: 'flask' as const, lesson: 'learn-from-examples' as StarterLessonId},
  {id: 'network', labelRu: 'Нейросеть', labelEn: 'Neural net', icon: 'network' as const, lesson: 'first-neuron' as StarterLessonId},
  {id: 'language', labelRu: 'Язык', labelEn: 'Language', icon: 'language' as const, lesson: 'text-as-data' as StarterLessonId},
] as const;

function Knob({small = false}: {small?: boolean}) {
  return <span className={small ? styles.knobSmall : styles.knob} aria-hidden="true"><i /></span>;
}

function RangeLine({id, label, value, min, max, step, onChange, prefix, formatter}: {id: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; prefix?: string; formatter?: (value: number) => string}) {
  return <label className={styles.rangeLine} htmlFor={id}>
    <b>{label}</b>
    <span className={styles.rangeMin}>{min}</span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    <span className={styles.rangeMax}>{max}</span>
    <code>{prefix}{formatter ? formatter(value) : value.toFixed(step < 0.1 ? 2 : 1)}</code>
  </label>;
}

function LossGraph({history, currentLoss}: {history: number[]; currentLoss: number}) {
  const values = useMemo(() => {
    const base = history.length > 1 ? history : [currentLoss * 5.6, currentLoss * 3.9, currentLoss * 2.7, currentLoss * 1.85, currentLoss * 1.35, currentLoss];
    return base.slice(-16);
  }, [currentLoss, history]);
  const max = Math.max(...values, 0.1);
  const min = Math.min(...values, 0);
  const span = Math.max(0.0001, max - min);
  const points = values.map((value, index) => `${5 + (index / Math.max(1, values.length - 1)) * 90},${38 - ((value - min) / span) * 30}`).join(' ');

  return <section className={styles.graphBox}>
    <div className={styles.sectionTitle}><span>⌁</span><b>{tr('ru', 'График: loss (MSE)', 'Graph: loss (MSE)')}</b><em>● live</em></div>
    <svg viewBox="0 0 100 42" preserveAspectRatio="none" role="img" aria-label="Loss history">
      <line x1="5" y1="8" x2="95" y2="8"/><line x1="5" y1="23" x2="95" y2="23"/><line x1="5" y1="38" x2="95" y2="38"/>
      <polyline points={points}/>
      {values.map((value, index) => <circle key={`${index}-${value.toFixed(7)}`} cx={5 + (index / Math.max(1, values.length - 1)) * 90} cy={38 - ((value - min) / span) * 30} r="1.2"/>)}
    </svg>
    <div className={styles.graphTicks}>{values.map((_, index) => <span key={`tick-${index}`}>{index + 1}</span>)}</div>
  </section>;
}

function HardwareUnit({kind, label, value}: {kind: 'input' | 'target' | 'prediction'; label: string; value: string}) {
  return <div className={styles.hardwareUnit} data-kind={kind}>
    <b>{label}</b>
    <div className={styles.digitalDisplay}>{value}</div>
    <Knob />
  </div>;
}

function MachineStage({snapshot, onUpdate}: {snapshot: LearningLabSnapshot; onUpdate: () => void}) {
  const reading = readLearningLab(snapshot);
  return <section className={styles.machineStage}>
    <h1>THE MACHINE</h1>
    <div className={styles.missionCard}>
      <b>{tr('ru', 'Миссия', 'Mission')}</b>
      <span>✓ {tr('ru', 'Получить prediction', 'Get a prediction')}</span>
      <span>✓ {tr('ru', 'Измерить ошибку', 'Measure the error')}</span>
      <span>○ {tr('ru', 'Найти параметр с меньшим loss', 'Find a parameter with lower loss')}</span>
      <span>○ {tr('ru', 'Запустить обновление', 'Run an update')}</span>
    </div>

    <div className={styles.machineBoard}>
      <div className={styles.inputPosition}><HardwareUnit kind="input" label="x" value={snapshot.x.toFixed(1)} /></div>
      <div className={styles.modelPosition}>
        <div className={styles.modelCase}>
          <i className={styles.sideGlowLeft}/><i className={styles.sideGlowRight}/>
          <div className={styles.caseScrews}><span/><span/><span/><span/></div>
          <h2>MODEL (w, b)</h2>
          <div className={styles.modelEquation}>ŷ = w · x + b</div>
          <div className={styles.modelMeters}>
            <div><small>w</small><b>{snapshot.weight.toFixed(2)}</b><Knob small /></div>
            <div><small>b</small><b>{snapshot.bias.toFixed(2)}</b><Knob small /></div>
          </div>
        </div>
      </div>
      <div className={styles.predictionPosition}><HardwareUnit kind="prediction" label="prediction" value={reading.prediction.toFixed(2)} /></div>
      <div className={styles.targetPosition}><HardwareUnit kind="target" label="target" value={snapshot.target.toFixed(1)} /></div>
      <div className={styles.lossPosition}>
        <div className={styles.lossCase}><b>LOSS <small>(MSE)</small></b><code>L = (ŷ − y)²</code><strong>{reading.loss.toFixed(2)}</strong></div>
      </div>
      <div className={styles.updatePosition}>
        <div className={styles.updateCase}><b>UPDATE</b><code>w, b ← w, b − η · ∇L</code><button type="button" onClick={onUpdate}>▶ {tr('ru', 'ОБНОВИТЬ', 'UPDATE')}</button></div>
      </div>
      <div className={styles.learningRatePosition}><span>learning rate (η)</span><b>{snapshot.learningRate.toFixed(2)}</b><Knob small /></div>

      <span className={`${styles.wire} ${styles.wireInput}`}/>
      <span className={`${styles.wire} ${styles.wirePrediction}`}/>
      <span className={`${styles.wire} ${styles.wireTarget}`}/>
      <span className={`${styles.wire} ${styles.wireLoss}`}/>
      <span className={`${styles.wire} ${styles.wireFeedback}`}/>
      <span className={styles.downArrow}>▼</span>
    </div>
  </section>;
}

export function ReferenceLearningLab({locale}: {locale: string}) {
  const lesson = getStarterLesson('measure-error');
  const content = getChapterContent('measure-error');
  const theory = getLessonTheory('measure-error');
  const {workspace, ensureLessonFile, saveFile, resetFile} = useMyAiWorkspace();
  const path = lessonModulePath('measure-error');
  const activeFile = workspace?.files[path];
  const [tool, setTool] = useState<ToolId>('parameters');
  const [snapshot, setSnapshot] = useState<LearningLabSnapshot>(initialSnapshot);
  const [history, setHistory] = useState<number[]>([initialLoss]);
  const [mission, setMission] = useState<MissionState>({prediction: true, error: true, betterWeight: false, update: false});
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [pythonVersion, setPythonVersion] = useState('');
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const runtimeRef = useRef<PythonLabClient | null>(null);

  useEffect(() => { ensureLessonFile('measure-error', content.engineer.starterCode); }, [content.engineer.starterCode, ensureLessonFile]);
  useEffect(() => () => { runtimeRef.current?.terminate(); runtimeRef.current = null; }, []);

  if (!lesson) return null;
  const reading = readLearningLab(snapshot);
  const completedMission = mission.prediction && mission.error && mission.betterWeight && mission.update;
  const alternateLocale = locale === 'en' ? 'ru' : 'en';
  const projectFiles = workspace ? Object.values(workspace.files).filter((file) => file.sourceLessonId).sort((left, right) => (left.sourceLessonId ?? '').localeCompare(right.sourceLessonId ?? '')).slice(0, 6) : [];

  function completeIfNeeded(nextMission: MissionState) {
    if (nextMission.prediction && nextMission.error && nextMission.betterWeight && nextMission.update) saveLessonComplete();
  }

  function setWeight(weight: number) {
    const nextSnapshot = {...snapshot, weight};
    const nextLoss = readLearningLab(nextSnapshot).loss;
    const nextMission = {...mission, betterWeight: mission.betterWeight || nextLoss < initialLoss - 0.01};
    setSnapshot(nextSnapshot);
    setHistory((current) => [...current, nextLoss].slice(-16));
    setMission(nextMission);
    completeIfNeeded(nextMission);
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
    completeIfNeeded(nextMission);
  }

  function resetExperiment() {
    setSnapshot(initialSnapshot);
    setHistory([initialLoss]);
    setMission({prediction: true, error: true, betterWeight: false, update: false});
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
      client.terminate(); runtimeRef.current = null; setRuntimeState('error');
      setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0});
      return null;
    }
  }

  async function runCode(withTests: boolean) {
    if (!activeFile || runtimeState === 'loading' || runtimeState === 'running') return;
    const client = await ensureRuntime();
    if (!client) return;
    setRuntimeState('running'); setRunResult(null);
    try {
      const result = withTests ? await client.test(activeFile.content, buildReferenceSource(content.engineer.starterCode, content.engineer.expected)) : await client.run(activeFile.content);
      setRunResult(result); setRuntimeState('ready');
    } catch (error) {
      client.terminate(); runtimeRef.current = null; setRuntimeState('error');
      setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0});
    }
  }

  const instrumentContent = tool === 'theory' ? <div className={styles.theoryPanel}><h3>{localize(theory.intro, locale)}</h3>{theory.sections.slice(0, 2).map((section) => <article key={section.title.en}><b>{localize(section.title, locale)}</b><p>{localize(section.body, locale)}</p></article>)}</div> : tool === 'code' ? <div className={styles.codeBrief}><b>ENGINEER · CODE</b><p>{localize(content.engineer.goal, locale)}</p><small>{localize(content.engineer.challenge, locale)}</small></div> : <>
    {tool === 'parameters' ? <section className={styles.parametersPanel}>
      <RangeLine id="ref-w" label="w (вес)" value={snapshot.weight} min={-5} max={5} step={0.05} onChange={setWeight} />
      <RangeLine id="ref-b" label="b (смещение)" value={snapshot.bias} min={-5} max={5} step={0.05} onChange={(bias) => {setSnapshot((current) => ({...current, bias})); setHistory((current) => [...current, readLearningLab({...snapshot, bias}).loss].slice(-16));}} />
      <RangeLine id="ref-lr" label="learning rate (η)" value={snapshot.learningRate} min={0.001} max={0.2} step={0.001} formatter={(value) => value.toFixed(3)} onChange={(learningRate) => setSnapshot((current) => ({...current, learningRate}))} />
    </section> : null}
    <section className={styles.measurementsBox}>
      <div className={styles.sectionTitle}><span>⌁</span><b>{tr(locale, 'Измерения (текущие)', 'Measurements (current)')}</b><span>⌁</span></div>
      <div className={styles.metrics}><div><small>prediction (ŷ)</small><b>{reading.prediction.toFixed(2)}</b></div><div><small>target (y)</small><b>{snapshot.target.toFixed(2)}</b></div><div><small>error (ŷ − y)</small><b>{reading.error.toFixed(2)}</b></div><div data-accent="true"><small>loss (MSE)</small><b>{reading.loss.toFixed(2)}</b></div></div>
    </section>
    <LossGraph history={history} currentLoss={reading.loss} />
    {tool === 'graph' || tool === 'measurements' ? <div className={styles.actionStrip}><button type="button" onClick={updateOnce}>▶ {tr(locale, 'Шаг update', 'Update step')}</button><button type="button" onClick={autoTrain}>×10 {tr(locale, 'Автообучение', 'Auto-train')}</button><button type="button" onClick={resetExperiment}>↺ {tr(locale, 'Сброс', 'Reset')}</button></div> : null}
  </>;

  return <main className={styles.screen}>
    <header className={styles.header}>
      <Link href={`/${locale}/`} className={styles.brand}>AI <span>LAB</span></Link>
      <div className={styles.labTitle}><Icon name="flask"/><b>{tr(locale, 'Лаборатория обучения', 'Learning laboratory')}</b></div>
      <div className={styles.progress}><b>{tr(locale, 'Урок', 'Lesson')} 7/15</b><span><i style={{width: '46.67%'}}/></span></div>
      <div className={styles.headerActions}><Link href={`/${alternateLocale}/journey/${lesson.slug}`}>{alternateLocale.toUpperCase()}</Link><Link href={`/${locale}/my-ai/`} className={styles.myAi}><i/> MyAI · {projectFiles.length} {tr(locale, 'файлов', 'files')}⌄</Link></div>
    </header>

    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <nav>{labs.map((lab) => <Link href={starterLessonHref(locale, lab.lesson)} key={lab.id} data-active={lab.id === 'learning'}><Icon name={lab.icon}/><b>{tr(locale, lab.labelRu, lab.labelEn)}</b></Link>)}</nav>
        <div className={styles.sideFooter}><button type="button"><Icon name="help"/><span>{tr(locale, 'Помощь', 'Help')}</span></button><button type="button"><Icon name="settings"/><span>{tr(locale, 'Настройки', 'Settings')}</span></button></div>
      </aside>

      <section className={styles.centerColumn}>
        <MachineStage snapshot={snapshot} onUpdate={updateOnce}/>
        <div className={styles.bottomDock}>
          <section className={styles.notebook}><div className={styles.dockHeader}><b>▣ {tr(locale, 'Лабораторный журнал', 'Lab notebook')}</b><span>AUTOSAVE</span></div><div className={styles.notes}><article><b>{tr(locale, 'Гипотеза', 'Hypothesis')}</b><p>{tr(locale, 'Если уменьшить ошибку (loss), модель будет предсказывать ближе к целевому значению.', 'If loss decreases, the model prediction will move closer to the target.')}</p></article><article><b>{tr(locale, 'Наблюдение', 'Observation')}</b><p>prediction = {reading.prediction.toFixed(2)}, target = {snapshot.target.toFixed(2)}, loss = {reading.loss.toFixed(2)}.</p></article><article><b>{tr(locale, 'Вывод', 'Conclusion')}</b><p>{mission.betterWeight ? tr(locale, 'Изменение параметра действительно может уменьшить loss.', 'Changing a parameter can indeed reduce loss.') : tr(locale, 'Подбери w и сравни loss до и после.', 'Adjust w and compare loss before and after.')}</p></article></div></section>
          <section className={styles.projectDock}><div className={styles.dockHeader}><b>▰ MyAI Project</b><Link href={`/${locale}/my-ai/`}>{tr(locale, 'Открыть workspace', 'Open workspace')} →</Link></div><div className={styles.projectFiles}>{projectFiles.length ? projectFiles.map((file) => <div key={file.path} data-current={file.path === path}><code>{file.path.split('/').at(-1)}</code><span>{file.path === path ? '●' : '✓'}</span></div>) : <div className={styles.projectEmpty}>{tr(locale, 'Файлы появятся после Engineer-уроков.', 'Files appear after Engineer lessons.')}</div>}</div></section>
        </div>
      </section>

      <aside className={styles.rightRack} data-code={tool === 'code'}>
        <div className={styles.tabs}>{(['parameters','measurements','graph','code','theory'] as ToolId[]).map((item) => <button type="button" key={item} data-active={tool === item} onClick={() => setTool(item)}><span>{item === 'parameters' ? '☷' : item === 'measurements' ? '⚑' : item === 'graph' ? '⌁' : item === 'code' ? '</>' : '☷'}</span><b>{item === 'parameters' ? tr(locale,'Параметры','Parameters') : item === 'measurements' ? tr(locale,'Измерения','Measurements') : item === 'graph' ? tr(locale,'График','Graph') : item === 'code' ? tr(locale,'Код','Code') : tr(locale,'Теория','Theory')}</b></button>)}</div>
        <div className={styles.instrumentScroll}>{instrumentContent}</div>

        <section className={styles.codePanel}>
          <div className={styles.codeHeader}><code>{path}</code><div><button type="button" disabled={!activeFile || runtimeState === 'loading' || runtimeState === 'running'} onClick={() => void runCode(false)}>▶ RUN</button><button type="button" disabled={!activeFile || runtimeState === 'loading' || runtimeState === 'running'} onClick={() => void runCode(true)}>✓ TESTS</button><button type="button" disabled={!activeFile?.starterContent} onClick={() => {resetFile(path); setRunResult(null);}}>↺</button></div></div>
          <div className={styles.editor}>{activeFile ? <Editor height="100%" language="python" path={activeFile.path} theme="vs-dark" value={activeFile.content} onChange={(value) => {saveFile(path, value ?? ''); setRunResult(null);}} options={{automaticLayout:true, accessibilitySupport:'auto', ariaLabel:tr(locale,'Python-редактор MyAI','MyAI Python editor'), fontSize:13, lineHeight:21, minimap:{enabled:false}, padding:{top:14,bottom:12}, scrollBeyondLastLine:false, tabSize:4, insertSpaces:true, wordWrap:'on'}}/> : null}</div>
          <div className={styles.console}><div><b>{tr(locale, 'КОНСОЛЬ', 'CONSOLE')}</b><span>{pythonVersion ? `Python ${pythonVersion}` : runtimeState}</span></div>{!runResult ? <p>› {tr(locale, 'ГОТОВО К ЗАПУСКУ', 'READY TO RUN')}</p> : <><pre>{runResult.stdout || runResult.result || ''}</pre>{runResult.tests.map((test) => <p key={test.name} data-pass={test.passed}>› {test.passed ? '✓' : '×'} {test.name}</p>)}{runResult.stderr || runResult.traceback ? <pre className={styles.consoleError}>{runResult.stderr || runResult.traceback}</pre> : null}</>}</div>
        </section>
      </aside>
    </div>
  </main>;
}
