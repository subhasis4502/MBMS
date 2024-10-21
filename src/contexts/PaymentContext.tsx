import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { callApi } from "../api/api";
import { PaymentModel } from "../types";
import { useUserContext } from "./UserContext";

interface PaymentContextType {
  payments: PaymentModel[];
  lastPayment: PaymentModel[];
  fetchPayments: () => void;
  fetchLastPayment: () => void;
  addPayment: (payment: Omit<PaymentModel, "_id" | "date" | "status">) => void;
  updatePayment: (_id: string, updates: Partial<PaymentModel>) => void;
  deletePayment: (_id: string) => void;
  prevPayments: (payments: PaymentModel[]) => void;
  isLoading: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [lastPayment, setLastPayment] = useState<PaymentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const fetchedPayments = await callApi({ endpoint: "/payments", token: user?.token });
      setPayments(fetchedPayments);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payments. Please try again later.");
      console.error("Error fetching payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastPayment = async () => {
    try {
      const lastPayment = await callApi({ endpoint: "/payments/last", token: user?.token });
      setLastPayment([lastPayment]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch last payment. Please try again later.");
      console.error("Error fetching last payment:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const addPayment = async (
    payment: Omit<PaymentModel, "_id" | "date" | "status">
  ) => {
    try {
      const newPayment = await callApi({
        endpoint: "/payments",
        token: user?.token,
        requestType: "POST",
        data: payment,
      });
      setPayments([...payments, newPayment]);
    } catch (err) {
      setError("Failed to add payment. Please try again.");
      console.error("Error adding payment:", err);
    }
  };

  const updatePayment = async (id: string, updates: Partial<PaymentModel>) => {
    try {
      const updatedPayment = await callApi({
        endpoint: `/payments/${id}`,
        token: user?.token,
        requestType: "PUT",
        data: updates,
      });
      setPayments(
        payments.map((p) => (p._id === id ? { ...p, ...updatedPayment } : p))
      );
    } catch (err) {
      setError("Failed to update payment. Please try again.");
      console.error("Error updating payment:", err);
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await callApi({
        endpoint: `/payments/${id}`,
        token: user?.token,
        requestType: "DELETE",
      });
      setPayments(payments.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete payment. Please try again.");
      console.error("Error deleting payment:", err);
    }
  };

  const prevPayments = (oldPayments: PaymentModel[]) => {
    setPayments(oldPayments);
  };

  const value = {
    payments,
    lastPayment,
    fetchPayments,
    fetchLastPayment,
    addPayment,
    updatePayment,
    deletePayment,
    prevPayments,
    isLoading,
    error,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
