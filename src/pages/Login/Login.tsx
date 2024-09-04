// src/pages/Login/Login.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link, CircularProgress } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { UserModel } from "../../types";

const Login: React.FC = () => {
  const { login, isLoading, error } = useUserContext();
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState<Omit<UserModel, "_id" | "token" | "username" | "name">>({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(newUser);

    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20}/> : "Sign In"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
