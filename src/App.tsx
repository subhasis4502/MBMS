// src/App.tsx
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
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
import { CardProvider } from "./contexts/CardContext";
import HisabsPage from "./pages/Hisabs/Hisabs";
import { HisabProvider } from "./contexts/HisabContext";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is null, preserving the intended destination
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, navigate, location]);

  if (!user) {
    // Return null while the redirection is happening
    return null;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/cards"
        element={
          <ProtectedRoute>
            <CardsPage />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/hisabs"
        element={
          <ProtectedRoute>
            <HisabsPage />
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
          <CardProvider>
            <HisabProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </Router>
              </ThemeProvider>
            </HisabProvider>
          </CardProvider>
        </PaymentProvider>
      </OrderProvider>
    </UserProvider>
  );
};

export default App;
