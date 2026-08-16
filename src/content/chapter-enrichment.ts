import type {LocalizedText, StarterLessonId} from './learning-path';

const t = (ru: string, en: string): LocalizedText => ({ru, en});

export type VisualNode = {
  label: LocalizedText;
  detail: LocalizedText;
};

export type WorkedStep = {
  label: LocalizedText;
  expression?: string;
  explanation: LocalizedText;
};

export type MathSymbol = {
  symbol: string;
  meaning: LocalizedText;
};

export type MathDepth = {
  lead: LocalizedText;
  formula?: string;
  symbols: readonly MathSymbol[];
  byHand: readonly WorkedStep[];
  mechanism: LocalizedText;
};

export type EngineerDepth = {
  goal: LocalizedText;
  starterCode: string;
  checkpoints: readonly LocalizedText[];
  challenge: LocalizedText;
  expected: string;
  hint: LocalizedText;
  solution: string;
};

export type ResearchDepth = {
  question: LocalizedText;
  hypotheses: readonly LocalizedText[];
  variables: readonly LocalizedText[];
  procedure: readonly LocalizedText[];
  observations: readonly LocalizedText[];
  conclusion: LocalizedText;
};

export type ChapterEnrichment = {
  visualTitle: LocalizedText;
  visualCaption: LocalizedText;
  visualNodes: readonly VisualNode[];
  workedTitle: LocalizedText;
  workedScenario: LocalizedText;
  workedSteps: readonly WorkedStep[];
  math: MathDepth;
  engineer: EngineerDepth;
  researcher: ResearchDepth;
};

export const chapterEnrichment: Record<StarterLessonId, ChapterEnrichment> = {
  'smart-machine': {
    visualTitle: t('Не одна шкала «ума», а профиль способностей', 'Not one smartness score, but an ability profile'),
    visualCaption: t('Нажимай на способности и сравнивай, что именно умеет система.', 'Select abilities and compare what a system can actually do.'),
    visualNodes: [
      {label: t('Скорость', 'Speed'), detail: t('Быстро выполнить заранее известное вычисление. Само по себе это ещё не обучение или понимание.', 'Executing a known computation quickly is not the same as learning or understanding.')},
      {label: t('Контекст', 'Context'), detail: t('Учитывать ситуацию: место, цель, предыдущие события и новые ограничения.', 'Using situation, location, goals, prior events, and new constraints.')},
      {label: t('Обучение', 'Learning'), detail: t('Менять поведение после опыта, а не только исполнять неизменный набор инструкций.', 'Changing behavior after experience rather than only executing fixed instructions.')},
      {label: t('Рассуждение', 'Reasoning'), detail: t('Связывать известные факты и получать новый вывод.', 'Connecting known facts to obtain a new conclusion.')},
      {label: t('Планирование', 'Planning'), detail: t('Выбирать последовательность действий для достижения цели.', 'Choosing a sequence of actions to achieve a goal.')},
    ],
    workedTitle: t('Разбор: калькулятор против навигатора', 'Worked example: calculator vs navigator'),
    workedScenario: t('Обе системы считают быстро. Но одинаково ли они интеллектуальны?', 'Both systems compute quickly. Are they equally intelligent?'),
    workedSteps: [
      {label: t('Шаг 1 · фиксируем задачу', 'Step 1 · define the task'), explanation: t('Калькулятор получает выражение и применяет известный алгоритм. Навигатор получает цель, карту и текущую ситуацию.', 'A calculator receives an expression and applies a known algorithm. A navigator receives a goal, a map, and a changing situation.')},
      {label: t('Шаг 2 · создаём конфликт', 'Step 2 · create a conflict'), explanation: t('Перекрыли дорогу. Калькулятору нечего «переосмысливать», а навигатор должен перестроить путь.', 'A road closes. The calculator has nothing to reinterpret, while the navigator must re-plan the route.')},
      {label: t('Шаг 3 · называем способность', 'Step 3 · name the ability'), explanation: t('Разница не в количестве операций в секунду, а в использовании контекста и планировании.', 'The difference is not operations per second but context use and planning.')},
    ],
    math: {
      lead: t('Полезно описывать систему не одним числом, а вектором способностей.', 'It is useful to describe a system with a vector of abilities rather than one number.'),
      formula: 'a = [speed, context, learning, reasoning, planning]',
      symbols: [
        {symbol: 'a', meaning: t('профиль способностей системы', 'system ability profile')},
        {symbol: 'aᵢ', meaning: t('оценка отдельной наблюдаемой способности', 'score for one observable ability')},
      ],
      byHand: [
        {label: t('Калькулятор', 'Calculator'), expression: '[1.0, 0.0, 0.0, 0.1, 0.0]', explanation: t('Высокая скорость, но почти нет адаптации к контексту.', 'High speed, but almost no adaptation to context.')},
        {label: t('Навигатор', 'Navigator'), expression: '[0.8, 0.8, 0.2, 0.5, 0.9]', explanation: t('Профиль другой: скорость не максимальна, зато есть контекст и планирование.', 'A different profile: speed is not maximal, but context and planning are present.')},
      ],
      mechanism: t('Такой вектор не является «формулой интеллекта». Он дисциплинирует сравнение: мы обязаны назвать наблюдаемую способность и способ её проверить.', 'This vector is not a formula for intelligence. It disciplines comparison: we must name an observable ability and a way to test it.'),
    },
    engineer: {
      goal: t('Представь критерии как данные и напиши простой evaluator.', 'Represent the criteria as data and write a simple evaluator.'),
      starterCode: `criteria = {\n    "context": True,\n    "learning": False,\n    "planning": True,\n}\n\ndef count_abilities(criteria):\n    # допиши выражение\n    return ...`,
      checkpoints: [t('Словарь хранит имя способности и наблюдаемый результат.', 'The dictionary stores an ability name and observed result.'), t('Функция не решает, «умна» ли система вообще — она считает подтверждённые способности.', 'The function does not decide whether a system is generally smart; it counts demonstrated abilities.')],
      challenge: t('Какое выражение должно заменить `...`, чтобы посчитать значения `True`?', 'What expression should replace `...` to count the `True` values?'),
      expected: 'sum(criteria.values())',
      hint: t('В Python `True` ведёт себя как 1, а `False` как 0.', 'In Python, `True` behaves like 1 and `False` like 0.'),
      solution: 'return sum(criteria.values())',
    },
    researcher: {
      question: t('Самая быстрая система всегда покажет лучший интеллектуальный профиль?', 'Will the fastest system always have the strongest intelligence profile?'),
      hypotheses: [t('Да: скорость почти всё определяет.', 'Yes: speed determines almost everything.'), t('Нет: разные способности могут расходиться.', 'No: different abilities can diverge.')],
      variables: [t('Независимая: тип системы.', 'Independent: system type.'), t('Зависимые: скорость, контекст, обучение, планирование.', 'Dependent: speed, context, learning, planning.')],
      procedure: [t('Возьми калькулятор, навигатор и обучаемый фильтр спама.', 'Take a calculator, navigator, and trainable spam filter.'), t('Оцени каждую систему по одинаковым критериям 0–2.', 'Score each system on the same 0–2 criteria.'), t('Сравни профиль, а не сумму.', 'Compare the profile, not only the total.')],
      observations: [t('Калькулятор лидирует по скорости, но проигрывает по адаптации.', 'The calculator leads on speed but loses on adaptation.'), t('Навигатор силён в контексте и планировании.', 'The navigator is strong in context and planning.'), t('Обучаемый фильтр меняется на новых примерах, хотя не умеет планировать маршрут.', 'A trainable filter changes from new examples even though it cannot plan routes.')],
      conclusion: t('Интеллектуальность многомерна: эксперимент должен проверять конкретную способность, а не впечатление от системы.', 'Intelligence is multidimensional: an experiment should test a specific ability, not an overall impression.'),
    },
  },
  'data-to-meaning': {
    visualTitle: t('Как число получает смысл', 'How a number gains meaning'),
    visualCaption: t('Одно и то же значение меняет статус по мере добавления контекста.', 'The same value changes status as context is added.'),
    visualNodes: [
      {label: t('42', '42'), detail: t('Сырое значение: пока неизвестно, что измерено.', 'A raw value: we do not yet know what was measured.')},
      {label: t('42 °C', '42 °C'), detail: t('Добавились единицы, но всё ещё неизвестны объект, место и время.', 'Units were added, but object, location, and time are still unknown.')},
      {label: t('Воздух · 14:00 · тень', 'Air · 14:00 · shade'), detail: t('Контекст превращает запись в информацию.', 'Context turns the record into information.')},
      {label: t('Риск перегрева', 'Heat risk'), detail: t('Связь с нормой и последствиями превращает информацию в знание для действия.', 'Connecting to norms and consequences turns information into actionable knowledge.')},
    ],
    workedTitle: t('Разбор: три температуры', 'Worked example: three temperatures'),
    workedScenario: t('Есть значения 37.2, 39.1, 36.8. Сначала мы не знаем даже, сравнимы ли они.', 'We have 37.2, 39.1, and 36.8. At first, we do not even know whether they are comparable.'),
    workedSteps: [
      {label: t('Шаг 1 · добавляем тип', 'Step 1 · add type'), expression: 'temperature', explanation: t('Теперь знаем физическую величину.', 'Now we know the physical quantity.')},
      {label: t('Шаг 2 · добавляем единицы', 'Step 2 · add units'), expression: '°C', explanation: t('Значения можно корректно интерпретировать и сравнивать.', 'Values can now be interpreted and compared correctly.')},
      {label: t('Шаг 3 · добавляем объект и время', 'Step 3 · add subject and time'), expression: 'person_A, 08:00', explanation: t('Запись становится наблюдением конкретного объекта.', 'The record becomes an observation of a specific subject.')},
      {label: t('Шаг 4 · связываем с задачей', 'Step 4 · connect to task'), explanation: t('Если задача — обнаружить лихорадку, 39.1 °C становится значимым сигналом.', 'If the task is fever detection, 39.1 °C becomes a meaningful signal.')},
    ],
    math: {
      lead: t('В машинном обучении наблюдение часто представляют как структурированный вектор признаков.', 'In machine learning, an observation is often represented as a structured feature vector.'),
      formula: 'x = [value, unit_id, time, source, ...]',
      symbols: [
        {symbol: 'x', meaning: t('одно наблюдение', 'one observation')},
        {symbol: 'xᵢ', meaning: t('отдельный признак', 'one feature')},
      ],
      byHand: [
        {label: t('Сырая запись', 'Raw record'), expression: '[39.1]', explanation: t('Мало контекста.', 'Very little context.')},
        {label: t('Структурированная запись', 'Structured record'), expression: '[39.1, C, 8:00, person_A]', explanation: t('Модель получает больше информации о наблюдении.', 'The model receives more information about the observation.')},
      ],
      mechanism: t('Признаки не равны смыслу автоматически. Мы выбираем представление, которое сохраняет информацию, полезную для конкретной задачи.', 'Features do not automatically equal meaning. We choose a representation that preserves information useful for the task.'),
    },
    engineer: {
      goal: t('Собери структурированную запись вместо «голого» числа.', 'Build a structured record instead of a bare number.'),
      starterCode: `record = {\n    "value": 39.1,\n    "unit": "C",\n    "source": "person_A",\n}\n\ndef is_complete(record):\n    return ...`,
      checkpoints: [t('У записи есть значение, единицы и источник.', 'The record has value, units, and source.'), t('Проверка должна работать для любого словаря той же схемы.', 'The check should work for any dictionary using the same schema.')],
      challenge: t('Проверь, что все три обязательных ключа присутствуют.', 'Check that all three required keys are present.'),
      expected: 'all(key in record for key in ["value", "unit", "source"])',
      hint: t('Функция `all(...)` возвращает True, только если все проверки истинны.', '`all(...)` returns True only when every check is true.'),
      solution: 'return all(key in record for key in ["value", "unit", "source"])',
    },
    researcher: {
      question: t('Что произойдёт с выводом, если удалить часть контекста?', 'What happens to a conclusion when some context is removed?'),
      hypotheses: [t('Ничего: числа говорят сами за себя.', 'Nothing: numbers speak for themselves.'), t('Уверенность и корректность вывода снизятся.', 'Confidence and correctness will decrease.')],
      variables: [t('Независимая: доступные поля записи.', 'Independent: available record fields.'), t('Зависимая: число однозначных интерпретаций.', 'Dependent: number of plausible interpretations.')],
      procedure: [t('Начни с полной записи температуры.', 'Start with a complete temperature record.'), t('По одному убирай единицы, источник и время.', 'Remove units, source, and time one at a time.'), t('После каждого шага перечисляй возможные трактовки.', 'After each step, list plausible interpretations.')],
      observations: [t('Без единиц 39.1 может быть °C, °F или вообще не температурой.', 'Without units, 39.1 may be °C, °F, or not temperature at all.'), t('Без источника нельзя связать значение с конкретным объектом.', 'Without a source, the value cannot be tied to a specific subject.')],
      conclusion: t('Контекст уменьшает неоднозначность и делает данные пригодными для решения задачи.', 'Context reduces ambiguity and makes data usable for a task.'),
    },
  },
  'knowledge-as-rules': {
    visualTitle: t('Факты → правила → новые факты', 'Facts → rules → new facts'),
    visualCaption: t('Так устроена простейшая цепочка логического вывода.', 'This is the simplest inference chain.'),
    visualNodes: [
      {label: t('Факт', 'Fact'), detail: t('Наблюдение, которое считаем истинным: temperature < 0.', 'An observation treated as true: temperature < 0.')},
      {label: t('Условие', 'Condition'), detail: t('Часть правила после ЕСЛИ.', 'The IF part of a rule.')},
      {label: t('Правило', 'Rule'), detail: t('ЕСЛИ условия истинны → ТО добавить вывод или выполнить действие.', 'IF conditions are true → THEN add a conclusion or perform an action.')},
      {label: t('Новый факт', 'New fact'), detail: t('Результат может стать входом для следующего правила.', 'The result can become input for another rule.')},
    ],
    workedTitle: t('Разбор: риск гололёда', 'Worked example: icing risk'),
    workedScenario: t('Из двух наблюдений нужно получить предупреждение.', 'Two observations must produce a warning.'),
    workedSteps: [
      {label: t('Факты', 'Facts'), expression: 'temp = -2, precipitation = True', explanation: t('Оба факта заданы явно.', 'Both facts are explicit.')},
      {label: t('Проверяем условие', 'Evaluate condition'), expression: 'temp < 0 AND precipitation', explanation: t('Булево выражение истинно.', 'The Boolean expression is true.')},
      {label: t('Применяем правило', 'Fire rule'), expression: 'icing_risk = True', explanation: t('Получаем новый факт.', 'We derive a new fact.')},
    ],
    math: {
      lead: t('Условия правил строятся из булевой логики.', 'Rule conditions are built from Boolean logic.'),
      formula: 'A ∧ B → C',
      symbols: [
        {symbol: 'A, B', meaning: t('условия, которые могут быть True или False', 'conditions that can be True or False')},
        {symbol: '∧', meaning: t('логическое И: оба условия должны быть истинны', 'logical AND: both conditions must be true')},
        {symbol: '→', meaning: t('если условие выполнено, делаем вывод', 'if the condition holds, derive the conclusion')},
      ],
      byHand: [
        {label: t('A = True, B = True', 'A = True, B = True'), expression: 'A ∧ B = True', explanation: t('Правило срабатывает.', 'The rule fires.')},
        {label: t('A = True, B = False', 'A = True, B = False'), expression: 'A ∧ B = False', explanation: t('Правило не срабатывает.', 'The rule does not fire.')},
      ],
      mechanism: t('Rule engine последовательно ищет правила, чьи условия выполнены, применяет их и добавляет новые факты до тех пор, пока новых выводов не останется.', 'A rule engine repeatedly finds rules whose conditions hold, fires them, and adds new facts until no new conclusions appear.'),
    },
    engineer: {
      goal: t('Напиши одно прозрачное правило на Python.', 'Write one transparent Python rule.'),
      starterCode: `def icing_risk(temp, precipitation):\n    if ...:\n        return True\n    return False`,
      checkpoints: [t('Условие должно проверять оба факта.', 'The condition must test both facts.'), t('Поведение легко объяснить: можно показать строку, которая сработала.', 'Behavior is explainable: you can point to the line that fired.')],
      challenge: t('Чем заменить `...`?', 'What should replace `...`?'),
      expected: 'temp < 0 and precipitation',
      hint: t('Используй сравнение температуры и логическое `and`.', 'Use a temperature comparison and logical `and`.'),
      solution: 'if temp < 0 and precipitation:',
    },
    researcher: {
      question: t('Насколько устойчиво правило около границы 0 °C?', 'How robust is the rule near the 0 °C boundary?'),
      hypotheses: [t('Граница 0 всегда идеальна.', 'The 0 boundary is always perfect.'), t('Реальные данные создают пограничные случаи.', 'Real data creates boundary cases.')],
      variables: [t('Независимая: температура от −1 до +1.', 'Independent: temperature from −1 to +1.'), t('Зависимая: решение rule engine.', 'Dependent: rule-engine decision.')],
      procedure: [t('Проверь −1, −0.1, 0, +0.1, +1.', 'Test −1, −0.1, 0, +0.1, +1.'), t('Представь ошибку датчика ±0.3 °C.', 'Assume sensor error ±0.3 °C.'), t('Отметь случаи, где малый шум меняет вывод.', 'Mark cases where small noise flips the conclusion.')],
      observations: [t('Рядом с порогом маленькая ошибка измерения может изменить решение.', 'Near the threshold, small measurement error can flip the decision.')],
      conclusion: t('Даже прозрачное правило нуждается в проверке границ, качества данных и реальных исключений.', 'Even a transparent rule needs boundary, data-quality, and exception testing.'),
    },
  },
  'where-rules-break': {
    visualTitle: t('Почему число правил взрывается', 'Why rule counts explode'),
    visualCaption: t('Каждый новый бинарный признак удваивает число возможных комбинаций.', 'Each new binary feature doubles the number of possible combinations.'),
    visualNodes: [
      {label: t('1 признак', '1 feature'), detail: t('2 комбинации.', '2 combinations.')},
      {label: t('2 признака', '2 features'), detail: t('4 комбинации.', '4 combinations.')},
      {label: t('5 признаков', '5 features'), detail: t('32 комбинации.', '32 combinations.')},
      {label: t('10 признаков', '10 features'), detail: t('1024 комбинации — и это ещё без непрерывных значений.', '1024 combinations — before continuous values are considered.')},
    ],
    workedTitle: t('Разбор: «кошка» через ручные правила', 'Worked example: hand-written cat rules'),
    workedScenario: t('Попробуем распознавать кошку по ушам, усам и хвосту.', 'Try to recognize a cat using ears, whiskers, and tail.'),
    workedSteps: [
      {label: t('Правило 1', 'Rule 1'), expression: 'ears AND whiskers AND tail → cat', explanation: t('Работает на типичном примере.', 'Works on a typical example.')},
      {label: t('Контрпример', 'Counterexample'), expression: 'cat without tail', explanation: t('Настоящая кошка ломает правило.', 'A real cat breaks the rule.')},
      {label: t('Добавляем исключение', 'Add exception'), expression: '(tail OR injured) ...', explanation: t('Правило становится длиннее и хрупче.', 'The rule becomes longer and more brittle.')},
      {label: t('Новый объект', 'New object'), expression: 'fox with ears + tail', explanation: t('Теперь приходится добавлять ещё признаки и исключения.', 'More features and exceptions are needed.')},
    ],
    math: {
      lead: t('Если n признаков принимают только два значения, уже существует 2ⁿ комбинаций.', 'If n features are only binary, there are already 2ⁿ combinations.'),
      formula: 'combinations = 2ⁿ',
      symbols: [{symbol: 'n', meaning: t('число бинарных признаков', 'number of binary features')}],
      byHand: [
        {label: t('n = 3', 'n = 3'), expression: '2³ = 8', explanation: t('Ещё можно перебрать вручную.', 'Still manageable by hand.')},
        {label: t('n = 20', 'n = 20'), expression: '2²⁰ = 1,048,576', explanation: t('Полное ручное перечисление становится непрактичным.', 'Complete hand enumeration becomes impractical.')},
      ],
      mechanism: t('Реальный мир хуже: признаки часто непрерывны, шумны и зависят друг от друга. Поэтому проблема не только в количестве правил, но и в невозможности заранее описать все варианты.', 'The real world is harder: features are often continuous, noisy, and dependent. The problem is not only rule count but the impossibility of anticipating every case.'),
    },
    engineer: {
      goal: t('Напиши хрупкий классификатор и сразу покрой его контрпримером.', 'Write a brittle classifier and immediately test a counterexample.'),
      starterCode: `def is_cat(ears, whiskers, tail):\n    return ears and whiskers and tail\n\nprint(is_cat(True, True, False))  # ?`,
      checkpoints: [t('Код прост, но предположение слишком жёсткое.', 'The code is simple but the assumption is too rigid.'), t('Тест должен включать настоящую кошку без хвоста.', 'The test must include a real cat without a tail.')],
      challenge: t('Какой результат напечатает код для `(True, True, False)`?', 'What will the code print for `(True, True, False)`?'),
      expected: 'False',
      hint: t('Оператор `and` требует True у всех трёх значений.', '`and` requires all three values to be True.'),
      solution: 'False',
    },
    researcher: {
      question: t('Как растёт стоимость ручных правил при добавлении признаков?', 'How does the cost of hand-written rules grow as features are added?'),
      hypotheses: [t('Почти линейно.', 'Almost linearly.'), t('Комбинаторно.', 'Combinatorially.')],
      variables: [t('Независимая: число признаков n.', 'Independent: feature count n.'), t('Зависимая: число комбинаций 2ⁿ и найденных исключений.', 'Dependent: 2ⁿ combinations and discovered exceptions.')],
      procedure: [t('Посчитай 2ⁿ для n = 2, 4, 8, 16.', 'Compute 2ⁿ for n = 2, 4, 8, 16.'), t('Для каждой ступени оцени, сколько случаев реально можно проверить вручную.', 'Estimate how many cases can realistically be tested by hand.')],
      observations: [t('Число комбинаций растёт намного быстрее числа признаков.', 'Combination count grows much faster than feature count.')],
      conclusion: t('Именно здесь возникает потребность не перечислять все правила, а учиться по примерам.', 'This is where the need arises to learn from examples instead of enumerating every rule.'),
    },
  },
  'learn-from-examples': {
    visualTitle: t('Примеры → закономерность → новый пример', 'Examples → pattern → new example'),
    visualCaption: t('Обучение имеет смысл только тогда, когда найденная закономерность переносится дальше обучающих примеров.', 'Learning matters only if the discovered pattern transfers beyond training examples.'),
    visualNodes: [
      {label: t('Train', 'Train'), detail: t('Примеры, по которым модель настраивает параметры.', 'Examples used to adjust model parameters.')},
      {label: t('Pattern', 'Pattern'), detail: t('Компактная зависимость, объясняющая много примеров.', 'A compact dependency that explains many examples.')},
      {label: t('Test', 'Test'), detail: t('Новые примеры, которых модель не видела при настройке.', 'New examples unseen during tuning.')},
      {label: t('Generalization', 'Generalization'), detail: t('Способность работать на новых данных.', 'Ability to work on new data.')},
    ],
    workedTitle: t('Разбор: y = 2x + 1', 'Worked example: y = 2x + 1'),
    workedScenario: t('Даны пары (1,3), (2,5), (3,7). Что полезнее: запомнить три ответа или найти правило?', 'Given (1,3), (2,5), (3,7), what is more useful: memorize three answers or discover a rule?'),
    workedSteps: [
      {label: t('Наблюдаем разности', 'Inspect differences'), expression: '+1 по x → +2 по y', explanation: t('Это намекает на коэффициент 2.', 'This suggests a slope of 2.')},
      {label: t('Проверяем сдвиг', 'Check offset'), expression: 'y - 2x = 1', explanation: t('Для всех трёх примеров остаток одинаков.', 'The remainder is the same for all three examples.')},
      {label: t('Формулируем модель', 'Form a model'), expression: 'ŷ = 2x + 1', explanation: t('Одна формула описывает все обучающие пары.', 'One formula explains all training pairs.')},
      {label: t('Проверяем перенос', 'Test transfer'), expression: 'x=10 → ŷ=21', explanation: t('Вот где запоминание и обучение расходятся.', 'This is where memorization and learning diverge.')},
    ],
    math: {
      lead: t('Модель — семейство функций f(x; θ), где θ можно подобрать по данным.', 'A model is a family of functions f(x; θ), where θ can be fitted from data.'),
      formula: 'ŷ = f(x; θ)',
      symbols: [
        {symbol: 'x', meaning: t('входной пример', 'input example')},
        {symbol: 'θ', meaning: t('настраиваемые параметры модели', 'trainable model parameters')},
        {symbol: 'ŷ', meaning: t('предсказание модели', 'model prediction')},
      ],
      byHand: [
        {label: t('Кандидат θ₁', 'Candidate θ₁'), expression: 'ŷ = 2x + 1', explanation: t('Совпадает с известными примерами и разумно переносится.', 'Matches known examples and transfers naturally.')},
        {label: t('Таблица-запоминалка', 'Lookup table'), expression: '{1:3, 2:5, 3:7}', explanation: t('Идеальна на train, но не знает, что делать с x=10.', 'Perfect on train but has no answer for x=10.')},
      ],
      mechanism: t('Обучение — это поиск параметров, которые уменьшают ошибку на примерах. Обобщение проверяется отдельно на данных, не использованных для подбора.', 'Learning is the search for parameters that reduce error on examples. Generalization is checked separately on data not used for fitting.'),
    },
    engineer: {
      goal: t('Раздели данные на train и test и не подсматривай в test при выборе правила.', 'Split data into train and test and do not use test while choosing the rule.'),
      starterCode: `train = [(1, 3), (2, 5), (3, 7)]\ntest_x = 10\n\ndef predict(x):\n    return ...\n\nprint(predict(test_x))`,
      checkpoints: [t('Функция должна выражать закономерность, а не словарь ответов.', 'The function should express a pattern, not a lookup table.'), t('test_x не использовался для подбора правила.', 'test_x was not used to choose the rule.')],
      challenge: t('Запиши выражение для найденной закономерности.', 'Write the expression for the discovered pattern.'),
      expected: 'x * 2 + 1',
      hint: t('При увеличении x на 1, y растёт на 2; затем нужен сдвиг +1.', 'When x increases by 1, y increases by 2; then add an offset of +1.'),
      solution: 'return x * 2 + 1',
    },
    researcher: {
      question: t('Может ли модель идеально помнить train и плохо работать на новых данных?', 'Can a model perfectly remember train data and still fail on new data?'),
      hypotheses: [t('Нет, идеальный train гарантирует успех.', 'No, perfect train performance guarantees success.'), t('Да, запоминание не равно обобщению.', 'Yes, memorization is not generalization.')],
      variables: [t('Независимая: способ представления закономерности.', 'Independent: representation of the pattern.'), t('Зависимая: ошибка на unseen test.', 'Dependent: error on unseen test.')],
      procedure: [t('Сравни lookup table и формулу.', 'Compare a lookup table and a formula.'), t('Обе модели проверь на train.', 'Test both on train.'), t('Затем подай x=10 и x=100.', 'Then feed x=10 and x=100.')],
      observations: [t('Lookup table имеет нулевую train-ошибку, но не определена вне известных ключей.', 'The lookup table has zero train error but is undefined for unseen keys.'), t('Формула переносит найденную структуру.', 'The formula transfers the discovered structure.')],
      conclusion: t('Главный критерий обучения — не запоминание прошлого, а полезное поведение на новых примерах.', 'The key criterion for learning is not remembering the past but useful behavior on new examples.'),
    },
  },
  'trainable-parameters': {
    visualTitle: t('Вход проходит через настраиваемые числа', 'Input passes through trainable numbers'),
    visualCaption: t('Параметры — это то, что обучение имеет право менять.', 'Parameters are the quantities learning is allowed to change.'),
    visualNodes: [
      {label: t('x', 'x'), detail: t('Вход: значение приходит из данных.', 'Input: a value comes from data.')},
      {label: t('w', 'w'), detail: t('Вес: насколько сильно x влияет на предсказание.', 'Weight: how strongly x affects the prediction.')},
      {label: t('b', 'b'), detail: t('Смещение: куда сдвигается вся зависимость.', 'Bias: how the whole relationship is shifted.')},
      {label: t('ŷ', 'ŷ'), detail: t('Предсказание после применения параметров.', 'Prediction after applying the parameters.')},
    ],
    workedTitle: t('Разбор: ручная настройка w и b', 'Worked example: tune w and b by hand'),
    workedScenario: t('Для x=3 правильный ответ y=7. Начинаем с w=1, b=0.', 'For x=3 the target is y=7. Start with w=1, b=0.'),
    workedSteps: [
      {label: t('Первое предсказание', 'First prediction'), expression: 'ŷ = 3·1 + 0 = 3', explanation: t('Модель недооценивает ответ.', 'The model underestimates the target.')},
      {label: t('Меняем w', 'Change w'), expression: 'w = 2 → ŷ = 6', explanation: t('Стало ближе.', 'It got closer.')},
      {label: t('Меняем b', 'Change b'), expression: 'b = 1 → ŷ = 7', explanation: t('Теперь пример совпал.', 'Now the example matches.')},
    ],
    math: {
      lead: t('Линейная модель имеет два параметра: наклон w и смещение b.', 'A linear model has two parameters: slope w and bias b.'),
      formula: 'ŷ = wx + b',
      symbols: [
        {symbol: 'x', meaning: t('вход', 'input')},
        {symbol: 'w', meaning: t('вес / наклон', 'weight / slope')},
        {symbol: 'b', meaning: t('смещение', 'bias')},
        {symbol: 'ŷ', meaning: t('предсказание', 'prediction')},
      ],
      byHand: [
        {label: t('w=0, b=0', 'w=0, b=0'), expression: 'ŷ=0', explanation: t('Модель игнорирует x.', 'The model ignores x.')},
        {label: t('w=2, b=1', 'w=2, b=1'), expression: 'x=3 → ŷ=7', explanation: t('Параметры кодируют найденную зависимость.', 'Parameters encode the discovered relationship.')},
      ],
      mechanism: t('Во время обучения меняются w и b, но сама форма вычисления остаётся той же. Позже у нейросети параметров будут тысячи и миллионы, но идея останется прежней.', 'During training, w and b change while the computation form stays fixed. Neural networks later have thousands or millions of parameters, but the idea is the same.'),
    },
    engineer: {
      goal: t('Напиши параметризованную функцию, а не захардкоженное правило.', 'Write a parameterized function rather than a hard-coded rule.'),
      starterCode: `def predict(x, w, b):\n    return ...\n\nprint(predict(3, 2, 1))`,
      checkpoints: [t('w и b приходят в функцию как аргументы.', 'w and b enter the function as arguments.'), t('Одна функция описывает целое семейство моделей.', 'One function represents a whole family of models.')],
      challenge: t('Заполни выражение предсказания.', 'Fill in the prediction expression.'),
      expected: 'x * w + b',
      hint: t('Сначала умножь вход на вес, затем добавь смещение.', 'Multiply input by weight, then add bias.'),
      solution: 'return x * w + b',
    },
    researcher: {
      question: t('Как по-разному w и b изменяют линию?', 'How do w and b change the line differently?'),
      hypotheses: [t('Они делают одно и то же.', 'They do the same thing.'), t('w меняет наклон, b — вертикальный сдвиг.', 'w changes slope, b changes vertical shift.')],
      variables: [t('Независимые: w и b.', 'Independent: w and b.'), t('Зависимая: предсказания для x = −2…2.', 'Dependent: predictions for x = −2…2.')],
      procedure: [t('Зафиксируй b=0 и меняй w: −2, −1, 0, 1, 2.', 'Fix b=0 and vary w: −2, −1, 0, 1, 2.'), t('Затем зафиксируй w=1 и меняй b.', 'Then fix w=1 and vary b.')],
      observations: [t('w вращает зависимость вокруг начала координат.', 'w changes the slope around the origin.'), t('b сдвигает все предсказания на одинаковую величину.', 'b shifts all predictions by the same amount.')],
      conclusion: t('Разные параметры отвечают за разные геометрические свойства модели.', 'Different parameters control different geometric properties of the model.'),
    },
  },
  'measure-error': {
    visualTitle: t('Предсказание и цель нужно сравнить числом', 'Prediction and target need a numerical comparison'),
    visualCaption: t('Loss превращает «плохо» в величину, которую можно оптимизировать.', 'Loss turns “bad” into a quantity that can be optimized.'),
    visualNodes: [
      {label: t('ŷ', 'ŷ'), detail: t('То, что предсказала модель.', 'What the model predicted.')},
      {label: t('y', 'y'), detail: t('Правильный ответ из данных.', 'The target from data.')},
      {label: t('Ошибка', 'Error'), detail: t('Разность между prediction и target.', 'Difference between prediction and target.')},
      {label: t('Loss', 'Loss'), detail: t('Правило, превращающее ошибку в одно число качества.', 'A rule turning error into one quality number.')},
    ],
    workedTitle: t('Разбор: почему квадрат ошибки удобен', 'Worked example: why square the error'),
    workedScenario: t('Цель y=7. Два предсказания: 5 и 9.', 'Target y=7. Two predictions: 5 and 9.'),
    workedSteps: [
      {label: t('Сырые ошибки', 'Raw errors'), expression: '5−7=−2, 9−7=+2', explanation: t('Знаки противоположны и могут взаимно сократиться.', 'Opposite signs can cancel each other.')},
      {label: t('Квадраты', 'Squares'), expression: '(−2)²=4, (+2)²=4', explanation: t('Обе ошибки получают одинаковый положительный штраф.', 'Both errors receive the same positive penalty.')},
      {label: t('Среднее', 'Mean'), expression: '(4+4)/2=4', explanation: t('Получаем одно число для набора примеров.', 'We get one number for the dataset.')},
    ],
    math: {
      lead: t('Одна из самых частых функций потерь для регрессии — MSE.', 'A common regression loss is mean squared error (MSE).'),
      formula: 'MSE = (1/n) Σ(ŷᵢ − yᵢ)²',
      symbols: [
        {symbol: 'n', meaning: t('число примеров', 'number of examples')},
        {symbol: 'ŷᵢ', meaning: t('предсказание на i-м примере', 'prediction for example i')},
        {symbol: 'yᵢ', meaning: t('правильный ответ', 'target')},
      ],
      byHand: [
        {label: t('Ошибки', 'Errors'), expression: '[-2, +2]', explanation: t('Сначала вычитаем target.', 'First subtract the target.')},
        {label: t('Квадраты', 'Squares'), expression: '[4, 4]', explanation: t('Знак исчезает, большие промахи усиливаются.', 'Signs disappear and large misses are emphasized.')},
        {label: t('Среднее', 'Mean'), expression: '4', explanation: t('Это MSE для двух примеров.', 'This is the MSE for the two examples.')},
      ],
      mechanism: t('Loss нужен не ради оценки в журнал. Алгоритм обучения использует его как сигнал: какие параметры дают лучшее качество и куда их менять.', 'Loss is not just a grade. Training uses it as a signal for which parameters are better and how to change them.'),
    },
    engineer: {
      goal: t('Реализуй MSE без библиотек.', 'Implement MSE without libraries.'),
      starterCode: `def mse(predictions, targets):\n    errors = [(p - y) ** 2 for p, y in zip(predictions, targets)]\n    return ...`,
      checkpoints: [t('Для каждого примера считается квадрат ошибки.', 'Each example contributes squared error.'), t('Финальное значение усредняется.', 'The final value is averaged.')],
      challenge: t('Как вернуть среднее значение списка `errors`?', 'How do you return the mean of `errors`?'),
      expected: 'sum(errors) / len(errors)',
      hint: t('Среднее = сумма / количество.', 'Mean = sum / count.'),
      solution: 'return sum(errors) / len(errors)',
    },
    researcher: {
      question: t('Почему MSE сильнее реагирует на выбросы, чем MAE?', 'Why is MSE more sensitive to outliers than MAE?'),
      hypotheses: [t('Одинаково.', 'They react the same.'), t('Квадрат резко усиливает большие ошибки.', 'Squaring amplifies large errors.')],
      variables: [t('Независимая: величина одного выброса.', 'Independent: size of one outlier.'), t('Зависимые: MSE и MAE.', 'Dependent: MSE and MAE.')],
      procedure: [t('Возьми ошибки [1,1,1,1].', 'Start with errors [1,1,1,1].'), t('Замени последнюю на 10.', 'Replace the last one with 10.'), t('Сравни средний модуль и средний квадрат.', 'Compare mean absolute and mean squared error.')],
      observations: [t('MAE растёт умеренно, MSE — намного сильнее.', 'MAE grows moderately while MSE rises much more.')],
      conclusion: t('Функция потерь определяет, какие ошибки модель считает особенно дорогими.', 'The loss function defines which mistakes the model treats as especially costly.'),
    },
  },
  'automatic-improvement': {
    visualTitle: t('Поиск параметра как соревнование кандидатов', 'Parameter search as a competition between candidates'),
    visualCaption: t('Если умеем вычислять loss, можем сравнивать варианты автоматически.', 'Once loss can be computed, candidate parameters can be compared automatically.'),
    visualNodes: [
      {label: t('w=0', 'w=0'), detail: t('Считаем loss для первого кандидата.', 'Compute loss for the first candidate.')},
      {label: t('w=1', 'w=1'), detail: t('Считаем loss снова.', 'Compute loss again.')},
      {label: t('w=2', 'w=2'), detail: t('Ещё один кандидат.', 'Another candidate.')},
      {label: t('min loss', 'min loss'), detail: t('Выбираем параметр с наименьшей ошибкой.', 'Choose the parameter with the lowest loss.')},
    ],
    workedTitle: t('Разбор: grid search по w', 'Worked example: grid search over w'),
    workedScenario: t('Модель ŷ=wx, данные (1,2), (2,4). Проверим w=0,1,2,3.', 'Model ŷ=wx, data (1,2), (2,4). Test w=0,1,2,3.'),
    workedSteps: [
      {label: t('w=0', 'w=0'), expression: 'pred=[0,0] → MSE=10', explanation: t('Плохо.', 'Poor fit.')},
      {label: t('w=1', 'w=1'), expression: 'pred=[1,2] → MSE=2.5', explanation: t('Лучше.', 'Better.')},
      {label: t('w=2', 'w=2'), expression: 'pred=[2,4] → MSE=0', explanation: t('Лучший кандидат в сетке.', 'Best candidate in the grid.')},
      {label: t('w=3', 'w=3'), expression: 'pred=[3,6] → MSE=2.5', explanation: t('Снова хуже.', 'Worse again.')},
    ],
    math: {
      lead: t('Настройку параметров можно записать как задачу минимизации loss.', 'Parameter fitting can be written as a loss minimization problem.'),
      formula: 'θ* = argmin_θ L(θ)',
      symbols: [
        {symbol: 'θ', meaning: t('кандидатный набор параметров', 'candidate parameter set')},
        {symbol: 'L(θ)', meaning: t('loss при этих параметрах', 'loss for those parameters')},
        {symbol: 'argmin', meaning: t('значение параметра, где функция минимальна', 'parameter value where the function is minimal')},
      ],
      byHand: [
        {label: t('Таблица', 'Table'), expression: 'w: 0 1 2 3 | L: 10 2.5 0 2.5', explanation: t('Минимум виден напрямую.', 'The minimum is directly visible.')},
        {label: t('Выбор', 'Choice'), expression: 'w*=2', explanation: t('Это лучший из проверенных кандидатов.', 'This is the best tested candidate.')},
      ],
      mechanism: t('Полный перебор работает только в маленьком пространстве параметров. Когда параметров миллионы, нужен способ двигаться к минимуму, не проверяя все варианты.', 'Brute-force search works only in a small parameter space. With millions of parameters, we need a way to move toward a minimum without testing every possibility.'),
    },
    engineer: {
      goal: t('Напиши grid search, который выбирает лучший w.', 'Write a grid search that selects the best w.'),
      starterCode: `candidates = [0, 1, 2, 3]\nlosses = {0: 10, 1: 2.5, 2: 0, 3: 2.5}\nbest_w = ...\nprint(best_w)`,
      checkpoints: [t('Сравнение выполняется по loss, а не по самому w.', 'Comparison must use loss, not w itself.'), t('Нужен ключ словаря с минимальным значением.', 'You need the dictionary key with the minimum value.')],
      challenge: t('Запиши Python-выражение, которое выберет ключ с минимальным loss.', 'Write the Python expression that selects the key with minimum loss.'),
      expected: 'min(losses, key=losses.get)',
      hint: t('`min` умеет сравнивать элементы по функции `key`.', '`min` can compare elements using a `key` function.'),
      solution: 'best_w = min(losses, key=losses.get)',
    },
    researcher: {
      question: t('Что мы теряем, если сетка кандидатов слишком редкая?', 'What do we lose if the candidate grid is too coarse?'),
      hypotheses: [t('Ничего.', 'Nothing.'), t('Можно пропустить хороший параметр между точками.', 'A good parameter can lie between grid points.')],
      variables: [t('Независимая: шаг сетки.', 'Independent: grid step size.'), t('Зависимая: лучший найденный loss и число вычислений.', 'Dependent: best found loss and computation count.')],
      procedure: [t('Сравни шаги 1.0, 0.5, 0.1.', 'Compare steps 1.0, 0.5, 0.1.'), t('Для каждого шага запиши число кандидатов и лучший loss.', 'Record candidate count and best loss for each step.')],
      observations: [t('Мелкая сетка точнее, но требует больше вычислений.', 'A finer grid is more precise but requires more computation.')],
      conclusion: t('Нужен алгоритм, который использует форму loss, а не слепо перебирает пространство.', 'We need an algorithm that uses the shape of loss instead of blindly searching space.'),
    },
  },
  'gradient-direction': {
    visualTitle: t('Склон loss подсказывает направление', 'The slope of loss suggests a direction'),
    visualCaption: t('Сравнение значений слева и справа даёт локальную подсказку, куда двигать параметр.', 'Comparing nearby values gives a local clue for how to move a parameter.'),
    visualNodes: [
      {label: t('w−ε', 'w−ε'), detail: t('Loss чуть левее текущей точки.', 'Loss just left of the current point.')},
      {label: t('w', 'w'), detail: t('Текущий параметр.', 'Current parameter.')},
      {label: t('w+ε', 'w+ε'), detail: t('Loss чуть правее текущей точки.', 'Loss just right of the current point.')},
      {label: t('slope', 'slope'), detail: t('Если справа loss выше, склон положительный и выгодно двигаться влево.', 'If loss is higher on the right, the slope is positive and moving left reduces loss.')},
    ],
    workedTitle: t('Разбор: численная производная', 'Worked example: numerical derivative'),
    workedScenario: t('Пусть L(w)=(w−2)², текущий w=3, ε=0.1.', 'Let L(w)=(w−2)², current w=3, ε=0.1.'),
    workedSteps: [
      {label: t('Слева', 'Left'), expression: 'L(2.9)=0.81', explanation: t('Чуть меньше текущего loss.', 'Slightly below the current loss.')},
      {label: t('Справа', 'Right'), expression: 'L(3.1)=1.21', explanation: t('Чуть больше.', 'Slightly larger.')},
      {label: t('Оцениваем склон', 'Estimate slope'), expression: '(1.21−0.81)/(0.2)=2', explanation: t('Положительная производная означает: уменьшай w.', 'A positive derivative means decrease w.')},
    ],
    math: {
      lead: t('Производная показывает скорость и направление изменения функции.', 'A derivative gives the rate and direction of function change.'),
      formula: "dL/dw ≈ [L(w+ε) − L(w−ε)] / (2ε)",
      symbols: [
        {symbol: 'dL/dw', meaning: t('наклон loss по параметру w', 'slope of loss with respect to w')},
        {symbol: 'ε', meaning: t('маленький шаг для численной оценки', 'small step for numerical estimation')},
      ],
      byHand: [
        {label: t('Подставляем', 'Substitute'), expression: '(1.21−0.81)/(0.2)', explanation: t('Используем две соседние точки.', 'Use two nearby points.')},
        {label: t('Получаем', 'Result'), expression: '2.0', explanation: t('Loss растёт при движении вправо.', 'Loss increases when moving right.')},
      ],
      mechanism: t('Градиент в многомерной модели — вектор таких производных по всем параметрам. Он показывает направление самого быстрого локального роста loss; для уменьшения идём в противоположную сторону.', 'In a multidimensional model, the gradient is the vector of these derivatives for all parameters. It points toward steepest local loss increase, so we move in the opposite direction.'),
    },
    engineer: {
      goal: t('Напиши численную производную функции одной переменной.', 'Write a numerical derivative for a one-variable function.'),
      starterCode: `def derivative(f, w, eps=1e-3):\n    left = f(w - eps)\n    right = f(w + eps)\n    return ...`,
      checkpoints: [t('Используются две симметричные точки.', 'Two symmetric points are used.'), t('Разность делится на расстояние 2·eps.', 'The difference is divided by distance 2·eps.')],
      challenge: t('Запиши формулу центральной разности.', 'Write the central-difference formula.'),
      expected: '(right - left) / (2 * eps)',
      hint: t('Числитель — right−left, знаменатель — расстояние между точками.', 'Numerator is right−left; denominator is the distance between the points.'),
      solution: 'return (right - left) / (2 * eps)',
    },
    researcher: {
      question: t('Как выбор ε влияет на численную производную?', 'How does ε affect the numerical derivative?'),
      hypotheses: [t('Любое ε одинаково хорошо.', 'Any ε works equally well.'), t('Слишком большое грубо, слишком маленькое страдает от численной точности.', 'Too large is coarse; too small suffers numerical precision issues.')],
      variables: [t('Независимая: ε = 1, 0.1, 0.001, 1e−8.', 'Independent: ε = 1, 0.1, 0.001, 1e−8.'), t('Зависимая: ошибка оценки производной.', 'Dependent: derivative estimation error.')],
      procedure: [t('Для L=(w−2)² вычисли производную в w=3.', 'For L=(w−2)² estimate the derivative at w=3.'), t('Сравни с точным значением 2.', 'Compare with the exact value 2.')],
      observations: [t('Средние ε дают хорошую оценку; экстремальные значения могут ухудшать результат.', 'Moderate ε values work well; extreme values can degrade the estimate.')],
      conclusion: t('Численная производная полезна для проверки, но нейросети обычно используют аналитический backprop/autograd.', 'Numerical derivatives are useful for checking, while neural networks normally use analytic backprop/autograd.'),
    },
  },
  'first-training-loop': {
    visualTitle: t('Training loop — повторяющийся цикл', 'The training loop is a repeating cycle'),
    visualCaption: t('Предсказание само по себе не обучает: параметры меняются только после вычисления сигнала ошибки.', 'Prediction alone does not train a model; parameters change only after an error signal is computed.'),
    visualNodes: [
      {label: t('Predict', 'Predict'), detail: t('Модель делает предсказание с текущими параметрами.', 'The model predicts using current parameters.')},
      {label: t('Loss', 'Loss'), detail: t('Сравниваем prediction с target.', 'Compare prediction with target.')},
      {label: t('Gradient', 'Gradient'), detail: t('Вычисляем, как loss зависит от параметров.', 'Compute how loss depends on parameters.')},
      {label: t('Update', 'Update'), detail: t('Сдвигаем параметры против градиента.', 'Move parameters against the gradient.')},
      {label: t('Repeat', 'Repeat'), detail: t('Повторяем на новых шагах/батчах.', 'Repeat on new steps/batches.')},
    ],
    workedTitle: t('Разбор: три шага gradient descent', 'Worked example: three gradient-descent steps'),
    workedScenario: t('L(w)=(w−2)², старт w=0, learning rate η=0.25.', 'L(w)=(w−2)², start w=0, learning rate η=0.25.'),
    workedSteps: [
      {label: t('Шаг 0', 'Step 0'), expression: 'w=0, grad=−4, L=4', explanation: t('Градиент отрицательный, значит обновление увеличит w.', 'The gradient is negative, so the update will increase w.')},
      {label: t('Update 1', 'Update 1'), expression: 'w=0−0.25·(−4)=1', explanation: t('Loss падает до 1.', 'Loss drops to 1.')},
      {label: t('Update 2', 'Update 2'), expression: 'w=1−0.25·(−2)=1.5', explanation: t('Loss падает до 0.25.', 'Loss drops to 0.25.')},
      {label: t('Update 3', 'Update 3'), expression: 'w=1.75, L=0.0625', explanation: t('Параметр приближается к минимуму w=2.', 'The parameter approaches the minimum w=2.')},
    ],
    math: {
      lead: t('Gradient descent обновляет параметры в направлении уменьшения loss.', 'Gradient descent updates parameters in the direction that reduces loss.'),
      formula: 'wₜ₊₁ = wₜ − η · ∂L/∂w',
      symbols: [
        {symbol: 'η', meaning: t('learning rate — размер шага', 'learning rate — step size')},
        {symbol: '∂L/∂w', meaning: t('градиент loss по параметру', 'loss gradient with respect to the parameter')},
      ],
      byHand: [
        {label: t('Старт', 'Start'), expression: 'w=0', explanation: t('Параметр далеко от оптимума 2.', 'Parameter is far from optimum 2.')},
        {label: t('Градиент', 'Gradient'), expression: '2(w−2)=−4', explanation: t('Знак задаёт направление.', 'The sign gives direction.')},
        {label: t('Обновление', 'Update'), expression: 'w←1', explanation: t('Шаг против градиента уменьшает loss.', 'A step against the gradient lowers loss.')},
      ],
      mechanism: t('Learning rate управляет компромиссом между скоростью и устойчивостью. Слишком большой шаг может перескакивать минимум, слишком маленький — учиться мучительно медленно.', 'Learning rate controls the tradeoff between speed and stability. Too large can overshoot the minimum; too small learns painfully slowly.'),
    },
    engineer: {
      goal: t('Напиши настоящий training loop из нескольких строк.', 'Write a real training loop in a few lines.'),
      starterCode: `w = 0.0\nlr = 0.25\nfor step in range(5):\n    grad = 2 * (w - 2)\n    w = ...\n    print(step, w)`,
      checkpoints: [t('Градиент считается до обновления.', 'Gradient is computed before the update.'), t('Мы вычитаем learning_rate × gradient.', 'We subtract learning_rate × gradient.')],
      challenge: t('Запиши строку обновления w.', 'Write the update expression for w.'),
      expected: 'w - lr * grad',
      hint: t('Идём против градиента.', 'Move against the gradient.'),
      solution: 'w = w - lr * grad',
    },
    researcher: {
      question: t('Что меняется при η=0.01, 0.25 и 1.1?', 'What changes for η=0.01, 0.25, and 1.1?'),
      hypotheses: [t('Чем больше η, тем всегда лучше.', 'Larger η is always better.'), t('Есть диапазон устойчивых шагов.', 'There is a stable range of step sizes.')],
      variables: [t('Независимая: learning rate.', 'Independent: learning rate.'), t('Зависимые: loss по шагам и расстояние до optimum.', 'Dependent: loss over steps and distance to optimum.')],
      procedure: [t('Запусти один и тот же loop с тремя η.', 'Run the same loop with three η values.'), t('Запиши loss после каждого шага.', 'Record loss after every step.')],
      observations: [t('η=0.01 сходится медленно.', 'η=0.01 converges slowly.'), t('η=0.25 сходится быстро.', 'η=0.25 converges quickly.'), t('Слишком большой η может колебаться или расходиться.', 'An overly large η can oscillate or diverge.')],
      conclusion: t('Гиперпараметры обучения влияют на динамику даже при неизменной модели и данных.', 'Training hyperparameters change dynamics even when model and data are unchanged.'),
    },
  },
  'first-neuron': {
    visualTitle: t('Нейрон: взвесить → сложить → активировать', 'Neuron: weight → sum → activate'),
    visualCaption: t('Нейрон обобщает знакомую формулу на несколько входов.', 'A neuron generalizes the familiar formula to multiple inputs.'),
    visualNodes: [
      {label: t('x₁…xₙ', 'x₁…xₙ'), detail: t('Несколько входных признаков.', 'Multiple input features.')},
      {label: t('w₁…wₙ', 'w₁…wₙ'), detail: t('Отдельный вес для каждого входа.', 'A separate weight for each input.')},
      {label: t('Σ + b', 'Σ + b'), detail: t('Взвешенная сумма и bias.', 'Weighted sum plus bias.')},
      {label: t('φ(z)', 'φ(z)'), detail: t('Функция активации преобразует сумму.', 'Activation transforms the sum.')},
      {label: t('output', 'output'), detail: t('Выход нейрона поступает дальше.', 'Neuron output is passed onward.')},
    ],
    workedTitle: t('Разбор: нейрон с двумя входами', 'Worked example: two-input neuron'),
    workedScenario: t('x=[2,3], w=[0.5,−1], b=1, ReLU.', 'x=[2,3], w=[0.5,−1], b=1, ReLU.'),
    workedSteps: [
      {label: t('Умножаем', 'Multiply'), expression: '2·0.5=1; 3·(−1)=−3', explanation: t('Каждый вход масштабируется своим весом.', 'Each input is scaled by its weight.')},
      {label: t('Складываем', 'Sum'), expression: 'z=1−3+1=−1', explanation: t('Добавляем bias.', 'Add the bias.')},
      {label: t('Активация', 'Activation'), expression: 'ReLU(−1)=0', explanation: t('Отрицательный сигнал обнуляется.', 'Negative signal is clipped to zero.')},
    ],
    math: {
      lead: t('Нейрон — взвешенная сумма входов с нелинейным преобразованием.', 'A neuron is a weighted sum of inputs followed by a nonlinear transformation.'),
      formula: 'z = Σ wᵢxᵢ + b;  y = φ(z)',
      symbols: [
        {symbol: 'wᵢ', meaning: t('вес i-го входа', 'weight of input i')},
        {symbol: 'b', meaning: t('bias', 'bias')},
        {symbol: 'φ', meaning: t('функция активации', 'activation function')},
      ],
      byHand: [
        {label: t('Линейная часть', 'Linear part'), expression: 'z=−1', explanation: t('До активации это обычная линейная модель нескольких признаков.', 'Before activation this is a linear model over multiple features.')},
        {label: t('Нелинейность', 'Nonlinearity'), expression: 'ReLU(z)=max(0,z)', explanation: t('Нелинейность позволяет сетям строить сложные зависимости.', 'Nonlinearity lets networks build complex relationships.')},
      ],
      mechanism: t('Без нелинейности много линейных слоёв схлопнулись бы в одну линейную операцию. Активации делают глубину содержательно полезной.', 'Without nonlinearities, many linear layers collapse into one linear operation. Activations make depth genuinely useful.'),
    },
    engineer: {
      goal: t('Реализуй один нейрон на чистом Python.', 'Implement one neuron in plain Python.'),
      starterCode: `def neuron(x, w, b):\n    z = sum(xi * wi for xi, wi in zip(x, w)) + b\n    return ...\n\nprint(neuron([2,3], [0.5,-1], 1))`,
      checkpoints: [t('Сначала вычисляется z.', 'Compute z first.'), t('Затем применяется ReLU.', 'Then apply ReLU.')],
      challenge: t('Запиши ReLU без отдельной библиотеки.', 'Write ReLU without a library.'),
      expected: 'max(0, z)',
      hint: t('ReLU возвращает большее из 0 и z.', 'ReLU returns the larger of 0 and z.'),
      solution: 'return max(0, z)',
    },
    researcher: {
      question: t('Что меняется, если убрать ReLU?', 'What changes if ReLU is removed?'),
      hypotheses: [t('Ничего существенного.', 'Nothing important.'), t('Сеть теряет нелинейность.', 'The network loses nonlinearity.')],
      variables: [t('Независимая: activation = identity или ReLU.', 'Independent: activation = identity or ReLU.'), t('Зависимая: выход нейрона для отрицательных и положительных z.', 'Dependent: output for negative and positive z.')],
      procedure: [t('Проверь z = −2, −1, 0, 1, 2.', 'Test z = −2, −1, 0, 1, 2.'), t('Сравни identity(z) и ReLU(z).', 'Compare identity(z) and ReLU(z).')],
      observations: [t('ReLU создаёт излом в нуле и меняет форму функции.', 'ReLU creates a kink at zero and changes the function shape.')],
      conclusion: t('Активация — не декоративный элемент: она меняет класс функций, которые может выразить сеть.', 'Activation is not decorative: it changes the class of functions the network can express.'),
    },
  },
  'neuron-layer': {
    visualTitle: t('Слой считает много нейронов параллельно', 'A layer computes many neurons in parallel'),
    visualCaption: t('Вектор входов превращается в новый вектор признаков.', 'An input vector becomes a new feature vector.'),
    visualNodes: [
      {label: t('x ∈ ℝⁿ', 'x ∈ ℝⁿ'), detail: t('n входных признаков.', 'n input features.')},
      {label: t('W', 'W'), detail: t('Матрица хранит веса всех нейронов слоя.', 'The matrix stores weights for every neuron in the layer.')},
      {label: t('b', 'b'), detail: t('Вектор bias — по одному на выходной нейрон.', 'Bias vector — one per output neuron.')},
      {label: t('φ', 'φ'), detail: t('Активация применяется поэлементно.', 'Activation is applied elementwise.')},
      {label: t('h ∈ ℝᵐ', 'h ∈ ℝᵐ'), detail: t('m новых признаков.', 'm new features.')},
    ],
    workedTitle: t('Разбор: слой 2→2', 'Worked example: a 2→2 layer'),
    workedScenario: t('x=[1,2], два нейрона с разными весами.', 'x=[1,2], two neurons with different weights.'),
    workedSteps: [
      {label: t('Нейрон A', 'Neuron A'), expression: '1·1 + 2·0 + 0 = 1', explanation: t('Первый выход равен 1.', 'First output is 1.')},
      {label: t('Нейрон B', 'Neuron B'), expression: '1·(−1)+2·1+0 = 1', explanation: t('Второй выход тоже 1.', 'Second output is also 1.')},
      {label: t('Собираем вектор', 'Collect vector'), expression: 'h=[1,1]', explanation: t('Слой выдаёт сразу несколько новых признаков.', 'The layer returns several new features at once.')},
    ],
    math: {
      lead: t('Матричная запись компактно описывает множество нейронов.', 'Matrix notation compactly describes many neurons.'),
      formula: 'h = φ(Wx + b)',
      symbols: [
        {symbol: 'W ∈ ℝᵐˣⁿ', meaning: t('матрица весов: m выходов × n входов', 'weight matrix: m outputs × n inputs')},
        {symbol: 'b ∈ ℝᵐ', meaning: t('вектор смещений', 'bias vector')},
        {symbol: 'h ∈ ℝᵐ', meaning: t('выход слоя', 'layer output')},
      ],
      byHand: [
        {label: t('Размерности', 'Shapes'), expression: '(2×2)(2×1)+(2×1) → (2×1)', explanation: t('Размеры должны быть совместимы.', 'Shapes must be compatible.')},
        {label: t('Результат', 'Result'), expression: 'h=[1,1]', explanation: t('Каждая строка W соответствует одному нейрону.', 'Each row of W corresponds to one neuron.')},
      ],
      mechanism: t('В глубоких сетях выход одного слоя становится входом следующего. Так сеть поэтапно строит новые представления данных.', 'In deep networks, one layer’s output becomes the next layer’s input. The network progressively builds new representations.'),
    },
    engineer: {
      goal: t('Реализуй слой как список нейронов.', 'Implement a layer as a list of neurons.'),
      starterCode: `def layer(x, W, b):\n    outputs = []\n    for weights, bias in zip(W, b):\n        z = sum(xi * wi for xi, wi in zip(x, weights)) + bias\n        outputs.append(...)\n    return outputs`,
      checkpoints: [t('Каждая строка W — веса одного нейрона.', 'Each row of W stores one neuron’s weights.'), t('В outputs добавляется активированный результат.', 'Append the activated result to outputs.')],
      challenge: t('Что добавить в `outputs` для ReLU-слоя?', 'What should be appended for a ReLU layer?'),
      expected: 'max(0, z)',
      hint: t('Та же ReLU, что в одном нейроне.', 'Use the same ReLU as in one neuron.'),
      solution: 'outputs.append(max(0, z))',
    },
    researcher: {
      question: t('Что даёт увеличение ширины слоя?', 'What does increasing layer width change?'),
      hypotheses: [t('Только замедляет код.', 'It only slows code.'), t('Даёт больше параллельных признаков, но увеличивает число параметров.', 'It provides more parallel features but increases parameter count.')],
      variables: [t('Независимая: число нейронов m.', 'Independent: number of neurons m.'), t('Зависимые: размер выхода и число параметров.', 'Dependent: output size and parameter count.')],
      procedure: [t('Для n=4 посчитай параметры слоя при m=2,8,32.', 'For n=4 count parameters for m=2,8,32.'), t('Используй m·n + m.', 'Use m·n + m.')],
      observations: [t('Ширина линейно увеличивает число параметров слоя.', 'Width increases layer parameter count linearly.')],
      conclusion: t('Архитектура определяет ёмкость модели и стоимость вычислений одновременно.', 'Architecture controls model capacity and computational cost at the same time.'),
    },
  },
  'text-as-data': {
    visualTitle: t('Текст должен превратиться в последовательность чисел', 'Text must become a sequence of numbers'),
    visualCaption: t('Tokenizer определяет, какие элементы текста считаются атомарными единицами модели.', 'A tokenizer defines which text pieces are atomic units for the model.'),
    visualNodes: [
      {label: t('«кот спит»', '“cat sleeps”'), detail: t('Исходная строка.', 'Original string.')},
      {label: t('tokens', 'tokens'), detail: t('Например, символы, слова или subword-части.', 'For example characters, words, or subword pieces.')},
      {label: t('vocab', 'vocab'), detail: t('Словарь сопоставляет каждому токену уникальный ID.', 'Vocabulary maps each token to a unique ID.')},
      {label: t('[12, 4, 91]', '[12, 4, 91]'), detail: t('Модель работает с ID, а не со строками.', 'The model operates on IDs, not raw strings.')},
    ],
    workedTitle: t('Разбор: символьный tokenizer', 'Worked example: character tokenizer'),
    workedScenario: t('Строка «мама». Создадим словарь уникальных символов.', 'String “mama”. Build a vocabulary of unique characters.'),
    workedSteps: [
      {label: t('Уникальные символы', 'Unique characters'), expression: "['а','м']", explanation: t('Vocabulary size = 2.', 'Vocabulary size = 2.')},
      {label: t('Назначаем ID', 'Assign IDs'), expression: "{'а':0,'м':1}", explanation: t('Порядок условный, но должен быть стабильным.', 'The order is arbitrary but must remain stable.')},
      {label: t('Encode', 'Encode'), expression: '[1,0,1,0]', explanation: t('Строка превращается в последовательность целых чисел.', 'The string becomes a sequence of integers.')},
      {label: t('Decode', 'Decode'), expression: 'мама', explanation: t('Обратное отображение восстанавливает токены.', 'The inverse mapping recovers the tokens.')},
    ],
    math: {
      lead: t('Tokenizer задаёт отображение между текстовыми токенами и целыми ID.', 'A tokenizer defines a mapping between text tokens and integer IDs.'),
      formula: 'encode: token → {0,…,V−1}',
      symbols: [
        {symbol: 'V', meaning: t('размер словаря', 'vocabulary size')},
        {symbol: 'T', meaning: t('длина последовательности токенов', 'token-sequence length')},
      ],
      byHand: [
        {label: t('V=2', 'V=2'), expression: 'IDs ∈ {0,1}', explanation: t('Достаточно одного из двух идентификаторов на символ.', 'Only two IDs are needed for the characters.')},
        {label: t('T=4', 'T=4'), expression: '[1,0,1,0]', explanation: t('Модель видит длину 4, а не «одно слово».', 'The model sees length 4, not “one word”.')},
      ],
      mechanism: t('Выбор токенизации меняет длину последовательностей, размер словаря и то, какие повторяющиеся части текста модель может переиспользовать. Позже BPE будет компромиссом между символами и целыми словами.', 'Tokenization changes sequence length, vocabulary size, and which recurring text pieces the model can reuse. BPE later provides a compromise between characters and whole words.'),
    },
    engineer: {
      goal: t('Напиши encode/decode для символьного tokenizer.', 'Write encode/decode for a character tokenizer.'),
      starterCode: `text = "мама"\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\n\ndef encode(s):\n    return ...`,
      checkpoints: [t('stoi преобразует символ → ID.', 'stoi maps character → ID.'), t('encode должен вернуть список чисел той же длины, что строка.', 'encode should return a list of integers with the same length as the string.')],
      challenge: t('Запиши list comprehension для encode.', 'Write the list comprehension for encode.'),
      expected: '[stoi[ch] for ch in s]',
      hint: t('Для каждого `ch` бери `stoi[ch]`.', 'For each `ch`, take `stoi[ch]`.'),
      solution: 'return [stoi[ch] for ch in s]',
    },
    researcher: {
      question: t('Как изменятся V и T при символьной и словной токенизации?', 'How do V and T change for character vs word tokenization?'),
      hypotheses: [t('Одинаково.', 'They are the same.'), t('Символы дают маленький V, но длинный T; слова — наоборот.', 'Characters give small V but long T; words tend to do the opposite.')],
      variables: [t('Независимая: стратегия tokenization.', 'Independent: tokenization strategy.'), t('Зависимые: vocabulary size V и средняя длина T.', 'Dependent: vocabulary size V and average sequence length T.')],
      procedure: [t('Возьми 5 предложений.', 'Take 5 sentences.'), t('Посчитай уникальные символы и уникальные слова.', 'Count unique characters and unique words.'), t('Сравни длину encoded-последовательностей.', 'Compare encoded sequence lengths.')],
      observations: [t('Character vocabulary меньше, но последовательности длиннее.', 'Character vocabulary is smaller, but sequences are longer.')],
      conclusion: t('Tokenizer — часть архитектуры системы: он меняет вычислительную задачу ещё до нейросети.', 'Tokenizer is part of the system architecture: it changes the computational problem before the neural network starts.'),
    },
  },
  'next-token': {
    visualTitle: t('Контекст превращается в распределение следующего токена', 'Context becomes a next-token distribution'),
    visualCaption: t('Языковая модель не обязана выбирать одно слово сразу — сначала она оценивает вероятности вариантов.', 'A language model need not choose one word immediately — it first scores possible continuations.'),
    visualNodes: [
      {label: t('context', 'context'), detail: t('Уже увиденные токены.', 'Tokens already seen.')},
      {label: t('logits', 'logits'), detail: t('Неограниченные числовые оценки каждого токена словаря.', 'Unbounded scores for each vocabulary token.')},
      {label: t('softmax', 'softmax'), detail: t('Преобразует scores в вероятности, сумма которых равна 1.', 'Turns scores into probabilities that sum to 1.')},
      {label: t('sample', 'sample'), detail: t('Следующий токен можно выбрать по распределению.', 'The next token can be sampled from the distribution.')},
    ],
    workedTitle: t('Разбор: три возможных продолжения', 'Worked example: three possible continuations'),
    workedScenario: t('После «кот» модель оценила logits для «спит», «ест», «красный»: [2,1,−1].', 'After “cat”, the model gives logits [2,1,−1] for “sleeps”, “eats”, “red”.'),
    workedSteps: [
      {label: t('Экспоненты', 'Exponentials'), expression: '[e²,e¹,e⁻¹]≈[7.39,2.72,0.37]', explanation: t('Все значения становятся положительными.', 'All values become positive.')},
      {label: t('Сумма', 'Sum'), expression: '≈10.48', explanation: t('Это нормировочный коэффициент.', 'This is the normalization constant.')},
      {label: t('Вероятности', 'Probabilities'), expression: '[0.705,0.260,0.035]', explanation: t('Теперь значения суммируются в 1.', 'Now the values sum to 1.')},
    ],
    math: {
      lead: t('Softmax превращает произвольные logits в распределение вероятностей.', 'Softmax turns arbitrary logits into a probability distribution.'),
      formula: 'pᵢ = exp(zᵢ) / Σⱼ exp(zⱼ)',
      symbols: [
        {symbol: 'zᵢ', meaning: t('logit токена i', 'logit for token i')},
        {symbol: 'pᵢ', meaning: t('вероятность токена i', 'probability of token i')},
      ],
      byHand: [
        {label: t('Logits', 'Logits'), expression: '[2,1,−1]', explanation: t('Это ещё не вероятности.', 'These are not probabilities yet.')},
        {label: t('Softmax', 'Softmax'), expression: '[0.705,0.260,0.035]', explanation: t('Больший logit получает большую вероятность.', 'Larger logits receive larger probabilities.')},
      ],
      mechanism: t('Во время обучения модель повышает вероятность правильного следующего токена относительно остальных. При генерации распределение можно использовать детерминированно или семплировать.', 'During training, the model raises the correct next token’s probability relative to others. During generation, the distribution can be used deterministically or sampled.'),
    },
    engineer: {
      goal: t('Нормализуй простые positive scores в вероятности.', 'Normalize simple positive scores into probabilities.'),
      starterCode: `scores = [7.39, 2.72, 0.37]\ntotal = sum(scores)\nprobs = [...]\nprint(probs, sum(probs))`,
      checkpoints: [t('Каждый score делится на общую сумму.', 'Each score is divided by the total sum.'), t('Сумма probs должна быть ≈1.', 'The sum of probs should be ≈1.')],
      challenge: t('Запиши list comprehension для `probs`.', 'Write the list comprehension for `probs`.'),
      expected: '[s / total for s in scores]',
      hint: t('Один и тот же `total` используется для всех элементов.', 'Use the same `total` for all elements.'),
      solution: 'probs = [s / total for s in scores]',
    },
    researcher: {
      question: t('Почему всегда брать argmax делает текст однообразнее?', 'Why does always taking argmax make text less diverse?'),
      hypotheses: [t('Не влияет.', 'It has no effect.'), t('Argmax каждый раз выбирает один и тот же самый вероятный вариант.', 'Argmax always chooses the single most likely option.')],
      variables: [t('Независимая: стратегия выбора token.', 'Independent: token selection strategy.'), t('Зависимая: разнообразие нескольких генераций.', 'Dependent: diversity across generations.')],
      procedure: [t('Сгенерируй 10 выборов argmax.', 'Generate 10 argmax choices.'), t('Сравни с 10 sample из [0.7,0.26,0.04].', 'Compare with 10 samples from [0.7,0.26,0.04].')],
      observations: [t('Argmax повторяет один вариант; sampling иногда выбирает менее вероятные.', 'Argmax repeats one option; sampling occasionally chooses less likely options.')],
      conclusion: t('Генерация — отдельное решение поверх обученного распределения вероятностей.', 'Generation is a separate decision layered on top of the learned probability distribution.'),
    },
  },
  'first-language-model': {
    visualTitle: t('Bigram смотрит только на один предыдущий токен', 'A bigram looks at only one previous token'),
    visualCaption: t('Это уже настоящая вероятностная языковая модель — и одновременно наглядный пример слишком короткого контекста.', 'This is already a real probabilistic language model — and a clear example of context that is too short.'),
    visualNodes: [
      {label: t('tokenₜ₋₁', 'tokenₜ₋₁'), detail: t('Единственный контекст модели.', 'The model’s only context.')},
      {label: t('counts row', 'counts row'), detail: t('Сколько раз после этого токена встречался каждый следующий.', 'How often each next token followed this token.')},
      {label: t('P(next|prev)', 'P(next|prev)'), detail: t('Нормализованные частоты переходов.', 'Normalized transition frequencies.')},
      {label: t('sample next', 'sample next'), detail: t('Выбираем следующий токен и повторяем процесс.', 'Choose the next token and repeat.')},
    ],
    workedTitle: t('Разбор: строим одну строку bigram-таблицы', 'Worked example: build one bigram row'),
    workedScenario: t('В корпусе после токена «я» три раза встречается «иду» и один раз «вижу».', 'In a corpus, token “I” is followed by “go” three times and “see” once.'),
    workedSteps: [
      {label: t('Счётчики', 'Counts'), expression: '{иду:3, вижу:1}', explanation: t('Это сырые наблюдения переходов.', 'These are raw transition observations.')},
      {label: t('Всего', 'Total'), expression: '3+1=4', explanation: t('Нормируем по всем продолжениям после «я».', 'Normalize across all continuations after “I”.')},
      {label: t('Вероятности', 'Probabilities'), expression: 'P(иду|я)=0.75, P(вижу|я)=0.25', explanation: t('Получили distribution следующего токена.', 'We obtained a next-token distribution.')},
      {label: t('Граница модели', 'Model limit'), expression: 'P(next | only previous token)', explanation: t('Слова до «я» полностью забыты.', 'Everything before “I” is forgotten.')},
    ],
    math: {
      lead: t('Bigram моделирует условную вероятность следующего токена по одному предыдущему.', 'A bigram models the conditional probability of the next token given one previous token.'),
      formula: 'P(xₜ | xₜ₋₁)',
      symbols: [
        {symbol: 'xₜ₋₁', meaning: t('предыдущий токен — весь доступный контекст', 'previous token — all available context')},
        {symbol: 'xₜ', meaning: t('следующий токен', 'next token')},
      ],
      byHand: [
        {label: t('Counts', 'Counts'), expression: '[3,1]', explanation: t('Переходы из одного состояния.', 'Transitions from one state.')},
        {label: t('Normalize', 'Normalize'), expression: '[0.75,0.25]', explanation: t('Получаем вероятности.', 'Obtain probabilities.')},
        {label: t('NLL', 'NLL'), expression: '−log P(correct)', explanation: t('На обучении штрафуем низкую вероятность правильного продолжения.', 'During training, low probability on the correct continuation is penalized.')},
      ],
      mechanism: t('Bigram можно обучить простым подсчётом частот или параметризованной матрицей logits. В обоих случаях главный предел один: модель не видит дальний контекст. Именно эта поломка приведёт нас к embeddings, context windows и attention.', 'A bigram can be trained by simple counting or with a parameterized logits matrix. Either way, its main limitation is the same: it cannot see distant context. That failure leads naturally to embeddings, context windows, and attention.'),
    },
    engineer: {
      goal: t('Собери частоты bigram и функцию вероятности.', 'Build bigram counts and a probability function.'),
      starterCode: `counts = {\n    "я": {"иду": 3, "вижу": 1}\n}\n\ndef probability(prev, nxt):\n    row = counts[prev]\n    total = sum(row.values())\n    return ...`,
      checkpoints: [t('Берём только строку текущего previous token.', 'Use only the row for the current previous token.'), t('Счётчик конкретного nxt делится на сумму строки.', 'Divide the specific next-token count by the row total.')],
      challenge: t('Запиши выражение P(nxt | prev).', 'Write P(nxt | prev).'),
      expected: 'row.get(nxt, 0) / total',
      hint: t('`row.get(nxt, 0)` безопасно возвращает 0 для невиданного перехода.', '`row.get(nxt, 0)` safely returns 0 for an unseen transition.'),
      solution: 'return row.get(nxt, 0) / total',
    },
    researcher: {
      question: t('Можно ли показать два контекста, которые Bigram считает одинаковыми, хотя смысл требует разного продолжения?', 'Can we find two contexts that a bigram treats identically even though meaning demands different continuations?'),
      hypotheses: [t('Нет: предыдущего токена достаточно.', 'No: one previous token is enough.'), t('Да: дальний контекст может менять правильное продолжение.', 'Yes: distant context can change the correct continuation.')],
      variables: [t('Независимая: дальние слова при одинаковом последнем токене.', 'Independent: distant words while the last token stays the same.'), t('Зависимая: желаемое следующее слово.', 'Dependent: desired next word.')],
      procedure: [t('Придумай две фразы с одинаковым последним token.', 'Create two phrases ending in the same last token.'), t('Сделай так, чтобы более ранний контекст требовал разных продолжений.', 'Make earlier context require different continuations.'), t('Проверь, какую информацию видит Bigram.', 'Check what information the bigram can see.')],
      observations: [t('Для Bigram оба состояния идентичны, потому что xₜ₋₁ одинаков.', 'For the bigram, both states are identical because xₜ₋₁ is the same.')],
      conclusion: t('Первая языковая модель работает, но её сознательно короткая память создаёт следующий учебный вопрос: как представить и использовать более длинный контекст?', 'The first language model works, but its deliberately short memory creates the next learning question: how can a model represent and use longer context?'),
    },
  },
};

export function getChapterEnrichment(id: StarterLessonId) {
  return chapterEnrichment[id];
}
