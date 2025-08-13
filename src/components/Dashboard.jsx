import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Categories from '../pages/categories';
import Settings from '../pages/Settings';
import Products from '../pages/Products';
import Customer from '../pages/Customer';
import Faq from '../pages/faq/Faq';

const Dashboard = ({ setIsLoggedIn }) => {
  return (
    <Grid container spacing={0} style={{ minHeight: '100vh' }}>

      <Grid item xs={2} className="sidebar">
        <Sidebar />
      </Grid>
      <Grid item xs={10} style={{ display: 'flex', flexDirection: 'column' }}>
        <Header setIsLoggedIn={setIsLoggedIn} />
        <Grid style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Settings />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </Grid>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
