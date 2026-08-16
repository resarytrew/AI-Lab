'use client';

import {useTranslations} from 'next-intl';
import {useMemo, useState} from 'react';
import {LessonCodePanel} from '@/components/course/lesson-code-panel';
import {CourseShell} from '@/components/course/course-shell';
import {getFoundationHref} from '@/content/course';
import {linearFunction, linearSeries} from '@/lib/foundations';

export function VariablesFunctionsLesson() {
  const t = useTranslations();
  const [x, setX] = useState(3);
  const [scale, setScale] = useState(2);
  const [shift, setShift] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const output = linearFunction(x, scale, shift);
  const series = useMemo(() => linearSeries(scale, shift), [scale, shift]);
  const points = series
    .map(({x: px, y}) => {
      const sx = 14 + ((px + 2) / 6) * 212;
      const clamped = Math.max(-15, Math.min(20, y));
      const sy = 116 - ((clamped + 15) / 35) * 96;
      return `${sx},${sy}`;
    })
    .join(' ');
  const currentX = 14 + ((x + 2) / 6) * 212;
  const currentY =
    116 - ((Math.max(-15, Math.min(20, output)) + 15) / 35) * 96;

  const pythonLines = [
    'def transform(x, scale, shift):',
    '    return x * scale + shift',
    '',
    `x = ${x}`,
    `scale = ${scale}`,
    `shift = ${shift}`,
    '',
    'y = transform(x, scale, shift)',
    "print('Output:', y)",
  ];

  const answers = ['inputParams', 'allInputs', 'functionName'] as const;

  return (
    <CourseShell
      currentLessonId="variables-and-functions"
      codePanel={
        <LessonCodePanel
          fileName="functions.py"
          lines={pythonLines}
          output={runOutput}
          onRun={() => setRunOutput(`Output: ${output}`)}
          onReset={() => setRunOutput(null)}
          nextHref={getFoundationHref('first-neuron')}
          helper={t('variablesLesson.codeHelper')}
        />
      }
    >
      <section className="lesson" id="lesson">
        <div className="lesson-heading">
          <div>
            <div className="breadcrumb">
              <span>{t('course.foundations')}</span>
              <b>›</b>
              {t('course.variables')}
            </div>
            <h1>{t('variablesLesson.title')}</h1>
            <p>{t('variablesLesson.subtitle')}</p>
          </div>
          <button className="bookmark" type="button">
            ♡ {t('lesson.bookmark')}
          </button>
        </div>

        <ol className="stepper" aria-label={t('lesson.steps')}>
          <li className="step done">
            <span>✓</span>
            {t('lesson.predict')}
          </li>
          <li className="step active">
            <span>2</span>
            {t('lesson.explore')}
          </li>
          <li className="step">
            <span>3</span>
            {t('lesson.code')}
          </li>
        </ol>

        <div className="learning-grid">
          <article className="panel playground-panel">
            <div className="panel-title">
              <h2>{t('variablesLesson.playground')}</h2>
              <span title={t('variablesLesson.playgroundHint')}>ⓘ</span>
            </div>

            <div className="function-machine">
              <div className="variable-stack">
                <VariableChip symbol="x" label={t('variablesLesson.input')} value={x} tone="green" />
                <VariableChip symbol="a" label={t('variablesLesson.scale')} value={scale} tone="blue" />
                <VariableChip symbol="b" label={t('variablesLesson.shift')} value={shift} tone="amber" />
              </div>
              <span className="flow-arrow">→</span>
              <div className="function-box">
                <small>{t('variablesLesson.function')}</small>
                <strong>f(x) = ax + b</strong>
                <code>return x * a + b</code>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-value output-flow-value">
                <small>{t('variablesLesson.output')}</small>
                <strong>y = {output}</strong>
              </div>
            </div>

            <div className="playground-bottom function-playground-bottom">
              <div className="controls">
                <SliderRow label="x" hint={t('variablesLesson.input')} min={-2} max={4} value={x} onChange={setX} />
                <SliderRow label="a" hint={t('variablesLesson.scale')} min={-3} max={3} value={scale} onChange={setScale} />
                <SliderRow label="b" hint={t('variablesLesson.shift')} min={-5} max={5} value={shift} onChange={setShift} />
                <div className="output-box">
                  <span>{t('variablesLesson.output')}</span>
                  <b>f({x}) = {output}</b>
                </div>
              </div>
              <div className="mini-chart">
                <strong>{t('variablesLesson.chart')}</strong>
                <svg viewBox="0 0 240 130" role="img" aria-label={t('variablesLesson.chart')}>
                  <line x1="14" y1="116" x2="228" y2="116" className="axis" />
                  <line x1="14" y1="12" x2="14" y2="116" className="axis" />
                  <line x1="14" y1="84" x2="228" y2="84" className="gridline" />
                  <line x1="14" y1="52" x2="228" y2="52" className="gridline" />
                  <polyline points={points} className="plot-line" />
                  <circle cx={currentX} cy={currentY} r="4" className="plot-dot" />
                </svg>
                <span className="chart-caption">
                  a={scale}, b={shift}, ({x}, {output})
                </span>
              </div>
            </div>
          </article>

          <article className="panel by-hand-panel">
            <div className="panel-title">
              <h2>{t('variablesLesson.byHand')}</h2>
              <span>ⓘ</span>
            </div>
            <p>{t('variablesLesson.byHandText')}</p>
            <div className="calculation-list">
              <CalcRow symbol="x" value={`${x}`} tone="green" />
              <CalcRow symbol="a" value={`${scale}`} tone="blue" />
              <CalcRow symbol="b" value={`${shift}`} tone="amber" />
              <CalcRow symbol="ax" value={`${scale} × ${x} = ${scale * x}`} tone="blue" />
              <CalcRow symbol="f(x)" value={`${scale * x} + ${shift} = ${output}`} tone="green" />
            </div>
            <div className="formula-card">
              <b>f(x) = ax + b</b>
              <small>{t('variablesLesson.formulaNote')}</small>
            </div>
          </article>
        </div>

        <article className="panel quiz-panel">
          <small>{t('quiz.quickCheck')}</small>
          <h2>{t('variablesLesson.quiz.question')}</h2>
          <div className="answers">
            {answers.map((answer, index) => (
              <button
                key={answer}
                className={`answer ${selectedAnswer === answer ? 'selected-answer' : ''}`}
                type="button"
                onClick={() => {
                  setSelectedAnswer(answer);
                  setChecked(false);
                }}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {t(`variablesLesson.quiz.${answer}`)}
              </button>
            ))}
          </div>
          <div className="quiz-footer">
            <p className={checked ? (selectedAnswer === 'inputParams' ? 'success-text' : 'error-text') : ''}>
              {checked
                ? selectedAnswer === 'inputParams'
                  ? t('variablesLesson.quiz.correct')
                  : t('variablesLesson.quiz.tryAgain')
                : ''}
            </p>
            <button
              className="outline-red"
              type="button"
              disabled={!selectedAnswer}
              onClick={() => setChecked(true)}
            >
              {t('quiz.check')}
            </button>
          </div>
        </article>
      </section>
    </CourseShell>
  );
}

function VariableChip({
  symbol,
  label,
  value,
  tone,
}: {
  symbol: string;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`variable-chip ${tone}`}>
      <span>{symbol}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  hint,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider-row">
      <span>
        <b>{label}</b> <small>({hint})</small>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}

function CalcRow({symbol, value, tone}: {symbol: string; value: string; tone: string}) {
  return (
    <div className="calc-row">
      <span className={`calc-symbol ${tone}`}>{symbol}</span>
      <b>=</b>
      <code>{value}</code>
    </div>
  );
}
