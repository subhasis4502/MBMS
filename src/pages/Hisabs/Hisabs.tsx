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
import { useUserContext } from "../../contexts/UserContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { useHisabContext } from "../../contexts/HisabContext";
import { HisabModel, OrderModel } from "../../types";
import { usePaymentContext } from "../../contexts/PaymentContext";

const HisabsPage: React.FC = () => {
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [hisabText, setHisabText] = useState("");

  const [selectedHisab, setSelectedHisab] = useState<HisabModel | null>(null);
  const { hisabs, fetchHisabs, addHisab, updateHisab, isLoading, error } =
    useHisabContext();
  const { user } = useUserContext();
  const { lastPayment } = usePaymentContext();
  const { orders, fetchOrders, updateOrderStatus } = useOrderContext();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const [deliveredOrders, setDeliveredOrders] = useState<OrderModel[]>(
    orders.filter((order) => order.delivery === "Delivered")
  );

  const previousDue = hisabs[0]?.totalAmount - (lastPayment?.amount || 0);

  const prepareHisab = () => {
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
    setIsSubmitDialogOpen(true);
  };

  const submitHisab = async () => {
    // Generate title with today's date and value-item count
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const itemCount = deliveredOrders.length;
    const totalValue =
      previousDue +
      deliveredOrders.reduce((sum, order) => sum + order.returnAmount, 0);

    const title = `${dateString}_${totalValue.toFixed(2)}_${itemCount}`;
    // Save to DB
    addHisab({
      title,
      details: hisabText,
      totalAmount: totalValue,
    });

    // Update the order status to 'Payment Pending'
    deliveredOrders.forEach((order) =>
      updateOrderStatus(order._id, "Payment Pending")
    );

    await fetchOrders();
    setIsSubmitDialogOpen(false);
    setHisabText("");
    setDeliveredOrders(
      orders.filter((order) => order.delivery === "Delivered")
    );
  };

  const revertHisab = async () => {
    // Make the hisab inactive
    if (selectedHisab) {
      updateHisab(selectedHisab._id, { isActive: false });

      // Update the order status to 'Delivered'
      deliveredOrders.forEach((order) =>
        updateOrderStatus(order._id, "Delivered")
      );

      await fetchHisabs();
      await fetchOrders();
      setIsMoreDialogOpen(false);
      setHisabText("");
      setDeliveredOrders(
        orders.filter((order) => order.delivery === "Delivered")
      );
    }
  };

  const paymentCompleted = async () => {
    // Update the hisab
    if (selectedHisab) {
      updateHisab(selectedHisab._id, { paymentReceived: true });

      // Update the order status to 'Money Received'
      deliveredOrders.forEach((order) =>
        updateOrderStatus(order._id, "Money Received")
      );

      setIsMoreDialogOpen(false);
      setHisabText("");
      await fetchOrders();
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
      {user?.isAdmin && deliveredOrders.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={prepareHisab}
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
                      textOverflow: "ellipsis",
                    }}
                  >
                    {hisab.details}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      disabled={hisab.paymentReceived}
                      color="primary"
                      onClick={() => {
                        setIsMoreDialogOpen(true);
                        setSelectedHisab(hisab);
                      }}
                    >
                      More Actions
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* More actions dialog */}
      <Dialog
        open={isMoreDialogOpen}
        onClose={() => setIsMoreDialogOpen(false)}
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
          <Button onClick={paymentCompleted}>Payment Done</Button>
        </DialogActions>
      </Dialog>

      {/* Submit Hisab dialog */}
      <Dialog
        open={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
      >
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
              maxHeight: "150px",
              overflow: "auto",
              textOverflow: "ellipsis",
            }}
          >
            {hisabText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitHisab}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HisabsPage;
