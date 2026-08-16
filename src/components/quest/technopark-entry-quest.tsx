'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import styles from './technopark-entry-quest.module.css';
import {
  getTechnoparkEntryCopy,
  type DeviceId,
} from '@/content/quests/technopark-entry-copy';
import {
  hasCoreAbilitySet,
  initialQuestProgress,
  progressPercent,
  restoreQuestProgress,
  toggleInList,
  type IntelligenceAbility,
  type QuestProgress,
} from '@/lib/technopark-entry';

const storageKey = 'ai-lab:quest:technopark-entry:v1';
const deviceIds: DeviceId[] = ['calculator', 'chess', 'vacuum', 'voice', 'llm'];

function MachineIcon({type}: {type: DeviceId}) {
  const label =
    type === 'calculator'
      ? '±'
      : type === 'chess'
        ? '♞'
        : type === 'vacuum'
          ? '◉'
          : type === 'voice'
            ? '⌁'
            : 'Aa';

  return (
    <span className={styles.machineIcon} aria-hidden="true">
      {label}
    </span>
  );
}

function ChoiceButton({
  selected,
  children,
  onClick,
}: {
  selected?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.choice} ${selected ? styles.choiceSelected : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Feedback({good, children}: {good: boolean; children: React.ReactNode}) {
  return (
    <div
      className={`${styles.feedback} ${good ? styles.feedbackGood : styles.feedbackTry}`}
      aria-live="polite"
    >
      <b>{good ? '✓' : '↺'}</b>
      <span>{children}</span>
    </div>
  );
}

function BottomNav({
  backLabel,
  nextLabel,
  nextDisabled,
  onBack,
  onNext,
}: {
  backLabel: string;
  nextLabel: string;
  nextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={styles.bottomNav}>
      <button type="button" className={styles.secondary} onClick={onBack}>
        {backLabel}
      </button>
      <button
        type="button"
        className={styles.primary}
        disabled={nextDisabled}
        onClick={onNext}
      >
        {nextLabel}
        <span>→</span>
      </button>
    </div>
  );
}

function QuestionCard({
  question,
  answers,
  selected,
  correctIndex,
  good,
  bad,
  backLabel,
  nextLabel,
  onSelect,
  onBack,
  onNext,
}: {
  question: string;
  answers: readonly string[];
  selected: number | null;
  correctIndex: number;
  good: string;
  bad: string;
  backLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const correct = selected === correctIndex;

  return (
    <div className={styles.questionCard}>
      <h2>{question}</h2>
      {answers.map((answer, index) => (
        <ChoiceButton
          key={answer}
          selected={selected === index}
          onClick={() => onSelect(index)}
        >
          {answer}
        </ChoiceButton>
      ))}
      {selected !== null && <Feedback good={correct}>{correct ? good : bad}</Feedback>}
      <BottomNav
        backLabel={backLabel}
        nextLabel={nextLabel}
        nextDisabled={!correct}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}

function TechnoparkArt() {
  return (
    <div className={styles.parkArt} aria-hidden="true">
      <div className={styles.parkMoon} />
      <div className={styles.parkTower}>
        <span>AI</span>
      </div>
      <div className={`${styles.parkBuilding} ${styles.parkBuildingLeft}`}>
        <i />
        <i />
        <i />
      </div>
      <div className={`${styles.parkBuilding} ${styles.parkBuildingRight}`}>
        <i />
        <i />
      </div>
      <div className={styles.parkBridge} />
      <div className={styles.parkPath} />
      <div className={styles.parkGlowOne} />
      <div className={styles.parkGlowTwo} />
    </div>
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
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [hydrated, progress]);

  const scene = progress.scene;
  const percent = progressPercent(scene);
  const targetLocale = locale === 'en' ? 'ru' : 'en';
  const setScene = (value: number) =>
    setProgress((current) => ({
      ...current,
      scene: Math.max(0, Math.min(11, value)),
    }));
  const next = () => setScene(scene + 1);
  const back = () => setScene(scene - 1);

  const sceneBody = (() => {
    if (scene === 0) {
      return (
        <section className={`${styles.scene} ${styles.introScene}`}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>{copy.intro.eyebrow}</p>
            <h1>{copy.intro.title}</h1>
            <p className={styles.lead}>{copy.intro.lead}</p>
            <div className={styles.missionNote}>
              <b>01</b>
              <span>{copy.intro.note}</span>
            </div>
            <button className={styles.primary} type="button" onClick={next}>
              {copy.intro.action}
              <span>→</span>
            </button>
          </div>
          <TechnoparkArt />
        </section>
      );
    }

    if (scene === 1) {
      return (
        <section className={styles.scene}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>{copy.machines.eyebrow}</p>
            <h1>{copy.machines.title}</h1>
            <p className={styles.lead}>{copy.machines.lead}</p>
          </div>
          <div className={styles.machineGrid}>
            {deviceIds.map((id) => {
              const selected = progress.smartSystems.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  className={`${styles.machineCard} ${selected ? styles.machineCardSelected : ''}`}
                  onClick={() =>
                    setProgress((current) => ({
                      ...current,
                      smartSystems: toggleInList(current.smartSystems, id),
                    }))
                  }
                >
                  <MachineIcon type={id} />
                  <strong>{copy.machines.devices[id]}</strong>
                  <span>{selected ? '✓' : '+'}</span>
                </button>
              );
            })}
          </div>
          <p className={styles.microcopy}>
            {progress.smartSystems.length ? copy.machines.reveal : copy.machines.hint}
          </p>
          <BottomNav
            backLabel={copy.back}
            nextLabel={copy.next}
            nextDisabled={!progress.smartSystems.length}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 2) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.speed.eyebrow}</p>
            <h1>{copy.speed.title}</h1>
            <p className={styles.lead}>{copy.speed.lead}</p>
            <div className={styles.numberRace}>
              <div><small>human</small><strong>987 × 654</strong><span>thinking…</span></div>
              <div className={styles.vs}>VS</div>
              <div><small>calculator</small><strong>645 498</strong><span>0.001 s</span></div>
            </div>
          </div>
          <QuestionCard
            question={copy.speed.question}
            answers={copy.speed.answers}
            selected={speedAnswer}
            correctIndex={1}
            good={copy.speed.good}
            bad={copy.speed.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setSpeedAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 3) {
      const abilities = Object.keys(copy.abilities.names) as IntelligenceAbility[];
      const ready = hasCoreAbilitySet(progress.abilities);
      return (
        <section className={styles.scene}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>{copy.abilities.eyebrow}</p>
            <h1>{copy.abilities.title}</h1>
            <p className={styles.lead}>{copy.abilities.lead}</p>
          </div>
          <div className={styles.abilityOrbit}>
            <div className={styles.orbitCenter}><strong>?</strong><span>intelligence</span></div>
            {abilities.map((ability) => {
              const selected = progress.abilities.includes(ability);
              return (
                <button
                  key={ability}
                  type="button"
                  aria-pressed={selected}
                  className={`${styles.abilityChip} ${selected ? styles.abilityChipSelected : ''}`}
                  onClick={() =>
                    setProgress((current) => ({
                      ...current,
                      abilities: toggleInList(current.abilities, ability),
                    }))
                  }
                >
                  {copy.abilities.names[ability]}
                </button>
              );
            })}
          </div>
          <p className={styles.microcopy}>
            {ready ? copy.abilities.reveal : `${copy.abilities.hint} · ${progress.abilities.length}/4`}
          </p>
          <BottomNav
            backLabel={copy.back}
            nextLabel={copy.next}
            nextDisabled={!ready}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 4) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.narrow.eyebrow}</p>
            <h1>{copy.narrow.title}</h1>
            <p className={styles.lead}>{copy.narrow.lead}</p>
            <div className={styles.specialistPanel}>
              <div className={styles.chessBoard}>♜ ♞ ♝<br />♟ ♟ ♟<br />· · ♔</div>
              <div><strong>CHESS-01</strong><span>rating: superhuman</span><span>outside task: unknown</span></div>
            </div>
          </div>
          <QuestionCard
            question={copy.narrow.question}
            answers={copy.narrow.answers}
            selected={narrowAnswer}
            correctIndex={1}
            good={copy.narrow.good}
            bad={copy.narrow.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setNarrowAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 5) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.rules.eyebrow}</p>
            <h1>{copy.rules.title}</h1>
            <p className={styles.lead}>{copy.rules.lead}</p>
            <div className={styles.ruleStack}>
              {copy.rules.rules.map((rule) => <code key={rule}>{rule}</code>)}
              <div className={styles.unknownRule}>?</div>
            </div>
          </div>
          <QuestionCard
            question={copy.rules.question}
            answers={copy.rules.answers}
            selected={ruleAnswer}
            correctIndex={1}
            good={copy.rules.good}
            bad={copy.rules.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setRuleAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 6) {
      const correct = patternAnswer.trim() === copy.pattern.answer;
      return (
        <section className={`${styles.scene} ${styles.patternScene}`}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>{copy.pattern.eyebrow}</p>
            <h1>{copy.pattern.title}</h1>
            <p className={styles.lead}>{copy.pattern.lead}</p>
          </div>
          <div className={styles.patternRow}>
            <span>2 <b>→</b> 4</span><span>3 <b>→</b> 6</span><span>5 <b>→</b> 10</span>
            <span className={styles.patternQuestion}>
              8 <b>→</b>
              <input
                aria-label={copy.pattern.question}
                inputMode="numeric"
                value={patternAnswer}
                onChange={(event) => setPatternAnswer(event.target.value)}
              />
            </span>
          </div>
          {patternAnswer && <Feedback good={correct}>{correct ? copy.pattern.good : copy.pattern.bad}</Feedback>}
          {correct && <div className={styles.discoveryCard}><span>DISCOVERY</span><p>{copy.pattern.reveal}</p></div>}
          <BottomNav
            backLabel={copy.back}
            nextLabel={copy.next}
            nextDisabled={!correct}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 7) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.context.eyebrow}</p>
            <h1>{copy.context.title}</h1>
            <p className={styles.lead}>{copy.context.lead}</p>
            <div className={styles.contextCards}>
              {copy.context.phrases.map((phrase) => <blockquote key={phrase}>{phrase}</blockquote>)}
            </div>
          </div>
          <QuestionCard
            question={copy.context.question}
            answers={copy.context.answers}
            selected={contextAnswer}
            correctIndex={1}
            good={copy.context.good}
            bad={copy.context.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setContextAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 8) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.plan.eyebrow}</p>
            <h1>{copy.plan.title}</h1>
            <p className={styles.lead}>{copy.plan.lead}</p>
            <div className={styles.mapMini}>
              <span className={styles.robotDot}>R</span>
              <span className={styles.goalDot}>LAB</span>
              <i className={styles.wallOne} />
              <i className={styles.wallTwo} />
              <svg viewBox="0 0 400 220" aria-hidden="true"><path d="M65 165 C120 130 120 55 200 65 S280 165 335 75" /></svg>
            </div>
          </div>
          <QuestionCard
            question={copy.plan.question}
            answers={copy.plan.answers}
            selected={planAnswer}
            correctIndex={1}
            good={copy.plan.good}
            bad={copy.plan.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setPlanAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 9) {
      return (
        <section className={`${styles.scene} ${styles.twoColumn}`}>
          <div>
            <p className={styles.eyebrow}>{copy.transfer.eyebrow}</p>
            <h1>{copy.transfer.title}</h1>
            <p className={styles.lead}>{copy.transfer.lead}</p>
            <div className={styles.thermostats}>
              {copy.transfer.systems.map((system, index) => (
                <article key={system}>
                  <b>{index === 0 ? 'A' : 'B'}</b>
                  <span>{index === 0 ? '07:00 → 22°' : 'observations → adaptation'}</span>
                  <p>{system}</p>
                </article>
              ))}
            </div>
          </div>
          <QuestionCard
            question={copy.transfer.question}
            answers={copy.transfer.answers}
            selected={transferAnswer}
            correctIndex={1}
            good={copy.transfer.good}
            bad={copy.transfer.bad}
            backLabel={copy.back}
            nextLabel={copy.next}
            onSelect={setTransferAnswer}
            onBack={back}
            onNext={next}
          />
        </section>
      );
    }

    if (scene === 10) {
      const ready = progress.journal.trim().length >= 12;
      return (
        <section className={`${styles.scene} ${styles.journalScene}`}>
          <div className={styles.journalPaper}>
            <p className={styles.eyebrow}>{copy.journal.eyebrow}</p>
            <h1>{copy.journal.title}</h1>
            <p className={styles.lead}>{copy.journal.lead}</p>
            <label htmlFor="research-journal">{copy.journal.prompt}</label>
            <textarea
              id="research-journal"
              maxLength={500}
              value={progress.journal}
              placeholder={copy.journal.placeholder}
              onChange={(event) =>
                setProgress((current) => ({...current, journal: event.target.value}))
              }
            />
            <div className={styles.journalMeta}>
              <span>{copy.journal.hint}</span>
              <b>{progress.journal.length}/500</b>
            </div>
            <BottomNav
              backLabel={copy.back}
              nextLabel={copy.continue}
              nextDisabled={!ready}
              onBack={back}
              onNext={next}
            />
          </div>
          <div className={styles.journalStamp}>AI LAB<br />ENTRY 01</div>
        </section>
      );
    }

    return (
      <section className={`${styles.scene} ${styles.unlockScene}`}>
        <div className={styles.unlockHalo}><span>01</span></div>
        <div className={styles.unlockCopy}>
          <p className={styles.eyebrow}>{copy.unlock.eyebrow}</p>
          <h1>{copy.unlock.title}</h1>
          <p className={styles.lead}>{copy.unlock.lead}</p>
          <div className={styles.badge}>{copy.unlock.badge}</div>
          <div className={styles.unlockGrid}>
            <article><small>JOURNAL</small><strong>{copy.unlock.journal}</strong><p>“{progress.journal}”</p></article>
            <article><small>MYAI · M-01</small><strong>{copy.unlock.project}</strong><p>{copy.unlock.status}</p></article>
            <article><small>NEXT</small><strong>{copy.unlock.open1}</strong><p>{copy.unlock.open2}</p></article>
          </div>
          <button
            type="button"
            className={styles.primary}
            onClick={() =>
              setProgress((current) => ({...current, scene: 0, completed: true}))
            }
          >
            {copy.unlock.finish}
            <span>↻</span>
          </button>
        </div>
      </section>
    );
  })();

  return (
    <main className={styles.questRoot}>
      <header className={styles.questHeader}>
        <div className={styles.brandMark}><span>AI</span><b>LAB</b></div>
        <div className={styles.questMeta}><small>{copy.lab}</small><strong>{copy.quest}</strong></div>
        <div
          className={styles.progressWrap}
          role="progressbar"
          aria-label={copy.quest}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <span>{String(scene + 1).padStart(2, '0')}</span>
          <div><i style={{width: `${percent}%`}} /></div>
          <span>12</span>
        </div>
        <Link className={styles.localeButton} href={`/${targetLocale}/technopark/entry`}>
          {copy.language}
        </Link>
      </header>
      {sceneBody}
      {scene > 0 && scene < 11 && (
        <button type="button" className={styles.cornerBack} onClick={back} aria-label={copy.back}>
          ←
        </button>
      )}
    </main>
  );
}
