// src/utils/aquaratLoader.ts

import rawData from '../data/aquarat.json';
import type { QuestionTemplate } from './questionUtils';

// Adapter: try all plausible fields for the correct answer
export function loadAquaTemplates(): QuestionTemplate[] {
  return (rawData as any[]).map(item => {
    const rawAnswer =
      item.answer ??
      item.correct ??
      item.answerKey ??
      item.answer_key ??
      item.correct_answer ??
      '';
    return {
      question: String(item.question),
      options: (item.options || []).map((o: any) => String(o)),
      answer: String(rawAnswer).trim(),
      explanation: String(item.explanation ?? item.rationale ?? '').trim(),
    };
  });
}
