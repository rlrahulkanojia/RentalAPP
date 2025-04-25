import React, { useEffect, useState } from 'react';
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
import { fetchTenantProfile, updateTenantProfile, TenantUpdate } from '../store/slices/tenantSlice';

const TenantProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { tenantProfile, isLoading, error } = useSelector((state: RootState) => state.tenant as any);
  const { user } = useSelector((state: RootState) => state.auth as any);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tenant, setTenant] = useState<TenantUpdate>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    dispatch(fetchTenantProfile());
  }, [dispatch]);
  
  useEffect(() => {
    if (tenantProfile) {
      setTenant({
        occupation: tenantProfile.occupation || '',
        employer: tenantProfile.employer || '',
        annualIncome: tenantProfile.annualIncome,
        emergencyContactName: tenantProfile.emergencyContactName || '',
        emergencyContactPhone: tenantProfile.emergencyContactPhone || '',
      });
    }
  }, [tenantProfile]);
  
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? undefined : Number(value);
    
    setTenant((prev) => ({
      ...prev,
      [name]: numValue,
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(updateTenantProfile(tenant))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Failed to update tenant profile:', error);
      });
  };
  
  if (!user?.isTenant) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">You are not registered as a tenant</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/tenant/register')}
        >
          Register as Tenant
        </Button>
      </Paper>
    );
  }
  
  if (isLoading && !tenantProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!tenantProfile) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">Tenant profile not found</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tenant Profile</Typography>
        {!isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
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
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  value={new Date(tenantProfile.dateOfBirth).toLocaleDateString()}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={tenant.occupation || ''}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employer"
                  name="employer"
                  value={tenant.employer || ''}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Annual Income"
                  name="annualIncome"
                  type="number"
                  value={tenant.annualIncome || ''}
                  onChange={handleNumberChange}
                  InputProps={{
                    startAdornment: <span>$</span>,
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              
              {/* Identification */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Identification
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Identification Type"
                  value={tenantProfile.identificationType}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Identification Number"
                  value={tenantProfile.identificationNumber}
                  disabled
                />
              </Grid>
              
              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Emergency Contact
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  value={tenant.emergencyContactName || ''}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  value={tenant.emergencyContactPhone || ''}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              
              {/* Submit Button */}
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
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={new Date(tenantProfile.dateOfBirth).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Occupation"
                    secondary={tenantProfile.occupation || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Employer"
                    secondary={tenantProfile.employer || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Annual Income"
                    secondary={tenantProfile.annualIncome ? `$${tenantProfile.annualIncome}` : 'Not provided'}
                  />
                </ListItem>
              </List>
            </Grid>
            
            {/* Identification */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Identification
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Identification Type"
                    secondary={tenantProfile.identificationType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Identification Number"
                    secondary={tenantProfile.identificationNumber}
                  />
                </ListItem>
              </List>
            </Grid>
            
            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Emergency Contact Name"
                    secondary={tenantProfile.emergencyContactName || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Emergency Contact Phone"
                    secondary={tenantProfile.emergencyContactPhone || 'Not provided'}
                  />
                </ListItem>
              </List>
            </Grid>
            
            {/* References */}
            {tenantProfile.references && tenantProfile.references.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    References
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tenantProfile.references.map((reference: string, index: number) => (
                      <Chip key={index} label={reference} />
                    ))}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default TenantProfilePage;
