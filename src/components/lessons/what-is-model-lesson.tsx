'use client';

import {useTranslations} from 'next-intl';
import {useMemo, useState} from 'react';
import {LessonCodePanel} from '@/components/course/lesson-code-panel';
import {CourseShell} from '@/components/course/course-shell';
import {getFoundationHref} from '@/content/course';
import {
  evaluateModel,
  modelRuleExpression,
  modelRulePython,
  type ModelRule,
} from '@/lib/foundations';

const rules: readonly ModelRule[] = ['double', 'plusThree', 'square'];

export function WhatIsModelLesson() {
  const t = useTranslations();
  const [input, setInput] = useState(4);
  const [rule, setRule] = useState<ModelRule>('double');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);

  const output = evaluateModel(input, rule);
  const expression = modelRuleExpression(rule);
  const pythonLines = useMemo(
    () => [
      'def model(x):',
      modelRulePython(rule),
      '',
      `x = ${input}`,
      'y = model(x)',
      "print('Output:', y)",
    ],
    [input, rule],
  );

  const answers = ['function', 'database', 'magic'] as const;

  return (
    <CourseShell
      currentLessonId="what-is-model"
      codePanel={
        <LessonCodePanel
          fileName="model.py"
          lines={pythonLines}
          output={runOutput}
          onRun={() => setRunOutput(`Output: ${output}`)}
          onReset={() => setRunOutput(null)}
          nextHref={getFoundationHref('variables-and-functions')}
          helper={t('whatIsModel.codeHelper')}
        />
      }
    >
      <section className="lesson" id="lesson">
        <div className="lesson-heading">
          <div>
            <div className="breadcrumb">
              <span>{t('course.foundations')}</span>
              <b>›</b>
              {t('course.whatIsModel')}
            </div>
            <h1>{t('whatIsModel.title')}</h1>
            <p>{t('whatIsModel.subtitle')}</p>
          </div>
          <button className="bookmark" type="button">
            ♡ {t('lesson.bookmark')}
          </button>
        </div>

        <ol className="stepper" aria-label={t('lesson.steps')}>
          <li className="step active">
            <span>1</span>
            {t('lesson.predict')}
          </li>
          <li className="step">
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
              <h2>{t('whatIsModel.playground')}</h2>
              <span title={t('whatIsModel.playgroundHint')}>ⓘ</span>
            </div>

            <div className="model-flow" role="img" aria-label={t('whatIsModel.diagramLabel')}>
              <div className="flow-value">
                <small>{t('whatIsModel.input')}</small>
                <strong>x = {input}</strong>
              </div>
              <span className="flow-arrow">→</span>
              <div className="black-box-model">
                <small>{t('whatIsModel.blackBox')}</small>
                <strong>{expression}</strong>
              </div>
              <span className="flow-arrow">→</span>
              <div className="flow-value output-flow-value">
                <small>{t('whatIsModel.output')}</small>
                <strong>y = {output}</strong>
              </div>
            </div>

            <div className="rule-lab">
              <strong>{t('whatIsModel.chooseRule')}</strong>
              <div className="rule-switcher">
                {rules.map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    className={rule === candidate ? 'rule-button selected-rule' : 'rule-button'}
                    onClick={() => {
                      setRule(candidate);
                      setRunOutput(null);
                    }}
                  >
                    {t(`whatIsModel.rules.${candidate}`)}
                  </button>
                ))}
              </div>
              <label className="slider-row wide-slider">
                <span>
                  <b>x</b> <small>({t('whatIsModel.input')})</small>
                </span>
                <input
                  type="range"
                  min="-5"
                  max="8"
                  value={input}
                  onChange={(event) => {
                    setInput(Number(event.target.value));
                    setRunOutput(null);
                  }}
                />
                <output>{input}</output>
              </label>
            </div>

            <div className="concept-callout">
              <b>{t('whatIsModel.conceptTitle')}</b>
              <p>{t('whatIsModel.conceptText')}</p>
              <div className="concept-equation">
                {t('whatIsModel.input')} → {t('whatIsModel.transformation')} → {t('whatIsModel.output')}
              </div>
            </div>
          </article>

          <article className="panel by-hand-panel">
            <div className="panel-title">
              <h2>{t('whatIsModel.byHand')}</h2>
              <span>ⓘ</span>
            </div>
            <p>{t('whatIsModel.byHandText')}</p>
            <div className="calculation-list">
              <CalcRow label="x" value={`${input}`} />
              <CalcRow label="f" value={expression.replace('y = ', '')} />
              <CalcRow label="y" value={`${output}`} />
            </div>
            <div className="formula-card model-formula-card">
              <b>y = f(x)</b>
              <small>{t('whatIsModel.formulaNote')}</small>
            </div>
          </article>
        </div>

        <article className="panel quiz-panel">
          <small>{t('quiz.quickCheck')}</small>
          <h2>{t('whatIsModel.quiz.question')}</h2>
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
                {t(`whatIsModel.quiz.${answer}`)}
              </button>
            ))}
          </div>
          <div className="quiz-footer">
            <p className={checked ? (selectedAnswer === 'function' ? 'success-text' : 'error-text') : ''}>
              {checked
                ? selectedAnswer === 'function'
                  ? t('whatIsModel.quiz.correct')
                  : t('whatIsModel.quiz.tryAgain')
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

function CalcRow({label, value}: {label: string; value: string}) {
  return (
    <div className="calc-row">
      <span className="calc-symbol green">{label}</span>
      <b>=</b>
      <code>{value}</code>
    </div>
  );
}
