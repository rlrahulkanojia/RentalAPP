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
  Chip,
  CircularProgress,
  FormHelperText,
  Divider,
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { createProperty, PropertyCreate } from '../store/slices/propertySlice';

const propertyTypes = [
  'Apartment',
  'House',
  'Condo',
  'Townhouse',
  'Studio',
  'Duplex',
];

const amenities = [
  'Air Conditioning',
  'Heating',
  'Washer/Dryer',
  'Dishwasher',
  'Parking',
  'Gym',
  'Pool',
  'Elevator',
  'Balcony',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Accessible',
  'Security System',
  'Storage',
  'Fireplace',
];

const PropertyCreatePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isLoading } = useSelector((state: RootState) => state.property as any);
  
  const [property, setProperty] = useState<PropertyCreate>({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: undefined,
    monthlyRent: 0,
    securityDeposit: 0,
    amenities: [],
    images: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!property.title) newErrors.title = 'Title is required';
    if (!property.propertyType) newErrors.propertyType = 'Property type is required';
    if (!property.address) newErrors.address = 'Address is required';
    if (!property.city) newErrors.city = 'City is required';
    if (!property.state) newErrors.state = 'State is required';
    if (!property.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!property.country) newErrors.country = 'Country is required';
    if (property.bedrooms < 1) newErrors.bedrooms = 'Must have at least 1 bedroom';
    if (property.bathrooms < 1) newErrors.bathrooms = 'Must have at least 1 bathroom';
    if (property.monthlyRent <= 0) newErrors.monthlyRent = 'Monthly rent must be greater than 0';
    if (property.securityDeposit < 0) newErrors.securityDeposit = 'Security deposit cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as string]) {
      setErrors((prev) => ({
        ...prev,
        [name as string]: '',
      }));
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? undefined : Number(value);
    
    setProperty((prev) => ({
      ...prev,
      [name]: numValue,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update property with selected amenities
    const updatedProperty = {
      ...property,
      amenities: selectedAmenities,
    };
    
    if (validateForm()) {
      dispatch(createProperty(updatedProperty))
        .unwrap()
        .then((createdProperty) => {
          navigate(`/properties/${createdProperty.id}`);
        })
        .catch((error) => {
          console.error('Failed to create property:', error);
        });
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Property
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={property.title}
                onChange={handleTextFieldChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={property.description || ''}
                onChange={handleTextFieldChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.propertyType} required>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleSelectChange}
                  label="Property Type"
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.propertyType && <FormHelperText>{errors.propertyType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={property.bedrooms}
                onChange={handleNumberChange}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={property.bathrooms}
                onChange={handleNumberChange}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms}
                InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area (sq ft)"
                name="areaSqft"
                type="number"
                value={property.areaSqft || ''}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={property.address}
                onChange={handleTextFieldChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={property.city}
                onChange={handleTextFieldChange}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={property.state}
                onChange={handleTextFieldChange}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                name="zipCode"
                value={property.zipCode}
                onChange={handleTextFieldChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={property.country}
                onChange={handleTextFieldChange}
                error={!!errors.country}
                helperText={errors.country}
                required
              />
            </Grid>
            
            {/* Financial Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Financial Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Rent"
                name="monthlyRent"
                type="number"
                value={property.monthlyRent}
                onChange={handleNumberChange}
                error={!!errors.monthlyRent}
                helperText={errors.monthlyRent}
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
                value={property.securityDeposit}
                onChange={handleNumberChange}
                error={!!errors.securityDeposit}
                helperText={errors.securityDeposit}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 },
                }}
                required
              />
            </Grid>
            
            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Amenities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    color={selectedAmenities.includes(amenity) ? 'primary' : 'default'}
                    variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/properties')}
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
                  {isLoading ? 'Creating...' : 'Create Property'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PropertyCreatePage;
