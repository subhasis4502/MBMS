import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { usePaymentContext } from "../../contexts/PaymentContext";
import { BANKS, CARDS, PaymentModel, USERS } from "../../types";

const Payment: React.FC = () => {
  const { payments, fetchPayments, addPayment, isLoading, error } =
    usePaymentContext();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "Credit" | "Debit">("all");

  const [newPayment, setNewPayment] = useState<
    Omit<PaymentModel, "_id" | "date" | "status">
  >({
    source: "",
    type: "Credit",
    amount: 0
  });

  const handleCreatePayment = async () => {
    addPayment(newPayment);
    setOpenCreateDialog(false);
  };

  const filteredPayments = payments.filter(
    (payment: PaymentModel) => filter === "all" || payment.type === filter
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payments
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateDialog(true)}
        sx={{ mb: 2, mr: 2 }}
      >
        Create Payment
      </Button>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          label="Filter"
          onChange={(e) =>
            setFilter(e.target.value as "all" | "Credit" | "Debit")
          }
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Credit">Credit</MenuItem>
          <MenuItem value="Debit">Debit</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredPayments.map((payment: PaymentModel) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.source}</TableCell>
                  <TableCell>{payment.type}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Create Payment Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create New Payment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Source</InputLabel>
            <Select
              value={newPayment.source}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  source: e.target.value as string,
                })
              }
            >
              {BANKS.map((bank) => (
                <MenuItem key={bank} value={bank}>{bank}</MenuItem>
              ))}
              {CARDS.map((card) => (
                <MenuItem key={card} value={card}>{card}</MenuItem>
              ))}
              {USERS.map((user) => (
                <MenuItem key={user} value={user}>{user}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newPayment.type}
              onChange={(e) =>
                setNewPayment({
                  ...newPayment,
                  type: e.target.value as "Credit" | "Debit",
                })
              }
            >
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            required
            value={newPayment.amount}
            onChange={(e) =>
              setNewPayment({
                ...newPayment,
                amount: parseFloat(e.target.value) || 0,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePayment}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
