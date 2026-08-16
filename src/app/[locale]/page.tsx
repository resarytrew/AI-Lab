import {setRequestLocale} from 'next-intl/server';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main style={{padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <meta httpEquiv="refresh" content="0; url=./journey/human-knows-rule/" />
      <p>
        <a href="./journey/human-knows-rule/">
          {locale === 'ru' ? 'Начать курс AI Lab с нуля' : 'Start AI Lab from zero'}
        </a>
      </p>
    </main>
  );
}
