import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { createContract, RentalContractCreate } from '../store/slices/contractSlice';
import { fetchMyProperties } from '../store/slices/propertySlice';

const ContractCreatePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state: RootState) => state.auth as any);
  const { isLoading, error } = useSelector((state: RootState) => state.contract as any);
  const { myProperties } = useSelector((state: RootState) => state.property as any);
  
  // Get propertyId from location state if available
  const initialPropertyId = location.state?.propertyId;
  
  const [contract, setContract] = useState<RentalContractCreate>({
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    securityDeposit: 0,
    paymentDueDay: 1,
    contractTerms: '',
    propertyId: initialPropertyId || 0,
    tenantId: 0,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (user?.isPropertyOwner) {
      dispatch(fetchMyProperties());
    } else {
      navigate('/dashboard');
    }
  }, [dispatch, navigate, user]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!contract.startDate) newErrors.startDate = 'Start date is required';
    if (!contract.endDate) newErrors.endDate = 'End date is required';
    if (contract.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent must be greater than 0';
    if (contract.securityDeposit < 0) newErrors.securityDeposit = 'Security deposit cannot be negative';
    if (contract.paymentDueDay < 1 || contract.paymentDueDay > 31) newErrors.paymentDueDay = 'Payment due day must be between 1 and 31';
    if (contract.propertyId <= 0) newErrors.propertyId = 'Property is required';
    if (contract.tenantId <= 0) newErrors.tenantId = 'Tenant is required';
    
    // Validate that end date is after start date
    if (contract.startDate && contract.endDate) {
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      if (start >= end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContract((prev) => ({
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
  
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setContract((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (formErrors[name as string]) {
      setFormErrors((prev) => ({
        ...prev,
        [name as string]: '',
      }));
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    
    setContract((prev) => ({
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
    
    if (validateForm()) {
      dispatch(createContract(contract))
        .unwrap()
        .then((createdContract) => {
          navigate(`/contracts/${createdContract.id}`);
        })
        .catch((error) => {
          console.error('Failed to create contract:', error);
        });
    }
  };
  
  // Filter properties to only show available ones
  const availableProperties = myProperties.filter((property: any) => property.isAvailable);
  
  // For demo purposes, we'll use a dummy list of tenants
  const dummyTenants = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
  ];
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Rental Contract
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Property and Tenant Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Property and Tenant
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.propertyId} required>
                <InputLabel>Property</InputLabel>
                <Select
                  name="propertyId"
                  value={contract.propertyId || ''}
                  onChange={handleSelectChange}
                  label="Property"
                >
                  <MenuItem value={0}>Select a property</MenuItem>
                  {availableProperties.map((property: any) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.title} - {property.address}, {property.city}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.propertyId && (
                  <Typography variant="caption" color="error">
                    {formErrors.propertyId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.tenantId} required>
                <InputLabel>Tenant</InputLabel>
                <Select
                  name="tenantId"
                  value={contract.tenantId || ''}
                  onChange={handleSelectChange}
                  label="Tenant"
                >
                  <MenuItem value={0}>Select a tenant</MenuItem>
                  {dummyTenants.map((tenant) => (
                    <MenuItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.tenantId && (
                  <Typography variant="caption" color="error">
                    {formErrors.tenantId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            {/* Contract Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contract Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date (YYYY-MM-DD)"
                name="startDate"
                value={contract.startDate}
                onChange={handleTextFieldChange}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate}
                placeholder="e.g. 2023-01-01"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date (YYYY-MM-DD)"
                name="endDate"
                value={contract.endDate}
                onChange={handleTextFieldChange}
                error={!!formErrors.endDate}
                helperText={formErrors.endDate}
                placeholder="e.g. 2024-01-01"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Rent"
                name="monthlyRent"
                type="number"
                value={contract.monthlyRent}
                onChange={handleNumberChange}
                error={!!formErrors.monthlyRent}
                helperText={formErrors.monthlyRent}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Security Deposit"
                name="securityDeposit"
                type="number"
                value={contract.securityDeposit}
                onChange={handleNumberChange}
                error={!!formErrors.securityDeposit}
                helperText={formErrors.securityDeposit}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Due Day"
                name="paymentDueDay"
                type="number"
                value={contract.paymentDueDay}
                onChange={handleNumberChange}
                error={!!formErrors.paymentDueDay}
                helperText={formErrors.paymentDueDay || 'Day of the month when rent is due'}
                InputProps={{
                  inputProps: { min: 1, max: 31 },
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contract Terms"
                name="contractTerms"
                value={contract.contractTerms || ''}
                onChange={handleTextFieldChange}
                multiline
                rows={6}
                placeholder="Enter any additional terms or conditions for the rental contract..."
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/contracts')}
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
                  {isLoading ? 'Creating...' : 'Create Contract'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ContractCreatePage;
