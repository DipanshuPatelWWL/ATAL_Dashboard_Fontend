import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import Swal from "sweetalert2";
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

const Products = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState([]);
  const [selected, setSelected] = useState([]);
  const [product, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const rowsPerPage = 5;

  const [formData, setFormData] = useState({
    pro_name: "",
    p_price: "",
    s_price: "",
    cat_sec: [],
    image: null,
  });
  const [images, setImages] = useState([]);

  const handleImageChange1 = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };
  useEffect(() => {
    const filtered = product?.filter((cat) =>
      cat.pro_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, product]);
  const [productDetails, setProductDetails] = useState({
    frameMaterial: "",
    frameShape: "",
    frameColour: "",
    frameFit: "",
    gender: "",
    description: "",
  });

  const handleChange1 = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    console.log(productDetails);
  };
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [formErrors, setFormErrors] = useState({
    pro_name: "",
    p_price: "",
    s_price: "",
    cat_sec: "",
    image: "",
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      pro_name: "",
      p_price: "",
      s_price: "",
      cat_sec: [],
      image: null,
    });
    setSelected([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    setFormData((prevData) => ({
      ...prevData,
      cat_sec: selectedValues,
    }));

    setSelected(selectedOptions);

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      cat_sec: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);

      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    const proName = formData.pro_name.trim();
    const pPrice = String(formData.p_price).trim();
    const sPrice = String(formData.s_price).trim();

    if (!proName) {
      errors.pro_name = "Product name cannot be empty!";
    }

    if (!pPrice) {
      errors.p_price = "Purchase price is required!";
    } else if (isNaN(pPrice)) {
      errors.p_price = "Purchase price must be a number!";
    }

    if (!sPrice) {
      errors.s_price = "Sale price is required!";
    } else if (isNaN(sPrice)) {
      errors.s_price = "Sale price must be a number!";
    }

    if (!formData.cat_sec || formData.cat_sec.length === 0) {
      errors.cat_sec = "Please select at least one category!";
    }

    if (!formData.image && !isEditMode) {
      errors.image = "Please upload a product image!";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the form.",
      });
      return;
    }

    const form = new FormData();
    form.append("pro_name", proName);
    form.append("p_price", pPrice);
    form.append("s_price", sPrice);

    formData.cat_sec.forEach((categoryname, index) => {
      form.append(`cat_sec[${index}]`, categoryname);
    });

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      let response;
      if (isEditMode) {
        response = await API.put(
          `/updateproduct/${editId}`,
          form
        );
      } else {
        response = await API.post(
          "/addproduct/",
          form
        );
      }

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Product ${isEditMode ? "updated" : "added"} successfully!`,
        });
        handleClose();
        fetchProduct();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Operation failed. Try again!",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error submitting the form.",
      });
    }
  };

  const handleEditPro = (product) => {
    setIsEditMode(true);
    setEditId(product._id);
    setOpen(true);
    setFormData({
      pro_name: product.pro_name,
      p_price: product.p_price,
      s_price: product.s_price,
      cat_sec: product.cat_sec,
      image: null,
    });

    const selectedOptions = product.cat_sec.map((cat) => ({
      label: cat,
      value: cat,
    }));
    setSelected(selectedOptions);

    if (product.image) {
      setImage(`https://atal-backend.onrender.com/uploads/${product.image}`);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await API.get(
        "/getcategory/"
      );
      if (!response.ok) throw new Error("Network response was not ok");

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

  const fetchProduct = async () => {
    try {
      const response = await API.get("/getproduct");
      if (!response.ok) throw new Error("Network response was not ok");

      const product = await response.json();
      setProduct(product.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProduct();
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
          const response = await API.delete(
            `/deleteproduct/${id}`
          );
          if (response.status === 200) {
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            fetchProduct();
          } else {
            Swal.fire("Error!", "Failed to delete the product.", "error");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <Grid container spacing={2} className="pro_grid">
      <Grid item xs={6}>
        <Button variant="contained" color="success" onClick={handleOpen}>
          <AddIcon /> ADD NEW Product
        </Button>
      </Grid>

      <Grid item xs={6}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment className="search_box" position="start">
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
        <DialogTitle>
          {isEditMode ? "Update Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            name="pro_name"
            value={formData.pro_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={Boolean(formErrors.pro_name)}
            helperText={formErrors.pro_name}
          />

          <TextField
            label="Purchase Price"
            name="p_price"
            value={formData.p_price}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={Boolean(formErrors.p_price)}
            helperText={formErrors.p_price}
          />

          <TextField
            label="Sale Price"
            name="s_price"
            value={formData.s_price}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={Boolean(formErrors.s_price)}
            helperText={formErrors.s_price}
          />

          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <Select
              options={category}
              isMulti
              name="cat_sec"
              placeholder="Category"
              value={selected}
              onChange={handleCategoryChange}
            />
            {formErrors.cat_sec && (
              <div style={{ color: "red", fontSize: "0.8rem" }}>
                {formErrors.cat_sec}
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />
          {formErrors.image && (
            <div style={{ color: "red", fontSize: "0.8rem" }}>
              {formErrors.image}
            </div>
          )}
          {image && (
            <img
              src={image}
              alt="Preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
          <Box style={{ marginTop: "10px" }}>
            {/* Hidden file input */}
            <input
              type="file"
              id="product-gallery"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange1}
            />

            {/* Label to trigger file input */}
            <label htmlFor="product-gallery">
              <Button variant="contained" component="span">
                Select Product Gallery
              </Button>
            </label>

            {/* Show selected images */}
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
              {images.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "2px solid red",
                    margin: "5px",
                    width: 100,
                    height: 100,
                    backgroundImage: `url(${URL.createObjectURL(file)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </Box>
          </Box>
          <Typography variant="h6" gutterBottom>
            ABOUT THIS PRODUCT
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Frame Material"
                name="frameMaterial"
                value={productDetails.frameMaterial}
                onChange={handleChange1}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Frame Shape"
                name="frameShape"
                value={productDetails.frameShape}
                onChange={handleChange1}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Frame Colour"
                name="frameColour"
                value={productDetails.frameColour}
                onChange={handleChange1}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Frame Fit"
                name="frameFit"
                value={productDetails.frameFit}
                onChange={handleChange1}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gender"
                name="gender"
                value={productDetails.gender}
                onChange={handleChange1}
                fullWidth
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={productDetails.description}
                onChange={handleChange1}
                multiline
                rows={4}
                fullWidth
                margin="dense"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
            ABOUT LENS 1
          </Typography>

          <TextField
            label="Lens title"
            name="pro_name"
            value={formData.pro_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={Boolean(formErrors.pro_name)}
            helperText={formErrors.pro_name}
          />

          <TextField
            label="Description"
            name="description"
            value={productDetails.description}
            onChange={handleChange1}
            multiline
            rows={4}
            fullWidth
            margin="dense"
          />

          <input
            type="file"
            id="product-gallery"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange1}
          />

          {/* Label to trigger file input */}
          <label htmlFor="product-gallery">
            <Button variant="contained" component="span">
              Select Product Gallery
            </Button>
          </label>

          <Typography variant="h6" gutterBottom sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
            ABOUT LENS 2
          </Typography>

          <TextField
            label="lens title"
            name="pro_name"
            value={formData.pro_name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={Boolean(formErrors.pro_name)}
            helperText={formErrors.pro_name}
          />

          <TextField
            label="Description"
            name="description"
            value={productDetails.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            margin="dense"
          />

          <input
            type="file"
            id="product-gallery"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {/* Label to trigger file input */}
          <label htmlFor="product-gallery" >
            <Button variant="contained" component="span">
              Select Product Gallery
            </Button>
          </label>
        </DialogContent>


        <DialogActions>
          <Button onClick={handleClose} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            {isEditMode ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell align="center">Purchase Price</StyledTableCell>
                <StyledTableCell align="center">Sale Price</StyledTableCell>
                <StyledTableCell align="center">Category</StyledTableCell>
                <StyledTableCell align="center">Image</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                currentRows?.map((product, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{product.pro_name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {product.p_price}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.s_price}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.cat_sec?.join(", ")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {product.image && (
                        <img
                          src={`http://localhost:4000/uploads/${product.image}`}
                          alt="product"
                          width="80"
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <EditIcon
                        className="icon_update"
                        onClick={() => handleEditPro(product)}
                      />
                      <DeleteIcon
                        className="icon_delete"
                        onClick={() => handleDelete(product._id)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredData?.length > rowsPerPage && (
          <div className="text-center mt-3">
            <Pagination
              count={Math.ceil(filteredData?.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              className="pagination"
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default Products;
