'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import heroScene from '@/assets/technopark-entry.webp';
import {getTechnoparkEntryCopy, type DeviceId} from '@/content/quests/technopark-entry-copy';
import {
  hasCoreAbilitySet,
  initialQuestProgress,
  restoreQuestProgress,
  toggleInList,
  type IntelligenceAbility,
  type QuestProgress,
} from '@/lib/technopark-entry';
import styles from './technopark-entry-hybrid.module.css';

const storageKey = 'ai-lab:quest:technopark-entry:v1';
const sceneCount = 12;
const stepNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const deviceIds: DeviceId[] = ['calculator', 'chess', 'vacuum', 'voice', 'llm'];
const deviceShort: Record<DeviceId, string> = {
  calculator: '123',
  chess: '8×8',
  vacuum: 'R-01',
  voice: 'WAVE',
  llm: 'TEXT',
};

function Header({scene, locale, onBack}: {scene: number; locale: string; onBack: () => void}) {
  const targetLocale = locale === 'en' ? 'ru' : 'en';
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}><span>AI</span><small>LAB</small></div>
        <button type="button" className={styles.back} onClick={onBack} disabled={scene === 0} aria-label="Назад">←</button>
      </div>
      <div className={styles.questPill}><span className={styles.lock} />Квест 01</div>
      <div className={styles.headerRight}>
        <Link href={`/${targetLocale}/technopark/entry`} className={styles.lang}>{targetLocale.toUpperCase()}</Link>
        <div className={styles.profile}>Исследователь <span>↗</span></div>
      </div>
    </header>
  );
}

function Rail({scene}: {scene: number}) {
  return (
    <aside className={styles.rail} aria-label={`Шаг ${scene + 1} из ${sceneCount}`}>
      <span className={styles.chevron}>⌃</span>
      {stepNumbers.map((step) => {
        const index = step - 1;
        return <span key={`step-${step}`} className={`${styles.step} ${index === scene ? styles.stepActive : ''} ${index < scene ? styles.stepDone : ''}`}>{step}</span>;
      })}
      <span className={styles.chevron}>⌄</span>
    </aside>
  );
}

function PhotoStage({scene, children}: {scene: number; children?: ReactNode}) {
  return (
    <div className={styles.photoStage}>
      <Image className={styles.photo} src={heroScene} alt="Исследовательская лаборатория AI Lab" priority={scene === 0} fill sizes="(max-width: 900px) 100vw, 58vw" />
      <div className={styles.photoVignette} />
      <div className={styles.photoMeta}><span>AI LAB / HALL 01</span><b>{String(scene + 1).padStart(2, '0')}</b></div>
      {children}
    </div>
  );
}

function Feedback({good, text}: {good: boolean; text: string}) {
  return <div className={`${styles.feedback} ${good ? styles.feedbackGood : styles.feedbackBad}`}><b>{good ? 'Верно' : 'Попробуй ещё'}</b><span>{text}</span></div>;
}

function Choices({answers, selected, onSelect}: {answers: readonly string[]; selected: number | null; onSelect: (value: number) => void}) {
  return (
    <div className={styles.choices}>
      {answers.map((answer, index) => (
        <button key={answer} type="button" className={`${styles.choice} ${selected === index ? styles.choiceActive : ''}`} onClick={() => onSelect(index)}>
          <span>{String.fromCharCode(65 + index)}</span><b>{answer}</b>
        </button>
      ))}
    </div>
  );
}

function Question({question, answers, selected, correctIndex, good, bad, onSelect}: {
  question: string;
  answers: readonly string[];
  selected: number | null;
  correctIndex: number;
  good: string;
  bad: string;
  onSelect: (value: number) => void;
}) {
  return (
    <div className={styles.question}>
      <h2>{question}</h2>
      <Choices answers={answers} selected={selected} onSelect={onSelect} />
      {selected !== null && <Feedback good={selected === correctIndex} text={selected === correctIndex ? good : bad} />}
    </div>
  );
}

function Action({label, disabled, onClick}: {label: string; disabled?: boolean; onClick: () => void}) {
  return <button type="button" className={styles.action} disabled={disabled} onClick={onClick}><span>{label}</span><b>→</b></button>;
}

function OverlayCard({eyebrow, title, children}: {eyebrow: string; title: string; children?: ReactNode}) {
  return <div className={styles.overlayCard}><small>{eyebrow}</small><strong>{title}</strong>{children}</div>;
}

function SceneShell({kicker, title, lead, children, visual}: {kicker: string; title: string; lead: string; children?: ReactNode; visual?: ReactNode}) {
  return (
    <section className={styles.shell}>
      <div className={styles.copy}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{lead}</p>
        {children}
      </div>
      {visual}
    </section>
  );
}

export function TechnoparkEntryHybrid({locale}: {locale: string}) {
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
  const abilities = useMemo(() => Object.keys(copy.abilities.names) as IntelligenceAbility[], [copy.abilities.names]);
  let disabled = false;
  let label = scene === 0 ? copy.intro.action : copy.next;
  let body: ReactNode;

  if (scene === 0) {
    body = (
      <SceneShell kicker="Первый день в AI Lab" title="Вход в Технопарк: что делает машину умной?" lead={copy.intro.lead} visual={
        <PhotoStage scene={scene}>
          <OverlayCard eyebrow="MISSION 01" title="Наблюдай. Сомневайся. Проверяй."><p>Сегодня ты не получишь готового определения интеллекта — ты соберёшь его сам.</p></OverlayCard>
        </PhotoStage>
      }>
        <div className={styles.taskCard}><small>Задача</small><p>{copy.intro.note}</p></div>
      </SceneShell>
    );
  } else if (scene === 1) {
    disabled = progress.smartSystems.length === 0;
    body = (
      <SceneShell kicker={copy.machines.eyebrow} title={copy.machines.title} lead={copy.machines.lead} visual={
        <PhotoStage scene={scene}>
          <OverlayCard eyebrow="НАБЛЮДЕНИЕ" title={`${progress.smartSystems.length} из 5 отмечено`}><p>{progress.smartSystems.length ? copy.machines.reveal : 'Выбор слева меняет твою рабочую гипотезу.'}</p></OverlayCard>
        </PhotoStage>
      }>
        <div className={styles.deviceGrid}>
          {deviceIds.map((id) => {
            const selected = progress.smartSystems.includes(id);
            return <button key={id} type="button" aria-pressed={selected} className={`${styles.device} ${selected ? styles.deviceActive : ''}`} onClick={() => setProgress((current) => ({...current, smartSystems: toggleInList(current.smartSystems, id)}))}><i>{deviceShort[id]}</i><span>{copy.machines.devices[id]}</span><b>{selected ? '✓' : '+'}</b></button>;
          })}
        </div>
      </SceneShell>
    );
  } else if (scene === 2) {
    disabled = speedAnswer !== 1;
    body = (
      <SceneShell kicker={copy.speed.eyebrow} title={copy.speed.title} lead={copy.speed.lead} visual={
        <PhotoStage scene={scene}>
          <div className={styles.metricStack}><div><small>МАШИНА</small><strong>0.001 s</strong><span>вычисление</span></div><div><small>ЧЕЛОВЕК</small><strong>45.2 s</strong><span>то же вычисление</span></div></div>
        </PhotoStage>
      }>
        <Question question={copy.speed.question} answers={copy.speed.answers} selected={speedAnswer} correctIndex={1} good={copy.speed.good} bad={copy.speed.bad} onSelect={setSpeedAnswer} />
      </SceneShell>
    );
  } else if (scene === 3) {
    const ready = hasCoreAbilitySet(progress.abilities);
    disabled = !ready;
    body = (
      <SceneShell kicker={copy.abilities.eyebrow} title={copy.abilities.title} lead={copy.abilities.lead} visual={
        <PhotoStage scene={scene}>
          <div className={styles.networkOverlay}><span>ПАМЯТЬ</span><span>ОБЩЕНИЕ</span><strong>ИНТЕЛЛЕКТ</strong><span>ПЛАН</span><span>ОБУЧЕНИЕ</span></div>
        </PhotoStage>
      }>
        <div className={styles.abilityGrid}>{abilities.map((ability) => {const selected = progress.abilities.includes(ability); return <button key={ability} type="button" className={`${styles.ability} ${selected ? styles.abilityActive : ''}`} onClick={() => setProgress((current) => ({...current, abilities: toggleInList(current.abilities, ability)}))}><span>{copy.abilities.names[ability]}</span><b>{selected ? '✓' : '+'}</b></button>;})}</div>
        <p className={styles.miniHint}>{ready ? copy.abilities.reveal : `${copy.abilities.hint} ${progress.abilities.length}/4`}</p>
      </SceneShell>
    );
  } else if (scene === 4) {
    disabled = narrowAnswer !== 1;
    body = <SceneShell kicker={copy.narrow.eyebrow} title={copy.narrow.title} lead={copy.narrow.lead} visual={<PhotoStage scene={scene}><OverlayCard eyebrow="CHESS-01" title="Сильнее человека в одной задаче"><p>Но вне шахматной доски у системы нет готовых навыков.</p></OverlayCard></PhotoStage>}><Question question={copy.narrow.question} answers={copy.narrow.answers} selected={narrowAnswer} correctIndex={1} good={copy.narrow.good} bad={copy.narrow.bad} onSelect={setNarrowAnswer} /></SceneShell>;
  } else if (scene === 5) {
    disabled = ruleAnswer !== 1;
    body = <SceneShell kicker={copy.rules.eyebrow} title={copy.rules.title} lead={copy.rules.lead} visual={<PhotoStage scene={scene}><div className={styles.rulesOverlay}>{copy.rules.rules.map((rule, i) => <code key={rule}><b>{String(i + 1).padStart(2, '0')}</b>{rule}</code>)}<code className={styles.ruleUnknown}><b>04</b>НОВЫЙ СЛУЧАЙ → ?</code></div></PhotoStage>}><Question question={copy.rules.question} answers={copy.rules.answers} selected={ruleAnswer} correctIndex={1} good={copy.rules.good} bad={copy.rules.bad} onSelect={setRuleAnswer} /></SceneShell>;
  } else if (scene === 6) {
    const correct = patternAnswer.trim() === copy.pattern.answer;
    disabled = !correct;
    body = <SceneShell kicker={copy.pattern.eyebrow} title={copy.pattern.title} lead={copy.pattern.lead} visual={<PhotoStage scene={scene}><div className={styles.patternOverlay}><span>2 → 4</span><span>3 → 6</span><span>5 → 10</span><strong>8 → ?</strong></div></PhotoStage>}><div className={styles.patternInput}><label htmlFor="pattern-answer">{copy.pattern.question}</label><input id="pattern-answer" inputMode="numeric" value={patternAnswer} onChange={(event) => setPatternAnswer(event.target.value)} placeholder="?" /></div>{patternAnswer && <Feedback good={correct} text={correct ? copy.pattern.good : copy.pattern.bad} />}</SceneShell>;
  } else if (scene === 7) {
    disabled = contextAnswer !== 1;
    body = <SceneShell kicker={copy.context.eyebrow} title={copy.context.title} lead={copy.context.lead} visual={<PhotoStage scene={scene}><div className={styles.quoteOverlay}>{copy.context.phrases.map((phrase, i) => <blockquote key={phrase}><small>СЦЕНА {i + 1}</small>{phrase}</blockquote>)}</div></PhotoStage>}><Question question={copy.context.question} answers={copy.context.answers} selected={contextAnswer} correctIndex={1} good={copy.context.good} bad={copy.context.bad} onSelect={setContextAnswer} /></SceneShell>;
  } else if (scene === 8) {
    disabled = planAnswer !== 1;
    body = <SceneShell kicker={copy.plan.eyebrow} title={copy.plan.title} lead={copy.plan.lead} visual={<PhotoStage scene={scene}><div className={styles.planOverlay}><span>START</span><i /><i /><i /><strong>LAB</strong></div></PhotoStage>}><Question question={copy.plan.question} answers={copy.plan.answers} selected={planAnswer} correctIndex={1} good={copy.plan.good} bad={copy.plan.bad} onSelect={setPlanAnswer} /></SceneShell>;
  } else if (scene === 9) {
    disabled = transferAnswer !== 1;
    body = <SceneShell kicker={copy.transfer.eyebrow} title={copy.transfer.title} lead={copy.transfer.lead} visual={<PhotoStage scene={scene}><div className={styles.systemOverlay}>{copy.transfer.systems.map((system, i) => <article key={system}><small>СИСТЕМА {i === 0 ? 'A' : 'B'}</small><b>{i === 0 ? '22°' : 'AUTO'}</b><p>{system}</p></article>)}</div></PhotoStage>}><Question question={copy.transfer.question} answers={copy.transfer.answers} selected={transferAnswer} correctIndex={1} good={copy.transfer.good} bad={copy.transfer.bad} onSelect={setTransferAnswer} /></SceneShell>;
  } else if (scene === 10) {
    const ready = progress.journal.trim().length >= 12;
    disabled = !ready;
    label = copy.continue;
    body = <SceneShell kicker={copy.journal.eyebrow} title={copy.journal.title} lead={copy.journal.lead} visual={<PhotoStage scene={scene}><OverlayCard eyebrow="FIELD NOTES" title="Твоя гипотеза станет частью проекта M-01"><p>Фиксируй не определение из учебника, а собственный вывод после экспериментов.</p></OverlayCard></PhotoStage>}><div className={styles.journal}><label htmlFor="hybrid-journal">{copy.journal.prompt}</label><textarea id="hybrid-journal" maxLength={500} value={progress.journal} placeholder={copy.journal.placeholder} onChange={(event) => setProgress((current) => ({...current, journal: event.target.value}))} /><span>{progress.journal.length}/500</span></div></SceneShell>;
  } else {
    label = copy.unlock.finish;
    body = <SceneShell kicker={copy.unlock.eyebrow} title={copy.unlock.title} lead={copy.unlock.lead} visual={<PhotoStage scene={scene}><div className={styles.unlockOverlay}><small>ACCESS GRANTED</small><strong>PROJECT M-01</strong><span>{copy.unlock.badge}</span></div></PhotoStage>}><div className={styles.unlockList}><article><small>Журнал</small><b>{copy.unlock.journal}</b></article><article><small>Проект</small><b>{copy.unlock.project}</b></article><article><small>Доступ</small><b>{copy.unlock.open1}</b><p>{copy.unlock.open2}</p></article></div></SceneShell>;
  }

  const advance = () => {
    if (scene === sceneCount - 1) {
      setProgress((current) => ({...current, scene: 0, completed: true}));
      return;
    }
    setScene(scene + 1);
  };

  return (
    <main className={styles.root}>
      <Header scene={scene} locale={locale} onBack={() => setScene(scene - 1)} />
      {body}
      <Rail scene={scene} />
      <Action label={label} disabled={disabled} onClick={advance} />
      <button type="button" className={styles.help}>Помощь</button>
    </main>
  );
}
