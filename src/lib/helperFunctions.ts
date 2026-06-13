import { ProgressModel } from "./types";

export const initializeProgress = (courseCodes: string[]): Partial<ProgressModel> => {
  const initialData: Partial<ProgressModel> = {};
  courseCodes.forEach((courseCode: string) => {
    initialData[courseCode] = {
      LITERACY: {},
      NUMERACY: {},
    };
  });
  return initialData;
};

export const generateRandomLetters = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};
