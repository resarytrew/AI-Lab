import {describe, expect, it} from 'vitest';
import {
  clampDataArchiveScene,
  initialDataArchiveProgress,
  restoreDataArchiveProgress,
} from './data-archive';

describe('data archive quest state', () => {
  it('clamps scene into the quest range', () => {
    expect(clampDataArchiveScene(-10)).toBe(0);
    expect(clampDataArchiveScene(5.8)).toBe(5);
    expect(clampDataArchiveScene(99)).toBe(11);
  });

  it('restores valid progress', () => {
    expect(
      restoreDataArchiveProgress(
        JSON.stringify({version: 1, scene: 7, journal: 'Данные требуют контекста', completed: true}),
      ),
    ).toEqual({version: 1, scene: 7, journal: 'Данные требуют контекста', completed: true});
  });

  it('falls back for corrupt or incompatible data', () => {
    expect(restoreDataArchiveProgress('{oops')).toEqual(initialDataArchiveProgress);
    expect(restoreDataArchiveProgress(JSON.stringify({version: 2, scene: 4}))).toEqual(
      initialDataArchiveProgress,
    );
  });
});
