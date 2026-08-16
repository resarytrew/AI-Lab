import {setRequestLocale} from 'next-intl/server';
import {FirstNeuronLesson} from '@/components/lessons/first-neuron-lesson';

export default async function FirstNeuronPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <FirstNeuronLesson />;
}
