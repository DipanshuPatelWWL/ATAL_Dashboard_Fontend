import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';


const Header = ({ setIsLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: '', profileImage: '' });
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    handleClose();
  };

  const handleProfile = () => {
    alert('Profile clicked');
    handleClose();
  };

  return (
    <Grid container spacing={0}  className='header_grid'>
      <Grid item xs={4} className="header_logo">
        <Typography variant="h6">Header</Typography>
      </Grid>

      <Grid item xs={8} className="header_menu">
        <IconButton onClick={handleClick}>
          <Avatar
            src={user.profileImage}
            alt={user.name}
            style={{ marginRight: '8px' }}
          />
          <Typography variant="subtitle1" style={{ color: '#fff' }}>
            {user.name || 'User'}
          </Typography>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Header;
