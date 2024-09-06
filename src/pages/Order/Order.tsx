// src/pages/Order/Order.tsx
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
import EditIcon from "@mui/icons-material/Edit";
import { useOrderContext } from "../../contexts/OrderContext";
import { useUserContext } from "../../contexts/UserContext";
import { usePaymentContext } from "../../contexts/PaymentContext";
import { CARDS, PLATFORM } from "../../types";

const Order: React.FC = () => {
  const { orders, fetchOrders, addOrder, updateOrderStatus, isLoading, error } =
    useOrderContext();
  const { addPayment } = usePaymentContext();
  const { user } = useUserContext();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({
    deviceName: "",
    platform: "",
    orderId: "",
    card: "",
    quantity: 1,
    pincode: "",
    amountPaid: 0,
    profit: 0,
    doneBy: "",
  });
  const [newStatus, setNewStatus] = useState<
    "Pending" | "Shipped" | "Delivered"
  >("Delivered");

  const handleCreateOrder = async () => {
    const username = user ? user.username : "";

    await addOrder({ ...newOrder, doneBy: username });
    if (!error) {
      addPayment({
        amount: newOrder.amountPaid,
        source: newOrder.card,
        type: "Debit",
      });

      setNewOrder({
        deviceName: "",
        platform: "",
        orderId: "",
        card: "",
        quantity: 1,
        pincode: "",
        amountPaid: 0,
        profit: 0,
        doneBy: "",
      });
    }
    setOpenCreateDialog(false);
  };

  const handleUpdateStatus = () => {
    console.log(selectedOrder);
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, newStatus);
      setOpenUpdateDialog(false);
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
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
        sx={{ mb: 2 }}
      >
        Create Order
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
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
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.deviceName}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.delivery}</TableCell>
                  <TableCell>{order.amountPaid}</TableCell>
                  <TableCell>{order.pincode}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelectedOrder(order._id);
                        setNewStatus(order.delivery);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Create Order Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Device Name"
            fullWidth
            required
            value={newOrder.deviceName}
            onChange={(e) =>
              setNewOrder({ ...newOrder, deviceName: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Platform</InputLabel>
            <Select
              value={newOrder.platform}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  platform: e.target.value as string,
                })
              }
            >
              {PLATFORM.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Oder ID"
            fullWidth
            required
            value={newOrder.orderId}
            onChange={(e) =>
              setNewOrder({ ...newOrder, orderId: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Card Name</InputLabel>
            <Select
              value={newOrder.card}
              onChange={(e) =>
                setNewOrder({
                  ...newOrder,
                  card: e.target.value as string,
                })
              }
            >
              {CARDS.map((card) => (
                <MenuItem key={card} value={card}>
                  {card}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            required
            value={newOrder.quantity}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                quantity: parseInt(e.target.value) || 0,
              })
            }
          />
          <TextField
            margin="dense"
            label="Pincode"
            fullWidth
            required
            value={newOrder.pincode}
            onChange={(e) =>
              setNewOrder({ ...newOrder, pincode: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Amount Paid"
            type="number"
            fullWidth
            required
            value={newOrder.amountPaid}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                amountPaid: parseInt(e.target.value) || 0,
              })
            }
          />
          <TextField
            margin="dense"
            label="Profit"
            type="number"
            fullWidth
            required
            value={newOrder.profit}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                profit: parseInt(e.target.value) || 0,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOrder}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(
                  e.target.value as "Pending" | "Shipped" | "Delivered"
                )
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Order;
