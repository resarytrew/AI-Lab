'use client';

import Link from 'next/link';
import {useEffect, useState, type ReactNode} from 'react';
import styles from './technopark-entry-quest.module.css';
import {getDataArchiveCopy} from '@/content/quests/data-archive-copy';
import {
  DATA_ARCHIVE_SCENE_COUNT,
  initialDataArchiveProgress,
  restoreDataArchiveProgress,
  type DataArchiveProgress,
} from '@/lib/data-archive';

const storageKey = 'ai-lab:quest:data-archive:v1';
const steps = Array.from({length: DATA_ARCHIVE_SCENE_COUNT}, (_, index) => index + 1);

function Mark() {
  return (
    <div className={styles.mark} role="img" aria-label="AI Lab">
      <span>A</span>
      <small>LAB</small>
    </div>
  );
}

function Header({scene, locale, quest, language, onBack}: {scene: number; locale: string; quest: string; language: string; onBack: () => void}) {
  const targetLocale = locale === 'en' ? 'ru' : 'en';
  return (
    <header className={styles.chrome}>
      <div className={styles.chromeLeft}>
        <Mark />
        <button type="button" className={styles.backButton} onClick={onBack} disabled={scene === 0} aria-label="Назад">
          <span aria-hidden="true">←</span>
        </button>
      </div>
      <div className={styles.questPill}><span className={styles.lock} aria-hidden="true" /><span>{quest}</span></div>
      <div className={styles.chromeRight}>
        <Link className={styles.languageButton} href={`/${targetLocale}/technopark/archive`}>{language}</Link>
        <div className={styles.profilePill}><span>{locale === 'en' ? 'Researcher' : 'Исследователь'}</span><i aria-hidden="true">↗</i></div>
      </div>
    </header>
  );
}

function Rail({scene}: {scene: number}) {
  return (
    <aside className={styles.progressRail} aria-label={`Шаг ${scene + 1} из ${DATA_ARCHIVE_SCENE_COUNT}`}>
      <span className={styles.railArrow} aria-hidden="true">⌃</span>
      <div className={styles.railSteps}>
        {steps.map((step) => {
          const index = step - 1;
          return <span key={`archive-step-${step}`} className={`${styles.railStep} ${index === scene ? styles.railStepCurrent : ''} ${index < scene ? styles.railStepDone : ''}`}>{step}</span>;
        })}
      </div>
      <span className={styles.railArrow} aria-hidden="true">⌄</span>
    </aside>
  );
}

function Scene({kicker, title, lead, visual, children}: {kicker: string; title: string; lead: string; visual: ReactNode; children?: ReactNode}) {
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

function Feedback({good, children}: {good: boolean; children: ReactNode}) {
  return <div className={`${styles.feedback} ${good ? styles.feedbackGood : styles.feedbackBad}`} aria-live="polite"><b>{good ? 'Верно' : 'Попробуй ещё'}</b><span>{children}</span></div>;
}

function Question({question, answers, selected, correctIndex, good, bad, onSelect}: {question: string; answers: string[]; selected: number | null; correctIndex: number; good: string; bad: string; onSelect: (index: number) => void}) {
  const correct = selected === correctIndex;
  return (
    <div className={styles.questionPanel}>
      <h2>{question}</h2>
      <div className={styles.choiceList}>
        {answers.map((answer, index) => (
          <button key={answer} type="button" className={`${styles.choiceRow} ${selected === index ? styles.choiceRowSelected : ''}`} onClick={() => onSelect(index)}>
            <span className={styles.choiceMarker}>{String.fromCharCode(65 + index)}</span><span>{answer}</span>
          </button>
        ))}
      </div>
      {selected !== null && <Feedback good={correct}>{correct ? good : bad}</Feedback>}
    </div>
  );
}

function ArchiveArt() {
  return (
    <div className={styles.labSceneArt} aria-hidden="true">
      <div className={styles.labBackdrop} />
      <div className={styles.labWindow}><i /><i /><i /><i /></div>
      <div className={styles.labDesk} />
      <div className={styles.labMonitor}><div className={styles.monitorTopLine} /><div className={styles.monitorRows}><i /><i /><i /></div><div className={styles.monitorGraph}><i /><i /><i /><i /></div></div>
      <div className={styles.labKeyboard} />
      <div className={styles.labNotebook}>02</div>
      <div className={styles.labShelf}><i /><i /><i /></div>
      <div className={styles.labPerson}><div className={styles.personHead} /><div className={styles.personHair} /><div className={styles.personBody} /><div className={styles.personTablet} /></div>
    </div>
  );
}

export function DataArchiveQuest({locale}: {locale: string}) {
  const copy = getDataArchiveCopy(locale);
  const [progress, setProgress] = useState<DataArchiveProgress>(initialDataArchiveProgress);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    setProgress(restoreDataArchiveProgress(window.localStorage.getItem(storageKey)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [hydrated, progress]);

  const scene = progress.scene;
  const choose = (index: number) => setAnswers((current) => ({...current, [scene]: index}));
  const selected = answers[scene] ?? null;
  const setScene = (value: number) => setProgress((current) => ({...current, scene: Math.max(0, Math.min(DATA_ARCHIVE_SCENE_COUNT - 1, value))}));
  const back = () => setScene(scene - 1);
  const next = () => setScene(scene + 1);

  let body: ReactNode;
  let disabled = false;
  let label = scene === 0 ? copy.intro.action : copy.next;

  const questionScene = (section: typeof copy.raw, correctIndex: number, visual: ReactNode) => {
    disabled = selected !== correctIndex;
    return (
      <Scene kicker={section.kicker} title={section.title} lead={section.lead} visual={visual}>
        <Question question={section.question} answers={section.answers} selected={selected} correctIndex={correctIndex} good={section.good} bad={section.bad} onSelect={choose} />
      </Scene>
    );
  };

  if (scene === 0) {
    body = <Scene kicker={copy.intro.kicker} title={copy.intro.title} lead={copy.intro.lead} visual={<ArchiveArt />}><div className={styles.storyCard}><strong>{locale === 'en' ? 'Mission' : 'Миссия'}</strong><p>{locale === 'en' ? 'Restore meaning in the Archive: separate records, context and reusable knowledge.' : 'Восстанови смысл в Архиве: отдели записи, контекст и знания, которыми можно пользоваться.'}</p></div></Scene>;
  } else if (scene === 1) {
    body = questionScene(copy.raw, 0, <div className={styles.deviceWall}><div className={styles.deviceCard}><span className={styles.deviceSymbol}>23.4</span><span>число</span></div><div className={styles.deviceCard}><span className={styles.deviceSymbol}>IMG</span><span>фото</span></div><div className={styles.deviceCard}><span className={styles.deviceSymbol}>TXT</span><span>«дождь»</span></div><div className={styles.deviceCard}><span className={styles.deviceSymbol}>14:32</span><span>время</span></div></div>);
  } else if (scene === 2) {
    body = questionScene(copy.context, 0, <div className={styles.patternBoard}><span>42</span><span>°C ?</span><span>кабинет ?</span><span>баллы ?</span></div>);
  } else if (scene === 3) {
    body = questionScene(copy.information, 0, <div className={styles.rulesBoard}><div><b>01</b><code>36.9</code></div><div><b>02</b><code>кабинет 214 · 10:15 · 36.9 °C</code></div></div>);
  } else if (scene === 4) {
    body = questionScene(copy.knowledge, 1, <div className={styles.contextBoard}><blockquote><small>Факт</small><p>12:41 · 38 человек</p></blockquote><blockquote><small>Закономерность</small><p>После 12:30 очередь обычно растёт</p></blockquote></div>);
  } else if (scene === 5) {
    body = questionScene(copy.structure, 0, <div className={styles.thermostatBoard}><article><b>TABLE</b><div className={styles.thermostatDial}>|||</div><p>строки · колонки · поля</p></article><article><b>MEDIA</b><div className={styles.thermostatDial}>•••</div><p>текст · фото · звук</p></article></div>);
  } else if (scene === 6) {
    body = questionScene(copy.quality, 0, <div className={styles.rulesBoard}><div><b>✓</b><code>кот → «кот»</code></div><div><b>?</b><code>собака → «кот»</code></div><div><b>—</b><code>фото → без подписи</code></div><div><b>×2</b><code>дубликат записи</code></div></div>);
  } else if (scene === 7) {
    body = questionScene(copy.bias, 0, <div className={styles.specialistBoard}><div className={styles.specialistStats}><small>ВЫБОРКА</small><b>1000 наблюдений</b><span>только декабрь–февраль</span><span>только 06:00–10:00</span></div></div>);
  } else if (scene === 8) {
    body = questionScene(copy.numbers, 0, <div className={styles.patternBoard}><span>красный мяч</span><span>→</span><span>[242, 91, 46]</span><span>[x₁, x₂, …]</span></div>);
  } else if (scene === 9) {
    body = questionScene(copy.transfer, 1, <div className={styles.rulesBoard}><div><b>D</b><code>08:17 · pass 7142 · allow</code></div><div><b>I</b><code>вход сотрудника зафиксирован</code></div><div><b>K</b><code>по понедельникам пик 08:10–08:25</code></div></div>);
  } else if (scene === 10) {
    disabled = progress.journal.trim().length < 24;
    label = locale === 'en' ? 'Save entry' : 'Сохранить запись';
    body = <Scene kicker={copy.journal.kicker} title={copy.journal.title} lead={copy.journal.lead} visual={<div className={styles.journalPanel}><label htmlFor="archive-journal">{copy.journal.prompt}</label><textarea id="archive-journal" maxLength={600} value={progress.journal} placeholder={copy.journal.placeholder} onChange={(event) => setProgress((current) => ({...current, journal: event.target.value}))} /><div><span>{copy.journal.hint}</span><b>{progress.journal.length}/600</b></div></div>} />;
  } else {
    label = locale === 'en' ? 'Back to the Technopark' : 'Вернуться в Технопарк';
    body = <Scene kicker={copy.unlock.kicker} title={copy.unlock.title} lead={copy.unlock.lead} visual={<div className={styles.unlockBoard}><div className={styles.unlockSeal}>02</div><article><small>Журнал</small><b>{copy.unlock.journal}</b><p>«{progress.journal}»</p></article><article><small>Project M-01</small><b>{copy.unlock.project}</b><p>{copy.unlock.status}</p></article><article><small>Дальше</small><b>{copy.unlock.nextLab}</b><p>{locale === 'en' ? 'Data → information → knowledge unlocked' : 'Данные → информация → знания открыты'}</p></article></div>}><div className={styles.passBadge}>{copy.unlock.badge}</div></Scene>;
  }

  const handleNext = () => {
    if (scene === DATA_ARCHIVE_SCENE_COUNT - 1) {
      setProgress((current) => ({...current, completed: true}));
      window.location.assign('../entry/');
      return;
    }
    next();
  };

  return (
    <main className={styles.questRoot}>
      <Header scene={scene} locale={locale} quest={copy.quest} language={copy.language} onBack={back} />
      {body}
      <Rail scene={scene} />
      <div className={styles.bottomAction}><button type="button" disabled={disabled} onClick={handleNext}>{label}</button></div>
      <button type="button" className={styles.helpButton} title={locale === 'en' ? 'A hint appears when needed' : 'Подсказка появится в нужный момент'}>{copy.help}</button>
    </main>
  );
}
