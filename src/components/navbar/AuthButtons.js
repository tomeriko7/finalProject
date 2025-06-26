import React from "react";
import {
  Typography,
  Box,
  Divider,
  useTheme,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";

import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const AuthButtons = ({ isCompact = false, isMobile = false, onClose }) => {
  const theme = useTheme();
  const isVerySmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    if (onClose) onClose(); // Close mobile drawer if exists
  };

  // Mobile version (for drawer)
  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/login"
            onClick={handleClick}
            sx={{
              borderRadius: 1,
              backgroundColor: theme.palette.primary.main + "20",
              "&:hover": {
                backgroundColor: theme.palette.primary.main + "30",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
              <PersonIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="כניסה למערכת" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/register"
            onClick={handleClick}
            sx={{
              borderRadius: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
              <PersonAddIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="הרשמה חדשה" />
          </ListItemButton>
        </ListItem>
      </Box>
    );
  }

  // Desktop/Tablet version
  if (isCompact || isVerySmall) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button
          component={RouterLink}
          to="/login"
          size="small"
          variant="contained"
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.3, sm: 0.5 },
            minWidth: "auto",
            borderRadius: 2,
          }}
        >
          כניסה
        </Button>

        <Button
          component={RouterLink}
          to="/register"
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.3, sm: 0.5 },
            minWidth: "auto",
            borderRadius: 2,
          }}
        >
          הרשמה
        </Button>
      </Box>
    );
  }

  // Full desktop version
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <RouterLink
        to="/login"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
          transition: "0.3s",
          gap: "4px",
          padding: "8px 12px",
          borderRadius: "8px",
          backgroundColor: theme.palette.primary.main + "20",
        }}
      >
        <PersonIcon
          sx={{
            color: theme.palette.primary.main,
            fontSize: "small",
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { sm: "0.875rem", md: "1rem" },
          }}
        >
          כניסה
        </Typography>
      </RouterLink>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 1, height: "16px", alignSelf: "center" }}
      />

      <RouterLink
        to="/register"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
          transition: "0.3s",
          padding: "8px 12px",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { sm: "0.875rem", md: "1rem" },
          }}
        >
          הרשמה
        </Typography>
      </RouterLink>
    </Box>
  );
};

export default AuthButtons;
