// src/components/Layout/Layout.tsx
import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
        {children}
      </Container>
      {/* You can add a footer here if needed */}
    </Box>
  );
};

export default Layout;