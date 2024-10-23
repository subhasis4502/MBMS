import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { usePaymentContext } from "../../contexts/PaymentContext";

interface TransferProfitProps {
  realisedProfit: number;
  isOpen: boolean;
  onClose: () => void;
}

const TransferProfitDialog: React.FC<TransferProfitProps> = ({
  realisedProfit,
  isOpen,
  onClose,
}) => {
  const { user } = useUserContext();
  const { orders, updateTransferStatus } = useOrderContext();
  const { addPayment } = usePaymentContext();

  const transferProfit = async () => {
    addPayment({
      amount: Number(realisedProfit.toFixed(0)),
      source: user?.name || "",
      type: "Credit",
    });

    // Update the order status to 'Payment Pending'
    orders
      .filter((order) => !order.transfer)
      .forEach((order) => updateTransferStatus(order._id, true));

    onClose();
  };

  const formatIndianCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" color="text.primary">
          Gained Profit
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h5" color="text.secondary">
          Ready to transfer {formatIndianCurrency(realisedProfit)} to your account?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={transferProfit}>Transfer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferProfitDialog;
