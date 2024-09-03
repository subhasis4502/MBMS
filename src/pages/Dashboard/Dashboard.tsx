// src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useUserContext } from '../../contexts/UserContext';

const Dashboard: React.FC = () => {
  const { user } = useUserContext();

  if (!user) {
    return <Typography>Please log in to view the dashboard.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to your Dashboard, {user.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Typography>Name: {user.name}</Typography>
            <Typography>Email: {user.email}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity Summary
            </Typography>
            <Typography>Last login: {new Date().toLocaleString()}</Typography>
            <Typography>Account status: Active</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;