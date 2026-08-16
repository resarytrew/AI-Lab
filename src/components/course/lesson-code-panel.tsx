'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export function LessonCodePanel({
  fileName,
  lines,
  output,
  onRun,
  onReset,
  nextHref,
  helper,
}: {
  fileName: string;
  lines: readonly string[];
  output: string | null;
  onRun: () => void;
  onReset: () => void;
  nextHref?: string;
  helper?: string;
}) {
  const t = useTranslations();
  const keyedLines = lines.map((text, position) => ({
    id: `code-line-${position + 1}`,
    text,
  }));

  return (
    <aside className="code-column" id="code">
      <div className="code-editor">
        <div className="code-toolbar">
          <strong>🐍 {fileName}</strong>
          <div>
            <button type="button" onClick={onReset}>
              ↻ {t('code.reset')}
            </button>
            <button type="button" className="run-button" onClick={onRun}>
              ▷ {t('code.run')}
            </button>
          </div>
        </div>
        <ol className="code-lines">
          {keyedLines.map((line) => (
            <li key={line.id}>
              <code>{line.text || ' '}</code>
            </li>
          ))}
        </ol>
        <div className="terminal-output">
          <span>›</span>
          {output ?? t('code.ready')}
        </div>
      </div>
      <div className="code-actions">
        <button type="button" onClick={onReset}>
          ↻ {t('code.reset')}
        </button>
        {nextHref ? (
          <Link className="next-button code-next-link" href={nextHref}>
            {t('code.next')} →
          </Link>
        ) : (
          <button type="button" className="next-button" disabled>
            {t('code.next')} →
          </button>
        )}
      </div>
      <p className="code-helper">{helper ?? t('code.helper')}</p>
    </aside>
  );
}
