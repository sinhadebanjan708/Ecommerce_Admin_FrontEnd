
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as actions from "../store/actions"
import { useDispatch } from "react-redux";


const INITIAL_FORM_DATA = {
  productName: "",
  categoryId: "",
  subcategoryId: "",
  description: "",
  slug: "",
  image: null,
  basePrice: "",
  status: "DRAFT",
};

export default function CreateProductDialogue({
  createOpen,
  setCreateOpen,
  categories = [],
  subCategories = [],
  onCreateProduct,
  categoryList,
  subcategoryList
}) {
    const dispatch = useDispatch();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setImagePreview(null);
    setCreateOpen(false);
  };

  const handleSubmit = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });
    console.log('submitted product__',formData)
    dispatch(actions.createProduct(formData))
      setFormData((prev) => ({
      ...prev,
      productName: "",
  categoryId: "",
  subcategoryId: "",
  description: "",
  slug: "",
  image: null,
  basePrice: "",
  status: "DRAFT",
    }));
    setCreateOpen(false)
    // onCreateProduct?.(payload);
  };

  const filteredSubCategories = subCategories.filter(
    (item) => String(item.categoryId) === String(formData.categoryId)
  );

  return (
     <Dialog
    open={createOpen}
    onClose={handleClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 4,
        p: 1,
        backgroundColor: "#fff",
      },
    }}
  >
    {/* Header */}
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 1,
      }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "#c2410c",
            letterSpacing: 0.8,
            display: "block",
          }}
        >
          PRODUCT CATALOG
        </Typography>

        <Typography
          variant="h6"
          fontWeight={700}
          color="#111827"
        >
          Create New Product
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={handleClose}
        sx={{ bgcolor: "#f3f4f6" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>

    {/* Form Content */}
    <DialogContent>
      <Stack spacing={2.2} sx={{ mt: 1 }}>

        {/* Product Name */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Product Name *
          </Typography>

          <TextField
            name="productName"
            fullWidth
            size="small"
            placeholder="e.g. Oversized Graphic T-Shirt"
            value={formData.productName}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Category */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Parent Category *
          </Typography>

          <TextField
            select
            name="categoryId"
            fullWidth
            size="small"
            value={formData.categoryId}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                categoryId: e.target.value,
                subcategoryId: "",
              }));
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          >
            {categoryList?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName || category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Subcategory */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Subcategory *
          </Typography>

          <TextField
            select
            name="subcategoryId"
            fullWidth
            size="small"
            value={formData.subcategoryId}
            onChange={handleChange}
            disabled={!formData.categoryId}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          >
            {subcategoryList?.map((subCategory) => (
              <MenuItem key={subCategory.id} value={subCategory.id}>
                {subCategory.subcategoryName || subCategory.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Product Slug */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Permalink Slug *
          </Typography>

          <TextField
            name="slug"
            fullWidth
            size="small"
            placeholder="oversized-graphic-t-shirt"
            value={formData.slug}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13,
                fontFamily: "monospace",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Product Description
          </Typography>

          <TextField
            name="description"
            fullWidth
            multiline
            rows={3}
            placeholder="Enter product description..."
            value={formData.description}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Base Price */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Base Price (₹) *
          </Typography>

          <TextField
            name="basePrice"
            fullWidth
            size="small"
            type="number"
            placeholder="e.g. 999"
            value={formData.basePrice}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Status */}
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            color="#374151"
            display="block"
            mb={0.6}
          >
            Product Status
          </Typography>

          <TextField
            select
            name="status"
            fullWidth
            size="small"
            value={formData.status}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f3f4f6",
                fontSize: 13.5,
                "& fieldset": { border: "none" },
              },
            }}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Box>

        {/* Product Image */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.6,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="#374151"
            >
              Product Image
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              fontSize={10.5}
            >
              PNG / JPG / WEBP
            </Typography>
          </Box>

          {imagePreview ? (
            <Box
              sx={{
                position: "relative",
                borderRadius: 3.5,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Product preview"
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          ) : (
            <Box
              component="label"
              sx={{
                border: "1.5px dashed #d1d5db",
                borderRadius: 3.5,
                p: 2.5,
                textAlign: "center",
                cursor: "pointer",
                display: "block",
                backgroundColor: "#fafafa",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />

              <CloudUploadIcon
                sx={{
                  fontSize: 24,
                  color: "#6b7280",
                  mb: 0.5,
                }}
              />

              <Typography
                variant="caption"
                fontWeight={600}
                display="block"
                color="#374151"
              >
                Click to upload product image
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                fontSize={10.5}
              >
                MAX 5MB • OPTIMIZED WEBP RECOMMENDED
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </DialogContent>

    {/* Footer Actions */}
    <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
      <Button
        onClick={handleClose}
        sx={{
          borderRadius: 99,
          textTransform: "none",
          backgroundColor: "#f3f4f6",
          color: "#374151",
          fontWeight: 600,
          px: 2.5,
          "&:hover": {
            backgroundColor: "#e5e7eb",
          },
        }}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          borderRadius: 99,
          textTransform: "none",
          backgroundColor: "#0a0a0a",
          color: "#fff",
          fontWeight: 600,
          px: 3,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#262626",
            boxShadow: "none",
          },
        }}
      >
        Create Product
      </Button>
    </DialogActions>
  </Dialog>
  );
}
