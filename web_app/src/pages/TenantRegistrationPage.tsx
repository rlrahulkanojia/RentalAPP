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
import { registerAsTenant, TenantCreate } from '../store/slices/tenantSlice';

const identificationTypes = [
  'Passport',
  'Driver License',
  'National ID',
  'Social Security Number',
  'Other',
];

const TenantRegistrationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isLoading, error } = useSelector((state: RootState) => state.tenant as any);
  const { user } = useSelector((state: RootState) => state.auth as any);
  
  const [tenant, setTenant] = useState<TenantCreate>({
    dateOfBirth: '',
    occupation: '',
    employer: '',
    annualIncome: undefined,
    identificationType: '',
    identificationNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    references: [],
  });
  
  const [reference, setReference] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!tenant.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!tenant.identificationType) newErrors.identificationType = 'Identification type is required';
    if (!tenant.identificationNumber) newErrors.identificationNumber = 'Identification number is required';
    
    // Validate date of birth format
    if (tenant.dateOfBirth) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(tenant.dateOfBirth)) {
        newErrors.dateOfBirth = 'Date must be in YYYY-MM-DD format';
      } else {
        // Validate age (must be at least 18 years old)
        const today = new Date();
        const birthDate = new Date(tenant.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          newErrors.dateOfBirth = 'You must be at least 18 years old';
        }
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTenant((prev) => ({
      ...prev,
      [name as string]: value,
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
  
  
  const handleAddReference = () => {
    if (reference.trim()) {
      setTenant((prev) => ({
        ...prev,
        references: [...(prev.references || []), reference.trim()],
      }));
      setReference('');
    }
  };
  
  const handleRemoveReference = (index: number) => {
    setTenant((prev) => ({
      ...prev,
      references: prev.references?.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(registerAsTenant(tenant))
        .unwrap()
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Failed to register as tenant:', error);
        });
    }
  };
  
  // Redirect if user is already a tenant
  if (user?.isTenant) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">You are already registered as a tenant</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Register as Tenant
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
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
                label="Date of Birth (YYYY-MM-DD)"
                name="dateOfBirth"
                value={tenant.dateOfBirth || ''}
                onChange={handleTextFieldChange}
                error={!!formErrors.dateOfBirth}
                helperText={formErrors.dateOfBirth}
                placeholder="e.g. 1990-01-31"
                required
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
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
              <FormControl fullWidth required error={!!formErrors.identificationType}>
                <InputLabel>Identification Type</InputLabel>
                <Select
                  name="identificationType"
                  value={tenant.identificationType || ''}
                  onChange={handleSelectChange}
                  label="Identification Type"
                >
                  {identificationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.identificationType && (
                  <Typography variant="caption" color="error">
                    {formErrors.identificationType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identification Number"
                name="identificationNumber"
                value={tenant.identificationNumber || ''}
                onChange={handleTextFieldChange}
                error={!!formErrors.identificationNumber}
                helperText={formErrors.identificationNumber}
                required
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
            
            {/* References */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                References
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Add Reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Name, relationship, contact information"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddReference}
                  disabled={!reference.trim()}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            {tenant.references && tenant.references.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Added References:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tenant.references.map((ref, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{ref}</Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveReference(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
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
                  {isLoading ? 'Registering...' : 'Register as Tenant'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default TenantRegistrationPage;
