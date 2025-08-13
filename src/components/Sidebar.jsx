import React from 'react';
import { Grid, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo1.png'
import OtherHousesSharpIcon from '@mui/icons-material/OtherHousesSharp';
import ProductionQuantityLimitsSharpIcon from '@mui/icons-material/ProductionQuantityLimitsSharp';
import RadarIcon from '@mui/icons-material/Radar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
const Sidebar = () => {
  return (
    <>
      <img src={Logo} alt="Company Logo" className="img-fluid" />
      <Grid className='sidebar_menu'>

        <List className='menu_list'>
          <ListItem button component={Link} to="/">
            <OtherHousesSharpIcon className='icon' /><ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <AssignmentIcon className='icon' /><ListItemText primary="Category" />
          </ListItem>
          <ListItem button component={Link} to="/products">
            <ProductionQuantityLimitsSharpIcon className='icon' /><ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/customer">
            <SupportAgentIcon className='icon' /><ListItemText primary="Customer" />
          </ListItem>
          <ListItem button component={Link} to="/faq">
            <RadarIcon className='icon' /><ListItemText primary="Faq" />
          </ListItem>
        </List>
      </Grid>
    </>
  );
}


export default Sidebar;
