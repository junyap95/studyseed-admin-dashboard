import { Courses, ProgressModel } from "./types";

export const initializeProgress = (courses: Courses[]): Partial<ProgressModel> => {
  const initialData = {} as Partial<ProgressModel>; // use type assertion here to tell TS that the empty object will eventually have the shape of ProgressModel
  courses.forEach((course: Courses) => {
    initialData[course] = {
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
    result += characters[randomIndex];
  }
  return result;
};
