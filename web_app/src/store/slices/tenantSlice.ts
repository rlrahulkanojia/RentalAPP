import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '..';

// Types
export interface Tenant {
  id: number;
  dateOfBirth: string;
  occupation?: string;
  employer?: string;
  annualIncome?: number;
  identificationType: string;
  identificationNumber: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  references?: string[];
  userId: number;
}

export interface TenantCreate {
  dateOfBirth: string;
  occupation?: string;
  employer?: string;
  annualIncome?: number;
  identificationType: string;
  identificationNumber: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  references?: string[];
}

export interface TenantUpdate {
  dateOfBirth?: string;
  occupation?: string;
  employer?: string;
  annualIncome?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  references?: string[];
}

interface TenantState {
  tenantProfile: Tenant | null;
  isLoading: boolean;
  error: string | null;
  isRegistered: boolean;
}

// Initial state
const initialState: TenantState = {
  tenantProfile: null,
  isLoading: false,
  error: null,
  isRegistered: false,
};

// Async thunks
export const registerAsTenant = createAsyncThunk(
  'tenant/registerAsTenant',
  async (tenant: TenantCreate, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/tenants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(tenant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to register as tenant');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchTenantProfile = createAsyncThunk(
  'tenant/fetchTenantProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/tenants/me', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // User is not registered as a tenant
        }
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch tenant profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const updateTenantProfile = createAsyncThunk(
  'tenant/updateTenantProfile',
  async (tenant: TenantUpdate, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/tenants/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(tenant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update tenant profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Slice
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearTenantError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register as tenant
    builder.addCase(registerAsTenant.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerAsTenant.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tenantProfile = action.payload;
      state.isRegistered = true;
      toast.success('Successfully registered as a tenant');
    });
    builder.addCase(registerAsTenant.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch tenant profile
    builder.addCase(fetchTenantProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTenantProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tenantProfile = action.payload;
      state.isRegistered = !!action.payload;
    });
    builder.addCase(fetchTenantProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update tenant profile
    builder.addCase(updateTenantProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTenantProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tenantProfile = action.payload;
      toast.success('Tenant profile updated successfully');
    });
    builder.addCase(updateTenantProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearTenantError } = tenantSlice.actions;

export default tenantSlice.reducer;
