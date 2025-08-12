import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Paper, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';

const Test = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const username = 'admin'; 
    const appPassword = 'yJGnieRre9AxgDp6rh8YVZS9';  
    const token = btoa(`${username}:${appPassword}`);

    try {
      const res = await fetch('http://localhost/property-listing/wp-json/wp/v2/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error fetching categories',
          text: 'Unable to fetch categories.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Exception',
        text: error.message,
      });
    }
  };

  const handleAddCategory = async () => {
    const username = 'admin';  
    const appPassword = 'yJGnieRre9AxgDp6rh8YVZS9';  
    const token = btoa(`${username}:${appPassword}`);

    try {
      const res = await fetch('http://localhost/property-listing/wp-json/wp/v2/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (res.ok) {
        const data = await res.json();
        Swal.fire({
          icon: 'success',
          title: 'Category Created',
          text: `Category "${data.name}" created successfully.`,
        });
        setCategoryName('');
        fetchCategories(); 
      } else {
        const err = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Exception',
        text: error.message,
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const username = 'admin';  
    const appPassword = 'yJGnieRre9AxgDp6rh8YVZS9';  
    const token = btoa(`${username}:${appPassword}`);

    try {
      const res = await fetch(`http://localhost/property-listing/wp-json/wp/v2/categories/${categoryId}?force=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          text: 'The category has been deleted successfully.',
        });
        fetchCategories(); 
      } else {
        const err = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting Category',
          text: err.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Exception',
        text: error.message,
      });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f4f6f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '100%',
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Add New Category
        </Typography>

        {/* Category Add Form */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: '100%' }}
              onClick={handleAddCategory}
              disabled={!categoryName.trim()}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {/* Display Categories */}
        <Typography variant="h6" gutterBottom align="center" sx={{ mt: 4 }}>
          Existing Categories
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                marginBottom: '8px',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <ListItemText primary={category.name} />
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Test;
