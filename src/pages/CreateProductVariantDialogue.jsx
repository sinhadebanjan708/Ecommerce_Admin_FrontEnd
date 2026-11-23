
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Stack,
  Divider,
  Avatar,
  Chip,
  InputAdornment,
  Grid,
} from "@mui/material";

import {
  Close,
  CloudUploadOutlined,
  AddPhotoAlternateOutlined,
  DeleteOutlined,
  Inventory2Outlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import * as actions from "../store/actions"

const STATUS_OPTIONS = ["active", "draft", "archived"];
const SELLER_TYPES = ["Inventory", "POD"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const FIT_OPTIONS = ["Regular", "Regular Sized", "Oversized", "Slim Fit"];

const initialForm = {
  productId: "",
  sku: "",
  price: "",
  color: "",
  size: "S",
  fit: "",
  salePrice: "",
  status: "active",
  sellerType: "POD",
  deliveryDate: "",
  warehouseId: "",
  quantityAvailable: 0,
  quantityReserved: 0,
  reorderLevel: 0,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#f4f4f5",
    fontSize: 13,
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "#ccc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#222",
      borderWidth: 1,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
  },
};

const sectionTitleSx = {
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: 0.8,
  color: "#888",
  mb: 1.5,
};

export default function CreateProductVariantDialog({
  open,
  onClose,
  onSubmit,
  products = [],
  warehouses = [],
  loading = false,
}) {
    const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setMediaFiles([]);
      setError("");
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleMediaUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      const validType = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type);

      return validType && file.size <= 10 * 1024 * 1024;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPG, PNG and WEBP images up to 10MB are allowed.");
    } else {
      setError("");
    }

    const newFiles = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles((prev) => [...prev, ...newFiles]);

    // Allow selecting the same file again
    event.target.value = "";
  };

  const removeMedia = (id) => {
    setMediaFiles((prev) => {
      const removed = prev.find((item) => item.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      mediaFiles.forEach((media) => {
        URL.revokeObjectURL(media.preview);
      });
    };
  }, [mediaFiles]);

  const handleClose = () => {
    mediaFiles.forEach((media) => {
      URL.revokeObjectURL(media.preview);
    });

    setMediaFiles([]);
    setForm(initialForm);
    setError("");
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!form.productId || !form.sku.trim() || form.price === "") {
      setError("Please select a product and enter SKU and price.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.salePrice || 0) < 0) {
      setError("Price values cannot be negative.");
      return;
    }

    // if (
    //   Number(form.quantityAvailable) < 0 ||
    //   Number(form.quantityReserved) < 0 ||
    //   Number(form.reorderLevel) < 0
    // ) {
    //   setError("Inventory quantities cannot be negative.");
    //   return;
    // }

    // if (
    //   Number(form.quantityReserved) > Number(form.quantityAvailable)
    // ) {
    //   setError("Reserved quantity cannot exceed available quantity.");
    //   return;
    // }

    const payload = {
      productId: Number(form.productId),
      sku: form.sku.trim(),
      price: Number(form.price),
      color: form.color,
      size: form.size,
      fit: form.fit,
      salePrice:
        form.salePrice === "" ? null : Number(form.salePrice),
      status: form.status,
      sellerType: form.sellerType || null,
      deliveryDate: form.deliveryDate
  ? `${form.deliveryDate}T00:00:00`
  : null,
      images: mediaFiles.map((media) => media.file),
      warehouseId: form.warehouseId
        ? Number(form.warehouseId)
        : null,
      quantityAvailable: Number(form.quantityAvailable),
      quantityReserved: Number(form.quantityReserved),
      reorderLevel: Number(form.reorderLevel),
    };

    dispatch(actions.createProductVariant(form.productId,payload))
    setForm({...form,
        productId: "",
        sku: "",
        price: "",
        color: "",
        size: "S",
        fit: "",
        salePrice: "",
        status: "active",
        sellerType: "POD",
        deliveryDate: "",
        warehouseId: "",
        quantityAvailable: 0,
        quantityReserved: 0,
        reorderLevel: 0,
    })
    onClose();
    // try {
    //   await onSubmit?.({
    //     payload,
    //     images: mediaFiles.map((media) => media.file),
    //   });
    // } catch (err) {
    //   setError(err.message || "Unable to create variant.");
    // }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 0,
          maxHeight: "95vh",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#f7f7f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: "#b54b24",
            }}
          >
            CREATE NEW RECORD
          </Typography>

          <Typography sx={{ fontSize: 19, fontWeight: 800, mt: 0.3 }}>
            Create Product Variant
          </Typography>
        </Box>

        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {/* Product and SKU */}
        <Typography sx={sectionTitleSx}>
          GENERAL INFORMATION
        </Typography>

        <Stack spacing={1.8}>
          <FormControl fullWidth size="small" sx={fieldSx}>
            <InputLabel>Product</InputLabel>
            <Select
              label="Product"
              value={form.productId}
              onChange={handleChange("productId")}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name || product.productName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="SKU (Stock Keeping Unit)"
            value={form.sku}
            onChange={handleChange("sku")}
            sx={fieldSx}
          />

          {/* Price */}
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Base Price"
                type="number"
                value={form.price}
                onChange={handleChange("price")}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Sale Price"
                type="number"
                value={form.salePrice}
                onChange={handleChange("salePrice")}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Color, Size */}
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Color"
                value={form.color}
                onChange={handleChange("color")}
                sx={fieldSx}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Size</InputLabel>
                <Select
                  label="Size"
                  value={form.size}
                  onChange={handleChange("size")}
                >
                  {SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Fit */}
          <FormControl fullWidth size="small" sx={fieldSx}>
            <InputLabel>Fit</InputLabel>
            <Select
              label="Fit"
              value={form.fit}
              onChange={handleChange("fit")}
            >
              {FIT_OPTIONS.map((fit) => (
                <MenuItem key={fit} value={fit}>
                  {fit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status and Seller Type */}
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={handleChange("status")}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Seller Type</InputLabel>
                <Select
                  label="Seller Type"
                  value={form.sellerType}
                  onChange={handleChange("sellerType")}
                >
                  <MenuItem value="">None</MenuItem>
                  {SELLER_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            size="small"
            label="Delivery Date"
            type="date"
            value={form.deliveryDate}
            onChange={handleChange("deliveryDate")}
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Warehouse and Inventory */}
        <Typography sx={sectionTitleSx}>
          WAREHOUSE & INVENTORY
        </Typography>

        <Stack spacing={1.8}>
          <FormControl fullWidth size="small" sx={fieldSx}>
            <InputLabel>Warehouse</InputLabel>
            <Select
              label="Warehouse"
              value={form.warehouseId}
              onChange={handleChange("warehouseId")}
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name || warehouse.warehouseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Quantity Available"
                type="number"
                value={form.quantityAvailable}
                onChange={handleChange("quantityAvailable")}
                sx={fieldSx}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Quantity Reserved"
                type="number"
                value={form.quantityReserved}
                onChange={handleChange("quantityReserved")}
                sx={fieldSx}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            size="small"
            label="Reorder Level"
            type="number"
            value={form.reorderLevel}
            onChange={handleChange("reorderLevel")}
            sx={fieldSx}
            inputProps={{ min: 0 }}
          />
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Multiple Images */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography sx={sectionTitleSx}>
            VARIANT IMAGES
          </Typography>

          <Typography sx={{ fontSize: 9, color: "#777" }}>
            JPG / PNG / WEBP · Max 10MB each
          </Typography>
        </Stack>

        <Box
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleMediaUpload({
              target: {
                files: event.dataTransfer.files,
                value: "",
              },
            });
          }}
          sx={{
            p: 2.5,
            minHeight: 125,
            bgcolor: "#f4f4f5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "1px dashed #ccc",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#ededf0",
              borderColor: "#888",
            },
          }}
        >
          <input
            ref={fileInputRef}
            hidden
            multiple
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleMediaUpload}
          />

          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#fff",
              color: "#555",
              mb: 1,
            }}
          >
            <CloudUploadOutlined />
          </Avatar>

          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
            Upload Multiple Angle Shots
          </Typography>

          <Typography sx={{ fontSize: 9, color: "#777", mt: 0.4 }}>
            Click or drag images here
          </Typography>
        </Box>

        {mediaFiles.length > 0 && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1.5, mb: 1 }}
            >
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#777" }}>
                {mediaFiles.length} UPLOADED IMAGES
              </Typography>
              <Typography sx={{ fontSize: 9, color: "#b54b24" }}>
                First image is primary
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              {mediaFiles.map((media, index) => (
                <Box
                  key={media.id}
                  sx={{
                    position: "relative",
                    height: 110,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <Box
                    component="img"
                    src={media.preview}
                    alt={media.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <Chip
                    label={index === 0 ? "PRIMARY" : `ANGLE ${index + 1}`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      height: 18,
                      fontSize: 7,
                      fontWeight: 800,
                      bgcolor: "#fff",
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeMedia(media.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      bgcolor: "#fff",
                      width: 23,
                      height: 23,
                      "&:hover": { bgcolor: "#eee" },
                    }}
                  >
                    <DeleteOutlined sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        )}

        {error && (
          <Typography
            role="alert"
            sx={{ color: "#d32f2f", fontSize: 11, mt: 1.5 }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 1.8,
          bgcolor: "#f7f7f8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          position: "sticky",
          bottom: 0,
          zIndex: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: 5,
            bgcolor: "#ebebed",
            color: "#222",
            textTransform: "none",
            fontSize: 11,
            px: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 5,
            bgcolor: "#050505",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          {loading ? "Creating..." : "Create Variant"}
        </Button>
      </Box>
    </Dialog>
  );
}
