import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment,
  Chip,
  Box,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";

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

const CoffeeIngredent = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [selected, setSelected] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [coffee, setCoffee] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoffee, setFilteredCoffee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCoffeeId, setEditingCoffeeId] = useState(null);
  const rowsPerPage = 5;

  const handleOpen = () => {
    setOpen(true);
    fetchCategory();
  };

  const handleClose = () => {
    setOpen(false);
    setSelected([]);
    setIngredientInput("");
    setIngredientsList([]);
    setFormErrors({});
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelected(selectedOptions);
    if (!selectedOptions || selectedOptions.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        cat_sec: "Please select at least one category",
      }));
    } else {
      setFormErrors((prev) => {
        const { cat_sec, ...rest } = prev;
        return rest;
      });
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await API.get("/getcategory");
      const result = await response.json();
      const formatted = result.data.map((item) => ({
        value: item.categoryname,
        label: item.categoryname,
      }));
      setCategory(formatted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleIngredientKeyDown = (e) => {
    if (e.key === "Enter" && ingredientInput.trim()) {
      e.preventDefault();
      setIngredientsList((prev) => [...prev, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleIngredientDelete = (index) => {
    setIngredientsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        cat_sec: "Please select at least one category",
      }));
      return;
    }

    if (ingredientsList.length === 0) {
      Swal.fire({ icon: "error", title: "Error", text: "Please add at least one ingredient." });
      return;
    }

    const form = {
      categoryname: selected.map((item) => item.value),
      ingredients: JSON.stringify(ingredientsList),
    };

    try {
      let response;

      if (isEditMode && editingCoffeeId) {

        response = await axios.put(`http://localhost:4000/category/updatecoffee/${editingCoffeeId}`, form);
      } else {

        response = await axios.post("http://localhost:4000/category/coffeeadd", form);
      }

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Updated" : "Added",
          text: isEditMode ? "Coffee updated successfully!" : "Coffee added successfully!",
        });
        handleClose();
        fetchCoffee();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Operation failed.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error submitting the form.",
      });
    }
  };


  const fetchCoffee = async () => {
    try {
      const response = await fetch("http://localhost:4000/category/getcoffee");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setCoffee(result.data);
    } catch (error) {
      console.error("There was an error fetching the coffee:", error);
    }
  };

  useEffect(() => {
    fetchCoffee();
  }, []);

  useEffect(() => {
    const filtered = coffee?.filter((item) =>
      item.categoryname[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.join(", ").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoffee(filtered);
    setCurrentPage(1);
  }, [searchQuery, coffee]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCoffee?.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
          const response = await axios.delete(`http://localhost:4000/category/deletecoffee/${id}`);
          if (response.status === 200) {
            Swal.fire("Deleted!", "Coffee entry has been deleted.", "success");
            fetchCoffee();
          } else {
            Swal.fire("Error!", "Failed to delete the coffee entry.", "error");
          }
        } catch (error) {
          console.error("Error deleting coffee:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleEdit = (coffeeData) => {
    setIsEditMode(true);
    setEditingCoffeeId(coffeeData._id);

    const selectedOptions = coffeeData.categoryname.map((cat) => ({
      label: cat,
      value: cat,
    }));
    setSelected(selectedOptions);
    setIngredientsList(coffeeData.ingredients);
    setOpen(true);
    fetchCategory();
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ padding: "30px" }}>
          <Button variant="contained" color="success" onClick={handleOpen}>
            <AddIcon /> ADD Coffee
          </Button>
        </Grid>

        <Grid item xs={6} style={{ padding: "30px" }}>
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
              classes: {
                input: "custom_search",
              },
            }}
          />
        </Grid>


        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditMode ? "Edit Coffee Product" : "Add Coffee Product"}</DialogTitle>
          <DialogContent>
            <Select
              options={category}
              isMulti
              name="cat_sec"
              placeholder="Select Coffee"
              value={selected}
              onChange={handleCategoryChange}
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            {formErrors.cat_sec && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>{formErrors.cat_sec}</div>
            )}

            {selected.length > 0 && (
              <>
                <TextField
                  label="Add Ingredient"
                  placeholder="Type ingredient and press Enter"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {ingredientsList.map((ing, index) => (
                    <Chip
                      key={index}
                      label={ing}
                      onDelete={() => handleIngredientDelete(index)}
                      color="primary"
                    />
                  ))}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="success" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>


      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell align="center">Coffee Name</StyledTableCell>
                  <StyledTableCell align="center">Ingredients</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows?.map((coffee_data, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{(currentPage - 1) * rowsPerPage + index + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      {coffee_data.categoryname[0]}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {coffee_data.ingredients.join(", ")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {coffee_data.createdAt}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <EditIcon style={{ color: "blue", cursor: "pointer" }} onClick={() => handleEdit(coffee_data)} />
                      <DeleteIcon
                        style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
                        onClick={() => handleDelete(coffee_data._id)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          {filteredCoffee?.length > rowsPerPage && (
            <div className="text-center mt-3">
              <Pagination
                count={Math.ceil(filteredCoffee.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="secondary" className="pagination"
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CoffeeIngredent;
