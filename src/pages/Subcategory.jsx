import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  Switch,
  IconButton,
  Stack,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
    FormControl,
  InputLabel,
  Select

} from "@mui/material";
import {
  ArrowBack,
  KeyboardArrowDown,
  SwapVert,
  Add,
  CheckroomOutlined,
  TuneOutlined,
  OpenInNew,
  Search,
  FilterList,
  DragIndicator,
  ImageOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoOutlined,
  Close,
  LockOutlined,
  CloudUploadOutlined,
  ExpandMore,
  Check,
} from "@mui/icons-material";
import { useDispatch,useSelector } from "react-redux";
import * as actions from "../store/actions"
import CreateSubCategory from "./CreateSubCategory";

const ROOT_CATEGORIES_DATA = [
  {
    id: 1,
    title: "T-Shirts",
    slug: "t-shirts",
    deptCode: "04",
    departmentsLabel: "Women, Men Collections",
    skuPrefix: "TSH-",
    subcategories: [
      {
        id: 101,
        rank: 1,
        name: "Oversized",
        slug: "/t-shirts/oversized",
        skuCode: "TSH-OVR",
        itemsCount: 68,
        status: true,
        isFeatured: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80",
        tagline:
          "Boxy drape & heavyweight architectural cuts with dropped shoulders.",
        seoTitle: "Oversized Luxury T-Shirts | Atelier Studio",
        seoDescription: "Explore heavyweight boxy drape oversized tees.",
      },
      {
        id: 102,
        rank: 2,
        name: "Crewneck",
        slug: "/t-shirts/crewneck",
        skuCode: "TSH-CRW",
        itemsCount: 54,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
        tagline: "Everyday combed organic cotton essentials with ribbed collars.",
        seoTitle: "Crewneck Essentials | Atelier Studio",
        seoDescription: "Refined organic cotton crewneck tees.",
      },
      {
        id: 103,
        rank: 3,
        name: "Graphic",
        slug: "/t-shirts/graphic",
        skuCode: "TSH-GRP",
        itemsCount: 39,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        tagline: "Seasonal studio screenprints and archival editorial typography.",
        seoTitle: "Graphic Editorial Tees | Atelier Studio",
        seoDescription: "Limited run screenprinted studio graphics.",
      },
      {
        id: 104,
        rank: 4,
        name: "Polo",
        slug: "/t-shirts/polo",
        skuCode: "TSH-PLO",
        itemsCount: 23,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=400&q=80",
        tagline: "Structured pique knit collars with concealed placket closures.",
        seoTitle: "Knit & Pique Polos | Atelier Studio",
        seoDescription: "Tailored knit polos for modern layering.",
      },
    ],
  },
  {
    id: 2,
    title: "Shirts & Blouses",
    slug: "shirts",
    deptCode: "02",
    departmentsLabel: "Men, Women Collections",
    skuPrefix: "SHT-",
    subcategories: [
      {
        id: 201,
        rank: 1,
        name: "Oxford Button-Down",
        slug: "/shirts/oxford-button-down",
        skuCode: "SHT-OXF",
        itemsCount: 19,
        status: true,
        isFeatured: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
        tagline: "Crisp Italian cotton poplin and brushed Oxford weaves.",
        seoTitle: "Oxford Button-Down Shirts | Atelier Studio",
        seoDescription: "Tailored Oxford shirts.",
      },
      {
        id: 202,
        rank: 2,
        name: "Silk & Satin Blouses",
        slug: "/shirts/silk-blouses",
        skuCode: "SHT-SLK",
        itemsCount: 14,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=400&q=80",
        tagline: "Fluid mulberry silk silhouettes with French cuffs.",
        seoTitle: "Silk Blouses | Atelier Studio",
        seoDescription: "Luxury mulberry silk blouses.",
      },
      {
        id: 203,
        rank: 3,
        name: "Resort Camp Collar",
        slug: "/shirts/camp-collar",
        skuCode: "SHT-CMP",
        itemsCount: 9,
        status: false,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
        tagline: "Relaxed short-sleeve linen blends for warm-weather edits.",
        seoTitle: "Resort Camp Collar Shirts | Atelier Studio",
        seoDescription: "Relaxed linen camp collar shirts.",
      },
    ],
  },
  {
    id: 3,
    title: "Trousers & Slacks",
    slug: "trousers",
    deptCode: "03",
    departmentsLabel: "Men, Women, Unisex Collections",
    skuPrefix: "TRS-",
    subcategories: [
      {
        id: 301,
        rank: 1,
        name: "Pleated Tailored",
        slug: "/trousers/pleated-tailored",
        skuCode: "TRS-PLT",
        itemsCount: 28,
        status: true,
        isFeatured: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80",
        tagline: "Double-pleated virgin wool trousers with wide leg drape.",
        seoTitle: "Pleated Tailored Trousers | Atelier Studio",
        seoDescription: "Virgin wool pleated trousers.",
      },
      {
        id: 302,
        rank: 2,
        name: "Utility & Cargo",
        slug: "/trousers/utility-cargo",
        skuCode: "TRS-CRG",
        itemsCount: 21,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=400&q=80",
        tagline: "Technical ripstop cotton trousers with articulated knees.",
        seoTitle: "Utility & Cargo Trousers | Atelier Studio",
        seoDescription: "Technical cotton cargo trousers.",
      },
    ],
  },
  {
    id: 4,
    title: "Outerwear & Coats",
    slug: "outerwear",
    deptCode: "01",
    departmentsLabel: "Women, Unisex Collections",
    skuPrefix: "OUT-",
    subcategories: [
      {
        id: 401,
        rank: 1,
        name: "Wool Overcoats",
        slug: "/outerwear/wool-overcoats",
        skuCode: "OUT-WOL",
        itemsCount: 22,
        status: true,
        isFeatured: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80",
        tagline: "Double-faced cashmere and melton wool full-length coats.",
        seoTitle: "Wool Overcoats | Atelier Studio",
        seoDescription: "Full-length cashmere and wool coats.",
      },
      {
        id: 402,
        rank: 2,
        name: "Trench & Rainwear",
        slug: "/outerwear/trench-rainwear",
        skuCode: "OUT-TRN",
        itemsCount: 16,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
        tagline: "Water-repellent bonded gabardine trenches with storm flaps.",
        seoTitle: "Trench & Rainwear | Atelier Studio",
        seoDescription: "Bonded gabardine trench coats.",
      },
    ],
  },
  {
    id: 5,
    title: "Knitwear",
    slug: "knitwear",
    deptCode: "05",
    departmentsLabel: "Women, Men Collections",
    skuPrefix: "KNT-",
    subcategories: [
      {
        id: 501,
        rank: 1,
        name: "Merino Crewnecks",
        slug: "/knitwear/merino-crewnecks",
        skuCode: "KNT-MRN",
        itemsCount: 18,
        status: true,
        isFeatured: true,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80",
        tagline: "Fine-gauge 14gg extra-fine Australian merino sweaters.",
        seoTitle: "Merino Crewnecks | Atelier Studio",
        seoDescription: "Extra-fine merino wool knitwear.",
      },
      {
        id: 502,
        rank: 2,
        name: "Chunky Cardigans",
        slug: "/knitwear/chunky-cardigans",
        skuCode: "KNT-CRD",
        itemsCount: 11,
        status: true,
        isFeatured: false,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
        inspectorPreviewUrl:
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
        tagline: "Ribbed fisherman-knit cardigans with horn buttons.",
        seoTitle: "Chunky Cardigans | Atelier Studio",
        seoDescription: "Ribbed fisherman-knit cardigans.",
      },
    ],
  },
];

export default function Subcategories() {
    const categoryList = useSelector(
      (state) => state.category.categoryList
    );
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subcategoryList = useSelector((state)=> state.subcategory.subcategoryList)
    const totalRecords = useSelector((state)=> state.subcategory.totalRecords)
  // Store all categories in state so edits persist when switching categories in the dropdown
  const [allCategories, setAllCategories] = useState(ROOT_CATEGORIES_DATA);
  const [inspectorsubCategory, setInspectorSubCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 5,
    });
const [rowSelection, setRowSelection] = useState({});
  // Header Category Dropdown Menu Anchor
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const categoryMenuOpen = Boolean(categoryMenuAnchor);
    const [search, setSearch] = React.useState("");
const [debouncedSearch, setDebouncedSearch] = React.useState("");
const [searchQuery, setSearchQuery] = useState("");

const [statusTab, setStatusTab] = useState("ALL"); // ALL | ACTIVE | DRAFT
const [sortAsc, setSortAsc] = useState(true);

// Right Inspector State
// const [inspectorsubCategory, setInspectorItem] = useState(
//   ROOT_CATEGORIES_DATA[0].subcategories[0]
// );

// Add New Subcategory Modal State
const [addOpen, setAddOpen] = useState(false);
const [newName, setNewName] = useState("");
const [newSku, setNewSku] = useState("");
const [newTagline, setNewTagline] = useState("");


React.useEffect(()=>{
  dispatch(actions.fetchAllCategoris())
},[dispatch])

  React.useEffect(()=>{
      dispatch(actions.fetchAllSubCategoris(pagination?.pageIndex,pagination?.pageSize,debouncedSearch))
},[dispatch, pagination?.pageIndex,pagination?.pageSize,debouncedSearch])


  React.useEffect(() => {
    if(subcategoryList && subcategoryList.length > 0){
      setInspectorSubCategory(subcategoryList[0])
    }
  }, [subcategoryList])
  
  const currentCategory = useMemo(() => {
    if (!Array.isArray(categoryList) || categoryList.length === 0) {
      return null;
    }
    
    return (
      categoryList.find(
        (category) => category.id === inspectorsubCategory?.categoryId
      ) ?? categoryList[0]
    );
  }, [categoryList, inspectorsubCategory?.categoryId]);


  console.log('subcategoryList__123',currentCategory )

  // const subcategories = currentCategory.subcategories;


  // Switch Root Category from Dropdown
  const handleSelectCategory = (cat) => {
    console.log('changa__',cat)
    setSelectedCategoryId(cat.id);
    // setInspectorItem(cat.subcategories[0] || null);
    dispatch(actions.fetchSubCategoryByCategoryId(cat.id))
    setSearchQuery("");
    setStatusTab("ALL");
    setCategoryMenuAnchor(null);
  };

  // Helper to update current category's subcategories list
  const updateCurrentSubcategories = (updaterFn) => {
    setAllCategories((prev) =>
      prev.map((cat) =>
        cat.id === inspectorsubCategory.id
          ? { ...cat, subcategories: updaterFn(cat.subcategories) }
          : cat
      )
    );
  };

  // Counts for Filter Tabs
  // const activeCount = subcategories.filter((s) => s.status).length;
  // const draftCount = subcategories.filter((s) => !s.status).length;
  // const totalProducts = subcategories.reduce((sum, s) => sum + s.itemsCount, 0);
  const subcategories = Array.isArray(subcategoryList)
  ? subcategoryList
  : [];

const activeCount = subcategories.filter(
  (s) => s.status === "active" || s.status === true
).length;

const draftCount = subcategories.filter(
  (s) => s.status === "draft" || s.status === false
).length;

const totalProducts = subcategories.reduce(
  (sum, s) => sum + (Number(s.productCount) || 0),
  0
);

  // Filtered & Ranked Data
  React.useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 500);

  return () => clearTimeout(timer);
}, [search]);
  // const filteredSubcategories = useMemo(() => {
  //   return subcategories
  //     .filter((item) => {
  //       const q = searchQuery.toLowerCase();
  //       const matchesSearch =
  //         item.name.toLowerCase().includes(q) ||
  //         item.slug.toLowerCase().includes(q) ||
  //         item.skuCode.toLowerCase().includes(q);

  //       const matchesTab =
  //         statusTab === "ALL" ||
  //         (statusTab === "ACTIVE" && item.status) ||
  //         (statusTab === "DRAFT" && !item.status);

  //       return matchesSearch && matchesTab;
  //     })
  //     .sort((a, b) => (sortAsc ? a.rank - b.rank : b.rank - a.rank));
  // }, [subcategories, searchQuery, statusTab, sortAsc]);

  const handleToggleStatus = (id) => {
    updateCurrentSubcategories((list) =>
      list.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleDeleteSubcategory = (id) => {
    updateCurrentSubcategories((list) => list.filter((item) => item.id !== id));
    if (inspectorsubCategory?.id === id) {
      setInspectorItem(null);
    }
  };

  const imageInputRef = useRef(null);

const handleSubcategoryImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size cannot exceed 5MB.");
    e.target.value = "";
    return;
  }

  const previewUrl = URL.createObjectURL(file);

  setInspectorSubCategory((prev) => ({
    ...prev,
    imageFile: file,
    image : file,
    inspectorPreviewUrl: previewUrl,
  }));
};

  // Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "RANK",
        size: 70,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <DragIndicator sx={{ fontSize: 16, color: "#9ca3af" }} />
            <Typography variant="body2" fontWeight={700} color="#111827">
              {row.original.id}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "subcategoryName",
        header: "SUBCATEGORY & VISUAL",
        size: 215,
        Cell: ({ row }) => {
          const item = row.original;
          const image = row.original.image;
          console.log('bhao__',image)
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  variant="rounded"
                  src={`http://localhost:5000/api/ecommerce/${item.image}`}
                  alt={"cannot render"}
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2,
                    bgcolor: "#f3f4f6",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 15,
                    height: 15,
                    borderRadius: 0.8,
                    backgroundColor: "rgba(17, 24, 39, 0.82)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageOutlined sx={{ fontSize: 10, color: "#fff" }} />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                  <Typography variant="body2" fontWeight={700} color="#111827">
                    {item.subcategoryName}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280", display: "block", lineHeight: 1.3 }}
                >
                  {item.slug}
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#374151",
                  }}
                >
                  {item.skuCode}
                </Typography> */}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "productCount",
        header: "ITEMS",
        size: 95,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => (
          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
              color="#111827"
              lineHeight={1.2}
            >
              {row.original.productCount}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 9,
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: 0.4,
              }}
            >
              PRODUCTS
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        size: 80,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <Box onClick={(e) => e.stopPropagation()}>
            <Switch
              size="small"
              checked={row.original.status == "active" ? true : false}
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
        size: 110,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => {
          const isEditing = inspectorsubCategory?.id === row.original.id;
          return (
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="flex-end"
              alignItems="center"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton size="small" title="Open Storefront">
                <OpenInNew sx={{ fontSize: 15, color: "#4b5563" }} />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => setInspectorItem(row.original)}
                sx={{
                  bgcolor: isEditing ? "#0a0a0a" : "transparent",
                  color: isEditing ? "#fff" : "#4b5563",
                  borderRadius: 99,
                  px: isEditing ? 1 : 0.7,
                  "&:hover": {
                    bgcolor: isEditing ? "#262626" : "#f3f4f6",
                  },
                }}
              >
                <EditOutlined sx={{ fontSize: 15 }} />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => handleDeleteSubcategory(row.original.id)}
              >
                <DeleteOutlined sx={{ fontSize: 16, color: "#4b5563" }} />
              </IconButton>
            </Stack>
          );
        },
      },
    ],
    [inspectorsubCategory, currentCategory?.id]
  );

  // Material React Table Instance
  const table = useMaterialReactTable({
    columns,
    data:Array.isArray(subcategoryList) ? subcategoryList : [],
    getRowId: (row) => String(row.id),
    enableTopToolbar: false,
      enableBottomToolbar: true, 
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableSorting: false,
    enablePagination: true,
    manualPagination: true,
    rowCount: totalRecords,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  // Controlled states
  state: {
    rowSelection,
    pagination,
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
        letterSpacing: 0.6,
        py: 1.5,
        borderBottom: "1px solid #f3f4f6",
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isSelected = inspectorsubCategory?.id === row.original.id;
      return {
        onClick: () => setInspectorSubCategory(row.original),
        sx: {
          cursor: "pointer",
          backgroundColor: isSelected ? "#f9fafb" : "#fff",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
          "& td": {
            borderBottom: "1px solid #f3f4f6",
            py: 2,
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      };
    },
  });

  // Inspector Save & Discard Handlers
  const handleSaveInspector = () => {
    if (!inspectorsubCategory) return;
    dispatch(actions.updatesubCategory(pagination,inspectorsubCategory.id, inspectorsubCategory));
    updateCurrentSubcategories((list) =>
      list.map((item) =>
        item.id === inspectorsubCategory.id ? inspectorsubCategory : item
      )
    );
  };

  const handleDiscardInspector = () => {
    if (!inspectorsubCategory) return;
    const original = subcategories.find((s) => s.id === inspectorsubCategory.id);
    if (original) setInspectorItem(original);
  };

  // Add New Subcategory Handler


  return (
    <Box
      sx={{
        p: { xs: 2, md: 3.5 },
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        separator="/"
        sx={{ mb: 1.5, fontSize: 12, color: "#6b7280" }}
      >
        <Link underline="hover" color="inherit" href="#">
          Atelier Platform
        </Link>
        <Link underline="hover" color="inherit" href="#">
          Console
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/category")}
          sx={{ cursor: "pointer" }}
        >
          Categories
        </Link>
        <Typography fontSize={12} fontWeight={600} color="#111827">
          {currentCategory?.categoryName}
        </Typography>
        <Typography fontSize={12} fontWeight={600} color="#c2410c">
          Subcategories
        </Typography>
      </Breadcrumbs>

      {/* Top Action Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Button
            size="small"
            startIcon={<ArrowBack sx={{ fontSize: 15 }} />}
            onClick={() => navigate("/categories")}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontWeight: 600,
              fontSize: 12,
              px: 1.8,
              mb: 1.2,
              "&:hover": { backgroundColor: "#e5e7eb" },
            }}
          >
            Back to Categories
          </Button>

          {/* Page Title + Interactive Category Switcher Dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              onClick={(e) => setCategoryMenuAnchor(e.currentTarget)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#111827", letterSpacing: -0.5 }}
              >
                Subcategories: {currentCategory?.categoryName}
              </Typography>
              <IconButton
                size="small"
                aria-label="Switch root category"
                aria-controls={categoryMenuOpen ? "root-category-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={categoryMenuOpen ? "true" : undefined}
                sx={{
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  width: 26,
                  height: 26,
                  transition: "transform 0.15s",
                  transform: categoryMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <KeyboardArrowDown sx={{ fontSize: 17, color: "#111827" }} />
              </IconButton>
            </Box>

            {/* Dropdown Menu Listing All Root Categories */}
            <Menu
              id="root-category-menu"
              anchorEl={categoryMenuAnchor}
              open={categoryMenuOpen}
              onClose={() => setCategoryMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1,
                  minWidth: 270,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                  p: 0.6,
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.7,
                  display: "block",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: 0.7,
                  color: "#6b7280",
                }}
              >
                SWITCH ROOT CATEGORY ({allCategories.length})
              </Typography>

              {categoryList && categoryList.length > 0 && categoryList.map((cat) => {
                const isSelected = cat.id === currentCategory.id;
                return (
                  <MenuItem
                    key={cat.id}
                    selected={isSelected}
                    onClick={() => handleSelectCategory(cat)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 1.5,
                      mb: 0.3,
                      "&.Mui-selected": {
                        backgroundColor: "#f3f4f6",
                        "&:hover": { backgroundColor: "#e5e7eb" },
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={isSelected ? 700 : 600}
                            color="#111827"
                          >
                            {cat.categoryName}
                          </Typography>
                          <Chip
                            label={`#${cat.id}`}
                            size="small"
                            sx={{
                              height: 17,
                              fontSize: 9.5,
                              fontWeight: 700,
                              bgcolor: "#fff7ed",
                              color: "#c2410c",
                            }}
                          />
                        </Box>
                      }
                      // secondary={
                      //   <Typography variant="caption" color="text.secondary">
                      //     {cat.subcategories.length} subcategories •{" "}
                      //     {cat.skuPrefix}
                      //   </Typography>
                      // }
                    />
                    {isSelected && (
                      <Check sx={{ fontSize: 16, color: "#111827", ml: 1 }} />
                    )}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Box>

        {/* Right Primary Buttons */}
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<SwapVert fontSize="small" />}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              color: "#111827",
              borderColor: "#e5e7eb",
              backgroundColor: "#f3f4f6",
              fontWeight: 600,
              px: 2.5,
              py: 1.1,
              lineHeight: 1.2,
              textAlign: "left",
              "&:hover": { borderColor: "#d1d5db", backgroundColor: "#e5e7eb" },
            }}
          >
            Reorder
            <br />
            Hierarchy
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddOpen(true)}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              backgroundColor: "#0a0a0a",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              py: 1.1,
              lineHeight: 1.2,
              textAlign: "left",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#262626", boxShadow: "none" },
            }}
          >
            Add New
            <br />
            Subcategory
          </Button>
        </Stack>
      </Box>

      {/* Parent Root Category Context Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#fff7ed",
              color: "#c2410c",
            }}
          >
            <CheckroomOutlined />
          </Avatar>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
              <Typography variant="subtitle1" fontWeight={700} color="#111827">
                Root Category: {currentCategory?.categoryName}
              </Typography>
              <Chip
                label={`CATALOG DEPT #${currentCategory?.deptCode}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: "#fff7ed",
                  color: "#c2410c",
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {/* {currentCategory.departmentsLabel} */}
            </Typography>
          </Box>

          {/* Summary Metrics */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ pl: { md: 2 }, flexWrap: "wrap" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: "#111827",
                }}
              />
              <Typography variant="caption" fontWeight={700} color="#111827">
                {activeCount} Active
                <br />
                Subcategories
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: "#111827",
                }}
              />
              <Typography variant="caption" fontWeight={700} color="#111827">
                {totalProducts} Live
                <br />
                Products
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: "#6b7280",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                SKU Prefix:
                <br />
                <Box component="strong" color="#374151">
                  {/* {currentCategory.skuPrefix} */}
                </Box>
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Banner Right Buttons */}
        <Stack direction="row" spacing={1.2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TuneOutlined sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/categories")}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              color: "#111827",
              borderColor: "#e5e7eb",
              fontWeight: 600,
              px: 2,
              py: 0.8,
              lineHeight: 1.2,
              textAlign: "left",
            }}
          >
            Edit Root
            <br />
            Category
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNew sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 99,
              textTransform: "none",
              color: "#111827",
              borderColor: "#e5e7eb",
              fontWeight: 600,
              px: 2,
              py: 0.8,
              lineHeight: 1.2,
              textAlign: "left",
            }}
          >
            View Public
            <br />
            Storefront
          </Button>
        </Stack>
      </Paper>

      {/* Main Two-Column Content: Left Table + Right Subcategory Inspector */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: Search/Filter Bar + Material React Table + Info Notice */}
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          {/* Search & Filter Toolbar */}
          <Paper
            elevation={0}
            sx={{
              p: 1.8,
              mb: 2.5,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <TextField
              size="small"
              placeholder="Search by name, slug or prefix.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 235 },
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

            {/* Segmented Filter Pill */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                borderRadius: 99,
                p: 0.4,
              }}
            >
              {[
                { key: "ALL", label: `All (${subcategories.length})` },
                { key: "ACTIVE", label: `Active (${activeCount})` },
                { key: "DRAFT", label: `Draft (${draftCount})` },
              ].map((tab) => {
                const active = statusTab === tab.key;
                return (
                  <Button
                    key={tab.key}
                    size="small"
                    onClick={() => setStatusTab(tab.key)}
                    sx={{
                      borderRadius: 99,
                      textTransform: "none",
                      fontSize: 11.5,
                      fontWeight: 600,
                      px: 1.6,
                      py: 0.5,
                      minWidth: 0,
                      lineHeight: 1.2,
                      backgroundColor: active ? "#0a0a0a" : "transparent",
                      color: active ? "#fff" : "#4b5563",
                      "&:hover": {
                        backgroundColor: active ? "#262626" : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>

            {/* Rank Sort Pill */}
            <Button
              size="small"
              startIcon={<FilterList sx={{ fontSize: 16 }} />}
              onClick={() => setSortAsc((prev) => !prev)}
              sx={{
                borderRadius: 99,
                textTransform: "none",
                backgroundColor: "#f3f4f6",
                color: "#111827",
                fontWeight: 600,
                fontSize: 12,
                px: 1.8,
                py: 0.6,
                lineHeight: 1.2,
                "&:hover": { backgroundColor: "#e5e7eb" },
              }}
            >
              Rank
              <br />
              (1–{Math.max(1, subcategories.length)})
            </Button>
          </Paper>

          {/* Material React Table */}
          <MaterialReactTable table={table} />

          {/* Hierarchy Reordering Info Callout */}
          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              p: 2.2,
              borderRadius: 3.5,
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <InfoOutlined sx={{ fontSize: 18, color: "#c2410c", mt: 0.2 }} />
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="#111827"
                display="block"
                mb={0.3}
              >
                Hierarchy Reordering
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                The sequence shown above determines how subcategories appear in
                storefront navigation tabs and mobile filter sheets. Grab
                handles to reprioritize.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Right Column: Subcategory Inspector Panel */}
       
{inspectorsubCategory && (
  <Paper
    elevation={0}
    sx={{
      width: { xs: "100%", lg: 365 },
      flexShrink: 0,
      p: 3,
      borderRadius: 4,
      border: "1px solid #f0f0f0",
      backgroundColor: "#fff",
      position: { lg: "sticky" },
      top: 24,
    }}
  >
    {/* Inspector Header */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" mb={0.8}>
          <Chip
            label="INSPECTOR"
            size="small"
            sx={{
              height: 18,
              fontSize: 9.5,
              fontWeight: 700,
              bgcolor: "#0a0a0a",
              color: "#fff",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "#6b7280",
              letterSpacing: 0.6,
              fontSize: 10,
            }}
          >
            SUBCATEGORY CONTEXT
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          fontWeight={700}
          color="#111827"
          lineHeight={1.2}
        >
          Edit Subcategory:
          <br />
          {inspectorsubCategory.subcategoryName}
        </Typography>
      </Box>

      <IconButton size="small" onClick={() => setInspectorItem(null)}>
        <Close fontSize="small" />
      </IconButton>
    </Box>

    {/* Parent Category Dropdown */}
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          fontSize: 9.5,
          fontWeight: 700,
          color: "#6b7280",
          display: "block",
          mb: 0.8,
        }}
      >
        PARENT CATEGORY
      </Typography>

      <FormControl fullWidth size="small">
        <Select
          value={
            inspectorsubCategory.categoryId ??
            inspectorsubCategory.category?.id ??
            currentCategory?.id ??
            ""
          }
          displayEmpty
          onChange={(e) =>
            setInspectorSubCategory((prev) => ({
              ...prev,
              categoryId: e.target.value,
            }))
          }
          sx={{
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            fontSize: 13,
            fontWeight: 600,
            "& fieldset": { border: "none" },
          }}
        >
          <MenuItem value="" disabled>
            Select Parent Category
          </MenuItem>

          {Array.isArray(categoryList) &&
            categoryList.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>

    {/* Subcategory Name */}
    <Box sx={{ mb: 2.2 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        color="#4b5563"
        display="block"
        fontSize={10}
        mb={0.6}
      >
        SUBCATEGORY NAME
      </Typography>

      <TextField
        fullWidth
        size="small"
        value={inspectorsubCategory.subcategoryName || ""}
        onChange={(e) =>
          setInspectorSubCategory((prev) => ({
            ...prev,
            subcategoryName: e.target.value,
          }))
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            fontSize: 13,
            fontWeight: 600,
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Box>

    {/* Storefront URL Slug */}
    <Box sx={{ mb: 2.2 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        color="#4b5563"
        display="block"
        fontSize={10}
        mb={0.6}
      >
        STOREFRONT URL SLUG
      </Typography>

      <TextField
        fullWidth
        size="small"
        value={inspectorsubCategory.slug || ""}
        onChange={(e) =>
          setInspectorSubCategory((prev) => ({
            ...prev,
            slug: e.target.value,
          }))
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="caption" color="text.secondary">
                atelier.studio
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f3f4f6",
            fontSize: 12.5,
            fontWeight: 600,
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Box>

    {/* Subcategory Image Upload */}
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.8,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="#4b5563"
          fontSize={10}
        >
          SUBCATEGORY IMAGE
        </Typography>

        <Typography variant="caption" color="text.secondary" fontSize={10}>
          Max 5MB
        </Typography>
      </Box>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={imageInputRef}
        onChange={handleSubcategoryImageChange}
      />

      <Box
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          variant="rounded"
          src={
            inspectorsubCategory.inspectorPreviewUrl ||
           `http://localhost:5000/api/ecommerce/${inspectorsubCategory.image}` ||
            ""
          }
          sx={{
            width: 75,
            height: 75,
            borderRadius: 2,
            bgcolor: "#e5e7eb",
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            onClick={() => imageInputRef.current?.click()}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 0.5,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            <CloudUploadOutlined
              sx={{ fontSize: 17, color: "#c2410c" }}
            />

            <Typography
              variant="caption"
              fontWeight={700}
              color="#111827"
            >
              Replace Image
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            fontSize={11}
            lineHeight={1.4}
            mb={0.8}
          >
            Click to browse and upload a new subcategory image.
          </Typography>

          <Button
            size="small"
            variant="outlined"
            onClick={() => imageInputRef.current?.click()}
            sx={{
              textTransform: "none",
              fontSize: 11,
              borderRadius: 2,
              borderColor: "#d1d5db",
              color: "#374151",
            }}
          >
            Choose Image
          </Button>
        </Box>
      </Box>

      {inspectorsubCategory.imageFile && (
        <Typography
          variant="caption"
          color="success.main"
          display="block"
          mt={1}
        >
          Selected: {inspectorsubCategory.imageFile.name}
        </Typography>
      )}
    </Box>

    {/* SEO & Store Meta Tags */}
    <Accordion
      elevation={0}
      disableGutters
      sx={{
        mb: 2.5,
        borderRadius: "10px !important",
        backgroundColor: "#f3f4f6",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore fontSize="small" />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Search sx={{ fontSize: 16, color: "#4b5563" }} />
          <Typography variant="caption" fontWeight={700} color="#111827">
            SEO & Store Meta Tags
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <Stack spacing={1.2}>
          <TextField
            size="small"
            label="Meta Title"
            fullWidth
            value={inspectorsubCategory.seoTitle || ""}
            onChange={(e) =>
              setInspectorItem((prev) => ({
                ...prev,
                seoTitle: e.target.value,
              }))
            }
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />

          <TextField
            size="small"
            label="Meta Description"
            fullWidth
            multiline
            rows={2}
            value={inspectorsubCategory.seoDescription || ""}
            onChange={(e) =>
              setInspectorItem((prev) => ({
                ...prev,
                seoDescription: e.target.value,
              }))
            }
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>

    {/* Discard & Save */}
    <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
      <Button
        fullWidth
        onClick={handleDiscardInspector}
        sx={{
          borderRadius: 99,
          textTransform: "none",
          backgroundColor: "#f3f4f6",
          color: "#111827",
          fontWeight: 600,
          py: 1.1,
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
          py: 1.1,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#262626",
            boxShadow: "none",
          },
        }}
      >
        Save Changes
      </Button>
    </Stack>

    {/* Return Link */}
    <Box sx={{ textAlign: "center" }}>
      <Link
        component="button"
        underline="hover"
        onClick={() => navigate("/categories")}
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: "#6b7280",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <ArrowBack sx={{ fontSize: 14 }} />
        Return to Categories Overview
      </Link>
    </Box>
  </Paper>
)}

      </Box>

      {/* Add New Subcategory Dialog */}
        <CreateSubCategory
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        currentCategory={currentCategory}
        />
    </Box>
  );
}