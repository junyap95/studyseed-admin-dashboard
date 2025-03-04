import mongoose from "mongoose";

export interface IAdmin extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  dateCreated: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

export const Admin = mongoose.models.Admins || mongoose.model("Admins", AdminSchema, "admins");
