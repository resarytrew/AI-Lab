'use client';

import {useCallback, useEffect, useState} from 'react';
import type {StarterLessonId} from '../content/learning-path';
import {
  ensureLessonModule,
  loadMyAiWorkspace,
  MYAI_WORKSPACE_EVENT,
  MYAI_WORKSPACE_STORAGE_KEY,
  persistMyAiWorkspace,
  resetWorkspaceFile,
  updateWorkspaceFile,
  type MyAiWorkspace,
} from './myai-workspace';

export function useMyAiWorkspace() {
  const [workspace, setWorkspace] = useState<MyAiWorkspace | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setWorkspace(loadMyAiWorkspace());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleWorkspaceEvent = () => refresh();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === MYAI_WORKSPACE_STORAGE_KEY) refresh();
    };

    window.addEventListener(MYAI_WORKSPACE_EVENT, handleWorkspaceEvent);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(MYAI_WORKSPACE_EVENT, handleWorkspaceEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const mutate = useCallback((recipe: (current: MyAiWorkspace) => MyAiWorkspace) => {
    const current = loadMyAiWorkspace();
    const next = recipe(current);
    if (next !== current) persistMyAiWorkspace(next);
    setWorkspace(next);
    setReady(true);
    return next;
  }, []);

  const ensureLessonFile = useCallback(
    (lessonId: StarterLessonId, starterCode: string) =>
      mutate((current) => ensureLessonModule(current, lessonId, starterCode)),
    [mutate],
  );

  const saveFile = useCallback(
    (path: string, content: string) => mutate((current) => updateWorkspaceFile(current, path, content)),
    [mutate],
  );

  const resetFile = useCallback(
    (path: string) => mutate((current) => resetWorkspaceFile(current, path)),
    [mutate],
  );

  return {
    workspace,
    ready,
    ensureLessonFile,
    saveFile,
    resetFile,
    refresh,
  };
}
