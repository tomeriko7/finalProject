import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Link,
  Box,
  Divider,
  Tooltip,
  Collapse,
  useMediaQuery,
} from "@mui/material";

import {
  Brightness7 as Brightness7Icon,
  Bedtime as BedtimeIcon,
  MailOutline as MailOutlineIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

import UserMenu from "./UserMenu";
import AuthButtons from "./AuthButtons";

const TopHeader = ({ user, isAdmin, theme, toggleMode, showSnackbar, isMobile, isTablet }) => {
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const [contactExpanded, setContactExpanded] = useState(false);
  
  // Extra small screens
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleAdminMenuOpen = (event) =>
    setAdminMenuAnchorEl(event.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchorEl(null);

  return (
    <Toolbar
      sx={{
        background: theme.custom?.navbar || theme.palette.background.default,
        minHeight: { xs: "40px", sm: "48px", md: "56px" },
        paddingX: { xs: 1, sm: 2, md: 4 },
        color: theme.palette.text.primary,
        direction: "rtl",
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          direction: "rtl",
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* User Actions - צד שמאל ב-RTL */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: { xs: 0.5, sm: 1 },
          order: { xs: 1, md: 1 },
          flexWrap: "wrap",
        }}>
          {/* Theme Toggle */}
          <IconButton 
            onClick={toggleMode} 
            color="inherit"
            size={isXs ? "small" : "medium"}
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon sx={{ 
                color: "rgb(232 168 14)",
                fontSize: { xs: "1.2rem", sm: "1.5rem" }
              }} />
            ) : (
              <BedtimeIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
            )}
          </IconButton>

          {!isXs && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, height: "16px", alignSelf: "center" }}
            />
          )}

          

          {/* Login/User Menu */}
          {user ? (
            <UserMenu 
              user={user} 
              isAdmin={isAdmin} 
              theme={theme} 
              showSnackbar={showSnackbar}
              isCompact={isXs}
            />
          ) : (
            <AuthButtons isCompact={isXs} />
          )}
        </Box>

        {/* Contact Info - צד ימין ב-RTL */}
        <Box sx={{ 
          display: { xs: "none", sm: "flex", md: "flex" },
          gap: { sm: 2, md: 3 },
          order: { xs: 2, md: 2 },
          width: { xs: "100%", md: "auto" },
        }}>
          {/* Desktop Contact */}
          {!isMobile ? (
            <>
              <Link
                href="mailto:info@hatene.com"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  gap: 0.5,
                  fontSize: { sm: "0.875rem", md: "1rem" },
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                <MailOutlineIcon sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: { sm: "small", md: "medium" },
                }} />
                <Typography variant="body2">info@hatene.com</Typography>
              </Link>

              <Link
                href="tel:+972050000000"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  gap: 0.5,
                  fontSize: { sm: "0.875rem", md: "1rem" },
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                <PhoneIcon sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: { sm: "small", md: "medium" },
                }} />
                <Typography variant="body2">+972 50-000-0000</Typography>
              </Link>
            </>
          ) : (
            /* Tablet/Mobile Contact - Collapsible */
            <Box sx={{ width: "100%" }}>
              <Button
                onClick={() => setContactExpanded(!contactExpanded)}
                size="small"
                sx={{
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  fontSize: "0.75rem",
                }}
                endIcon={contactExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                פרטי התקשרות
              </Button>
              
              <Collapse in={contactExpanded}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 1, 
                  mt: 1,
                  alignItems: "flex-end"
                }}>
                  <Link
                    href="mailto:info@hatene.com"
                    color="inherit"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      gap: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    <MailOutlineIcon sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: "small",
                    }} />
                    <Typography variant="caption">info@hatene.com</Typography>
                  </Link>

                  <Link
                    href="tel:+972050000000"
                    color="inherit"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      gap: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    <PhoneIcon sx={{ 
                      color: theme.palette.primary.main,
                      fontSize: "small",
                    }} />
                    <Typography variant="caption">+972 50-000-0000</Typography>
                  </Link>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Container>
    </Toolbar>
  );
};

export default TopHeader;