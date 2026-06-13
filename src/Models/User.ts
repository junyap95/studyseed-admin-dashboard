import mongoose, { Schema } from "mongoose";

import { ProgressModel } from "@/lib/types";
import { Topic } from "@/enums/topics.enum";
import { BASE_AVATAR } from "@/constants/constants";

export interface IUser extends mongoose.Document {
  first_name: string;
  last_name: string;
  userid: string;
  enrolled_courses: string[];
  // courses is more like Topics, but was named quite early on
  courses: Topic[];
  progress: Partial<ProgressModel>;
  avatar?: string;
  unlockedAvatars?: string[];
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
    },
    courses: {
      type: [String],
      enum: Object.values(Topic),
      required: true,
    },
    progress: {
      type: Schema.Types.Mixed,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: BASE_AVATAR,
    },
    unlockedAvatars: {
      type: [String],
      default: [],
    },
  },
  { minimize: false },
);

export const User = mongoose.models.Users || mongoose.model("Users", UserSchema, "users");
