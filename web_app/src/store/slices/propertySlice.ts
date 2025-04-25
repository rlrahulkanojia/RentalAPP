import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '..';

// Types
export interface Property {
  id: number;
  title: string;
  description?: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  monthlyRent: number;
  securityDeposit: number;
  isAvailable: boolean;
  amenities?: string[];
  images?: string[];
  ownerId: number;
}

export interface PropertyCreate {
  title: string;
  description?: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  monthlyRent: number;
  securityDeposit: number;
  amenities?: string[];
  images?: string[];
}

export interface PropertyUpdate {
  title?: string;
  description?: string;
  propertyType?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  isAvailable?: boolean;
  amenities?: string[];
  images?: string[];
}

export interface PropertyFilter {
  city?: string;
  state?: string;
  minBedrooms?: number;
  maxRent?: number;
  propertyType?: string;
  page?: number;
  limit?: number;
}

interface PropertyState {
  properties: Property[];
  myProperties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  myProperties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (filter: PropertyFilter = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      // Build query string from filter
      const queryParams = new URLSearchParams();
      if (filter.city) queryParams.append('city', filter.city);
      if (filter.state) queryParams.append('state', filter.state);
      if (filter.minBedrooms) queryParams.append('min_bedrooms', filter.minBedrooms.toString());
      if (filter.maxRent) queryParams.append('max_rent', filter.maxRent.toString());
      if (filter.propertyType) queryParams.append('property_type', filter.propertyType);
      
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      queryParams.append('skip', ((page - 1) * limit).toString());
      queryParams.append('limit', limit.toString());
      
      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/properties?${queryParams.toString()}`, {
        headers: auth.token ? {
          Authorization: `Bearer ${auth.token}`,
        } : {},
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch properties');
      }

      const data = await response.json();
      return {
        properties: data,
        page,
        limit,
        totalCount: parseInt(response.headers.get('X-Total-Count') || '0'),
      };
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/properties/my-properties', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch your properties');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/properties/${id}`, {
        headers: auth.token ? {
          Authorization: `Bearer ${auth.token}`,
        } : {},
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to fetch property');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (property: PropertyCreate, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch('/api/v1/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to create property');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, property }: { id: number; property: PropertyUpdate }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to update property');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token) {
        return rejectWithValue('No authentication token');
      }

      // This would be replaced with an actual API call
      const response = await fetch(`/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Failed to delete property');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

// Slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearPropertyError: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.isLoading = false;
      state.properties = action.payload.properties;
      state.currentPage = action.payload.page;
      state.totalCount = action.payload.totalCount;
      state.totalPages = Math.ceil(action.payload.totalCount / action.payload.limit);
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch my properties
    builder.addCase(fetchMyProperties.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyProperties.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myProperties = action.payload;
    });
    builder.addCase(fetchMyProperties.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Fetch property by ID
    builder.addCase(fetchPropertyById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProperty = action.payload;
    });
    builder.addCase(fetchPropertyById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Create property
    builder.addCase(createProperty.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProperty.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myProperties.push(action.payload);
      toast.success('Property created successfully');
    });
    builder.addCase(createProperty.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Update property
    builder.addCase(updateProperty.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Update in myProperties
      const index = state.myProperties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.myProperties[index] = action.payload;
      }
      
      // Update in properties
      const propIndex = state.properties.findIndex(p => p.id === action.payload.id);
      if (propIndex !== -1) {
        state.properties[propIndex] = action.payload;
      }
      
      // Update currentProperty if it's the same
      if (state.currentProperty && state.currentProperty.id === action.payload.id) {
        state.currentProperty = action.payload;
      }
      
      toast.success('Property updated successfully');
    });
    builder.addCase(updateProperty.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });

    // Delete property
    builder.addCase(deleteProperty.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Remove from myProperties
      state.myProperties = state.myProperties.filter(p => p.id !== action.payload);
      
      // Remove from properties
      state.properties = state.properties.filter(p => p.id !== action.payload);
      
      // Clear currentProperty if it's the same
      if (state.currentProperty && state.currentProperty.id === action.payload) {
        state.currentProperty = null;
      }
      
      toast.success('Property deleted successfully');
    });
    builder.addCase(deleteProperty.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export const { clearPropertyError, clearCurrentProperty } = propertySlice.actions;

export default propertySlice.reducer;
