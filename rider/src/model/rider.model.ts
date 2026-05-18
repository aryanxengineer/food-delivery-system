import { Schema, model, Document } from "mongoose";

export interface IRiderProfile extends Document {
  riderId: string;
  picture: string;
  phoneNumber: string;
  aadharNumber: string;
  drivingLicenseNumber: string;
  isVerified: boolean;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  isAvailble: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const riderProfileSchema = new Schema<IRiderProfile>(
  {
    riderId: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    aadharNumber: {
      type: String,
      required: true,
    },
    drivingLicenseNumber: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    isAvailble: {
      type: Boolean,
      default: false,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const RiderProfileModel = model<IRiderProfile>("Rider", riderProfileSchema);
export default RiderProfileModel;
