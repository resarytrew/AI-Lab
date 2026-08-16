import type {IntelligenceAbility} from '@/lib/technopark-entry';

export type QuestLocale = 'ru' | 'en';
export type DeviceId = 'calculator' | 'chess' | 'vacuum' | 'voice' | 'llm';

type Copy = {
  quest: string;
  lab: string;
  back: string;
  next: string;
  continue: string;
  language: string;
  intro: {eyebrow: string; title: string; lead: string; note: string; action: string};
  machines: {eyebrow: string; title: string; lead: string; hint: string; devices: Record<DeviceId, string>; reveal: string};
  speed: {eyebrow: string; title: string; lead: string; question: string; answers: [string, string]; good: string; bad: string};
  abilities: {eyebrow: string; title: string; lead: string; hint: string; names: Record<IntelligenceAbility, string>; reveal: string};
  narrow: {eyebrow: string; title: string; lead: string; question: string; answers: [string, string, string]; good: string; bad: string};
  rules: {eyebrow: string; title: string; lead: string; rules: [string, string, string]; question: string; answers: [string, string, string]; good: string; bad: string};
  pattern: {eyebrow: string; title: string; lead: string; question: string; answer: string; good: string; bad: string; reveal: string};
  context: {eyebrow: string; title: string; lead: string; phrases: [string, string]; question: string; answers: [string, string, string]; good: string; bad: string};
  plan: {eyebrow: string; title: string; lead: string; question: string; answers: [string, string, string]; good: string; bad: string};
  transfer: {eyebrow: string; title: string; lead: string; systems: [string, string]; question: string; answers: [string, string]; good: string; bad: string};
  journal: {eyebrow: string; title: string; lead: string; prompt: string; placeholder: string; hint: string};
  unlock: {eyebrow: string; title: string; lead: string; badge: string; journal: string; project: string; status: string; open1: string; open2: string; finish: string};
};

const ru: Copy = {
  quest: 'Квест 01 · Вход в Технопарк',
  lab: 'AI Lab · Технопарк',
  back: 'Назад',
  next: 'Дальше',
  continue: 'Продолжить исследование',
  language: 'EN',
  intro: {
    eyebrow: 'Пропуск исследователя · день 1',
    title: 'Что делает машину умной?',
    lead: 'Сегодня ты впервые входишь в Технопарк AI Lab. Здесь не дают готовых определений — их проверяют экспериментами.',
    note: 'Первая задача: выяснить, почему одни программы кажутся разумными, а другие — просто быстрыми инструментами.',
    action: 'Войти в Технопарк',
  },
  machines: {
    eyebrow: 'Зал наблюдений',
    title: 'Кого из них ты назовёшь умным?',
    lead: 'Правильного ответа пока нет. Отметь системы, которые лично тебе кажутся интеллектуальными.',
    hint: 'Выбери хотя бы одну. В конце квеста мы вернёмся к твоему решению.',
    devices: {calculator: 'Калькулятор', chess: 'Шахматная программа', vacuum: 'Робот-пылесос', voice: 'Голосовой помощник', llm: 'Языковая модель'},
    reveal: 'Ощущение «ума» возникает по разным причинам. Теперь проверим одну из них.',
  },
  speed: {
    eyebrow: 'Эксперимент 1 · Скорость',
    title: 'Быстрее — значит умнее?',
    lead: 'Калькулятор за долю секунды умножает 987 × 654. Большинству людей понадобится заметно больше времени.',
    question: 'Доказывает ли это само по себе, что калькулятор интеллектуальнее человека?',
    answers: ['Да. Он считает быстрее.', 'Нет. Скорость — ещё не интеллект.'],
    good: 'Верно. Быстрые вычисления — способность, но интеллект нельзя свести только к скорости.',
    bad: 'Калькулятор быстр, но он не поймёт новую цель и не научится на новой ситуации. Отдели вычислительную мощность от интеллекта.',
  },
  abilities: {
    eyebrow: 'Эксперимент 2 · Способности',
    title: 'Из чего может складываться интеллект?',
    lead: 'Исследователи спорят о точном определении. Начнём с наблюдаемых способностей — собери рабочую гипотезу.',
    hint: 'Выбери минимум четыре. Здесь важнее аргумент, чем единственный официальный список.',
    names: {knowledge: 'Накапливать и использовать знания', communication: 'Общаться с человеком', understanding: 'Учитывать смысл и контекст', learning: 'Учиться на опыте', reasoning: 'Делать выводы', planning: 'Ставить цель и планировать действия'},
    reveal: 'Рабочая гипотеза: интеллект похож не на один волшебный модуль, а на набор взаимодействующих механизмов.',
  },
  narrow: {
    eyebrow: 'Эксперимент 3 · Специализация',
    title: 'Чемпион, который ничего больше не умеет',
    lead: 'Программа выигрывает у гроссмейстеров в шахматы, но не может заказать обед и не понимает вопрос «почему ты сделал этот ход?».',
    question: 'Какой вывод осторожнее всего сделать?',
    answers: ['Она вообще не имеет отношения к ИИ.', 'Система может быть очень сильной в одной задаче и оставаться узкоспециализированной.', 'Раз она побеждает человека, у неё есть все человеческие интеллектуальные способности.'],
    good: 'Именно. Высокая компетентность в одной области не равна универсальному интеллекту.',
    bad: 'Шахматы система решает блестяще, но за пределами своей задачи почти беспомощна. Различай силу в задаче и универсальность.',
  },
  rules: {
    eyebrow: 'Лаборатория правил',
    title: 'Можно ли запрограммировать ум заранее?',
    lead: 'Охранная система получает три правила:',
    rules: ['ЕСЛИ дверь открыта ночью → включить тревогу', 'ЕСЛИ пропуск сотрудника действителен → открыть турникет', 'ЕСЛИ пожарная тревога → разблокировать выходы'],
    question: 'Появился новый случай, которого нет ни в одном правиле. Что система гарантированно умеет сделать сама?',
    answers: ['Надёжно придумать новое правило и понять все последствия.', 'Следовать известным правилам; для нового случая нужен новый механизм или новое правило.', 'Автоматически стать нейросетью.'],
    good: 'Да. Правила могут создавать полезное интеллектуальное поведение, но сами по себе не означают способность обучаться.',
    bad: 'Не приписывай системе способности, которых мы в неё не заложили. Набор правил выполняет именно известные ему правила.',
  },
  pattern: {
    eyebrow: 'Коридор обучения',
    title: 'А если правило не сообщать?',
    lead: 'Тебе показывают только примеры: 2 → 4, 3 → 6, 5 → 10.',
    question: 'Какой результат ты предскажешь для 8?',
    answer: '16',
    good: 'Ты не запомнил готовый ответ — ты нашёл закономерность и применил её к новому примеру.',
    bad: 'Посмотри, что общего у трёх примеров. Как вход превращается в выход?',
    reveal: 'Следующий большой вопрос Технопарка: можно ли научить компьютер находить такие закономерности по данным самостоятельно?',
  },
  context: {
    eyebrow: 'Лаборатория смысла',
    title: 'Одно слово — два разных мира',
    lead: 'Сравни две фразы:',
    phrases: ['На стройке высокий кран поднял балку.', 'На кухне кран начал протекать.'],
    question: 'Что нужно системе, чтобы понять, о каком «кране» идёт речь?',
    answers: ['Только быстрее прочитать слово «кран».', 'Учитывать окружающие слова и контекст.', 'Всегда выбирать самое частое значение.'],
    good: 'Да. Для языка важно не только увидеть символы, но и связать их с контекстом. Позже мы вернёмся к этой проблеме в Language Lab.',
    bad: 'Само слово одинаковое. Различие появляется из окружения и смысла всей фразы.',
  },
  plan: {
    eyebrow: 'Зал действий',
    title: 'Ум — это ещё и путь к цели',
    lead: 'Сервисный робот должен попасть в лабораторию, но прямой коридор перекрыт. Он умеет двигаться, поворачивать и проверять проход.',
    question: 'Какое поведение больше похоже на планирование?',
    answers: ['Повторять «вперёд» до столкновения.', 'Проверить пути, выбрать маршрут и менять его при новом препятствии.', 'Стоять на месте, пока человек не проведёт его за руку.'],
    good: 'Верно. Цель, возможные действия, состояние мира и последовательность шагов — основа планирования.',
    bad: 'План — не одно действие. Он связывает цель с последовательностью шагов и учитывает состояние среды.',
  },
  transfer: {
    eyebrow: 'Проверка переноса',
    title: 'Где здесь появилось обучение?',
    lead: 'Перед тобой два термостата.',
    systems: ['A каждый день в 07:00 включает 22 °C. Расписание заранее записал человек.', 'B наблюдает, когда жильцы просыпаются, и постепенно подстраивает расписание под их привычки.'],
    question: 'Какой из них демонстрирует обучение по опыту?',
    answers: ['Термостат A', 'Термостат B'],
    good: 'Да. B изменяет поведение на основе накопленных наблюдений — это важный признак обучающейся системы.',
    bad: 'A может быть полезным и сложным, но его поведение не меняется из опыта. Ищи адаптацию.',
  },
  journal: {
    eyebrow: 'Журнал исследователя · запись 01',
    title: 'Сформулируй свою гипотезу',
    lead: 'Не повторяй определение. Напиши своими словами, что отличает мощный вычислитель от системы, которую мы готовы назвать интеллектуальной.',
    prompt: 'Моя гипотеза об интеллекте машины:',
    placeholder: 'Например: «Машина кажется умной не потому, что она просто быстрая, а потому что...»',
    hint: 'Достаточно 1–3 предложений. Позже сравним эту запись с твоим пониманием после MyGPT.',
  },
  unlock: {
    eyebrow: 'Квест завершён', title: 'Первый допуск получен',
    lead: 'Ты не получил окончательное определение интеллекта — и это нормально. Зато у тебя появилась рабочая модель для дальнейших исследований.',
    badge: 'Допуск 01 · Исследователь интеллекта', journal: 'Запись в журнале сохранена', project: 'Проект M-01 активирован', status: 'Исследовательское ядро · online', open1: 'Открывается: Архив данных', open2: 'Открывается: Лаборатория правил', finish: 'Вернуться ко входу',
  },
};

const en: Copy = {
  quest: 'Quest 01 · Enter the Technopark', lab: 'AI Lab · Technopark', back: 'Back', next: 'Next', continue: 'Continue the investigation', language: 'RU',
  intro: {eyebrow: 'Research pass · day 1', title: 'What makes a machine intelligent?', lead: 'Today you enter the AI Lab Technopark for the first time. Here, definitions are tested through experiments rather than handed to you.', note: 'Your first mission: find out why some programs feel intelligent while others are merely fast tools.', action: 'Enter the Technopark'},
  machines: {eyebrow: 'Observation Hall', title: 'Which of these would you call intelligent?', lead: 'There is no official answer yet. Mark the systems that feel intelligent to you personally.', hint: 'Choose at least one. We will return to your decision at the end.', devices: {calculator: 'Calculator', chess: 'Chess engine', vacuum: 'Robot vacuum', voice: 'Voice assistant', llm: 'Language model'}, reveal: 'The feeling of “intelligence” can come from very different abilities. Let us test one.'},
  speed: {eyebrow: 'Experiment 1 · Speed', title: 'Does faster mean smarter?', lead: 'A calculator multiplies 987 × 654 in a fraction of a second. Most humans need much longer.', question: 'Does that alone prove the calculator is more intelligent than a human?', answers: ['Yes. It calculates faster.', 'No. Speed alone is not intelligence.'], good: 'Right. Fast computation is a capability, but intelligence cannot be reduced to speed alone.', bad: 'The calculator is fast, but it cannot understand a new goal or learn from a new situation. Separate computational power from intelligence.'},
  abilities: {eyebrow: 'Experiment 2 · Abilities', title: 'What might intelligence be made of?', lead: 'Researchers still debate the exact definition. Start with observable abilities and build a working hypothesis.', hint: 'Choose at least four. The argument matters more than one official checklist.', names: {knowledge: 'Accumulate and use knowledge', communication: 'Communicate with people', understanding: 'Use meaning and context', learning: 'Learn from experience', reasoning: 'Draw conclusions', planning: 'Set goals and plan actions'}, reveal: 'Working hypothesis: intelligence may be less like one magic module and more like a set of interacting mechanisms.'},
  narrow: {eyebrow: 'Experiment 3 · Specialization', title: 'A champion that can do nothing else', lead: 'A system beats grandmasters at chess but cannot order lunch or explain why it made a move.', question: 'What is the safest conclusion?', answers: ['It has nothing to do with AI.', 'A system can be extremely strong at one task and still remain narrow.', 'If it beats a human, it must have every human intellectual ability.'], good: 'Exactly. Extreme competence in one domain does not equal general intelligence.', bad: 'It is brilliant at chess and almost helpless outside chess. Distinguish task strength from generality.'},
  rules: {eyebrow: 'Rule Lab', title: 'Can intelligence be programmed in advance?', lead: 'A security system receives three rules:', rules: ['IF a door opens at night → trigger alarm', 'IF an employee badge is valid → open gate', 'IF fire alarm → unlock exits'], question: 'A completely new situation appears. What can this rule system reliably do by itself?', answers: ['Invent a correct new rule and understand all consequences.', 'Follow known rules; a new case needs a new rule or a different mechanism.', 'Automatically turn itself into a neural network.'], good: 'Yes. Rules can create useful intelligent behavior, but a rule system does not automatically learn.', bad: 'Do not give the system abilities we never built into it. A rule engine executes the rules it has.'},
  pattern: {eyebrow: 'Learning Corridor', title: 'What if nobody tells you the rule?', lead: 'You see only examples: 2 → 4, 3 → 6, 5 → 10.', question: 'What would you predict for 8?', answer: '16', good: 'You did not memorize the answer — you found a pattern and transferred it to a new example.', bad: 'Look for what stays the same across all three examples. How does input become output?', reveal: 'The next big Technopark question: can a computer discover patterns from data by itself?'},
  context: {eyebrow: 'Meaning Lab', title: 'One word — two different worlds', lead: 'Compare two sentences:', phrases: ['A crane lifted a steel beam at the construction site.', 'A crane spread its wings above the marsh.'], question: 'What does a language system need to determine what “crane” means here?', answers: ['Only read the word “crane” faster.', 'Use surrounding words and context.', 'Always choose the most common meaning.'], good: 'Yes. Language requires more than symbols: context changes meaning. We will return to this in the Language Lab.', bad: 'The token is identical. The distinction comes from surrounding words and the meaning of the sentence.'},
  plan: {eyebrow: 'Action Hall', title: 'Intelligence can also mean finding a path to a goal', lead: 'A service robot must reach a lab, but the direct corridor is blocked. It can move, turn, and inspect passages.', question: 'Which behavior looks most like planning?', answers: ['Repeat “forward” until it crashes.', 'Inspect routes, choose one, and revise it when the environment changes.', 'Wait until a human carries it to the lab.'], good: 'Right. A goal, possible actions, a world state, and a sequence of choices are ingredients of planning.', bad: 'A plan is more than one action. It connects a goal to a sequence of steps and reacts to the state of the world.'},
  transfer: {eyebrow: 'Transfer Check', title: 'Where did learning actually happen?', lead: 'Two thermostats are on the bench.', systems: ['A always sets 22 °C at 07:00. A human wrote the schedule.', 'B observes when residents wake up and gradually adapts its schedule.'], question: 'Which one demonstrates learning from experience?', answers: ['Thermostat A', 'Thermostat B'], good: 'Yes. B changes its behavior from accumulated observations — a key property of a learning system.', bad: 'A can be useful and complex, but its behavior does not change from experience. Look for adaptation.'},
  journal: {eyebrow: 'Research Journal · entry 01', title: 'Write your own hypothesis', lead: 'Do not repeat a definition. Explain in your own words what separates a powerful calculator from a system we might call intelligent.', prompt: 'My hypothesis about machine intelligence:', placeholder: 'For example: “A machine seems intelligent not just because it is fast, but because...”', hint: '1–3 sentences are enough. We will compare this entry with your thinking after MyGPT.'},
  unlock: {eyebrow: 'Quest complete', title: 'Your first research clearance is active', lead: 'You did not receive a final definition of intelligence — that is the point. You now have a working model to test in future labs.', badge: 'Clearance 01 · Intelligence Researcher', journal: 'Journal entry saved', project: 'Project M-01 activated', status: 'Research core · online', open1: 'Unlocked next: Data Archive', open2: 'Unlocked next: Rule Lab', finish: 'Return to entrance'},
};

export function getTechnoparkEntryCopy(locale: string) {
  return locale === 'en' ? en : ru;
}
