// Forgetpassword.jsx
import React from 'react';
import { Button, TextField, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions,} from '@mui/material';

const Forgetpassword = ({ open, handleClose, email, setEmail, handleSubmit }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forget Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Enter your registered email address. We’ll send you a link to reset your password.
        </Typography>
        <TextField autoFocus margin="dense" label="Email Address" type="email"
          fullWidth variant="outlined" value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary"> Cancel </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Forgetpassword;
