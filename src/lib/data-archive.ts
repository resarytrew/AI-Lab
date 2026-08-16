export const DATA_ARCHIVE_SCENE_COUNT = 12;
export const DATA_ARCHIVE_PROGRESS_VERSION = 1;

export type DataArchiveProgress = {
  version: 1;
  scene: number;
  journal: string;
  completed: boolean;
};

export const initialDataArchiveProgress: DataArchiveProgress = {
  version: DATA_ARCHIVE_PROGRESS_VERSION,
  scene: 0,
  journal: '',
  completed: false,
};

export function clampDataArchiveScene(scene: number): number {
  if (!Number.isFinite(scene)) return 0;
  return Math.max(0, Math.min(DATA_ARCHIVE_SCENE_COUNT - 1, Math.trunc(scene)));
}

export function restoreDataArchiveProgress(raw: string | null): DataArchiveProgress {
  if (!raw) return initialDataArchiveProgress;

  try {
    const value = JSON.parse(raw) as Partial<DataArchiveProgress>;
    if (value.version !== DATA_ARCHIVE_PROGRESS_VERSION) return initialDataArchiveProgress;

    return {
      version: DATA_ARCHIVE_PROGRESS_VERSION,
      scene: clampDataArchiveScene(typeof value.scene === 'number' ? value.scene : 0),
      journal: typeof value.journal === 'string' ? value.journal.slice(0, 600) : '',
      completed: value.completed === true,
    };
  } catch {
    return initialDataArchiveProgress;
  }
}
