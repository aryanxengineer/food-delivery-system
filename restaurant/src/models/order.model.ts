import { Schema, model, Document } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  restaurantId: string;
  restaurantName: string;

  riderId: string | null;
  riderPhone?: number;
  riderName?: string;

  distance: number;
  riderAmount: number;

  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;

  addressId: string;
  deliveryAddress: {
    formattedAddress: string;
    mobile: number;
    latitude: number;
    longitude: number;
  };

  status:
    | "placed"
    | "accepted"
    | "preparing"
    | "ready_for_rider"
    | "rider_assigned"
    | "picked_up"
    | "delivered"
    | "cancelled";

  paymentMethod: "razorpay" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";

  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema(
  {
    itemId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

/**
 * Delivery Address Sub Schema
 */
const deliveryAddressSchema = new Schema(
  {
    formattedAddress: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: Number,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    _id: false,
  },
);

/**
 * Main Order Schema
 */
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    restaurantId: {
      type: String,
      required: true,
      index: true,
    },

    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },

    riderId: {
      type: String,
      default: null,
      index: true,
    },

    riderPhone: {
      type: Number,
    },

    riderName: {
      type: String,
      trim: true,
    },

    distance: {
      type: Number,
      required: true,
      min: 0,
    },

    riderAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    addressId: {
      type: String,
      required: true,
    },

    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "ready_for_rider",
        "rider_assigned",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      default: "placed",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({
  userId: 1,
  createdAt: -1,
});

orderSchema.index({
  restaurantId: 1,
  status: 1,
});

orderSchema.index({
  riderId: 1,
  status: 1,
});

orderSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      paymentStatus: "pending",
    },
  },
);

export const OrderModel = model<IOrder>("Order", orderSchema);
