'use client';

import Link from 'next/link';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {
  getStarterLesson,
  localize,
  starterLessonHref,
  starterLessons,
  type StarterLessonId,
} from '@/content/learning-path';
import styles from './starter-lesson.module.css';

const progressKey = 'ai-lab:starter-journey:v1';

function normalizeCode(value: string) {
  return value.toLowerCase().replaceAll(' ', '').replaceAll('return', '');
}

function loadCompleted() {
  if (typeof window === 'undefined') return [] as StarterLessonId[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(progressKey) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is StarterLessonId => starterLessons.some((lesson) => lesson.id === id));
  } catch {
    return [];
  }
}

function saveCompleted(ids: StarterLessonId[]) {
  window.localStorage.setItem(progressKey, JSON.stringify(ids));
}

function CodeBlock({children}: {children: ReactNode}) {
  return <pre className={styles.codeBlock}><code>{children}</code></pre>;
}

function PatternLab({onComplete}: {onComplete: () => void}) {
  const [answer, setAnswer] = useState('');
  const correct = answer.trim() === '16';

  useEffect(() => {
    if (correct) onComplete();
  }, [correct, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Наблюдение</span>
      <div className={styles.patternRow}><b>2 → 4</b><b>3 → 6</b><b>5 → 10</b></div>
      <label className={styles.answerLabel} htmlFor="pattern-answer">Если вход 8, какой будет выход?</label>
      <div className={styles.answerLine}>
        <span>8 →</span>
        <input id="pattern-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="numeric" />
      </div>
      {answer && <p className={correct ? styles.success : styles.tryAgain}>{correct ? 'Да. Ты применил правило к новому примеру.' : 'Проверь закономерность ещё раз.'}</p>}
      {correct && <div className={styles.discovery}><b>Главная мысль</b><p>Ты увидел правило сам. Компьютер пока получил только числа — ему ещё нужно объяснить правило или научить его находить.</p></div>}
    </div>
  );
}

function RulesVsExamplesLab({onComplete}: {onComplete: () => void}) {
  const cases = [
    {id: 'door', text: 'Открывать дверь, если введён правильный PIN', answer: 'rule'},
    {id: 'cats', text: 'Распознавать кошку на незнакомой фотографии', answer: 'examples'},
    {id: 'tax', text: 'Добавлять фиксированный налог 5%', answer: 'rule'},
  ] as const;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const complete = cases.every((item) => answers[item.id] === item.answer);

  useEffect(() => {
    if (complete) onComplete();
  }, [complete, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Решение инженера</span>
      <p className={styles.labIntro}>Для каждой задачи выбери подход: написать точное правило или учиться на примерах.</p>
      <div className={styles.caseList}>
        {cases.map((item) => (
          <div className={styles.caseRow} key={item.id}>
            <span>{item.text}</span>
            <div>
              <button type="button" className={answers[item.id] === 'rule' ? styles.selected : ''} onClick={() => setAnswers((current) => ({...current, [item.id]: 'rule'}))}>Правило</button>
              <button type="button" className={answers[item.id] === 'examples' ? styles.selected : ''} onClick={() => setAnswers((current) => ({...current, [item.id]: 'examples'}))}>Примеры</button>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(answers).length === cases.length && <p className={complete ? styles.success : styles.tryAgain}>{complete ? 'Верно. Не всякая задача требует машинного обучения.' : 'Один выбор стоит пересмотреть. Подумай, можно ли точно описать правило заранее.'}</p>}
    </div>
  );
}

function PythonPredictorLab({onComplete}: {onComplete: () => void}) {
  const [expression, setExpression] = useState('');
  const normalized = normalizeCode(expression);
  const correct = normalized === 'x*2+1' || normalized === '2*x+1';
  const result = correct ? 9 : null;

  useEffect(() => {
    if (correct) onComplete();
  }, [correct, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Первый код</span>
      <CodeBlock>{`def predict(x):\n    return ____\n\nprint(predict(4))`}</CodeBlock>
      <label className={styles.answerLabel} htmlFor="python-expression">Заполни выражение так, чтобы правило было y = 2x + 1</label>
      <input id="python-expression" className={styles.codeInput} value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="например: x * 2 + 1" spellCheck={false} />
      <div className={styles.console}><small>OUTPUT</small><b>{result ?? '—'}</b></div>
      {expression && <p className={correct ? styles.success : styles.tryAgain}>{correct ? 'Работает: predict(4) возвращает 9.' : 'Пока функция не реализует правило y = 2x + 1.'}</p>}
    </div>
  );
}

function ParametersLab({onComplete}: {onComplete: () => void}) {
  const [w, setW] = useState(1);
  const [b, setB] = useState(0);
  const samples = [1, 2, 3];
  const correct = w === 2 && b === 1;

  useEffect(() => {
    if (correct) onComplete();
  }, [correct, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Ручная настройка модели</span>
      <div className={styles.formula}>prediction = x × <strong>{w.toFixed(1)}</strong> + <strong>{b.toFixed(1)}</strong></div>
      <label className={styles.sliderLabel}>w = {w.toFixed(1)}<input type="range" min="0" max="4" step="0.5" value={w} onChange={(event) => setW(Number(event.target.value))} /></label>
      <label className={styles.sliderLabel}>b = {b.toFixed(1)}<input type="range" min="-2" max="2" step="0.5" value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
      <div className={styles.sampleTable}>
        <span>x</span><span>нужно y</span><span>модель</span>
        {samples.flatMap((x) => [<b key={`${x}-x`}>{x}</b>, <b key={`${x}-target`}>{2 * x + 1}</b>, <b key={`${x}-pred`} className={w * x + b === 2 * x + 1 ? styles.valueGood : ''}>{(w * x + b).toFixed(1)}</b>])}
      </div>
      <p className={correct ? styles.success : styles.hint}>Подбери два числа так, чтобы все три предсказания совпали с примерами.</p>
    </div>
  );
}

function LossLab({onComplete}: {onComplete: () => void}) {
  const [answer, setAnswer] = useState('');
  const correct = answer.trim() === '2';

  useEffect(() => {
    if (correct) onComplete();
  }, [correct, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Измеряем ошибку</span>
      <div className={styles.lossVisual}>
        <div><small>Цель</small><b>10</b></div>
        <span>↔</span>
        <div><small>Предсказание</small><b>8</b></div>
      </div>
      <p>Возьмём простую абсолютную ошибку: <strong>|prediction − target|</strong>.</p>
      <label className={styles.answerLabel} htmlFor="loss-answer">Чему равен loss?</label>
      <input id="loss-answer" className={styles.shortInput} value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="numeric" />
      {answer && <p className={correct ? styles.success : styles.tryAgain}>{correct ? 'Да: |8 − 10| = 2. Теперь качество модели можно сравнивать числом.' : 'Подсказка: расстояние между 8 и 10 равно двум.'}</p>}
    </div>
  );
}

function ImproveLab({onComplete}: {onComplete: () => void}) {
  const [choice, setChoice] = useState<'minus' | 'plus' | null>(null);
  const correct = choice === 'plus';

  useEffect(() => {
    if (correct) onComplete();
  }, [correct, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Ищем направление</span>
      <div className={styles.lossPoints}>
        <div><small>w = 1.4</small><b>loss 2.4</b></div>
        <div className={styles.currentPoint}><small>w = 1.5</small><b>loss 2.0</b></div>
        <div><small>w = 1.6</small><b>loss 1.6</b></div>
      </div>
      <p>Как изменить w, чтобы loss стал меньше?</p>
      <div className={styles.directionButtons}>
        <button type="button" className={choice === 'minus' ? styles.selected : ''} onClick={() => setChoice('minus')}>w уменьшить</button>
        <button type="button" className={choice === 'plus' ? styles.selected : ''} onClick={() => setChoice('plus')}>w увеличить</button>
      </div>
      {choice && <p className={correct ? styles.success : styles.tryAgain}>{correct ? 'Верно. Маленький шаг вправо уменьшил loss — значит это полезное направление.' : 'Посмотри на три значения loss: слева ошибка стала больше.'}</p>}
    </div>
  );
}

function TrainingLoopLab({onComplete}: {onComplete: () => void}) {
  const [step, setStep] = useState(0);
  const w = Math.min(2, step * 0.5);
  const loss = Math.abs(8 - 4 * w);
  const complete = step >= 4;

  useEffect(() => {
    if (complete) onComplete();
  }, [complete, onComplete]);

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Training loop</span>
      <CodeBlock>{`w = 0.0\nrepeat:\n    prediction = 4 * w\n    loss = abs(prediction - 8)\n    w = improve(w)`}</CodeBlock>
      <div className={styles.trainingStats}>
        <div><small>step</small><b>{step}</b></div>
        <div><small>w</small><b>{w.toFixed(1)}</b></div>
        <div><small>prediction</small><b>{(4 * w).toFixed(1)}</b></div>
        <div><small>loss</small><b>{loss.toFixed(1)}</b></div>
      </div>
      <button className={styles.trainButton} type="button" disabled={complete} onClick={() => setStep((current) => Math.min(4, current + 1))}>{complete ? 'Обучение завершено' : 'Сделать один шаг обучения'}</button>
      {complete && <div className={styles.discovery}><b>Ты только что обучил первый параметр</b><p>Предсказание приблизилось к цели, потому что машина повторила цикл prediction → loss → update. В следующем блоке мы узнаем, что такая обучаемая формула уже очень близка к искусственному нейрону.</p></div>}
    </div>
  );
}

function LessonLab({lessonId, onComplete}: {lessonId: StarterLessonId; onComplete: () => void}) {
  switch (lessonId) {
    case 'human-knows-rule': return <PatternLab onComplete={onComplete} />;
    case 'rules-or-examples': return <RulesVsExamplesLab onComplete={onComplete} />;
    case 'first-python-predictor': return <PythonPredictorLab onComplete={onComplete} />;
    case 'trainable-parameters': return <ParametersLab onComplete={onComplete} />;
    case 'measure-error': return <LossLab onComplete={onComplete} />;
    case 'improve-parameter': return <ImproveLab onComplete={onComplete} />;
    case 'first-training-loop': return <TrainingLoopLab onComplete={onComplete} />;
  }
}

export function StarterLessonPage({locale, lessonSlug}: {locale: string; lessonSlug: string}) {
  const lesson = getStarterLesson(lessonSlug);
  const [completed, setCompleted] = useState<StarterLessonId[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompleted(loadCompleted());
    setReady(true);
  }, []);

  const completeLesson = () => {
    if (!lesson) return;
    setCompleted((current) => {
      if (current.includes(lesson.id)) return current;
      const next = [...current, lesson.id];
      saveCompleted(next);
      return next;
    });
  };

  const progress = useMemo(() => completed.length, [completed]);

  if (!lesson) return <main className={styles.notFound}>Урок не найден.</main>;

  const isComplete = completed.includes(lesson.id);
  const nextHref = lesson.nextId ? starterLessonHref(locale, lesson.nextId) : null;
  const previous = starterLessons.find((candidate) => candidate.nextId === lesson.id);
  const previousHref = previous ? starterLessonHref(locale, previous.id) : null;

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <Link href={`/${locale}/`} className={styles.brand}>AI LAB</Link>
        <div className={styles.progressText}>Старт · урок {lesson.index + 1} / {starterLessons.length}</div>
        <div className={styles.projectState}><span>MyAI</span><b>{ready ? progress : 0}/{starterLessons.length} артефактов</b></div>
      </header>

      <div className={styles.progressBar}><i style={{width: `${((lesson.index + (isComplete ? 1 : 0)) / starterLessons.length) * 100}%`}} /></div>

      <section className={styles.lessonGrid}>
        <article className={styles.lessonCopy}>
          <p className={styles.kicker}>Вопрос урока</p>
          <h1>{localize(lesson.title, locale)}</h1>
          <p className={styles.question}>{localize(lesson.question, locale)}</p>

          <div className={styles.outcomes}>
            <div><small>До урока</small><p>{localize(lesson.before, locale)}</p></div>
            <div><small>После урока</small><p>{localize(lesson.after, locale)}</p></div>
            <div><small>Сможешь</small><p>{localize(lesson.canDo, locale)}</p></div>
          </div>

          <div className={styles.conceptCard}>
            <small>Когда эксперимент понятен</small>
            <p>{localize(lesson.concept, locale)}</p>
          </div>
        </article>

        <div className={styles.labColumn}>
          <LessonLab lessonId={lesson.id} onComplete={completeLesson} />

          <div className={`${styles.artifactCard} ${isComplete ? styles.artifactUnlocked : ''}`}>
            <small>BUILD MyAI</small>
            <div><code>{lesson.artifact}</code><span>{isComplete ? 'готово' : 'откроется после эксперимента'}</span></div>
            <p>{localize(lesson.artifactPurpose, locale)}</p>
          </div>

          <div className={styles.checkpointCard}>
            <small>Проверка переноса</small>
            <p>{localize(lesson.checkpoint, locale)}</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        {previousHref ? <Link href={previousHref} className={styles.secondaryButton}>← Назад</Link> : <span />}
        {nextHref ? (
          isComplete ? <Link href={nextHref} className={styles.primaryButton}>Следующий урок →</Link> : <span className={styles.lockedText}>Сначала заверши эксперимент</span>
        ) : (
          isComplete ? <div className={styles.finishMessage}>Стартовый блок завершён. Следующий этап: «Первый нейрон и сеть».</div> : <span className={styles.lockedText}>Заверши обучение параметра</span>
        )}
      </footer>
    </main>
  );
}
