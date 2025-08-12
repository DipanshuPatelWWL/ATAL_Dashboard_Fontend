// Login.js
import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Forgetpassword from './Forgetpassword';
import Swal from "sweetalert2";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: trimmedUsername,
        password: trimmedPassword
      });

      const { token, user } = response.data;

      // Store in sessionStorage (NOT localStorage)
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);

      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
      });
    }
  };

  // Forget Password Modal Logic
  const [openForget, setOpenForget] = useState(false);
  const [email, setEmail] = useState('');

  const handleForget = () => {
    setOpenForget(true);
  };

  const handleClose = () => {
    setOpenForget(false);
    setEmail('');
  };

  const handleSubmit = async () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Email Required',
        text: 'Please enter your email address before continuing.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/category/forgetpassword', { email });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Reset Link Sent',
          text: `A reset link has been sent to ${email}`,
          confirmButtonColor: '#1976d2',
        });
        handleClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to send reset link. Please try again later.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={3} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField label="Username" variant="outlined" fullWidth margin="normal"
          value={username} onChange={(e) => setUsername(e.target.value)} />

        <TextField label="Password" type={showPassword ? 'text' : 'password'} variant="outlined"
          fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button color="primary" onClick={handleForget}>Forget Password</Button>
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Grid>

      <Forgetpassword open={openForget} handleClose={handleClose}
        email={email} setEmail={setEmail} handleSubmit={handleSubmit}/>
    </Grid>
  );
};

export default Login;
