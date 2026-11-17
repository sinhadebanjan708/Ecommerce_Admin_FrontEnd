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
  Checkbox,
  Avatar,
  Switch,
  IconButton,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  SwapVert,
  FileDownloadOutlined,
  Add,
  Search,
  FolderOutlined,
  AccountTreeOutlined,
  CheckroomOutlined,
  CollectionsOutlined,
  CheckCircleOutlined,
  FiberManualRecord,
  DragHandle,
  ArrowForward,
  ImageOutlined,
  WarningAmberRounded,
  EditOutlined,
  ArchiveOutlined,
  Close,
  CloudUploadOutlined,
  HideImageOutlined,
} from "@mui/icons-material";
import * as actions from "../store/actions";
import { useSelector, useDispatch } from "react-redux";

const INITIAL_CATEGORIES = [
  {
    id: 1,
    title: "T-Shirts",
    slug: "t-shirts",
    departments: ["MEN", "WOMEN", "UNISEX"],
    subcategoriesCount: 4,
    liveSkus: 54,
    hasBanner: true,
    bannerDimensions: "1200×400",
    bannerUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    liveStatus: true,
    isDraft: false,
  },
  {
    id: 2,
    title: "Shirts & Blouses",
    slug: "shirts",
    departments: ["MEN", "WOMEN"],
    subcategoriesCount: 3,
    liveSkus: 42,
    hasBanner: true,
    bannerDimensions: "1200×400",
    bannerUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    liveStatus: true,
    isDraft: false,
  },
  {
    id: 3,
    title: "Trousers & Slacks",
    slug: "trousers",
    departments: ["MEN", "WOMEN", "UNISEX"],
    subcategoriesCount: 3,
    liveSkus: 61,
    hasBanner: true,
    bannerDimensions: "1200×400",
    bannerUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    liveStatus: true,
    isDraft: false,
  },
  {
    id: 4,
    title: "Outerwear & Coats",
    slug: "outerwear",
    departments: ["WOMEN", "UNISEX"],
    subcategoriesCount: 4,
    liveSkus: 38,
    hasBanner: true,
    bannerDimensions: "1200×400",
    bannerUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
    liveStatus: true,
    isDraft: false,
  },
  {
    id: 5,
    title: "Knitwear",
    slug: "knitwear",
    departments: ["WOMEN", "MEN"],
    subcategoriesCount: 2,
    liveSkus: 29,
    hasBanner: true,
    bannerDimensions: "1200×400",
    bannerUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    liveStatus: true,
    isDraft: false,
  },
  {
    id: 6,
    title: "Accessories & Leather",
    slug: "accessories",
    departments: ["UNISEX"],
    subcategoriesCount: 2,
    liveSkus: 24,
    hasBanner: false,
    bannerDimensions: "",
    bannerUrl: "",
    liveStatus: false,
    isDraft: true,
  },
];

const ALL_DEPARTMENTS = ["All", "Women", "Men", "Unisex"];

const getDeptBadgeStyle = (dept) => {
  switch (dept) {
    case "MEN":
      return { bgcolor: "#eff6ff", color: "#2563eb" };
    case "WOMEN":
      return { bgcolor: "#f3f4f6", color: "#4b5563" };
    case "UNISEX":
      return { bgcolor: "#fff1f2", color: "#e11d48" };
    default:
      return { bgcolor: "#f3f4f6", color: "#374151" };
  }
};

const mapCategoryData = (category) => ({
  id: category.id,

  // API field -> UI field
  title: category.category_name,

  slug: category.slug,
  description: category.description,

  image: category.image,

  // Convert API status string into boolean
  status: category.status?.toLowerCase() === "active",

  isDraft: category.status?.toLowerCase() === "draft",

  // Actual subcategory records from API
  subcategories: category.subcategories || [],

  subcategoriesCount: category.subcategories?.length || 0,

  // These fields are not currently returned by your API
  departments: [],

  bannerUrl: category.image || "",
  hasBanner: Boolean(category.image),

  liveSkus: 0,
});

export default function Category() {
    const dispatch =useDispatch();
  const categoryList = useSelector((state)=> state.category.categoryList)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rowSelection, setRowSelection] = useState({});

  // Curator Inspector state
  const [inspectorCategory, setInspectorCategory] = useState(
    INITIAL_CATEGORIES[0]
  );

  // Create Category Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");

React.useEffect(() => {
  dispatch(actions.fetchAllCategoris());
}, [dispatch]);

React.useEffect(() => {
  if (categoryList && categoryList.length > 0) {
    const mappedCategories = categoryList.map(mapCategoryData);

    setCategories(mappedCategories);

    // Set the first API category as the selected category
    setInspectorCategory(mappedCategories[0]);
  }
}, [categoryList]);

  console.log('categoryList',categoryList)

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(cat.id).includes(searchQuery);

      const matchesDept =
        selectedDept === "All" ||
        cat.departments.includes(selectedDept.toUpperCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "LIVE" && cat.liveStatus) ||
        (statusFilter === "DRAFT" && !cat.liveStatus);

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [categories, searchQuery, selectedDept, statusFilter]);

  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, liveStatus: !cat.liveStatus } : cat
      )
    );
  };

  // Material React Table Columns
  const columns = useMemo(
    () => [
      {
        id: "drag",
        header: "",
        size: 36,
        enableSorting: false,
        enableColumnActions: false,
        Cell: () => <DragHandle sx={{ fontSize: 18, color: "#9ca3af" }} />,
      },
      {
        accessorKey: "image",
        header: "VISUAL",
        size: 70,
        enableSorting: false,
        Cell: ({ row }) => {
          const cat = row.original;
          return cat.image ? (
            <Avatar
              src={`http://localhost:8080/${cat.image}`}
              alt={cat.title}
              sx={{ width: 46, height: 46 }}
            />
          ) : (
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: "#f3f4f6",
                color: "#9ca3af",
              }}
            >
              <HideImageOutlined fontSize="small" />
            </Avatar>
          );
        },
      },
      {
        accessorKey: "category_name",
        header: "CATEGORY",
        size: 185,
        Cell: ({ row }) => {
          const cat = row.original;
          return (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="#111827">
                  {cat.title}
                </Typography>
                {cat.isDraft && (
                  <Chip
                    label="DRAFT"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: "#f3f4f6",
                      color: "#4b5563",
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        },
      },
    //   {
    //     accessorKey: "departments",
    //     header: "DEPARTMENTS",
    //     size: 115,
    //     enableSorting: false,
    //     Cell: ({ row }) => (
    //       <Stack spacing={0.5} alignItems="flex-start">
    //         {/* {row.original.departments.map((dept) => {
    //           const style = getDeptBadgeStyle(dept);
    //           return (
    //             <Chip
    //               key={dept}
    //               label={dept}
    //               size="small"
    //               sx={{
    //                 height: 18,
    //                 fontSize: 9.5,
    //                 fontWeight: 700,
    //                 bgcolor: style.bgcolor,
    //                 color: style.color,
    //               }}
    //             />
    //           );
    //         })} */}
    //       </Stack>
    //     ),
    //   },
      {
        accessorKey: "subcategories",
        header: "SUBCATEGORIES",
        size: 150,
        
        Cell: ({ row }) => (
            <Chip
            label={`Subcategories (${row.original.subcategories?.length || 0})`}
            deleteIcon={<ArrowForward sx={{ fontSize: 14 }} />}
            onDelete={(e) => e.stopPropagation()}
            size="small"
            sx={{
                bgcolor: "#f3f4f6",
                color: "#111827",
                fontWeight: 600,
                fontSize: 11.5,
                borderRadius: 99,
                height: 30,
            }}
            />
            
        ),
      },
    //   {
    //     accessorKey: "liveSkus",
    //     header: "LIVE SKUS",
    //     size: 85,
    //     muiTableHeadCellProps: { align: "center" },
    //     muiTableBodyCellProps: { align: "center" },
    //     Cell: ({ row }) => (
    //       <Typography variant="body2" fontWeight={700} color="#111827">
    //         {row.original.liveSkus}
    //       </Typography>
    //     ),
    //   },
      {
        accessorKey: "image",
        header: "LOOKBOOK HERO",
        size: 120,
        Cell: ({ row }) => {
          const cat = row.original;
          return cat.image ? (
            <Chip
              icon={
                <ImageOutlined
                  sx={{
                    fontSize: "14px !important",
                    color: "#c2410c !important",
                  }}
                />
              }
              label={"Category_image"}
              size="small"
              sx={{
                bgcolor: "#fff7ed",
                color: "#9a3412",
                fontWeight: 600,
                fontSize: 11,
                borderRadius: 1.5,
              }}
            />
          ) : (
            <Chip
              icon={
                <WarningAmberRounded
                  sx={{
                    fontSize: "14px !important",
                    color: "#dc2626 !important",
                  }}
                />
              }
              label="Missing"
              size="small"
              sx={{
                bgcolor: "#fef2f2",
                color: "#dc2626",
                fontWeight: 600,
                fontSize: 11,
                borderRadius: 1.5,
              }}
            />
          );
        },
      },
      {
        accessorKey: "status",
        header: "LIVE STATUS",
        size: 95,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Box onClick={(e) => e.stopPropagation()}>
            <Switch
              size="small"
              checked={row.original.status}
              onChange={() => handleToggleStatus(row.original.id)}
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
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        size: 85,
        enableSorting: false,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => (
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="flex-end"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => setInspectorCategory(row.original)}
            >
              <EditOutlined sx={{ fontSize: 17, color: "#4b5563" }} />
            </IconButton>
            <IconButton size="small">
              <ArchiveOutlined sx={{ fontSize: 17, color: "#4b5563" }} />
            </IconButton>
          </Stack>
        ),
      },
    ],
    []
  );

  // Material React Table Instance
  const table = useMaterialReactTable({
    columns,
    data: filteredCategories,
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableSorting: true,
    enableBottomToolbar: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
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
        letterSpacing: 0.5,
        py: 1.4,
        borderBottom: "1px solid #f3f4f6",
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = inspectorCategory?.id === row.original.id;
      return {
        onClick: () => setInspectorCategory(row.original),
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
    renderTopToolbar: ({ table }) => (
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox
            size="small"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "#6b7280", letterSpacing: 0.5 }}
          >
            {filteredCategories.length} CATEGORIES LOADED
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          Sorted by Display Order
        </Typography>
      </Box>
    ),
    renderBottomToolbar: ({ table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageCount = Math.max(1, table.getPageCount());
      return (
        <Box
          sx={{
            px: 2.5,
            py: 1.8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {filteredCategories.length} of {categories.length} Root
            Taxonomies
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {pageCount > 1 && (
              <Stack direction="row" spacing={0.5}>
                <Button
                  size="small"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  sx={{ minWidth: 0, textTransform: "none", fontSize: 12 }}
                >
                  Prev
                </Button>
                <Button
                  size="small"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  sx={{ minWidth: 0, textTransform: "none", fontSize: 12 }}
                >
                  Next
                </Button>
              </Stack>
            )}
            <Typography variant="caption" color="text.secondary">
              <Box component="strong" color="#111827">
                {pageIndex + 1}
              </Box>{" "}
              of {pageCount} Page
            </Typography>
          </Stack>
        </Box>
      );
    },
  });

  // Inspector Handlers
  const handleInspectorDeptToggle = (dept) => {
    if (!inspectorCategory) return;
    const upper = dept.toUpperCase();
    const exists = inspectorCategory.departments.includes(upper);
    const updatedDepts = exists
      ? inspectorCategory.departments.filter((d) => d !== upper)
      : [...inspectorCategory.departments, upper];

    setInspectorCategory({
      ...inspectorCategory,
      departments: updatedDepts,
    });
  };

  const handleSaveInspector = () => {
    if (!inspectorCategory) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === inspectorCategory.id ? inspectorCategory : cat
      )
    );
  };

  const handleDiscardInspector = () => {
    if (!inspectorCategory) return;
    const original = categories.find((c) => c.id === inspectorCategory.id);
    if (original) setInspectorCategory(original);
  };

  // Create Category Handler
  const handleCreateCategory = () => {
    if (!newCategoryTitle.trim()) return;
    const slug =
      newCategorySlug.trim() ||
      newCategoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newCat = {
      id: Date.now(),
      title: newCategoryTitle.trim(),
      slug,
      departments: ["UNISEX"],
      subcategoriesCount: 0,
      liveSkus: 0,
      hasBanner: false,
      bannerDimensions: "",
      bannerUrl: "",
      liveStatus: false,
      isDraft: true,
    };

    setCategories((prev) => [...prev, newCat]);
    setInspectorCategory(newCat);
    setNewCategoryTitle("");
    setNewCategorySlug("");
    setCreateOpen(false);
  };

  const totalLiveSkus = categories.reduce((sum, c) => sum + c.liveSkus, 0);
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + c.subcategoriesCount,
    0
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3.5 },
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-start" },
          gap: 2,
          mb: 3.5,
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
            TAXONOMY ENGINE •{" "}
            <Box component="span" sx={{ color: "#c2410c" }}>
              TIER 1 HIERARCHY
            </Box>
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#111827", letterSpacing: -0.5 }}
          >
            Categories
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", mt: 0.5, maxWidth: 460 }}
          >
            Curate top-level department architecture, lookbook banners, and
            index visibility across global digital storefronts.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack
          direction="column"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={1.2}
        >
          <Stack direction="row" spacing={1.2}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SwapVert fontSize="small" />}
              sx={{
                borderRadius: 99,
                textTransform: "none",
                color: "#374151",
                borderColor: "#e5e7eb",
                backgroundColor: "#f3f4f6",
                fontWeight: 600,
                px: 2,
                "&:hover": { borderColor: "#d1d5db", backgroundColor: "#e5e7eb" },
              }}
            >
              Reorder Structure
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadOutlined fontSize="small" />}
              sx={{
                borderRadius: 99,
                textTransform: "none",
                color: "#374151",
                borderColor: "#e5e7eb",
                backgroundColor: "#f3f4f6",
                fontWeight: 600,
                px: 2,
                "&:hover": { borderColor: "#d1d5db", backgroundColor: "#e5e7eb" },
              }}
            >
              Export CSV
            </Button>
          </Stack>

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
              px: 3,
              py: 1,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
            }}
          >
            Create Category
          </Button>
        </Stack>
      </Box>

      {/* KPI Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#6b7280", letterSpacing: 0.6 }}
              >
                ROOT TAXONS
              </Typography>
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: "#f3f4f6", color: "#374151" }}
              >
                <FolderOutlined sx={{ fontSize: 16 }} />
              </Avatar>
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="#111827">
                {String(categories.length).padStart(2, "0")}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Published Active
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <CheckCircleOutlined sx={{ fontSize: 15, color: "#c2410c" }} />
              <Typography variant="caption" color="text.secondary">
                100% routing synced to CDN
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#6b7280", letterSpacing: 0.6 }}
              >
                SUBCATEGORIES LINKED
              </Typography>
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: "#f3f4f6", color: "#374151" }}
              >
                <AccountTreeOutlined sx={{ fontSize: 16 }} />
              </Avatar>
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="#111827">
                {totalSubcategories}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#c2410c", fontWeight: 600 }}
              >
                3 Avg. / Taxon
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              All sub-tiers mapped cleanly
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#6b7280", letterSpacing: 0.6 }}
              >
                APPAREL INVENTORY
              </Typography>
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: "#f3f4f6", color: "#374151" }}
              >
                <CheckroomOutlined sx={{ fontSize: 16 }} />
              </Avatar>
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#111827">
                {totalLiveSkus}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Live SKUs
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={78}
              sx={{
                height: 5,
                borderRadius: 99,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#111827",
                  borderRadius: 99,
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#6b7280", letterSpacing: 0.6 }}
              >
                CURATED STORIES
              </Typography>
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: "#f3f4f6", color: "#374151" }}
              >
                <CollectionsOutlined sx={{ fontSize: 16 }} />
              </Avatar>
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="#111827">
                04
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#c2410c", fontWeight: 600 }}
              >
                SS25 Editorial
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
              <FiberManualRecord sx={{ fontSize: 10, color: "#c2410c" }} />
              <Typography variant="caption" color="text.secondary">
                Winter drop archived
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter & Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 4,
          border: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search category by title, slug or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: { xs: "100%", sm: 310 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 99,
              backgroundColor: "#f3f4f6",
              fontSize: 13,
              "& fieldset": { border: "none" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "#6b7280", mr: 0.5 }}
          >
            DEPARTMENT:
          </Typography>
          {ALL_DEPARTMENTS.map((dept) => {
            const active = selectedDept === dept;
            return (
              <Chip
                key={dept}
                label={dept}
                size="small"
                onClick={() => setSelectedDept(dept)}
                sx={{
                  fontWeight: 600,
                  fontSize: 12,
                  borderRadius: 99,
                  px: 0.8,
                  backgroundColor: active ? "#0a0a0a" : "#f3f4f6",
                  color: active ? "#fff" : "#4b5563",
                  "&:hover": {
                    backgroundColor: active ? "#262626" : "#e5e7eb",
                  },
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#6b7280" }}>
            STATUS:
          </Typography>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              borderRadius: 99,
              backgroundColor: "#f3f4f6",
              fontSize: 13,
              fontWeight: 600,
              minWidth: 130,
              "& fieldset": { border: "none" },
            }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="LIVE">Live Only</MenuItem>
            <MenuItem value="DRAFT">Draft Only</MenuItem>
          </Select>
        </Box>
      </Paper>

      {/* Main Content Split: Material React Table (Left) + Curator Inspector (Right) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <MaterialReactTable table={table} />
        </Box>

        {/* Right Curator Inspector Panel */}
        {inspectorCategory && (
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", lg: 360 },
              flexShrink: 0,
              p: 3,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              position: { lg: "sticky" },
              top: 24,
            }}
          >
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
                  }}
                >
                  CURATOR INSPECTOR
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#111827">
                  {inspectorCategory.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setInspectorCategory(null)}
                sx={{ bgcolor: "#f3f4f6" }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ mb: 2.2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#374151"
                display="block"
                mb={0.7}
              >
                Category Title
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={inspectorCategory.title}
                onChange={(e) =>
                  setInspectorCategory({
                    ...inspectorCategory,
                    title: e.target.value,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 13,
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2.2 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#374151"
                display="block"
                mb={0.7}
              >
                Storefront Permalink Slug
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={inspectorCategory.slug}
                onChange={(e) =>
                  setInspectorCategory({
                    ...inspectorCategory,
                    slug: e.target.value,
                  })
                }
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
                    borderRadius: 99,
                    backgroundColor: "#f3f4f6",
                    fontSize: 13,
                    fontFamily: "monospace",
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#374151"
                display="block"
                mb={0.8}
              >
                Assigned Departments
              </Typography>
              <Stack direction="row" spacing={1}>
                {["Women", "Men", "Unisex"].map((dept) => {
                  const checked = inspectorCategory.departments.includes(
                    dept.toUpperCase()
                  );
                  return (
                    <Box
                      key={dept}
                      onClick={() => handleInspectorDeptToggle(dept)}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.2,
                        py: 0.7,
                        borderRadius: 99,
                        backgroundColor: "#f3f4f6",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={checked}
                        sx={{
                          p: 0,
                          color: "#9ca3af",
                          "&.Mui-checked": { color: "#0a0a0a" },
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {dept}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="caption" fontWeight={700} color="#374151">
                  Category Hero Banner
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={10}>
                  1200X400 • PNG/WEBP
                </Typography>
              </Box>

              {inspectorCategory.bannerUrl && (
                <Box
                  component="img"
                  src={inspectorCategory.bannerUrl}
                  alt="Hero preview"
                  sx={{
                    width: "100%",
                    height: 115,
                    objectFit: "cover",
                    borderRadius: 5,
                    mb: 1.2,
                    display: "block",
                  }}
                />
              )}

              <Box
                sx={{
                  border: "1.5px dashed #d1d5db",
                  borderRadius: 5,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fafafa",
                  "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f3f4f6" },
                }}
              >
                <CloudUploadOutlined
                  sx={{ fontSize: 20, color: "#6b7280", mb: 0.3 }}
                />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  display="block"
                  color="#374151"
                >
                  Click or drag new banner asset here
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={10}>
                  MAX 5MB • OPTIMIZED WEBP RECOMMENDED
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                onClick={handleDiscardInspector}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  fontWeight: 600,
                  py: 1,
                  "&:hover": { backgroundColor: "#e5e7eb" },
                }}
              >
                Discard
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSaveInspector}
                sx={{
                  borderRadius: 99,
                  textTransform: "none",
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  fontWeight: 600,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
                }}
              >
                Save Category
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Create Category Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Category Title"
              fullWidth
              size="small"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
            />
            <TextField
              label="Permalink Slug (optional)"
              fullWidth
              size="small"
              placeholder="e.g. footwear"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
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
            onClick={handleCreateCategory}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              backgroundColor: "#0a0a0a",
              "&:hover": { backgroundColor: "#262626" },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}