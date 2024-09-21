import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import CreateCardDialog from "../../components/CardItem/CreateCardDialog";
import { useUserContext } from "../../contexts/UserContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { useHisabContext } from "../../contexts/HisabContext";
import { HisabModel } from "../../types";

const HisabsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hisabText, setHisabText] = useState("");
  const [selectedHisab, setSelectedHisab] = useState<HisabModel | null>(null);
  const { hisabs, addHisab, updateHisab, isLoading, error } = useHisabContext();
  const { user } = useUserContext();
  const { orders, updateOrderStatus } = useOrderContext();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const deliveredOrders = orders.filter(
    (order) => order.delivery === "Delivered"
  );

  const prepareHisab = () => {
    const previousDue = 0;
    const totalBalance =
      previousDue +
      deliveredOrders.reduce((sum, order) => sum + order.returnAmount, 0);

    const orderDetails = deliveredOrders
      .map(
        (order) =>
          `• ${order.deviceName} = ${order.returnAmount}(${order.orderId})`
      )
      .join("\n");

    const paymentDetails = deliveredOrders
      .map((order) => `${order.returnAmount}`)
      .join(" + ");

    setHisabText(
      `
        Previous Due = ${previousDue}
        ${orderDetails}

        Total Balance: ${previousDue} + ${paymentDetails} = ${totalBalance}
        `
    );
    console.log(hisabText);
  };

  const submitHisab = async () => {
    await prepareHisab();
    // Save to DB
    addHisab({
      title: "Test",
      details: hisabText,
    });

    // Update the order status to 'Payment Pending'
    deliveredOrders.forEach((order) =>
      updateOrderStatus(order._id, "Payment Pending")
    );
  };

  const revertHisab = () => {
    // Make the hisab inactive
    if (selectedHisab) {
      updateHisab(selectedHisab._id, { isActive: false });

      // Update the order status to 'Delivered'
      deliveredOrders.forEach((order) =>
        updateOrderStatus(order._id, "Delivered")
      );

      setIsCreateDialogOpen(false);
    }
  };

  const paymentCompleted = () => {
    // Update the hisab
    if (selectedHisab) {
      updateHisab(selectedHisab._id, { paymentReceived: true });

      // Update the order status to 'Money Received'
      deliveredOrders.forEach((order) =>
        updateOrderStatus(order._id, "Money Received")
      );

      setIsCreateDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {error && (
        <Alert severity="error" onClose={() => {}}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Hisab
      </Typography>
      {user?.isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitHisab()}
          sx={{ mb: 2 }}
          fullWidth={isMobile}
        >
          Create Hisab
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
          {hisabs.map((hisab) => (
            <Grid item xs={12} sm={6} md={4} key={hisab._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {hisab.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "pre-line",
                      maxHeight: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {hisab.details}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setIsCreateDialogOpen(true);
                        setSelectedHisab(hisab);
                      }}
                    >
                      More Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
              maxHeight: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedHisab?.details}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={revertHisab}>Revert</Button>
          <Button onClick={submitHisab}>Submit</Button>
          <Button onClick={paymentCompleted}>Payment Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HisabsPage;
