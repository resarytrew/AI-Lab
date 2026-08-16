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
      <meta
        httpEquiv="refresh"
        content="0; url=./learn/foundations/what-is-model/"
      />
      <p>
        <a href="./learn/foundations/what-is-model/">
          {locale === 'ru' ? 'Открыть курс AI Lab' : 'Open the AI Lab course'}
        </a>
      </p>
    </main>
  );
}
