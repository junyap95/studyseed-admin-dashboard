import { Courses, ProgressModel, coursesArray, topicArray } from "@/lib/types";
import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  first_name: string;
  last_name: string;
  userid: string;
  enrolled_courses: Courses[];
  courses: string[];
  progress: Partial<ProgressModel>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    userid: {
      type: String,
    },
    enrolled_courses: {
      type: [String],
      enum: coursesArray,
    },
    courses: {
      default: [...topicArray],
    },
    progress: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { minimize: false }
);

export const User = mongoose.models.Users || mongoose.model("Users", UserSchema, "users");
