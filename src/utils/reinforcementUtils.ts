import * as tf from '@tensorflow/tfjs';

const gamma = 0.95; // discount factor

interface UserState {
  masteryLevel: number;
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  weakTopics: string[];
  strongTopics: string[];
}

export const updateState = async (
  model: tf.LayersModel,
  userState: UserState,
  isCorrect: boolean,
  timeTaken: number,
  topicIndex: number,
  nextUserState: UserState
): Promise<UserState> => {
  const weak = userState.weakTopics ?? [];
  const strong = userState.strongTopics ?? [];

  const currentState = tf.tensor2d([[
    userState.masteryLevel ?? 1,
    userState.streak ?? 0,
    userState.totalQuestions ?? 0,
    userState.correctAnswers ?? 0,
    weak.length,
    strong.length
  ]]);

  const nextWeak = nextUserState.weakTopics ?? [];
  const nextStrong = nextUserState.strongTopics ?? [];

  const nextState = tf.tensor2d([[
    nextUserState.masteryLevel ?? 1,
    nextUserState.streak ?? 0,
    nextUserState.totalQuestions ?? 0,
    nextUserState.correctAnswers ?? 0,
    nextWeak.length,
    nextStrong.length
  ]]);

  const target = await model.predict(currentState) as tf.Tensor;
  const targetQ = await target.array() as number[][];

  const futureQ = await model.predict(nextState) as tf.Tensor;
  const futureQMax = Math.max(...(await futureQ.array() as number[][])[0]);

  const reward = isCorrect ? 1 + Math.max(0, (10000 - timeTaken) / 10000) : -0.5;
  targetQ[0][topicIndex] = reward + gamma * futureQMax;

  await model.fit(currentState, tf.tensor2d(targetQ), { epochs: 1, verbose: 0 });

  return nextUserState;
};
