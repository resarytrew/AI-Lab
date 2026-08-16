'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import styles from './technopark-entry-quest.module.css';
import {
  hasCoreAbilitySet,
  initialQuestProgress,
  progressPercent,
  restoreQuestProgress,
  toggleInList,
  type IntelligenceAbility,
  type QuestProgress,
} from '@/lib/technopark-entry';

type Locale = 'ru' | 'en';
type DeviceId = 'calculator' | 'chess' | 'vacuum' | 'voice' | 'llm';

type Copy = {
  quest: string;
  lab: string;
  back: string;
  next: string;
  continue: string;
  retry: string;
  language: string;
  scenes: {
    intro: {eyebrow: string; title: string; lead: string; note: string; action: string};
    machines: {eyebrow: string; title: string; lead: string; hint: string; devices: Record<DeviceId, string>; reveal: string};
    speed: {eyebrow: string; title: string; lead: string; question: string; yes: string; no: string; feedbackGood: string; feedbackBad: string};
    abilities: {eyebrow: string; title: string; lead: string; hint: string; names: Record<IntelligenceAbility, string>; reveal: string};
    narrow: {eyebrow: string; title: string; lead: string; question: string; a: string; b: string; c: string; feedbackGood: string; feedbackBad: string};
    rules: {eyebrow: string; title: string; lead: string; rule1: string; rule2: string; rule3: string; question: string; a: string; b: string; c: string; feedbackGood: string; feedbackBad: string};
    pattern: {eyebrow: string; title: string; lead: string; question: string; answer: string; feedbackGood: string; feedbackBad: string; reveal: string};
    context: {eyebrow: string; title: string; lead: string; phrase1: string; phrase2: string; question: string; a: string; b: string; c: string; feedbackGood: string; feedbackBad: string};
    plan: {eyebrow: string; title: string; lead: string; question: string; a: string; b: string; c: string; feedbackGood: string; feedbackBad: string};
    transfer: {eyebrow: string; title: string; lead: string; timer: string; adaptive: string; question: string; a: string; b: string; feedbackGood: string; feedbackBad: string};
    journal: {eyebrow: string; title: string; lead: string; prompt: string; placeholder: string; hint: string};
    unlock: {eyebrow: string; title: string; lead: string; badge: string; journal: string; project: string; status: string; open1: string; open2: string; finish: string};
  };
};

const ru: Copy = {
  quest: 'Квест 01 · Вход в Технопарк',
  lab: 'AI Lab · Технопарк',
  back: 'Назад',
  next: 'Дальше',
  continue: 'Продолжить исследование',
  retry: 'Попробуй ещё раз',
  language: 'EN',
  scenes: {
    intro: {
      eyebrow: 'Пропуск исследователя · день 1',
      title: 'Что делает машину умной?',
      lead: 'Сегодня ты впервые входишь в Технопарк AI Lab. Здесь не дают готовых определений — их проверяют экспериментами.',
      note: 'Твоя первая задача: выяснить, почему одни программы кажутся разумными, а другие — просто быстрыми инструментами.',
      action: 'Войти в Технопарк',
    },
    machines: {
      eyebrow: 'Зал наблюдений',
      title: 'Кого из них ты назовёшь умным?',
      lead: 'Правильного ответа пока нет. Отметь системы, которые лично тебе кажутся интеллектуальными.',
      hint: 'Выбери хотя бы одну. В конце квеста мы вернёмся к твоему решению.',
      devices: {calculator: 'Калькулятор', chess: 'Шахматная программа', vacuum: 'Робот-пылесос', voice: 'Голосовой помощник', llm: 'Языковая модель'},
      reveal: 'Интересно: ощущение «ума» возникает по разным причинам. Теперь проверим одну из них.',
    },
    speed: {
      eyebrow: 'Эксперимент 1 · Скорость',
      title: 'Быстрее — значит умнее?',
      lead: 'Калькулятор за долю секунды умножает 987 × 654. Большинству людей понадобится заметно больше времени.',
      question: 'Доказывает ли это само по себе, что калькулятор интеллектуальнее человека?',
      yes: 'Да. Он считает быстрее.',
      no: 'Нет. Скорость — ещё не интеллект.',
      feedbackGood: 'Верно. Быстрые вычисления — способность, но интеллект нельзя свести только к скорости.',
      feedbackBad: 'Скорость впечатляет, но калькулятор не поймёт просьбу, не поставит цель и не научится на новой ситуации. Попробуй отделить вычислительную мощность от интеллекта.',
    },
    abilities: {
      eyebrow: 'Эксперимент 2 · Способности',
      title: 'Из чего может складываться интеллект?',
      lead: 'Исследователи спорят о точном определении, но мы можем начать с наблюдаемых способностей. Выбери те, без которых «умная» система кажется тебе неполной.',
      hint: 'Собери минимум четыре способности. Здесь важнее аргумент, чем единственный правильный набор.',
      names: {knowledge: 'Накапливать и использовать знания', communication: 'Общаться с человеком', understanding: 'Учитывать смысл и контекст', learning: 'Учиться на опыте', reasoning: 'Делать выводы', planning: 'Ставить цель и планировать действия'},
      reveal: 'Первая рабочая гипотеза: интеллект похож не на один волшебный модуль, а на набор взаимодействующих механизмов.',
    },
    narrow: {
      eyebrow: 'Эксперимент 3 · Специализация',
      title: 'Чемпион, который ничего больше не умеет',
      lead: 'Представь программу, которая выигрывает у гроссмейстеров в шахматы, но не может заказать себе обед и не понимает вопрос «почему ты сделал этот ход?».',
      question: 'Какой вывод осторожнее всего сделать?',
      a: 'Она вообще не имеет отношения к ИИ.',
      b: 'Система может быть очень сильной в одной задаче и оставаться узкоспециализированной.',
      c: 'Раз она побеждает человека, она обладает всеми человеческими интеллектуальными способностями.',
      feedbackGood: 'Именно. Высокая компетентность в одной области не равна универсальному интеллекту.',
      feedbackBad: 'Сравни: шахматы система решает блестяще, но за пределами своей задачи почти беспомощна. Нам нужно различать силу в задаче и универсальность.',
    },
    rules: {
      eyebrow: 'Лаборатория правил',
      title: 'Можно ли запрограммировать ум заранее?',
      lead: 'Охранная система получает три правила:',
      rule1: 'ЕСЛИ дверь открыта ночью → включить тревогу',
      rule2: 'ЕСЛИ пропуск сотрудника действителен → открыть турникет',
      rule3: 'ЕСЛИ пожарная тревога → разблокировать выходы',
      question: 'Появился новый случай, которого нет ни в одном правиле. Что система гарантированно умеет сделать сама?',
      a: 'Надёжно придумать новое правило и понять его последствия.',
      b: 'Следовать известным правилам; для нового случая ей нужен новый механизм или новое правило.',
      c: 'Автоматически стать нейросетью.',
      feedbackGood: 'Да. Правила могут создавать очень полезное интеллектуальное поведение, но сами по себе не означают способность обучаться.',
      feedbackBad: 'Не приписывай системе способности, которых мы в неё не заложили. Набор правил выполняет именно те правила, которые получил.',
    },
    pattern: {
      eyebrow: 'Коридор обучения',
      title: 'А если правило не сообщать?',
      lead: 'Тебе показывают только примеры: 2 → 4, 3 → 6, 5 → 10.',
      question: 'Какой результат ты предскажешь для 8?',
      answer: '16',
      feedbackGood: 'Ты не запомнил готовый ответ — ты нашёл закономерность и применил её к новому примеру.',
      feedbackBad: 'Посмотри, что общего у всех трёх примеров. Как вход превращается в выход?',
      reveal: 'Следующий большой вопрос Технопарка: можно ли научить компьютер находить такие закономерности по данным самостоятельно?',
    },
    context: {
      eyebrow: 'Лаборатория смысла',
      title: 'Одно слово — два разных мира',
      lead: 'Сравни две фразы:',
      phrase1: 'На стройке высокий кран поднял балку.',
      phrase2: 'На кухне кран начал протекать.',
      question: 'Что нужно системе, чтобы понять, о каком «кране» идёт речь?',
      a: 'Только быстрее прочитать слово «кран».',
      b: 'Учитывать окружающие слова и контекст.',
      c: 'Всегда выбирать самое частое значение.',
      feedbackGood: 'Да. Для языка важно не только увидеть символы, но и связать их с контекстом. Позже мы вернёмся к этой проблеме в Language Lab.',
      feedbackBad: 'Само слово одинаковое. Различие появляется из окружения и смысла всей фразы.',
    },
    plan: {
      eyebrow: 'Зал действий',
      title: 'Ум — это ещё и путь к цели',
      lead: 'Сервисный робот стоит у входа. Ему нужно попасть в лабораторию, но прямой коридор перекрыт. Он может: идти вперёд, повернуть, проверить проход.',
      question: 'Какое поведение больше похоже на планирование?',
      a: 'Повторять «вперёд» до столкновения.',
      b: 'Сначала проверить доступные пути, выбрать маршрут и менять его, если появится препятствие.',
      c: 'Стоять на месте, пока человек не проведёт его за руку.',
      feedbackGood: 'Верно. Цель, возможные действия, состояние мира и выбор последовательности шагов — основа планирования.',
      feedbackBad: 'План — это не одно действие. Он связывает цель с последовательностью шагов и должен учитывать состояние среды.',
    },
    transfer: {
      eyebrow: 'Проверка переноса',
      title: 'Где здесь появилось обучение?',
      lead: 'Перед тобой два термостата.',
      timer: 'Термостат A каждый день в 07:00 включает 22 °C. Его расписание заранее записал человек.',
      adaptive: 'Термостат B наблюдает, когда жильцы просыпаются, и постепенно подстраивает расписание под их привычки.',
      question: 'Какой из них демонстрирует обучение по опыту?',
      a: 'Термостат A',
      b: 'Термостат B',
      feedbackGood: 'Да. B изменяет своё поведение на основе накопленных наблюдений. Это уже важный признак обучающейся системы.',
      feedbackBad: 'Расписание A может быть полезным и сложным, но оно не меняется из опыта. Посмотри, какая система адаптирует своё поведение.',
    },
    journal: {
      eyebrow: 'Журнал исследователя · запись 01',
      title: 'Сформулируй свою гипотезу',
      lead: 'Теперь не повторяй определение. Напиши своими словами, что отличает просто мощный вычислитель от системы, которую мы готовы назвать интеллектуальной.',
      prompt: 'Моя гипотеза об интеллекте машины:',
      placeholder: 'Например: «Машина кажется умной не потому, что она просто быстрая, а потому что...»',
      hint: 'Достаточно 1–3 предложений. Мы сохраним эту запись и позже сравним её с твоим пониманием после MyGPT.',
    },
    unlock: {
      eyebrow: 'Квест завершён',
      title: 'Первый допуск получен',
      lead: 'Ты не получил окончательное определение интеллекта — и это нормально. Зато у тебя появилась рабочая модель для дальнейших исследований.',
      badge: 'Допуск 01 · Исследователь интеллекта',
      journal: 'Запись в журнале сохранена',
      project: 'Проект M-01 активирован',
      status: 'Исследовательское ядро · online',
      open1: 'Открывается: Архив данных',
      open2: 'Открывается: Лаборатория правил',
      finish: 'Вернуться ко входу',
    },
  },
};

const en: Copy = {
  ...ru,
  quest: 'Quest 01 · Enter the Technopark', lab: 'AI Lab · Technopark', back: 'Back', next: 'Next', continue: 'Continue the investigation', retry: 'Try again', language: 'RU',
  scenes: {
    intro: {eyebrow: 'Research pass · day 1', title: 'What makes a machine intelligent?', lead: 'Today you enter the AI Lab Technopark for the first time. Here, definitions are not handed to you — they are tested through experiments.', note: 'Your first mission: find out why some programs feel intelligent while others are merely fast tools.', action: 'Enter the Technopark'},
    machines: {eyebrow: 'Observation Hall', title: 'Which of these would you call intelligent?', lead: 'There is no official answer yet. Mark the systems that feel intelligent to you personally.', hint: 'Choose at least one. We will return to your decision at the end.', devices: {calculator: 'Calculator', chess: 'Chess engine', vacuum: 'Robot vacuum', voice: 'Voice assistant', llm: 'Language model'}, reveal: 'Interesting: the feeling of “intelligence” can come from very different abilities. Let us test one of them.'},
    speed: {eyebrow: 'Experiment 1 · Speed', title: 'Does faster mean smarter?', lead: 'A calculator multiplies 987 × 654 in a fraction of a second. Most humans need much longer.', question: 'Does that alone prove the calculator is more intelligent than a human?', yes: 'Yes. It calculates faster.', no: 'No. Speed alone is not intelligence.', feedbackGood: 'Right. Fast computation is a capability, but intelligence cannot be reduced to speed alone.', feedbackBad: 'Speed is impressive, but the calculator cannot understand a request, set a goal, or learn from a new situation. Separate computational power from intelligence.'},
    abilities: {eyebrow: 'Experiment 2 · Abilities', title: 'What might intelligence be made of?', lead: 'Researchers still debate the exact definition, but we can start from observable abilities. Pick the ones that seem essential to an intelligent system.', hint: 'Build a set of at least four. The argument matters more than one official checklist.', names: {knowledge: 'Accumulate and use knowledge', communication: 'Communicate with people', understanding: 'Use meaning and context', learning: 'Learn from experience', reasoning: 'Draw conclusions', planning: 'Set goals and plan actions'}, reveal: 'Our first working hypothesis: intelligence may be less like one magic module and more like a collection of interacting mechanisms.'},
    narrow: {eyebrow: 'Experiment 3 · Specialization', title: 'A champion that can do nothing else', lead: 'Imagine a system that beats grandmasters at chess but cannot order lunch or explain why it made a move.', question: 'What is the safest conclusion?', a: 'It has nothing to do with AI.', b: 'A system can be extremely strong at one task and still remain narrow.', c: 'If it beats a human, it must have every human intellectual ability.', feedbackGood: 'Exactly. Extreme competence in one domain does not equal general intelligence.', feedbackBad: 'Compare the two facts: brilliant at chess, almost helpless outside chess. Distinguish task strength from generality.'},
    rules: {eyebrow: 'Rule Lab', title: 'Can intelligence be programmed in advance?', lead: 'A security system receives three rules:', rule1: 'IF a door opens at night → trigger alarm', rule2: 'IF an employee badge is valid → open gate', rule3: 'IF fire alarm → unlock exits', question: 'A completely new situation appears. What can this rule system reliably do by itself?', a: 'Invent a correct new rule and understand all consequences.', b: 'Follow known rules; a new case needs a new rule or a different mechanism.', c: 'Automatically turn itself into a neural network.', feedbackGood: 'Yes. Rules can create useful intelligent behavior, but a rule system does not automatically learn.', feedbackBad: 'Do not give the system abilities we never built into it. A rule engine executes the rules it has.'},
    pattern: {eyebrow: 'Learning Corridor', title: 'What if nobody tells you the rule?', lead: 'You see only examples: 2 → 4, 3 → 6, 5 → 10.', question: 'What would you predict for 8?', answer: '16', feedbackGood: 'You did not memorize the answer — you found a pattern and transferred it to a new example.', feedbackBad: 'Look for what stays the same across all three examples. How does input become output?', reveal: 'The next major Technopark question is whether a computer can discover patterns from data by itself.'},
    context: {eyebrow: 'Meaning Lab', title: 'One word, two different worlds', lead: 'Compare two sentences:', phrase1: 'The construction crane lifted a beam.', phrase2: 'The kitchen tap started leaking.', question: 'What does a language system need to determine the intended meaning?', a: 'Only read the ambiguous word faster.', b: 'Use surrounding words and context.', c: 'Always choose the most common meaning.', feedbackGood: 'Yes. Language requires more than symbols: context changes meaning. We will return to this in the Language Lab.', feedbackBad: 'The ambiguous token alone is not enough. The surrounding sentence carries the distinction.'},
    plan: {eyebrow: 'Action Hall', title: 'Intelligence can also mean finding a path to a goal', lead: 'A service robot must reach a lab, but the direct corridor is blocked. It can move, turn, and inspect passages.', question: 'Which behavior looks most like planning?', a: 'Repeat “forward” until it crashes.', b: 'Inspect options, choose a route, and revise it when the environment changes.', c: 'Wait until a human carries it to the lab.', feedbackGood: 'Right. A goal, possible actions, a world state, and a sequence of choices are the ingredients of planning.', feedbackBad: 'A plan is more than one action. It connects a goal to a sequence of steps and reacts to the state of the world.'},
    transfer: {eyebrow: 'Transfer Check', title: 'Where did learning actually happen?', lead: 'Two thermostats are on the bench.', timer: 'Thermostat A always sets 22 °C at 07:00. A human wrote the schedule.', adaptive: 'Thermostat B observes when residents wake up and gradually adapts its schedule.', question: 'Which one demonstrates learning from experience?', a: 'Thermostat A', b: 'Thermostat B', feedbackGood: 'Yes. B changes its behavior from accumulated observations — a key property of a learning system.', feedbackBad: 'A can be useful and complex, but its behavior does not change from experience. Look for adaptation.'},
    journal: {eyebrow: 'Research Journal · entry 01', title: 'Write your own hypothesis', lead: 'Do not repeat a definition. In your own words, explain what separates a powerful calculator from a system we might call intelligent.', prompt: 'My hypothesis about machine intelligence:', placeholder: 'For example: “A machine seems intelligent not just because it is fast, but because...”', hint: '1–3 sentences are enough. We will preserve this entry and compare it with your thinking after MyGPT.'},
    unlock: {eyebrow: 'Quest complete', title: 'Your first research clearance is active', lead: 'You did not receive a final definition of intelligence — that is the point. You now have a working model to test in future labs.', badge: 'Clearance 01 · Intelligence Researcher', journal: 'Journal entry saved', project: 'Project M-01 activated', status: 'Research core · online', open1: 'Unlocked next: Data Archive', open2: 'Unlocked next: Rule Lab', finish: 'Return to entrance'},
  },
};

const storageKey = 'ai-lab:quest:technopark-entry:v1';

function MachineIcon({type}: {type: DeviceId}) {
  const label = type === 'calculator' ? '±' : type === 'chess' ? '♞' : type === 'vacuum' ? '◉' : type === 'voice' ? '⌁' : 'Aa';
  return <span className={styles.machineIcon} aria-hidden="true">{label}</span>;
}

function ChoiceButton({selected, children, onClick}: {selected?: boolean; children: React.ReactNode; onClick: () => void}) {
  return <button type="button" className={`${styles.choice} ${selected ? styles.choiceSelected : ''}`} onClick={onClick}>{children}</button>;
}

function Feedback({good, children}: {good: boolean; children: React.ReactNode}) {
  return <div className={`${styles.feedback} ${good ? styles.feedbackGood : styles.feedbackTry}`}>{good ? '✓' : '↺'}<span>{children}</span></div>;
}

function TechnoparkArt() {
  return (
    <div className={styles.parkArt} aria-hidden="true">
      <div className={styles.parkMoon} />
      <div className={styles.parkTower}><span>AI</span></div>
      <div className={`${styles.parkBuilding} ${styles.parkBuildingLeft}`}><i /><i /><i /></div>
      <div className={`${styles.parkBuilding} ${styles.parkBuildingRight}`}><i /><i /></div>
      <div className={styles.parkBridge} />
      <div className={styles.parkPath} />
      <div className={styles.parkGlowOne} />
      <div className={styles.parkGlowTwo} />
    </div>
  );
}

export function TechnoparkEntryQuest({locale}: {locale: string}) {
  const activeLocale: Locale = locale === 'en' ? 'en' : 'ru';
  const copy = activeLocale === 'ru' ? ru : en;
  const [progress, setProgress] = useState<QuestProgress>(initialQuestProgress);
  const [hydrated, setHydrated] = useState(false);
  const [speedAnswer, setSpeedAnswer] = useState<'yes' | 'no' | null>(null);
  const [narrowAnswer, setNarrowAnswer] = useState<string | null>(null);
  const [ruleAnswer, setRuleAnswer] = useState<string | null>(null);
  const [patternAnswer, setPatternAnswer] = useState('');
  const [contextAnswer, setContextAnswer] = useState<string | null>(null);
  const [planAnswer, setPlanAnswer] = useState<string | null>(null);
  const [transferAnswer, setTransferAnswer] = useState<string | null>(null);

  useEffect(() => {
    setProgress(restoreQuestProgress(window.localStorage.getItem(storageKey)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [hydrated, progress]);

  const scene = progress.scene;
  const setScene = (value: number) => setProgress((current) => ({...current, scene: Math.max(0, Math.min(11, value))}));
  const next = () => setScene(scene + 1);
  const back = () => setScene(scene - 1);
  const toggleSystem = (id: DeviceId) => setProgress((current) => ({...current, smartSystems: toggleInList(current.smartSystems, id)}));
  const toggleAbility = (ability: IntelligenceAbility) => setProgress((current) => ({...current, abilities: toggleInList(current.abilities, ability)}));
  const targetLocale = activeLocale === 'ru' ? 'en' : 'ru';

  const sceneBody = (() => {
    if (scene === 0) {
      const t = copy.scenes.intro;
      return <section className={`${styles.scene} ${styles.introScene}`}><div className={styles.introCopy}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.missionNote}><b>01</b><span>{t.note}</span></div><button className={styles.primary} type="button" onClick={next}>{t.action}<span>→</span></button></div><TechnoparkArt /></section>;
    }

    if (scene === 1) {
      const t = copy.scenes.machines;
      const devices: DeviceId[] = ['calculator', 'chess', 'vacuum', 'voice', 'llm'];
      return <section className={styles.scene}><div className={styles.centerHead}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p></div><div className={styles.machineGrid}>{devices.map((id) => <button key={id} type="button" aria-pressed={progress.smartSystems.includes(id)} className={`${styles.machineCard} ${progress.smartSystems.includes(id) ? styles.machineCardSelected : ''}`} onClick={() => toggleSystem(id)}><MachineIcon type={id} /><strong>{t.devices[id]}</strong><span>{progress.smartSystems.includes(id) ? '✓' : '+'}</span></button>)}</div><p className={styles.microcopy}>{progress.smartSystems.length ? t.reveal : t.hint}</p><div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!progress.smartSystems.length} onClick={next}>{copy.next}<span>→</span></button></div></section>;
    }

    if (scene === 2) {
      const t = copy.scenes.speed;
      const correct = speedAnswer === 'no';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.numberRace}><div><small>human</small><strong>987 × 654</strong><span>thinking…</span></div><div className={styles.vs}>VS</div><div><small>calculator</small><strong>645 498</strong><span>0.001 s</span></div></div></div><div className={styles.questionCard}><h2>{t.question}</h2><ChoiceButton selected={speedAnswer === 'yes'} onClick={() => setSpeedAnswer('yes')}>{t.yes}</ChoiceButton><ChoiceButton selected={speedAnswer === 'no'} onClick={() => setSpeedAnswer('no')}>{t.no}</ChoiceButton>{speedAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 3) {
      const t = copy.scenes.abilities;
      const abilities = Object.keys(t.names) as IntelligenceAbility[];
      const ready = hasCoreAbilitySet(progress.abilities);
      return <section className={styles.scene}><div className={styles.centerHead}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p></div><div className={styles.abilityOrbit}><div className={styles.orbitCenter}><strong>?</strong><span>intelligence</span></div>{abilities.map((ability, index) => <button key={ability} type="button" aria-pressed={progress.abilities.includes(ability)} className={`${styles.abilityChip} ${progress.abilities.includes(ability) ? styles.abilityChipSelected : ''}`} style={{'--i': index} as React.CSSProperties} onClick={() => toggleAbility(ability)}>{t.names[ability]}</button>)}</div><p className={styles.microcopy}>{ready ? t.reveal : `${t.hint} · ${progress.abilities.length}/4`}</p><div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!ready} onClick={next}>{copy.next}<span>→</span></button></div></section>;
    }

    if (scene === 4) {
      const t = copy.scenes.narrow;
      const correct = narrowAnswer === 'b';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.specialistPanel}><div className={styles.chessBoard}>♜ ♞ ♝<br />♟ ♟ ♟<br />· · ♔</div><div><strong>CHESS-01</strong><span>rating: superhuman</span><span>outside task: unknown</span></div></div></div><div className={styles.questionCard}><h2>{t.question}</h2>{(['a', 'b', 'c'] as const).map((id) => <ChoiceButton key={id} selected={narrowAnswer === id} onClick={() => setNarrowAnswer(id)}>{t[id]}</ChoiceButton>)}{narrowAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 5) {
      const t = copy.scenes.rules;
      const correct = ruleAnswer === 'b';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.ruleStack}><code>{t.rule1}</code><code>{t.rule2}</code><code>{t.rule3}</code><div className={styles.unknownRule}>?</div></div></div><div className={styles.questionCard}><h2>{t.question}</h2>{(['a', 'b', 'c'] as const).map((id) => <ChoiceButton key={id} selected={ruleAnswer === id} onClick={() => setRuleAnswer(id)}>{t[id]}</ChoiceButton>)}{ruleAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 6) {
      const t = copy.scenes.pattern;
      const correct = patternAnswer.trim() === t.answer;
      return <section className={`${styles.scene} ${styles.patternScene}`}><div className={styles.centerHead}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p></div><div className={styles.patternRow}><span>2 <b>→</b> 4</span><span>3 <b>→</b> 6</span><span>5 <b>→</b> 10</span><span className={styles.patternQuestion}>8 <b>→</b> <input aria-label={t.question} inputMode="numeric" value={patternAnswer} onChange={(event) => setPatternAnswer(event.target.value)} /></span></div>{patternAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}{correct && <div className={styles.discoveryCard}><span>DISCOVERY</span><p>{t.reveal}</p></div>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></section>;
    }

    if (scene === 7) {
      const t = copy.scenes.context;
      const correct = contextAnswer === 'b';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.contextCards}><blockquote>{t.phrase1}</blockquote><blockquote>{t.phrase2}</blockquote></div></div><div className={styles.questionCard}><h2>{t.question}</h2>{(['a', 'b', 'c'] as const).map((id) => <ChoiceButton key={id} selected={contextAnswer === id} onClick={() => setContextAnswer(id)}>{t[id]}</ChoiceButton>)}{contextAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 8) {
      const t = copy.scenes.plan;
      const correct = planAnswer === 'b';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.mapMini}><span className={styles.robotDot}>R</span><span className={styles.goalDot}>LAB</span><i className={styles.wallOne} /><i className={styles.wallTwo} /><svg viewBox="0 0 400 220" aria-hidden="true"><path d="M65 165 C120 130 120 55 200 65 S280 165 335 75" /></svg></div></div><div className={styles.questionCard}><h2>{t.question}</h2>{(['a', 'b', 'c'] as const).map((id) => <ChoiceButton key={id} selected={planAnswer === id} onClick={() => setPlanAnswer(id)}>{t[id]}</ChoiceButton>)}{planAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 9) {
      const t = copy.scenes.transfer;
      const correct = transferAnswer === 'b';
      return <section className={`${styles.scene} ${styles.twoColumn}`}><div><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.thermostats}><article><b>A</b><span>07:00 → 22°</span><p>{t.timer}</p></article><article><b>B</b><span>observations → adaptation</span><p>{t.adaptive}</p></article></div></div><div className={styles.questionCard}><h2>{t.question}</h2><ChoiceButton selected={transferAnswer === 'a'} onClick={() => setTransferAnswer('a')}>{t.a}</ChoiceButton><ChoiceButton selected={transferAnswer === 'b'} onClick={() => setTransferAnswer('b')}>{t.b}</ChoiceButton>{transferAnswer && <Feedback good={correct}>{correct ? t.feedbackGood : t.feedbackBad}</Feedback>}<div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!correct} onClick={next}>{copy.next}<span>→</span></button></div></div></section>;
    }

    if (scene === 10) {
      const t = copy.scenes.journal;
      const ready = progress.journal.trim().length >= 12;
      return <section className={`${styles.scene} ${styles.journalScene}`}><div className={styles.journalPaper}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><label htmlFor="research-journal">{t.prompt}</label><textarea id="research-journal" maxLength={500} value={progress.journal} placeholder={t.placeholder} onChange={(event) => setProgress((current) => ({...current, journal: event.target.value}))} /><div className={styles.journalMeta}><span>{t.hint}</span><b>{progress.journal.length}/500</b></div><div className={styles.bottomNav}><button type="button" className={styles.secondary} onClick={back}>{copy.back}</button><button type="button" className={styles.primary} disabled={!ready} onClick={next}>{copy.continue}<span>→</span></button></div></div><div className={styles.journalStamp}>AI LAB<br />ENTRY 01</div></section>;
    }

    const t = copy.scenes.unlock;
    return <section className={`${styles.scene} ${styles.unlockScene}`}><div className={styles.unlockHalo}><span>01</span></div><div className={styles.unlockCopy}><p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.lead}</p><div className={styles.badge}>{t.badge}</div><div className={styles.unlockGrid}><article><small>JOURNAL</small><strong>{t.journal}</strong><p>“{progress.journal}”</p></article><article><small>MYAI · M-01</small><strong>{t.project}</strong><p>{t.status}</p></article><article><small>NEXT</small><strong>{t.open1}</strong><p>{t.open2}</p></article></div><button type="button" className={styles.primary} onClick={() => setProgress((current) => ({...current, scene: 0, completed: true}))}>{t.finish}<span>↻</span></button></div></section>;
  })();

  return (
    <main className={styles.questRoot}>
      <header className={styles.questHeader}>
        <div className={styles.brandMark}><span>AI</span><b>LAB</b></div>
        <div className={styles.questMeta}><small>{copy.lab}</small><strong>{copy.quest}</strong></div>
        <div className={styles.progressWrap} aria-label={`${progressPercent(scene)}%`}><span>{String(scene + 1).padStart(2, '0')}</span><div><i style={{width: `${progressPercent(scene)}%`}} /></div><span>12</span></div>
        <Link className={styles.localeButton} href={`/${targetLocale}/technopark/entry`}>{copy.language}</Link>
      </header>
      {sceneBody}
      {scene > 0 && scene < 11 && <button type="button" className={styles.cornerBack} onClick={back} aria-label={copy.back}>←</button>}
    </main>
  );
}
