import { setRequestLocale } from 'next-intl/server';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <meta
        httpEquiv="refresh"
        content="0; url=./learn/foundations/first-neuron/"
      />
      <p>
        <a href="./learn/foundations/first-neuron/">
          {locale === 'ru' ? 'Открыть первый урок' : 'Open the first lesson'}
        </a>
      </p>
    </main>
  );
}
