'use client';

import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getChapterContent} from '@/content/chapter-content';
import {
  getStarterLesson,
  localize,
  starterLessonHref,
  starterLessons,
  type StarterLesson,
  type StarterLessonId,
} from '@/content/learning-path';
import {getLessonTheory} from '@/content/lesson-theory';
import {buildReferenceSource, PythonLabClient, type PythonRunResult, resolvePythonWorkerUrl} from '@/lib/python-lab';
import {lessonModulePath} from '@/lib/myai-workspace';
import {useMyAiWorkspace} from '@/lib/use-myai-workspace';
import {StarterLessonLab} from './starter-labs';
import styles from './lab-lesson.module.css';

type ToolId = 'parameters' | 'measurements' | 'graph' | 'code' | 'theory' | 'researcher';
type RuntimeState = 'idle' | 'loading' | 'ready' | 'running' | 'error';

type LabGroup = {
  id: string;
  icon: string;
  ru: string;
  en: string;
  lessonId: StarterLessonId;
  stages: readonly string[];
};

const progressKey = 'ai-lab:learning-journey:v2';

const labGroups: readonly LabGroup[] = [
  {id: 'intelligence', icon: '◎', ru: 'Интеллект', en: 'Intelligence', lessonId: 'smart-machine', stages: ['intelligence']},
  {id: 'data', icon: '▤', ru: 'Данные', en: 'Data', lessonId: 'data-to-meaning', stages: ['data-and-knowledge']},
  {id: 'rules', icon: '⌘', ru: 'Правила', en: 'Rules', lessonId: 'knowledge-as-rules', stages: ['rules-and-reasoning']},
  {id: 'learning', icon: '⌁', ru: 'Обучение', en: 'Learning', lessonId: 'learn-from-examples', stages: ['learning']},
  {id: 'network', icon: '◇', ru: 'Нейросеть', en: 'Neural net', lessonId: 'first-neuron', stages: ['neural-networks', 'backprop-and-generalization']},
  {id: 'language', icon: '◌', ru: 'Язык', en: 'Language', lessonId: 'text-as-data', stages: ['tokenization', 'language-modeling']},
] as const;

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function loadCompleted() {
  if (typeof window === 'undefined') return [] as StarterLessonId[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(progressKey) ?? '[]');
    if (!Array.isArray(parsed)) return [] as StarterLessonId[];
    return parsed.filter((id): id is StarterLessonId => starterLessons.some((lesson) => lesson.id === id));
  } catch {
    return [] as StarterLessonId[];
  }
}

function saveCompleted(ids: StarterLessonId[]) {
  window.localStorage.setItem(progressKey, JSON.stringify(ids));
}

function isLearningMachine(lesson: StarterLesson) {
  return lesson.stage === 'learning';
}

function machineName(lesson: StarterLesson, locale: string) {
  if (lesson.stage === 'intelligence') return 'ABILITY SCANNER';
  if (lesson.stage === 'data-and-knowledge') return 'CONTEXT ENGINE';
  if (lesson.stage === 'rules-and-reasoning') return 'RULE ENGINE';
  if (lesson.stage === 'learning') return 'MODEL (w, b)';
  if (lesson.stage === 'neural-networks') return lesson.id === 'neuron-layer' ? 'LAYER' : 'NEURON';
  if (lesson.stage === 'tokenization') return 'TOKENIZER';
  if (lesson.stage === 'language-modeling') return lesson.id === 'first-language-model' ? 'BIGRAM LM' : 'NEXT TOKEN';
  return tr(locale, 'МАШИНА', 'THE MACHINE');
}

function machineInput(lesson: StarterLesson, locale: string, x: number) {
  if (lesson.stage === 'intelligence') return tr(locale, 'система', 'system');
  if (lesson.stage === 'data-and-knowledge') return '42';
  if (lesson.stage === 'rules-and-reasoning') return tr(locale, 'факты', 'facts');
  if (lesson.stage === 'learning') return `x = ${x.toFixed(1)}`;
  if (lesson.stage === 'neural-networks') return '[x₁, x₂]';
  if (lesson.stage === 'tokenization') return tr(locale, '«текст»', '“text”');
  if (lesson.stage === 'language-modeling') return tr(locale, 'токен', 'token');
  return 'input';
}

function machineOutput(lesson: StarterLesson, locale: string, prediction: number) {
  if (lesson.stage === 'intelligence') return tr(locale, 'профиль', 'profile');
  if (lesson.stage === 'data-and-knowledge') return tr(locale, 'смысл', 'meaning');
  if (lesson.stage === 'rules-and-reasoning') return tr(locale, 'вывод', 'inference');
  if (lesson.stage === 'learning') return `ŷ = ${prediction.toFixed(2)}`;
  if (lesson.stage === 'neural-networks') return 'activation';
  if (lesson.stage === 'tokenization') return '[12, 4, 8]';
  if (lesson.stage === 'language-modeling') return 'P(next)';
  return 'output';
}

function toolLabel(tool: ToolId, locale: string) {
  const labels: Record<ToolId, [string, string]> = {
    parameters: ['Параметры', 'Parameters'],
    measurements: ['Измерения', 'Measurements'],
    graph: ['График', 'Graph'],
    code: ['Код', 'Code'],
    theory: ['Теория', 'Theory'],
    researcher: ['Эксперимент', 'Experiment'],
  };
  const [ru, en] = labels[tool];
  return tr(locale, ru, en);
}

function toolIcon(tool: ToolId) {
  const icons: Record<ToolId, string> = {
    parameters: '≛', measurements: '⌁', graph: '⌗', code: '</>', theory: '≡', researcher: '◉',
  };
  return icons[tool];
}

function LossGraph({loss, learningRate}: {loss: number; learningRate: number}) {
  const values = useMemo(() => {
    const safeLoss = Math.max(0.08, loss + 0.2);
    return Array.from({length: 16}, (_, index) => {
      const decay = Math.exp(-index * Math.max(0.05, learningRate * 2.2));
      const wobble = Math.sin(index * 1.1) * Math.min(0.14, learningRate * 0.18);
      return Math.max(0.06, safeLoss * decay + wobble + 0.06);
    });
  }, [learningRate, loss]);
  const max = Math.max(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${42 - (value / max) * 35}`).join(' ');

  return (
    <div className={styles.graphCard}>
      <div className={styles.graphHeader}><b>loss</b><span>● live</span></div>
      <svg viewBox="0 0 100 46" role="img" aria-label="loss graph" preserveAspectRatio="none">
        <line x1="0" y1="42" x2="100" y2="42" /><line x1="0" y1="25" x2="100" y2="25" /><line x1="0" y1="8" x2="100" y2="8" />
        <polyline points={points} />
        {values.map((value, index) => <circle key={`loss-${value.toFixed(7)}`} cx={(index / (values.length - 1)) * 100} cy={42 - (value / max) * 35} r="1.2" />)}
      </svg>
      <div className={styles.graphScale}><span>1</span><span>4</span><span>8</span><span>12</span><span>16</span></div>
    </div>
  );
}

function ProfileGraph({labels, activeIndex}: {labels: string[]; activeIndex: number}) {
  return <div className={styles.profileGraph}>{labels.map((label, index) => <div key={label}><span>{label}</span><i style={{width: `${28 + ((index * 17 + activeIndex * 13) % 67)}%`}} data-active={index === activeIndex} /></div>)}</div>;
}

function RangeControl({id, label, value, min, max, step, onChange}: {id: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void}) {
  return <label className={styles.rangeControl} htmlFor={id}><div><b>{label}</b><code>{value.toFixed(step < 0.1 ? 2 : 1)}</code></div><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Metric({label, value, accent = false}: {label: string; value: string; accent?: boolean}) {
  return <div className={styles.metric} data-accent={accent}><small>{label}</small><b>{value}</b></div>;
}

function ToolPanel({tool, locale, lesson, isComplete, visualIndex, setVisualIndex, x, setX, target, setTarget, weight, setWeight, bias, setBias, learningRate, setLearningRate, prediction, error, loss}: {
  tool: ToolId; locale: string; lesson: StarterLesson; isComplete: boolean; visualIndex: number; setVisualIndex: (value: number) => void;
  x: number; setX: (value: number) => void; target: number; setTarget: (value: number) => void; weight: number; setWeight: (value: number) => void;
  bias: number; setBias: (value: number) => void; learningRate: number; setLearningRate: (value: number) => void; prediction: number; error: number; loss: number;
}) {
  const content = getChapterContent(lesson.id);
  const theory = getLessonTheory(lesson.id);
  const [hypothesis, setHypothesis] = useState<number | null>(null);
  const [experimentRan, setExperimentRan] = useState(false);

  if (tool === 'parameters') {
    if (isLearningMachine(lesson)) {
      return <div className={styles.instrumentBody}>
        <RangeControl id="lab-x" label="x" value={x} min={-5} max={8} step={0.1} onChange={setX} />
        <RangeControl id="lab-w" label="w · weight" value={weight} min={-3} max={4} step={0.05} onChange={setWeight} />
        <RangeControl id="lab-b" label="b · bias" value={bias} min={-3} max={3} step={0.05} onChange={setBias} />
        <RangeControl id="lab-target" label="target y" value={target} min={-5} max={10} step={0.1} onChange={setTarget} />
        <RangeControl id="lab-lr" label="learning rate η" value={learningRate} min={0.01} max={1} step={0.01} onChange={setLearningRate} />
      </div>;
    }
    return <div className={styles.instrumentBody}><p className={styles.instrumentLead}>{localize(content.visualCaption, locale)}</p><div className={styles.nodeControlList}>{content.visualNodes.map((node, index) => <button type="button" key={node.label.en} className={visualIndex === index ? styles.nodeControlActive : ''} onClick={() => setVisualIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{localize(node.label, locale)}</b><small>{localize(node.detail, locale)}</small></div></button>)}</div></div>;
  }

  if (tool === 'measurements') {
    if (isLearningMachine(lesson)) return <div className={styles.measurementGrid}><Metric label="prediction (ŷ)" value={prediction.toFixed(2)} /><Metric label="target (y)" value={target.toFixed(2)} /><Metric label="error (ŷ − y)" value={error.toFixed(2)} /><Metric label="loss (MSE)" value={loss.toFixed(2)} accent /></div>;
    const active = content.visualNodes[visualIndex] ?? content.visualNodes[0];
    return <div className={styles.measurementStack}><Metric label={tr(locale, 'текущий узел', 'current node')} value={String(visualIndex + 1).padStart(2, '0')} /><Metric label={tr(locale, 'узлов механизма', 'mechanism nodes')} value={String(content.visualNodes.length)} /><Metric label={tr(locale, 'урок', 'lesson')} value={`${lesson.index + 1}/${starterLessons.length}`} /><article className={styles.currentReading}><small>{localize(active.label, locale)}</small><p>{localize(active.detail, locale)}</p></article></div>;
  }

  if (tool === 'graph') return <div className={styles.instrumentBody}>{isLearningMachine(lesson) ? <LossGraph loss={loss} learningRate={learningRate} /> : <ProfileGraph labels={content.visualNodes.map((node) => localize(node.label, locale))} activeIndex={visualIndex} />}<div className={styles.graphNote}>{localize(content.math.mechanism, locale)}</div></div>;

  if (tool === 'code') return <div className={styles.instrumentBody}><p className={styles.modeEyebrow}>ENGINEER · CODE</p><h3>{localize(content.engineer.goal, locale)}</h3><p>{localize(content.engineer.challenge, locale)}</p><div className={styles.checkpointList}>{content.engineer.checkpoints.map((checkpoint) => <div key={checkpoint.en}>✓ {localize(checkpoint, locale)}</div>)}</div>{!isComplete ? <div className={styles.toolLocked}>{tr(locale, 'Сначала заверши открытие в миссии. Затем код станет частью этой же лаборатории.', 'Complete the discovery mission first. Then code becomes another instrument in this same lab.')}</div> : null}</div>;

  if (tool === 'theory') return <div className={styles.theoryRack}><p className={styles.modeEyebrow}>{tr(locale, 'СПРАВОЧНИК ИССЛЕДОВАТЕЛЯ', 'RESEARCH NOTES')}</p><h3>{localize(theory.intro, locale)}</h3>{theory.sections.map((section) => <article key={section.title.en}><b>{localize(section.title, locale)}</b><p>{localize(section.body, locale)}</p></article>)}<div className={styles.glossaryRack}><small>{tr(locale, 'СЛОВАРЬ', 'GLOSSARY')}</small>{theory.terms.map(({term, definition}) => <div key={term.en}><b>{localize(term, locale)}</b><span>{localize(definition, locale)}</span></div>)}</div></div>;

  return <div className={styles.researchRack}><p className={styles.modeEyebrow}>RESEARCHER · EXPERIMENT</p><h3>{localize(content.researcher.question, locale)}</h3><small>{tr(locale, 'СНАЧАЛА ВЫБЕРИ ГИПОТЕЗУ', 'CHOOSE A HYPOTHESIS FIRST')}</small><div className={styles.hypothesisList}>{content.researcher.hypotheses.map((item, index) => <button type="button" key={item.en} className={hypothesis === index ? styles.hypothesisActive : ''} onClick={() => {setHypothesis(index); setExperimentRan(false);}}><span>{String.fromCharCode(65 + index)}</span>{localize(item, locale)}</button>)}</div><ol>{content.researcher.procedure.map((item) => <li key={item.en}>{localize(item, locale)}</li>)}</ol><button type="button" className={styles.runExperiment} disabled={hypothesis === null} onClick={() => setExperimentRan(true)}>{tr(locale, 'Запустить эксперимент', 'Run experiment')} →</button>{experimentRan ? <div className={styles.researchResult}><small>{tr(locale, 'НАБЛЮДЕНИЯ', 'OBSERVATIONS')}</small>{content.researcher.observations.map((item) => <p key={item.en}>• {localize(item, locale)}</p>)}<b>{tr(locale, 'Вывод', 'Conclusion')}</b><p>{localize(content.researcher.conclusion, locale)}</p></div> : null}</div>;
}

function MachineCanvas({locale, lesson, visualIndex, setVisualIndex, hoodOpen, setHoodOpen, weight, bias, x, target, learningRate}: {locale: string; lesson: StarterLesson; visualIndex: number; setVisualIndex: (value: number) => void; hoodOpen: boolean; setHoodOpen: (value: boolean) => void; weight: number; bias: number; x: number; target: number; learningRate: number}) {
  const content = getChapterContent(lesson.id);
  const prediction = x * weight + bias;
  const loss = (prediction - target) ** 2;
  const activeNode = content.visualNodes[visualIndex] ?? content.visualNodes[0];
  return <section className={styles.machineCanvas}>
    <div className={styles.machineTitle}><b>THE MACHINE</b><span>{localize(lesson.title, locale)}</span></div>
    <div className={styles.machineRail}>
      <button type="button" className={styles.inputUnit} onClick={() => setVisualIndex(0)}><small>INPUT</small><strong>{machineInput(lesson, locale, x)}</strong><span>◉</span></button><i className={styles.cable} />
      <button type="button" className={styles.coreUnit} onClick={() => setHoodOpen(!hoodOpen)}><small>{machineName(lesson, locale)}</small><strong>{isLearningMachine(lesson) ? 'ŷ = w · x + b' : localize(activeNode.label, locale)}</strong>{isLearningMachine(lesson) ? <div className={styles.coreMeters}><span><small>w</small><b>{weight.toFixed(2)}</b></span><span><small>b</small><b>{bias.toFixed(2)}</b></span></div> : <p>{localize(activeNode.detail, locale)}</p>}<em>{hoodOpen ? tr(locale, 'закрыть капот', 'close hood') : tr(locale, 'открыть капот', 'open hood')}</em></button><i className={styles.cable} />
      <button type="button" className={styles.outputUnit} onClick={() => setVisualIndex(Math.max(0, content.visualNodes.length - 1))}><small>OUTPUT</small><strong>{machineOutput(lesson, locale, prediction)}</strong><span>◉</span></button>
    </div>
    {isLearningMachine(lesson) ? <div className={styles.feedbackLoop}><div className={styles.lossUnit}><small>LOSS (MSE)</small><code>L = (ŷ − y)²</code><b>{loss.toFixed(2)}</b></div><div className={styles.updateUnit}><small>UPDATE</small><code>w,b ← w,b − η·∇L</code><button type="button">▶ {tr(locale, 'обновить', 'update')}</button></div><div className={styles.loopMeta}><span>target <b>{target.toFixed(1)}</b></span><span>η <b>{learningRate.toFixed(2)}</b></span></div></div> : <div className={styles.visualNodeRail}>{content.visualNodes.map((node, index) => <button type="button" key={node.label.en} className={visualIndex === index ? styles.visualNodeActive : ''} onClick={() => setVisualIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span><b>{localize(node.label, locale)}</b></button>)}</div>}
    {hoodOpen ? <div className={styles.hoodPanel}><div><small>{tr(locale, 'ОТКРЫЙ КАПОТ · МАТЕМАТИКА И МЕХАНИЗМ', 'OPEN THE HOOD · MATH & MECHANISM')}</small><h3>{localize(content.math.lead, locale)}</h3></div>{content.math.formula ? <code className={styles.hoodFormula}>{content.math.formula}</code> : null}<div className={styles.hoodSteps}>{content.math.byHand.map((step) => <article key={step.label.en}><b>{localize(step.label, locale)}</b>{step.expression ? <code>{step.expression}</code> : null}<p>{localize(step.explanation, locale)}</p></article>)}</div></div> : null}
  </section>;
}

function EngineerDock({locale, lesson, enabled}: {locale: string; lesson: StarterLesson; enabled: boolean}) {
  const content = getChapterContent(lesson.id);
  const {workspace, ensureLessonFile, saveFile, resetFile} = useMyAiWorkspace();
  const path = lessonModulePath(lesson.id);
  const activeFile = workspace?.files[path];
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [pythonVersion, setPythonVersion] = useState('');
  const [runResult, setRunResult] = useState<PythonRunResult | null>(null);
  const runtimeRef = useRef<PythonLabClient | null>(null);

  useEffect(() => { if (enabled) ensureLessonFile(lesson.id, content.engineer.starterCode); }, [content.engineer.starterCode, enabled, ensureLessonFile, lesson.id]);
  useEffect(() => () => { runtimeRef.current?.terminate(); runtimeRef.current = null; }, []);

  async function ensureRuntime() {
    if (runtimeRef.current && runtimeState === 'ready') return runtimeRef.current;
    if (typeof window === 'undefined') return null;
    const client = new PythonLabClient(resolvePythonWorkerUrl(window.location));
    runtimeRef.current = client;
    setRuntimeState('loading');
    try { const response = await client.init(); if (runtimeRef.current !== client) return null; setPythonVersion(response.pythonVersion ?? ''); setRuntimeState('ready'); return client; }
    catch (error) { client.terminate(); runtimeRef.current = null; setRuntimeState('error'); setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0}); return null; }
  }

  async function run(withTests: boolean) {
    if (!activeFile || runtimeState === 'running' || runtimeState === 'loading') return;
    const client = await ensureRuntime(); if (!client) return;
    setRuntimeState('running'); setRunResult(null);
    try { const response = withTests ? await client.test(activeFile.content, buildReferenceSource(content.engineer.starterCode, content.engineer.expected)) : await client.run(activeFile.content); setRunResult(response); setRuntimeState('ready'); }
    catch (error) { client.terminate(); runtimeRef.current = null; setRuntimeState('error'); setRunResult({ok: false, stdout: '', stderr: '', result: '', tests: [], traceback: error instanceof Error ? error.message : String(error), durationMs: 0}); }
  }

  if (!enabled) return <section className={styles.codeDockLocked}><b>ENGINEER · CODE</b><p>{tr(locale, 'Код откроется после первого открытия урока. Он останется частью MyAI и будет автосохраняться.', 'Code unlocks after the lesson discovery. It remains part of MyAI and autosaves.')}</p></section>;
  return <section className={styles.codeDock}><div className={styles.codeTopbar}><code>{path}</code><div><button type="button" disabled={!activeFile || runtimeState === 'running' || runtimeState === 'loading'} onClick={() => void run(false)}>▶ RUN</button><button type="button" disabled={!activeFile || runtimeState === 'running' || runtimeState === 'loading'} onClick={() => void run(true)}>✓ TESTS</button><button type="button" disabled={!activeFile?.starterContent} onClick={() => {resetFile(path); setRunResult(null);}}>↺</button></div></div><div className={styles.codeEditor}>{activeFile ? <Editor height="100%" language="python" path={activeFile.path} theme="vs-dark" value={activeFile.content} onChange={(value) => {saveFile(path, value ?? ''); setRunResult(null);}} options={{automaticLayout: true, accessibilitySupport: 'auto', ariaLabel: tr(locale, 'Python-редактор MyAI', 'MyAI Python editor'), fontSize: 13, lineHeight: 21, minimap: {enabled: false}, padding: {top: 12, bottom: 12}, scrollBeyondLastLine: false, tabSize: 4, insertSpaces: true, wordWrap: 'on'}} /> : <div className={styles.editorLoading}>{tr(locale, 'Создаём файл MyAI…', 'Creating MyAI file…')}</div>}</div><div className={styles.terminal} aria-live="polite"><div><b>{runResult?.tests.length ? 'ТЕСТЫ' : 'КОНСОЛЬ'}</b><span>{pythonVersion ? `Python ${pythonVersion}` : runtimeState}</span></div>{!runResult ? <p>&gt; {tr(locale, 'Готово к запуску', 'Ready to run')}</p> : null}{runResult?.stdout ? <pre>{runResult.stdout}</pre> : null}{runResult?.result ? <pre>{runResult.result}</pre> : null}{runResult?.stderr ? <pre className={styles.terminalError}>{runResult.stderr}</pre> : null}{runResult?.traceback ? <pre className={styles.terminalError}>{runResult.traceback}</pre> : null}{runResult?.tests.map((test) => <p key={test.name} data-pass={test.passed}>{test.passed ? '✓' : '×'} {test.name} · {test.detail}</p>)}</div></section>;
}

function LabNotebook({locale, lesson, isComplete, observation}: {locale: string; lesson: StarterLesson; isComplete: boolean; observation: string}) {
  return <section className={styles.notebook}><div className={styles.bottomTitle}><b>▣ {tr(locale, 'Лабораторный журнал', 'Lab notebook')}</b><span>AUTOSAVE</span></div><div className={styles.notebookPage}><article><small>{tr(locale, 'Гипотеза', 'Hypothesis')}</small><p>{localize(lesson.before, locale)}</p></article><article><small>{tr(locale, 'Наблюдение', 'Observation')}</small><p>{observation}</p></article><article><small>{tr(locale, 'Вывод', 'Conclusion')}</small><p>{isComplete ? localize(lesson.after, locale) : tr(locale, 'Вывод появится после завершения миссии.', 'The conclusion appears after the mission is complete.')}</p></article></div></section>;
}

function ProjectMini({locale, lesson}: {locale: string; lesson: StarterLesson}) {
  const {workspace} = useMyAiWorkspace();
  const currentPath = lessonModulePath(lesson.id);
  const files = useMemo(() => workspace ? Object.values(workspace.files).filter((file) => file.sourceLessonId).sort((left, right) => left.path.localeCompare(right.path)).slice(-8) : [], [workspace]);
  return <section className={styles.projectMini}><div className={styles.bottomTitle}><b>▱ MyAI Project</b><Link href={`/${locale}/my-ai/`}>{tr(locale, 'Открыть workspace', 'Open workspace')} ↗</Link></div><div className={styles.projectFiles}>{files.length ? files.map((file) => <div key={file.path} data-current={file.path === currentPath}><span>{file.path.split('/').at(-1)}</span><b>{file.path === currentPath ? '●' : '✓'}</b></div>) : <p>{tr(locale, 'Первый Python-модуль появится после открытия Engineer.', 'Your first Python module appears after Engineer unlocks.')}</p>}</div></section>;
}

export function LabLessonPage({locale, lessonSlug}: {locale: string; lessonSlug: string}) {
  const lesson = getStarterLesson(lessonSlug);
  const [completed, setCompleted] = useState<StarterLessonId[]>([]);
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState<ToolId>('parameters');
  const [visualIndex, setVisualIndex] = useState(0);
  const [hoodOpen, setHoodOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(true);
  const [x, setX] = useState(3);
  const [target, setTarget] = useState(5);
  const [weight, setWeight] = useState(1.2);
  const [bias, setBias] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);

  useEffect(() => { setCompleted(loadCompleted()); setReady(true); }, []);

  if (!lesson) return <main className={styles.notFound}>{tr(locale, 'Урок не найден.', 'Lesson not found.')}</main>;

  const isComplete = completed.includes(lesson.id);
  const content = getChapterContent(lesson.id);
  const prediction = x * weight + bias;
  const error = prediction - target;
  const loss = error ** 2;
  const activeVisual = content.visualNodes[visualIndex] ?? content.visualNodes[0];
  const alternateLocale = locale === 'en' ? 'ru' : 'en';
  const previous = starterLessons.find((candidate) => candidate.nextId === lesson.id);
  const previousHref = previous ? starterLessonHref(locale, previous.id) : null;
  const nextHref = lesson.nextId ? starterLessonHref(locale, lesson.nextId) : null;
  const activeGroup = labGroups.find((group) => group.stages.includes(lesson.stage))?.id;

  const completeLesson = () => { setCompleted((current) => { if (current.includes(lesson.id)) return current; const next = [...current, lesson.id]; saveCompleted(next); return next; }); setMissionOpen(false); };
  const observation = isLearningMachine(lesson) ? `x=${x.toFixed(1)}, w=${weight.toFixed(2)}, b=${bias.toFixed(2)} → prediction=${prediction.toFixed(2)}, loss=${loss.toFixed(2)}` : `${localize(activeVisual.label, locale)} — ${localize(activeVisual.detail, locale)}`;

  return <main className={styles.labScreen}>
    <header className={styles.topbar}><Link href={`/${locale}/`} className={styles.brand}>AI <span>LAB</span></Link><div className={styles.labName}><span>♙</span><b>{tr(locale, 'Лаборатория', 'Laboratory')} · {localize(lesson.title, locale)}</b></div><div className={styles.lessonProgress}><span>{tr(locale, 'Урок', 'Lesson')} {lesson.index + 1}/{starterLessons.length}</span><i><b style={{width: `${((lesson.index + (isComplete ? 1 : 0)) / starterLessons.length) * 100}%`}} /></i></div><div className={styles.topActions}><Link href={`/${alternateLocale}/journey/${lesson.slug}`}>{alternateLocale.toUpperCase()}</Link><Link href={`/${locale}/my-ai/`} className={styles.myAiPill}><span>●</span> MyAI · {ready ? completed.length : 0} {tr(locale, 'мод.', 'mod.')}</Link></div></header>
    <div className={styles.labLayout}>
      <aside className={styles.leftRail}><nav aria-label={tr(locale, 'Лаборатории курса', 'Course laboratories')}>{labGroups.map((group) => <Link key={group.id} href={starterLessonHref(locale, group.lessonId)} data-active={group.id === activeGroup}><span>{group.icon}</span><b>{tr(locale, group.ru, group.en)}</b></Link>)}</nav><div className={styles.leftRailFooter}><button type="button">? <span>{tr(locale, 'Помощь', 'Help')}</span></button><button type="button">⚙ <span>{tr(locale, 'Настройки', 'Settings')}</span></button></div></aside>
      <section className={styles.centerStage}><div className={styles.stageTopline}><div><small>{tr(locale, 'ТЕКУЩАЯ МИССИЯ', 'CURRENT MISSION')}</small><b>{localize(lesson.question, locale)}</b></div><button type="button" className={styles.missionButton} data-complete={isComplete} onClick={() => setMissionOpen((value) => !value)}>{isComplete ? '✓' : '○'} {tr(locale, 'Миссия', 'Mission')}</button></div><MachineCanvas locale={locale} lesson={lesson} visualIndex={visualIndex} setVisualIndex={setVisualIndex} hoodOpen={hoodOpen} setHoodOpen={setHoodOpen} weight={weight} bias={bias} x={x} target={target} learningRate={learningRate} />{missionOpen ? <div className={styles.missionDrawer}><div className={styles.missionDrawerHeader}><b>{tr(locale, 'ИССЛЕДОВАТЕЛЬСКАЯ МИССИЯ', 'RESEARCH MISSION')}</b><button type="button" onClick={() => setMissionOpen(false)}>×</button></div><StarterLessonLab lessonId={lesson.id} locale={locale} onComplete={completeLesson} /></div> : null}<div className={styles.stageNavigation}>{previousHref ? <Link href={previousHref}>← {tr(locale, 'Назад', 'Back')}</Link> : <span />}{nextHref && isComplete ? <Link href={nextHref}>{tr(locale, 'Следующая лаборатория', 'Next laboratory')} →</Link> : <span>{isComplete ? tr(locale, 'Открытие зафиксировано', 'Discovery recorded') : tr(locale, 'Заверши миссию, чтобы двигаться дальше', 'Complete the mission to continue')}</span>}</div></section>
      <aside className={styles.instrumentRack}><div className={styles.toolTabs} role="tablist" aria-label={tr(locale, 'Инструменты лаборатории', 'Laboratory instruments')}>{(['parameters', 'measurements', 'graph', 'code', 'theory', 'researcher'] as const).map((item) => <button type="button" role="tab" key={item} aria-selected={tool === item} data-active={tool === item} onClick={() => setTool(item)}><span>{toolIcon(item)}</span><b>{toolLabel(item, locale)}</b></button>)}</div><div className={styles.instrumentPanel}><ToolPanel tool={tool} locale={locale} lesson={lesson} isComplete={isComplete} visualIndex={visualIndex} setVisualIndex={setVisualIndex} x={x} setX={setX} target={target} setTarget={setTarget} weight={weight} setWeight={setWeight} bias={bias} setBias={setBias} learningRate={learningRate} setLearningRate={setLearningRate} prediction={prediction} error={error} loss={loss} /></div><EngineerDock locale={locale} lesson={lesson} enabled={isComplete} /></aside>
      <div className={styles.bottomDock}><LabNotebook locale={locale} lesson={lesson} isComplete={isComplete} observation={observation} /><ProjectMini locale={locale} lesson={lesson} /></div>
    </div>
  </main>;
}
