import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

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
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Categories = () => {
  const [category, setCategory] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(category);
  const rowsPerPage = 5;
  useEffect(() => {
    const filtered = category?.filter((cat) =>
      cat.categoryname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, category]);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [formData, setFormData] = useState({categoryname: "",});
  const [formErrors, setFormErrors] = useState({ categoryname: "" });
  const [open, setOpen] = useState(false);
  const handleCateAdd = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({ categoryname: "" });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({ ...formData, [name]: value });
  
    // Frontend validation
    if (name === "categoryname") {
      if (!value.trim()) {
        setFormErrors({ ...formErrors, categoryname: "Category name cannot be empty!" });
      } else if (value.trim().length < 2) {
        setFormErrors({ ...formErrors, categoryname: "Minimum 2 characters required." });
      } else {
        setFormErrors({ ...formErrors, categoryname: "" });
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  

    if (!formData.categoryname.trim()) {
      setFormErrors({ categoryname: "Category name cannot be empty!" });
      return;
    } else if (formData.categoryname.trim().length < 2) {
      setFormErrors({ categoryname: "Minimum 2 characters required." });
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:4000/category/addcategory",
        formData
      );
  
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Category "${formData.categoryname}" added successfully!`,
        });
        handleClose();
        fetchCategory();
      }
    } catch (error) {
      handleClose();
      console.error("Error:", error);
      const errorMsg =
        error.response?.data?.message || "Something went wrong!";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    }
  };
  
  
  const fetchCategory = async () => {
    try {  
      const response = await fetch(
        "http://localhost:4000/category/getcategory/"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const category = await response.json();

      setCategory(category.data);
    } catch (error) {
      console.error("There was an error fetching the category:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:4000/category/deletecategory/${id}`
          );
          if (response.status === 200) {
            Swal.fire("Deleted!", "Category has been deleted.", "success");
           
            fetchCategory(); 
          } else {
            Swal.fire("Error!", "Failed to delete the category.", "error");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };
  
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ id: "", categoryname: "" });


const handleEdit = (cat) => {
  setEditData({ id: cat._id, categoryname: cat.categoryname });
  setOpenEdit(true);
};

const handleCloseEdit = () => {
  setOpenEdit(false);
};
const handleChange1 = (e) => {
  setEditData({ ...editData, categoryname: e.target.value });
};

const handleUpdate = async () => {
  if (!editData.categoryname.trim()) {
    Swal.fire("Error!", "Category name cannot be empty!", "error");
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:4000/category/updatecategory/${editData.id}`,
      { categoryname: editData.categoryname }
    );

    if (response.status === 200) {
      Swal.fire("Updated!", "Category updated successfully.", "success");
      fetchCategory(); 
      handleCloseEdit();
    } else {
      Swal.fire("Error!", "Failed to update the category.", "error");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    Swal.fire("Error!", "Something went wrong.", "error");
  }
};


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4} style={{ padding: "30px" }} className="add_cat">
          <Button variant="contained"color="success"className="add_cat_btn"onClick={handleCateAdd}>
            <AddIcon />ADD NEW Category</Button>
          <Dialog open={open}onClose={handleClose}classes={{ paper: "dilog_box" }}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent className="a1">
            <TextField label="Category Name" variant="outlined" fullWidth margin="dense"
  name="categoryname" value={formData.categoryname} onChange={handleChange}error={Boolean(formErrors.categoryname)}
  helperText={formErrors.categoryname}/>

            </DialogContent>
            <DialogActions className="a2">
              <Button onClick={handleClose} color="error" variant="outlined">{" "}Cancel</Button>
              <Button onClick={handleSubmit}color="success"variant="contained">
                Add Category
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {/* Search Box */}
        <Grid item xs={8} style={{ padding: "30px" }} className="search_cat">
          <TextField className="search"variant="outlined"placeholder="Search..."fullWidth
            value={searchQuery}onChange={(e) => setSearchQuery(e.target.value)}
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
        <Grid item xs={12} className="table">
          <TableContainer component={Paper}>
            <Table className="table_data">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Category Name</StyledTableCell>
                  <StyledTableCell align="center">Updated At</StyledTableCell>
                  <StyledTableCell align="center">Created At</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows?.map((cat, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {cat.categoryname}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {cat.ingredients}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {cat.createdAt}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="icon_add">
                     <EditIcon className="icon_update" onClick={() => handleEdit(cat)}/>
                        <DeleteIcon className="icon_delete" onClick={() => handleDelete(cat._id)} />
                    </StyledTableCell>


                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredData?.length > rowsPerPage && (
            <div className="text-center mt-3">
              <Pagination count={Math.ceil(filteredData?.length / rowsPerPage)}
                page={currentPage} onChange={handlePageChange} color="secondary" className="pagination"/>
            </div>
          )}
        </Grid>
		<Dialog open={openEdit} onClose={handleCloseEdit} classes={{ paper: "dilog_box" }}>
  <DialogTitle>Edit Category</DialogTitle>
  <DialogContent>
    <TextField
      label="Category Name"
      variant="outlined"
      fullWidth
      margin="dense"
      name="categoryname"
      value={editData.categoryname}
      onChange={handleChange1}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEdit} color="error" variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleUpdate} color="success" variant="contained">
      Update Category
    </Button>
  </DialogActions>
</Dialog>

      </Grid>
    </>
  );
};

export default Categories;
