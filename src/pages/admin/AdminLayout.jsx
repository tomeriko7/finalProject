import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  Container,
  Breadcrumbs,
  Link,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  SafetyDivider,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import { useContext } from "react";

const drawerWidth = 280;

const menuItems = [
  { title: "לוח בקרה", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { title: "ניהול משתמשים", path: "/admin/users", icon: <PeopleIcon /> },
  { title: "ניהול מוצרים", path: "/admin/products", icon: <InventoryIcon /> },
  { title: "ניהול הזמנות", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { title: "הגדרות", path: "/admin/settings", icon: <SettingsIcon /> },
  { title: "חזרה לאתר", path: "/", icon: <HomeIcon /> },
];

export const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Check if user is admin, if not redirect to homepage
  React.useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Function to determine the current page title based on path
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find((item) => item.path === currentPath);
    return currentMenuItem?.title || "לוח בקרה";
  };

  // Function to generate breadcrumbs
  const generateBreadcrumbs = () => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    // Always start with Home
    const breadcrumbs = [
      { label: "בית", path: "/", icon: <HomeIcon fontSize="small" /> },
    ];

    if (pathSegments.includes("admin")) {
      breadcrumbs.push({ label: "ניהול מערכת", path: "/admin/dashboard" });

      const currentMenuItem = menuItems.find(
        (item) => item.path === currentPath
      );
      if (currentMenuItem && currentMenuItem.path !== "/admin/dashboard") {
        breadcrumbs.push({
          label: currentMenuItem.title,
          path: currentMenuItem.path,
        });
      }
    }

    return breadcrumbs;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Admin AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginRight: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", mr: 2 }} // הוספתי כאן רווח
          >
            מערכת ניהול | {getCurrentPageTitle()}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              שלום, {user?.firstName || "מנהל"}
            </Typography>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 36,
                height: 36,
                border: `2px solid ${theme.palette.common.white}`,
              }}
            >
              {user?.firstName?.[0] || "A"}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          ...(open && {
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: "border-box",
              borderLeft: "none",
              borderRight: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "-1px 0px 10px rgba(0,0,0,0.08)",
            },
          }),
          ...(!open && {
            "& .MuiDrawer-paper": {
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: "hidden",
              width: theme.spacing(9),
              boxSizing: "border-box",
              borderLeft: "none",
              borderRight: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "-1px 0px 10px rgba(0,0,0,0.08)",
            },
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "hidden", mt: 2 }}>
          {/* Logo and Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
              px: 3,
              mb: 3,
            }}
          >
            {open && (
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Hatene Admin
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle}>
              <ChevronRightIcon
                sx={{
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.title}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    py: 1.5,
                    borderRadius: "8px",
                    mx: 1,
                    "&.Mui-selected": {
                      backgroundColor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}25`,
                      },
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: "opacity 0.3s",
                      "& .MuiTypography-root": {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "8px",
                  mx: 1,
                  "&:hover": {
                    backgroundColor: `${theme.palette.error.main}15`,
                    color: theme.palette.error.main,
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.error.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="התנתקות"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          marginRight: { xs: 0, sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {generateBreadcrumbs().map((breadcrumb, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={breadcrumb.path}
                  underline="hover"
                  color={
                    index === generateBreadcrumbs().length - 1
                      ? "text.primary"
                      : "inherit"
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight:
                      index === generateBreadcrumbs().length - 1 ? 600 : 400,
                  }}
                >
                  {breadcrumb.icon && (
                    <Box
                      sx={{ mr: 0.5, display: "flex", alignItems: "center" }}
                    >
                      {breadcrumb.icon}
                    </Box>
                  )}
                  {breadcrumb.label}
                </Link>
              ))}
            </Breadcrumbs>
          </Paper>

          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
