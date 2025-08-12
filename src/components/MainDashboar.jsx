import React from 'react';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard';

const MainDashboard = ({ setIsLoggedIn }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user) return <div>Unauthorized</div>;

  if (user.status === "1") {
    return <Dashboard setIsLoggedIn={setIsLoggedIn} />;
  } else if (user.status === "2") {
    return <UserDashboard setIsLoggedIn={setIsLoggedIn} />;
  } else {
    return <div>Invalid role</div>;
  }
};

export default MainDashboard;
