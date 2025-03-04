import mongoose from "mongoose";

const MDB_URI = process.env.MONGODB_URI;

export async function connectToMongoDB() {
  try {
    mongoose
      .connect(MDB_URI as string)
      .then(() => console.log("MDB Connected"))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  }
}
