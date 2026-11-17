import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import {
  DashboardOutlined,
  ArticleOutlined,
  LogoutOutlined,
  MenuOpen,
  Menu as MenuIcon,
} from "@mui/icons-material";
import * as actions from "../store/actions"
import { logout } from "../store/slices/authSlice";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
   await dispatch(actions.userLogout());
    navigate("/login", { replace: true });
  };

  const displayName = user ? user.firstName || user.username || "Admin" : "User";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#ffffff"
        width="250px"
        collapsedWidth="80px"
        rootStyles={{
          borderRight: "1px solid #e5e7eb",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Top Section: Brand + Navigation */}
          <Box>
            {/* Brand Header + Collapse Toggle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                px: 2.5,
                py: 2.2,
              }}
            >
              {!collapsed && (
                <Typography variant="h6" fontWeight={700} color="#111">
                  My App
                </Typography>
              )}
              <IconButton
                size="small"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label="Toggle sidebar"
              >
                {collapsed ? <MenuIcon /> : <MenuOpen />}
              </IconButton>
            </Box>

            <Divider />

            {/* Navigation Links */}
            <Menu
              menuItemStyles={{
                button: {
                  margin: "6px 10px",
                  borderRadius: "8px",
                  color: "#4b5563",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                    color: "#111",
                  },
                  // React Router NavLink automatically adds the "active" class
                  "&.active": {
                    backgroundColor: "#111",
                    color: "#ffffff",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <MenuItem
                icon={<DashboardOutlined fontSize="small" />}
                component={<NavLink to="/dashboard" />}
              >
                Dashboard
              </MenuItem>

              <MenuItem
                icon={<ArticleOutlined fontSize="small" />}
                component={<NavLink to="/category" />}
              >
                Category
              </MenuItem>
                 <MenuItem
                icon={<ArticleOutlined fontSize="small" />}
                component={<NavLink to="/sub-category" />}
              >
                Subcategory
              </MenuItem>
              
                 <MenuItem
                icon={<ArticleOutlined fontSize="small" />}
                component={<NavLink to="/product" />}
              >
                Product
              </MenuItem>
            </Menu>
          </Box>

          {/* Bottom Section: User Info + Logout */}
          <Box>
            <Divider />
            {!collapsed && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#111", fontSize: 14 }}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {user?.email || "Active Session"}
                  </Typography>
                </Box>
              </Box>
            )}

            <Menu
              menuItemStyles={{
                button: {
                  margin: "6px 10px 12px",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#fef2f2",
                  },
                },
              }}
            >
              <MenuItem
                icon={<LogoutOutlined fontSize="small" />}
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Sidebar>

      {/* Right Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minWidth: 0, // Prevents wide tables/charts from overflowing flex layout
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}