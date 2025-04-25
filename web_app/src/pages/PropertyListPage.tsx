import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Pagination,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Apartment as ApartmentIcon, Add as AddIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchProperties, PropertyFilter } from '../store/slices/propertySlice';

const propertyTypes = [
  'Apartment',
  'House',
  'Condo',
  'Townhouse',
  'Studio',
  'Duplex',
];

const PropertyListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as any);
  const { properties, isLoading, totalPages, currentPage } = useSelector(
    (state: RootState) => state.property as any
  );
  
  const [filter, setFilter] = useState<PropertyFilter>({
    page: 1,
    limit: 9,
  });
  
  useEffect(() => {
    dispatch(fetchProperties(filter));
  }, [dispatch, filter]);
  
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page on filter change
    }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name as string]: value,
      page: 1, // Reset to first page on filter change
    }));
  };
  
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Properties</Typography>
        {user?.isPropertyOwner && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/properties/create')}
          >
            Add Property
          </Button>
        )}
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Properties
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={filter.city || ''}
              onChange={handleTextFieldChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={filter.state || ''}
              onChange={handleTextFieldChange}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Bedrooms"
              name="minBedrooms"
              type="number"
              value={filter.minBedrooms || ''}
              onChange={handleTextFieldChange}
              variant="outlined"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Rent"
              name="maxRent"
              type="number"
              value={filter.maxRent || ''}
              onChange={handleTextFieldChange}
              variant="outlined"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Property Type</InputLabel>
              <Select
                label="Property Type"
                name="propertyType"
                value={filter.propertyType || ''}
                onChange={handleSelectChange}
              >
                <MenuItem value="">All Types</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {properties.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h6">No properties found</Typography>
              <Typography variant="body1" color="textSecondary">
                Try adjusting your filters or check back later for new listings.
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {properties.map((property: any) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card>
                      <Box
                        sx={{
                          height: 200,
                          backgroundColor: 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <ApartmentIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                        )}
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {property.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address}, {property.city}, {property.state}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {property.bedrooms} bed • {property.bathrooms} bath • {property.propertyType}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          ${property.monthlyRent}/month
                        </Typography>
                        {!property.isAvailable && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            Not Available
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/properties/${property.id}`)}>
                          View Details
                        </Button>
                        {user?.isPropertyOwner && property.ownerId === user.id && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/properties/${property.id}/edit`)}
                          >
                            Edit
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default PropertyListPage;
