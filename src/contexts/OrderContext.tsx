import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { callApi } from "../api/api";
import { OrderModel } from "../types";
import { useUserContext } from "./UserContext";

interface OrderContextType {
  orders: OrderModel[];
  fetchOrders: () => void;
  addOrder: (
    order: Omit<
      OrderModel,
      | "_id"
      | "delivery"
      | "returnAmount"
      | "orderDate"
      | "cashBack"
      | "commission"
      | "deliveryDate"
      | "totalProfit"
      | "transfer"
      | "doneByUser"
      | "cardName"
    >
  ) => void;
  updateOrderStatus: (id: string, status: OrderModel["delivery"]) => void;
  deleteOrder: (id: string) => void;
  prevOrders: (orders: OrderModel[]) => void;
  isLoading: boolean;
  error: string | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const fetchedOrders = await callApi({
        endpoint: "/orders",
        token: user?.token,
      });
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (
    order: Omit<
      OrderModel,
      | "_id"
      | "delivery"
      | "returnAmount"
      | "orderDate"
      | "cashBack"
      | "commission"
      | "deliveryDate"
      | "totalProfit"
      | "transfer"
      | "doneByUser"
      | "cardName"
    >
  ) => {
    try {
      const newOrder = await callApi({
        endpoint: "/orders",
        token: user?.token,
        requestType: "POST",
        data: order,
      });
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } catch (err) {
      setError("Failed to add order. Please try again.");
      console.error("Error adding order:", err);
    }
  };

  const updateOrderStatus = async (
    id: string,
    status: OrderModel["delivery"]
  ) => {
    try {
      debugger;
      const updatedOrder = await callApi({
        endpoint: `/orders/delivery/${id}`,
        token: user?.token,
        requestType: "PUT",
        data: { delivery: status },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, ...updatedOrder } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status. Please try again.");
      console.error("Error updating order status:", err);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await callApi({
        endpoint: `/orders/${id}`,
        token: user?.token,
        requestType: "DELETE",
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
    } catch (err) {
      setError("Failed to delete order. Please try again.");
      console.error("Error deleting order:", err);
    }
  };

  const prevOrders = (oldOrders: OrderModel[]) => {
    setOrders(oldOrders);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchOrders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        prevOrders,
        isLoading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
