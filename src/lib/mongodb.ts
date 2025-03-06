import mongoose from "mongoose";

export async function connectToMongoDB() {
  try {
    mongoose
      .connect(process.env.MONGODB_URI as string)
      .then(() => console.log("MDB Connected"))
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  }
}
