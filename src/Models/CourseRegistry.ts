import mongoose from "mongoose";

export interface ICourseRegistry extends mongoose.Document {
  code: string;
  displayName: string;
  topics: string[];
  createdAt: Date;
}

const CourseRegistrySchema = new mongoose.Schema<ICourseRegistry>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    topics: {
      type: [String],
      required: true,
      validate: {
        validator: (topics: string[]) => topics.length > 0,
        message: "A course must have at least one topic",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false },
);

export const CourseRegistry =
  mongoose.models.CourseRegistry ||
  mongoose.model<ICourseRegistry>("CourseRegistry", CourseRegistrySchema, "course_registry");
