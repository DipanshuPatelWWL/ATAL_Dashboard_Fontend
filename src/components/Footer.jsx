import React from 'react';
import { Grid, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Grid className="footer" container justifyContent="center" alignItems="center">
    <Typography variant="body1" style={{ color: '#fff', fontSize: '14px' }}>
      © {new Date().getFullYear()} All Rights Reserved. Developed by WORLD WEBLOGIC
    </Typography>
  </Grid>
  );
}

export default Footer;
