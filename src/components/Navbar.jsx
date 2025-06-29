import React, { useContext, useState } from "react";
import {
  AppBar,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { AuthContext } from "../services/AuthContext";
import { ThemeContext } from "../services/ThemeContext";
import TopHeader from "./navbar/TopHeader";
import MainNavbar from "./navbar/MainNavbar";
import AdminMenu from "./navbar/AdminMenu";
import { useLogout } from "../hooks/useLogout";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useLogout();
  const { toggleMode } = useContext(ThemeContext);
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Global snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.isAdmin;

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: theme.custom?.navbar || theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        direction: "rtl",
        // Responsive padding
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Top Header - מסתיר במסכים קטנים מאוד */}
      {!isSmall && (
        <TopHeader 
          user={user}
          isAdmin={isAdmin}
          theme={theme}
          toggleMode={toggleMode}
          showSnackbar={showSnackbar}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      )}

      {/* Main Navbar */}
      <MainNavbar 
        user={user}
        isAdmin={isAdmin}
        theme={theme}
        showSnackbar={showSnackbar}
        isMobile={isMobile}
        isTablet={isTablet}
        isSmall={isSmall}
        toggleMode={toggleMode}
        logout={logout}
      />

      {/* Admin Menu Component */}
      <AdminMenu />

      {/* Global Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ 
          vertical: isMobile ? "bottom" : "top", 
          horizontal: "center" 
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            width: "100%",
            fontSize: { xs: "0.875rem", md: "1rem" }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};