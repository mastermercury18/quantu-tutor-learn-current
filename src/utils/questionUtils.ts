import * as tf from '@tensorflow/tfjs';
import { loadAquaTemplates } from './aquaratLoader';

// 0) Topics and model setup
export const topics = ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry'];
export const topicCount = topics.length;

// shared TF.js Q-network model
export const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
model.add(tf.layers.dense({ units: topicCount }));
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// Type for question templates
export type QuestionTemplate = {
  question: string;
  options: string[];
  answer: string;       // correct option (letter or text)
  explanation: string;
};

// 1) Handcrafted question bank
const handcrafted: Record<string, QuestionTemplate[]> = {
  algebra: [
    {
      question: 'Solve 3x + 6 = 15',
      options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
      answer: 'x = 3',
      explanation: 'Subtract 6 then divide by 3.'
    },
    // Add more handcrafted algebra questions here
  ],
  geometry: [],
  calculus: [],
  statistics: [],
  trigonometry: [],
};

// 2) Load & filter AquaRAT templates
const aqua = loadAquaTemplates();
const aquaByTopic: Record<string, QuestionTemplate[]> = {
  algebra: aqua.filter(q => /solve|equation|x/.test(q.question.toLowerCase())),
  geometry: aqua.filter(q => /area|circle|square|perimeter/.test(q.question.toLowerCase())),
  calculus: aqua.filter(q => /derivative|integral|maxim|profit/.test(q.question.toLowerCase())),
  statistics: aqua.filter(q => /mean|probability|variance|expectation/.test(q.question.toLowerCase())),
  trigonometry: aqua.filter(q => /sin|cos|tan|angle/.test(q.question.toLowerCase())),
};

// 3) Merge question banks
export const questions: Record<string, QuestionTemplate[]> = {
  algebra: [...handcrafted.algebra, ...aquaByTopic.algebra],
  geometry: [...handcrafted.geometry, ...aquaByTopic.geometry],
  calculus: [...handcrafted.calculus, ...aquaByTopic.calculus],
  statistics: [...handcrafted.statistics, ...aquaByTopic.statistics],
  trigonometry: [...handcrafted.trigonometry, ...aquaByTopic.trigonometry],
};

// 4) TEBD-inspired question generator (no SVD/diag)
export const generateTEBDQuestion = async (userState: any) => {
  // (a) Difficulty heuristic
  const base = 1 + (userState.weakTopics.length - userState.strongTopics.length) * 0.1;
  const noise = Math.random() - 0.5;
  const difficulty = Math.max(1, Math.round((base + noise) * 100) / 100);

  // (b) Build input state vector
  const stateVector = tf.tensor2d([[
    userState.masteryLevel,
    userState.streak,
    userState.totalQuestions,
    userState.correctAnswers,
    userState.averageTime ?? 0,
    difficulty,
  ]]);

  // (c) Predict Q-values for each topic
  const qTensor = model.predict(stateVector) as tf.Tensor;
  const qArrayRaw = (await qTensor.array()) as number[][];
  const qValues = qArrayRaw[0];

  // (d) TEBD-inspired time evolution via exponential damping
  const dt = 0.1;
  const q1d = tf.tensor1d(qValues);
  const expH = tf.exp(q1d.mul(-dt));
  const psi = expH.div(expH.sum());
  const quantumState = (await psi.array()) as number[];

  // (e) Sample a topic index from the quantumState distribution
  const rnd = Math.random();
  let accum = 0;
  let topicIndex = 0;
  for (let i = 0; i < quantumState.length; i++) {
    accum += quantumState[i];
    if (rnd < accum) {
      topicIndex = i;
      break;
    }
  }
  const selectedTopic = topics[topicIndex];

  // (f) Select a random question from the chosen topic
  const topicQuestions = questions[selectedTopic];
  const selectedQ = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];

  // (g) Return the formatted question
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'multiple-choice',
    difficulty,
    topic: selectedTopic,
    question: selectedQ.question,
    options: selectedQ.options,
    correctOption: selectedQ.answer,
    explanation: selectedQ.explanation,
    quantumState,
    qValues,
    topicIndex,
  };
};