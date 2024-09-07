// src/components/Navbar/Navbar.tsx
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  CreditCard,
  Dashboard,
  Home,
  Login,
  Logout,
  Payments,
  ShoppingCart,
} from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";

const Navbar: React.FC = () => {
  const { user, logout } = useUserContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {user && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/dashboard">
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/orders">
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/payments">
                <ListItemIcon>
                  <Payments />
                </ListItemIcon>
                <ListItemText primary="Payments" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/cards">
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText primary="Cards" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Mobile Bookings
          </RouterLink>
        </Typography>
        {!isMobile && (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            {user && (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/orders">
                  Orders
                </Button>
                <Button color="inherit" component={RouterLink} to="/payments">
                  Payments
                </Button>
                <Button color="inherit" component={RouterLink} to="/cards">
                  Cards
                </Button>
              </>
            )}
          </>
        )}
        {user ? (
          <Button color="inherit" onClick={logout}>
            <Logout />
          </Button>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            <Login />
          </Button>
        )}
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
