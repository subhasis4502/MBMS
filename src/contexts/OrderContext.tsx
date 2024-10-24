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
      | "profit"
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
  updateOrderStatus: (
    id: string,
    status: OrderModel["delivery"],
    newOrderId?: string
  ) => void;
  updateTransferStatus: (
    id: string,
    transferStatus: boolean,
  ) => void;
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

  useEffect(() => {
    fetchOrders();
  }, [user]);

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
      | "profit"
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
    status: OrderModel["delivery"],
    newOrderId?: string
  ) => {
    try {
      const data: { delivery: OrderModel["delivery"]; orderId?: string } = {
        delivery: status,
      };

      if (newOrderId && newOrderId.trim() !== "") {
        data.orderId = newOrderId;
      }

      const updatedOrder = await callApi({
        endpoint: `/orders/delivery/${id}`,
        token: user?.token,
        requestType: "PUT",
        data,
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

  const updateTransferStatus = async (
    id: string,
    transferStatus: boolean,
  ) => {
    try {
      const data: { transfer:boolean; orderId?: string } = {
        transfer: transferStatus,
      };

      const updatedOrder = await callApi({
        endpoint: `/orders/transfer/${id}`,
        token: user?.token,
        requestType: "PUT",
        data,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, ...updatedOrder } : order
        )
      );
    } catch (err) {
      setError("Failed to update order transfer status. Please try again.");
      console.error("Error updating order tranfer status:", err);
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
        updateTransferStatus,
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
