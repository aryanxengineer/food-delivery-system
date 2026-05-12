import { ObjectId } from "mongodb";
import { connectDb } from "../config/database.config.js";

export class RestaurantRepository {
  async findPending() {
    const db = await connectDb();
    return db.collection("restaurants")
      .find({ isVerified: false })
      .toArray();
  }

  async verifyById(id: string) {
    const db = await connectDb();
    return db.collection("restaurants").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVerified: true, updatedAt: new Date() } }
    );
  }
}