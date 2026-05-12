import { OrderRepository } from "../repositories/order.repository.js";
import { InputCreateOrderType } from "../validators/order.schema.js";

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  /**
   * Create New Order
   */
  createOrder = async (userId: string, orderData: InputCreateOrderType) => {
    
  };

  /**
   * Fetch My Orders
   */
  getMyOrders = async (userId: string) => {};

  /**
   * Fetch Single Order
   */
  fetchSingleOrder = async (orderId: string) => {};

  /**
   * Fetch Restaurant Orders
   */
  fetchRestaurantOrders = async (restaurantId: string) => {};

  /**
   * Update Order Status
   */
  updateOrderStatus = async (orderId: string, status: string) => {};

  /**
   * Assign Rider To Order
   */
  assignRiderToOrder = async (riderData: {
    orderId: string;
    riderId: string;
    riderName: string;
    riderPhone: number;
  }) => {};

  /**
   * Get Current Order For Rider
   */
  getCurrentOrderForRider = async (riderId: string) => {};

  /**
   * Update Rider Order Status
   */
  updateOrderStatusRider = async (
    riderId: string,
    orderId: string,
    status: string,
  ) => {};

  /**
   * Fetch Order For Payment
   */
  fetchOrderForPayment = async (orderId: string) => {};
}
