import React, { useState, useContext } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Typography,
  ListItem,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";

import {
  Person as PersonIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  History as HistoryIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import { useLogout } from "../../hooks/useLogout";

const UserMenu = ({
  user,
  isAdmin,
  theme,
  showSnackbar,
  isCompact = false,
  isMobile = false,
  onClose,
}) => {
  const { logout: contextLogout } = useContext(AuthContext);
  const { logout, isClearing } = useLogout();
  const navigate = useNavigate();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const isVerySmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleUserMenuOpen = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleLogout = async () => {
    handleUserMenuClose();
    if (onClose) onClose(); // Close mobile drawer if exists

    try {
      await logout(); // השימוש ב-hook החדש שמנקה הכל
      navigate("/");
      showSnackbar("התנתקת בהצלחה ", "success");
    } catch (error) {
      showSnackbar("שגיאה בהתנתקות", "error");
    }
  };

  const handleMenuItemClick = (callback) => {
    handleUserMenuClose();
    if (onClose) onClose(); // Close mobile drawer if exists
    if (callback) callback();
  };

  // Mobile version (for drawer)
  if (isMobile) {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        {/* User Info Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            p: 1,
            backgroundColor: theme.palette.primary.light + "20",
            borderRadius: 1,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: theme.palette.primary.main,
              fontSize: "1rem",
            }}
          >
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/profile"
              onClick={() => handleMenuItemClick()}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="פרופיל אישי" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/profile/orders"
              onClick={() => handleMenuItemClick()}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                <HistoryIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="היסטוריית הזמנות" />
            </ListItemButton>
          </ListItem>

          {isAdmin && (
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/admin/dashboard"
                onClick={() => handleMenuItemClick()}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <AdminPanelSettingsIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="ניהול מערכת" />
              </ListItemButton>
            </ListItem>
          )}

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.light + "20",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 2, color: "inherit" }}>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="התנתק" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    );
  }

  // Desktop/Tablet version
  return (
    <>
      <Button
        onClick={handleUserMenuOpen}
        sx={{
          textTransform: "none",
          color: theme.palette.primary.main,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          px: { xs: 1, sm: 1.5 },
          py: { xs: 0.5, sm: 1 },
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          minWidth: "auto",
        }}
      >
        {!isCompact && (
          <Avatar
            sx={{
              width: { xs: 24, sm: 28, md: 32 },
              height: { xs: 24, sm: 28, md: 32 },
              backgroundColor: theme.palette.primary.main,
              fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
            }}
          >
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </Avatar>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "right",
          }}
        >
          <Typography
            variant={isVerySmall ? "caption" : "body2"}
            sx={{
              fontWeight: "bold",
              lineHeight: 1.2,
              maxWidth: { xs: "80px", sm: "120px", md: "none" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {isCompact ? user.firstName : `${user.firstName} ${user.lastName}`}
          </Typography>
          {!isCompact && !isVerySmall && (
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Box>

        {!isCompact && (
          <KeyboardArrowDownIcon fontSize={isVerySmall ? "small" : "medium"} />
        )}
      </Button>

      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            direction: "rtl",
            minWidth: { xs: 180, sm: 200, md: 220 },
            maxWidth: 300,
            mt: 1,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {/* User Info in Menu Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <MenuItem
          component={RouterLink}
          to="/profile"
          onClick={() => handleMenuItemClick()}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: { xs: "0.875rem", md: "1rem" },
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <PersonIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="פרופיל אישי" />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="/profile/orders"
          onClick={() => handleMenuItemClick()}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: { xs: "0.875rem", md: "1rem" },
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <HistoryIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="היסטוריית הזמנות" />
        </MenuItem>

        {isAdmin && (
          <MenuItem
            component={RouterLink}
            to="/admin/dashboard"
            onClick={() => handleMenuItemClick()}
            sx={{
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: { xs: "0.875rem", md: "1rem" },
              "&:hover": {
                backgroundColor: `${theme.palette.primary.light}20`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <AdminPanelSettingsIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="ניהול מערכת" />
          </MenuItem>
        )}

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.error.main,
            fontSize: { xs: "0.875rem", md: "1rem" },
            "&:hover": {
              backgroundColor: `${theme.palette.error.light}20`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="התנתק" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
