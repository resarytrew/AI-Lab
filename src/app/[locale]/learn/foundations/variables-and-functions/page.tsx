import {setRequestLocale} from 'next-intl/server';
import {VariablesFunctionsLesson} from '@/components/lessons/variables-functions-lesson';

export default async function VariablesFunctionsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <VariablesFunctionsLesson />;
}
