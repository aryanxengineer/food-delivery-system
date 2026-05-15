import { IOrder, OrderModel } from "../models/order.model.js";

type PartialOrder = Partial<Omit<IOrder, "_id">> & {
  _id?: string;
};

export class OrderRepository {
  constructor() {}

  create = async (data: Partial<IOrder>): Promise<IOrder> => {
    return OrderModel.create(data);
  };

  find = async (data: Partial<IOrder>) => {
    return OrderModel.find(data).sort({
      createdAt: -1,
    });
  };

  findOne = async (data: PartialOrder) => {
    return OrderModel.findOne(data);
  };

  findById = async (orderId: string) => {
    return OrderModel.findById(orderId);
  };

  findOneAndUpdate = async (data: Partial<IOrder>) => {
    return OrderModel.updateOne(data, { new: true });
  };

  findAvailableOrder = async (riderId: string) => {
    return OrderModel.findOne({
      riderId,
      status: { $ne: "delivered" },
    });
  };

  findOneAndUpdateRider = async (
    orderId: string,
    riderId: string,
    riderName: string,
    riderPhone: number,
  ) => {
    return OrderModel.findOneAndUpdate(
      { _id: orderId, riderId: null },
      {
        riderId,
        riderName,
        riderPhone,
        status: "rider_assigned",
      },
      { new: true },
    );
  };

  findOrderWithRestaurantDetails = async (riderId: string) => {
    return OrderModel.findOne({
      riderId,
      status: { $ne: "delivered" },
    }).populate("restaurantId");
  };
}
