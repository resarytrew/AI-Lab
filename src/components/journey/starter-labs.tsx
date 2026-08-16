'use client';

import {useState} from 'react';
import type {StarterLessonId} from '@/content/learning-path';
import styles from './starter-lesson.module.css';

type LabProps = {locale: string; onComplete: () => void};

type Option = {id: string; ru: string; en: string};

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function Phase({name, children}: {name: string; children: React.ReactNode}) {
  return (
    <div className={styles.researchPhase}>
      <small>{name}</small>
      <div>{children}</div>
    </div>
  );
}

function ChoiceButtons({
  locale,
  options,
  value,
  onChange,
}: {
  locale: string;
  options: readonly Option[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className={styles.optionGrid}>
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          className={value === option.id ? styles.selected : ''}
          onClick={() => onChange(option.id)}
        >
          {tr(locale, option.ru, option.en)}
        </button>
      ))}
    </div>
  );
}

function SmartMachineLab({locale, onComplete}: LabProps) {
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [calculator, setCalculator] = useState<string | null>(null);
  const [abilities, setAbilities] = useState<string[]>([]);
  const abilityOptions = [
    {id: 'knowledge', ru: 'использовать знания', en: 'use knowledge'},
    {id: 'context', ru: 'понимать контекст', en: 'understand context'},
    {id: 'learning', ru: 'учиться', en: 'learn'},
    {id: 'reasoning', ru: 'рассуждать', en: 'reason'},
    {id: 'planning', ru: 'планировать', en: 'plan'},
  ] as const;
  const complete = calculator === 'no' && abilities.includes('learning') && abilities.includes('context') && abilities.length >= 3;

  const toggleAbility = (id: string) => {
    const next = abilities.includes(id) ? abilities.filter((item) => item !== id) : [...abilities, id];
    setAbilities(next);
    if (calculator === 'no' && next.includes('learning') && next.includes('context') && next.length >= 3) onComplete();
  };

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Лаборатория интеллекта', 'Intelligence lab')}</span>
      <Phase name={tr(locale, 'Гипотеза', 'Hypothesis')}>
        <p>{tr(locale, 'Что важнее всего, чтобы назвать машину умной?', 'What matters most when calling a machine intelligent?')}</p>
        <ChoiceButtons locale={locale} value={hypothesis} onChange={setHypothesis} options={[
          {id: 'speed', ru: 'Она должна считать очень быстро', en: 'It must calculate very fast'},
          {id: 'abilities', ru: 'Она должна проявлять интеллектуальные способности', en: 'It must show intelligent abilities'},
        ]} />
      </Phase>

      {hypothesis && (
        <Phase name={tr(locale, 'Конфликт', 'Conflict')}>
          <div className={styles.challengeNumber}>9 847 × 613 = <b>6 036 211</b> <span>0.001 s</span></div>
          <p>{tr(locale, 'Калькулятор решил это быстрее любого школьника. Значит ли это, что он понимает задачу и умеет учиться?', 'A calculator solved this faster than any student. Does that mean it understands the task and can learn?')}</p>
          <ChoiceButtons locale={locale} value={calculator} onChange={(id) => {
            setCalculator(id);
            if (id === 'no' && abilities.includes('learning') && abilities.includes('context') && abilities.length >= 3) onComplete();
          }} options={[
            {id: 'yes', ru: 'Да, скорость и есть интеллект', en: 'Yes, speed is intelligence'},
            {id: 'no', ru: 'Нет, одной скорости недостаточно', en: 'No, speed alone is not enough'},
          ]} />
        </Phase>
      )}

      {calculator === 'no' && (
        <Phase name={tr(locale, 'Открытие', 'Discovery')}>
          <p>{tr(locale, 'Собери минимум три способности, по которым ты будешь сравнивать интеллектуальные системы.', 'Choose at least three abilities you will use to compare intelligent systems.')}</p>
          <div className={styles.tagGrid}>
            {abilityOptions.map((ability) => (
              <button type="button" key={ability.id} className={abilities.includes(ability.id) ? styles.selectedTag : ''} onClick={() => toggleAbility(ability.id)}>
                {tr(locale, ability.ru, ability.en)}
              </button>
            ))}
          </div>
          {complete && <p className={styles.success}>{tr(locale, 'Теперь у тебя есть критерии, а не слово «умный».', 'You now have criteria instead of the vague word “smart”.')}</p>}
        </Phase>
      )}
    </div>
  );
}

function DataMeaningLab({locale, onComplete}: LabProps) {
  const [rawGuess, setRawGuess] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<string | null>(null);
  const rawCorrect = rawGuess === 'unknown';
  const complete = rawCorrect && knowledge === 'conclusion';

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Архив данных', 'Data archive')}</span>
      <Phase name={tr(locale, 'Вопрос', 'Question')}>
        <div className={styles.rawData}>37.2&nbsp;&nbsp; 39.1&nbsp;&nbsp; 36.8</div>
        <p>{tr(locale, 'Что означают эти числа?', 'What do these numbers mean?')}</p>
        <ChoiceButtons locale={locale} value={rawGuess} onChange={setRawGuess} options={[
          {id: 'temperature', ru: 'Температура человека', en: 'A person’s temperature'},
          {id: 'weather', ru: 'Погода за три дня', en: 'Weather over three days'},
          {id: 'unknown', ru: 'Без контекста определить нельзя', en: 'We cannot know without context'},
        ]} />
      </Phase>
      {rawGuess && !rawCorrect && <p className={styles.tryAgain}>{tr(locale, 'Это возможно, но из самих чисел этого не следует. Ты добавил контекст из своей головы.', 'That is possible, but the numbers alone do not tell us that. You supplied the context yourself.')}</p>}
      {rawCorrect && (
        <Phase name={tr(locale, 'Контекст меняет всё', 'Context changes everything')}>
          <div className={styles.contextReveal}><b>{tr(locale, 'Температура тела, °C', 'Body temperature, °C')}</b><span>{tr(locale, 'измерения одного человека утром, днём и вечером', 'measurements from one person: morning, afternoon, evening')}</span></div>
          <p>{tr(locale, 'Какой из вариантов уже является знанием, которое можно использовать?', 'Which option is now knowledge that can be used?')}</p>
          <ChoiceButtons locale={locale} value={knowledge} onChange={(id) => {
            setKnowledge(id);
            if (id === 'conclusion') onComplete();
          }} options={[
            {id: 'raw', ru: '39.1', en: '39.1'},
            {id: 'info', ru: 'Днём температура была 39.1 °C', en: 'The afternoon temperature was 39.1 °C'},
            {id: 'conclusion', ru: 'Температура заметно повысилась — это требует внимания', en: 'Temperature rose noticeably — this requires attention'},
          ]} />
          {complete && <p className={styles.success}>{tr(locale, 'Данные получили контекст, а информация стала основанием для вывода.', 'Data gained context, and information became a basis for a conclusion.')}</p>}
        </Phase>
      )}
    </div>
  );
}

function RulesLab({locale, onComplete}: LabProps) {
  const cases = [
    {id: 'day', ru: 'Есть пропуск, рабочее время', en: 'Valid badge, working hours', correct: 'open'},
    {id: 'night', ru: 'Есть пропуск, ночь', en: 'Valid badge, night', correct: 'guard'},
    {id: 'bad', ru: 'Пропуск недействителен', en: 'Invalid badge', correct: 'deny'},
  ] as const;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const complete = cases.every((item) => answers[item.id] === item.correct);

  const choose = (caseId: string, action: string) => {
    const next = {...answers, [caseId]: action};
    setAnswers(next);
    if (cases.every((item) => next[item.id] === item.correct)) onComplete();
  };

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Лаборатория правил', 'Rule lab')}</span>
      <Phase name={tr(locale, 'Задача', 'Task')}>
        <p>{tr(locale, 'Запрограммируй проходную. Для каждого состояния выбери действие.', 'Program an entry gate. Choose an action for each world state.')}</p>
        <div className={styles.caseList}>
          {cases.map((item) => (
            <div className={styles.caseRow} key={item.id}>
              <span>{tr(locale, item.ru, item.en)}</span>
              <div>
                <button type="button" className={answers[item.id] === 'open' ? styles.selected : ''} onClick={() => choose(item.id, 'open')}>{tr(locale, 'Открыть', 'Open')}</button>
                <button type="button" className={answers[item.id] === 'guard' ? styles.selected : ''} onClick={() => choose(item.id, 'guard')}>{tr(locale, 'Охрана', 'Guard')}</button>
                <button type="button" className={answers[item.id] === 'deny' ? styles.selected : ''} onClick={() => choose(item.id, 'deny')}>{tr(locale, 'Отказать', 'Deny')}</button>
              </div>
            </div>
          ))}
        </div>
      </Phase>
      {Object.keys(answers).length === cases.length && <p className={complete ? styles.success : styles.tryAgain}>{complete ? tr(locale, 'Ты превратил знание о проходной в систему ЕСЛИ → ТО.', 'You turned knowledge about the gate into an IF → THEN system.') : tr(locale, 'Одно из правил противоречит условиям. Проверь состояния.', 'One rule conflicts with the conditions. Check the states.')}</p>}
    </div>
  );
}

function RulesBreakLab({locale, onComplete}: LabProps) {
  const [rule, setRule] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const counterexample = rule === 'fur' ? tr(locale, 'Сфинкс — кошка без привычной шерсти.', 'A Sphynx is a cat without typical fur.') : rule === 'ears' ? tr(locale, 'У совы тоже заметные уши/пучки, но это не кошка.', 'An owl may have ear-like tufts, but it is not a cat.') : tr(locale, 'Некоторые собаки имеют усы и похожую морду.', 'Some dogs have whiskers and a similar face.');

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Проверка правил на прочность', 'Stress-test the rules')}</span>
      <Phase name={tr(locale, 'Гипотеза', 'Hypothesis')}>
        <p>{tr(locale, 'Выбери одно простое правило, по которому программа будет узнавать кошку на фото.', 'Choose one simple rule for recognizing a cat in a photo.')}</p>
        <ChoiceButtons locale={locale} value={rule} onChange={setRule} options={[
          {id: 'fur', ru: 'Если есть шерсть → кошка', en: 'If it has fur → cat'},
          {id: 'ears', ru: 'Если треугольные уши → кошка', en: 'If it has triangular ears → cat'},
          {id: 'whiskers', ru: 'Если есть усы → кошка', en: 'If it has whiskers → cat'},
        ]} />
      </Phase>
      {rule && (
        <Phase name={tr(locale, 'Контрпример', 'Counterexample')}>
          <div className={styles.counterexample}>{counterexample}</div>
          <p>{tr(locale, 'Что делать, если таких исключений тысячи?', 'What should we do if there are thousands of such exceptions?')}</p>
          <ChoiceButtons locale={locale} value={strategy} onChange={(id) => {
            setStrategy(id);
            if (id === 'examples') onComplete();
          }} options={[
            {id: 'more-rules', ru: 'Продолжать вручную добавлять исключения', en: 'Keep adding exceptions by hand'},
            {id: 'examples', ru: 'Показать много примеров и искать закономерность по данным', en: 'Show many examples and discover a pattern from data'},
          ]} />
          {strategy === 'more-rules' && <p className={styles.tryAgain}>{tr(locale, 'Это возможно для небольшой задачи, но система становится всё более хрупкой и огромной.', 'That can work for a small task, but the system becomes increasingly brittle and huge.')}</p>}
          {strategy === 'examples' && <p className={styles.success}>{tr(locale, 'Мы впервые получили настоящую причину перейти к машинному обучению.', 'We now have a real reason to move to machine learning.')}</p>}
        </Phase>
      )}
    </div>
  );
}

function LearnExamplesLab({locale, onComplete}: LabProps) {
  const [prediction, setPrediction] = useState('');
  const [meaning, setMeaning] = useState<string | null>(null);
  const predictionCorrect = prediction.trim() === '16';
  const complete = predictionCorrect && meaning === 'generalize';

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Лаборатория обучения', 'Learning lab')}</span>
      <Phase name={tr(locale, 'Обучающие примеры', 'Training examples')}>
        <div className={styles.patternRow}><b>2 → 4</b><b>3 → 6</b><b>5 → 10</b></div>
        <p>{tr(locale, 'Новый пример не показывали при обучении. Предскажи результат для 8.', 'This example was not shown during training. Predict the result for 8.')}</p>
        <div className={styles.answerLine}><span>8 →</span><input aria-label="prediction" value={prediction} onChange={(event) => setPrediction(event.target.value)} inputMode="numeric" /></div>
      </Phase>
      {prediction && !predictionCorrect && <p className={styles.tryAgain}>{tr(locale, 'Попробуй найти общее правило, а не вспоминать отдельные пары.', 'Try to find the general rule instead of recalling individual pairs.')}</p>}
      {predictionCorrect && (
        <Phase name={tr(locale, 'Запоминание или обучение?', 'Memorization or learning?')}>
          <p>{tr(locale, 'Система правильно ответила на новый x=8. Что здесь самое важное?', 'The system was correct on unseen x=8. What matters most?')}</p>
          <ChoiceButtons locale={locale} value={meaning} onChange={(id) => {
            setMeaning(id);
            if (id === 'generalize') onComplete();
          }} options={[
            {id: 'memory', ru: 'Она запомнила все ответы', en: 'It memorized all answers'},
            {id: 'generalize', ru: 'Найденная закономерность перенеслась на новый пример', en: 'The discovered pattern transferred to a new example'},
          ]} />
          {complete && <p className={styles.success}>{tr(locale, 'Это и есть первый смысл обобщения: работать за пределами показанных примеров.', 'This is the first meaning of generalization: working beyond examples already seen.')}</p>}
        </Phase>
      )}
    </div>
  );
}

function ParametersLab({locale, onComplete}: LabProps) {
  const [w, setW] = useState(1);
  const [b, setB] = useState(0);
  const samples = [1, 2, 3];
  const correct = w === 2 && b === 1;

  const updateW = (next: number) => {
    setW(next);
    if (next === 2 && b === 1) onComplete();
  };
  const updateB = (next: number) => {
    setB(next);
    if (w === 2 && next === 1) onComplete();
  };

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Обучаемое правило', 'Trainable rule')}</span>
      <Phase name={tr(locale, 'Эксперимент', 'Experiment')}>
        <div className={styles.formula}>prediction = x × <strong>{w.toFixed(1)}</strong> + <strong>{b.toFixed(1)}</strong></div>
        <label className={styles.sliderLabel}>w = {w.toFixed(1)}<input type="range" min="0" max="4" step="0.5" value={w} onChange={(event) => updateW(Number(event.target.value))} /></label>
        <label className={styles.sliderLabel}>b = {b.toFixed(1)}<input type="range" min="-2" max="2" step="0.5" value={b} onChange={(event) => updateB(Number(event.target.value))} /></label>
        <div className={styles.sampleTable}>
          <span>x</span><span>target</span><span>prediction</span>
          {samples.flatMap((x) => [<b key={`${x}-x`}>{x}</b>, <b key={`${x}-target`}>{2 * x + 1}</b>, <b key={`${x}-pred`} className={w * x + b === 2 * x + 1 ? styles.valueGood : ''}>{(w * x + b).toFixed(1)}</b>])}
        </div>
        <p className={correct ? styles.success : styles.hint}>{correct ? tr(locale, 'Все примеры совпали. Ты настроил параметры модели.', 'All examples match. You tuned the model parameters.') : tr(locale, 'Меняй только w и b. Саму формулу не переписывай.', 'Change only w and b. Do not rewrite the formula itself.')}</p>
      </Phase>
    </div>
  );
}

function LossLab({locale, onComplete}: LabProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const models = [
    {id: 'a', name: 'A', errors: [0, 3, 2], loss: 5},
    {id: 'b', name: 'B', errors: [1, 0, 1], loss: 2},
  ];
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Измеряем качество', 'Measure quality')}</span>
      <Phase name={tr(locale, 'Сравнение', 'Comparison')}>
        <p>{tr(locale, 'Обе модели иногда ошибаются. Сложим абсолютные ошибки на трёх примерах.', 'Both models make mistakes. Add their absolute errors across three examples.')}</p>
        <div className={styles.modelCompare}>
          {models.map((model) => <div key={model.id}><b>Model {model.name}</b><span>{model.errors.join(' + ')} = <strong>{model.loss}</strong></span></div>)}
        </div>
        <p>{tr(locale, 'Какая модель лучше по этой мере loss?', 'Which model is better under this loss measure?')}</p>
        <ChoiceButtons locale={locale} value={choice} onChange={(id) => {setChoice(id); if (id === 'b') onComplete();}} options={[
          {id: 'a', ru: 'Модель A', en: 'Model A'},
          {id: 'b', ru: 'Модель B', en: 'Model B'},
        ]} />
        {choice && <p className={choice === 'b' ? styles.success : styles.tryAgain}>{choice === 'b' ? tr(locale, 'Да. Меньший loss даёт числовой способ сравнить параметры.', 'Yes. Lower loss gives us a numeric way to compare parameters.') : tr(locale, 'Сложи ошибки на всех трёх примерах, а не смотри на один.', 'Add errors across all three examples, not just one.')}</p>}
      </Phase>
    </div>
  );
}

function AutomaticImprovementLab({locale, onComplete}: LabProps) {
  const candidates = [
    {w: 1, loss: 6},
    {w: 1.5, loss: 3},
    {w: 2, loss: 0},
    {w: 2.5, loss: 3},
  ];
  const [tested, setTested] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const test = (w: number) => setTested((current) => current.includes(w) ? current : [...current, w]);
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Автоматический поиск', 'Automatic search')}</span>
      <Phase name={tr(locale, 'Эксперимент', 'Experiment')}>
        <p>{tr(locale, 'Программа может сама измерить loss каждого кандидата. Проверь варианты w.', 'A program can measure loss for each candidate. Test the w values.')}</p>
        <div className={styles.candidateGrid}>
          {candidates.map((candidate) => (
            <button type="button" key={candidate.w} onClick={() => test(candidate.w)}>
              <b>w = {candidate.w}</b><span>{tested.includes(candidate.w) ? `loss = ${candidate.loss}` : tr(locale, 'проверить', 'test')}</span>
            </button>
          ))}
        </div>
        {tested.length >= 3 && (
          <>
            <p>{tr(locale, 'Какой параметр следует сохранить?', 'Which parameter should be kept?')}</p>
            <ChoiceButtons locale={locale} value={chosen?.toString() ?? null} onChange={(id) => {const value = Number(id); setChosen(value); if (value === 2) onComplete();}} options={candidates.map((candidate) => ({id: candidate.w.toString(), ru: `w = ${candidate.w}`, en: `w = ${candidate.w}`}))} />
          </>
        )}
        {chosen !== null && <p className={chosen === 2 ? styles.success : styles.tryAgain}>{chosen === 2 ? tr(locale, 'Программа нашла параметр с минимальным loss без ручной настройки.', 'The program found the parameter with minimum loss without manual tuning.') : tr(locale, 'Ищи минимальное значение loss.', 'Look for the minimum loss value.')}</p>}
      </Phase>
    </div>
  );
}

function GradientDirectionLab({locale, onComplete}: LabProps) {
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Чувствительность', 'Sensitivity')}</span>
      <Phase name={tr(locale, 'Маленький шаг', 'A small step')}>
        <div className={styles.lossPoints}>
          <div><small>w − ε = 1.4</small><b>loss 2.4</b></div>
          <div className={styles.currentPoint}><small>w = 1.5</small><b>loss 2.0</b></div>
          <div><small>w + ε = 1.6</small><b>loss 1.6</b></div>
        </div>
        <p>{tr(locale, 'В какую сторону двигать w?', 'Which way should w move?')}</p>
        <ChoiceButtons locale={locale} value={choice} onChange={(id) => {setChoice(id); if (id === 'plus') onComplete();}} options={[
          {id: 'minus', ru: 'Уменьшать w', en: 'Decrease w'},
          {id: 'plus', ru: 'Увеличивать w', en: 'Increase w'},
        ]} />
        {choice && <p className={choice === 'plus' ? styles.success : styles.tryAgain}>{choice === 'plus' ? tr(locale, 'Малый шаг вправо уменьшил loss. Мы получили направление.', 'A small step to the right reduced loss. We found a direction.') : tr(locale, 'Слева loss стал больше.', 'Loss became larger on the left.')}</p>}
      </Phase>
    </div>
  );
}

function TrainingLoopLab({locale, onComplete}: LabProps) {
  const [step, setStep] = useState(0);
  const w = Math.min(2, step * 0.5);
  const prediction = 4 * w;
  const loss = Math.abs(prediction - 8);
  const complete = step >= 4;
  const advance = () => {
    const next = Math.min(4, step + 1);
    setStep(next);
    if (next >= 4) onComplete();
  };
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>prediction → loss → update → repeat</span>
      <div className={styles.trainingStats}>
        <div><small>step</small><b>{step}</b></div>
        <div><small>w</small><b>{w.toFixed(1)}</b></div>
        <div><small>prediction</small><b>{prediction.toFixed(1)}</b></div>
        <div><small>loss</small><b>{loss.toFixed(1)}</b></div>
      </div>
      <button className={styles.trainButton} type="button" disabled={complete} onClick={advance}>{complete ? tr(locale, 'Обучение завершено', 'Training complete') : tr(locale, 'Один шаг обучения', 'Run one training step')}</button>
      {complete && <div className={styles.discovery}><b>{tr(locale, 'Параметр обучился', 'The parameter learned')}</b><p>{tr(locale, 'Loss уменьшался не потому, что человек каждый раз угадывал w, а потому что работал повторяемый механизм обновления.', 'Loss fell because a repeatable update mechanism was working—not because a human kept guessing w.')}</p></div>}
    </div>
  );
}

function NeuronLab({locale, onComplete}: LabProps) {
  const [answer, setAnswer] = useState('');
  const correct = answer.trim() === '4';
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Нейролаборатория', 'Neuron lab')}</span>
      <Phase name={tr(locale, 'Узнай знакомый механизм', 'Recognize the mechanism')}>
        <div className={styles.neuronEquation}>z = 2×0.5 + 1×2 + 1</div>
        <p>{tr(locale, 'Два входа умножаются на два веса, затем добавляется bias. Чему равен z?', 'Two inputs are multiplied by two weights, then bias is added. What is z?')}</p>
        <input className={styles.shortInput} aria-label="neuron output" value={answer} onChange={(event) => {const value = event.target.value; setAnswer(value); if (value.trim() === '4') onComplete();}} inputMode="decimal" />
        {answer && <p className={correct ? styles.success : styles.tryAgain}>{correct ? tr(locale, 'Да. Это уже основной вычислительный узел искусственного нейрона.', 'Yes. This is already the core computation of an artificial neuron.') : tr(locale, 'Сначала посчитай два произведения, затем bias.', 'Compute both products first, then add bias.')}</p>}
      </Phase>
      {correct && <div className={styles.neuronParts}><span>x₁,x₂<br/><small>inputs</small></span><b>×</b><span>w₁,w₂<br/><small>weights</small></span><b>+</b><span>b<br/><small>bias</small></span><b>→</b><span>z<br/><small>output</small></span></div>}
    </div>
  );
}

function LayerLab({locale, onComplete}: LabProps) {
  const [answer, setAnswer] = useState('');
  const normalized = answer.replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '');
  const correct = normalized === '1,2';
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Собираем слой', 'Build a layer')}</span>
      <Phase name={tr(locale, 'Два нейрона — одни входы', 'Two neurons — same inputs')}>
        <div className={styles.layerDiagram}>
          <div><b>x₁=1</b><b>x₂=2</b></div>
          <span>→</span>
          <div><b>N₁: [1,0]</b><b>N₂: [0,1]</b></div>
        </div>
        <p>{tr(locale, 'Bias = 0. N₁ берёт только первый вход, N₂ — только второй. Какой вектор выдаст слой?', 'Bias = 0. N₁ keeps only the first input, N₂ only the second. What output vector does the layer produce?')}</p>
        <input className={styles.codeInput} aria-label="layer vector" value={answer} onChange={(event) => {const value = event.target.value; setAnswer(value); const cleaned = value.replaceAll(' ', '').replaceAll('[', '').replaceAll(']', ''); if (cleaned === '1,2') onComplete();}} placeholder="[?, ?]" />
        {answer && <p className={correct ? styles.success : styles.tryAgain}>{correct ? tr(locale, 'Слой вернул два разных представления одних и тех же входов.', 'The layer returned two different representations of the same inputs.') : tr(locale, 'Посчитай каждый нейрон отдельно.', 'Compute each neuron separately.')}</p>}
      </Phase>
    </div>
  );
}

function TextDataLab({locale, onComplete}: LabProps) {
  const [ids, setIds] = useState('');
  const normalized = ids.trim().replaceAll(',', ' ').split(/\s+/).join(' ');
  const correct = normalized === '1 2 3';
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Лаборатория языка', 'Language lab')}</span>
      <Phase name={tr(locale, 'Проблема', 'Problem')}>
        <p>{tr(locale, 'Нейрон умеет считать числа. Но вход сейчас — «я люблю код». Как превратить текст в числа без потери возможности восстановить его?', 'A neuron computes numbers, but the input is “I love code”. How can we turn text into numbers while keeping it decodable?')}</p>
        <div className={styles.vocabGrid}><span>я → 1</span><span>люблю → 2</span><span>код → 3</span><span>чай → 4</span></div>
        <label className={styles.answerLabel} htmlFor="token-ids">{tr(locale, 'Закодируй «я люблю код»', 'Encode “I love code”')}</label>
        <input id="token-ids" className={styles.codeInput} value={ids} onChange={(event) => {const value = event.target.value; setIds(value); const clean = value.trim().replaceAll(',', ' ').split(/\s+/).join(' '); if (clean === '1 2 3') onComplete();}} placeholder="1 2 3" />
        {ids && <p className={correct ? styles.success : styles.tryAgain}>{correct ? tr(locale, 'Теперь текст представлен последовательностью token IDs, с которой может работать модель.', 'The text is now represented as token IDs the model can process.') : tr(locale, 'Используй словарь слева направо.', 'Use the vocabulary from left to right.')}</p>}
      </Phase>
    </div>
  );
}

function NextTokenLab({locale, onComplete}: LabProps) {
  const [token, setToken] = useState<string | null>(null);
  const [probability, setProbability] = useState<string | null>(null);
  const complete = token === 'tea' && probability === 'two-thirds';
  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>{tr(locale, 'Предсказываем продолжение', 'Predict the continuation')}</span>
      <Phase name={tr(locale, 'Мини-корпус', 'Tiny corpus')}>
        <div className={styles.corpusLines}><code>я люблю чай</code><code>я люблю код</code><code>я люблю чай</code></div>
        <p>{tr(locale, 'После контекста «я люблю» какой токен встречался чаще?', 'After the context “I love”, which token occurred more often?')}</p>
        <ChoiceButtons locale={locale} value={token} onChange={setToken} options={[
          {id: 'tea', ru: 'чай', en: 'tea'},
          {id: 'code', ru: 'код', en: 'code'},
        ]} />
      </Phase>
      {token === 'tea' && (
        <Phase name={tr(locale, 'От частоты к вероятности', 'From counts to probability')}>
          <p>{tr(locale, 'Из трёх продолжений два — «чай». Какая эмпирическая вероятность?', 'Two of the three continuations are “tea”. What is the empirical probability?')}</p>
          <ChoiceButtons locale={locale} value={probability} onChange={(id) => {setProbability(id); if (id === 'two-thirds') onComplete();}} options={[
            {id: 'one-third', ru: '1/3', en: '1/3'},
            {id: 'two-thirds', ru: '2/3', en: '2/3'},
            {id: 'one', ru: '1', en: '1'},
          ]} />
          {complete && <p className={styles.success}>{tr(locale, 'Ты построил простейшее распределение вероятностей следующего токена.', 'You built a minimal next-token probability distribution.')}</p>}
        </Phase>
      )}
    </div>
  );
}

function FirstLanguageModelLab({locale, onComplete}: LabProps) {
  const [trained, setTrained] = useState(false);
  const [generated, setGenerated] = useState<string[]>(['я']);
  const [limitation, setLimitation] = useState<string | null>(null);
  const transitions: Record<string, string> = {я: 'люблю', люблю: 'чай', чай: '.', '.': 'я'};
  const generate = () => {
    const last = generated.at(-1) ?? 'я';
    const next = transitions[last] ?? 'я';
    const sequence = [...generated, next];
    setGenerated(sequence);
  };
  const enough = generated.length >= 5;

  return (
    <div className={styles.labCard}>
      <span className={styles.labLabel}>Bigram LM · MyAI</span>
      <Phase name={tr(locale, 'Обучение переходам', 'Learn transitions')}>
        <div className={styles.corpusLines}><code>я → люблю</code><code>люблю → чай / код</code><code>чай → .</code></div>
        <button type="button" className={styles.trainButton} disabled={trained} onClick={() => setTrained(true)}>{trained ? tr(locale, 'Таблица переходов построена', 'Transition table built') : tr(locale, 'Обучить на переходах', 'Learn token transitions')}</button>
      </Phase>
      {trained && (
        <Phase name={tr(locale, 'Генерация', 'Generation')}>
          <div className={styles.generatedText}>{generated.join(' ')}</div>
          <button type="button" className={styles.secondaryLabButton} onClick={generate}>{tr(locale, 'Предсказать ещё один токен', 'Predict one more token')}</button>
          {enough && (
            <>
              <p>{tr(locale, 'Модель генерирует, но смотрит только на один предыдущий токен. Какое главное ограничение?', 'The model generates text but sees only one previous token. What is the main limitation?')}</p>
              <ChoiceButtons locale={locale} value={limitation} onChange={(id) => {setLimitation(id); if (id === 'context') onComplete();}} options={[
                {id: 'speed', ru: 'Она слишком медленно считает', en: 'It calculates too slowly'},
                {id: 'context', ru: 'Она не помнит дальний контекст', en: 'It cannot use distant context'},
                {id: 'numbers', ru: 'Она не умеет работать с числами', en: 'It cannot work with numbers'},
              ]} />
            </>
          )}
          {limitation === 'context' && <div className={styles.discovery}><b>{tr(locale, 'Мост к современной LLM', 'Bridge to modern LLMs')}</b><p>{tr(locale, 'Первая языковая модель уже работает. Следующая большая проблема — дать ей более богатое представление и длинный контекст. Отсюда естественно появятся embeddings и attention.', 'Your first language model already works. The next major problem is richer representation and longer context. That naturally leads to embeddings and attention.')}</p></div>}
        </Phase>
      )}
    </div>
  );
}

export function StarterLessonLab({lessonId, locale, onComplete}: {lessonId: StarterLessonId; locale: string; onComplete: () => void}) {
  switch (lessonId) {
    case 'smart-machine': return <SmartMachineLab locale={locale} onComplete={onComplete} />;
    case 'data-to-meaning': return <DataMeaningLab locale={locale} onComplete={onComplete} />;
    case 'knowledge-as-rules': return <RulesLab locale={locale} onComplete={onComplete} />;
    case 'where-rules-break': return <RulesBreakLab locale={locale} onComplete={onComplete} />;
    case 'learn-from-examples': return <LearnExamplesLab locale={locale} onComplete={onComplete} />;
    case 'trainable-parameters': return <ParametersLab locale={locale} onComplete={onComplete} />;
    case 'measure-error': return <LossLab locale={locale} onComplete={onComplete} />;
    case 'automatic-improvement': return <AutomaticImprovementLab locale={locale} onComplete={onComplete} />;
    case 'gradient-direction': return <GradientDirectionLab locale={locale} onComplete={onComplete} />;
    case 'first-training-loop': return <TrainingLoopLab locale={locale} onComplete={onComplete} />;
    case 'first-neuron': return <NeuronLab locale={locale} onComplete={onComplete} />;
    case 'neuron-layer': return <LayerLab locale={locale} onComplete={onComplete} />;
    case 'text-as-data': return <TextDataLab locale={locale} onComplete={onComplete} />;
    case 'next-token': return <NextTokenLab locale={locale} onComplete={onComplete} />;
    case 'first-language-model': return <FirstLanguageModelLab locale={locale} onComplete={onComplete} />;
  }
}
