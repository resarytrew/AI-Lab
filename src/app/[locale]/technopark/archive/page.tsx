import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {DataArchiveQuest} from '@/components/quest/data-archive-quest';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const isRu = locale !== 'en';
  return {
    title: isRu ? 'Архив данных · AI Lab' : 'Data Archive · AI Lab',
    description: isRu
      ? 'Второй квест AI Lab: данные, информация, знания, качество и представление данных.'
      : 'The second AI Lab quest: data, information, knowledge, quality and representation.',
  };
}

export default async function DataArchivePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <DataArchiveQuest locale={locale} />;
}
