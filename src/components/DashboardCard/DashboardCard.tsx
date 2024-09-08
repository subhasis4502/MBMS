import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface DashboardCardProps {
  title: string;
  value: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: 120,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "bold",
  color: theme.palette.text.secondary,
}));

const formatIndianCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  const formattedValue = formatIndianCurrency(value);

  return (
    <StyledCard>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" justifyContent="flex-start">
          <Title variant="h5">{title}</Title>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Value variant="h4">{formattedValue}</Value>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default DashboardCard;
