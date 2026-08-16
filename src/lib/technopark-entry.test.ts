import {describe, expect, it} from 'vitest';
import {
  clampScene,
  hasCoreAbilitySet,
  initialQuestProgress,
  progressPercent,
  restoreQuestProgress,
  toggleInList,
} from './technopark-entry';

describe('technopark entry quest domain', () => {
  it('keeps scene indices inside the quest', () => {
    expect(clampScene(-3)).toBe(0);
    expect(clampScene(999)).toBe(11);
  });

  it('calculates bounded progress', () => {
    expect(progressPercent(0)).toBe(0);
    expect(progressPercent(11)).toBe(100);
  });

  it('toggles immutable selections', () => {
    expect(toggleInList(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleInList(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('requires a meaningful set of intelligence abilities', () => {
    expect(hasCoreAbilitySet(['knowledge', 'learning', 'reasoning'])).toBe(false);
    expect(
      hasCoreAbilitySet(['knowledge', 'learning', 'reasoning', 'planning']),
    ).toBe(true);
  });

  it('restores only a valid persisted schema', () => {
    expect(restoreQuestProgress(null)).toEqual(initialQuestProgress);
    expect(
      restoreQuestProgress(
        JSON.stringify({
          version: 1,
          scene: 4,
          smartSystems: ['calculator'],
          abilities: ['learning', 'unknown'],
          journal: 'test',
          completed: false,
        }),
      ),
    ).toMatchObject({scene: 4, abilities: ['learning'], journal: 'test'});
  });
});
