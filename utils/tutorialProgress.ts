import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type TutorialProgress = {
  completedSteps: number[];
  lastStep: number;
};

const TUTORIAL_PROGRESS_KEY = 'mining_tutorial_progress';
const DEFAULT_PROGRESS: TutorialProgress = { completedSteps: [], lastStep: 1 };

const isWeb = Platform.OS === 'web';

async function readProgress(): Promise<TutorialProgress> {
  try {
    if (isWeb && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(TUTORIAL_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    }
    const saved = await SecureStore.getItemAsync(TUTORIAL_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

async function writeProgress(progress: TutorialProgress): Promise<void> {
  try {
    const serialized = JSON.stringify(progress);
    if (isWeb && typeof localStorage !== 'undefined') {
      localStorage.setItem(TUTORIAL_PROGRESS_KEY, serialized);
      return;
    }
    await SecureStore.setItemAsync(TUTORIAL_PROGRESS_KEY, serialized);
  } catch {
    // ignore
  }
}

export const getTutorialProgress = async (): Promise<TutorialProgress> => {
  return readProgress();
};

export const updateTutorialProgress = async (step: number, isCompleted: boolean): Promise<void> => {
  const progress = await readProgress();
  if (isCompleted && !progress.completedSteps.includes(step)) {
    progress.completedSteps = [...progress.completedSteps, step];
  } else if (!isCompleted) {
    progress.completedSteps = progress.completedSteps.filter((s) => s !== step);
  }
  progress.lastStep = Math.max(progress.lastStep, step);
  await writeProgress(progress);
};

export const isStepCompleted = async (step: number): Promise<boolean> => {
  const progress = await readProgress();
  return progress.completedSteps.includes(step);
};

export const getLastStep = async (): Promise<number> => {
  const progress = await readProgress();
  return progress.lastStep;
};
