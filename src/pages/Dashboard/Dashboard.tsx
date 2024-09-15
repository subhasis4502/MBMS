// src/pages/Dashboard/Dashboard.tsx
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useUserContext } from "../../contexts/UserContext";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { DASHBOARD_CARDS, INITIAL_BALANCE } from "../../constants/constant";
import { usePaymentContext } from "../../contexts/PaymentContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { useCardContext } from "../../contexts/CardContext";

const Dashboard: React.FC = () => {
  const { user } = useUserContext();
  const { payments } = usePaymentContext();
  const { orders } = useOrderContext();
  const { cards } = useCardContext();

  if (!user) {
    return <Typography>Please log in to view the dashboard.</Typography>;
  }

  // Calculation for dashboard metrics
  // Current balance: Initial balance + Total Amount receive in bank - Credit Card Payments
  const currentBalance =
    INITIAL_BALANCE +
    payments
      .filter(
        (payment) =>
          payment.source.includes("Savings") && payment.type === "Credit"
      )
      .reduce((sum, payment) => sum + payment.amount, 0) -
    payments
      .filter(
        (payment) =>
          !payment.source.includes("Savings") && payment.type === "Credit"
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

  // Total credit used
  const totalCreditUsed = cards
    .filter((card) => card.type.toLowerCase().includes("card"))
    .reduce((sum, card) => sum + card.totalLimit - card.currentLimit, 0);

  // Money yet to receive
  const moneyYetToReceive = orders
    .filter((order) => order.delivery !== "Money Received")
    .reduce((sum, payment) => sum + payment.returnAmount, 0);

  // Total Profit
  const totalTurnover = orders.reduce(
    (sum, payment) => sum + payment.returnAmount,
    0
  );

  // Total Profit
  const totalProfit = orders
    .filter((order) => order.doneByUser == user.name)
    .reduce((sum, payment) => sum + payment.profit, 0);

  // Realised Profit
  const realisedProfit = orders
    .filter((order) => order.delivery === "Money Received" && !order.transfer)
    .reduce((sum, payment) => sum + payment.profit, 0);

  const previousDue = 1000;

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to your Dashboard, {user.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography>Name: {user.name}</Typography>
            <Typography>Email: {user.email}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity Summary
            </Typography>
            <Typography>Last login: {new Date().toLocaleString()}</Typography>
            <Typography>Account status: Active</Typography>
          </Paper>
        </Grid>
        {user.isAdmin && (
          <Grid item xs={12} md={6}>
            <DashboardCard title={DASHBOARD_CARDS[0]} value={currentBalance} />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <DashboardCard title={DASHBOARD_CARDS[1]} value={totalCreditUsed} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard title={DASHBOARD_CARDS[2]} value={moneyYetToReceive} />
        </Grid>
        {user.isAdmin && (
          <Grid item xs={12} md={6}>
            <DashboardCard title={DASHBOARD_CARDS[3]} value={totalTurnover} />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <DashboardCard title={DASHBOARD_CARDS[4]} value={totalProfit} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard title={DASHBOARD_CARDS[5]} value={realisedProfit} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
