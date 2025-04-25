import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Apartment as ApartmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BedOutlined as BedIcon,
  BathtubOutlined as BathIcon,
  SquareFootOutlined as AreaIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchPropertyById, deleteProperty } from '../store/slices/propertySlice';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as any);
  const { currentProperty, isLoading } = useSelector((state: RootState) => state.property as any);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(parseInt(id)));
    }
  }, [dispatch, id]);
  
  const handleEdit = () => {
    navigate(`/properties/${id}/edit`);
  };
  
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (id) {
      dispatch(deleteProperty(parseInt(id)))
        .unwrap()
        .then(() => {
          navigate('/properties');
        });
    }
    setDeleteDialogOpen(false);
  };
  
  const handleCreateContract = () => {
    navigate('/contracts/create', { state: { propertyId: currentProperty?.id } });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!currentProperty) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">Property not found</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </Paper>
    );
  }
  
  const isOwner = user?.isPropertyOwner && currentProperty.ownerId === user.id;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{currentProperty.title}</Typography>
        {isOwner && (
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                height: 400,
                backgroundColor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentProperty.images && currentProperty.images.length > 0 ? (
                <img
                  src={currentProperty.images[0]}
                  alt={currentProperty.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <ApartmentIcon sx={{ fontSize: 120, color: 'grey.500' }} />
              )}
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                ${currentProperty.monthlyRent}/month
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Chip
                  icon={<BedIcon />}
                  label={`${currentProperty.bedrooms} Bedrooms`}
                  variant="outlined"
                />
                <Chip
                  icon={<BathIcon />}
                  label={`${currentProperty.bathrooms} Bathrooms`}
                  variant="outlined"
                />
                {currentProperty.areaSqft && (
                  <Chip
                    icon={<AreaIcon />}
                    label={`${currentProperty.areaSqft} sq ft`}
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={<HomeIcon />}
                  label={currentProperty.propertyType}
                  variant="outlined"
                />
                <Chip
                  icon={<MoneyIcon />}
                  label={`$${currentProperty.securityDeposit} deposit`}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                {currentProperty.address}, {currentProperty.city}, {currentProperty.state} {currentProperty.zipCode}, {currentProperty.country}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {currentProperty.description || 'No description provided.'}
              </Typography>
              
              {currentProperty.amenities && currentProperty.amenities.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {currentProperty.amenities.map((amenity: string) => (
                      <Chip key={amenity} label={amenity} size="small" />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            <Chip
              label={currentProperty.isAvailable ? 'Available' : 'Not Available'}
              color={currentProperty.isAvailable ? 'success' : 'error'}
              sx={{ mb: 2 }}
            />
            
            {currentProperty.isAvailable && user?.isTenant && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateContract}
                sx={{ mt: 2 }}
              >
                Apply to Rent
              </Button>
            )}
            
            {isOwner && currentProperty.isAvailable && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateContract}
                sx={{ mt: 2 }}
              >
                Create Rental Contract
              </Button>
            )}
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1">
              For inquiries about this property, please contact the property owner through the platform.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/properties')}
            >
              Back to Properties
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this property? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetailPage;
