import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Tooltip,
  Menu,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { removeFromFavorites, removeFromFavoritesAsync } from "../../store/slices/favoritesSlice";
import { addToCart, addToCartAsync } from "../../store/slices/cartSlice";
import { AuthContext } from "../../services/AuthContext";

const FavoritesDropdown = ({ anchorEl, onClose, isMobile = false }) => {
  const { favorites, quantity } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isOpen = Boolean(anchorEl);

  const handleRemoveItem = async (itemId) => {
    try {
      if (isAuthenticated) {
        // משתמש מחובר - הסרה מהשרת
        await dispatch(removeFromFavoritesAsync(itemId)).unwrap();
      } else {
        // משתמש לא מחובר - הסרה מ-localStorage
        dispatch(removeFromFavorites(itemId));
      }
      
      setSnackbar({
        open: true,
        message: "הוסר מהמועדפים בהצלחה!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה בהסרת המוצר מהמועדפים",
        severity: "error",
      });
    }
  };

  const handleMoveToCart = async (product) => {
    // בדיקת מלאי
    if (product.stockQuantity <= 0) {
      setSnackbar({
        open: true,
        message: "המוצר אינו זמין במלאי",
        severity: "error",
      });
      return;
    }

    try {
      // הוספה לעגלה
      if (isAuthenticated) {
        // משתמש מחובר - שמירה בשרת
        await dispatch(addToCartAsync({ 
          productId: product._id || product.id, 
          quantity: 1 
        })).unwrap();
      } else {
        // משתמש לא מחובר - שמירה ב-localStorage
        dispatch(addToCart({ product }));
      }
      
      // הסרה ממועדפים אחרי הוספה מוצלחת לעגלה
      const productId = product.id || product._id;
      if (isAuthenticated) {
        await dispatch(removeFromFavoritesAsync(productId)).unwrap();
      } else {
        dispatch(removeFromFavorites(productId));
      }
      
      setSnackbar({
        open: true,
        message: "המוצר הועבר לעגלה בהצלחה!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "שגיאה בהעברת המוצר לעגלה",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Mobile version - full screen drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "350px" },
            direction: "rtl",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            direction: "rtl",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              המועדפים שלי
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {favorites.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50%",
                textAlign: "center",
                p: 3,
              }}
            >
              <FavoriteBorderIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                אין לך עדיין פריטים מועדפים
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleNavigate("/store")}
              >
                המשך לקנות
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: "auto" }}>
                {favorites.map((item) => (
                  <React.Fragment key={item.id || item._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 1,
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {item.imageUrl || item.image ? (
                            <img
                              src={item.imageUrl || item.image}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo192.png";
                            }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              אין תמונה
                            </Typography>
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            noWrap
                          >
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              component="span"
                              variant="body2"
                              color="primary.main"
                              sx={{ display: "block", fontWeight: "bold" }}
                            >
                              ₪
                              {typeof item.price === 'number' && !isNaN(item.price)
                                ? item.price.toFixed(2)
                                : '0.00'}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="העבר לסל">
                            <IconButton
                              size="small"
                              onClick={() => handleMoveToCart(item)}
                              sx={{ mb: 1 }}
                            >
                              <ShoppingCartIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="הסר מהמועדפים">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleRemoveItem(item.id || item._id)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" />
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: "auto", pt: 2 }}>
                

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => handleNavigate("/store")}
                >
                  המשך לקנות
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Snackbar for mobile */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Drawer>
    );
  }

  // Desktop version - dropdown menu
  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
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
          width: 350,
          maxHeight: 500,
          direction: "rtl",
          mt: 1,
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" >
            המועדפים שלי
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {favorites.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              textAlign: "center",
            }}
          >
            <FavoriteBorderIcon
              sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              אין לך עדיין פריטים מועדפים
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleNavigate("/store")}
            >
              המשך לקנות
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ maxHeight: 300, overflow: "auto", p: 2 }}>
              {favorites.map((item) => (
                <React.Fragment key={item.id || item._id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          borderRadius: 1,
                          bgcolor: "background.paper",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {item.imageUrl || item.image ? (
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo192.png";
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.6rem" }}
                          >
                            אין תמונה
                          </Typography>
                        )}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          ₪
                          {typeof item.price === 'number' && !isNaN(item.price)
                            ? item.price.toFixed(2)
                            : '0.00'}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          position: "absolute",
                          right: "60px",
                        }}
                      >
                        <Tooltip title="העבר לסל">
                          <IconButton
                            size="small"
                            onClick={() => handleMoveToCart(item)}
                          >
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="הסר מהמועדפים">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleRemoveItem(item.id || item._id)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {favorites.indexOf(item) <
                    Math.min(favorites.length - 1, 3) && (
                    <Divider variant="inset" />
                  )}
                </React.Fragment>
              ))}
            </List>

            

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              

              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                onClick={() => handleNavigate("/store")}
              >
                המשך לקנות
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Snackbar for desktop */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Menu>
  );
};

export default FavoritesDropdown;
