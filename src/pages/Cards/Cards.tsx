import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Theme,
  CircularProgress,
  Alert,
} from "@mui/material";
import CardItem from "../../components/CardItem/CardItem";
import CreateCardDialog from "../../components/CardItem/CreateCardDialog";
import { CardModel as CreditCard } from "../../types";
import { useUserContext } from "../../contexts/UserContext";
import { useCardContext } from "../../contexts/CardContext";

const CardsPage: React.FC = () => {
  const { cards, fetchCards, addCard, isLoading, error } = useCardContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useUserContext();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleCreateCard = async (
    newCard: Omit<CreditCard, "_id" | "currentLimit" | "payments">
  ) => {
    await addCard(newCard);
  };

  const filteredCards = cards.filter((card) =>
    card.type.toLowerCase().includes("card")
  );

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {error && (
        <Alert severity="error" onClose={() => {}}>
          {error}
        </Alert>
      )}
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
