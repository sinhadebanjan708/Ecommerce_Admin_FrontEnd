import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material"
import {
  Add,
  AddPhotoAlternateOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  NotificationsNone,
  QrCode2,
  Search,
  SettingsOutlined,
  Sync,
  Tune,
  Close,
  AutoAwesome,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions"
import CreateProductVariantDialog from "./CreateProductVariantDialogue";

const PRODUCTS = [
  { id: 101, name: "Oversized Heavyweight Cotton Tee" },
  { id: 102, name: "Relaxed Linen Shirt" },
  { id: 103, name: "Boxy Fleece Crew" },
];

const WAREHOUSES = [
  { id: 1, name: "Paris Main Logistics Hub" },
  { id: 2, name: "New York Brooklyn Atelier" },
  { id: 3, name: "Tokyo Flagship Stockroom" },
];

const STATUS_OPTIONS = ["active","draft"];
const SELLER_TYPES = ["POD","Inventory"];
const FIT_OPTIONS = ["Regular Sized", "Oversized", "Regular", "Slim Fit"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const INITIAL_VARIANTS = [
  {
    id: 1,
    productId: 101,
    color: "Washed Charcoal",
    size: "L",
    fit: "Oversized",
    sku: "AT-TEE-001-CHA-L",
    ean: "07421893821",
    hex: "#2B2D2F",
    cost: 12.4,
    price: 45,
    salePrice: 39,
    stock: 142,
    quantityAvailable: 142,
    quantityReserved: 8,
    reorderLevel: 20,
    images: 5,
    status: "IN STOCK",
    sellerType: "1P",
    deliveryDate: "2026-12-05",
    warehouseId: 1,
    imageColor: "#44484a",
  },
  {
    id: 2,
    productId: 101,
    color: "Washed Charcoal",
    size: "M",
    fit: "Oversized",
    sku: "AT-TEE-001-CHA-M",
    ean: "07421893820",
    hex: "#2B2D2F",
    cost: 12.4,
    price: 45,
    salePrice: 39,
    stock: 86,
    quantityAvailable: 86,
    quantityReserved: 4,
    reorderLevel: 20,
    images: 5,
    status: "IN STOCK",
    sellerType: "1P",
    deliveryDate: "2026-12-05",
    warehouseId: 1,
    imageColor: "#55595b",
  },
  {
    id: 3,
    productId: 101,
    color: "Ecru White",
    size: "S",
    fit: "Oversized",
    sku: "AT-TEE-001-ECR-S",
    ean: "07421893824",
    hex: "#EAE6DF",
    cost: 11.8,
    price: 45,
    salePrice: 42,
    stock: 14,
    quantityAvailable: 14,
    quantityReserved: 2,
    reorderLevel: 15,
    images: 4,
    status: "LOW STOCK ALERT",
    sellerType: "1P",
    deliveryDate: "2026-11-28",
    warehouseId: 2,
    imageColor: "#dedbd3",
  },
  {
    id: 4,
    productId: 101,
    color: "Ecru White",
    size: "M",
    fit: "Oversized",
    sku: "AT-TEE-001-ECR-M",
    ean: "07421893825",
    hex: "#EAE6DF",
    cost: 11.8,
    price: 45,
    salePrice: 42,
    stock: 108,
    quantityAvailable: 108,
    quantityReserved: 6,
    reorderLevel: 15,
    status: "IN STOCK",
    images: 4,
    sellerType: "1P",
    deliveryDate: "2026-11-28",
    warehouseId: 2,
    imageColor: "#d8d5cc",
  },
  {
    id: 5,
    productId: 101,
    color: "Sage Olive",
    size: "M",
    fit: "Oversized",
    sku: "AT-TEE-001-OLV-M",
    ean: "07421893828",
    hex: "#525B4C",
    cost: 13.1,
    price: 48,
    salePrice: 44,
    stock: 4,
    quantityAvailable: 4,
    quantityReserved: 1,
    reorderLevel: 25,
    status: "RESTOCK ORDERED",
    images: 5,
    sellerType: "1P",
    deliveryDate: "2026-12-12",
    warehouseId: 3,
    imageColor: "#a4a994",
  },
  {
    id: 6,
    productId: 101,
    color: "Vintage Navy",
    size: "XL",
    fit: "Oversized",
    sku: "AT-TEE-001-NAV-XL",
    ean: "07421893835",
    hex: "#202738",
    cost: 12.4,
    price: 45,
    salePrice: 40,
    stock: 120,
    quantityAvailable: 120,
    quantityReserved: 10,
    reorderLevel: 20,
    status: "IN STOCK",
    images: 5,
    sellerType: "1P",
    deliveryDate: "2026-12-08",
    warehouseId: 1,
    imageColor: "#25354a",
  },
];

const COLORS = [
  { label: "All Colorways", value: "ALL", count: 8, dot: "#111111" },
  { label: "Washed Charcoal", value: "Washed Charcoal", count: 3, dot: "#303234" },
  { label: "Ecru White", value: "Ecru White", count: 2, dot: "#e7e2d9" },
  { label: "Sage Olive", value: "Sage Olive", count: 2, dot: "#68715f" },
  { label: "Vintage Navy", value: "Vintage Navy", count: 1, dot: "#202738" },
];

const warehousesSummary = [
  ["Paris Main Logistics Hub", 94],
  ["New York Brooklyn Atelier", 32],
  ["Tokyo Flagship Stockroom", 16],
];

const panelSx = {
  border: "1px solid #ececef",
  borderRadius: 1.5,
  boxShadow: "none",
  backgroundColor: "#fff",
};

const pillButtonSx = {
  borderRadius: 99,
  textTransform: "none",
  fontSize: 11,
  fontWeight: 700,
  px: 1.7,
  boxShadow: "none",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12,
    borderRadius: 1.2,
    bgcolor: "#fafafa",
    "& fieldset": { borderColor: "#e8e8ea" },
  },
  "& .MuiInputLabel-root": { fontSize: 12 },
};

const emptyForm = {
  productId: "",
  sku: "",
  price: "",
  color: "",
  size: "",
  fit: "",
  salePrice: "",
  status: "DRAFT",
  sellerType: "1P",
  deliveryDate: "",
  warehouseId: "",
  quantityAvailable: 0,
  quantityReserved: 0,
  reorderLevel: 10,
};

export default function ProductVariantInventory() {
    const dispatch = useDispatch();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const productList= useSelector((state)=>state.product.productList)
    const productVarinatList= useSelector((state)=>state.productVarinat.productVariantList)
    const [productFilter, setProductFilter] = useState("ALL");
  const [variants, setVariants] = useState(productVarinatList && productVarinatList.length > 0 ? productVarinatList : []);
  const [selectedVariantId, setSelectedVariantId] = useState(1);
  const [colorFilter, setColorFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  console.log('media files__',mediaFiles)

//   const selectedVariant =
//     productVarinatList?.find((v) => v.id === selectedVariantId) || productVarinatList && productVarinatList[0];

const selectedVariant =
  productVarinatList?.find(
    (variant) => String(variant.id) === String(selectedVariantId)
  ) || null;


    // useEffect(() => {
    //     dispatch(actions.fetchAllProducts())
    // }, [dispatch])
    

    // useEffect(() => {
    //     if(productList && productList.length > 0){
    //         setProductFilter(productList[0].id)
    //         dispatch(actions.fetchAllProductVariants(productList[0].id,pagination.pageIndex,pagination.pageSize))
    //     }
    // }, [productList,pagination.pageIndex,pagination.pageSize])

    // useEffect(() => {
    //   if(selectedVariant instanceof Object){
    //         setSelectedVariantId(productVarinatList[0].id)
    //   }
    // }, [selectedVariantId])
    
useEffect(() => {
  dispatch(actions.fetchAllProducts());
}, [dispatch]);

useEffect(() => {
  if (productList?.length > 0) {
    setProductFilter(String(productList[0].id));
  }
}, [productList]);

useEffect(() => {
  if (productFilter && productFilter !== "ALL") {
    setSelectedVariantId(null);

    dispatch(
      actions.fetchAllProductVariants(
        productFilter,
        pagination.pageIndex,
        pagination.pageSize
      )
    );
  }
}, [dispatch, productFilter, pagination.pageIndex, pagination.pageSize]);

useEffect(() => {
  if (productVarinatList?.length > 0) {
    setSelectedVariantId(productVarinatList[0].id);
    setIsEditorOpen(true);
  } else {
    setSelectedVariantId(null);
    setIsEditorOpen(false);
    setForm(emptyForm);
    setMediaFiles([]);
  }
}, [productVarinatList]);   
    console.log('product varaint',productVarinatList,selectedVariantId,selectedVariant)
    

  // Load selected variant into the edit form
  useEffect(() => {
    if (!selectedVariant) {
      setForm(emptyForm);
      return;
    }
    setForm({
      productId: selectedVariant.productId ?? "",
      sku: selectedVariant.sku ?? "",
      price: selectedVariant.price ?? "",
      color: selectedVariant.color ?? "",
      size: selectedVariant.size ?? "",
      fit: selectedVariant.fit ?? "",
      salePrice: selectedVariant.salePrice ?? "",
      status: selectedVariant.status ?? "DRAFT",
      sellerType: selectedVariant.sellerType ?? "1P",
      deliveryDate: selectedVariant.deliveryDate ?? "",
      warehouseId: selectedVariant.warehouseId ?? "",
      quantityAvailable: selectedVariant.quantityAvailable ?? selectedVariant.stock ?? 0,
      quantityReserved: selectedVariant.quantityReserved ?? 0,
      reorderLevel: selectedVariant.reorderLevel ?? 10,
    });
    // Clear local media previews when switching variant (demo)
    // setMediaFiles((prev) => {
    //   prev.forEach((m) => URL.revokeObjectURL(m.preview));
    //   return [];
    // });
     const existingImages = (selectedVariant.images || []).map(
    (image, index) => ({
      id: image.id || `existing-${index}`,
      name: image.imageName || image.fileName || `Image ${index + 1}`,
      preview: image.imageUrl || image.url || image.imagePath,
      isExisting: true,
    })
  ).filter((image) => image.preview);

  setMediaFiles(existingImages);
  }, [selectedVariantId]); // eslint-disable-line react-hooks/exhaustive-deps


  const filteredVariants = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();

  return variants.filter((variant) => {
    const matchesProduct =
      productFilter === "ALL" ||
      String(variant.productId) === String(productFilter);

    const matchesColor =
      colorFilter === "ALL" || variant.color === colorFilter;

    const matchesSearch =
      !normalizedSearch ||
      [
        variant.productName,
        variant.color,
        variant.size,
        variant.sku,
        variant.ean,
      ].some((value) =>
        String(value || "").toLowerCase().includes(normalizedSearch)
      );

    return matchesProduct && matchesColor && matchesSearch;
  });
}, [variants, productFilter, colorFilter, search]);

//   const filteredVariants = useMemo(() => {
//     const normalizedSearch = search.trim().toLowerCase();
//     return variants.filter((variant) => {
//       const matchesColor =
//         colorFilter === "ALL" || variant.color === colorFilter;
//       const matchesSearch =
//         !normalizedSearch ||
//         [variant.color, variant.size, variant.sku, variant.ean]
//           .some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
//       return matchesColor && matchesSearch;
//     });
//   }, [variants, colorFilter, search]);

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]:
        ["price", "salePrice", "quantityAvailable", "quantityReserved", "reorderLevel", "productId", "warehouseId"].includes(field)
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const saveVariant = () => {
    if (!selectedVariantId) return;
    setVariants((current) =>
      current.map((v) =>
        v.id === selectedVariantId
          ? {
              ...v,
              ...form,
              stock: Number(form.quantityAvailable) || 0,
              status:
                Number(form.quantityAvailable) <= (Number(form.reorderLevel) || 0)
                  ? "LOW STOCK ALERT"
                  : form.status === "LOW STOCK ALERT"
                    ? "IN STOCK"
                    : form.status,
            }
          : v
      )
    );
    setNotice("Variant saved (local state). Connect to your API when ready.");
  };

  const updateStock = (variantId, amount) => {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              stock: Math.max(0, variant.stock + amount),
              quantityAvailable: Math.max(0, (variant.quantityAvailable ?? variant.stock) + amount),
            }
          : variant
      )
    );
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const accepted = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );
    const oversized = accepted.some((file) => file.size > 10 * 1024 * 1024);

    if (oversized) {
      setNotice("Each image must be 10MB or smaller.");
      return;
    }

    const newFiles = accepted.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles((current) => [...current, ...newFiles]);
    setNotice(
      accepted.length
        ? `${accepted.length} image(s) added to the local preview.`
        : "Choose JPG, PNG, or WEBP images."
    );
    event.target.value = "";
  };

  const removeMedia = (id) => {
    setMediaFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((item) => item.id !== id);
    });
  };

const columns = useMemo(
  () => [
    {
      accessorKey: "image",
      header: "PREVIEW",
      size: 75,
      enableSorting: false,
      Cell: ({ row }) => {
        const images = row.original.images || [];
        const imageUrl = images[0]?.imageUrl;

        return (
          <Avatar
            variant="rounded"
            src={
              imageUrl
                ? `http://localhost:5000/api/ecommerce/${imageUrl}`
                : undefined
            }
            alt={row.original.sku || "Variant"}
            sx={{
              width: 42,
              height: 46,
              borderRadius: 2,
              bgcolor: "#f3f4f6",
            }}
          >
            {row.original.color?.charAt(0) || "V"}
          </Avatar>
        );
      },
    },
    {
      accessorKey: "productName",
      header: "PRODUCT & SKU",
      size: 220,
      Cell: ({ row }) => {
        const item = row.original;

        return (
          <Box>
            <Typography variant="body2" fontWeight={700} color="#111827">
              {item.productName || `Product Variant #${item.productId}`}
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
              SKU: {item.sku || "—"}
            </Typography>
          </Box>
        );
      },
    },
    {
      accessorKey: "price",
      header: "PRICE",
      size: 100,
      Cell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} color="#111827">
          ₹{row.original.price ?? "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "color",
      header: "COLOR",
      size: 120,
      Cell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={0.8}>
          <Box
            sx={{
              width: 11,
              height: 11,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: row.original.hex || "#d1d5db",
              border: "1px solid #d1d5db",
            }}
          />
          <Typography variant="body2" color="#374151">
            {row.original.color || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "size",
      header: "SIZE",
      size: 75,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => (
        <Chip
          label={row.original.size || "—"}
          size="small"
          sx={{
            height: 23,
            minWidth: 38,
            fontSize: 10,
            fontWeight: 700,
            bgcolor: "#f3f4f6",
            color: "#374151",
          }}
        />
      ),
    },
    {
      accessorKey: "fit",
      header: "FIT",
      size: 100,
      Cell: ({ row }) => (
        <Typography variant="body2" color="#374151">
          {row.original.fit || "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "salePrice",
      header: "SALE PRICE",
      size: 105,
      Cell: ({ row }) => (
        <Typography variant="body2" fontWeight={700} color="#15803d">
          {row.original.salePrice != null
            ? `₹${row.original.salePrice}`
            : "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      size: 125,
      Cell: ({ row }) => {
        const status = (row.original.status || "").toUpperCase();
        const isActive = status === "ACTIVE" || status === "IN STOCK";
        const isDraft = status === "DRAFT";
        const isLowStock =
          status === "LOW STOCK ALERT" || status === "LOW_STOCK";

        return (
          <Chip
            icon={
              <FiberManualRecord
                sx={{
                  fontSize: "8px !important",
                  color: `${
                    isActive
                      ? "#16a34a"
                      : isDraft
                        ? "#6b7280"
                        : isLowStock
                          ? "#dc2626"
                          : "#d97706"
                  } !important`,
                }}
              />
            }
            label={row.original.status || "—"}
            size="small"
            sx={{
              height: 22,
              fontSize: 9.5,
              fontWeight: 700,
              color: isActive
                ? "#15803d"
                : isDraft
                  ? "#4b5563"
                  : isLowStock
                    ? "#b91c1c"
                    : "#b45309",
              bgcolor: isActive
                ? "#f0fdf4"
                : isDraft
                  ? "#f3f4f6"
                  : isLowStock
                    ? "#fef2f2"
                    : "#fffbeb",
            }}
          />
        );
      },
    },
    {
      accessorKey: "sellerType",
      header: "SELLER TYPE",
      size: 115,
      Cell: ({ row }) => (
        <Chip
          label={row.original.sellerType || "—"}
          size="small"
          sx={{
            height: 22,
            fontSize: 9.5,
            fontWeight: 700,
            bgcolor: "#f3f4f6",
            color: "#374151",
          }}
        />
      ),
    },
    {
      accessorKey: "deliveryDate",
      header: "DELIVERY DATE",
      size: 130,
      Cell: ({ row }) => (
        <Typography variant="body2" color="#374151" fontSize={11}>
          {row.original.deliveryDate
            ? new Date(row.original.deliveryDate).toLocaleDateString("en-IN")
            : "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "warehouseId",
      header: "WAREHOUSE",
      size: 110,
      Cell: ({ row }) => {
        const inventory = row.original.inventory || [];

        return (
          <Box>
            {inventory.length ? (
              inventory.map((stock, index) => (
                <Typography
                  key={stock.id || index}
                  variant="caption"
                  display="block"
                  fontWeight={600}
                  color="#374151"
                >
                  WH-{stock.warehouseId}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      accessorKey: "quantityAvailable",
      header: "AVAILABLE",
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => {
        const total = (row.original.inventory || []).reduce(
          (sum, stock) => sum + (Number(stock.quantityAvailable) || 0),
          0
        );

        return (
          <Typography
            variant="body2"
            fontWeight={700}
            color={total > 0 ? "#15803d" : "#dc2626"}
          >
            {total}
          </Typography>
        );
      },
    },
    {
      accessorKey: "quantityReserved",
      header: "RESERVED",
      size: 95,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => {
        const total = (row.original.inventory || []).reduce(
          (sum, stock) => sum + (Number(stock.quantityReserved) || 0),
          0
        );

        return (
          <Typography variant="body2" fontWeight={700} color="#d97706">
            {total}
          </Typography>
        );
      },
    },
    {
      accessorKey: "reorderLevel",
      header: "REORDER LEVEL",
      size: 115,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => {
        const total = (row.original.inventory || []).reduce(
          (sum, stock) => sum + (Number(stock.reorderLevel) || 0),
          0
        );

        return (
          <Typography variant="body2" fontWeight={600} color="#374151">
            {total}
          </Typography>
        );
      },
    },
  ],
  []
);
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "color",
//         header: "VARIANT",
//         size: 260,
//         Cell: ({ row }) => {
//           const item = row.original;
//           const selected = item.id === selectedVariantId;
//           return (
//             <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
//               <Box
//                 sx={{
//                   width: 46,
//                   height: 46,
//                   flexShrink: 0,
//                   borderRadius: 1,
//                   background: `linear-gradient(145deg, ${item.imageColor}, #c9c9c5)`,
//                   border: "1px solid #e5e5e5",
//                   display: "grid",
//                   placeItems: "center",
//                   color: "#fff",
//                   fontSize: 9,
//                   fontWeight: 700,
//                 }}
//               >
//                 TEE
//               </Box>
//               <Box sx={{ minWidth: 0 }}>
//                 <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap">
//                   <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#171717", lineHeight: 1.25 }}>
//                     {item.color} / {item.size}
//                   </Typography>
//                   {selected && (
//                     <Chip
//                       label="SELECTED"
//                       size="small"
//                       sx={{ height: 16, fontSize: 8, fontWeight: 800, bgcolor: "#e8e8e8" }}
//                     />
//                   )}
//                   {(item.quantityAvailable ?? item.stock) <= 15 && (
//                     <Chip
//                       label="CRITICAL"
//                       size="small"
//                       sx={{ height: 16, fontSize: 8, fontWeight: 800, color: "#fff", bgcolor: "#bd2525" }}
//                     />
//                   )}
//                 </Stack>
//                 <Typography sx={{ fontSize: 9.5, color: "#777", mt: 0.25 }}>
//                   SKU: {item.sku} • EAN: {item.ean}
//                 </Typography>
//                 <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.45 }}>
//                   <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: item.hex, border: "1px solid #ddd" }} />
//                   <Typography sx={{ fontSize: 9.5, color: "#555" }}>{item.hex}</Typography>
//                   <Typography sx={{ fontSize: 9, color: "#aaa" }}>•</Typography>
//                   <Typography sx={{ fontSize: 9.5, color: "#555" }}>Size {item.size}</Typography>
//                 </Stack>
//               </Box>
//             </Stack>
//           );
//         },
//       },
//       {
//         accessorKey: "price",
//         header: "PRICE",
//         size: 90,
//         Cell: ({ row }) => (
//           <Box sx={{ textAlign: "right" }}>
//             <Typography sx={{ fontSize: 13, fontWeight: 800 }}>${row.original.price.toFixed(2)}</Typography>
//             <Typography sx={{ fontSize: 9, color: "#888", letterSpacing: 0.4 }}>COST</Typography>
//             <Typography sx={{ fontSize: 9, color: "#777" }}>${row.original.cost.toFixed(2)}</Typography>
//           </Box>
//         ),
//       },
//       {
//         accessorKey: "stock",
//         header: "INVENTORY",
//         size: 125,
//         Cell: ({ row }) => {
//           const item = row.original;
//           const qty = item.quantityAvailable ?? item.stock;
//           const low = qty <= 15;
//           return (
//             <Box sx={{ textAlign: "center" }}>
//               <Stack
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="center"
//                 spacing={0.5}
//                 sx={{
//                   borderRadius: 99,
//                   bgcolor: "#f4f4f5",
//                   p: 0.35,
//                   width: "fit-content",
//                   mx: "auto",
//                 }}
//               >
//                 <IconButton
//                   size="small"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     updateStock(item.id, -1);
//                   }}
//                   sx={{ width: 24, height: 24, bgcolor: "#fff" }}
//                 >
//                   <Typography sx={{ fontSize: 15, lineHeight: 1 }}>−</Typography>
//                 </IconButton>
//                 <Typography sx={{ minWidth: 29, fontSize: 12, fontWeight: 800, color: low ? "#c62828" : "#222" }}>
//                   {qty}
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     updateStock(item.id, 1);
//                   }}
//                   sx={{ width: 24, height: 24, bgcolor: "#fff" }}
//                 >
//                   <Add sx={{ fontSize: 13 }} />
//                 </IconButton>
//               </Stack>
//               <Typography
//                 sx={{
//                   mt: 0.4,
//                   fontSize: 8.5,
//                   fontWeight: 800,
//                   letterSpacing: 0.5,
//                   color: low ? "#c62828" : "#28833b",
//                 }}
//               >
//                 {item.status === "RESTOCK ORDERED" && low
//                   ? "RESTOCK ORDERED"
//                   : low
//                     ? "LOW STOCK ALERT"
//                     : "IN STOCK"}
//               </Typography>
//             </Box>
//           );
//         },
//       },
//     ],
//     [selectedVariantId, variants]
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: filteredVariants,
//     enableTopToolbar: false,
//     enableBottomToolbar: false,
//     enableColumnActions: false,
//     enableSorting: false,
//     enablePagination: false,
//     enableColumnFilters: false,
//     enableDensityToggle: false,
//     enableFullScreenToggle: false,
//     enableHiding: false,
//     enableRowActions: false,
//     muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0, boxShadow: "none" } },
//     muiTableContainerProps: { sx: { maxHeight: 570 } },
//     muiTableHeadCellProps: {
//       sx: {
//         display: "none",
//         borderBottom: "1px solid #eee",
//       },
//     },
//     muiTableBodyCellProps: {
//       sx: {
//         borderBottom: "1px solid #ececec",
//         px: 1.5,
//         py: 1.35,
//         verticalAlign: "middle",
//       },
//     },
//     muiTableBodyRowProps: ({ row }) => ({
//       onClick: () => setSelectedVariantId(row.original.id),
//       sx: {
//         cursor: "pointer",
//         backgroundColor:
//           row.original.id === selectedVariantId
//             ? "#fff"
//             : (row.original.quantityAvailable ?? row.original.stock) <= 15
//               ? "#fff9f8"
//               : "#fff",
//         outline: row.original.id === selectedVariantId ? "1px solid #171717" : "none",
//         outlineOffset: "-1px",
//         "&:hover": { backgroundColor: "#f8f8f8" },
//       },
//     }),
//     state: {},
//   });
const table = useMaterialReactTable({
  columns,
//   data: INITIAL_VARIANTS || [],
  data: productVarinatList || [],

  enableTopToolbar: false,
  enableBottomToolbar: false,
  enableColumnActions: false,
  enableSorting: false,
  enablePagination: false,
  enableColumnFilters: false,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableHiding: false,
  enableRowActions: false,

  muiTablePaperProps: {
    elevation: 0,
    sx: {
      borderRadius: 0,
      boxShadow: "none",
    },
  },

  muiTableContainerProps: {
    sx: {
      maxHeight: 570,
      overflowX: "auto",
    },
  },

  muiTableHeadCellProps: {
    sx: {
      bgcolor: "#f9fafb",
      color: "#6b7280",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: 0.5,
      whiteSpace: "nowrap",
      borderBottom: "1px solid #e5e7eb",
      py: 1.5,
    },
  },

  muiTableBodyCellProps: {
    sx: {
      borderBottom: "1px solid #f0f0f0",
      px: 1.5,
      py: 1.4,
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    },
  },

  muiTableBodyRowProps: ({ row }) => ({
    onClick: () =>{ setSelectedVariantId(row.original.id)
         setIsEditorOpen(true);
    },
    sx: {
      cursor: "pointer",
      backgroundColor:
        row.original.id === selectedVariantId ? "#f9fafb" : "#fff",
      outline:
        row.original.id === selectedVariantId
          ? "1px solid #111827"
          : "none",
      outlineOffset: "-1px",
      "&:hover": {
        backgroundColor: "#f9fafb",
      },
    },
  }),
});

  return (
    <Box sx={{ bgcolor: "#f8f8fa", minHeight: "100%", p: { xs: 1.5, md: 2.5 }, color: "#171717" }}>
      {/* Product heading */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "flex-start" }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.7 }}>
            <Typography sx={{ fontSize: 10, color: "#777" }}>‹ Products Catalog</Typography>
            <Typography sx={{ fontSize: 10, color: "#bbb" }}>/</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#555" }}>SKU: AT-TEE-001</Typography>
          </Stack>
          <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap">
            <Typography sx={{ fontSize: { xs: 22, md: 27 }, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>
              Oversized Heavyweight
              <br />
              Cotton Tee
            </Typography>
            <Chip label="MATRIX & MEDIA" size="small" sx={{ height: 20, fontSize: 8, fontWeight: 800, bgcolor: "#e9e9eb" }} />
          </Stack>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            startIcon={<Sync sx={{ fontSize: 15 }} />}
            sx={{ ...pillButtonSx, bgcolor: "#f0f0f2", color: "#222" }}
            onClick={() => setNotice("Inventory sync requested (demo).")}
          >
            Sync Inventory
          </Button>
          <Button
            startIcon={<Tune sx={{ fontSize: 15 }} />}
            sx={{ ...pillButtonSx, bgcolor: "#f0f0f2", color: "#222" }}
            onClick={() => setNotice("Bulk price & stock panel is ready for API integration.")}
          >
            Bulk Price & Stock
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ ...pillButtonSx, bgcolor: "#050505", color: "#fff", "&:hover": { bgcolor: "#333" } }}
            onClick={() =>{ 
                setNotice("Add variant action clicked.")
                setCreateDialogOpen(true)

            }}
          >
            Add New Variant
          </Button>
        </Stack>
      </Stack>

      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" },
          gap: 1.2,
          mb: 2.5,
        }}
      >
        {[
          { title: "ACTIVE VARIANTS", value: "8", detail: "of 24 Combinations", foot: "4 Colors     •     6 Core Sizes (XS–XXL)", color: "#b54b24" },
          { title: "TOTAL VARIANT UNITS", value: "628", detail: "+18% MoM", foot: "inventory across all variants", color: "#268b50" },
          { title: "MEDIA ASSETS BOUND", value: "38", detail: "High-Res Angles", foot: "◉ All 8 active variants mapped", color: "#777" },
          { title: "ATTENTION NEEDED", value: "2", detail: "Low Stock SKU Flags", foot: "Threshold alert: < 20 units", color: "#c62828", danger: true },
        ].map((card) => (
          <Paper key={card.title} sx={{ ...panelSx, p: 1.8, minHeight: 105 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.7, color: card.danger ? "#c62828" : "#888" }}>
                {card.title}
              </Typography>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: card.color }} />
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={0.8} sx={{ mt: 0.8 }}>
              <Typography sx={{ fontSize: 29, lineHeight: 1, fontWeight: 800 }}>{card.value}</Typography>
              <Typography sx={{ fontSize: 10, color: card.danger ? "#666" : "#777" }}>{card.detail}</Typography>
            </Stack>
            <Typography sx={{ fontSize: 9, color: "#777", mt: 1 }}>{card.foot}</Typography>
            {card.title === "TOTAL VARIANT UNITS" && (
              <LinearProgress
                variant="determinate"
                value={72}
                sx={{
                  mt: 1,
                  height: 4,
                  borderRadius: 5,
                  bgcolor: "#e8e8e8",
                  "& .MuiLinearProgress-bar": { bgcolor: "#111", borderRadius: 5 },
                }}
              />
            )}
          </Paper>
        ))}
      </Box>

      {/* Color filters and search */}
    {/* Product filter, Color filters and Variant search */}
<Stack spacing={1.2} sx={{ mb: 2.2 }}>

  {/* Product filter and Variant search */}
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={1}
    alignItems={{ xs: "stretch", sm: "center" }}
  >
    {/* Product filter */}
    <FormControl
      size="small"
      sx={{
        width: { xs: "100%", sm: 260 },
        "& .MuiOutlinedInput-root": {
          height: 36,
          borderRadius: 99,
          bgcolor: "#fff",
          fontSize: 11,
          "& fieldset": { borderColor: "#eee" },
        },
      }}
    >
      <InputLabel id="variant-product-filter-label">
        Filter
      </InputLabel>

      <Select
        labelId="variant-product-filter-label"
        value={productFilter}
        label="Filter by Product"
        onChange={(event) =>{ setProductFilter(event.target.value)
            dispatch(actions.fetchAllProductVariants(event.target.value,pagination.pageIndex,pagination.pageSize))
        }}
      >
        <MenuItem value="ALL">All Products</MenuItem>

        {productList?.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.productName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Variant search */}
    <TextField
      size="small"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search SKU, size, barcode..."
      sx={{
        width: { xs: "100%", sm: 280 },
        "& .MuiOutlinedInput-root": {
          height: 36,
          borderRadius: 99,
          bgcolor: "#fff",
          fontSize: 11,
          "& fieldset": { borderColor: "#eee" },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 16, color: "#888" }} />
          </InputAdornment>
        ),
      }}
    />

    <IconButton
      sx={{
        width: 36,
        height: 36,
        bgcolor: "#fff",
        border: "1px solid #eee",
        flexShrink: 0,
      }}
      onClick={() => setNotice("Barcode scanner action clicked.")}
    >
      <QrCode2 sx={{ fontSize: 17 }} />
    </IconButton>
  </Stack>

  {/* Color filters */}
  <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
    {COLORS.map((color) => (
      <Chip
        key={color.value}
        onClick={() => setColorFilter(color.value)}
        icon={
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              bgcolor: color.dot,
              ml: 1,
            }}
          />
        }
        label={`${color.label} (${color.count})`}
        sx={{
          height: 27,
          fontSize: 10,
          fontWeight: 700,
          bgcolor: colorFilter === color.value ? "#050505" : "#ededf0",
          color: colorFilter === color.value ? "#fff" : "#333",
          "& .MuiChip-icon": { mr: -0.4 },
          "&:hover": {
            bgcolor: colorFilter === color.value ? "#222" : "#e3e3e6",
          },
        }}
      />
    ))}
  </Stack>
</Stack>
      {/* Main two-column area */}
      <Box
        sx={{
    display: "grid",
    gridTemplateColumns: isEditorOpen
      ? "minmax(0, 1fr) 350px"
      : "minmax(0, 1fr)",
    gap: 2,
    width: "100%",
    transition: "all 0.3s ease",
  }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Paper sx={{ ...panelSx, overflow: "hidden", mb: 1.8 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.8, bgcolor: "#f2f2f4" }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Variant Catalog Matrix</Typography>
                <Typography sx={{ fontSize: 9, color: "#888", mt: 0.2 }}>
                  Click a variant row to edit in the right panel
                </Typography>
              </Box>
              <Chip label="LIVE STORE SYNC" size="small" sx={{ height: 19, bgcolor: "#050505", color: "#fff", fontSize: 8, fontWeight: 800 }} />
            </Stack>
            <MaterialReactTable table={table} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.3, bgcolor: "#f6f6f7" }}>
              <Typography sx={{ fontSize: 9, color: "#555" }}>
                Showing {filteredVariants.length} of {variants.length} populated variants
              </Typography>
              <Stack direction="row" spacing={0.7}>
                <Button
                  size="small"
                  sx={{ ...pillButtonSx, minWidth: 0, bgcolor: "#fff", fontSize: 9 }}
                  onClick={() => setNotice("CSV export is ready for backend integration.")}
                >
                  Export CSV
                </Button>
                <Button
                  size="small"
                  sx={{ ...pillButtonSx, minWidth: 0, bgcolor: "#fff", fontSize: 9 }}
                  onClick={() => setNotice("Barcode re-index requested (demo).")}
                >
                  Re-index Barcodes
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* <Paper sx={{ ...panelSx, p: 2.2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesome sx={{ fontSize: 17 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Batch Size & SKU Expander</Typography>
              </Stack>
              <Typography sx={{ fontSize: 8, color: "#b34b22", fontWeight: 800, letterSpacing: 0.6 }}>
                AUTOMATED NAMING
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 10.5, color: "#666", lineHeight: 1.55, mt: 1 }}>
              Generate absent variant combinations with standard markup, automated SKU syntax (
              <b>AT-TEE-001-[COL]-[SIZE]</b>), and unified asset replication.
            </Typography>
            <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap" sx={{ mt: 1.6 }}>
              <Button
                size="small"
                sx={{ ...pillButtonSx, bgcolor: "#f0f0f2", fontSize: 9 }}
                onClick={() => setShowAllSizes((value) => !value)}
              >
                + {showAllSizes ? "Hide" : "Add"} Missing Sizes (XS, XXL)
              </Button>
              <Button
                size="small"
                sx={{ ...pillButtonSx, bgcolor: "#f0f0f2", fontSize: 9 }}
                onClick={() => setNotice("Shared care tag assets applied (demo).")}
              >
                Apply Shared Care Tag Assets
              </Button>
              <Button
                size="small"
                sx={{ ...pillButtonSx, bgcolor: "#f0f0f2", fontSize: 9 }}
                onClick={() => setNotice("Charcoal media copy action clicked.")}
              >
                Copy Washed Charcoal Media to Rest
              </Button>
            </Stack>
            {showAllSizes && (
              <Box sx={{ mt: 1.5, p: 1.2, borderRadius: 1.5, bgcolor: "#f7f7f8" }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700 }}>Missing combinations preview</Typography>
                <Typography sx={{ fontSize: 9, color: "#777", mt: 0.4 }}>
                  XS and XXL combinations will be generated when connected to your variant creation API.
                </Typography>
              </Box>
            )}
          </Paper> */}
        </Box>

        {/* ========== RIGHT PANE: VARIANT EDIT FORM ========== */}
        {isEditorOpen && (
        <Box sx={{ minWidth: 0 }}>
          <Paper sx={{ ...panelSx, p: 2, mb: 1.8 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 1.5 }}
                >
  <Box>
    <Typography sx={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.7, color: "#888" }}>
      EDIT VARIANT
    </Typography>

    <Typography sx={{ fontSize: 16, fontWeight: 800, mt: 0.3, lineHeight: 1.25 }}>
      {form.color || "—"} / {form.size || "—"}
    </Typography>

    <Typography sx={{ fontSize: 9, color: "#777", mt: 0.25 }}>
      SKU: {form.sku || "—"}
    </Typography>
  </Box>

  <Stack direction="row" spacing={0.5}>
    <IconButton
      size="small"
      onClick={() => setNotice("Download media action clicked.")}
    >
      <DownloadOutlined sx={{ fontSize: 17 }} />
    </IconButton>

    <IconButton
      size="small"
      onClick={() => setNotice("Media settings action clicked.")}
    >
      <SettingsOutlined sx={{ fontSize: 17 }} />
    </IconButton>

    <IconButton
      size="small"
      onClick={() => setIsEditorOpen(false)}
      sx={{ color: "#d32f2f" }}
    >
      <Close sx={{ fontSize: 18 }} />
    </IconButton>
  </Stack>
</Stack>

            <Stack spacing={1.4}>
              {/* Product dropdown */}
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel id="product-label">Product</InputLabel>
                <Select
                  labelId="product-label"
                  label="Product"
                  value={form.productId}
                  onChange={handleFormChange("productId")}
                >
                  {productList.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* SKU */}
              <TextField
                size="small"
                label="SKU"
                value={form.sku}
                onChange={handleFormChange("sku")}
                fullWidth
                sx={fieldSx}
              />

              {/* Color + Size + Fit */}
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Color"
                  value={form.color}
                  onChange={handleFormChange("color")}
                  fullWidth
                  sx={fieldSx}
                />
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Size</InputLabel>
                  <Select label="Size" value={form.size} onChange={handleFormChange("size")}>
                    {SIZE_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Fit</InputLabel>
                <Select label="Fit" value={form.fit} onChange={handleFormChange("fit")}>
                  {FIT_OPTIONS.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price + Sale Price */}
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange("price")}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
                <TextField
                  size="small"
                  label="Sale Price"
                  type="number"
                  value={form.salePrice}
                  onChange={handleFormChange("salePrice")}
                  fullWidth
                  sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
              </Stack>

              {/* Status + Seller Type */}
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={form.status} onChange={handleFormChange("status")}>
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Seller Type</InputLabel>
                  <Select label="Seller Type" value={form.sellerType} onChange={handleFormChange("sellerType")}>
                    {SELLER_TYPES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Delivery Date */}
              <TextField
                size="small"
                label="Delivery Date"
                type="date"
                value={form.deliveryDate ? form.deliveryDate.split("T")[0] : ""}
                onChange={handleFormChange("deliveryDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              {/* Warehouse */}
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel>Warehouse</InputLabel>
                <Select
                  label="Warehouse"
                  value={form.warehouseId}
                  onChange={handleFormChange("warehouseId")}
                >
                  {WAREHOUSES.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quantities */}
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Qty Available"
                  type="number"
                  value={form.quantityAvailable}
                  onChange={handleFormChange("quantityAvailable")}
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  size="small"
                  label="Qty Reserved"
                  type="number"
                  value={form.quantityReserved}
                  onChange={handleFormChange("quantityReserved")}
                  fullWidth
                  sx={fieldSx}
                />
              </Stack>

              <TextField
                size="small"
                label="Reorder Level"
                type="number"
                value={form.reorderLevel}
                onChange={handleFormChange("reorderLevel")}
                fullWidth
                sx={fieldSx}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Multiple images upload (kept) */}
            <Typography sx={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, color: "#888", mb: 1 }}>
              VARIANT IMAGES
            </Typography>

            <Box
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleMediaUpload({ target: { files: event.dataTransfer.files, value: "" } });
              }}
              sx={{
                p: 1.6,
                minHeight: 110,
                bgcolor: "#f3f3f5",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                border: "1px dashed #e0e0e3",
                borderRadius: 1.2,
                "&:hover": { bgcolor: "#ededf0", borderColor: "#aaa" },
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
              <Avatar sx={{ width: 36, height: 36, bgcolor: "#fff", color: "#111", mb: 0.8 }}>
                <CloudUploadOutlined sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography sx={{ fontSize: 12, fontWeight: 800 }}>Upload Multiple Angle Shots</Typography>
              <Typography sx={{ fontSize: 9, color: "#666", mt: 0.3 }}>
                JPG / PNG / WEBP · Max 10MB each
              </Typography>
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.4, mb: 0.6 }}>
              <Typography sx={{ fontSize: 8, color: "#888", fontWeight: 800, letterSpacing: 0.5 }}>
                {mediaFiles.length + (selectedVariant?.images || 0)} UPLOADED ANGLES
              </Typography>
              <Typography sx={{ fontSize: 8.5, color: "#b54b24", fontWeight: 700 }}>
                Slot #1 is Primary Listing Hero
              </Typography>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 0.8 }}>
              {mediaFiles.length ? (
                mediaFiles.map((media, index) => (
                    
                  <Box
                    key={media.id}
                    sx={{
                      position: "relative",
                      height: 96,
                      bgcolor: "#eee",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={`http://localhost:5000/api/ecommerce/${media.preview}`}
                      alt={media.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Chip
                      label={index === 0 ? "PRIMARY" : `ANGLE ${index + 1}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        height: 15,
                        fontSize: 7,
                        fontWeight: 800,
                        bgcolor: "#fff",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeMedia(media.id)}
                      sx={{ position: "absolute", top: 2, right: 2, bgcolor: "#fff", width: 18, height: 18 }}
                    >
                      <Close sx={{ fontSize: 11 }} />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <>
                  {["PRIMARY", "BACK", "TEXTURE", "MODEL", "NECKLINE"].map((label, index) => (
                    <Box
                      key={label}
                      sx={{
                        height: 96,
                        bgcolor: ["#343638", "#777b7d", "#55595a", "#45484a", "#252729"][index],
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 0.6,
                        color: "#fff",
                        borderRadius: 1,
                      }}
                    >
                      <Chip
                        label={label}
                        size="small"
                        sx={{
                          alignSelf: "flex-start",
                          height: 15,
                          fontSize: 7,
                          fontWeight: 800,
                          bgcolor: "#fff",
                          color: "#333",
                        }}
                      />
                      <Typography sx={{ fontSize: 7, opacity: 0.8 }}>2400 × 3000</Typography>
                    </Box>
                  ))}
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      height: 96,
                      border: "1px dashed #bbb",
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#777",
                      cursor: "pointer",
                    }}
                  >
                    <AddPhotoAlternateOutlined sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 8, fontWeight: 800, mt: 0.3 }}>Add Slot</Typography>
                  </Box>
                </>
              )}
            </Box>

            {notice && (
              <Typography sx={{ fontSize: 9, color: "#666", mt: 1.2 }} role="status">
                {notice}
              </Typography>
            )}

            <Stack direction="row" spacing={0.8} sx={{ mt: 1.8 }}>
              <Button
                fullWidth
                size="small"
                sx={{ ...pillButtonSx, bgcolor: "#efeff1", color: "#222", fontSize: 9 }}
                onClick={() => setNotice("Media can be applied to other sizes after API integration.")}
              >
                Apply to All {form.color || "Color"} Sizes
              </Button>
              <Button
                fullWidth
                size="small"
                variant="contained"
                sx={{
                  ...pillButtonSx,
                  bgcolor: "#050505",
                  color: "#fff",
                  fontSize: 10,
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={saveVariant}
              >
                Save Variant
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ ...panelSx, p: 1.8 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Warehouse Allocation</Typography>
              <Typography sx={{ fontSize: 8, color: "#888", fontWeight: 800 }}>REAL-TIME SYNC</Typography>
            </Stack>
            <Stack spacing={0.7}>
              {warehousesSummary.map(([name, units]) => (
                <Stack
                  key={name}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ px: 1, py: 0.9, bgcolor: "#f4f4f5", borderRadius: 1 }}
                >
                  <Typography sx={{ fontSize: 9.5, color: "#333" }}>{name}</Typography>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 800 }}>{units} units</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>
)}
      </Box>
      <CreateProductVariantDialog
  open={createDialogOpen}
  onClose={() => setCreateDialogOpen(false)}
  products={productList}
//   warehouses={warehouses}
//   loading={creatingVariant}
//   onSubmit={handleCreateVariant}
/>
    </Box>
  );
}