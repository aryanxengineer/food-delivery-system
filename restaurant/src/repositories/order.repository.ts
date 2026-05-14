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
}
