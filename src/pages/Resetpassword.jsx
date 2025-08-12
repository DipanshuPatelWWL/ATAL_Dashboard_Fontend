import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Grid,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Resetpassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'All Fields Required',
        text: 'Please fill in both password fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'Make sure both passwords are the same.',
      });
      return;
    }

    try {
      const response = await axios.put('http://localhost:4000/category/passworupdate', {
        token,
        password,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: 'Your password has been successfully updated!',
          confirmButtonColor: '#1976d2',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: response.data.message || 'Something went wrong.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f2f5"
    >
      <Box
        sx={{
          width: 400,
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>

        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Resetpassword;
