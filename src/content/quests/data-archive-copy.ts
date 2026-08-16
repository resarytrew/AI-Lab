export type DataArchiveCopy = {
  quest: string;
  language: string;
  next: string;
  help: string;
  intro: {kicker: string; title: string; lead: string; action: string};
  raw: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  context: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  information: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  knowledge: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  structure: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  quality: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  bias: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  numbers: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  transfer: {kicker: string; title: string; lead: string; question: string; answers: string[]; good: string; bad: string};
  journal: {kicker: string; title: string; lead: string; prompt: string; placeholder: string; hint: string};
  unlock: {kicker: string; title: string; lead: string; badge: string; journal: string; project: string; status: string; nextLab: string; finish: string};
};

const ru: DataArchiveCopy = {
  quest: 'Квест 02 · Архив данных',
  language: 'EN',
  next: 'Дальше',
  help: 'Помощь',
  intro: {
    kicker: 'Архив данных · допуск 02',
    title: 'Как машина получает сведения о мире?',
    lead: 'В Архив стекаются числа, тексты, фотографии и сигналы датчиков. Но сами по себе они ещё не объясняют машине, что происходит. Разберёмся, как из записей появляется смысл.',
    action: 'Открыть Архив',
  },
  raw: {
    kicker: 'Зал сырых записей',
    title: 'Что из этого можно назвать данными?',
    lead: 'Архив сохранил четыре фрагмента: «23.4», фотографию коридора, слово «дождь» и время «14:32:07».',
    question: 'Что у них общего?',
    answers: ['Это зафиксированные наблюдения или символы, которые можно хранить и обрабатывать.', 'Все четыре фрагмента уже полностью объясняют ситуацию.', 'Данными бывают только числа.'],
    good: 'Да. Данные — это зафиксированные значения, символы, изображения, звуки и другие записи. Смысл может появиться позже.',
    bad: 'Не ограничивай данные числами и не путай запись с её смыслом. Фотография и текст тоже могут быть данными.',
  },
  context: {
    kicker: 'Эксперимент · контекст',
    title: 'Что означает число 42?',
    lead: 'На экране Архива только одно значение: 42. Это может быть возраст, температура, номер кабинета, ответ в тесте или количество объектов.',
    question: 'Чего не хватает, чтобы интерпретировать запись?',
    answers: ['Контекста: что измеряли, где, когда и в каких единицах.', 'Более быстрого процессора.', 'Ещё одной цифры справа.'],
    good: 'Верно. Значение без описания часто неоднозначно. Контекст превращает голую запись в осмысленное сообщение.',
    bad: 'Само число не сообщает, что оно означает. Нужны описание, источник, время, единицы или другие признаки контекста.',
  },
  information: {
    kicker: 'Из данных в информацию',
    title: 'Когда запись начинает что-то сообщать?',
    lead: 'Сравни: «36.9» и «В кабинете 214 в 10:15 датчик показал 36.9 °C». Во втором случае мы уже понимаем, что произошло.',
    question: 'Какое изменение было главным?',
    answers: ['К значению добавили контекст и связь с объектом наблюдения.', 'Число стало длиннее.', 'Данные превратились в программу.'],
    good: 'Именно. Информация появляется, когда данные интерпретированы в контексте и уменьшают нашу неопределённость о ситуации.',
    bad: 'Смысл появился не из-за длины записи и не из-за кода. Важна связь значения с ситуацией.',
  },
  knowledge: {
    kicker: 'Из информации в знание',
    title: 'Факт — это ещё не правило действия',
    lead: 'Архив много дней подряд фиксирует: после 12:30 очередь в столовой резко растёт. Это уже не один факт, а устойчивая закономерность.',
    question: 'Какое утверждение больше похоже на знание, которое можно использовать?',
    answers: ['Сегодня в 12:41 в очереди было 38 человек.', 'После 12:30 обычно возникает очередь; если нужно успеть быстро, лучше прийти раньше.', 'В таблице 240 строк.'],
    good: 'Да. Знание связывает факты, закономерности и способы действия. Его можно применить к новой ситуации.',
    bad: 'Один факт полезен, но знание позволяет делать вывод или выбирать действие в похожих случаях.',
  },
  structure: {
    kicker: 'Форматы Архива',
    title: 'Данные бывают устроены по-разному',
    lead: 'Таблица с колонками легко разбирается по полям. Фотография, аудиозапись и свободный текст не укладываются в такие ячейки напрямую.',
    question: 'Какое разделение полезнее всего?',
    answers: ['Структурированные данные и неструктурированные данные.', 'Красивые и некрасивые данные.', 'Большие и маленькие буквы.'],
    good: 'Верно. Таблицы и записи с известной схемой — структурированы; изображения, звук и свободный текст требуют другого представления.',
    bad: 'Нас интересует не внешний вид, а то, есть ли заранее заданная структура полей и отношений.',
  },
  quality: {
    kicker: 'Авария в Архиве',
    title: 'Можно ли учиться на плохих данных?',
    lead: 'В наборе для распознавания животных есть дубликаты, пропущенные подписи и карточка, где фотография собаки подписана «кот».',
    question: 'Что произойдёт, если не проверять качество?',
    answers: ['Ошибки и шум могут научить систему неверным закономерностям.', 'Модель сама гарантированно исправит все подписи.', 'Качество данных никак не влияет на результат.'],
    good: 'Да. Пропуски, неверные метки, дубликаты и шум становятся частью учебного опыта модели.',
    bad: 'Модель не знает, какая подпись ошибочна. Если мы даём плохие примеры, она может учиться на них как на правильных.',
  },
  bias: {
    kicker: 'Эксперимент · выборка',
    title: 'Достаточно ли много данных?',
    lead: 'Мы хотим предсказывать погоду в городе круглый год, но собрали тысячу наблюдений только зимними утрами.',
    question: 'В чём проблема, несмотря на тысячу строк?',
    answers: ['Выборка плохо представляет весь мир задачи.', 'Тысяча — слишком красивое число.', 'Нужно удалить даты и оставить температуры.'],
    good: 'Именно. Важно не только количество, но и то, какие случаи представлены. Иначе система переносит ограниченный опыт туда, где он не подходит.',
    bad: 'Большой набор тоже может быть односторонним. Спроси: какие ситуации система вообще никогда не видела?',
  },
  numbers: {
    kicker: 'Машинный взгляд',
    title: 'Компьютер не видит картинку так, как ты',
    lead: 'Человек говорит: «красный мяч». Компьютер получает массив чисел — значения пикселей. Текст тоже позже придётся представить числами.',
    question: 'Зачем это нужно?',
    answers: ['Чтобы вычислительные операции могли работать с представлением объекта.', 'Потому что компьютеры запрещают использовать слова.', 'Чтобы картинка стала красивее.'],
    good: 'Верно. Машина работает с формальными представлениями. Позже в Language Lab мы увидим, как текст превращается в токены и векторы.',
    bad: 'Смысл не исчезает, но для вычислений нужен формальный способ представить объект числами или символами.',
  },
  transfer: {
    kicker: 'Проверка переноса',
    title: 'Разложи цепочку по уровням',
    lead: 'Турникет записал: «08:17, пропуск 7142, вход разрешён». За месяц выяснилось, что по понедельникам поток максимален между 08:10 и 08:25.',
    question: 'Что здесь является знанием?',
    answers: ['Одна запись «08:17, пропуск 7142».', 'Вывод о повторяющемся пике по понедельникам, который можно использовать для планирования.', 'Сам турникет.'],
    good: 'Да. Данные — отдельные записи; информация — интерпретированный факт; знание — обобщённая связь, которую можно применить.',
    bad: 'Ищи не отдельное наблюдение, а обобщение, помогающее действовать в новых похожих ситуациях.',
  },
  journal: {
    kicker: 'Журнал исследователя · запись 02',
    title: 'Собери три понятия своими словами',
    lead: 'Не переписывай формулировки. Объясни на одном собственном примере, как данные превращаются в информацию, а затем — в знание.',
    prompt: 'Мой пример: данные → информация → знание',
    placeholder: 'Например: датчик записал … Это стало информацией, когда … Знанием это стало, когда мы заметили …',
    hint: '2–4 предложения достаточно. Главное — показать переход между уровнями.',
  },
  unlock: {
    kicker: 'Архив восстановлен',
    title: 'Ты получил допуск к данным',
    lead: 'Теперь ты умеешь отличать запись от смысла и отдельный факт от обобщённого знания. Это понадобится в каждой следующей лаборатории.',
    badge: 'Допуск 02 · Хранитель данных',
    journal: 'Запись 02 сохранена',
    project: 'Проект M-01 обновлён',
    status: 'Data awareness · online',
    nextLab: 'Следующая лаборатория: Правила и знания',
    finish: 'Перейти дальше',
  },
};

const en: DataArchiveCopy = {
  ...ru,
  quest: 'Quest 02 · Data Archive',
  language: 'RU',
  next: 'Continue',
  help: 'Help',
  intro: {kicker: 'Data Archive · clearance 02', title: 'How does a machine get information about the world?', lead: 'Numbers, text, images and sensor signals flow into the Archive. By themselves they do not yet explain what is happening. We will trace how recorded data acquires meaning.', action: 'Open the Archive'},
  raw: {kicker: 'Raw records hall', title: 'Which of these are data?', lead: 'The Archive contains four fragments: “23.4”, a corridor photo, the word “rain”, and the time “14:32:07”.', question: 'What do they have in common?', answers: ['They are recorded observations or symbols that can be stored and processed.', 'All four already fully explain the situation.', 'Only numbers can be data.'], good: 'Right. Data can be values, symbols, images, sounds and other recorded observations.', bad: 'Do not limit data to numbers and do not confuse a record with its meaning.'},
  context: {kicker: 'Experiment · context', title: 'What does the number 42 mean?', lead: 'The Archive shows only one value: 42. It could be an age, temperature, room number, test score or object count.', question: 'What is missing?', answers: ['Context: what was measured, where, when and in which units.', 'A faster processor.', 'One more digit.'], good: 'Correct. A value without context is often ambiguous.', bad: 'The number alone does not tell you what it means.'},
  information: {kicker: 'From data to information', title: 'When does a record start telling us something?', lead: 'Compare “36.9” with “In room 214 at 10:15 the sensor measured 36.9 °C”.', question: 'What changed most?', answers: ['The value gained context and a connection to an observation.', 'The number became longer.', 'The data became a program.'], good: 'Exactly. Context turns a raw value into an interpretable message.', bad: 'Meaning came from context, not from length or code.'},
  knowledge: {kicker: 'From information to knowledge', title: 'A fact is not yet a rule for action', lead: 'For many days the Archive records a sharp cafeteria queue increase after 12:30.', question: 'Which statement is closest to usable knowledge?', answers: ['Today at 12:41 there were 38 people in line.', 'After 12:30 queues are usually long; arrive earlier if speed matters.', 'The table has 240 rows.'], good: 'Yes. Knowledge links facts into a reusable pattern.', bad: 'Look for a generalization that can guide a new decision.'},
  structure: {kicker: 'Archive formats', title: 'Data can have different structure', lead: 'A table has explicit fields. Photos, audio and free text do not fit those cells directly.', question: 'Which distinction is useful?', answers: ['Structured and unstructured data.', 'Pretty and ugly data.', 'Uppercase and lowercase data.'], good: 'Correct. Different structures need different representations and tools.', bad: 'The important question is whether a predefined field structure exists.'},
  quality: {kicker: 'Archive incident', title: 'Can we learn from bad data?', lead: 'An animal dataset contains duplicates, missing labels and a dog photo labelled “cat”.', question: 'What can happen if quality is ignored?', answers: ['Noise and errors can teach the system wrong patterns.', 'The model will always repair every label by itself.', 'Data quality does not affect results.'], good: 'Right. Bad examples become part of the learning experience.', bad: 'The model does not automatically know which labels are wrong.'},
  bias: {kicker: 'Experiment · sample', title: 'Is a lot of data always enough?', lead: 'We want year-round city weather predictions, but our thousand observations are only from winter mornings.', question: 'What is the problem?', answers: ['The sample does not represent the full task world.', 'One thousand is too neat a number.', 'We should delete dates.'], good: 'Exactly. Coverage matters as much as size.', bad: 'Ask which situations the system has never seen.'},
  numbers: {kicker: 'Machine view', title: 'A computer does not see an image like you do', lead: 'A person says “red ball”. A computer receives arrays of pixel values. Text will also need a formal representation.', question: 'Why?', answers: ['So computation can operate on a formal representation.', 'Because computers ban words.', 'To make the image prettier.'], good: 'Correct. Computation needs formal representations.', bad: 'The goal is not decoration; it is making the object computable.'},
  transfer: {kicker: 'Transfer check', title: 'Separate the levels', lead: 'A turnstile logs “08:17, pass 7142, entry allowed”. Over a month we discover a recurring Monday peak from 08:10 to 08:25.', question: 'Which part is knowledge?', answers: ['The single 08:17 record.', 'The recurring Monday peak pattern that can guide planning.', 'The turnstile itself.'], good: 'Yes. Data are records; information is interpreted data; knowledge is a reusable generalization.', bad: 'Look for the generalization that helps with a new similar situation.'},
  journal: {kicker: 'Research journal · entry 02', title: 'Explain the three levels in your own words', lead: 'Use one example of your own to show how data becomes information and then knowledge.', prompt: 'My example: data → information → knowledge', placeholder: 'For example: a sensor recorded … It became information when … It became knowledge when we noticed …', hint: '2–4 sentences are enough. Show the transition.'},
  unlock: {kicker: 'Archive restored', title: 'Data clearance granted', lead: 'You can now distinguish a record from its meaning and a single fact from reusable knowledge.', badge: 'Clearance 02 · Data Keeper', journal: 'Entry 02 saved', project: 'Project M-01 updated', status: 'Data awareness · online', nextLab: 'Next lab: Rules and Knowledge', finish: 'Continue'},
};

export function getDataArchiveCopy(locale: string): DataArchiveCopy {
  return locale === 'en' ? en : ru;
}
