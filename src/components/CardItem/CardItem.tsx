import React from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { CardModel as CreditCard } from "../../types";

const BlurredCard = styled(Card)<{ isActive: boolean }>(({ isActive }) => ({
  filter: isActive ? "none" : "blur(4px) grayscale(100%)",
  opacity: isActive ? 1 : 0.7,
  transition: "filter 0.3s, opacity 0.3s",
}));

interface CardItemProps {
  card: CreditCard;
}

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  return (
    <Stack spacing={2}>
      {card.name.map((cardName) => (
        <BlurredCard isActive={card.isActive}>
          <CardContent>
            <Typography variant="h6" component="div" noWrap>
              {cardName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {card.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Limit: {card.totalLimit.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Limit: {card.currentLimit.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bill Date: {new Date(card.billDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {card.isActive ? "Active" : "Inactive"}
            </Typography>
          </CardContent>
        </BlurredCard>
      ))}
    </Stack>
  );
};

export default CardItem;
