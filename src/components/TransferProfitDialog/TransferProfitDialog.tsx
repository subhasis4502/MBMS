import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useOrderContext } from "../../contexts/OrderContext";

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
  const { orders, updateTransferStatus } = useOrderContext();

  const transferProfit = async () => {
    orders
      .filter((order) => order.delivery === "Money Received" && !order.transfer)
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
