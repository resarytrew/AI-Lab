'use client';

import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {
  getStarterLesson,
  localize,
  starterLessonHref,
  starterLessons,
  type StarterLessonId,
} from '@/content/learning-path';
import {getLessonTheory} from '@/content/lesson-theory';
import {StarterLessonLab} from './starter-labs';
import styles from './starter-lesson.module.css';

const progressKey = 'ai-lab:learning-journey:v2';

function tr(locale: string, ru: string, en: string) {
  return locale === 'en' ? en : ru;
}

function loadCompleted() {
  if (typeof window === 'undefined') return [] as StarterLessonId[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(progressKey) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is StarterLessonId => starterLessons.some((lesson) => lesson.id === id));
  } catch {
    return [];
  }
}

function saveCompleted(ids: StarterLessonId[]) {
  window.localStorage.setItem(progressKey, JSON.stringify(ids));
}

function TheoryLayer({lessonId, locale}: {lessonId: StarterLessonId; locale: string}) {
  const theory = getLessonTheory(lessonId);

  return (
    <section className={styles.theorySection}>
      <div className={styles.theoryHeading}>
        <p className={styles.theoryEyebrow}>{tr(locale, 'ТЕОРИЯ · после открытия', 'THEORY · after discovery')}</p>
        <h2>{tr(locale, 'Теперь разберёмся, почему это работает', 'Now let’s understand why it works')}</h2>
        <p>{localize(theory.intro, locale)}</p>
      </div>

      <div className={styles.theoryBody}>
        <div className={styles.theoryChapters}>
          {theory.sections.map((section, index) => (
            <article className={styles.theoryChapter} key={`${lessonId}-theory-${index + 1}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{localize(section.title, locale)}</h3>
                <p>{localize(section.body, locale)}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.theorySidebar}>
          <div className={styles.glossaryCard}>
            <small>{tr(locale, 'СЛОВАРЬ', 'GLOSSARY')}</small>
            {theory.terms.map(({term, definition}) => (
              <div key={localize(term, locale)}>
                <b>{localize(term, locale)}</b>
                <p>{localize(definition, locale)}</p>
              </div>
            ))}
          </div>

          <div className={styles.theoryExample}>
            <small>{tr(locale, 'ПРИМЕР', 'EXAMPLE')}</small>
            <p>{localize(theory.example, locale)}</p>
          </div>
        </aside>
      </div>

      <div className={styles.theoryChecks}>
        <article className={styles.misconceptionCard}>
          <small>{tr(locale, 'НЕ ПЕРЕПУТАЙ', 'COMMON MISCONCEPTION')}</small>
          <p>{localize(theory.misconception, locale)}</p>
        </article>
        <article className={styles.takeawayCard}>
          <small>{tr(locale, 'ГЛАВНАЯ МЫСЛЬ', 'KEY TAKEAWAY')}</small>
          <p>{localize(theory.takeaway, locale)}</p>
        </article>
      </div>
    </section>
  );
}

export function StarterLessonPage({locale, lessonSlug}: {locale: string; lessonSlug: string}) {
  const lesson = getStarterLesson(lessonSlug);
  const [completed, setCompleted] = useState<StarterLessonId[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompleted(loadCompleted());
    setReady(true);
  }, []);

  const completeLesson = () => {
    if (!lesson) return;
    setCompleted((current) => {
      if (current.includes(lesson.id)) return current;
      const next = [...current, lesson.id];
      saveCompleted(next);
      return next;
    });
  };

  const progress = useMemo(() => completed.length, [completed]);

  if (!lesson) return <main className={styles.notFound}>{tr(locale, 'Урок не найден.', 'Lesson not found.')}</main>;

  const isComplete = completed.includes(lesson.id);
  const nextHref = lesson.nextId ? starterLessonHref(locale, lesson.nextId) : null;
  const previous = starterLessons.find((candidate) => candidate.nextId === lesson.id);
  const previousHref = previous ? starterLessonHref(locale, previous.id) : null;
  const alternateLocale = locale === 'en' ? 'ru' : 'en';

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <Link href={`/${locale}/`} className={styles.brand}>AI LAB</Link>
        <div className={styles.progressText}>{tr(locale, 'Путь к MyGPT', 'Path to MyGPT')} · {lesson.index + 1} / {starterLessons.length}</div>
        <div className={styles.headerActions}>
          <Link href={`/${alternateLocale}/journey/${lesson.slug}`} className={styles.localeLink}>{alternateLocale.toUpperCase()}</Link>
          <div className={styles.projectState}><span>MyAI</span><b>{ready ? progress : 0}/{starterLessons.length}</b></div>
        </div>
      </header>

      <div className={styles.progressBar}><i style={{width: `${((lesson.index + (isComplete ? 1 : 0)) / starterLessons.length) * 100}%`}} /></div>

      <section className={styles.lessonGrid}>
        <article className={styles.lessonCopy}>
          <p className={styles.kicker}>{tr(locale, 'Вопрос до термина', 'Question before terminology')}</p>
          <h1>{localize(lesson.title, locale)}</h1>
          <p className={styles.question}>{localize(lesson.question, locale)}</p>

          <div className={styles.missionCard}>
            <small>{tr(locale, 'Что сейчас проверяем', 'What we are testing')}</small>
            <p>{localize(lesson.before, locale)}</p>
          </div>

          <div className={styles.methodNote}>
            <span>QUESTION</span><b>→</b><span>HYPOTHESIS</span><b>→</b><span>CONFLICT</span><b>→</b><span>DISCOVERY</span>
          </div>

          {isComplete && (
            <div className={styles.revealStack}>
              <div className={styles.conceptCard}>
                <small>{tr(locale, 'Открытое понятие', 'Discovered concept')}</small>
                <p>{localize(lesson.concept, locale)}</p>
              </div>
              <div className={styles.outcomes}>
                <div><small>{tr(locale, 'Теперь понимаю', 'Now I understand')}</small><p>{localize(lesson.after, locale)}</p></div>
                <div><small>{tr(locale, 'Теперь могу', 'Now I can')}</small><p>{localize(lesson.canDo, locale)}</p></div>
              </div>
            </div>
          )}
        </article>

        <div className={styles.labColumn}>
          <StarterLessonLab lessonId={lesson.id} locale={locale} onComplete={completeLesson} />

          <div className={`${styles.artifactCard} ${isComplete ? styles.artifactUnlocked : ''}`}>
            <small>BUILD MyAI</small>
            <div><code>{lesson.artifact}</code><span>{isComplete ? tr(locale, 'готово', 'unlocked') : tr(locale, 'после открытия', 'after discovery')}</span></div>
            <p>{localize(lesson.artifactPurpose, locale)}</p>
          </div>

          {isComplete && (
            <div className={styles.discoveryNext}>
              <span>{tr(locale, 'Открытие сделано', 'Discovery complete')}</span>
              <b>↓</b>
              <p>{tr(locale, 'Теперь не угадываем дальше — разбираем механизм и фиксируем теорию.', 'Now we stop guessing and explain the mechanism in full.')}</p>
            </div>
          )}
        </div>
      </section>

      {isComplete && (
        <>
          <TheoryLayer lessonId={lesson.id} locale={locale} />

          <section className={styles.afterTheory}>
            <div className={styles.checkpointCard}>
              <small>{tr(locale, 'TRANSFER · новая ситуация', 'TRANSFER · new situation')}</small>
              <p>{localize(lesson.checkpoint, locale)}</p>
            </div>

            <div className={styles.depthStack}>
              <details>
                <summary>{tr(locale, 'Открой капот · математика и механизм', 'Open the hood · math and mechanism')}</summary>
                <p>{localize(lesson.deepDive, locale)}</p>
              </details>
              <details>
                <summary>Engineer · Code</summary>
                <p>{localize(lesson.engineer, locale)}</p>
              </details>
              <details>
                <summary>Researcher · Experiment</summary>
                <p>{localize(lesson.researcher, locale)}</p>
              </details>
            </div>
          </section>
        </>
      )}

      <footer className={styles.footer}>
        {previousHref ? <Link href={previousHref} className={styles.secondaryButton}>← {tr(locale, 'Назад', 'Back')}</Link> : <span />}
        {nextHref ? (
          isComplete ? <Link href={nextHref} className={styles.primaryButton}>{tr(locale, 'Следующий урок', 'Next lesson')} →</Link> : <span className={styles.lockedText}>{tr(locale, 'Сначала доведи эксперимент до открытия.', 'Complete the experiment before moving on.')}</span>
        ) : (
          isComplete ? <div className={styles.finishMessage}>{tr(locale, 'Первая дуга завершена: у тебя уже есть Rule Engine, Trainable Model, Neuron, Tokenizer и Bigram LM. Следующий вопрос: как дать языковой модели более длинную память и богатое представление?', 'The first arc is complete: you now have a Rule Engine, Trainable Model, Neuron, Tokenizer, and Bigram LM. Next question: how do we give a language model richer representations and longer memory?')}</div> : <span className={styles.lockedText}>{tr(locale, 'Заверши первую языковую модель.', 'Complete your first language model.')}</span>
        )}
      </footer>
    </main>
  );
}
