import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const Customer = () => {
  return (
    <>
   <Grid container spacing={2}>
    <Grid item xs={6} style={{ padding: '30px' }}>
    <Button variant="contained"color="success"className="add_cat_btn">
    <AddIcon />ADD Customer Details</Button>
    </Grid>
    <Grid item xs={6} style={{ padding: "30px" }}>
    <TextField className="search"variant="outlined"placeholder="Search..."fullWidth
            value=''
            InputProps={{
              startAdornment: (
                <InputAdornment className="search_box" position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              classes: {
                input: 'custom_search', 
              },
            }}
          />
    </Grid>
   </Grid>
    </>
  )
}

export default Customer