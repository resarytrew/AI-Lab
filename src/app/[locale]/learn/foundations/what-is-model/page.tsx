import {setRequestLocale} from 'next-intl/server';
import {WhatIsModelLesson} from '@/components/lessons/what-is-model-lesson';

export default async function WhatIsModelPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <WhatIsModelLesson />;
}
