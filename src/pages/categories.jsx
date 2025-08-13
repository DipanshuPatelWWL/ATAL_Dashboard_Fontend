import { useState, useEffect } from "react";
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
import API from "../API/Api";

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
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const rowsPerPage = 5;

  useEffect(() => {
    const filtered = category.filter((cat) =>
      cat.categoryname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, category]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const [formData, setFormData] = useState({ categoryname: "" });
  const [formErrors, setFormErrors] = useState({ categoryname: "" });
  const [open, setOpen] = useState(false);

  const handleCateAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ categoryname: "" });
    setFormErrors({ categoryname: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "categoryname") {
      if (!value.trim()) {
        setFormErrors({
          ...formErrors,
          categoryname: "Category name cannot be empty!",
        });
      } else if (value.trim().length < 2) {
        setFormErrors({
          ...formErrors,
          categoryname: "Minimum 2 characters required.",
        });
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
      const response = await API.post("/addcategory", formData);

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await API.get("/getcategory");
      setCategory(response.data.data || []);
    } catch (error) {
      console.error("There was an error fetching the category:", error);
      Swal.fire("Error!", "Failed to fetch categories.", "error");
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
          const response = await API.delete(`/deletecategory/${id}`);
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
      const response = await API.put(`/updatecategory/${editData.id}`, {
        categoryname: editData.categoryname,
      });

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
        {/* Add Category */}
        <Grid item xs={4} style={{ padding: "30px" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleCateAdd}
          >
            <AddIcon /> ADD NEW Category
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                margin="dense"
                name="categoryname"
                value={formData.categoryname}
                onChange={handleChange}
                error={Boolean(formErrors.categoryname)}
                helperText={formErrors.categoryname}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="success"
                variant="contained"
              >
                Add Category
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {/* Search */}
        <Grid item xs={8} style={{ padding: "30px" }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Category Name</StyledTableCell>
                  <StyledTableCell align="center">Updated At</StyledTableCell>
                  <StyledTableCell align="center">Created At</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((cat, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{cat.categoryname}</StyledTableCell>
                    <StyledTableCell align="center">
                      {cat.updatedAt}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {cat.createdAt}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(cat)}
                      />
                      <DeleteIcon
                        style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                        onClick={() => handleDelete(cat._id)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredData.length > rowsPerPage && (
            <div className="text-center mt-3">
              <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="secondary"
              />
            </div>
          )}
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={openEdit} onClose={handleCloseEdit}>
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
            <Button
              onClick={handleUpdate}
              color="success"
              variant="contained"
            >
              Update Category
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default Categories;
