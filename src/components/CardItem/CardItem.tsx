import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { CardModel as CreditCard } from "../../types";

const StyledCard = styled(Card)(({ theme }) => ({
  height: 224,
  background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
}));

const CurrentLimit = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  // color: theme.palette.error.main,
}));

interface CardItemProps {
  card: CreditCard;
}

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  return (
    <Stack spacing={2}>
      {card.name.map((cardName) => (
        <StyledCard>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {cardName}
              </Typography>
              <Typography variant="body2">{card.type}</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Current Limit: </Typography>
              <CurrentLimit gutterBottom>
                ₹{card.currentLimit.toLocaleString()}
              </CurrentLimit>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  Total Credit Used: ₹
                  {card.payments
                    .filter((payment) => payment.type === "Debit" && payment.source === cardName)
                    .reduce((total, payment) => total + payment.amount, 0)
                    .toLocaleString()}
                </Typography>

                <Typography variant="body2">
                  Due: {new Date(card.billDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" alignSelf="flex-end">
              Status: {card.isActive ? "Active" : "Inactive"}
            </Typography>
          </CardContent>
        </StyledCard>
      ))}
    </Stack>
  );
};

export default CardItem;
