import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { HisabModel } from "../types";
import { useUserContext } from "./UserContext";
import { callApi } from "../api/api";

interface HisabContextType {
  hisabs: HisabModel[];
  fetchHisabs: () => void;
  addHisab: (
    hisab: Omit<HisabModel, "_id" | "isActive" | "paymentReceived">
  ) => void;
  updateHisab: (_id: string, updates: Partial<HisabModel>) => void;
  isLoading: boolean;
  error: string | null;
}

const HisabContext = createContext<HisabContextType | undefined>(undefined);

export const useHisabContext = () => {
  const context = useContext(HisabContext);
  if (!context) {
    throw new Error("useHisabContext must be used within a HisabProvider");
  }
  return context;
};

export const HisabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [hisabs, setHisabs] = useState<HisabModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHisabs();
  }, [user]);

  const fetchHisabs = async () => {
    try {
      setIsLoading(true);
      const fetchedHisabs = await callApi({
        endpoint: "/hisabs",
        token: user?.token,
      });
      setHisabs(fetchedHisabs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hisabs. Please try again later.");
      console.error("Error fetching hisabs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addHisab = async (
    hisab: Omit<HisabModel, "_id" | "isActive" | "paymentReceived">
  ) => {
    try {
      const newHisab = await callApi({
        endpoint: "/hisabs",
        token: user?.token,
        requestType: "POST",
        data: hisab,
      });
      setHisabs([newHisab, ...hisabs]);
    } catch (err) {
      setError("Failed to add hisab. Please try again.");
      console.error("Error adding hisab:", err);
    }
  };

  const updateHisab = async (id: string, updates: Partial<HisabModel>) => {
    try {
      const updatedHisab = await callApi({
        endpoint: `/hisabs/${id}`,
        token: user?.token,
        requestType: "PUT",
        data: updates,
      });
      setHisabs(
        hisabs.map((p) => (p._id === id ? { ...p, ...updatedHisab } : p))
      );
    } catch (err) {
      setError("Failed to update hisab. Please try again.");
      console.error("Error updating hisab:", err);
    }
  };

  const value = {
    hisabs,
    fetchHisabs,
    addHisab,
    updateHisab,
    isLoading,
    error,
  };

  return (
    <HisabContext.Provider value={value}>{children}</HisabContext.Provider>
  );
};
