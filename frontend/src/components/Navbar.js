import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tamil School App
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/progress">
            Progress
          </Button>
          <Button color="inherit" component={Link} to="/assignments">
            Assignments
          </Button>
          <Button color="inherit" component={Link} to="/attendance">
            Attendance
          </Button>
          <Button color="inherit" component={Link} to="/skills">
            Skills
          </Button>
          {currentUser && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;



