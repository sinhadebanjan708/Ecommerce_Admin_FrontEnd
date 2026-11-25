import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Badge,
} from "@mui/material";
import {
  Search,
  Download,
  LocalShipping,
  Inventory2,
  Replay,
  Add,
  Print,
  Description,
  PauseCircleOutlined,
  Close,
  MoreHoriz,
  CheckCircleOutlined,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import * as actions from "../store/actions"
import { useDispatch, useSelector } from "react-redux";

// ---------- Mock Data ----------
const ORDERS = [
  {
    id: "AT-88492",
    date: "Today, 14:15 EST",
    client: "Elena Rostova",
    email: "elena.rostova@studioatelier.com",
    badge: "NOIR VIP",
    avatar: "ER",
    items: 2,
    preview: "Boxy Tee + C",
    total: 114.9,
    payment: "Apple Pay",
    status: "OUT FOR DELIVERY",
    statusColor: "#e65100",
  },
  {
    id: "AT-88491",
    date: "Today, 12:40 EST",
    client: "Marcus Vance",
    email: "vance.m@archetype.co",
    badge: null,
    avatar: "MV",
    items: 1,
    preview: "Heavy Wool Co",
    total: 520.0,
    payment: "Paid (Visa ••4091)",
    status: null,
  },
  {
    id: "AT-88489",
    date: "Yesterday, 18:22",
    client: "Chloe Chen",
    email: "chloechen.design@gmail.com",
    badge: "CLUB MEMBER",
    avatar: "CC",
    items: 3,
    preview: "Linen Shirt",
    total: 194.0,
    payment: "Paid (Mastercard)",
    status: null,
  },
  {
    id: "AT-88485",
    date: "Oct 21, 09:12",
    client: "Liam Gallagher",
    email: "liam.g@soundstudio.uk",
    badge: null,
    avatar: "LG",
    items: 1,
    preview: "Washed Charc",
    total: 45.0,
    payment: "Paid (Klarna 1/4)",
    status: null,
  },
  {
    id: "AT-88480",
    date: "Oct 20, 16:45",
    client: "Sophia Al-Mansoor",
    email: "s.almansoor@dubaiholdings.ae",
    badge: "NOIR VIP",
    avatar: "SA",
    items: 2,
    preview: "Ivory Blazer",
    total: 310.0,
    payment: "Paid (Amex)",
    status: null,
  },
];

// Generate more rows for pagination demo
const EXTRA_ORDERS = Array.from({ length: 40 }, (_, i) => ({
  id: `AT-${88400 - i}`,
  date: `Oct ${19 - (i % 10)}, ${10 + (i % 8)}:${20 + (i % 30)} EST`,
  client: ["Alex Rivera", "Priya Sharma", "James Okonkwo", "Mia Chen", "Noah Kim"][i % 5],
  email: `client${i}@example.com`,
  badge: i % 7 === 0 ? "NOIR VIP" : i % 11 === 0 ? "CLUB MEMBER" : null,
  avatar: ["AR", "PS", "JO", "MC", "NK"][i % 5],
  items: (i % 3) + 1,
  preview: ["Boxy Tee", "Linen Shirt", "Wool Coat", "Chino", "Crew"][i % 5],
  total: 45 + (i % 12) * 25,
  payment: ["Paid (Visa)", "Paid (Amex)", "Apple Pay", "Paid (Klarna)"][i % 4],
  status: null,
}));

const ALL_ORDERS = [...ORDERS, ...EXTRA_ORDERS];

const panelSx = {
  border: "1px solid #ececef",
  borderRadius: 2,
  boxShadow: "none",
  backgroundColor: "#fff",
};

const pillSx = {
  borderRadius: 99,
  textTransform: "none",
  fontSize: 12,
  fontWeight: 600,
  px: 1.8,
  boxShadow: "none",
};

export default function OrdersFulfillment() {
  const dispatch = useDispatch();
  const orderFullfilmentList = useSelector((state)=> state.orderFullfilment.orderFullfilmentList)
  const totalOrders = useSelector((state)=> state.orderFullfilment.totalOrders)
  const [selectedOrderId, setSelectedOrderId] = useState(orderFullfilmentList && orderFullfilmentList.length > 0 && orderFullfilmentList[0]?.orderId);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState("All");
  const [fulfillFilter, setFulfillFilter] = useState("All");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const selectedOrder = orderFullfilmentList?.find((o) => o.orderId === selectedOrderId) || orderFullfilmentList && orderFullfilmentList.length > 0 && orderFullfilmentList[0];

  React.useEffect(() => {
    dispatch(actions.fetchAllOrderFullfilment(pagination.pageIndex + 1,pagination.pageSize,""))
  }, [pagination.pageIndex,pagination.pageSize])

  console.log('order admin list__',orderFullfilmentList)
  console.log('selected order __',selectedOrder)
  

  const filteredData = useMemo(() => {
    return ALL_ORDERS.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q);
      return matchesSearch;
    });
  }, [search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ORDER & DATE",
        size: 160,
        Cell: ({ row }) => {
          const o = row.original;
          const selected = o.id === selectedOrderId;
          return (
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 0.6,
                  border: "1.5px solid #ccc",
                  bgcolor: selected ? "#111" : "transparent",
                }}
              />
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>#{o.orderId}</Typography>
                <Typography sx={{ fontSize: 11, color: "#888" }}>{o.createdAt}</Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "client",
        header: "CLIENT",
        size: 240,
        Cell: ({ row }) => {
          const client = row.original.user;
          return (
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  fontWeight: 700,
                  bgcolor: "#f0f0f2",
                  color: "#333",
                }}
              >
                {client.avatar}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                    {client.name}
                  </Typography>
                  {client.badge && (
                    <Chip
                      label={client.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 9,
                        fontWeight: 700,
                        bgcolor: o.badge.includes("VIP") ? "#1a1a1a" : "#e8e8ea",
                        color: o.badge.includes("VIP") ? "#fff" : "#444",
                      }}
                    />
                  )}
                </Stack>
                <Typography sx={{ fontSize: 11, color: "#888" }} noWrap>
                  {client.email}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "orderItems",
        header: "GARMENTS PREVIEW",
        size: 180,
        Cell: ({ row }) => {
          const o = row.original;
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: "#f3f3f5",
                  border: "1px solid #e5e5e5",
                }}
              />
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                  {o.orderItems.length} item{o.orderItems.length > 1 ? "s" : ""}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#888" }}>{o.orderItems.map((e)=> e.productName)}</Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        accessorKey: "totalAmount",
        header: "TOTAL & PAYMENT",
        size: 150,
        Cell: ({ row }) => {
          const o = row.original;
          return (
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                ${o.totalAmount}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#2e7d32" }}>{o.paymentMethod}</Typography>
            </Box>
          );
        },
      },
    ],
    [selectedOrderId]
  );

  const selectedOrderIds = Object.keys(rowSelection)
  .filter((key) => rowSelection[key])
  .map((key) => Number(key));


const table = useMaterialReactTable({
  columns,
  data: orderFullfilmentList || [],

  enableTopToolbar: false,
  enableBottomToolbar: true,
  enableColumnActions: false,
  enableSorting: false,
  enableColumnFilters: false,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableHiding: false,

  // Enable checkboxes
  enableRowSelection: true,
  enableMultiRowSelection: true,

  manualPagination: true,
  rowCount: totalOrders || 0,

  onRowSelectionChange: setRowSelection,
  onPaginationChange: setPagination,

  state: {
    pagination,
    rowSelection,
  },

  initialState: {
    pagination: {
      pageSize: 8,
      pageIndex: 0,
    },
  },

  muiTablePaperProps: {
    elevation: 0,
    sx: {
      borderRadius: 0,
      boxShadow: "none",
      border: "none",
    },
  },

  muiTableContainerProps: {
    sx: { maxHeight: 520 },
  },

  muiTableHeadCellProps: {
    sx: {
      fontSize: 10,
      fontWeight: 700,
      color: "#888",
      letterSpacing: 0.4,
      borderBottom: "1px solid #eee",
      bgcolor: "#fafafa",
      py: 1.2,
    },
  },

  muiTableBodyCellProps: {
    sx: {
      borderBottom: "1px solid #f0f0f2",
      py: 1.4,
      px: 1.5,
      verticalAlign: "middle",
    },
  },

  muiTableBodyRowProps: ({ row }) => ({
    onClick: () =>{ 
        setSelectedOrderId(row.original.orderId)
    },
    sx: {
      cursor: "pointer",
      bgcolor:
        row.original.id === selectedOrderId ? "#f8f8fa" : "#fff",
      "&:hover": { bgcolor: "#f5f5f7" },
    },
  }),

  muiPaginationProps: {
    rowsPerPageOptions: [8, 15, 25],
    showFirstButton: false,
    showLastButton: false,
    sx: { fontSize: 12 },
  },
});
//   const table = useMaterialReactTable({
//     columns,
//     data: orderFullfilmentList || [],
//     enableTopToolbar: false,
//     enableBottomToolbar: true,
//     enableColumnActions: false,
//     enableSorting: false,
//     enableColumnFilters: false,
//     enableDensityToggle: false,
//     enableFullScreenToggle: false,
//     enableHiding: false,
//     enableRowSelection: false,
//     manualPagination: true,
//     rowCount: totalOrders || 0,
//     onRowSelectionChange: setRowSelection,
//   onPaginationChange: setPagination,

//   state: {
//     pagination,
//     rowSelection,
//   },
//     initialState: { pagination: { pageSize: 8, pageIndex: 0 } },
//     muiTablePaperProps: {
//       elevation: 0,
//       sx: { borderRadius: 0, boxShadow: "none", border: "none" },
//     },
//     muiTableContainerProps: { sx: { maxHeight: 520 } },
//     muiTableHeadCellProps: {
//       sx: {
//         fontSize: 10,
//         fontWeight: 700,
//         color: "#888",
//         letterSpacing: 0.4,
//         borderBottom: "1px solid #eee",
//         bgcolor: "#fafafa",
//         py: 1.2,
//       },
//     },
//     muiTableBodyCellProps: {
//       sx: {
//         borderBottom: "1px solid #f0f0f2",
//         py: 1.4,
//         px: 1.5,
//         verticalAlign: "middle",
//       },
//     },
//     muiTableBodyRowProps: ({ row }) => ({
//       onClick: () => setSelectedOrderId(row.original.id),
//       sx: {
//         cursor: "pointer",
//         bgcolor: row.original.id === selectedOrderId ? "#f8f8fa" : "#fff",
//         "&:hover": { bgcolor: "#f5f5f7" },
//       },
//     }),
//     muiPaginationProps: {
//       rowsPerPageOptions: [8, 15, 25],
//       showFirstButton: false,
//       showLastButton: false,
//       sx: { fontSize: 12 },
//     },
//   });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f7f9", color: "#171717" }}>

      {/* Main */}
      <Box sx={{ flex: 1, p: { xs: 1.5, md: 2.5 }, overflow: "auto" }}>
        {/* Top bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: 12, color: "#888" }}>Atelier Platform</Typography>
            <Typography sx={{ fontSize: 12, color: "#bbb" }}>/</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Console</Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Valentin Laurent</Typography>
            <Typography sx={{ fontSize: 11, color: "#888" }}>LEAD CURATOR</Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#111", fontSize: 13 }}>VL</Avatar>
          </Stack>
        </Stack>

        {/* Title + actions */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "flex-start" }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#666" }}>
                LOGISTICS ENGINE
              </Typography>
              <Chip
                label="LIVE SYNCHRONIZED"
                size="small"
                sx={{ height: 18, fontSize: 9, fontWeight: 700, bgcolor: "#e8f5e9", color: "#2e7d32" }}
              />
            </Stack>
            <Typography sx={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
              Orders & Fulfillment
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#777", mt: 0.3, maxWidth: 520 }}>
              Monitor client purchases in real time, automate Atelier dispatch logistics, handle
              returns, and print courier air waybills.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button startIcon={<Download sx={{ fontSize: 16 }} />} sx={{ ...pillSx, bgcolor: "#f0f0f2" }}>
              Export CSV
            </Button>
            <Button startIcon={<Description sx={{ fontSize: 16 }} />} sx={{ ...pillSx, bgcolor: "#f0f0f2" }}>
              Bulk Slips (12)
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ ...pillSx, bgcolor: "#111", color: "#fff", "&:hover": { bgcolor: "#333" } }}
            >
              Create Manual Order
            </Button>
          </Stack>
        </Stack>

        {/* Stats cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          {[
            {
              title: "TOTAL ORDERS",
              value: "1,482",
              sub: "+18.4%",
              foot: "vs. previous 30 calendar days",
              color: "#111",
            },
            {
              title: "AWAITING FULFILLMENT",
              value: "24",
              sub: "Urgent dispatch",
              foot: "16 orders scheduled for morning courier",
              color: "#e65100",
              accent: true,
            },
            {
              title: "IN TRANSIT / OUT",
              value: "68",
              sub: "Live GPS feed",
              foot: "42 via Atelier White-Glove, 26 FedEx",
              color: "#1565c0",
            },
            {
              title: "RETURNS / EXCHANGES",
              value: "5",
              sub: "Pending inspection",
              foot: "0.3% return rate across collections",
              color: "#6a1b9a",
            },
          ].map((card) => (
            <Paper key={card.title} sx={{ ...panelSx, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#888" }}>
                  {card.title}
                </Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: card.color }} />
              </Stack>
              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{card.value}</Typography>
                <Typography sx={{ fontSize: 12, color: card.accent ? "#e65100" : "#666" }}>
                  {card.sub}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 11, color: "#888", mt: 0.8 }}>{card.foot}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Filters + Table + Detail */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1fr 340px" },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* Left: filters + table */}
          <Paper sx={{ ...panelSx, overflow: "hidden" }}>
            {/* Filter row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "center" }}
              sx={{ p: 1.5, borderBottom: "1px solid #eee" }}
            >
              <TextField
                size="small"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 220 },
                  "& .MuiOutlinedInput-root": {
                    height: 34,
                    borderRadius: 99,
                    fontSize: 12,
                    bgcolor: "#fafafa",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 16, color: "#999" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                size="small"
                value={payFilter}
                onChange={(e) => setPayFilter(e.target.value)}
                sx={{ height: 34, fontSize: 12, borderRadius: 99, minWidth: 110 }}
              >
                <MenuItem value="All">PAY: All (Paid, Pend.)</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
              <Select
                size="small"
                value={fulfillFilter}
                onChange={(e) => setFulfillFilter(e.target.value)}
                sx={{ height: 34, fontSize: 12, borderRadius: 99, minWidth: 130 }}
              >
                <MenuItem value="All">FULFILLMENT: All Services</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
              </Select>
              <Chip label="Last 30 Days" size="small" sx={{ height: 28, fontSize: 11 }} />
            </Stack>

            {/* Status tabs */}
            <Stack direction="row" spacing={0.5} sx={{ px: 1.5, pt: 1.2, pb: 0.5, flexWrap: "wrap" }}>
              {[
                { label: "All Orders", count: 1482 },
                { label: "Unfulfilled", count: 24, accent: true },
                { label: "Processing & Packing", count: 38 },
                { label: "Shipped / In Trans", count: 68 },
              ].map((t, i) => (
                <Chip
                  key={t.label}
                  label={`${t.label} ${t.count}`}
                  onClick={() => setTab(i)}
                  sx={{
                    height: 28,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: tab === i ? "#111" : "#f0f0f2",
                    color: tab === i ? "#fff" : "#333",
                    "&:hover": { bgcolor: tab === i ? "#333" : "#e5e5e7" },
                  }}
                />
              ))}
            </Stack>

            {/* Selection bar */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.5, py: 1, bgcolor: "#f8f8fa", borderBottom: "1px solid #eee" }}
            >
              <Typography sx={{ fontSize: 12, color: "#555" }}>
                1 order selected &nbsp;•&nbsp; (#{selectedOrderId} active in dispatch inspector)
              </Typography>
              <Stack direction="row" spacing={0.8}>
                <Button size="small" startIcon={<Print sx={{ fontSize: 14 }} />} sx={{ ...pillSx, bgcolor: "#fff", fontSize: 11 }}>
                  Print Thermal Label
                </Button>
                <Button size="small" startIcon={<Description sx={{ fontSize: 14 }} />} sx={{ ...pillSx, bgcolor: "#fff", fontSize: 11 }}>
                  Mark Manifest
                </Button>
                <Button size="small" startIcon={<PauseCircleOutlined sx={{ fontSize: 14 }} />} sx={{ ...pillSx, bgcolor: "#fff", fontSize: 11 }}>
                  Hold Order
                </Button>
              </Stack>
            </Stack>

            <MaterialReactTable table={table} />
          </Paper>

          {/* Right: Order detail */}
          <Paper sx={{ ...panelSx, p: 2, position: "sticky", top: 16 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800 }}>Order #{selectedOrder?.orderId}</Typography>
                {selectedOrder?.paymentStatus && (
                  <Chip
                    label={`PAYMENT STATUS :${selectedOrder.paymentStatus}`}
                    size="small"
                    sx={{
                      mt: 0.6,
                      height: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: "#fff3e0",
                      color: "#e65100",
                    }}
                  />
                )}
                {selectedOrder?.orderStatus && (
                  <Chip
                    label={`ORDER STATUS : ${selectedOrder?.orderStatus}`}
                    size="small"
                    sx={{
                      mt: 0.6,
                      height: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: "#fff3e0",
                      color: "#e65100",
                    }}
                  />
                )}
              </Box>
              <IconButton size="small">
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            {/* <Typography sx={{ fontSize: 11, color: "#888", mb: 1.5 }}>
              Arriving Today · ~6 PM
            </Typography> */}

            {/* Recipient */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 0.4, mb: 0.8 }}>
                RECIPIENT PROFILE
              </Typography>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#111", fontSize: 13 }}>
                  {selectedOrder?.avatar}
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{selectedOrder?.user.name}</Typography>
                    {selectedOrder?.badge && (
                      <Chip
                        label={selectedOrder.badge}
                        size="small"
                        sx={{ height: 18, fontSize: 9, fontWeight: 700, bgcolor: "#111", color: "#fff" }}
                      />
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>{selectedOrder?.user.email}</Typography>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>+91 {selectedOrder?.user.phone}</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Destination */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f8f8fa", borderRadius: 1.5 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#888", mb: 0.6 }}>
                FULFILLMENT DESTINATION
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{selectedOrder?.address.addressLine1}</Typography>
              <div style={{display:"flex",justifyContent:"space-between", rowGap:"20px"}}>
                <Typography sx={{ fontSize: 12, color: "#666" }}>{selectedOrder?.address.city}</Typography>
                <Typography sx={{ fontSize: 12, color: "#666" }}>{selectedOrder?.address.state}</Typography>

              </div>
              <Typography sx={{ fontSize: 11, color: "#888", mt: 0.8 }}>
                {selectedOrder?.address.pincode}
              </Typography>
            </Box>

            {/* Garments */}
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 0.4, mb: 1 }}>
              ITEMS ORDERED ({selectedOrder?.orderItems?.length}) · Stock Verified
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
              {selectedOrder?.orderItems?.map((g) => (
                <Stack key={g.orderItemId} direction="row" spacing={1.2} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: "#eee" }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{g.productName}</Typography>
                    <Typography sx={{ fontSize: 10, color: "#888" }}>SIZE: {g.size}</Typography>
                    <Typography sx={{ fontSize: 10, color: "#aaa" }}>SKU: {g.sku}</Typography>
                    {/* <Typography sx={{ fontSize: 10, color: "#aaa" }}>FIT: {g.fit}</Typography> */}
                  </Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>₹{g.unitPrice.toFixed(2)}</Typography>
                </Stack>
              ))}
              {selectedOrder?.orderItems.length == 0 && <p>No order items available!</p>}
            </Stack>

            {/* Courier */}
            {/* <Box sx={{ mb: 2, p: 1.5, border: "1px solid #eee", borderRadius: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#888" }}>COURIER DISPATCH</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.3 }}>FX-992014028</Typography>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>FedEx Priority White-Glove</Typography>
                </Box>
                <Button size="small" sx={{ ...pillSx, bgcolor: "#f0f0f2", fontSize: 11 }}>
                  Track Courier
                </Button>
              </Stack>
            </Box> */}

            {/* Totals */}
            <Stack spacing={0.6} sx={{ mb: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12, color: "#666" }}>Subtotal ({selectedOrder?.orderItems?.length} items)</Typography>
                <Typography sx={{ fontSize: 12 }}>{ selectedOrder?.totalAmount}</Typography>
              </Stack>
              {/* <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12, color: "#666" }}>VIP Code: SUMMER20</Typography>
                <Typography sx={{ fontSize: 12, color: "#c62828" }}>-$34.60</Typography>
              </Stack> */}
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12, color: "#666" }}>Qikink Shipping</Typography>
                <Typography sx={{ fontSize: 12 }}>Complimentary</Typography>
              </Stack>
              {/* <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 12, color: "#666" }}>Estimated NY State Tax</Typography>
                <Typography sx={{ fontSize: 12 }}>$8.00</Typography>
              </Stack> */}
              <Divider sx={{ my: 0.8 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>Total Collected</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>₹{selectedOrder?.totalAmount}</Typography>
              </Stack>
              <Typography sx={{ fontSize: 10, color: "#888" }}>
                Authorized via Apple Pay (Device ending in ••8201)
              </Typography>
            </Stack>

            {/* Audit trail */}
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 0.4, mb: 1 }}>
              FULFILLMENT AUDIT TRAIL
            </Typography>
            {/* <Stack spacing={1} sx={{ mb: 2.5 }}>
              {[
                { label: "Order Placed by Client", time: "Oct 22, 14:15 EST · Online Checkout", done: true },
                { label: "Quality Checked & Packaged", time: "Oct 22, 15:30 EST · Brooklyn Atelier Studio #2", done: true },
                { label: "Handed to White-Glove Courier", time: "Oct 22, 16:10 EST · Driver Mateo R. (Truck #08)", done: false },
              ].map((step) => (
                <Stack key={step.label} direction="row" spacing={1} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: step.done ? "#2e7d32" : "#e65100",
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{step.label}</Typography>
                    <Typography sx={{ fontSize: 10, color: "#888" }}>{step.time}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack> */}

            <Button
              fullWidth
              variant="contained"
              sx={{ ...pillSx, bgcolor: "#111", color: "#fff", py: 1.2, mb: 1, "&:hover": { bgcolor: "#333" } }}
            >
              Update Status / Mark Delivered
            </Button>
            <Stack direction="row" spacing={1}>
              <Button fullWidth size="small" sx={{ ...pillSx, bgcolor: "#f0f0f2", fontSize: 11 }}>
                Packing Slip
              </Button>
              <Button fullWidth size="small" sx={{ ...pillSx, bgcolor: "#f0f0f2", fontSize: 11 }}>
                Issue Return
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}