import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  userId: string;
  mobile: number;

  formattedAddress: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: String,
      required: [true, "User id is required"],
      trim: true,
      index: true,
    },

    mobile: {
      type: Number,
      required: [true, "Mobile number is required"],
      validate: {
        validator: (value: number) => /^[6-9]\d{9}$/.test(value.toString()),
        message: "Invalid mobile number",
      },
    },

    formattedAddress: {
      type: String,
      required: [true, "Formatted address is required"],
      trim: true,
      minlength: [5, "Address too short"],
      maxlength: [500, "Address too long"],
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
  },
  {
    timestamps: true,
  },
);

addressSchema.index({ location: "2dsphere" });
addressSchema.index({
  userId: 1,
  createdAt: -1,
});

const AddressModel = mongoose.model<IAddress>("Address", addressSchema);
export default AddressModel;
