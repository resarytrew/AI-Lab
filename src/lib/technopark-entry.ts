export const TECHNOPARK_ENTRY_SCENE_COUNT = 12;

export const intelligenceAbilities = [
  'knowledge',
  'communication',
  'understanding',
  'learning',
  'reasoning',
  'planning',
] as const;

export type IntelligenceAbility = (typeof intelligenceAbilities)[number];

export type QuestProgress = {
  version: 1;
  scene: number;
  smartSystems: string[];
  abilities: IntelligenceAbility[];
  journal: string;
  completed: boolean;
};

export const initialQuestProgress: QuestProgress = {
  version: 1,
  scene: 0,
  smartSystems: [],
  abilities: [],
  journal: '',
  completed: false,
};

export function clampScene(scene: number) {
  return Math.min(Math.max(Math.trunc(scene), 0), TECHNOPARK_ENTRY_SCENE_COUNT - 1);
}

export function progressPercent(scene: number) {
  const current = clampScene(scene);
  return Math.round((current / (TECHNOPARK_ENTRY_SCENE_COUNT - 1)) * 100);
}

export function toggleInList<T extends string>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function hasCoreAbilitySet(abilities: readonly IntelligenceAbility[]) {
  return new Set(abilities).size >= 4;
}

export function restoreQuestProgress(value: string | null): QuestProgress {
  if (!value) return initialQuestProgress;

  try {
    const parsed = JSON.parse(value) as Partial<QuestProgress>;
    if (parsed.version !== 1) return initialQuestProgress;

    const abilities = Array.isArray(parsed.abilities)
      ? parsed.abilities.filter((item): item is IntelligenceAbility =>
          intelligenceAbilities.includes(item as IntelligenceAbility),
        )
      : [];

    return {
      version: 1,
      scene: clampScene(typeof parsed.scene === 'number' ? parsed.scene : 0),
      smartSystems: Array.isArray(parsed.smartSystems)
        ? parsed.smartSystems.filter((item): item is string => typeof item === 'string')
        : [],
      abilities,
      journal: typeof parsed.journal === 'string' ? parsed.journal.slice(0, 500) : '',
      completed: parsed.completed === true,
    };
  } catch {
    return initialQuestProgress;
  }
}
