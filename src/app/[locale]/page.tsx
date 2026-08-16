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
      <meta httpEquiv="refresh" content="0; url=./technopark/entry/" />
      <p>
        <a href="./technopark/entry/">
          {locale === 'ru' ? 'Войти в Технопарк AI Lab' : 'Enter the AI Lab Technopark'}
        </a>
      </p>
    </main>
  );
}
