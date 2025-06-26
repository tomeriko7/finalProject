import React, { useState, useContext } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";

const AdminMenu = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);

  const handleAdminMenuClose = () => setAdminMenuAnchorEl(null);

  // Admin menu options
  const adminMenuItems = [
    {
      title: "לוח בקרה",
      path: "/admin/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      title: "ניהול משתמשים",
      path: "/admin/users",
      icon: <PeopleIcon fontSize="small" />,
    },
    {
      title: "ניהול מוצרים",
      path: "/admin/products",
      icon: <InventoryIcon fontSize="small" />,
    },
    {
      title: "ניהול הזמנות",
      path: "/admin/orders",
      icon: <ReceiptLongIcon fontSize="small" />,
    },
    {
      title: "הגדרות",
      path: "/admin/settings",
      icon: <SettingsIcon fontSize="small" />,
    },
  ];

  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return null;
  }

  return (
    <Menu
      anchorEl={adminMenuAnchorEl}
      open={Boolean(adminMenuAnchorEl)}
      onClose={handleAdminMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          direction: "rtl",
          mt: 1,
          width: 240,
          borderRadius: 2,
          overflow: "visible",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 20,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      {adminMenuItems.map((item) => (
        <MenuItem
          key={item.title}
          component={RouterLink}
          to={item.path}
          onClick={handleAdminMenuClose}
          sx={{
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}30`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default AdminMenu;
