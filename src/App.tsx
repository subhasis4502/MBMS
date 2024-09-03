// src/App.tsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUserContext } from "./contexts/UserContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import theme from "./styles/theme";
import Register from "./pages/Register/Register";
import Order from "./pages/Order/Order";
import { OrderProvider } from "./contexts/OrderContext";
import CardsPage from "./pages/Cards/Cards";
import { PaymentProvider } from "./contexts/PaymentContext";
import Payment from "./pages/Payments/Payment";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useUserContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cards" element={<CardsPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <OrderProvider>
        <PaymentProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Layout>
                <AppRoutes />
              </Layout>
            </Router>
          </ThemeProvider>
        </PaymentProvider>
      </OrderProvider>
    </UserProvider>
  );
};

export default App;
