import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Grid,
  Link,
  Box,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Divider,
  Snackbar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Search as SearchIcon,
  MailOutline as MailOutlineIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Language as LanguageIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import { ThemeContext } from "../services/ThemeContext";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { toggleMode } = useContext(ThemeContext);
  const theme = useTheme();
  // State for all menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [pagesMenuAnchorEl, setPagesMenuAnchorEl] = useState(null);
  const [shopNestedMenuAnchorEl, setShopNestedMenuAnchorEl] = useState(null);
  const [portfolioNestedMenuAnchorEl, setPortfolioNestedMenuAnchorEl] =
    useState(null);
  const [blogNestedMenuAnchorEl, setBlogNestedMenuAnchorEl] = useState(null);

  const isAuthenticated = !!user;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const handleUserMenuOpen = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  // Menu handlers
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPagesMenuAnchorEl(null);
    setShopNestedMenuAnchorEl(null);
    setPortfolioNestedMenuAnchorEl(null);
    setBlogNestedMenuAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handlePagesMenuOpen = (event) => {
    setPagesMenuAnchorEl(event.currentTarget);
  };

  const handleShopNestedMenuOpen = (event) => {
    setShopNestedMenuAnchorEl(event.currentTarget);
  };

  const handlePortfolioNestedMenuOpen = (event) => {
    setPortfolioNestedMenuAnchorEl(event.currentTarget);
  };

  const handleBlogNestedMenuOpen = (event) => {
    setBlogNestedMenuAnchorEl(event.currentTarget);
  };

  // Navigation links with submenus
  const navLinks = [
    { title: "דף הבית", path: "http://localhost:3000/" },
    { title: "אודות", path: "http://localhost:3000/about" },

    { title: "חנות", path: "http://localhost:3000/store" },

    { title: "צור קשר", path: "http://localhost:3000/contact" },
  ];

  // Function to render menu items recursively
  const renderMenuItems = (items, parentMenuClose) => {
    return items.map((item) => {
      if (item.submenu) {
        return (
          <MenuItem
            key={item.title}
            onClick={(event) => {
              if (item.title === "חנות" && parentMenuClose === handleClose)
                handleShopNestedMenuOpen(event);
              else if (item.title === "חנות") handleShopNestedMenuOpen(event);
              else if (item.title === "בלוג") handleBlogNestedMenuOpen(event);
              else parentMenuClose();
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              minWidth: "180px",
            }}
          >
            <ListItemText primary={item.title} />
            <KeyboardArrowDownIcon fontSize="small" />
          </MenuItem>
        );
      }
      return (
        <MenuItem
          key={item.title}
          onClick={parentMenuClose}
          component={Link}
          href={item.path}
          sx={{
            py: 1,
            minWidth: "180px",
            textDecoration: "none",
            "&:hover": {
              backgroundColor: theme.custom.navbar,
              color: theme.palette.primary.main,
            },
          }}
        >
          <ListItemText primary={item.title} />
        </MenuItem>
      );
    });
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.21)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Top Header Area */}
      <Toolbar
        sx={{
          background: ` ${theme.custom.navbar}`,
          minHeight: "48px !important",
          paddingX: { xs: 2, md: 4 },
          color: theme.palette.text.main,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Contact Info */}
          <Grid sx={{ display: { xs: "none", md: "flex" } }}>
            <Link
              href="mailto:info@mytene.com"
              color="inherit"
              sx={{
                mr: 2,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <MailOutlineIcon
                sx={{
                  mr: 0.5,
                  color: theme.palette.primary.main,
                  fontSize: "small",
                }}
              />
              <Typography variant="body2">info@hatene.com</Typography>
            </Link>
            <Link
              href="tel:+12345678901"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <PhoneIcon
                sx={{
                  mr: 0.5,
                  color: theme.palette.primary.main,
                  fontSize: "small",
                }}
              />
              <Typography variant="body2">+972 5000 000</Typography>
            </Link>
          </Grid>

          {/* User Actions */}
          <Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Language Selector would go here if needed */}
                <IconButton onClick={toggleMode} color="grey" sx={{ ml: 1 }}>
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1, height: "16px", alignSelf: "center" }}
                />
            {/* Login Link */}
            {user ? (
              <>
                <Button
                  onClick={handleUserMenuOpen}
                  sx={{
                    textTransform: "none",
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon fontSize="small" />
                  {user.firstName} {user.lastName}
                  <KeyboardArrowDownIcon fontSize="small" />
                </Button>

                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleUserMenuClose}
                  >
                    פרופיל אישי
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      logout();
                      navigate("/");
                      showSnackbar("התנתקת בהצלחה");
                    }}
                  >
                    התנתק
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                
                <RouterLink
                  to="/login"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "0.3s",
                  }}
                >
                  <PersonIcon
                    sx={{
                      mr: 0.5,
                      color: theme.palette.primary.main,
                      fontSize: "small",
                    }}
                  />
                  <Typography variant="body2">כניסה</Typography>
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
                  }}
                >
                  <Typography variant="body2">הרשמה</Typography>
                </RouterLink>
              </>
            )}

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, height: "16px", alignSelf: "center" }}
            />

            {/* עגלה Link */}
            {user ? (
              <Link
                href="#"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                <Badge
                  badgeContent={2}
                  color="secondary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 4px",
                    },
                  }}
                >
                  <ShoppingCartIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "small",
                    }}
                  />
                </Badge>
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  עגלה
                </Typography>
              </Link>
            ) : (
              <Typography variant="body2" sx={{ ml: 0.5 }}></Typography>
            )}
          </Grid>
        </Container>
      </Toolbar>

      {/* Main Navbar Area */}
      <Toolbar
        sx={{
          background: `linear-gradient(to top , rgba(148, 130, 119, 0.68), ${theme.custom.navbar})`,
          paddingX: { xs: 2, md: 4 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Cinzel",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                transition: "transform 0.5s ease, letter-spacing 0.3s ease",
                "&:hover": {
                  transform: "rotate(-1deg) scale(1.05)",
                  letterSpacing: "1px",
                  color: theme.palette.primary.main,
                },
              }}
            >
              Hatene
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              {navLinks.map((link) => (
                <Button
                  key={link.title}
                  color="inherit"
                  href={link.path}
                  sx={{
                    textTransform: "none",
                    px: 2,
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: "18px",
                    transition: "transform 0.3s ease, color 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      color: theme.palette.primary.main,
                      backgroundColor: "transparent",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>
            <IconButton
              color="inherit"
              sx={{
                ml: 1,
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: "transparent",
                },
              }}
            >
              <ListItemIcon>
                <SearchIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="חיפוש" />
            </IconButton>
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="פתח תפריט"
              edge="start"
              onClick={handleMenu}
              sx={{ p: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                "& .MuiPaper-root": {
                  width: "100%",
                  maxWidth: "300px",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                  mt: 1.5,
                },
              }}
            >
              {renderMenuItems(navLinks, handleClose)}
              <Divider sx={{ my: 1 }} />
              <MenuItem
                onClick={handleClose}
                sx={{
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemIcon>
                  <SearchIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="חיפוש" />
              </MenuItem>
            </Menu>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
        </Container>
      </Toolbar>
    </AppBar>
  );
};
