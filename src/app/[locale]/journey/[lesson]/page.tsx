import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {StarterLessonPage} from '@/components/journey/starter-lesson';
import {getStarterLesson, localize, starterLessons} from '@/content/learning-path';

export const dynamicParams = false;

export function generateStaticParams() {
  return starterLessons.map((lesson) => ({lesson: lesson.slug}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; lesson: string}>;
}): Promise<Metadata> {
  const {locale, lesson: lessonSlug} = await params;
  const lesson = getStarterLesson(lessonSlug);
  if (!lesson) return {title: 'AI Lab'};
  return {
    title: localize(lesson.title, locale),
    description: localize(lesson.question, locale),
  };
}

export default async function JourneyLessonRoute({
  params,
}: {
  params: Promise<{locale: string; lesson: string}>;
}) {
  const {locale, lesson: lessonSlug} = await params;
  setRequestLocale(locale);

  if (!getStarterLesson(lessonSlug)) notFound();

  return <StarterLessonPage locale={locale} lessonSlug={lessonSlug} />;
}
