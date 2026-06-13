import { ZodMatchingSchema } from "./questionSchema";

export type MatchingPair = readonly [string, string];

export function buildMatchingFieldsFromPairs(
  pairs: MatchingPair[],
): Pick<ZodMatchingSchema, "options" | "answers" | "correct_answer"> | null {
  const validPairs = pairs
    .map(([key, value]) => [key.trim(), value.trim()] as const)
    .filter(([key, value]) => key.length > 0 && value.length > 0);

  if (validPairs.length === 0) {
    return null;
  }

  return {
    options: validPairs.map(([key]) => key),
    answers: validPairs.map(([, value]) => value),
    correct_answer: Object.fromEntries(validPairs),
  };
}
