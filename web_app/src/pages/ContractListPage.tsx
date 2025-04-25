import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchContracts } from '../store/slices/contractSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contract-tabpanel-${index}`}
      aria-labelledby={`contract-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ContractListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as any);
  const { contracts, isLoading } = useSelector((state: RootState) => state.contract as any);
  
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const activeContracts = contracts.filter((contract: any) => contract.isActive);
  const inactiveContracts = contracts.filter((contract: any) => !contract.isActive);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Rental Contracts</Typography>
        {user?.isPropertyOwner && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/contracts/create')}
          >
            Create Contract
          </Button>
        )}
      </Box>
      
      {contracts.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Contracts Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {user?.isPropertyOwner
              ? "You haven't created any rental contracts yet."
              : "You don't have any rental contracts yet."}
          </Typography>
          {user?.isPropertyOwner && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/contracts/create')}
            >
              Create Contract
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label={`Active Contracts (${activeContracts.length})`} />
            <Tab label={`Inactive Contracts (${inactiveContracts.length})`} />
            <Tab label={`All Contracts (${contracts.length})`} />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {activeContracts.length === 0 ? (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No active contracts found.
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                activeContracts.map((contract: any) => (
                  <Grid item xs={12} md={6} lg={4} key={contract.id}>
                    <ContractCard contract={contract} navigate={navigate} />
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {inactiveContracts.length === 0 ? (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No inactive contracts found.
                    </Typography>
                  </Paper>
                </Grid>
              ) : (
                inactiveContracts.map((contract: any) => (
                  <Grid item xs={12} md={6} lg={4} key={contract.id}>
                    <ContractCard contract={contract} navigate={navigate} />
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {contracts.map((contract: any) => (
                <Grid item xs={12} md={6} lg={4} key={contract.id}>
                  <ContractCard contract={contract} navigate={navigate} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

interface ContractCardProps {
  contract: any;
  navigate: (path: string) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, navigate }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Contract #{contract.id}
          </Typography>
          <Chip
            label={contract.isActive ? 'Active' : 'Inactive'}
            color={contract.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List dense>
          <ListItem>
            <ListItemText
              primary="Property"
              secondary={`ID: ${contract.propertyId}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Tenant"
              secondary={`ID: ${contract.tenantId}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Period"
              secondary={`${new Date(contract.startDate).toLocaleDateString()} - ${new Date(contract.endDate).toLocaleDateString()}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Monthly Rent"
              secondary={`$${contract.monthlyRent}`}
            />
          </ListItem>
        </List>
        
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Chip
            label={contract.signedByOwner ? 'Signed by Owner' : 'Not Signed by Owner'}
            color={contract.signedByOwner ? 'primary' : 'default'}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={contract.signedByTenant ? 'Signed by Tenant' : 'Not Signed by Tenant'}
            color={contract.signedByTenant ? 'secondary' : 'default'}
            variant="outlined"
            size="small"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/contracts/${contract.id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ContractListPage;
