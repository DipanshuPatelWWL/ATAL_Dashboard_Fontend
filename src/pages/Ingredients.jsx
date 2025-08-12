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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";

const Ingredients = () => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [ingredientFields, setIngredientFields] = useState({});

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryChange = (selectedOption) => {
    const selectedValue = selectedOption?.value;
    if (!selectedValue) return;

    setSelected(selectedOption);

    setFormData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[selectedValue]) {
        updatedData[selectedValue] = {};
        ingredientFields[selectedValue]?.forEach((field) => {
          updatedData[selectedValue][field] = "";
        });
      }
      return updatedData;
    });

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      cat_sec: "",
    }));
  };

  const handleInputChange = (categoryName, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [categoryName]: {
        ...prevData[categoryName],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/category/getcoffee");
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        const categoryOptions = result.data.map((item) => ({
          value: item.categoryname[0], 
          label: item.categoryname[0],
        }));
        setCategory(categoryOptions);
        const dynamicIngredients = {};
        result.data.forEach((item) => {
          const name = item.categoryname[0];
          dynamicIngredients[name] = item.ingredients;
        });
        setIngredientFields(dynamicIngredients);
        const defaultCategory = categoryOptions.find((cat) => cat.value === "Black Coffee");
        if (!selected && defaultCategory) {
          handleCategoryChange(defaultCategory);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6} style={{ padding: "30px" }}>
          <Button variant="contained" color="success" onClick={openDialog}>
            <AddIcon /> ADD Ingredient
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            classes={{ paper: "dilog_box" }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Add Ingredient</DialogTitle>
            <DialogContent>
              <Select
                options={category}
                name="cat_sec"
                placeholder="Select Category"
                value={selected}
                onChange={handleCategoryChange}
              
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />

              {selected && (
                <div key={selected.value} style={{ marginTop: "20px" }}>
                  <strong>{selected.label}</strong>
                  {ingredientFields[selected.value]?.map((field, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      margin="dense"
                      label={field}
                      variant="outlined"
                      value={formData[selected.value]?.[field] || ""}
                      onChange={(e) =>
                        handleInputChange(selected.value, field, e.target.value)
                      }
                    />
                  ))}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Form submitted:", formData);
                  handleClose();
                }}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {/* Search Field */}
        <Grid item xs={6} style={{ padding: "30px" }}>
          <TextField
            className="search"
            variant="outlined"
            placeholder="Search..."
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
      </Grid>
    </>
  );
};

export default Ingredients;
