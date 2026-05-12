import { ObjectId } from "mongodb";
import { connectDb } from "../config/database.config.js";

export class RiderRepository {
  async findPending() {
    const db = await connectDb();

    return db.collection("riders").find({ isVerified: false }).toArray();
  }

  async verifyById(id: string) {
    const db = await connectDb();

    return db.collection("riders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  async findById(id: string) {
    const db = await connectDb();

    return db.collection("riders").findOne({
      _id: new ObjectId(id),
    });
  }
}
