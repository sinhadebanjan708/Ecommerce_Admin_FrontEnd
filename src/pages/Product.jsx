import React, { useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Stack,
  LinearProgress,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  FileDownloadOutlined,
  TuneOutlined,
  Add,
  Inventory2Outlined,
  CheckCircleOutlined,
  WarningAmberRounded,
  BlockOutlined,
  TrendingUp,
  FiberManualRecord,
  Search,
  SwapVert,
  Close,
  AddPhotoAlternateOutlined,
  PictureAsPdfOutlined,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  Link as LinkIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowDown,
} from "@mui/icons-material";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Oversized Heavyweight Cotton Tee",
    sku: "AT-TEE-001",
    department: "MEN & UNISEX",
    category: "T-SHIRTS",
    subcategory: "Tops / Basics",
    inspectorCategory: "T-Shirts",
    inspectorSubcategory: "Tops / Heavyweight Tees",
    brand: "Atelier Éditions Studio",
    basePrice: 45.0,
    comparePrice: 58.0,
    variantsCount: 8,
    stockUnits: 420,
    maxStock: 500,
    stockLabel: "Optimal",
    stockTone: "optimal",
    status: "PUBLISHED",
    imageUrl:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
    description:
      "Crafted from custom-developed 280 GSM dry-touch comb cotton. Tailored with a dropped shoulder silhouette, wide collar ribbing, and pre-shrunk finish for architectural drape across multiple seasons.",
    tags: ["Heavyweight", "280-GSM", "Core-Essential"],
  },
  {
    id: 2,
    title: "Relaxed Linen Button-Down Shirt",
    sku: "AT-SHIRT-024",
    department: "MEN",
    category: "SHIRTS",
    subcategory: "Woven Tops",
    inspectorCategory: "Shirts",
    inspectorSubcategory: "Woven Tops",
    brand: "Atelier Éditions Studio",
    basePrice: 68.0,
    comparePrice: 85.0,
    variantsCount: 6,
    stockUnits: 180,
    maxStock: 300,
    stockLabel: "Good",
    stockTone: "optimal",
    status: "PUBLISHED",
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
    description:
      "Breathable European flax linen button-down washed for soft hand-feel, featuring mother-of-pearl buttons and a relaxed resort collar.",
    tags: ["European-Linen", "Summer-Edit", "Relaxed"],
  },
  {
    id: 3,
    title: "Pleated Chino Pant",
    sku: "AT-PNT-109",
    department: "UNISEX",
    category: "PANTS",
    subcategory: "Bottoms / Trousers",
    inspectorCategory: "Pants",
    inspectorSubcategory: "Bottoms / Trousers",
    brand: "Atelier Éditions Studio",
    basePrice: 88.0,
    comparePrice: 110.0,
    variantsCount: 10,
    stockUnits: 95,
    maxStock: 300,
    stockLabel: "Re-order",
    stockTone: "warning",
    status: "PUBLISHED",
    imageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80",
    description:
      "Double-pleated organic cotton twill trousers cut with a tapered full-length leg and horn button waistband closure.",
    tags: ["Organic-Twill", "Tailored", "Unisex"],
  },
  {
    id: 4,
    title: "Raw Wool Trench Coat",
    sku: "AT-OUT-004",
    department: "WOMEN",
    category: "OUTERWEAR",
    subcategory: "Coats & Jackets",
    inspectorCategory: "Outerwear",
    inspectorSubcategory: "Coats & Jackets",
    brand: "Atelier Éditions Studio",
    basePrice: 240.0,
    comparePrice: 295.0,
    variantsCount: 4,
    stockUnits: 32,
    maxStock: 200,
    stockLabel: "Low Alert",
    stockTone: "danger",
    status: "LIMITED",
    imageUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80",
    description:
      "Unlined double-faced virgin wool trench coat with storm welt pockets, raglan sleeves, and self-tie waist belt.",
    tags: ["Virgin-Wool", "Outerwear", "Limited-Run"],
  },
];

const STATUS_TABS = [
  { key: "ALL", label: "All Products (248)" },
  { key: "PUBLISHED", label: "Published (214)" },
  { key: "DRAFT", label: "Drafts (28)" },
  { key: "ARCHIVED", label: "Archived (6)" },
];

export default function ProductsCatalog() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ANY");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RECENT");
  const [rowSelection, setRowSelection] = useState({});

  // Bulk Actions Menu
  const [bulkAnchor, setBulkAnchor] = useState(null);

  // Right Quick Edit Inspector State (defaults to first product like screenshot)
  const [inspectorProduct, setInspectorProduct] = useState(INITIAL_PRODUCTS[0]);
  const [newTagInput, setNewTagInput] = useState("");

  // Create Product Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("65.00");

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));

        const matchesTab =
          statusTab === "ALL" ||
          (statusTab === "PUBLISHED" &&
            (p.status === "PUBLISHED" || p.status === "LIMITED")) ||
          p.status === statusTab;

        const matchesCat =
          categoryFilter === "ALL" || p.category === categoryFilter;

        const matchesDept =
          deptFilter === "ALL" || p.department.includes(deptFilter);

        const matchesStock =
          stockFilter === "ANY" ||
          (stockFilter === "LOW" && p.stockUnits < 100) ||
          (stockFilter === "OPTIMAL" && p.stockUnits >= 100);

        const matchesPrice =
          priceFilter === "ALL" ||
          (priceFilter === "UNDER_100" && p.basePrice < 100) ||
          (priceFilter === "OVER_100" && p.basePrice >= 100);

        return (
          matchesSearch &&
          matchesTab &&
          matchesCat &&
          matchesDept &&
          matchesStock &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.basePrice - b.basePrice;
        if (sortBy === "PRICE_DESC") return b.basePrice - a.basePrice;
        if (sortBy === "STOCK_ASC") return a.stockUnits - b.stockUnits;
        return a.id - b.id;
      });
  }, [
    products,
    searchQuery,
    statusTab,
    categoryFilter,
    deptFilter,
    stockFilter,
    priceFilter,
    sortBy,
  ]);

  // Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "imageUrl",
        header: "PREVIEW",
        size: 68,
        enableSorting: false,
        Cell: ({ row }) => (
          <Avatar
            variant="rounded"
            src={row.original.imageUrl}
            alt={row.original.title}
            sx={{
              width: 44,
              height: 48,
              borderRadius: 2,
              bgcolor: "#f3f4f6",
            }}
          />
        ),
      },
      {
        accessorKey: "title",
        header: "PRODUCT & SKU",
        size: 235,
        Cell: ({ row }) => {
          const item = row.original;
          return (
            <Box>
              <Typography variant="body2" fontWeight={700} color="#111827">
                {item.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "monospace",
                  fontSize: 10.5,
                  color: "#6b7280",
                  display: "block",
                  mt: 0.2,
                }}
              >
                SKU: {item.sku} •{" "}
                <Box
                  component="span"
                  sx={{ fontFamily: "inherit", fontWeight: 700, color: "#374151" }}
                >
                  {item.department}
                </Box>
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "category",
        header: "TAXONOMY",
        size: 115,
        Cell: ({ row }) => {
          const item = row.original;
          return (
            <Box>
              <Chip
                label={item.category}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 9.5,
                  fontWeight: 700,
                  bgcolor: "#f3f4f6",
                  color: "#374151",
                  mb: 0.4,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                fontSize={11}
              >
                {item.subcategory}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "basePrice",
        header: "BASE PRICE",
        size: 95,
        Cell: ({ row }) => (
          <Typography variant="body2" fontWeight={700} color="#111827">
            ${row.original.basePrice.toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "variantsCount",
        header: "VARIANTS",
        size: 85,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Chip
            label={`${row.original.variantsCount} SKUs`}
            size="small"
            sx={{
              bgcolor: "#f3f4f6",
              color: "#111827",
              fontWeight: 700,
              fontSize: 11,
              height: 28,
              borderRadius: 99,
            }}
          />
        ),
      },
      {
        accessorKey: "stockUnits",
        header: "STOCK LEVEL",
        size: 135,
        Cell: ({ row }) => {
          const item = row.original;
          const pct = Math.min(
            100,
            Math.round((item.stockUnits / item.maxStock) * 100)
          );
          const isAlert =
            item.stockTone === "warning" || item.stockTone === "danger";

          return (
            <Box sx={{ width: 115 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={isAlert ? "#c2410c" : "#111827"}
                  fontSize={11}
                >
                  {item.stockUnits} units
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={isAlert ? "#c2410c" : "text.secondary"}
                  fontSize={10.5}
                >
                  {item.stockLabel}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 4,
                  borderRadius: 99,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: isAlert ? "#c2410c" : "#111827",
                    borderRadius: 99,
                  },
                }}
              />
            </Box>
          );
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        size: 100,
        Cell: ({ row }) => {
          const isLimited = row.original.status === "LIMITED";
          const isDraft = row.original.status === "DRAFT";
          return (
            <Chip
              icon={
                <FiberManualRecord
                  sx={{
                    fontSize: "8px !important",
                    color: isLimited
                      ? "#dc2626 !important"
                      : isDraft
                      ? "#6b7280 !important"
                      : "#16a34a !important",
                  }}
                />
              }
              label={row.original.status}
              size="small"
              sx={{
                height: 22,
                fontSize: 9.5,
                fontWeight: 700,
                bgcolor: isLimited
                  ? "#fef2f2"
                  : isDraft
                  ? "#f3f4f6"
                  : "#f0fdf4",
                color: isLimited
                  ? "#dc2626"
                  : isDraft
                  ? "#4b5563"
                  : "#15803d",
              }}
            />
          );
        },
      },
    ],
    []
  );

  // Material React Table Instance
  const table = useMaterialReactTable({
    columns,
    data: filteredProducts,
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableSorting: true,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 4,
        border: "1px solid #f0f0f0",
        backgroundColor: "#fff",
        overflow: "hidden",
      },
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "#fafafa",
        boxShadow: "none",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: 10,
        fontWeight: 700,
        color: "#6b7280",
        letterSpacing: 0.6,
        py: 1.5,
        borderBottom: "1px solid #f3f4f6",
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = inspectorProduct?.id === row.original.id;
      return {
        onClick: () => setInspectorProduct(row.original),
        sx: {
          cursor: "pointer",
          backgroundColor: isSelected ? "#f9fafb" : "#fff",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
          "& td": {
            borderBottom: "1px solid #f3f4f6",
            py: 1.8,
          },
        },
      };
    },
    renderBottomToolbar: () => (
      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Showing{" "}
          <Box component="strong" color="#111827">
            1 - {filteredProducts.length}
          </Box>{" "}
          of{" "}
          <Box component="strong" color="#111827">
            248 items
          </Box>
        </Typography>

        {/* Styled Pagination Pills matching screenshot */}
        <Stack direction="row" spacing={0.8} alignItems="center">
          <IconButton
            size="small"
            sx={{ border: "1px solid #e5e7eb", width: 28, height: 28 }}
          >
            <KeyboardArrowLeft sx={{ fontSize: 16 }} />
          </IconButton>

          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              size="small"
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: "50%",
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: page === 1 ? "#0a0a0a" : "transparent",
                color: page === 1 ? "#fff" : "#4b5563",
                "&:hover": {
                  backgroundColor: page === 1 ? "#262626" : "#f3f4f6",
                },
              }}
            >
              {page}
            </Button>
          ))}

          <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
            ...
          </Typography>

          <Button
            size="small"
            sx={{
              minWidth: 28,
              height: 28,
              borderRadius: "50%",
              fontSize: 12,
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            62
          </Button>

          <IconButton
            size="small"
            sx={{ border: "1px solid #e5e7eb", width: 28, height: 28 }}
          >
            <KeyboardArrowRight sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Box>
    ),
  });

  // Inspector Tag Handlers
  const handleRemoveTag = (tagToRemove) => {
    if (!inspectorProduct) return;
    setInspectorProduct({
      ...inspectorProduct,
      tags: inspectorProduct.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddTagKeyDown = (e) => {
    if (e.key === "Enter" && newTagInput.trim() && inspectorProduct) {
      e.preventDefault();
      if (!inspectorProduct.tags.includes(newTagInput.trim())) {
        setInspectorProduct({
          ...inspectorProduct,
          tags: [...inspectorProduct.tags, newTagInput.trim()],
        });
      }
      setNewTagInput("");
    }
  };

  // Inspector Save / Draft / Discard Handlers
  const handleSaveInspector = (targetStatus) => {
    if (!inspectorProduct) return;
    const updated = {
      ...inspectorProduct,
      status: targetStatus,
    };
    setInspectorProduct(updated);
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDiscardInspector = () => {
    if (!inspectorProduct) return;
    const original = products.find((p) => p.id === inspectorProduct.id);
    if (original) setInspectorProduct(original);
  };

  // Create Product Handler
  const handleCreateProduct = () => {
    if (!newProdTitle.trim()) return;
    const created = {
      id: Date.now(),
      title: newProdTitle.trim(),
      sku: newProdSku.trim().toUpperCase() || `AT-NEW-${products.length + 1}`,
      department: "UNISEX",
      category: "T-SHIRTS",
      subcategory: "Tops / Basics",
      inspectorCategory: "T-Shirts",
      inspectorSubcategory: "Tops / Heavyweight Tees",
      brand: "Atelier Éditions Studio",
      basePrice: parseFloat(newProdPrice) || 65.0,
      comparePrice: (parseFloat(newProdPrice) || 65.0) + 15,
      variantsCount: 4,
      stockUnits: 120,
      maxStock: 300,
      stockLabel: "Good",
      stockTone: "optimal",
      status: "DRAFT",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
      description: "New studio catalog garment entry.",
      tags: ["New-Arrival"],
    };

    setProducts((prev) => [created, ...prev]);
    setInspectorProduct(created);
    setNewProdTitle("");
    setNewProdSku("");
    setCreateOpen(false);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3.5 },
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Split Layout: Main Catalog Area (Left) + Quick Edit Record Panel (Right) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", xl: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* LEFT COLUMN: Header, KPI Cards, Filter Bar, and Table */}
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          {/* Page Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "flex-end" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#6b7280",
                  display: "block",
                  mb: 0.5,
                }}
              >
                INVENTORY ARCHITECTURE •{" "}
                <Box component="span" sx={{ color: "#c2410c" }}>
                  AUTUMN/WINTER RELEASE
                </Box>
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#111827", letterSpacing: -0.5 }}
              >
                Products Catalog
              </Typography>
            </Box>

            {/* Header Action Buttons */}
            <Stack direction="row" spacing={1.2} flexWrap="wrap">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FileDownloadOutlined fontSize="small" />}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  color: "#111827",
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f3f4f6",
                  fontWeight: 600,
                  px: 2,
                  py: 0.9,
                  "&:hover": { borderColor: "#d1d5db", backgroundColor: "#e5e7eb" },
                }}
              >
                Export CSV
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<TuneOutlined fontSize="small" />}
                endIcon={<KeyboardArrowDown fontSize="small" />}
                onClick={(e) => setBulkAnchor(e.currentTarget)}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  color: "#111827",
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f3f4f6",
                  fontWeight: 600,
                  px: 2,
                  py: 0.9,
                  "&:hover": { borderColor: "#d1d5db", backgroundColor: "#e5e7eb" },
                }}
              >
                Bulk Actions
              </Button>

              <Menu
                anchorEl={bulkAnchor}
                open={Boolean(bulkAnchor)}
                onClose={() => setBulkAnchor(null)}
              >
                <MenuItem onClick={() => setBulkAnchor(null)}>
                  Publish Selected
                </MenuItem>
                <MenuItem onClick={() => setBulkAnchor(null)}>
                  Move to Draft
                </MenuItem>
                <MenuItem onClick={() => setBulkAnchor(null)}>
                  Archive Selected
                </MenuItem>
              </Menu>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateOpen(true)}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontWeight: 600,
                  px: 2.8,
                  py: 0.9,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
                }}
              >
                Create New Product
              </Button>
            </Stack>
          </Box>

          {/* 4 KPI Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            {/* Card 1: Total Catalog */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#6b7280", fontSize: 10 }}
                  >
                    TOTAL CATALOG
                  </Typography>
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#f3f4f6",
                      color: "#374151",
                    }}
                  >
                    <Inventory2Outlined sx={{ fontSize: 14 }} />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight={700} color="#111827" mb={1.5}>
                  248
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                  <TrendingUp sx={{ fontSize: 14, color: "#c2410c" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#c2410c", fontWeight: 700 }}
                  >
                    +14%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Card 2: Active Listed */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#6b7280", fontSize: 10 }}
                  >
                    ACTIVE LISTED
                  </Typography>
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#f3f4f6",
                      color: "#374151",
                    }}
                  >
                    <CheckCircleOutlined sx={{ fontSize: 14 }} />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight={700} color="#111827" mb={1.5}>
                  214
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <FiberManualRecord sx={{ fontSize: 8, color: "#111827" }} />
                  <Typography variant="caption" color="text.secondary">
                    86.2% catalog live
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Card 3: Low Stock Alerts */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#c2410c", fontSize: 10 }}
                  >
                    LOW STOCK ALERTS
                  </Typography>
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#fff7ed",
                      color: "#c2410c",
                    }}
                  >
                    <WarningAmberRounded sx={{ fontSize: 15 }} />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight={700} color="#c2410c" mb={1.2}>
                  12
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#c2410c",
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    Requires
                    <br />
                    replenish
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.2 }}
                  >
                    • &lt;15 units
                    <br />
                    left
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Card 4: Out of Stock */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 4,
                  border: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#6b7280", fontSize: 10 }}
                  >
                    OUT OF STOCK
                  </Typography>
                  <Avatar
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#f3f4f6",
                      color: "#374151",
                    }}
                  >
                    <BlockOutlined sx={{ fontSize: 14 }} />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight={700} color="#111827" mb={1.5}>
                  6
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 pending replenishment
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Search, Status Tabs & Filter Dropdowns Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
            }}
          >
            {/* Row 1: Search + Status Pill Tabs */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                mb: 1.8,
              }}
            >
              <TextField
                size="small"
                placeholder="Filter by SKU (e.g. AT-TEE-001), garment title, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: 260 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12.5,
                    "& fieldset": { border: "none" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 17, color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={0.8} flexWrap="wrap">
                {STATUS_TABS.map((tab) => {
                  const active = statusTab === tab.key;
                  return (
                    <Chip
                      key={tab.key}
                      label={tab.label}
                      size="small"
                      onClick={() => setStatusTab(tab.key)}
                      sx={{
                        borderRadius: 99,
                        fontWeight: 600,
                        fontSize: 11.5,
                        px: 0.6,
                        height: 30,
                        backgroundColor: active ? "#0a0a0a" : "#f3f4f6",
                        color: active ? "#fff" : "#4b5563",
                        "&:hover": {
                          backgroundColor: active ? "#262626" : "#e5e7eb",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>

            {/* Row 2: Dropdown Filters + Sort By */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.2,
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Select
                  size="small"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 32,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="ALL">Category: All</MenuItem>
                  <MenuItem value="T-SHIRTS">Category: T-Shirts</MenuItem>
                  <MenuItem value="SHIRTS">Category: Shirts</MenuItem>
                  <MenuItem value="PANTS">Category: Pants</MenuItem>
                  <MenuItem value="OUTERWEAR">Category: Outerwear</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 32,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="ALL">Department: All</MenuItem>
                  <MenuItem value="MEN">Department: Men</MenuItem>
                  <MenuItem value="WOMEN">Department: Women</MenuItem>
                  <MenuItem value="UNISEX">Department: Unisex</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 32,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="ANY">Stock Status: Any</MenuItem>
                  <MenuItem value="OPTIMAL">Stock: Optimal / Good</MenuItem>
                  <MenuItem value="LOW">Stock: Low / Re-order</MenuItem>
                </Select>

                <Select
                  size="small"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 32,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="ALL">Price: All Ranges</MenuItem>
                  <MenuItem value="UNDER_100">Under $100</MenuItem>
                  <MenuItem value="OVER_100">$100 & Above</MenuItem>
                </Select>
              </Stack>

              {/* Sort By */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: "#6b7280", fontSize: 10 }}
                >
                  SORT BY:
                </Typography>
                <Select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  IconComponent={SwapVert}
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    fontWeight: 600,
                    height: 32,
                    minWidth: 155,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="RECENT">Recently Updated</MenuItem>
                  <MenuItem value="PRICE_ASC">Price: Low to High</MenuItem>
                  <MenuItem value="PRICE_DESC">Price: High to Low</MenuItem>
                  <MenuItem value="STOCK_ASC">Stock: Lowest First</MenuItem>
                </Select>
              </Box>
            </Box>
          </Paper>

          {/* Material React Table */}
          <MaterialReactTable table={table} />
        </Box>

        {/* RIGHT COLUMN: Quick Edit Record Drawer / Panel */}
        {inspectorProduct && (
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", xl: 390 },
              flexShrink: 0,
              p: 3,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              position: { xl: "sticky" },
              top: 24,
            }}
          >
            {/* Inspector Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2.5,
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
                    fontSize: 10,
                  }}
                >
                  QUICK EDIT RECORD
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#111827">
                  {inspectorProduct.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setInspectorProduct(null)}
                sx={{ bgcolor: "#f3f4f6" }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            {/* Media & Technical Assets */}
            <Box sx={{ mb: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="#6b7280"
                  fontSize={10}
                >
                  MEDIA & TECHNICAL ASSETS
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={10}>
                  PNG, JPG, PDF up to 25MB
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                {/* Primary Product Cover Upload Box */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3.5,
                    backgroundColor: "#f3f4f6",
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e5e7eb" },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#e5e7eb",
                      color: "#374151",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <AddPhotoAlternateOutlined fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="#111827"
                    display="block"
                  >
                    Primary Product Cover
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={9.5}
                  >
                    CLICK OR DRAG IMAGE
                  </Typography>
                </Box>

                {/* Size Guide & Tech Spec Upload Box */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3.5,
                    backgroundColor: "#f3f4f6",
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e5e7eb" },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#ffedd5",
                      color: "#c2410c",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <PictureAsPdfOutlined fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="#111827"
                    display="block"
                  >
                    Size Guide & Tech Spec
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={9.5}
                  >
                    UPLOAD .PDF OR DOCUMENT
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* General Information */}
            <Typography
              variant="caption"
              fontWeight={700}
              color="#6b7280"
              fontSize={10}
              display="block"
              mb={1.2}
            >
              GENERAL INFORMATION
            </Typography>

            {/* Product Title */}
            <Box sx={{ mb: 1.8 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="#374151"
                display="block"
                mb={0.5}
              >
                Product Title
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={inspectorProduct.title}
                onChange={(e) =>
                  setInspectorProduct({
                    ...inspectorProduct,
                    title: e.target.value,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12.5,
                    fontWeight: 500,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            {/* SKU + Brand */}
            <Stack direction="row" spacing={1.2} sx={{ mb: 1.8 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  SKU (Stock Keeping Unit)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={inspectorProduct.sku}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      sku: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 99,
                      backgroundColor: "#f3f4f6",
                      fontSize: 12,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  Brand / Capsule Collection
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={inspectorProduct.brand}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      brand: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 99,
                      backgroundColor: "#f3f4f6",
                      fontSize: 12,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Base Price + Compare-at Price */}
            <Stack direction="row" spacing={1.2} sx={{ mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  Base Price ($ USD)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={inspectorProduct.basePrice}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      basePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 99,
                      backgroundColor: "#f3f4f6",
                      fontSize: 12.5,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  Compare-at Price ($ USD)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={inspectorProduct.comparePrice}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      comparePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 99,
                      backgroundColor: "#f3f4f6",
                      fontSize: 12.5,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>
            </Stack>

            {/* Editorial Garment Description with Rich-Text Toolbar */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="#374151"
                display="block"
                mb={0.6}
              >
                Editorial Garment Description
              </Typography>
              <Box
                sx={{
                  borderRadius: 3.5,
                  backgroundColor: "#f3f4f6",
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ px: 1.5, py: 0.8 }}
                >
                  <IconButton size="small">
                    <FormatBold sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton size="small">
                    <FormatItalic sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton size="small">
                    <FormatListBulleted sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton size="small">
                    <LinkIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Stack>
                <Divider />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={inspectorProduct.description}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      description: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "#374151",
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Classification & Tagging */}
            <Typography
              variant="caption"
              fontWeight={700}
              color="#6b7280"
              fontSize={10}
              display="block"
              mb={1.2}
            >
              CLASSIFICATION & TAGGING
            </Typography>

            <Stack direction="row" spacing={1.2} sx={{ mb: 1.8 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  Primary Category
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={inspectorProduct.inspectorCategory}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      inspectorCategory: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="T-Shirts">T-Shirts</MenuItem>
                  <MenuItem value="Shirts">Shirts</MenuItem>
                  <MenuItem value="Pants">Pants</MenuItem>
                  <MenuItem value="Outerwear">Outerwear</MenuItem>
                </Select>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="#374151"
                  display="block"
                  mb={0.5}
                >
                  Subcategory
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={inspectorProduct.inspectorSubcategory}
                  onChange={(e) =>
                    setInspectorProduct({
                      ...inspectorProduct,
                      inspectorSubcategory: e.target.value,
                    })
                  }
                  sx={{
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 12,
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="Tops / Heavyweight Tees">
                    Tops / Heavyweight Tees
                  </MenuItem>
                  <MenuItem value="Woven Tops">Woven Tops</MenuItem>
                  <MenuItem value="Bottoms / Trousers">
                    Bottoms / Trousers
                  </MenuItem>
                  <MenuItem value="Coats & Jackets">Coats & Jackets</MenuItem>
                </Select>
              </Box>
            </Stack>

            {/* Tags & Keywords Chip Box */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                color="#374151"
                display="block"
                mb={0.6}
              >
                Tags & Keywords
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 99,
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 0.6,
                }}
              >
                {inspectorProduct.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 600,
                      bgcolor: "#e5e7eb",
                      color: "#111827",
                    }}
                  />
                ))}
                <TextField
                  variant="standard"
                  placeholder="+ Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTagKeyDown}
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: 11.5, width: 75, pl: 0.5 },
                  }}
                />
              </Box>
            </Box>

            {/* Footer Action Buttons */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Button
                size="small"
                onClick={handleDiscardInspector}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: 11.5,
                  px: 1.8,
                  py: 0.9,
                  "&:hover": { backgroundColor: "#e5e7eb" },
                }}
              >
                Discard Changes
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => handleSaveInspector("DRAFT")}
                  sx={{
                    borderRadius: 99,
                    textTransform: "none",
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: 11.5,
                    px: 1.8,
                    py: 0.9,
                    "&:hover": { backgroundColor: "#e5e7eb" },
                  }}
                >
                  Save as Draft
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleSaveInspector("PUBLISHED")}
                  sx={{
                    borderRadius: 99,
                    textTransform: "none",
                    backgroundColor: "#0a0a0a",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 11.5,
                    px: 2.2,
                    py: 0.9,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
                  }}
                >
                  Save & Publish
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Create New Product Modal */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Product Title"
              fullWidth
              size="small"
              placeholder="e.g. Heavyweight Boxy Hoodie"
              value={newProdTitle}
              onChange={(e) => setNewProdTitle(e.target.value)}
            />
            <TextField
              label="SKU (optional)"
              fullWidth
              size="small"
              placeholder="e.g. AT-HDY-012"
              value={newProdSku}
              onChange={(e) => setNewProdSku(e.target.value)}
            />
            <TextField
              label="Base Price ($ USD)"
              fullWidth
              size="small"
              type="number"
              value={newProdPrice}
              onChange={(e) => setNewProdPrice(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setCreateOpen(false)}
            sx={{ textTransform: "none", color: "#6b7280" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateProduct}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              backgroundColor: "#0a0a0a",
              "&:hover": { backgroundColor: "#262626" },
            }}
          >
            Create Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}