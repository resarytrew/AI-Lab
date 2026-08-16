import type {LocalizedText, StarterLessonId} from './learning-path';

export type TheoryTerm = {
  term: LocalizedText;
  definition: LocalizedText;
};

export type TheorySection = {
  title: LocalizedText;
  body: LocalizedText;
};

export type LessonTheory = {
  intro: LocalizedText;
  sections: readonly TheorySection[];
  terms: readonly TheoryTerm[];
  example: LocalizedText;
  misconception: LocalizedText;
  takeaway: LocalizedText;
};

export const lessonTheory: Record<StarterLessonId, LessonTheory> = {
  'smart-machine': {
    intro: {
      ru: 'В быту словом «умный» называют очень разные вещи: быстрый калькулятор, навигатор, голосовой помощник и человека. Но скорость вычислений сама по себе ещё не показывает интеллект. Полезнее смотреть не на одно свойство, а на набор способностей системы.',
      en: 'In everyday speech, many different things are called smart: a fast calculator, a navigator, a voice assistant, and a person. But computation speed alone does not demonstrate intelligence. It is more useful to look at a set of system abilities.',
    },
    sections: [
      {
        title: {ru: 'Интеллект как набор способностей', en: 'Intelligence as a set of abilities'},
        body: {ru: 'Интеллектуальная система может использовать накопленные знания, учитывать контекст, находить решение в новой ситуации, учиться на опыте и планировать действия. Не каждая система обязана обладать всеми способностями одинаково хорошо.', en: 'An intelligent system can use stored knowledge, consider context, solve new situations, learn from experience, and plan actions. A system does not have to possess every ability equally well.'},
      },
      {
        title: {ru: 'Почему калькулятор — важный контрпример', en: 'Why the calculator is an important counterexample'},
        body: {ru: 'Калькулятор считает быстрее человека, но его поведение почти полностью задаётся заранее. Он не переносит опыт на новую задачу и не выясняет, что означает введённое число. Это помогает отделить вычислительную мощность от более сложных интеллектуальных функций.', en: 'A calculator computes faster than a person, but its behavior is almost completely predetermined. It does not transfer experience to a new task or infer what an entered number means. This separates computational power from richer intelligent functions.'},
      },
      {
        title: {ru: 'Узкий и общий интеллект', en: 'Narrow and general intelligence'},
        body: {ru: 'Современные системы обычно сильны в ограниченном классе задач. Шахматная программа может превосходить человека в шахматах и одновременно ничего не понимать в кулинарии. Поэтому слово «интеллект» всегда нужно связывать с конкретными способностями и задачами.', en: 'Modern systems are usually strong in a limited class of tasks. A chess program may outperform humans at chess while knowing nothing about cooking. So intelligence should always be tied to specific abilities and tasks.'},
      },
    ],
    terms: [
      {term: {ru: 'Интеллектуальная способность', en: 'Intelligent ability'}, definition: {ru: 'Наблюдаемое умение системы: учиться, рассуждать, понимать контекст, планировать или использовать знания.', en: 'An observable system ability such as learning, reasoning, understanding context, planning, or using knowledge.'}},
      {term: {ru: 'Узкий ИИ', en: 'Narrow AI'}, definition: {ru: 'Система, хорошо решающая ограниченный класс задач.', en: 'A system that performs well on a limited class of tasks.'}},
    ],
    example: {ru: 'Навигатор может перестроить маршрут после перекрытия дороги. Важна не скорость расчёта, а способность использовать карту, текущее положение, цель и новую информацию о препятствии.', en: 'A navigator can reroute after a road closure. The important part is not raw speed but the ability to use a map, current position, a goal, and new obstacle information.'},
    misconception: {ru: '«Если программа делает что-то лучше человека, она умнее человека вообще». Нет: превосходство в одной задаче ничего не говорит обо всех остальных способностях.', en: '“If a program does one thing better than a human, it is generally smarter than a human.” No: superiority in one task says nothing about all other abilities.'},
    takeaway: {ru: 'Не спрашивай только «умная ли система?». Спрашивай: какие способности она демонстрирует, в каких задачах и где её границы.', en: 'Do not ask only “Is the system smart?” Ask which abilities it demonstrates, in which tasks, and where its limits are.'},
  },
  'data-to-meaning': {
    intro: {
      ru: 'Компьютер получает мир не так, как человек. Для него изображение, звук, текст и показание термометра сначала превращаются в числа или символы. Но сами числа ещё не содержат понятного нам смысла: смысл появляется только вместе с контекстом.',
      en: 'A computer receives the world differently from a person. Images, sound, text, and thermometer readings first become numbers or symbols. But numbers alone do not contain human meaning; meaning appears with context.',
    },
    sections: [
      {title: {ru: 'Данные', en: 'Data'}, body: {ru: 'Данные — это зафиксированные значения, сигналы или символы. Число 42 — данные, но без единиц измерения, времени и объекта наблюдения почти невозможно понять, что оно означает.', en: 'Data is recorded values, signals, or symbols. The number 42 is data, but without units, time, and the observed object it is difficult to know what it means.'}},
      {title: {ru: 'Информация', en: 'Information'}, body: {ru: 'Когда мы добавляем контекст, данные становятся информацией. «42 °C, температура воздуха в тени» уже сообщает конкретный факт. Контекст отвечает на вопросы: что измерили, где, когда и в каких единицах.', en: 'When context is added, data becomes information. “42 °C, air temperature in the shade” communicates a specific fact. Context answers what was measured, where, when, and in what units.'}},
      {title: {ru: 'Знание', en: 'Knowledge'}, body: {ru: 'Знание появляется, когда информацию можно использовать для вывода или действия. Если мы знаем, что при 42 °C возрастает риск перегрева, то можем принять решение: ограничить нагрузку, искать тень, пить воду. Знание связывает факты с моделями мира и последствиями.', en: 'Knowledge appears when information can support a conclusion or action. Knowing that 42 °C increases heat risk lets us decide to reduce activity, seek shade, or drink water. Knowledge connects facts with models of the world and consequences.'}},
    ],
    terms: [
      {term: {ru: 'Данные', en: 'Data'}, definition: {ru: 'Зафиксированные значения или символы без обязательной интерпретации.', en: 'Recorded values or symbols without required interpretation.'}},
      {term: {ru: 'Информация', en: 'Information'}, definition: {ru: 'Данные, получившие контекст и смысл.', en: 'Data supplied with context and meaning.'}},
      {term: {ru: 'Знание', en: 'Knowledge'}, definition: {ru: 'Информация, связанная с выводами, правилами или возможностью действовать.', en: 'Information connected to conclusions, rules, or possible actions.'}},
    ],
    example: {ru: 'Запись «120» ничего не говорит сама по себе. «Пульс 120 ударов в минуту после бега» — информация. «Для этого человека такой пульс после короткой разминки слишком высок» — уже знание, потому что мы связали измерение с нормой и ситуацией.', en: '“120” says little by itself. “Heart rate 120 bpm after running” is information. “For this person, that rate after a short warm-up is unusually high” is knowledge because the measurement is related to a norm and situation.'},
    misconception: {ru: '«Чем больше данных, тем больше знаний». Нет. Миллион чисел без структуры и контекста может быть менее полезен, чем десять хорошо описанных наблюдений.', en: '“More data always means more knowledge.” No. A million numbers without structure or context may be less useful than ten well-described observations.'},
    takeaway: {ru: 'ИИ работает с данными, но полезность появляется только тогда, когда данные связаны с контекстом, задачей и способом сделать вывод.', en: 'AI works with data, but usefulness appears only when data is connected to context, a task, and a way to draw conclusions.'},
  },
  'knowledge-as-rules': {
    intro: {
      ru: 'Один из самых прямых способов передать машине человеческое знание — превратить его в правила. Если условие выполнено, система делает определённый вывод или действие. Такие системы важны исторически и до сих пор полезны там, где правила ясны и стабильны.',
      en: 'One of the most direct ways to give a machine human knowledge is to turn it into rules. If a condition is satisfied, the system makes a conclusion or action. Rule systems are historically important and remain useful where rules are clear and stable.',
    },
    sections: [
      {title: {ru: 'Продукционное правило', en: 'Production rule'}, body: {ru: 'Форма ЕСЛИ условие → ТО действие называется продукционным правилом. Например: ЕСЛИ температура ниже 0 °C И есть осадки → ТО возможно обледенение. Машина проверяет условие буквально — она не «понимает» его так, как человек.', en: 'The form IF condition → THEN action is called a production rule. For example: IF temperature is below 0 °C AND there is precipitation → THEN icing is possible. The machine checks the condition literally; it does not understand it like a person.'}},
      {title: {ru: 'Цепочка вывода', en: 'Inference chain'}, body: {ru: 'Правила можно соединять. Первое правило выводит новый факт, а этот факт становится условием для следующего правила. Так возникает простейший механизм рассуждения: факты → применимые правила → новые факты.', en: 'Rules can be chained. One rule produces a new fact, which becomes a condition for another rule. This creates a simple reasoning mechanism: facts → applicable rules → new facts.'}},
      {title: {ru: 'Когда правила хороши', en: 'When rules work well'}, body: {ru: 'Rule-based подход удобен, если область хорошо описывается точными условиями: проверки доступа, расчёт тарифа, технологический регламент. Его преимущество — понятность: можно проследить, какое правило сработало.', en: 'Rule-based approaches work well when a domain is described by precise conditions: access checks, tariff calculations, technical procedures. Their advantage is transparency: you can trace which rule fired.'}},
    ],
    terms: [
      {term: {ru: 'Продукционное правило', en: 'Production rule'}, definition: {ru: 'Явно записанная зависимость вида ЕСЛИ → ТО.', en: 'An explicitly written IF → THEN dependency.'}},
      {term: {ru: 'Вывод', en: 'Inference'}, definition: {ru: 'Получение нового факта из известных фактов и правил.', en: 'Deriving a new fact from known facts and rules.'}},
    ],
    example: {ru: 'ЕСЛИ пользователь ввёл верный PIN → разрешить вход. Здесь заранее известны и условие, и правильное действие. Для такой задачи обучение модели не нужно.', en: 'IF the user entered the correct PIN → allow access. Both the condition and correct action are known in advance, so machine learning is unnecessary.'},
    misconception: {ru: '«Если правил очень много, система автоматически становится интеллектуальной». Количество правил не решает проблему неизвестных ситуаций и исключений.', en: '“If there are enough rules, the system automatically becomes intelligent.” More rules do not solve unknown situations and exceptions.'},
    takeaway: {ru: 'Правила позволяют явно записать часть знаний и рассуждений машины, но они работают только в границах ситуаций, которые мы смогли предусмотреть.', en: 'Rules let us explicitly encode some machine knowledge and reasoning, but only within situations we anticipated.'},
  },
  'where-rules-break': {
    intro: {ru: 'Проблема правил появляется, когда реальный мир слишком разнообразен. Для каждой новой ситуации приходится добавлять исключение, затем исключение к исключению. В какой-то момент система становится хрупкой и почти невозможно заранее перечислить все случаи.', en: 'Rules struggle when the real world is too diverse. Each new situation requires another exception, then exceptions to exceptions. Eventually the system becomes brittle and it is nearly impossible to enumerate every case.'},
    sections: [
      {title: {ru: 'Комбинаторный взрыв', en: 'Combinatorial explosion'}, body: {ru: 'Чем больше признаков и вариантов, тем быстрее растёт число сочетаний. Если у нас десять признаков с двумя вариантами каждый, уже возможны 1024 комбинации. Для изображений, речи и языка число вариантов практически неограниченно.', en: 'The more features and options we have, the faster combinations grow. Ten binary features already create 1,024 combinations. For images, speech, and language, the number of possibilities is effectively enormous.'}},
      {title: {ru: 'Хрупкость правил', en: 'Rule brittleness'}, body: {ru: 'Правило может отлично работать на знакомых примерах и неожиданно сломаться на небольшом изменении. «У кошки есть уши, усы и четыре лапы» не отличит кошку от множества других животных и не справится с фотографией, где лапы не видны.', en: 'A rule may work well on familiar examples and fail after a small change. “A cat has ears, whiskers, and four legs” cannot distinguish cats from many other animals and fails when legs are not visible.'}},
      {title: {ru: 'Почему возникает обучение', en: 'Why learning becomes necessary'}, body: {ru: 'Если человеку трудно сформулировать точное правило, но легко показать много правильных примеров, появляется другая стратегия: не записывать все условия вручную, а подобрать внутренние параметры системы по данным.', en: 'When it is hard to state an exact rule but easy to provide many correct examples, a different strategy becomes useful: instead of writing every condition manually, fit internal system parameters from data.'}},
    ],
    terms: [
      {term: {ru: 'Хрупкость', en: 'Brittleness'}, definition: {ru: 'Свойство системы ломаться при небольшом отклонении от предусмотренных случаев.', en: 'A tendency to fail when inputs differ slightly from anticipated cases.'}},
      {term: {ru: 'Обобщение', en: 'Generalization'}, definition: {ru: 'Способность применять найденную закономерность к новым примерам.', en: 'The ability to apply a learned pattern to new examples.'}},
    ],
    example: {ru: 'Фильтр спама на правилах «если есть слово БЕСПЛАТНО — это спам» легко обойти заменой слова или контекстом. Обучаемая модель может учитывать сочетание многих слабых признаков.', en: 'A spam filter using the rule “if the word FREE appears, it is spam” is easy to evade or confuse by context. A learned model can combine many weaker signals.'},
    misconception: {ru: '«Машинное обучение всегда лучше правил». Нет. Если правило точное, простое и устойчивое, обычная программа часто надёжнее и понятнее.', en: '“Machine learning is always better than rules.” No. If a rule is exact, simple, and stable, ordinary programming is often more reliable and interpretable.'},
    takeaway: {ru: 'Обучение нужно не потому, что правила плохи, а потому, что некоторые полезные закономерности слишком трудно записать вручную.', en: 'Learning is needed not because rules are bad, but because some useful patterns are too difficult to write explicitly.'},
  },
  'learn-from-examples': {
    intro: {ru: 'Обучение начинается с примеров. Мы показываем системе пары «вход → правильный ответ» и хотим, чтобы она нашла зависимость, которая будет работать не только на этих примерах, но и на новых.', en: 'Learning starts with examples. We show the system input → correct answer pairs and want it to discover a relationship that works not only on those examples but also on new ones.'},
    sections: [
      {title: {ru: 'Запоминание и обобщение', en: 'Memorization and generalization'}, body: {ru: 'Если модель просто хранит ответы для каждого учебного примера, она ничего не сможет сделать с новым входом. Настоящая цель обучения — обнаружить устойчивую закономерность. Поэтому качество всегда нужно проверять на данных, которых модель не видела при обучении.', en: 'If a model merely stores answers for each training example, it cannot handle a new input. The real goal is to discover a stable pattern. That is why quality must be checked on data the model did not see during training.'}},
      {title: {ru: 'Примеры задают задачу', en: 'Examples define the task'}, body: {ru: 'В supervised learning правильный ответ обычно называют target или label. Пары входов и targets задают системе, какое поведение мы хотим получить. Но они не сообщают прямо, какое внутреннее правило нужно использовать.', en: 'In supervised learning, the correct answer is usually called a target or label. Input-target pairs specify the desired behavior, but they do not directly state the internal rule to use.'}},
      {title: {ru: 'Что значит «научилась»', en: 'What “learned” means'}, body: {ru: 'Модель считается полезной не потому, что хорошо отвечает на тренировочные примеры, а потому, что сохраняет качество на новых похожих ситуациях. Это и есть обобщение.', en: 'A model is useful not because it answers training examples well, but because it maintains quality on new, similar situations. That is generalization.'}},
    ],
    terms: [
      {term: {ru: 'Обучающий пример', en: 'Training example'}, definition: {ru: 'Вход вместе с ожидаемым правильным результатом.', en: 'An input together with its expected correct result.'}},
      {term: {ru: 'Target / label', en: 'Target / label'}, definition: {ru: 'Правильный ответ, с которым сравнивают предсказание модели.', en: 'The correct answer used to compare with a model prediction.'}},
      {term: {ru: 'Обобщение', en: 'Generalization'}, definition: {ru: 'Работа на новых примерах, а не только на запомненных.', en: 'Working on new examples rather than only memorized ones.'}},
    ],
    example: {ru: 'Если ученику показать решения 2+2, 3+3 и 4+4, а затем он решит 7+7, значит он понял операцию сложения, а не просто запомнил три ответа. От модели мы хотим похожего поведения.', en: 'If a student sees 2+2, 3+3, and 4+4 and then solves 7+7, the student understood addition rather than memorized three answers. We want similar behavior from a model.'},
    misconception: {ru: '«Если loss на обучающих данных почти нулевой, модель отличная». Низкая ошибка на знакомых примерах может означать простое запоминание.', en: '“If training loss is almost zero, the model is excellent.” Low error on familiar examples may simply mean memorization.'},
    takeaway: {ru: 'Обучение — это поиск закономерности по примерам, а критерий успеха — перенос этой закономерности на новые данные.', en: 'Learning is finding a pattern from examples, and success means transferring that pattern to new data.'},
  },
  'trainable-parameters': {
    intro: {ru: 'Чтобы модель могла учиться, внутри неё должно быть что-то изменяемое. Эти изменяемые числа называются параметрами. Алгоритм обучения не переписывает всю программу — он постепенно подбирает значения параметров.', en: 'For a model to learn, something inside it must be adjustable. These adjustable numbers are called parameters. Training does not rewrite the whole program; it gradually chooses parameter values.'},
    sections: [
      {title: {ru: 'Параметры модели', en: 'Model parameters'}, body: {ru: 'В формуле prediction = x × w + b числа w и b — параметры. x приходит извне как вход. Во время обучения x не меняют, а w и b можно корректировать так, чтобы предсказания лучше совпадали с примерами.', en: 'In prediction = x × w + b, w and b are parameters. x arrives as input. During training, x is not changed; w and b are adjusted so predictions better match examples.'}},
      {title: {ru: 'Weight и bias', en: 'Weight and bias'}, body: {ru: 'Weight w определяет, насколько сильно вход влияет на результат. Bias b позволяет сдвинуть результат независимо от входа. Вместе они задают простое семейство возможных правил, из которых обучение выбирает подходящее.', en: 'Weight w controls how strongly the input affects the output. Bias b shifts the result independently of the input. Together they define a family of possible rules from which training selects one.'}},
      {title: {ru: 'Модель как семейство функций', en: 'A model as a family of functions'}, body: {ru: 'Пока параметры неизвестны, у нас не одна функция, а множество возможных функций. Обучение — процедура выбора конкретной функции через подбор параметров.', en: 'Before parameters are known, we do not have one function but many possible functions. Training chooses a specific function by fitting parameters.'}},
    ],
    terms: [
      {term: {ru: 'Параметр', en: 'Parameter'}, definition: {ru: 'Изменяемое число внутри модели, которое подбирается в процессе обучения.', en: 'An adjustable number inside a model that is fitted during training.'}},
      {term: {ru: 'Weight', en: 'Weight'}, definition: {ru: 'Параметр, масштабирующий влияние входа.', en: 'A parameter that scales the influence of an input.'}},
      {term: {ru: 'Bias', en: 'Bias'}, definition: {ru: 'Параметр-сдвиг, добавляемый к взвешенной сумме.', en: 'A shift parameter added to a weighted sum.'}},
    ],
    example: {ru: 'Если истинное правило y = 2x + 1, то w = 2 и b = 1. Но модель сначала этого не знает. Она может начать, например, с w = 0.3 и b = 0 и постепенно изменить их.', en: 'If the true rule is y = 2x + 1, then w = 2 and b = 1. But the model does not know this initially. It might start with w = 0.3 and b = 0 and gradually change them.'},
    misconception: {ru: '«Параметры — это входные данные». Нет. Вход меняется от примера к примеру, а параметры принадлежат модели и сохраняются между примерами.', en: '“Parameters are input data.” No. Inputs change from example to example; parameters belong to the model and persist across examples.'},
    takeaway: {ru: 'Обучаемая модель отличается от фиксированного правила тем, что содержит параметры, значения которых можно подобрать по данным.', en: 'A trainable model differs from a fixed rule because it contains parameters whose values can be fitted from data.'},
  },
  'measure-error': {
    intro: {ru: 'Чтобы автоматически улучшать модель, машине нужен числовой ответ на вопрос «насколько плохо получилось?». Для этого используют функцию потерь — loss. Она превращает качество предсказания в число.', en: 'To improve a model automatically, the machine needs a numerical answer to “how bad was that prediction?” A loss function provides this by turning prediction quality into a number.'},
    sections: [
      {title: {ru: 'Prediction и target', en: 'Prediction and target'}, body: {ru: 'Prediction — ответ модели. Target — правильный ответ из данных. Сравнивая их, мы получаем ошибку конкретного примера.', en: 'Prediction is the model output. Target is the correct answer from the data. Comparing them gives the error for a particular example.'}},
      {title: {ru: 'Зачем нужна функция loss', en: 'Why a loss function is needed'}, body: {ru: 'Алгоритм обучения должен сравнивать разные состояния модели. Если loss стал меньше, новая версия параметров обычно лучше соответствует нашей цели. Поэтому loss превращает задачу обучения в задачу минимизации числа.', en: 'Training must compare different model states. If loss decreases, the new parameters usually match our objective better. Loss turns learning into minimizing a number.'}},
      {title: {ru: 'Разные задачи — разные loss', en: 'Different tasks use different losses'}, body: {ru: 'Для числового предсказания можно измерять абсолютную или квадратичную ошибку. Для классификации и языковых моделей часто используют cross-entropy. Выбор loss определяет, что именно модель считает плохой ошибкой.', en: 'Numeric prediction may use absolute or squared error. Classification and language models often use cross-entropy. The choice of loss determines what the model treats as a bad mistake.'}},
    ],
    terms: [
      {term: {ru: 'Loss', en: 'Loss'}, definition: {ru: 'Число, измеряющее несоответствие предсказания цели.', en: 'A number measuring mismatch between prediction and target.'}},
      {term: {ru: 'Target', en: 'Target'}, definition: {ru: 'Ожидаемый правильный результат.', en: 'The expected correct result.'}},
    ],
    example: {ru: 'Target = 10, prediction = 8. Абсолютный loss равен |8 − 10| = 2. Если другая версия модели выдаёт 9.5, её loss = 0.5, значит она ближе к цели.', en: 'Target = 10, prediction = 8. Absolute loss is |8 − 10| = 2. If another model outputs 9.5, its loss is 0.5, so it is closer to the target.'},
    misconception: {ru: '«Loss — это процент правильных ответов». Нет. Accuracy и loss — разные метрики; loss обычно даёт более подробный сигнал для обучения.', en: '“Loss is the percentage of correct answers.” No. Accuracy and loss are different metrics; loss usually provides a richer training signal.'},
    takeaway: {ru: 'Loss создаёт измеримую цель обучения: изменить параметры так, чтобы ошибка становилась меньше.', en: 'Loss creates a measurable training objective: change parameters so the error becomes smaller.'},
  },
  'automatic-improvement': {
    intro: {ru: 'Если мы умеем измерять loss, можно перебрать несколько вариантов параметров и оставить тот, где ошибка меньше. Это уже автоматическое улучшение: машина сама сравнивает кандидатов по числовому критерию.', en: 'Once we can measure loss, we can try parameter values and keep the one with lower error. This is already automatic improvement: the machine compares candidates using a numerical criterion.'},
    sections: [
      {title: {ru: 'Поиск в пространстве параметров', en: 'Searching parameter space'}, body: {ru: 'Каждый набор параметров — точка в пространстве возможных моделей. Даже для одного w вариантов бесконечно много. Для миллионов параметров полный перебор невозможен, поэтому нужны методы, которые используют структуру loss.', en: 'Each parameter set is a point in the space of possible models. Even one w has infinitely many values. With millions of parameters, exhaustive search is impossible, so methods must exploit the structure of loss.'}},
      {title: {ru: 'Шаг улучшения', en: 'Improvement step'}, body: {ru: 'Простейшая стратегия: немного изменить параметр, пересчитать loss и проверить, стало ли лучше. Это ещё не полноценный gradient descent, но уже основная идея обратной связи: изменение → измерение → решение.', en: 'A simple strategy is to slightly change a parameter, recompute loss, and see whether it improved. This is not yet full gradient descent, but it already contains the feedback loop: change → measure → decide.'}},
      {title: {ru: 'Почему нужен более умный способ', en: 'Why a smarter method is needed'}, body: {ru: 'С одним параметром можно пробовать варианты. С миллионами параметров такой перебор становится слишком дорогим. Следующая идея — вычислить направление, в котором loss уменьшается быстрее всего.', en: 'Trying candidates is feasible with one parameter. With millions, it becomes too expensive. The next idea is to compute a direction in which loss decreases efficiently.'}},
    ],
    terms: [
      {term: {ru: 'Пространство параметров', en: 'Parameter space'}, definition: {ru: 'Все возможные комбинации значений параметров модели.', en: 'All possible combinations of model parameter values.'}},
      {term: {ru: 'Шаг обновления', en: 'Update step'}, definition: {ru: 'Одно изменение параметров с целью уменьшить loss.', en: 'One change to parameters intended to reduce loss.'}},
    ],
    example: {ru: 'При w = 1.5 loss = 2.0. Проверяем w = 1.6 и получаем loss = 1.6. Значит движение в сторону большего w на этом участке улучшает модель.', en: 'At w = 1.5, loss = 2.0. Trying w = 1.6 gives loss = 1.6. So moving toward larger w improves the model in this region.'},
    misconception: {ru: '«Достаточно всегда менять параметр в одну сторону». Направление улучшения зависит от текущей точки; после прохождения минимума то же изменение начнёт ухудшать loss.', en: '“Just keep changing the parameter in one direction.” The improving direction depends on the current point; after passing a minimum, the same move will increase loss.'},
    takeaway: {ru: 'Автоматическое обучение начинается с обратной связи: изменить параметры, измерить loss и использовать результат для следующего шага.', en: 'Automatic learning begins with feedback: change parameters, measure loss, and use the result for the next step.'},
  },
  'gradient-direction': {
    intro: {ru: 'Чтобы не перебирать параметры вслепую, нужно понимать, как loss меняется при небольшом изменении параметра. Производная и градиент дают именно такую информацию: направление и чувствительность.', en: 'Instead of trying parameters blindly, we want to know how loss changes when a parameter changes slightly. Derivatives and gradients provide exactly this information: direction and sensitivity.'},
    sections: [
      {title: {ru: 'Производная как чувствительность', en: 'Derivative as sensitivity'}, body: {ru: 'Если небольшое увеличение w увеличивает loss, производная положительна. Если увеличение w уменьшает loss, производная отрицательна. Модуль показывает, насколько чувствителен loss к этому параметру.', en: 'If a small increase in w increases loss, the derivative is positive. If increasing w decreases loss, it is negative. Magnitude shows how sensitive loss is to that parameter.'}},
      {title: {ru: 'Градиент', en: 'Gradient'}, body: {ru: 'Когда параметров много, у каждого есть своя производная. Собранные вместе они образуют градиент — вектор, показывающий направление самого быстрого роста loss. Поэтому для уменьшения loss мы движемся примерно в противоположную сторону.', en: 'With many parameters, each has its own derivative. Together they form the gradient, a vector pointing toward fastest loss increase. To reduce loss, we move roughly in the opposite direction.'}},
      {title: {ru: 'Learning rate', en: 'Learning rate'}, body: {ru: 'Мы не прыгаем сразу очень далеко. Learning rate задаёт размер шага. Слишком большой шаг может перескочить хорошую область, слишком маленький — сделать обучение очень медленным.', en: 'We do not jump arbitrarily far. Learning rate controls step size. Too large a step can overshoot a good region; too small makes training very slow.'}},
    ],
    terms: [
      {term: {ru: 'Производная', en: 'Derivative'}, definition: {ru: 'Мера того, как быстро меняется одна величина при изменении другой.', en: 'A measure of how rapidly one quantity changes when another changes.'}},
      {term: {ru: 'Градиент', en: 'Gradient'}, definition: {ru: 'Набор производных loss по всем параметрам.', en: 'The collection of loss derivatives with respect to all parameters.'}},
      {term: {ru: 'Learning rate', en: 'Learning rate'}, definition: {ru: 'Коэффициент, определяющий размер обновления параметров.', en: 'A coefficient controlling the size of parameter updates.'}},
    ],
    example: {ru: 'Если loss(w−ε)=2.4, loss(w)=2.0, loss(w+ε)=1.6, то локально увеличение w уменьшает ошибку. Это конечная разность — приближённый способ почувствовать знак производной.', en: 'If loss(w−ε)=2.4, loss(w)=2.0, and loss(w+ε)=1.6, then locally increasing w reduces error. This finite difference approximates the sign of the derivative.'},
    misconception: {ru: '«Градиент сразу говорит правильные параметры». Нет. Он сообщает локальное направление изменения; обучение состоит из множества последовательных шагов.', en: '“The gradient directly gives the correct parameters.” No. It gives a local change direction; training consists of many successive steps.'},
    takeaway: {ru: 'Градиент превращает слепой перебор в направленное движение по поверхности loss.', en: 'The gradient turns blind trial-and-error into directed movement over the loss surface.'},
  },
  'first-training-loop': {
    intro: {ru: 'Теперь все части складываются в цикл обучения. Модель делает prediction, мы считаем loss, определяем, как изменить параметры, обновляем их и повторяем процесс. Один проход почти ничего не решает — сила обучения в повторении.', en: 'Now the pieces form a training loop. The model makes a prediction, we compute loss, determine how to change parameters, update them, and repeat. One pass does little; the power of learning comes from repetition.'},
    sections: [
      {title: {ru: 'Forward pass', en: 'Forward pass'}, body: {ru: 'На прямом проходе вход проходит через текущую модель и превращается в prediction. Здесь используются текущие значения параметров.', en: 'During the forward pass, input flows through the current model and becomes a prediction using current parameter values.'}},
      {title: {ru: 'Ошибка и обновление', en: 'Error and update'}, body: {ru: 'После сравнения prediction с target получаем loss. Затем вычисляем информацию о том, какие параметры ответственны за ошибку, и выполняем небольшой update.', en: 'After comparing prediction with target, we obtain loss. Then we compute information about which parameters contributed to the error and make a small update.'}},
      {title: {ru: 'Итерации', en: 'Iterations'}, body: {ru: 'Каждый update немного меняет модель. После многих шагов loss обычно снижается, а predictions приближаются к targets. Позже один и тот же принцип будет работать и для миллионов параметров GPT.', en: 'Each update changes the model slightly. Over many steps, loss usually decreases and predictions approach targets. Later the same principle will train millions of GPT parameters.'}},
    ],
    terms: [
      {term: {ru: 'Training loop', en: 'Training loop'}, definition: {ru: 'Повторяющийся цикл prediction → loss → gradients/update.', en: 'A repeated prediction → loss → gradients/update cycle.'}},
      {term: {ru: 'Iteration / step', en: 'Iteration / step'}, definition: {ru: 'Один шаг изменения параметров.', en: 'One parameter update step.'}},
    ],
    example: {ru: 'w начинается с 0.0. После каждого шага prediction для x=4 приближается к target=8, loss уменьшается, а w движется к 2.0.', en: 'w starts at 0.0. After each step, the prediction for x=4 approaches target=8, loss falls, and w moves toward 2.0.'},
    misconception: {ru: '«Модель обучилась, если один пример предсказывается идеально». Настоящее обучение оценивают на множестве примеров, включая новые.', en: '“The model is trained if one example is predicted perfectly.” Real training is evaluated across many examples, including unseen ones.'},
    takeaway: {ru: 'Обучение — это не магический момент, а повторяемый алгоритмический цикл корректировки параметров по сигналу ошибки.', en: 'Training is not a magical moment; it is a repeated algorithmic loop that adjusts parameters using an error signal.'},
  },
  'first-neuron': {
    intro: {ru: 'Формула с весами и bias, которую мы уже обучали, почти совпадает с базовой частью искусственного нейрона. Теперь мы даём знакомому механизму имя и добавляем важную деталь — функцию активации.', en: 'The weighted formula with bias that we already trained is almost the core of an artificial neuron. Now we name the familiar mechanism and add an important piece: an activation function.'},
    sections: [
      {title: {ru: 'Искусственный нейрон', en: 'Artificial neuron'}, body: {ru: 'Нейрон принимает один или несколько входов, умножает каждый на свой weight, складывает результаты, добавляет bias и пропускает сумму через activation. В простом виде: z = Σ(xᵢwᵢ) + b, затем y = activation(z).', en: 'A neuron receives one or more inputs, multiplies each by a weight, sums the results, adds bias, and passes the sum through an activation: z = Σ(xᵢwᵢ) + b, then y = activation(z).'}},
      {title: {ru: 'Зачем несколько входов', en: 'Why multiple inputs'}, body: {ru: 'Реальные решения редко зависят от одного числа. Для оценки риска можно одновременно учитывать температуру, пульс и возраст. Каждый weight определяет вклад соответствующего признака.', en: 'Real decisions rarely depend on a single number. Risk assessment may use temperature, heart rate, and age together. Each weight controls the contribution of its feature.'}},
      {title: {ru: 'Зачем activation', en: 'Why activation'}, body: {ru: 'Без нелинейной activation несколько линейных слоёв можно свернуть в одно линейное преобразование. Нелинейность позволяет сети строить гораздо более сложные зависимости.', en: 'Without a nonlinear activation, several linear layers collapse into one linear transformation. Nonlinearity lets networks represent much more complex relationships.'}},
    ],
    terms: [
      {term: {ru: 'Нейрон', en: 'Neuron'}, definition: {ru: 'Обучаемый вычислительный элемент: weighted sum + bias + activation.', en: 'A trainable computational element: weighted sum + bias + activation.'}},
      {term: {ru: 'Activation', en: 'Activation'}, definition: {ru: 'Функция, преобразующая сумму нейрона и добавляющая нелинейность.', en: 'A function that transforms the neuron sum and adds nonlinearity.'}},
    ],
    example: {ru: 'Нейрон с двумя входами x₁ и x₂ может вычислять z = 0.8x₁ − 0.3x₂ + 0.2. После ReLU отрицательные z превращаются в 0, положительные сохраняются.', en: 'A neuron with inputs x₁ and x₂ may compute z = 0.8x₁ − 0.3x₂ + 0.2. After ReLU, negative z values become 0 and positive values remain.'},
    misconception: {ru: '«Искусственный нейрон работает как настоящий биологический нейрон». Это лишь очень грубая математическая метафора, а не точная модель мозга.', en: '“An artificial neuron works like a biological neuron.” It is only a rough mathematical metaphor, not a faithful brain model.'},
    takeaway: {ru: 'Нейрон — это уже знакомая обучаемая формула, расширенная до нескольких входов и нелинейной activation.', en: 'A neuron is the trainable formula we already know, extended to multiple inputs and a nonlinear activation.'},
  },
  'neuron-layer': {
    intro: {ru: 'Один нейрон вычисляет один обучаемый признак или ответ. Чтобы одновременно обнаруживать много разных признаков, нейроны объединяют в слой. Несколько слоёв образуют нейронную сеть.', en: 'One neuron computes one trainable feature or output. To detect many different features simultaneously, neurons are grouped into a layer. Multiple layers form a neural network.'},
    sections: [
      {title: {ru: 'Слой', en: 'Layer'}, body: {ru: 'Каждый нейрон слоя получает один и тот же входной вектор, но имеет собственные weights и bias. Поэтому разные нейроны могут научиться реагировать на разные комбинации признаков.', en: 'Each neuron in a layer receives the same input vector but has its own weights and bias. Different neurons can therefore learn different feature combinations.'}},
      {title: {ru: 'Матрица весов', en: 'Weight matrix'}, body: {ru: 'Удобно хранить weights всех нейронов сразу в матрице W. Тогда весь слой можно записать одной операцией: y = activation(xW + b). Эта запись станет центральной для современных нейросетей.', en: 'It is convenient to store all neuron weights in a matrix W. Then the whole layer becomes one operation: y = activation(xW + b). This notation is central to modern neural networks.'}},
      {title: {ru: 'Глубина сети', en: 'Network depth'}, body: {ru: 'Первый слой может находить простые признаки, следующий — комбинировать их в более сложные. Так сеть строит иерархию представлений. Но глубина увеличивает число параметров и усложняет обучение.', en: 'An early layer can detect simple features, while later layers combine them into more complex ones. This builds a hierarchy of representations, but depth increases parameters and training difficulty.'}},
    ],
    terms: [
      {term: {ru: 'Слой', en: 'Layer'}, definition: {ru: 'Группа нейронов, обрабатывающих один вход параллельно.', en: 'A group of neurons processing the same input in parallel.'}},
      {term: {ru: 'MLP', en: 'MLP'}, definition: {ru: 'Многослойный персептрон — сеть из последовательных полносвязных слоёв.', en: 'A multilayer perceptron: a network of sequential fully connected layers.'}},
    ],
    example: {ru: 'Если вход имеет 3 числа, а слой содержит 4 нейрона, матрица W хранит 3×4 = 12 weights. Выход слоя — уже 4 новых числа.', en: 'If the input has 3 numbers and the layer has 4 neurons, matrix W stores 3×4 = 12 weights. The layer output contains 4 new numbers.'},
    misconception: {ru: '«Чем больше слоёв, тем модель автоматически лучше». Глубина полезна только при подходящих данных, архитектуре и обучении.', en: '“More layers automatically mean a better model.” Depth helps only with suitable data, architecture, and training.'},
    takeaway: {ru: 'Слой превращает один обучаемый вычислительный элемент в систему многих параллельных признаков; последовательность слоёв создаёт сеть.', en: 'A layer turns one trainable computation into many parallel learned features; sequences of layers create a network.'},
  },
  'text-as-data': {
    intro: {ru: 'Нейросеть умеет работать только с числами. Текст сначала нужно превратить в последовательность числовых единиц. Этот процесс называется токенизацией, а единицы — токенами.', en: 'Neural networks work with numbers. Text must first be converted into a sequence of numerical units. This process is tokenization, and the units are tokens.'},
    sections: [
      {title: {ru: 'От символов к токенам', en: 'From characters to tokens'}, body: {ru: 'Самый простой tokenizer может считать каждый символ отдельным токеном. Другой вариант — слова. Современные LLM обычно используют подсловные токены: частые кусочки слов, знаки и пробелы.', en: 'The simplest tokenizer can treat each character as a token. Another option is whole words. Modern LLMs typically use subword tokens: frequent word pieces, punctuation, and spaces.'}},
      {title: {ru: 'Vocabulary и ID', en: 'Vocabulary and IDs'}, body: {ru: 'Tokenizer хранит словарь соответствий token ↔ integer ID. Encode превращает текст в IDs, decode восстанавливает текст. Нейросеть получает именно последовательность IDs, а не буквы как таковые.', en: 'A tokenizer stores mappings token ↔ integer ID. Encode converts text to IDs and decode reconstructs text. The neural network receives ID sequences, not letters directly.'}},
      {title: {ru: 'Почему выбор tokenizer важен', en: 'Why tokenizer choice matters'}, body: {ru: 'Слишком крупные токены требуют огромного vocabulary, слишком мелкие делают последовательности длинными. BPE-подобные методы ищут компромисс между размером словаря и длиной текста.', en: 'Tokens that are too large require huge vocabularies; tokens that are too small make sequences long. BPE-like methods balance vocabulary size and sequence length.'}},
    ],
    terms: [
      {term: {ru: 'Token', en: 'Token'}, definition: {ru: 'Единица текста, которой tokenizer присваивает числовой ID.', en: 'A unit of text assigned a numerical ID by a tokenizer.'}},
      {term: {ru: 'Vocabulary', en: 'Vocabulary'}, definition: {ru: 'Набор всех токенов, известных tokenizer.', en: 'The set of all tokens known to a tokenizer.'}},
      {term: {ru: 'Encode / decode', en: 'Encode / decode'}, definition: {ru: 'Преобразование текста в IDs и обратно.', en: 'Converting text to IDs and back.'}},
    ],
    example: {ru: 'Для игрушечного словаря «кот»→7, « спит»→12 фраза «кот спит» может превратиться в [7, 12]. Реальный tokenizer будет разбивать текст сложнее.', en: 'With a toy vocabulary “cat”→7 and “ sleeps”→12, “cat sleeps” may become [7, 12]. A real tokenizer uses more sophisticated segmentation.'},
    misconception: {ru: '«Один токен всегда равен одному слову». В современных LLM слово может быть одним токеном, несколькими токенами или частью токена вместе с пробелом/знаком.', en: '“One token always equals one word.” In modern LLMs a word may be one token, several tokens, or share a token with spaces/punctuation.'},
    takeaway: {ru: 'Tokenizer — мост между человеческим текстом и числовым миром нейросети.', en: 'A tokenizer is the bridge between human text and the numerical world of a neural network.'},
  },
  'next-token': {
    intro: {ru: 'Большие языковые модели обучаются на удивительно простой задаче: по уже увиденному контексту предсказать следующий токен. Повторяя эту задачу на огромном количестве текста, модель вынуждена изучать закономерности языка.', en: 'Large language models train on a surprisingly simple task: predict the next token from the context seen so far. Repeating this across huge text corpora forces the model to learn language patterns.'},
    sections: [
      {title: {ru: 'Не один ответ, а распределение', en: 'Not one answer, but a distribution'}, body: {ru: 'Для контекста редко существует единственный возможный следующий токен. Модель выдаёт score для каждого токена vocabulary, затем превращает scores в probabilities. Например: «кошка сидит на …» может продолжиться «стуле», «окне», «полу».', en: 'A context rarely has only one valid next token. The model produces a score for every vocabulary token and converts scores into probabilities. “The cat sits on the …” might continue with “chair,” “window,” or “floor.”'}},
      {title: {ru: 'Sampling', en: 'Sampling'}, body: {ru: 'При генерации можно брать самый вероятный token или случайно выбирать с учётом probabilities. Sampling создаёт разнообразие, но повышает риск странных продолжений.', en: 'During generation we can take the most likely token or sample according to probabilities. Sampling creates diversity but increases the chance of odd continuations.'}},
      {title: {ru: 'Обучение next-token', en: 'Training next-token prediction'}, body: {ru: 'В тренировочном тексте правильный следующий token уже известен. Loss штрафует модель, если она дала ему слишком маленькую probability. После миллионов таких сравнений параметры меняются так, чтобы правильные продолжения получали больше вероятности.', en: 'In training text, the true next token is known. Loss penalizes the model when it assigns that token too little probability. Across millions of comparisons, parameters shift to increase probabilities of correct continuations.'}},
    ],
    terms: [
      {term: {ru: 'Next-token prediction', en: 'Next-token prediction'}, definition: {ru: 'Предсказание вероятностей следующего токена по предыдущему контексту.', en: 'Predicting probabilities of the next token from previous context.'}},
      {term: {ru: 'Probability distribution', en: 'Probability distribution'}, definition: {ru: 'Набор вероятностей всех возможных следующих токенов, сумма которых равна 1.', en: 'Probabilities over all possible next tokens that sum to 1.'}},
    ],
    example: {ru: 'После «2 + 2 =» token «4» должен получить высокую probability. После «Сегодня вечером» распределение обычно шире: «будет», «я», «мы», «можно» и другие варианты.', en: 'After “2 + 2 =”, token “4” should have high probability. After “Tonight”, the distribution is broader: “we,” “I,” “will,” and many alternatives.'},
    misconception: {ru: '«LLM заранее хранит готовый ответ целиком». Обычно ответ строится по одному токену: каждый новый token добавляется к контексту и используется для следующего предсказания.', en: '“An LLM stores a complete answer in advance.” Usually output is generated token by token; each new token becomes context for the next prediction.'},
    takeaway: {ru: 'Языковая модель — это прежде всего машина, которая оценивает, какой token вероятнее всего должен появиться следующим.', en: 'A language model is fundamentally a machine that estimates which token is likely to come next.'},
  },
  'first-language-model': {
    intro: {ru: 'Самая простая языковая модель может смотреть только на один предыдущий токен. Такая модель называется bigram model. Она уже умеет оценивать вероятности и генерировать новые последовательности, но почти не понимает дальний контекст.', en: 'The simplest language model can look at only one previous token. This is a bigram model. It can already estimate probabilities and generate new sequences, but it barely captures longer context.'},
    sections: [
      {title: {ru: 'Bigram', en: 'Bigram'}, body: {ru: 'Bigram — пара соседних токенов. Мы считаем, какие токены чаще следовали за каждым текущим токеном. Эти частоты можно превратить в probabilities следующего шага.', en: 'A bigram is a pair of neighboring tokens. We count which tokens followed each current token and convert those counts into next-step probabilities.'}},
      {title: {ru: 'Таблица переходов', en: 'Transition table'}, body: {ru: 'Для vocabulary размера V можно построить таблицу V×V. Строка соответствует текущему token, столбец — следующему. Обучаемая версия может хранить не готовые probabilities, а logits, которые оптимизируются по loss.', en: 'For a vocabulary of size V, we can build a V×V table. Rows represent current tokens and columns next tokens. A trainable version stores logits rather than fixed probabilities and optimizes them using loss.'}},
      {title: {ru: 'Главное ограничение', en: 'The key limitation'}, body: {ru: 'Bigram видит только один token назад. Поэтому одинаковый последний token всегда даёт одно и то же распределение, даже если более ранний контекст совершенно разный. Именно эта проблема приведёт нас к embeddings, context windows и attention.', en: 'A bigram sees only one token back. Therefore the same last token always gives the same distribution even when earlier context differs completely. This limitation motivates embeddings, context windows, and attention.'}},
    ],
    terms: [
      {term: {ru: 'Bigram', en: 'Bigram'}, definition: {ru: 'Пара соседних токенов.', en: 'A pair of adjacent tokens.'}},
      {term: {ru: 'Logit', en: 'Logit'}, definition: {ru: 'Нормализованный ещё не probability score для некоторого варианта.', en: 'An unnormalized score for an outcome before converting to probability.'}},
      {term: {ru: 'Контекст', en: 'Context'}, definition: {ru: 'Предыдущие токены, доступные модели при текущем предсказании.', en: 'Previous tokens available to the model for the current prediction.'}},
    ],
    example: {ru: 'Если после токена «в» в данных часто встречаются «школе», «городе», «доме», bigram выучит эти вероятности. Но она не отличит «он учится в …» от «температура в …», если последний token перед предсказанием одинаков.', en: 'If “in” is often followed by “school,” “city,” and “house,” a bigram learns those probabilities. But it cannot distinguish “he studies in …” from “temperature in …” when the immediate previous token is the same.'},
    misconception: {ru: '«Раз bigram генерирует текст, значит она уже понимает язык». Генерация по локальным частотам может выглядеть правдоподобно, но это очень ограниченная модель зависимостей.', en: '“If a bigram generates text, it understands language.” Local frequency generation can look plausible but captures only very limited dependencies.'},
    takeaway: {ru: 'Bigram — первая настоящая языковая модель: она учит вероятность следующего токена. Её неспособность использовать дальний контекст естественно открывает путь к современным архитектурам.', en: 'A bigram is our first real language model: it learns next-token probabilities. Its inability to use distant context naturally opens the path to modern architectures.'},
  },
};

export function getLessonTheory(id: StarterLessonId) {
  return lessonTheory[id];
}
