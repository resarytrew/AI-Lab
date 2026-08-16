import {describe, expect, it} from 'vitest';
import {chapterEnrichment} from '@/content/chapter-enrichment';
import {starterLessons} from '@/content/learning-path';
import {buildReferenceSource, resolvePythonWorkerUrl} from './python-lab';

describe('python lab helpers', () => {
  it('builds a reference program from the lesson starter', () => {
    expect(buildReferenceSource('def f(x):\n    return ...', 'x * 2')).toBe('def f(x):\n    return x * 2');
  });

  it('keeps programs without an educational placeholder unchanged', () => {
    expect(buildReferenceSource('print("ready")', 'unused')).toBe('print("ready")');
  });

  it('builds a filled reference program for every starter Engineer challenge', () => {
    for (const lesson of starterLessons) {
      const engineer = chapterEnrichment[lesson.id].engineer;
      expect(engineer.starterCode.match(/\.\.\./g), lesson.id).toHaveLength(1);
      expect(buildReferenceSource(engineer.starterCode, engineer.expected), lesson.id).not.toContain('...');
    }
  });

  it('resolves the worker under the GitHub Pages repository base path', () => {
    expect(resolvePythonWorkerUrl({
      hostname: 'resarytrew.github.io',
      origin: 'https://resarytrew.github.io',
      pathname: '/AI-Lab/ru/journey/smart-machine/',
    } as Location)).toBe('https://resarytrew.github.io/AI-Lab/pyodide-worker.mjs');
  });

  it('resolves the worker at root during local development', () => {
    expect(resolvePythonWorkerUrl({
      hostname: 'localhost',
      origin: 'http://localhost:3000',
      pathname: '/ru/journey/smart-machine/',
    } as Location)).toBe('http://localhost:3000/pyodide-worker.mjs');
  });
});
