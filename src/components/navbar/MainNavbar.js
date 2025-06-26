import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Link,
  Box,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
  Avatar,
  Stack,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Brightness7 as Brightness7Icon,
  Bedtime as BedtimeIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Store as StoreIcon,
  ContactMail as ContactMailIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchComponent from "./SearchComponent";
import CartDropdown from "../cart/CartDropdown";
import FavoritesDropdown from "../favorites/FavoritesDropdown";

const MainNavbar = ({
  user,
  isAdmin,
  theme,
  showSnackbar,
  isMobile,
  isTablet,
  isSmall,
  toggleMode,
  logout,
}) => {
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [favoritesAnchorEl, setFavoritesAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const favoritesCount = useSelector(
    (state) => state.favorites?.favorites?.length || 0
  );
  const cartItemsCount = useSelector(
    (state) =>
      state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
  );

  const navLinks = [
    { title: "דף הבית", path: "/", icon: <HomeIcon /> },
    { title: "אודות", path: "/about", icon: <InfoIcon /> },
    { title: "חנות", path: "/store", icon: <StoreIcon /> },
    { title: "צור קשר", path: "/contact", icon: <ContactMailIcon /> },
  ];

  const userMenuItems = [
    { title: "פרופיל אישי", path: "/profile", icon: <PersonIcon /> },
    {
      title: "היסטוריית הזמנות",
      path: "/profile/orders",
      icon: <HistoryIcon />,
    },
  ];

  if (isAdmin) {
    userMenuItems.push({
      title: "ניהול מערכת",
      path: "/admin/dashboard",
      icon: <AdminPanelSettingsIcon />,
    });
  }

  const handleFavoritesOpen = (event) =>
    setFavoritesAnchorEl(event.currentTarget);
  const handleFavoritesClose = () => setFavoritesAnchorEl(null);
  const toggleMobileDrawer = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    setMobileDrawerOpen(false);
    if (logout) {
      logout();
      navigate("/");
      showSnackbar("התנתקת בהצלחה", "success");
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          background: theme.custom?.navbar || theme.palette.background.default,
          paddingX: { xs: 1, sm: 2, md: 4 },
          direction: "rtl",
          minHeight: { xs: "56px", sm: "64px", md: "70px" },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            direction: "rtl",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 0.5, lg: 1 },
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.title}
                color="inherit"
                component={RouterLink}
                to={link.path}
                sx={{
                  textTransform: "none",
                  px: { md: 1.5, lg: 2 },
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: { md: "0.875rem", lg: "1rem" },
                  transition: "transform 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    color: theme.palette.primary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: { xs: "absolute", md: "static" },
              left: { xs: "50%", md: "auto" },
              transform: { xs: "translateX(-50%)", md: "none" },
            }}
          >
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                "&:hover": { opacity: 0.9 },
              }}
            >
              <Typography
                variant={isSmall ? "h6" : "h5"}
                sx={{
                  fontFamily: "Cinzel",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                    lg: "2rem",
                  },
                  transition: "transform 0.3s ease, letter-spacing 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    letterSpacing: "1px",
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Hatene
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1, md: 1.5 },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <SearchComponent
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                theme={theme}
                showSnackbar={showSnackbar}
                isCompact={isTablet}
              />
            </Box>

            {user && (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Tooltip title="המועדפים שלי">
                  <IconButton
                    color="inherit"
                    onClick={handleFavoritesOpen}
                    sx={{
                      transition: "color 0.2s ease-in-out",
                      color: "#222",
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Badge
                      badgeContent={favoritesCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          minWidth: "16px",
                          height: "16px",
                        },
                      }}
                    >
                      {favoritesCount > 0 ? (
                        <FavoriteIcon
                          fontSize="small"
                          sx={{ color: "inherit" }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="small"
                          sx={{ color: "inherit" }}
                        />
                      )}
                    </Badge>
                  </IconButton>
                </Tooltip>

                <CartDropdown />
              </Box>
            )}

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <IconButton
                color="inherit"
                onClick={() => setSearchOpen(true)}
                size={isSmall ? "small" : "medium"}
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <SearchIcon />
              </IconButton>

              {user && (
                <>
                  <Tooltip title="מועדפים">
                    <IconButton
                      color="inherit"
                      onClick={handleFavoritesOpen}
                      size={isSmall ? "small" : "medium"}
                      sx={{
                        transition: "color 0.2s ease-in-out",
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Badge
                        badgeContent={favoritesCount}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "9px",
                            minWidth: "14px",
                            height: "14px",
                          },
                        }}
                      >
                        {favoritesCount > 0 ? (
                          <FavoriteIcon color="primary" />
                        ) : (
                          <FavoriteBorderIcon color="primary" />
                        )}
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="עגלת קניות">
                    <IconButton
                      color="inherit"
                      component={RouterLink}
                      to="/cart"
                      size={isSmall ? "small" : "medium"}
                      sx={{
                        transition: "color 0.2s ease-in-out",
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Badge
                        badgeContent={cartItemsCount}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "9px",
                            minWidth: "14px",
                            height: "14px",
                          },
                        }}
                      >
                        <ShoppingCartIcon color="primary" />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </>
              )}

              <IconButton
                color="inherit"
                aria-label="פתח תפריט"
                onClick={toggleMobileDrawer}
                size={isSmall ? "small" : "medium"}
                sx={{ p: { xs: 0.5, sm: 1 } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Toolbar>

      {(isMobile || isTablet) && (
        <SearchComponent
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          theme={theme}
          showSnackbar={showSnackbar}
          isMobile={true}
        />
      )}

      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "350px" },
            direction: "rtl",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.primary.main,
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              תפריט ראשי
            </Typography>
            <IconButton onClick={toggleMobileDrawer} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {user && (
            <Box
              sx={{
                p: 2,
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ p: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={toggleMode}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon>
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon sx={{ color: "rgb(232 168 14)" }} />
                  ) : (
                    <BedtimeIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    theme.palette.mode === "dark" ? "מצב יום" : "מצב לילה"
                  }
                  sx={{ textAlign: "right" }}
                />
              </ListItemButton>
            </ListItem>
          </Box>

          <Divider />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <Typography
              variant="overline"
              sx={{
                p: 2,
                pb: 1,
                color: theme.palette.text.secondary,
                fontWeight: "bold",
                display: "block",
              }}
            >
              ניווט
            </Typography>

            <List sx={{ px: 1 }}>
              {navLinks.map((link) => (
                <ListItem key={link.title} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={RouterLink}
                    to={link.path}
                    onClick={toggleMobileDrawer}
                    sx={{
                      borderRadius: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.light}20`,
                        transform: "translateX(-4px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={link.title}
                      sx={{ textAlign: "right" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {user && (
              <>
                <Typography
                  variant="overline"
                  sx={{
                    p: 2,
                    pb: 1,
                    color: theme.palette.text.secondary,
                    fontWeight: "bold",
                    display: "block",
                  }}
                >
                  חשבון אישי
                </Typography>

                <List sx={{ px: 1 }}>
                  {userMenuItems.map((item) => (
                    <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={RouterLink}
                        to={item.path}
                        onClick={toggleMobileDrawer}
                        sx={{
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.light}20`,
                            transform: "translateX(-4px)",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{ textAlign: "right" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>

          <Box
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              p: 2,
            }}
          >
            {user ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "right",
                  borderRadius: 2,
                }}
              >
                התנתק
              </Button>
            ) : (
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                  onClick={toggleMobileDrawer}
                  startIcon={<PersonIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  כניסה למערכת
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                  onClick={toggleMobileDrawer}
                  sx={{ borderRadius: 2 }}
                >
                  הרשמה
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

      <FavoritesDropdown
        anchorEl={favoritesAnchorEl}
        onClose={handleFavoritesClose}
        isMobile={isMobile}
      />
    </>
  );
};

export default MainNavbar;
