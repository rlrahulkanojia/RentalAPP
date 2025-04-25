import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/slices/authSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth as any);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, we would dispatch an action to update the user profile
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  if (!user) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">You are not logged in</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Profile</Typography>
        {!isEditing && (
          <Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ mr: 2 }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleTextFieldChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextFieldChange}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Full Name"
                    secondary={user.fullName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Phone Number"
                    secondary={user.phoneNumber || 'Not provided'}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Account Type
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {user.isPropertyOwner && (
                  <Chip
                    label="Property Owner"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {user.isTenant && (
                  <Chip
                    label="Tenant"
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {!user.isPropertyOwner && !user.isTenant && (
                  <Typography variant="body1" color="text.secondary">
                    No special roles assigned
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {user.isTenant && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/tenant/profile')}
                  >
                    View Tenant Profile
                  </Button>
                )}
                {!user.isTenant && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/tenant/register')}
                  >
                    Register as Tenant
                  </Button>
                )}
                {user.isPropertyOwner && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/properties')}
                  >
                    Manage Properties
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
