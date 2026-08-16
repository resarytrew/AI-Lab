'use client';

import Link from 'next/link';
import {useEffect, useState, type ReactNode} from 'react';
import styles from './technopark-entry-quest.module.css';
import {
  getTechnoparkEntryCopy,
  type DeviceId,
} from '@/content/quests/technopark-entry-copy';
import {
  hasCoreAbilitySet,
  initialQuestProgress,
  restoreQuestProgress,
  toggleInList,
  type IntelligenceAbility,
  type QuestProgress,
} from '@/lib/technopark-entry';

const storageKey = 'ai-lab:quest:technopark-entry:v1';
const sceneCount = 12;
const deviceIds: DeviceId[] = ['calculator', 'chess', 'vacuum', 'voice', 'llm'];
const stepNumbers = Array.from({length: sceneCount}, (_, index) => index + 1);
const chessCells = Array.from({length: 36}, (_, index) => `chess-cell-${index + 1}`);
const routeCells = [
  {id: 'r-01', value: 'r'}, {id: 'r-02', value: ''}, {id: 'r-03', value: ''}, {id: 'r-04', value: 'x'}, {id: 'r-05', value: ''}, {id: 'r-06', value: ''},
  {id: 'r-07', value: ''}, {id: 'r-08', value: 'x'}, {id: 'r-09', value: ''}, {id: 'r-10', value: ''}, {id: 'r-11', value: 'p'}, {id: 'r-12', value: ''},
  {id: 'r-13', value: ''}, {id: 'r-14', value: 'x'}, {id: 'r-15', value: ''}, {id: 'r-16', value: ''}, {id: 'r-17', value: ''}, {id: 'r-18', value: ''},
  {id: 'r-19', value: 'x'}, {id: 'r-20', value: ''}, {id: 'r-21', value: ''}, {id: 'r-22', value: 'l'}, {id: 'r-23', value: ''}, {id: 'r-24', value: ''},
] as const;

function Mark() {
  return (
    <div className={styles.mark} role="img" aria-label="AI Lab">
      <span>A</span>
      <small>LAB</small>
    </div>
  );
}

function SceneHeader({
  scene,
  locale,
  questLabel,
  languageLabel,
  onBack,
}: {
  scene: number;
  locale: string;
  questLabel: string;
  languageLabel: string;
  onBack: () => void;
}) {
  const targetLocale = locale === 'en' ? 'ru' : 'en';

  return (
    <header className={styles.chrome}>
      <div className={styles.chromeLeft}>
        <Mark />
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          disabled={scene === 0}
          aria-label="Назад"
        >
          <span aria-hidden="true">←</span>
        </button>
      </div>

      <div className={styles.questPill}>
        <span className={styles.lock} aria-hidden="true" />
        <span>{questLabel.replace(' · Вход в Технопарк', '')}</span>
      </div>

      <div className={styles.chromeRight}>
        <Link className={styles.languageButton} href={`/${targetLocale}/technopark/entry`}>
          {languageLabel}
        </Link>
        <div className={styles.profilePill}>
          <span>Исследователь</span>
          <i aria-hidden="true">↗</i>
        </div>
      </div>
    </header>
  );
}

function ProgressRail({scene}: {scene: number}) {
  return (
    <aside className={styles.progressRail} aria-label={`Шаг ${scene + 1} из ${sceneCount}`}>
      <span className={styles.railArrow} aria-hidden="true">⌃</span>
      <div className={styles.railSteps}>
        {stepNumbers.map((step) => {
          const index = step - 1;
          return (
            <span
              key={`quest-step-${step}`}
              className={`${styles.railStep} ${index === scene ? styles.railStepCurrent : ''} ${index < scene ? styles.railStepDone : ''}`}
            >
              {step}
            </span>
          );
        })}
      </div>
      <span className={styles.railArrow} aria-hidden="true">⌄</span>
    </aside>
  );
}

function HelpButton() {
  return (
    <button type="button" className={styles.helpButton} title="Подсказка появится в нужный момент">
      Помощь
    </button>
  );
}

function BottomAction({label, disabled, onClick}: {label: string; disabled?: boolean; onClick: () => void}) {
  return (
    <div className={styles.bottomAction}>
      <button type="button" disabled={disabled} onClick={onClick}>{label}</button>
    </div>
  );
}

function Feedback({good, children}: {good: boolean; children: ReactNode}) {
  return (
    <div className={`${styles.feedback} ${good ? styles.feedbackGood : styles.feedbackBad}`} aria-live="polite">
      <b>{good ? 'Верно' : 'Попробуй ещё'}</b>
      <span>{children}</span>
    </div>
  );
}

function ChoiceList({answers, selected, onSelect}: {answers: readonly string[]; selected: number | null; onSelect: (index: number) => void}) {
  return (
    <div className={styles.choiceList}>
      {answers.map((answer, index) => (
        <button
          key={answer}
          type="button"
          className={`${styles.choiceRow} ${selected === index ? styles.choiceRowSelected : ''}`}
          onClick={() => onSelect(index)}
        >
          <span className={styles.choiceMarker}>{String.fromCharCode(65 + index)}</span>
          <span>{answer}</span>
        </button>
      ))}
    </div>
  );
}

function QuestionPanel({question, answers, selected, correctIndex, good, bad, onSelect}: {
  question: string;
  answers: readonly string[];
  selected: number | null;
  correctIndex: number;
  good: string;
  bad: string;
  onSelect: (index: number) => void;
}) {
  const correct = selected === correctIndex;
  return (
    <div className={styles.questionPanel}>
      <h2>{question}</h2>
      <ChoiceList answers={answers} selected={selected} onSelect={onSelect} />
      {selected !== null && <Feedback good={correct}>{correct ? good : bad}</Feedback>}
    </div>
  );
}

function LabSceneArt() {
  return (
    <div className={styles.labSceneArt} aria-hidden="true">
      <div className={styles.labBackdrop} />
      <div className={styles.labWindow}><i /><i /><i /><i /></div>
      <div className={styles.labDesk} />
      <div className={styles.labMonitor}>
        <div className={styles.monitorTopLine} />
        <div className={styles.monitorRows}><i /><i /><i /></div>
        <div className={styles.monitorGraph}><i /><i /><i /><i /></div>
      </div>
      <div className={styles.labKeyboard} />
      <div className={styles.labNotebook}>01</div>
      <div className={styles.labShelf}><i /><i /><i /></div>
      <div className={styles.labPerson}>
        <div className={styles.personHead} />
        <div className={styles.personHair} />
        <div className={styles.personBody} />
        <div className={styles.personTablet} />
      </div>
    </div>
  );
}

function DeviceSymbol({id}: {id: DeviceId}) {
  const symbol: Record<DeviceId, string> = {
    calculator: '123',
    chess: '8×8',
    vacuum: 'R-01',
    voice: 'WAVE',
    llm: 'TEXT',
  };
  return <span className={styles.deviceSymbol}>{symbol[id]}</span>;
}

function SceneLayout({kicker, title, lead, children, visual}: {kicker: string; title: string; lead: string; children?: ReactNode; visual?: ReactNode}) {
  return (
    <section className={styles.sceneLayout}>
      <div className={styles.sceneCopy}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {children}
      </div>
      <div className={styles.sceneVisual}>{visual}</div>
    </section>
  );
}

export function TechnoparkEntryQuest({locale}: {locale: string}) {
  const copy = getTechnoparkEntryCopy(locale);
  const [progress, setProgress] = useState<QuestProgress>(initialQuestProgress);
  const [hydrated, setHydrated] = useState(false);
  const [speedAnswer, setSpeedAnswer] = useState<number | null>(null);
  const [narrowAnswer, setNarrowAnswer] = useState<number | null>(null);
  const [ruleAnswer, setRuleAnswer] = useState<number | null>(null);
  const [patternAnswer, setPatternAnswer] = useState('');
  const [contextAnswer, setContextAnswer] = useState<number | null>(null);
  const [planAnswer, setPlanAnswer] = useState<number | null>(null);
  const [transferAnswer, setTransferAnswer] = useState<number | null>(null);

  useEffect(() => {
    setProgress(restoreQuestProgress(window.localStorage.getItem(storageKey)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [hydrated, progress]);

  const scene = progress.scene;
  const setScene = (value: number) => setProgress((current) => ({...current, scene: Math.max(0, Math.min(sceneCount - 1, value))}));
  const next = () => setScene(scene + 1);
  const back = () => setScene(scene - 1);

  let nextLabel = scene === 0 ? copy.intro.action : copy.next;
  let nextDisabled = false;
  let sceneBody: ReactNode;

  if (scene === 0) {
    sceneBody = (
      <SceneLayout kicker="Первый день в AI Lab" title="Вход в Технопарк: что делает машину умной?" lead={copy.intro.lead} visual={<LabSceneArt />}>
        <div className={styles.storyCard}><strong>Задача</strong><p>{copy.intro.note}</p></div>
      </SceneLayout>
    );
  } else if (scene === 1) {
    nextDisabled = progress.smartSystems.length === 0;
    sceneBody = (
      <SceneLayout
        kicker={copy.machines.eyebrow}
        title={copy.machines.title}
        lead={copy.machines.lead}
        visual={
          <div className={styles.deviceWall}>
            {deviceIds.map((id) => {
              const selected = progress.smartSystems.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  className={`${styles.deviceCard} ${selected ? styles.deviceCardSelected : ''}`}
                  onClick={() => setProgress((current) => ({...current, smartSystems: toggleInList(current.smartSystems, id)}))}
                >
                  <DeviceSymbol id={id} />
                  <span>{copy.machines.devices[id]}</span>
                  <i>{selected ? 'Выбрано' : 'Выбрать'}</i>
                </button>
              );
            })}
          </div>
        }
      >
        <p className={styles.hintText}>{progress.smartSystems.length ? copy.machines.reveal : copy.machines.hint}</p>
      </SceneLayout>
    );
  } else if (scene === 2) {
    const correct = speedAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.speed.eyebrow} title={copy.speed.title} lead={copy.speed.lead} visual={
        <div className={styles.raceBoard}>
          <div><small>Человек</small><b>987 × 654</b><span>думает...</span></div>
          <i>VS</i>
          <div><small>Калькулятор</small><b>645 498</b><span>0,001 с</span></div>
        </div>
      }>
        <QuestionPanel question={copy.speed.question} answers={copy.speed.answers} selected={speedAnswer} correctIndex={1} good={copy.speed.good} bad={copy.speed.bad} onSelect={setSpeedAnswer} />
      </SceneLayout>
    );
  } else if (scene === 3) {
    const abilities = Object.keys(copy.abilities.names) as IntelligenceAbility[];
    const ready = hasCoreAbilitySet(progress.abilities);
    nextDisabled = !ready;
    sceneBody = (
      <SceneLayout kicker={copy.abilities.eyebrow} title={copy.abilities.title} lead={copy.abilities.lead} visual={
        <div className={styles.abilityBoard}>
          {abilities.map((ability) => {
            const selected = progress.abilities.includes(ability);
            return (
              <button
                key={ability}
                type="button"
                aria-pressed={selected}
                className={`${styles.abilityCard} ${selected ? styles.abilityCardSelected : ''}`}
                onClick={() => setProgress((current) => ({...current, abilities: toggleInList(current.abilities, ability)}))}
              >
                <span>{copy.abilities.names[ability]}</span><i>{selected ? '✓' : '+'}</i>
              </button>
            );
          })}
        </div>
      }>
        <p className={styles.hintText}>{ready ? copy.abilities.reveal : `${copy.abilities.hint} ${progress.abilities.length}/4`}</p>
      </SceneLayout>
    );
  } else if (scene === 4) {
    const correct = narrowAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.narrow.eyebrow} title={copy.narrow.title} lead={copy.narrow.lead} visual={
        <div className={styles.specialistBoard}>
          <div className={styles.chessGrid}>{chessCells.map((cellId) => <i key={cellId} />)}</div>
          <div className={styles.specialistStats}><small>СИСТЕМА CHESS-01</small><b>Сверхсильная в шахматах</b><span>Другие задачи: не обучена</span></div>
        </div>
      }>
        <QuestionPanel question={copy.narrow.question} answers={copy.narrow.answers} selected={narrowAnswer} correctIndex={1} good={copy.narrow.good} bad={copy.narrow.bad} onSelect={setNarrowAnswer} />
      </SceneLayout>
    );
  } else if (scene === 5) {
    const correct = ruleAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.rules.eyebrow} title={copy.rules.title} lead={copy.rules.lead} visual={
        <div className={styles.rulesBoard}>
          {copy.rules.rules.map((rule, index) => <div key={rule}><b>{String(index + 1).padStart(2, '0')}</b><code>{rule}</code></div>)}
          <div className={styles.unknownCase}><b>04</b><code>НОВЫЙ СЛУЧАЙ → ?</code></div>
        </div>
      }>
        <QuestionPanel question={copy.rules.question} answers={copy.rules.answers} selected={ruleAnswer} correctIndex={1} good={copy.rules.good} bad={copy.rules.bad} onSelect={setRuleAnswer} />
      </SceneLayout>
    );
  } else if (scene === 6) {
    const correct = patternAnswer.trim() === copy.pattern.answer;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.pattern.eyebrow} title={copy.pattern.title} lead={copy.pattern.lead} visual={
        <div className={styles.patternBoard}>
          <span>2 <b>→</b> 4</span><span>3 <b>→</b> 6</span><span>5 <b>→</b> 10</span>
          <label><strong>8 →</strong><input aria-label={copy.pattern.question} inputMode="numeric" value={patternAnswer} onChange={(event) => setPatternAnswer(event.target.value)} /></label>
        </div>
      }>
        {patternAnswer && <Feedback good={correct}>{correct ? copy.pattern.good : copy.pattern.bad}</Feedback>}
        {correct && <div className={styles.discovery}><b>Открытие</b><p>{copy.pattern.reveal}</p></div>}
      </SceneLayout>
    );
  } else if (scene === 7) {
    const correct = contextAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.context.eyebrow} title={copy.context.title} lead={copy.context.lead} visual={
        <div className={styles.contextBoard}>
          {copy.context.phrases.map((phrase, index) => <blockquote key={phrase}><small>Сцена {index + 1}</small><p>{phrase}</p></blockquote>)}
        </div>
      }>
        <QuestionPanel question={copy.context.question} answers={copy.context.answers} selected={contextAnswer} correctIndex={1} good={copy.context.good} bad={copy.context.bad} onSelect={setContextAnswer} />
      </SceneLayout>
    );
  } else if (scene === 8) {
    const correct = planAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.plan.eyebrow} title={copy.plan.title} lead={copy.plan.lead} visual={
        <div className={styles.routeBoard}>
          {routeCells.map(({id, value}) => (
            <i key={id} className={`${value === 'x' ? styles.routeWall : ''} ${value === 'p' ? styles.routePath : ''} ${value === 'r' ? styles.routeRobot : ''} ${value === 'l' ? styles.routeLab : ''}`}>
              {value === 'r' ? 'R' : value === 'l' ? 'LAB' : ''}
            </i>
          ))}
        </div>
      }>
        <QuestionPanel question={copy.plan.question} answers={copy.plan.answers} selected={planAnswer} correctIndex={1} good={copy.plan.good} bad={copy.plan.bad} onSelect={setPlanAnswer} />
      </SceneLayout>
    );
  } else if (scene === 9) {
    const correct = transferAnswer === 1;
    nextDisabled = !correct;
    sceneBody = (
      <SceneLayout kicker={copy.transfer.eyebrow} title={copy.transfer.title} lead={copy.transfer.lead} visual={
        <div className={styles.thermostatBoard}>
          {copy.transfer.systems.map((system, index) => (
            <article key={system}><b>{index === 0 ? 'A' : 'B'}</b><div className={styles.thermostatDial}>{index === 0 ? '22°' : 'AUTO'}</div><p>{system}</p></article>
          ))}
        </div>
      }>
        <QuestionPanel question={copy.transfer.question} answers={copy.transfer.answers} selected={transferAnswer} correctIndex={1} good={copy.transfer.good} bad={copy.transfer.bad} onSelect={setTransferAnswer} />
      </SceneLayout>
    );
  } else if (scene === 10) {
    const ready = progress.journal.trim().length >= 12;
    nextDisabled = !ready;
    nextLabel = copy.continue;
    sceneBody = (
      <SceneLayout kicker={copy.journal.eyebrow} title={copy.journal.title} lead={copy.journal.lead} visual={
        <div className={styles.journalPanel}>
          <label htmlFor="research-journal">{copy.journal.prompt}</label>
          <textarea id="research-journal" maxLength={500} value={progress.journal} placeholder={copy.journal.placeholder} onChange={(event) => setProgress((current) => ({...current, journal: event.target.value}))} />
          <div><span>{copy.journal.hint}</span><b>{progress.journal.length}/500</b></div>
        </div>
      } />
    );
  } else {
    nextLabel = copy.unlock.finish;
    sceneBody = (
      <SceneLayout kicker={copy.unlock.eyebrow} title={copy.unlock.title} lead={copy.unlock.lead} visual={
        <div className={styles.unlockBoard}>
          <div className={styles.unlockSeal}>01</div>
          <article><small>Журнал</small><b>{copy.unlock.journal}</b><p>«{progress.journal}»</p></article>
          <article><small>Проект M-01</small><b>{copy.unlock.project}</b><p>{copy.unlock.status}</p></article>
          <article><small>Доступ</small><b>{copy.unlock.open1}</b><p>{copy.unlock.open2}</p></article>
        </div>
      }>
        <div className={styles.passBadge}>{copy.unlock.badge}</div>
      </SceneLayout>
    );
  }

  const handleNext = () => {
    if (scene === sceneCount - 1) {
      setProgress((current) => ({...current, scene: 0, completed: true}));
      return;
    }
    next();
  };

  return (
    <main className={styles.questRoot}>
      <SceneHeader scene={scene} locale={locale} questLabel={copy.quest} languageLabel={copy.language} onBack={back} />
      {sceneBody}
      <ProgressRail scene={scene} />
      <BottomAction label={nextLabel} disabled={nextDisabled} onClick={handleNext} />
      <HelpButton />
    </main>
  );
}
