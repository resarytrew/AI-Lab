'use client';

import {useMemo, useState} from 'react';
import {getChapterContent} from '@/content/chapter-content';
import {localize, type StarterLessonId} from '@/content/learning-path';
import chapterStyles from './chapter-experience.module.css';

type DepthMode = 'math' | 'engineer' | 'researcher';

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function normalizeCode(value: string) {
  return value
    .replace(/[`'";]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function ChapterExperience({lessonId, locale}: {lessonId: StarterLessonId; locale: string}) {
  const content = getChapterContent(lessonId);
  const [visualIndex, setVisualIndex] = useState(0);
  const [workedVisible, setWorkedVisible] = useState(1);
  const [mode, setMode] = useState<DepthMode>('math');
  const [mathVisible, setMathVisible] = useState(1);
  const [codeAnswer, setCodeAnswer] = useState('');
  const [codeChecked, setCodeChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hypothesis, setHypothesis] = useState<number | null>(null);
  const [experimentRan, setExperimentRan] = useState(false);

  const codeCorrect = useMemo(() => {
    if (!codeChecked) return false;
    const answer = normalizeCode(codeAnswer);
    const expected = normalizeCode(content.engineer.expected);
    const solution = normalizeCode(content.engineer.solution);
    return answer === expected || answer === solution || solution.includes(answer) && answer.length > 5;
  }, [codeAnswer, codeChecked, content.engineer.expected, content.engineer.solution]);

  const activeVisual = content.visualNodes[visualIndex];

  return (
    <div className={chapterStyles.experience}>
      <section className={chapterStyles.visualLab}>
        <div className={chapterStyles.sectionHeading}>
          <p>{tr(locale, 'МИНИ-СХЕМА · исследуй механизм', 'MINI DIAGRAM · explore the mechanism')}</p>
          <h3>{localize(content.visualTitle, locale)}</h3>
          <span>{localize(content.visualCaption, locale)}</span>
        </div>

        <div className={chapterStyles.visualTrack} aria-label={localize(content.visualTitle, locale)}>
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
        </div>

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
          <button type="button" className={chapterStyles.revealButton} onClick={() => setWorkedVisible((value) => value + 1)}>
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
                <input
                  value={codeAnswer}
                  onChange={(event) => {setCodeAnswer(event.target.value); setCodeChecked(false);}}
                  placeholder={tr(locale, 'Введи только пропущенное выражение…', 'Enter only the missing expression…')}
                  aria-label={tr(locale, 'Ответ на Code-задачу', 'Code challenge answer')}
                />
                <div className={chapterStyles.challengeActions}>
                  <button type="button" onClick={() => setCodeChecked(true)}>{tr(locale, 'Проверить', 'Check')}</button>
                  <button type="button" className={chapterStyles.textButton} onClick={() => setShowSolution((value) => !value)}>{showSolution ? tr(locale, 'Скрыть решение', 'Hide solution') : tr(locale, 'Показать решение', 'Show solution')}</button>
                </div>
                {codeChecked && <div className={codeCorrect ? chapterStyles.correct : chapterStyles.incorrect}>{codeCorrect ? tr(locale, '✓ Рабочий вариант. Объясни теперь каждую часть строки.', '✓ Working answer. Now explain every part of the line.') : localize(content.engineer.hint, locale)}</div>}
                {showSolution && <code className={chapterStyles.solution}>{content.engineer.solution}</code>}
              </div>
            </div>

            <div className={chapterStyles.codeWindow}>
              <div><span /><span /><span /><b>my_ai/{lessonId}.py</b></div>
              <pre><code>{content.engineer.starterCode}</code></pre>
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
