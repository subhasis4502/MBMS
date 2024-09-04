// src/pages/Home/Home.tsx
import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useUserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login")
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to My MUI Mobile Booking App
      </Typography>
      {user ? (
        <Typography variant="body1">You are logged in as {user.name}</Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Log in
        </Button>
      )}
    </Box>
  );
};

export default Home;