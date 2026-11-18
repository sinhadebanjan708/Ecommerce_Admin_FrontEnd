import React, { useState, useRef } from "react";
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
  Switch,
  IconButton,
  InputAdornment,
  FormControl,
  MenuItem,
  InputLabel,
  Select

} from "@mui/material";
import {
  CloudUploadOutlined,
  Close,
  DeleteOutlined,
} from "@mui/icons-material";
import * as actions from "../store/actions"
import { useDispatch } from "react-redux";

const INITIAL_FORM_STATE = {
  name: "",
  slug: "",
  department_id:0,
  description: "",
  imageFile: null,
  imagePreview: "",
  status: true, // true = Active/Published, false = Draft
};

export default function CreateCategoryDialogue({
  createOpen,
  setCreateOpen,
}) {
  const dispatch= useDispatch();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const fileInputRef = useRef(null);
  const departmentList = [{id:1 , department: "Men"},{id:2 , department: "Women"},{id:3 , department: "Kids"}]

  // Auto-generate slug when typing name (unless user manually edited slug)
  const handleNameChange = (e) => {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: autoSlug,
    }));
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image file selection + preview URL
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
    }));
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setCreateOpen(false);
  };

  const handleCreateCategory = () => {
    if (!formData.name.trim()) return;

    const finalSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    // Final constructed category object
    const categoryPayload = {
    //   id: Date.now(),
      name: formData.name.trim(),
      title: formData.name.trim(), // Kept for compatibility with your table column
      slug: finalSlug,
      description: formData.description.trim(),
      image: formData.imageFile,
      department_id:formData.department_id,
    //   bannerUrl: formData.imagePreview,
    //   hasBanner: Boolean(formData.imagePreview),
    //   bannerDimensions: formData.imagePreview ? "1200×400" : "",
      status: formData.status ? "active" : "draft",
    //   liveStatus: formData.status,
    //   isDraft: !formData.status,
    //   departments: ["UNISEX"],
    //   subcategories: [],
    //   liveSkus: 0,
    };

    console.log("Created Category Object:", categoryPayload);
    if(categoryPayload){
        dispatch(actions.createCategory(categoryPayload))
    }

    // if (onCreateCategory) {
    //   onCreateCategory(categoryPayload);
    // }

    handleClose();
  };

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
            TAXONOMY ENGINE
          </Typography>
          <Typography variant="h6" fontWeight={700} color="#111827">
            Create Root Category
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
          {/* 1. Category Name */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#374151"
              display="block"
              mb={0.6}
            >
              Category Name *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Footwear & Boots"
              value={formData.name}
              onChange={handleNameChange}
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
              Permalink Slug
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="footwear-boots"
              value={formData.slug}
              onChange={(e) => handleFieldChange("slug", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace", color: "#6b7280" }}
                    >
                      /apparel/
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

          {/* 3. Description */}
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#374151"
              display="block"
              mb={0.6}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Editorial summary and storefront metadata for this category..."
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f3f4f6",
                  fontSize: 13,
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>

          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department_id}
                label="Department"
                onChange={(e) =>
                  handleFieldChange("department_id", e.target.value)
                }
              >
                {departmentList.map((item)=> (
                    <MenuItem value={item.id} >
                    {item.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 4. Category Hero Image Upload */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.6,
              }}
            >
              <Typography variant="caption" fontWeight={700} color="#374151">
                Category Image
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize={10.5}>
                1200×400 • PNG / JPG / WEBP
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />

            {formData.imagePreview ? (
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
                  src={formData.imagePreview}
                  alt="Category preview"
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
                    "&:hover": { bgcolor: "#0a0a0a" },
                  }}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "1.5px dashed #d1d5db",
                  borderRadius: 3.5,
                  p: 2.5,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <CloudUploadOutlined
                  sx={{ fontSize: 24, color: "#6b7280", mb: 0.5 }}
                />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  display="block"
                  color="#374151"
                >
                  Click to upload category cover image
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={10.5}>
                  MAX 5MB • OPTIMIZED WEBP RECOMMENDED
                </Typography>
              </Box>
            )}
          </Box>

          {/* 5. Status Toggle */}
          <Box
            sx={{
              p: 1.8,
              borderRadius: 3,
              backgroundColor: "#f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={700} color="#111827">
                Publish Status
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formData.status
                  ? "Live and visible on public storefront"
                  : "Saved as hidden draft"}
              </Typography>
            </Box>
            <Switch
              checked={formData.status}
              onChange={(e) => handleFieldChange("status", e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#fff",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#0a0a0a",
                  opacity: 1,
                },
              }}
            />
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
            "&:hover": { backgroundColor: "#e5e7eb" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!formData.name.trim()}
          onClick={handleCreateCategory}
          sx={{
            borderRadius: 99,
            textTransform: "none",
            backgroundColor: "#0a0a0a",
            color: "#fff",
            fontWeight: 600,
            px: 3,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
          }}
        >
          Create Category
        </Button>
      </DialogActions>
    </Dialog>
  );
}