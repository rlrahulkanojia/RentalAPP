import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppDispatch, RootState } from './store';
import { fetchCurrentUser } from './store/slices/authSlice';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertyCreatePage from './pages/PropertyCreatePage';
import PropertyEditPage from './pages/PropertyEditPage';
import TenantRegistrationPage from './pages/TenantRegistrationPage';
import TenantProfilePage from './pages/TenantProfilePage';
import ContractListPage from './pages/ContractListPage';
import ContractDetailPage from './pages/ContractDetailPage';
import ContractCreatePage from './pages/ContractCreatePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Property Owner Route Component
const PropertyOwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user?.isPropertyOwner) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Tenant Route Component
const TenantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { isRegistered } = useSelector((state: RootState) => state.tenant);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user?.isTenant || !isRegistered) {
    return <Navigate to="/tenant/register" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Property Routes */}
        <Route path="properties" element={<PropertyListPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="properties/create" element={
          <PropertyOwnerRoute>
            <PropertyCreatePage />
          </PropertyOwnerRoute>
        } />
        <Route path="properties/:id/edit" element={
          <PropertyOwnerRoute>
            <PropertyEditPage />
          </PropertyOwnerRoute>
        } />
        
        {/* Tenant Routes */}
        <Route path="tenant/register" element={<TenantRegistrationPage />} />
        <Route path="tenant/profile" element={
          <TenantRoute>
            <TenantProfilePage />
          </TenantRoute>
        } />
        
        {/* Contract Routes */}
        <Route path="contracts" element={<ContractListPage />} />
        <Route path="contracts/:id" element={<ContractDetailPage />} />
        <Route path="contracts/create" element={
          <PropertyOwnerRoute>
            <ContractCreatePage />
          </PropertyOwnerRoute>
        } />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
