
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  CloudUploadOutlined,
  Close,
  DeleteOutlined,
} from "@mui/icons-material";
import * as actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

export default function CreateSubCategory({
  addOpen,
  setAddOpen,
  currentCategory,
  onSubmit,
}) {
  const dispatch = useDispatch();

  const categoryList = useSelector(
    (state) => state.category.categoryList
  );

  const [formData, setFormData] = React.useState({
    subcategory_name: "",
    category_id: currentCategory?.id || "",
    slug: "",
    image: null,
    status:""
  });

  const [imagePreview, setImagePreview] = React.useState(null);

  React.useEffect(() => {
    dispatch(actions.fetchAllCategoris());
  }, [dispatch]);

  // Update form fields
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate slug from subcategory name
  const generateSlug = (value) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      subcategory_name: value,
      slug: generateSlug(value),
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const handleRemoveImage = (e) => {
    e.stopPropagation();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);
  };

  const handleAddSubcategory = () => {
    if (
      !formData.subcategory_name.trim() ||
      !formData.category_id ||
      !formData.slug.trim()
    ) {
      return;
    }

    const payload = new FormData();

    payload.append(
      "subcategoryName",
      formData.subcategory_name.trim()
    );

    payload.append("categoryId", formData.category_id);
    payload.append("status", formData.status);
    payload.append("slug", formData.slug.trim());

    if (formData.image) {
      payload.append("image", formData.image);
    }
    dispatch(actions.createSubCategory(payload))
    // onSubmit?.(payload);

    setAddOpen(false);
  };

  const handleClose = () => {
    setAddOpen(false);
  };

  React.useEffect(() => {
    if (addOpen) {
      setFormData({
        subcategory_name: "",
        category_id: currentCategory?.id || "",
        slug: "",
        image: null,
      });

      setImagePreview(null);
    }
  }, [addOpen, currentCategory]);

  return (
    <Dialog
      open={addOpen}
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
            TAXONOMY ENGINE
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
            color="#111827"
          >
            Create Subcategory
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ bgcolor: "#f3f4f6" }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Form Content */}
      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 1 }}>

          {/* 1. Subcategory Name */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#374151"
              display="block"
              mb={0.6}
            >
              Subcategory Name *
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Long Sleeve"
              value={formData.subcategory_name}
              onChange={(e) =>
                handleNameChange(e.target.value)
              }
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

          {/* 2. Permalink Slug */}
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
              fullWidth
              size="small"
              placeholder="long-sleeve"
              value={formData.slug}
              onChange={(e) =>
                handleChange("slug", e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "monospace",
                        color: "#6b7280",
                      }}
                    >
                      /
                    </Typography>
                  </InputAdornment>
                ),
              }}
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

          {/* 3. Parent Category */}
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
              fullWidth
              size="small"
              value={formData.category_id}
              onChange={(e) =>
                handleChange("category_id", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f3f4f6",
                  fontSize: 13.5,
                  "& fieldset": { border: "none" },
                },
              }}
            >
              {categoryList &&
                categoryList.length > 0 &&
                categoryList.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.categoryName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

            <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#374151"
              display="block"
              mb={0.6}
            >
              Status
            </Typography>

            <TextField
             select
              fullWidth
              size="small"
              placeholder="e.g. Long Sleeve"
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f3f4f6",
                  fontSize: 13.5,
                  "& fieldset": { border: "none" },
                },
              }}
            >
            {["active","draft"].map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                  >
                    {status}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          {/* 4. Subcategory Image Upload */}
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
                Subcategory Image
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
                  alt="Subcategory preview"
                  sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(17, 24, 39, 0.8)",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#0a0a0a",
                    },
                  }}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
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

                <CloudUploadOutlined
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
                  Click to upload subcategory image
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
          disabled={
            !formData.subcategory_name.trim() ||
            !formData.category_id ||
            !formData.slug.trim()
          }
          onClick={handleAddSubcategory}
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
          Create Subcategory
        </Button>
      </DialogActions>
    </Dialog>
  );
}
