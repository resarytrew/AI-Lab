import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {MyAiWorkspaceScreen} from '../../../components/workspace/myai-workspace';

export const metadata: Metadata = {
  title: 'MyAI Workspace',
  description: 'Persistent browser workspace for the MyAI project built through AI Lab lessons.',
};

export default async function MyAiWorkspaceRoute({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <MyAiWorkspaceScreen locale={locale} />;
}
