export const topicArray = ["LITERACY", "NUMERACY"] as const;
export const coursesArray = ["GES", "GES2"] as const;

export interface SubjectScores {
  // course module is key and value is an array of tuples
  // first element is the score and second element is the date
  [key: string]: [number, string][];
}
export type Topics = (typeof topicArray)[number];

export type ModuleTopic = {
  [key in Topics]: SubjectScores;
};

export interface ProgressModel {
  GES: ModuleTopic;
  GES2: ModuleTopic;
  // Add more keys as needed
}

export type Courses = (typeof coursesArray)[number];
