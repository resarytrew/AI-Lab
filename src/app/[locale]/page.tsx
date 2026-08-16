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
      <meta httpEquiv="refresh" content="0; url=./journey/smart-machine/" />
      <p>
        <a href="./journey/smart-machine/">
          {locale === 'ru' ? 'Начать путь: что делает машину умной?' : 'Start the journey: what makes a machine intelligent?'}
        </a>
      </p>
    </main>
  );
}
