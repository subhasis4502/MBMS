import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CardModel } from "../types";
import { useUserContext } from "./UserContext";
import { callApi } from "../api/api";

interface CardContextType {
  cards: CardModel[];
  fetchCards: () => void;
  addCard: (card: Omit<CardModel, "_id" | "currentLimit" | "payments">) => void;
  isLoading: boolean;
  error: string | null;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

export const CardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [cards, setCards] = useState<CardModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [user]);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const fetchedCards = await callApi({ endpoint: "/cards", token: user?.token });
      setCards(fetchedCards);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cards. Please try again later.");
      console.error("Error fetching cards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addCard = async (
    card: Omit<CardModel, "_id" | "currentLimit" | "payments">
  ) => {
    try {
      const newCard = await callApi({
        endpoint: "/cards",
        token: user?.token,
        requestType: "POST",
        data: card,
      });
      setCards([...cards, newCard]);
    } catch (err) {
      setError("Failed to add payment. Please try again.");
      console.error("Error adding payment:", err);
    }
  };

  const value = {
    cards,
    fetchCards,
    addCard,
    isLoading,
    error,
  };

  return (
    <CardContext.Provider value={value}>{children}</CardContext.Provider>
  );
};
