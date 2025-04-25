import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchProperties } from '../store/slices/propertySlice';
import { fetchContracts } from '../store/slices/contractSlice';
import { fetchTenantProfile } from '../store/slices/tenantSlice';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { properties, myProperties, isLoading: propertiesLoading } = useSelector((state: RootState) => state.property);
  const { contracts, isLoading: contractsLoading } = useSelector((state: RootState) => state.contract);
  const { tenantProfile, isRegistered, isLoading: tenantLoading } = useSelector((state: RootState) => state.tenant);
  
  const isLoading = propertiesLoading || contractsLoading || tenantLoading;
  
  useEffect(() => {
    if (user) {
      if (user.isPropertyOwner) {
        dispatch(fetchProperties());
      }
      
      if (user.isTenant || user.isPropertyOwner) {
        dispatch(fetchContracts());
      }
      
      if (user.isTenant) {
        dispatch(fetchTenantProfile());
      }
    }
  }, [dispatch, user]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {user?.fullName}!
            </Typography>
            <Typography variant="body1">
              {user?.isPropertyOwner && 'You are registered as a property owner.'}
              {user?.isTenant && ' You are registered as a tenant.'}
              {!user?.isPropertyOwner && !user?.isTenant && 'You are not registered as a property owner or tenant yet.'}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {user?.isPropertyOwner && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={() => navigate('/properties/create')}
                  >
                    Add New Property
                  </Button>
                </Grid>
              )}
              
              {user?.isPropertyOwner && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<ApartmentIcon />}
                    fullWidth
                    onClick={() => navigate('/properties')}
                  >
                    View My Properties
                  </Button>
                </Grid>
              )}
              
              {(user?.isPropertyOwner || user?.isTenant) && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    fullWidth
                    onClick={() => navigate('/contracts')}
                  >
                    View Contracts
                  </Button>
                </Grid>
              )}
              
              {!user?.isTenant && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    fullWidth
                    onClick={() => navigate('/tenant/register')}
                  >
                    Register as Tenant
                  </Button>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  fullWidth
                  onClick={() => navigate('/properties')}
                >
                  Search Properties
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Property Summary */}
        {user?.isPropertyOwner && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                My Properties
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {myProperties.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  You haven't added any properties yet.
                </Typography>
              ) : (
                <List dense>
                  {myProperties.slice(0, 5).map((property) => (
                    <ListItem
                      key={property.id}
                      button
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      <ListItemText
                        primary={property.title}
                        secondary={`${property.city}, ${property.state}`}
                      />
                    </ListItem>
                  ))}
                  {myProperties.length > 5 && (
                    <ListItem button onClick={() => navigate('/properties')}>
                      <ListItemText
                        primary={`View all ${myProperties.length} properties`}
                        primaryTypographyProps={{ color: 'primary' }}
                      />
                    </ListItem>
                  )}
                </List>
              )}
            </Paper>
          </Grid>
        )}
        
        {/* Contract Summary */}
        {(user?.isPropertyOwner || user?.isTenant) && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Contracts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {contracts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  You don't have any contracts yet.
                </Typography>
              ) : (
                <List dense>
                  {contracts.slice(0, 5).map((contract) => (
                    <ListItem
                      key={contract.id}
                      button
                      onClick={() => navigate(`/contracts/${contract.id}`)}
                    >
                      <ListItemText
                        primary={`Contract #${contract.id}`}
                        secondary={`${new Date(contract.startDate).toLocaleDateString()} - ${new Date(contract.endDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                  {contracts.length > 5 && (
                    <ListItem button onClick={() => navigate('/contracts')}>
                      <ListItemText
                        primary={`View all ${contracts.length} contracts`}
                        primaryTypographyProps={{ color: 'primary' }}
                      />
                    </ListItem>
                  )}
                </List>
              )}
            </Paper>
          </Grid>
        )}
        
        {/* Featured Properties */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Featured Properties
          </Typography>
          <Grid container spacing={3}>
            {properties.slice(0, 3).map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <Card>
                  <Box
                    sx={{
                      height: 140,
                      backgroundColor: 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ApartmentIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {property.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.address}, {property.city}, {property.state}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ${property.monthlyRent}/month
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/properties/${property.id}`)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            
            {properties.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">
                    No properties available at the moment.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
