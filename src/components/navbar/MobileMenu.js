import React from "react";
import {
  Menu,
  MenuItem,
  Divider,
  Badge,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

import {
  Search as SearchIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Store as StoreIcon,
  ContactMail as ContactMailIcon,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const MobileMenu = ({
  anchorEl,
  open,
  onClose,
  navLinks,
  user,
  favoritesCount,
  onSearchOpen,
  onFavoritesOpen,
  theme,
}) => {
  const isVerySmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Icon mapping for navigation links
  const getNavIcon = (title) => {
    switch (title) {
      case "דף הבית":
        return <HomeIcon fontSize="small" color="primary" />;
      case "אודות":
        return <InfoIcon fontSize="small" color="primary" />;
      case "חנות":
        return <StoreIcon fontSize="small" color="primary" />;
      case "צור קשר":
        return <ContactMailIcon fontSize="small" color="primary" />;
      default:
        return <HomeIcon fontSize="small" color="primary" />;
    }
  };

  const renderMenuItems = (items, parentMenuClose) => {
    return items.map((item) => (
      <ListItem key={item.title} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={item.path}
          onClick={parentMenuClose}
          sx={{
            py: { xs: 1.2, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}20`,
              transform: "translateX(-4px)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
            {getNavIcon(item.title)}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            sx={{
              textAlign: "right",
              "& .MuiListItemText-primary": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    ));
  };

  // For very small screens - use full screen drawer
  if (isVerySmall) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: "100%",
            direction: "rtl",
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                fontFamily: "Cinzel",
              }}
            >
              Hatene
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                backgroundColor: theme.palette.action.hover,
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                px: 2,
                mb: 2,
                color: theme.palette.text.secondary,
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              ניווט ראשי
            </Typography>

            <List sx={{ px: 0 }}>{renderMenuItems(navLinks, onClose)}</List>

            <Divider sx={{ my: 3, mx: 2 }} />

            {/* Additional Options */}
            <Typography
              variant="subtitle2"
              sx={{
                px: 2,
                mb: 2,
                color: theme.palette.text.secondary,
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              פעולות נוספות
            </Typography>

            <List sx={{ px: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    onClose();
                    onSearchOpen();
                  }}
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.light}20`,
                      transform: "translateX(-4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                    <SearchIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="חיפוש מוצרים"
                    sx={{
                      textAlign: "right",
                      "& .MuiListItemText-primary": {
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Mobile Favorites Menu Item */}
              {user && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onClose();
                      onFavoritesOpen();
                    }}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.light}20`,
                        transform: "translateX(-4px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                      <Badge
                        badgeContent={favoritesCount}
                        color="error"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "9px",
                            minWidth: "14px",
                            height: "14px",
                            padding: "0 3px",
                          },
                        }}
                      >
                        {favoritesCount > 0 ? (
                          <FavoriteIcon fontSize="small" color="primary" />
                        ) : (
                          <FavoriteBorderIcon
                            fontSize="small"
                            color="primary"
                          />
                        )}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={`המועדפים שלי${
                        favoritesCount > 0 ? ` (${favoritesCount})` : ""
                      }`}
                      sx={{
                        textAlign: "right",
                        "& .MuiListItemText-primary": {
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: "auto",
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2024 Hatene - כל הזכויות שמורות
            </Typography>
          </Box>
        </Box>
      </Drawer>
    );
  }

  // For tablets - use side drawer
  if (isTablet) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: "320px",
            direction: "rtl",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              תפריט ניווט
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List sx={{ flex: 1 }}>
            {renderMenuItems(navLinks, onClose)}

            <Divider sx={{ my: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  onClose();
                  onSearchOpen();
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.light}20`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                  <SearchIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary="חיפוש" />
              </ListItemButton>
            </ListItem>

            {/* Favorites Menu Item */}
            {user && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    onClose();
                    onFavoritesOpen();
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.light}20`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                    <Badge
                      badgeContent={favoritesCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          minWidth: "16px",
                          height: "16px",
                          padding: "0 4px",
                        },
                      }}
                    >
                      {favoritesCount > 0 ? (
                        <FavoriteIcon fontSize="small" color="primary" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" color="primary" />
                      )}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="מועדפים" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    );
  }

  // Fallback for desktop (shouldn't be used, but just in case)
  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "280px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          mt: 1.5,
          direction: "rtl",
          borderRadius: 2,
        },
      }}
    >
      {navLinks.map((item) => (
        <MenuItem
          key={item.title}
          onClick={onClose}
          component={RouterLink}
          to={item.path}
          sx={{
            py: 1.5,
            px: 2,
            minWidth: "180px",
            textDecoration: "none",
            direction: "rtl",
            "&:hover": {
              backgroundColor: "background.default",
              color: "primary.main",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
            {getNavIcon(item.title)}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </MenuItem>
      ))}

      <Divider sx={{ my: 1 }} />

      <MenuItem
        onClick={() => {
          onClose();
          onSearchOpen();
        }}
        sx={{
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          direction: "rtl",
        }}
      >
        <ListItemIcon sx={{ minWidth: "auto" }}>
          <SearchIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="חיפוש" />
      </MenuItem>

      {user && (
        <MenuItem
          onClick={() => {
            onClose();
            onFavoritesOpen();
          }}
          sx={{
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            direction: "rtl",
          }}
        >
          <ListItemIcon sx={{ minWidth: "auto" }}>
            <Badge
              badgeContent={favoritesCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  minWidth: "16px",
                  height: "16px",
                  padding: "0 4px",
                },
              }}
            >
              {favoritesCount > 0 ? (
                <FavoriteIcon fontSize="small" color="primary" />
              ) : (
                <FavoriteBorderIcon fontSize="small" color="primary" />
              )}
            </Badge>
          </ListItemIcon>
        </MenuItem>
      )}
    </Menu>
  );
};

export default MobileMenu;
