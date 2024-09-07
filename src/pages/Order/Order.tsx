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
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useOrderContext } from "../../contexts/OrderContext";
import { useUserContext } from "../../contexts/UserContext";
import { usePaymentContext } from "../../contexts/PaymentContext";
import { CARDS, OrderModel, PLATFORM } from "../../types";

const Order: React.FC = () => {
  const { orders, fetchOrders, addOrder, updateOrderStatus, isLoading, error } =
    useOrderContext();
  const { addPayment } = usePaymentContext();
  const { user } = useUserContext();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    "All" | "Pending" | "Delivered" | "Money Received"
  >("Pending");
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
  const [newOrderId, setNewOrderId] = useState("");
  const [newStatus, setNewStatus] = useState<
    "Pending" | "Delivered" | "Money Received"
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
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, newStatus, newOrderId);
      setOpenUpdateDialog(false);
      setSelectedOrder(null);
      setNewOrderId("");
    }
  };

  const filteredOrders = orders.filter(
    (order: OrderModel) =>
      orderStatusFilter === "All" || order.delivery === orderStatusFilter
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" onClose={() => {}}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenCreateDialog(true)}
        sx={{ mb: 2, mr: 2 }}
      >
        Create Order
      </Button>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Delivery Status Filter</InputLabel>
        <Select
          value={orderStatusFilter}
          label="Filter"
          sx={{ mb: 2 }}
          onChange={(e) =>
            setOrderStatusFilter(
              e.target.value as
                | "All"
                | "Pending"
                | "Delivered"
                | "Money Received"
            )
          }
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Money Received">Money Received</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>Platform</TableCell>
              {user?.isAdmin && <TableCell>Order ID</TableCell>}
              {user?.isAdmin && <TableCell>Card</TableCell>}
              <TableCell>Quantity</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Amount Paid</TableCell>
              {user?.isAdmin && <TableCell>Return Amount</TableCell>}
              {user?.isAdmin && <TableCell>Done By</TableCell>}
              {user?.isAdmin && <TableCell>Order Date</TableCell>}
              {user?.isAdmin && <TableCell>Cashback</TableCell>}
              {user?.isAdmin && <TableCell>Commision</TableCell>}
              <TableCell>Delivery Status</TableCell>
              {user?.isAdmin && <TableCell>Delivery Date</TableCell>}
              {user?.isAdmin && <TableCell>Total Profit</TableCell>}
              {user?.isAdmin && <TableCell>Profit Transferred</TableCell>}
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
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.deviceName}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  {user?.isAdmin && <TableCell>{order.orderId}</TableCell>}
                  {user?.isAdmin && <TableCell>{order.cardName}</TableCell>}
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.pincode}</TableCell>
                  <TableCell>{order.amountPaid}</TableCell>
                  {user?.isAdmin && <TableCell>{order.returnAmount}</TableCell>}
                  {user?.isAdmin && <TableCell>{order.doneByUser}</TableCell>}
                  {user?.isAdmin && (
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                  )}
                  {user?.isAdmin && <TableCell>{order.cashBack}</TableCell>}
                  {user?.isAdmin && <TableCell>{order.commission}</TableCell>}
                  <TableCell>{order.delivery}</TableCell>
                  {user?.isAdmin && (
                    <TableCell>
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  )}
                  {user?.isAdmin && <TableCell>{order.profit}</TableCell>}
                  {user?.isAdmin && (
                    <TableCell>{order.transfer ? "Yes" : "No"}</TableCell>
                  )}
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
          <FormControl fullWidth margin="dense" required>
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
          <FormControl fullWidth margin="dense" required>
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
                quantity: parseInt(e.target.value),
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
                amountPaid: parseInt(e.target.value),
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
                  e.target.value as "Pending" | "Delivered" | "Money Received"
                )
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Money Received">Money Received</MenuItem>
            </Select>
          </FormControl>
          {newStatus === "Pending" && (
            <TextField
              margin="dense"
              label="Oder ID"
              fullWidth
              required
              value={newOrderId}
              onChange={(e) => setNewOrderId(e.target.value)}
            />
          )}
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
