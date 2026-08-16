import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {TechnoparkEntryQuest} from '@/components/quest/technopark-entry-quest';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isRu = locale !== 'en';

  return {
    title: isRu ? 'Вход в Технопарк' : 'Enter the Technopark',
    description: isRu
      ? 'Первый интерактивный квест AI Lab: исследуем, что делает машину умной.'
      : 'The first AI Lab interactive quest: investigate what makes a machine intelligent.',
  };
}

export default async function TechnoparkEntryPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <TechnoparkEntryQuest locale={locale} />;
}
