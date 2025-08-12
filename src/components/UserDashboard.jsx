import React from 'react';
import { Typography } from '@mui/material';
const UserDashboard = ({ setIsLoggedIn }) => {
  return (
    <>
 <div style={{ padding: '20px' }}>
      <Typography variant="h4">Welcome User</Typography>
      <p>This is a different dashboard for users with status 2.</p>
    </div>

    </>
  )
}

export default UserDashboard