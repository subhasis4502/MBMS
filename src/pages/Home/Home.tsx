// src/pages/Home/Home.tsx
import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useUserContext } from '../../contexts/UserContext';

const Home: React.FC = () => {
  const { user, login } = useUserContext();

  const handleLogin = () => {
    // Simulating a login action
    // login({ name: 'John Doe', email: 'john@example.com', username:'johnTest', token: '', isAdmin: true });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to My MUI React App
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