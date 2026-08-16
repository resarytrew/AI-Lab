'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { neuronOutput, neuronSeries } from '@/lib/neuron';

const pythonLines = [
  { id: 'function', text: 'def neuron(x, w, b):' },
  { id: 'return', text: '    return x * w + b' },
  { id: 'gap-1', text: '' },
  { id: 'x', text: 'x = 3' },
  { id: 'w', text: 'w = 2' },
  { id: 'b', text: 'b = 1' },
  { id: 'gap-2', text: '' },
  { id: 'call', text: 'y = neuron(x, w, b)' },
  { id: 'print', text: "print('Output:', y)" },
];

export function FirstNeuronLesson() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [x, setX] = useState(3);
  const [weight, setWeight] = useState(2);
  const [bias, setBias] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [runOutput, setRunOutput] = useState<number | null>(null);

  const output = neuronOutput(x, weight, bias);
  const series = useMemo(() => neuronSeries(weight, bias), [weight, bias]);
  const points = series
    .map(({ x: px, y }) => {
      const sx = 14 + ((px + 2) / 6) * 212;
      const clamped = Math.max(-10, Math.min(20, y));
      const sy = 116 - ((clamped + 10) / 30) * 96;
      return `${sx},${sy}`;
    })
    .join(' ');

  const switchLocale = () => {
    const nextLocale = locale === 'ru' ? 'en' : 'ru';
    router.replace(pathname, { locale: nextLocale });
  };

  const answers = ['increase', 'decrease', 'same'] as const;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">AI Lab</div>
        <nav className="topnav" aria-label={t('nav.aria')}>
          <a className="topnav-link active" href="#lesson">{t('nav.learn')}</a>
          <a className="topnav-link" href="#labs">{t('nav.labs')}</a>
          <a className="topnav-link" href="#code">{t('nav.code')}</a>
          <a className="topnav-link" href="#my-ai">{t('nav.myAi')}</a>
          <a className="topnav-link" href="#progress">{t('nav.progress')}</a>
        </nav>
        <div className="topbar-actions">
          <button className="ghost-action" type="button">▣ {t('nav.docs')}</button>
          <button className="icon-button" type="button" aria-label={t('nav.notifications')}>♧</button>
          <button className="locale-switch" type="button" onClick={switchLocale} aria-label={t('nav.switchLanguage')}>
            {locale === 'ru' ? 'EN' : 'RU'}
          </button>
          <span className="avatar" role="img" aria-label={t('nav.profile')}>SR</span>
        </div>
      </header>

      <aside className="sidebar">
        <section className="sidebar-block progress-block">
          <div className="row-between">
            <strong>{t('course.progress')}</strong>
            <span className="accent-text">3%</span>
          </div>
          <div className="progress-track"><span style={{ width: '3%' }} /></div>
          <p>{t('course.completed', { done: 1, total: 43 })}</p>
        </section>

        <section className="sidebar-block course-map">
          <h2>{t('course.map')}</h2>
          <div className="module open">
            <div className="module-title"><span className="status-ring current" /><strong>{t('course.foundations')}</strong><span>1/6</span></div>
            <div className="lesson-list">
              <span className="lesson-item done"><i />{t('course.whatIsModel')}</span>
              <span className="lesson-item"><i />{t('course.variables')}</span>
              <span className="lesson-item selected"><i />{t('course.firstNeuron')}</span>
              <span className="lesson-item"><i />{t('course.loss')}</span>
              <span className="lesson-item"><i />{t('course.gradient')}</span>
              <span className="lesson-item"><i />{t('course.backprop')}</span>
            </div>
          </div>
          {['tokenization', 'attention', 'transformer', 'myGpt'].map((key) => (
            <div className="module locked" key={key}>
              <div className="module-title"><span className="status-ring" /><strong>{t(`course.${key}`)}</strong><span>⌑ 0/{key === 'tokenization' ? 4 : key === 'myGpt' ? 5 : 6}</span></div>
            </div>
          ))}
        </section>
        <button type="button" className="download-button">⇩ {t('course.download')}</button>
      </aside>

      <section className="lesson" id="lesson">
        <div className="lesson-heading">
          <div>
            <div className="breadcrumb"><span>{t('course.foundations')}</span><b>›</b>{t('course.firstNeuron')}</div>
            <h1>{t('firstNeuron.title')}</h1>
            <p>{t('firstNeuron.subtitle')}</p>
          </div>
          <button className="bookmark" type="button">♡ {t('lesson.bookmark')}</button>
        </div>

        <ol className="stepper" aria-label={t('lesson.steps')}>
          <li className="step done"><span>✓</span>{t('lesson.predict')}</li>
          <li className="step active"><span>2</span>{t('lesson.explore')}</li>
          <li className="step"><span>3</span>{t('lesson.code')}</li>
        </ol>

        <div className="learning-grid">
          <article className="panel playground-panel">
            <div className="panel-title"><h2>{t('firstNeuron.playground')}</h2><span title={t('firstNeuron.playgroundHint')}>ⓘ</span></div>
            <div className="neuron-diagram" role="img" aria-label={t('firstNeuron.diagramLabel')}>
              <div className="diagram-node input-node"><b>x</b><small>{t('firstNeuron.input')}</small></div>
              <span className="arrow">→</span>
              <div className="operator-node multiply">×<small>{t('firstNeuron.weight')}</small><em>w</em></div>
              <span className="arrow">→</span>
              <div className="operator-node plus">+<small>{t('firstNeuron.bias')}</small><em>b</em></div>
              <span className="arrow">→</span>
              <div className="diagram-node output-node"><b>y</b><small>{t('firstNeuron.output')}</small></div>
            </div>
            <div className="formula-main">y = wx + b</div>

            <div className="playground-bottom">
              <div className="controls">
                <SliderRow label="x" hint={t('firstNeuron.input')} min={-5} max={5} value={x} onChange={setX} />
                <SliderRow label="w" hint={t('firstNeuron.weight')} min={-3} max={3} value={weight} onChange={setWeight} />
                <SliderRow label="b" hint={t('firstNeuron.bias')} min={-5} max={5} value={bias} onChange={setBias} />
                <div className="output-box"><span>{t('firstNeuron.output')}</span><b>y = {output}</b></div>
              </div>
              <div className="mini-chart">
                <strong>{t('firstNeuron.chart')}</strong>
                <svg viewBox="0 0 240 130" role="img" aria-label={t('firstNeuron.chart')}>
                  <line x1="14" y1="116" x2="228" y2="116" className="axis" />
                  <line x1="14" y1="12" x2="14" y2="116" className="axis" />
                  <line x1="14" y1="84" x2="228" y2="84" className="gridline" />
                  <line x1="14" y1="52" x2="228" y2="52" className="gridline" />
                  <polyline points={points} className="plot-line" />
                  <circle cx={14 + ((x + 2) / 6) * 212} cy={116 - ((Math.max(-10, Math.min(20, output)) + 10) / 30) * 96} r="4" className="plot-dot" />
                </svg>
                <span className="chart-caption">w={weight}, b={bias}, ({x}, {output})</span>
              </div>
            </div>
          </article>

          <article className="panel by-hand-panel">
            <div className="panel-title"><h2>{t('firstNeuron.byHand')}</h2><span>ⓘ</span></div>
            <p>{t('firstNeuron.byHandText')}</p>
            <div className="calculation-list">
              <CalcRow symbol="x" value={`${x}`} tone="green" />
              <CalcRow symbol="w" value={`${weight}`} tone="blue" />
              <CalcRow symbol="b" value={`${bias}`} tone="amber" />
              <CalcRow symbol="wx" value={`${x} × ${weight} = ${x * weight}`} tone="blue" />
              <CalcRow symbol="y" value={`${x * weight} + ${bias} = ${output}`} tone="green" />
            </div>
            <div className="formula-card"><b>y = wx + b</b><small>{t('firstNeuron.formulaNote')}</small></div>
          </article>
        </div>

        <article className="panel quiz-panel">
          <small>{t('quiz.quickCheck')}</small>
          <h2>{t('quiz.question')}</h2>
          <div className="answers">
            {answers.map((answer, index) => (
              <button key={answer} className={`answer ${selectedAnswer === answer ? 'selected-answer' : ''}`} type="button" onClick={() => { setSelectedAnswer(answer); setChecked(false); }}>
                <span>{String.fromCharCode(65 + index)}</span>{t(`quiz.${answer}`)}
              </button>
            ))}
          </div>
          <div className="quiz-footer">
            <p className={checked ? (selectedAnswer === 'increase' ? 'success-text' : 'error-text') : ''}>
              {checked ? (selectedAnswer === 'increase' ? t('quiz.correct') : t('quiz.tryAgain')) : ''}
            </p>
            <button className="outline-red" type="button" disabled={!selectedAnswer} onClick={() => setChecked(true)}>{t('quiz.check')}</button>
          </div>
        </article>
      </section>

      <aside className="code-column" id="code">
        <div className="code-editor">
          <div className="code-toolbar"><strong>🐍 neuron.py</strong><div><button type="button" onClick={() => setRunOutput(null)}>↻ {t('code.reset')}</button><button type="button" className="run-button" onClick={() => setRunOutput(output)}>▷ {t('code.run')}</button></div></div>
          <ol className="code-lines">
            {pythonLines.map(({ id, text }) => <li key={id}><code>{text || ' '}</code></li>)}
          </ol>
          <div className="terminal-output"><span>›</span>{runOutput === null ? t('code.ready') : `Output: ${runOutput}`}</div>
        </div>
        <div className="code-actions"><button type="button" onClick={() => setRunOutput(null)}>↻ {t('code.reset')}</button><button type="button" className="next-button">{t('code.next')} →</button></div>
        <p className="code-helper">{t('code.helper')}</p>
      </aside>

      <section className="build-strip" id="my-ai">
        <div><h2>{t('build.title')}</h2><p>{t('build.subtitle')}</p></div>
        <BuildStep label={t('build.neuron')} state="progress" />
        <span className="connector" />
        <BuildStep label={t('build.loss')} state="next" />
        <span className="connector" />
        <BuildStep label={t('build.gradient')} state="locked" />
        <span className="connector" />
        <BuildStep label={t('build.bigram')} state="locked" />
        <span className="connector" />
        <BuildStep label={t('build.attention')} state="locked" />
        <span className="connector" />
        <BuildStep label={t('build.transformer')} state="locked" />
      </section>
    </main>
  );
}

function SliderRow({ label, hint, min, max, value, onChange }: { label: string; hint: string; min: number; max: number; value: number; onChange: (value: number) => void }) {
  return <label className="slider-row"><span><b>{label}</b> <small>({hint})</small></span><input type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} /><output>{value}</output></label>;
}

function CalcRow({ symbol, value, tone }: { symbol: string; value: string; tone: string }) {
  return <div className="calc-row"><span className={`calc-symbol ${tone}`}>{symbol}</span><b>=</b><code>{value}</code></div>;
}

function BuildStep({ label, state }: { label: string; state: 'progress' | 'next' | 'locked' }) {
  return <div className={`build-step ${state}`}><span>{state === 'progress' ? '◔' : state === 'next' ? '○' : '⌑'}</span><div><strong>{label}</strong><small>{state === 'progress' ? 'In progress' : state === 'next' ? 'Next' : 'Locked'}</small></div></div>;
}
