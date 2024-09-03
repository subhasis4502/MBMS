import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Theme,
  CircularProgress,
} from "@mui/material";
import CardItem from "../../components/CardItem/CardItem";
import CreateCardDialog from "../../components/CardItem/CreateCardDialog";
import { CardModel as CreditCard } from "../../types";
import { useUserContext } from "../../contexts/UserContext";
import { callApi } from "../../api/api";

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  useEffect(() => {
    // Fetch cards data here
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const fetchedCards = await callApi({ endpoint: "/cards", token: user?.token});
        setCards(fetchedCards);
        setError(null);
      } catch (err) {
        setError("Failed to load cards. Please try again later.");
        console.error("Error fetching cards:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleCreateCard = (newCard: Omit<CreditCard, "_id">) => {
    // In a real application, you would send this to your backend
    const cardWithId: CreditCard = { ...newCard, _id: Date.now().toString() };
    setCards([...cards, cardWithId]);
  };

  const filteredCards = cards.filter(card => card.type.toLowerCase().includes('card'));

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom>
        Cards
      </Typography>
      {user?.isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
          sx={{ mb: 2 }}
          fullWidth={isMobile}
        >
          Create Card
        </Button>
      )}
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card._id}>
              <CardItem card={card} />
            </Grid>
          ))}
        </Grid>
      )}
      <CreateCardDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCard}
      />
    </Box>
  );
};

export default CardsPage;
