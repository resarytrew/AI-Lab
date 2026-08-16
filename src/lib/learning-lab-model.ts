export type LearningLabSnapshot = {
  x: number;
  target: number;
  weight: number;
  bias: number;
  learningRate: number;
};

export type LearningLabReading = LearningLabSnapshot & {
  prediction: number;
  error: number;
  loss: number;
  gradWeight: number;
  gradBias: number;
};

export function readLearningLab(snapshot: LearningLabSnapshot): LearningLabReading {
  const prediction = snapshot.x * snapshot.weight + snapshot.bias;
  const error = prediction - snapshot.target;
  const loss = error ** 2;
  const gradWeight = 2 * error * snapshot.x;
  const gradBias = 2 * error;

  return {
    ...snapshot,
    prediction,
    error,
    loss,
    gradWeight,
    gradBias,
  };
}

export function updateLearningLab(snapshot: LearningLabSnapshot): LearningLabSnapshot {
  const reading = readLearningLab(snapshot);
  return {
    ...snapshot,
    weight: snapshot.weight - snapshot.learningRate * reading.gradWeight,
    bias: snapshot.bias - snapshot.learningRate * reading.gradBias,
  };
}

export function runLearningSteps(snapshot: LearningLabSnapshot, steps: number) {
  const history: number[] = [readLearningLab(snapshot).loss];
  let next = snapshot;

  for (let index = 0; index < steps; index += 1) {
    next = updateLearningLab(next);
    history.push(readLearningLab(next).loss);
  }

  return {snapshot: next, history};
}
