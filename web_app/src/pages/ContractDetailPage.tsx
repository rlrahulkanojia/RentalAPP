import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchContractById, updateContract } from '../store/slices/contractSlice';

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

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth as any);
  const { currentContract, isLoading } = useSelector((state: RootState) => state.contract as any);
  
  const [tabValue, setTabValue] = useState(0);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchContractById(parseInt(id)));
    }
  }, [dispatch, id]);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSignContract = () => {
    setSignDialogOpen(false);
    
    if (!id || !currentContract) return;
    
    const updateData = user?.isPropertyOwner
      ? { signedByOwner: true }
      : { signedByTenant: true };
    
    dispatch(updateContract({ id: parseInt(id), contract: updateData }));
  };
  
  const handleTerminateContract = () => {
    setTerminateDialogOpen(false);
    
    if (!id || !currentContract) return;
    
    dispatch(updateContract({ id: parseInt(id), contract: { isActive: false } }));
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!currentContract) {
    return (
      <Paper sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h6">Contract not found</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/contracts')}
        >
          Back to Contracts
        </Button>
      </Paper>
    );
  }
  
  const isOwner = user?.isPropertyOwner && currentContract.ownerId === user.id;
  const isTenant = user?.isTenant && currentContract.tenantId === user.tenantProfile?.id;
  
  const canSignAsOwner = isOwner && !currentContract.signedByOwner;
  const canSignAsTenant = isTenant && !currentContract.signedByTenant;
  const canTerminate = (isOwner || isTenant) && currentContract.isActive;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Contract #{currentContract.id}</Typography>
        <Box>
          {canSignAsOwner && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => setSignDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Sign as Owner
            </Button>
          )}
          
          {canSignAsTenant && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={() => setSignDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Sign as Tenant
            </Button>
          )}
          
          {canTerminate && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setTerminateDialogOpen(true)}
            >
              Terminate Contract
            </Button>
          )}
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label={currentContract.isActive ? 'Active' : 'Inactive'}
                color={currentContract.isActive ? 'success' : 'default'}
                sx={{ mr: 1 }}
              />
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Chip
                icon={currentContract.signedByOwner ? <CheckCircleIcon /> : <CancelIcon />}
                label="Owner Signature"
                color={currentContract.signedByOwner ? 'primary' : 'default'}
                variant="outlined"
                sx={{ mr: 1 }}
              />
              
              <Chip
                icon={currentContract.signedByTenant ? <CheckCircleIcon /> : <CancelIcon />}
                label="Tenant Signature"
                color={currentContract.signedByTenant ? 'secondary' : 'default'}
                variant="outlined"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contract Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Start Date"
                  secondary={new Date(currentContract.startDate).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="End Date"
                  secondary={new Date(currentContract.endDate).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Monthly Rent"
                  secondary={`$${currentContract.monthlyRent}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Security Deposit"
                  secondary={`$${currentContract.securityDeposit}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment Due Day"
                  secondary={`${currentContract.paymentDueDay}${getDaySuffix(currentContract.paymentDueDay)} of each month`}
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Property & Tenant
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Property ID"
                  secondary={currentContract.propertyId}
                />
              </ListItem>
              <ListItem button onClick={() => navigate(`/properties/${currentContract.propertyId}`)}>
                <ListItemText
                  primary="View Property Details"
                  secondary="Click to view the property details"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tenant ID"
                  secondary={currentContract.tenantId}
                />
              </ListItem>
            </List>
          </Grid>
          
          {currentContract.contractTerms && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contract Terms
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                {currentContract.contractTerms}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Rent Payments" />
          <Tab label="Maintenance Requests" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" color="text.secondary" align="center">
            No payment records available.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" color="text.secondary" align="center">
            No maintenance requests available.
          </Typography>
        </TabPanel>
      </Paper>
      
      {/* Sign Contract Dialog */}
      <Dialog
        open={signDialogOpen}
        onClose={() => setSignDialogOpen(false)}
      >
        <DialogTitle>Sign Contract</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By signing this contract, you agree to all the terms and conditions specified in the contract. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSignContract} color="primary">
            Sign Contract
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Terminate Contract Dialog */}
      <Dialog
        open={terminateDialogOpen}
        onClose={() => setTerminateDialogOpen(false)}
      >
        <DialogTitle>Terminate Contract</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to terminate this contract? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTerminateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTerminateContract} color="error">
            Terminate Contract
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to get day suffix (1st, 2nd, 3rd, etc.)
const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export default ContractDetailPage;
