import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AppDispatch, RootState } from '../store';
import { register, clearError } from '../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const validateFullName = (name: string): boolean => {
    const isValid = name.trim().length >= 3;
    setFullNameError(isValid ? '' : 'Full name must be at least 3 characters');
    return isValid;
  };
  
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const re = /^\+?[0-9]{10,15}$/;
    const isValid = re.test(phone);
    setPhoneNumberError(isValid ? '' : 'Please enter a valid phone number');
    return isValid;
  };
  
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 8;
    setPasswordError(isValid ? '' : 'Password must be at least 8 characters');
    return isValid;
  };
  
  const validateConfirmPassword = (confirmPassword: string): boolean => {
    const isValid = confirmPassword === password;
    setConfirmPasswordError(isValid ? '' : 'Passwords do not match');
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isFullNameValid && isEmailValid && isPhoneNumberValid && isPasswordValid && isConfirmPasswordValid) {
      dispatch(register({
        email,
        password,
        fullName,
        phoneNumber: phoneNumber || undefined,
      }))
        .unwrap()
        .then(() => {
          navigate('/login');
        })
        .catch(() => {
          // Error is handled by the reducer
        });
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Property Rental Management
          </Typography>
          
          <Typography component="h2" variant="h5">
            Create Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={!!fullNameError}
              helperText={fullNameError}
              onBlur={() => validateFullName(fullName)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              onBlur={() => validateEmail(email)}
            />
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number (Optional)"
              name="phoneNumber"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!phoneNumberError}
              helperText={phoneNumberError}
              onBlur={() => validatePhoneNumber(phoneNumber)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              onBlur={() => validatePassword(password)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              onBlur={() => validateConfirmPassword(confirmPassword)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
