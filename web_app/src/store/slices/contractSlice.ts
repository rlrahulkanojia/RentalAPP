import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '..';

// Types
export interface RentalContract {
  id: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  isActive: boolean;
  paymentDueDay: number;
  contractTerms?: string;
  signedByOwner: boolean;
  signedByTenant: boolean;
  contractFileUrl?: string;
  propertyId: number;
  tenantId: number;
}

export interface RentalContractCreate {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentDueDay: number;
  contractTerms?: string;
  propertyId: number;
  tenantId: number;
}

export interface RentalContractUpdate {
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  isActive?: boolean;
  paymentDueDay?: number;
  contractTerms?: string;
  signedByOwner?: boolean;
  signedByTenant?: boolean;
  contractFileUrl?: string;
}

export interface RentPayment {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  transactionId?: string;
  isLate: boolean;
  lateFee: number;
  notes?: string;
  contractId: number;
}

export interface RentPaymentCreate {
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  requestDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  completionDate?: string;
  cost?: number;
  notes?: string;
  contractId: number;
}

export interface MaintenanceRequestCreate {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

export interface MaintenanceRequestUpdate {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  completionDate?: string;
  cost?: number;
  notes?: string;
}

interface ContractState {
  contracts: RentalContract[];
  currentContract: RentalContract | null;
  payments: RentPayment[];
  maintenanceRequests: MaintenanceRequest[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ContractState = {
  contracts: [],
  currentContract: null,
  payments: [],
  maintenanceRequests: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contract/fetchContracts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/contracts', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch contracts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contract/fetchContractById',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch contract');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const createContract = createAsyncThunk(
  'contract/createContract',
  async (contract: RentalContractCreate, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(contract),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create contract');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const updateContract = createAsyncThunk(
  'contract/updateContract',
  async ({ id, contract }: { id: number; contract: RentalContractUpdate }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(contract),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update contract');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchPayments = createAsyncThunk(
  'contract/fetchPayments',
  async (contractId: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${contractId}/payments`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch payments');
      }

      const data = await response.json();
      return { payments: data, contractId };
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const createPayment = createAsyncThunk(
  'contract/createPayment',
  async ({ contractId, payment }: { contractId: number; payment: RentPaymentCreate }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${contractId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchMaintenanceRequests = createAsyncThunk(
  'contract/fetchMaintenanceRequests',
  async (contractId: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${contractId}/maintenance`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch maintenance requests');
      }

      const data = await response.json();
      return { requests: data, contractId };
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const createMaintenanceRequest = createAsyncThunk(
  'contract/createMaintenanceRequest',
  async (
    { contractId, request }: { contractId: number; request: MaintenanceRequestCreate },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/${contractId}/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create maintenance request');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const updateMaintenanceRequest = createAsyncThunk(
  'contract/updateMaintenanceRequest',
  async (
    { requestId, request }: { requestId: number; request: MaintenanceRequestUpdate },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/contracts/maintenance/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update maintenance request');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Slice
const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    clearContractError: (state) => {
      state.error = null;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch contracts
    builder.addCase(fetchContracts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchContracts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.contracts = action.payload;
    });
    builder.addCase(fetchContracts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch contract by ID
    builder.addCase(fetchContractById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchContractById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentContract = action.payload;
    });
    builder.addCase(fetchContractById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Create contract
    builder.addCase(createContract.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createContract.fulfilled, (state, action) => {
      state.isLoading = false;
      state.contracts.push(action.payload);
      toast.success('Contract created successfully');
    });
    builder.addCase(createContract.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update contract
    builder.addCase(updateContract.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateContract.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in contracts
      const index = state.contracts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contracts[index] = action.payload;
      }
      
      // Update currentContract if it's the same
      if (state.currentContract && state.currentContract.id === action.payload.id) {
        state.currentContract = action.payload;
      }
      
      toast.success('Contract updated successfully');
    });
    builder.addCase(updateContract.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch payments
    builder.addCase(fetchPayments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.payments = action.payload.payments;
    });
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Create payment
    builder.addCase(createPayment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.payments.push(action.payload);
      toast.success('Payment recorded successfully');
    });
    builder.addCase(createPayment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch maintenance requests
    builder.addCase(fetchMaintenanceRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMaintenanceRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.maintenanceRequests = action.payload.requests;
    });
    builder.addCase(fetchMaintenanceRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Create maintenance request
    builder.addCase(createMaintenanceRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMaintenanceRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.maintenanceRequests.push(action.payload);
      toast.success('Maintenance request submitted successfully');
    });
    builder.addCase(createMaintenanceRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update maintenance request
    builder.addCase(updateMaintenanceRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateMaintenanceRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in maintenanceRequests
      const index = state.maintenanceRequests.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.maintenanceRequests[index] = action.payload;
      }
      
      toast.success('Maintenance request updated successfully');
    });
    builder.addCase(updateMaintenanceRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearContractError, clearCurrentContract } = contractSlice.actions;

export default contractSlice.reducer;
