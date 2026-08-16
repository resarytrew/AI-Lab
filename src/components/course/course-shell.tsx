'use client';

import {useLocale, useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {
  buildMilestones,
  courseModules,
  foundationLessons,
  getFoundationHref,
  type FoundationLessonId,
} from '@/content/course';
import {Link, usePathname, useRouter} from '@/i18n/navigation';

const COURSE_TOTAL_LESSONS = 43;

export function CourseShell({
  currentLessonId,
  children,
  codePanel,
}: {
  currentLessonId: FoundationLessonId;
  children: ReactNode;
  codePanel: ReactNode;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = foundationLessons.findIndex(
    (lesson) => lesson.id === currentLessonId,
  );
  const completedLessons = Math.max(0, currentIndex);
  const progress = Math.round((completedLessons / COURSE_TOTAL_LESSONS) * 100);

  const switchLocale = () => {
    const nextLocale = locale === 'ru' ? 'en' : 'ru';
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">AI Lab</div>
        <nav className="topnav" aria-label={t('nav.aria')}>
          <a className="topnav-link active" href="#lesson">
            {t('nav.learn')}
          </a>
          <a className="topnav-link" href="#labs">
            {t('nav.labs')}
          </a>
          <a className="topnav-link" href="#code">
            {t('nav.code')}
          </a>
          <a className="topnav-link" href="#my-ai">
            {t('nav.myAi')}
          </a>
          <a className="topnav-link" href="#progress">
            {t('nav.progress')}
          </a>
        </nav>
        <div className="topbar-actions">
          <button className="ghost-action" type="button">
            ▣ {t('nav.docs')}
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label={t('nav.notifications')}
          >
            ♧
          </button>
          <button
            className="locale-switch"
            type="button"
            onClick={switchLocale}
            aria-label={t('nav.switchLanguage')}
          >
            {locale === 'ru' ? 'EN' : 'RU'}
          </button>
          <span className="avatar" role="img" aria-label={t('nav.profile')}>
            SR
          </span>
        </div>
      </header>

      <aside className="sidebar">
        <section className="sidebar-block progress-block">
          <div className="row-between">
            <strong>{t('course.progress')}</strong>
            <span className="accent-text">{progress}%</span>
          </div>
          <div className="progress-track">
            <span style={{width: `${Math.max(progress, 1)}%`}} />
          </div>
          <p>
            {t('course.completed', {
              done: completedLessons,
              total: COURSE_TOTAL_LESSONS,
            })}
          </p>
        </section>

        <section className="sidebar-block course-map">
          <h2>{t('course.map')}</h2>
          <div className="module open">
            <div className="module-title">
              <span className="status-ring current" />
              <strong>{t('course.foundations')}</strong>
              <span>{completedLessons}/6</span>
            </div>
            <div className="lesson-list">
              {foundationLessons.map((lesson, index) => {
                const state =
                  index < currentIndex
                    ? 'done'
                    : index === currentIndex
                      ? 'selected'
                      : '';
                const content = (
                  <>
                    <i />
                    {t(`course.${lesson.messageKey}`)}
                  </>
                );

                return lesson.implemented ? (
                  <Link
                    key={lesson.id}
                    className={`lesson-item ${state}`}
                    href={getFoundationHref(lesson.id)}
                  >
                    {content}
                  </Link>
                ) : (
                  <span key={lesson.id} className={`lesson-item ${state}`}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>

          {courseModules.map((module) => (
            <div className="module locked" key={module.messageKey}>
              <div className="module-title">
                <span className="status-ring" />
                <strong>{t(`course.${module.messageKey}`)}</strong>
                <span>⌑ 0/{module.total}</span>
              </div>
            </div>
          ))}
        </section>
        <button type="button" className="download-button">
          ⇩ {t('course.download')}
        </button>
      </aside>

      {children}
      {codePanel}

      <section className="build-strip" id="my-ai">
        <div>
          <h2>{t('build.title')}</h2>
          <p>{t('build.subtitle')}</p>
        </div>
        {buildMilestones.map((milestone) => {
          const state = getMilestoneState(milestone.lessonIndex, currentIndex);
          return (
            <BuildStep
              key={milestone.messageKey}
              label={t(`build.${milestone.messageKey}`)}
              state={state}
              stateLabel={t(`build.${state}`)}
            />
          );
        })}
      </section>
    </main>
  );
}

function getMilestoneState(
  milestoneIndex: number,
  currentIndex: number,
): 'complete' | 'inProgress' | 'next' | 'locked' {
  if (milestoneIndex < currentIndex) return 'complete';
  if (milestoneIndex === currentIndex) return 'inProgress';
  if (milestoneIndex === currentIndex + 1) return 'next';
  return 'locked';
}

function BuildStep({
  label,
  state,
  stateLabel,
}: {
  label: string;
  state: 'complete' | 'inProgress' | 'next' | 'locked';
  stateLabel: string;
}) {
  const icon =
    state === 'complete'
      ? '✓'
      : state === 'inProgress'
        ? '◔'
        : state === 'next'
          ? '○'
          : '⌑';

  return (
    <div className={`build-step ${state}`}>
      <span>{icon}</span>
      <div>
        <strong>{label}</strong>
        <small>{stateLabel}</small>
      </div>
    </div>
  );
}
