import React, { useContext, useState, useRef, useEffect } from "react";
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
  Tooltip,
  InputBase,
  Paper,
  ClickAwayListener,
  Fade,
  Popper,
  Alert
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
  Sunny as SunnyIcon,
  Bedtime as BedtimeIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  History as HistoryIcon,
  Close as CloseIcon
} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import { ThemeContext } from "../services/ThemeContext";
import CartDropdown from "./cart/CartDropdown";
import { searchProductsSuggestions } from "../api/productApi";
import { formatPrice } from "../utils/formatters";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { toggleMode } = useContext(ThemeContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  // State for all menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [pagesMenuAnchorEl, setPagesMenuAnchorEl] = useState(null);
  const [shopNestedMenuAnchorEl, setShopNestedMenuAnchorEl] = useState(null);
  const [portfolioNestedMenuAnchorEl, setPortfolioNestedMenuAnchorEl] =
    useState(null);
  const [blogNestedMenuAnchorEl, setBlogNestedMenuAnchorEl] = useState(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  
  // חיפוש
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchAnchorRef = useRef(null);
  const searchTimerRef = useRef(null);

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.isAdmin;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const handleUserMenuOpen = (event) =>
    setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleAdminMenuOpen = (event) =>
    setAdminMenuAnchorEl(event.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchorEl(null);

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
        backgroundColor: theme.custom.navbar,
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
                <Brightness7Icon sx={{color:"rgb(232 168 14)"}}/>
              ) : (
                <BedtimeIcon />
              )}
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, height: "16px", alignSelf: "center" }}
            />
            {/* Admin Panel Button - Only visible for admins */}
            {isAdmin && (
              <Tooltip title="ממשק ניהול" arrow>
                <Button
                  color="inherit"
                  onClick={handleAdminMenuOpen}
                  sx={{
                    textTransform: "none",
                    px: 2,
                    py: 0.8, // הקטנת הגובה
                    minHeight: "36px", // גובה מינימלי נמוך יותר
                    fontWeight: 500,
                    fontSize: "16px", // אפשר גם 14px אם רצונך לעדן עוד
                    transition: "transform 0.3s ease, color 0.3s ease",
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    "&:hover": {
                      transform: "translateY(3px)",
                      backgroundColor: theme.palette.primary.dark,
                    },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 2,
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
                  ניהול מערכת
                </Button>
              </Tooltip>
            )}
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
                  PaperProps={{
                    sx: {
                      direction: "rtl", // זה ייישר את הטקסט והאייקונים לימין
                    },
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleUserMenuClose}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="פרופיל אישי" />
                  </MenuItem>
                  
                  <MenuItem
                    component={RouterLink}
                    to="/profile/orders"
                    onClick={handleUserMenuClose}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="היסטוריית הזמנות" />
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      component={RouterLink}
                      to="/admin/dashboard"
                      onClick={handleUserMenuClose}
                      sx={{
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ListItemIcon>
                        <AdminPanelSettingsIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="ניהול מערכת" />
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      logout();
                      navigate("/");
                      showSnackbar("התנתקת בהצלחה");
                    }}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.error.main }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="התנתק" sx={{ color: theme.palette.error.main }} />
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
              <CartDropdown />
            ) : (
              <Typography variant="body2" sx={{ ml: 0.5 }}></Typography>
            )}
          </Grid>
        </Container>
      </Toolbar>

      {/* Main Navbar Area */}
      <Toolbar
        sx={{
          background: ` ${theme.custom.navbar})`,
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

            {/* Cart and Search Icons */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              {/* Search Icon & Popup */}
              <IconButton
                color="inherit"
                ref={searchAnchorRef}
                onClick={() => setSearchOpen(prev => !prev)}
                sx={{
                  ml: 1,
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemIcon>
                  <SearchIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="חיפוש" />
              </IconButton>
              <Popper
                open={searchOpen}
                anchorEl={searchAnchorRef.current}
                placement="bottom-end"
                transition
                disablePortal
                style={{ zIndex: 1301 }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper 
                      elevation={3} 
                      sx={{
                        p: 2, 
                        width: 320, 
                        mt: 1,
                        borderRadius: 2,
                        direction: 'rtl'
                      }}
                    >
                      <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                              חיפוש מוצרים
                            </Typography>
                            <IconButton size="small" onClick={() => {
                              setSearchOpen(false);
                              setShowSuggestions(false);
                              setSearchResults([]);
                            }}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (searchQuery.trim()) {
                                navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
                                setSearchOpen(false);
                                setShowSuggestions(false);
                                setSearchResults([]);
                              }
                            }}
                          >
                            <InputBase
                              sx={{ ml: 1, flex: 1, direction: 'rtl' }}
                              placeholder="חפש מוצרים..."
                              inputProps={{ 'aria-label': 'חיפוש מוצרים' }}
                              value={searchQuery}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchQuery(value);
                                
                                // Clear previous timer
                                if (searchTimerRef.current) {
                                  clearTimeout(searchTimerRef.current);
                                }
                                
                                if (value.trim().length > 1) {
                                  setIsSearching(true);
                                  // Debounce search to avoid too many API calls
                                  searchTimerRef.current = setTimeout(async () => {
                                    try {
                                      const result = await searchProductsSuggestions(value);
                                      if (result.success) {
                                        setSearchResults(result.data);
                                        setShowSuggestions(true);
                                      } else {
                                        setSearchResults([]);
                                      }
                                    } catch (error) {
                                      console.error('Failed to search products:', error);
                                      setSearchResults([]);
                                    } finally {
                                      setIsSearching(false);
                                    }
                                  }, 300);
                                } else {
                                  setShowSuggestions(false);
                                  setSearchResults([]);
                                }
                              }}
                              onFocus={() => {
                                if (searchQuery.trim().length > 1 && searchResults.length > 0) {
                                  setShowSuggestions(true);
                                }
                              }}
                              onBlur={(e) => {
                                // Delay hiding suggestions to allow clicking on them
                                setTimeout(() => {
                                  setShowSuggestions(false);
                                }, 200);
                              }}
                              autoFocus
                            />
                            <IconButton 
                              type="submit" 
                              sx={{ p: '10px' }} 
                              aria-label="search"
                              disabled={isSearching}
                            >
                              {isSearching ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
                                  <Box 
                                    sx={{ 
                                      width: 16, 
                                      height: 16, 
                                      borderRadius: '50%',
                                      border: '2px solid',
                                      borderColor: 'primary.main',
                                      borderTopColor: 'transparent',
                                      animation: 'spin 1s linear infinite',
                                      '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                      },
                                    }}
                                  />
                                </Box>
                              ) : (
                                <SearchIcon />
                              )}
                            </IconButton>
                            
                            {/* Search Results Dropdown */}
                            {showSuggestions && searchResults.length > 0 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  left: 0,
                                  zIndex: 1000,
                                  mt: 1,
                                  maxHeight: '400px',
                                  overflow: 'auto',
                                  width: '100%',
                                  borderRadius: 1,
                                  boxShadow: 3,
                                  bgcolor: 'background.paper',
                                  direction: 'rtl',
                                }}
                              >
                                {searchResults.map((product) => (
                                  <Box
                                    key={product.id}
                                    component={Button}
                                    onClick={() => {
                                      navigate(`/product/${product.id}`);
                                      setSearchOpen(false);
                                      setShowSuggestions(false);
                                      setSearchResults([]);
                                    }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      p: 1,
                                      width: '100%',
                                      textAlign: 'right',
                                      borderBottom: '1px solid',
                                      borderColor: 'divider',
                                      textTransform: 'none',
                                      '&:hover': {
                                        bgcolor: 'action.hover',
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 70,
                                        height: 70,
                                        position: 'relative',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        bgcolor: '#f5f5f5',
                                      }}
                                    >
                                      {console.log('Product image:', product.image)}
                                      {product.image ? (
                                        <Box
                                          component="img"
                                          src={product.image.startsWith('http') ? product.image : `${process.env.REACT_APP_API_URL || ''}${product.image}`}
                                          alt={product.name}
                                          sx={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%',
                                          }}
                                          onError={(e) => {
                                            console.log('Image error, fallback to placeholder');
                                            e.target.onerror = null; // הימנעות מלולאה אינסופית
                                            e.target.src = '/placeholder.png';
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{ 
                                            height: '100%', 
                                            width: '100%', 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'text.secondary',
                                            fontSize: '0.75rem',
                                            bgcolor: '#f5f5f5'
                                          }}
                                        >
                                          אין תמונה
                                        </Box>
                                      )}
                                    </Box>
                                    <Box sx={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                      <Typography variant="subtitle2" component="span" noWrap sx={{ maxWidth: '200px' }}>
                                        {product.name}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        {product.discount > 0 ? (
                                          <>
                                            <Typography
                                              variant="body2"
                                              color="error"
                                              component="span"
                                              sx={{ fontWeight: 'bold' }}
                                            >
                                              {formatPrice(product.price * (1 - product.discount / 100))}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              component="span"
                                              sx={{ textDecoration: 'line-through', mr: 1 }}
                                            >
                                              {formatPrice(product.price)}
                                            </Typography>
                                          </>
                                        ) : (
                                          <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                            {formatPrice(product.price)}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mt: 0.5, fontSize: '0.7rem', py: 0.2 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          try {
                                            console.log('Adding to cart:', product);
                                            // יוצר אובייקט מוצר חדש עם המבנה הנכון לעגלה
                                            const cartProduct = {
                                              _id: product.id,
                                              id: product.id,
                                              name: product.name,
                                              price: product.price,
                                              image: product.image,
                                              imageUrl: product.image,
                                              discount: product.discount || 0,
                                              stockQuantity: product.stockQuantity || 10
                                            };
                                            dispatch(addToCart({ product: cartProduct }));
                                            setSnackbarMessage('המוצר נוסף לעגלה בהצלחה!');
                                            setSnackbarSeverity('success');
                                            setSnackbarOpen(true);
                                          } catch (error) {
                                            console.error('Error adding to cart:', error);
                                            setSnackbarMessage('שגיאה בהוספת המוצר לעגלה');
                                            setSnackbarSeverity('error');
                                            setSnackbarOpen(true);
                                          }
                                        }}
                                        startIcon={<ShoppingCartIcon fontSize="small" />}
                                      >
                                        הוסף לעגלה
                                      </Button>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Paper>
                          
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              חפש מוצרים לפי שם, קטגוריה או תיאור
                            </Typography>
                          </Box>
                        </Box>
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
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
                onClick={() => {
                  handleClose();
                  setSearchOpen(true);
                }}
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
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity={snackbarSeverity} 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Toolbar>

      {/* Admin Menu Dropdown */}
      <Menu
        anchorEl={adminMenuAnchorEl}
        open={Boolean(adminMenuAnchorEl)}
        onClose={handleAdminMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
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
              left: 20,
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
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: `${theme.palette.primary.light}30`,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};
