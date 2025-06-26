import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleFavorite } from "../../store/slices/favoritesSlice";
import { formatPrice } from "../../utils/formatters";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  
  // בדיקה האם המוצר נמצא במועדפים
  const favorites = useSelector((state) => state.favorites.favorites);
  const productId = product.id || product._id;
  const isFavorite = favorites.some(item => 
    (item.id === productId) || (item._id === productId)
  );

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) {
      setSnackbar({
        open: true,
        message: "המוצר אינו זמין במלאי",
        severity: "error",
      });
      return;
    }

    dispatch(addToCart({ product }));
    setSnackbar({
      open: true,
      message: "המוצר נוסף לעגלה בהצלחה!",
      severity: "success",
    });
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite({ product }));
    
    setSnackbar({
      open: true,
      message: isFavorite ? "הוסר מהמועדפים" : "נוסף למועדפים",
      severity: "info",
    });
  };

  const isOutOfStock = product.stockQuantity <= 0;

  // תיקון בדיקת ההנחה
  const hasDiscount =
    product.discount != null &&
    product.discount !== undefined &&
    product.discount !== 0 &&
    typeof product.discount === "number" &&
    product.discount > 0 &&
    product.discount < 100;

  // חישוב המחיר המקורי רק אם באמת יש הנחה
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discount / 100)
    : null;

  // רנדור מצב רשימה
  if (viewMode === "list") {
    return (
      <>
        <Card
          sx={{
            display: "flex",
            mb: 2,
            minHeight: 250,
            height: "auto",
            transition: "all 0.3s ease",
            direction: "rtl",
            textAlign: "right",
            "& *": {
              direction: "rtl",
              textAlign: "right",
            },
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
            opacity: isOutOfStock ? 0.7 : 1,
          }}
        >
          <Box sx={{ position: "relative", width: 250, flexShrink: 0 }}>
            <Box
              sx={{
                width: 250,
                height: 250,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                image={
                  product.imageUrl ||
                  product.image ||
                  "https://via.placeholder.com/200x200?text=תמונה+לא+זמינה"
                }
                alt={product.name}
              />
            </Box>

            {/* Badges */}
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              {hasDiscount && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  size="small"
                  sx={{ mb: 1, display: "block" }}
                />
              )}
              {isOutOfStock && (
                <Chip
                  label="אזל מהמלאי"
                  color="default"
                  size="small"
                  sx={{ backgroundColor: "rgba(0,0,0,0.7)", color: "white" }}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <CardContent sx={{ 
              flex: 1, 
              direction: "rtl", 
              textAlign: "right" 
            }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ 
                  textAlign: "right !important",
                  direction: "rtl !important",
                  width: "100%",
                  display: "block"
                }}
              >
                {product.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  textAlign: "right !important",
                  direction: "rtl !important",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  justifyContent: "flex-start",
                  direction: "rtl",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  ({product.numReviews || 0})
                </Typography>
                <Rating value={product.rating || 0} readOnly size="small" />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-start",
                  direction: "rtl",
                }}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(product.price)}
                </Typography>
                {hasDiscount &&
                  originalPrice &&
                  originalPrice > product.price && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.disabled",
                      }}
                    >
                      {formatPrice(originalPrice)}
                    </Typography>
                  )}
              </Box>
            </CardContent>

            <CardActions sx={{ 
              justifyContent: "space-between", 
              px: 2, 
              pb: 2,
              direction: "rtl" 
            }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                sx={{ minWidth: 140 }}
              >
                {isOutOfStock ? "אזל מהמלאי" : "הוסף לסל"}
              </Button>

              <Box>
                <Tooltip title="צפה במוצר">
                  <IconButton color="primary" onClick={handleOpenDialog}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isFavorite ? "הסר מהמועדפים" : "הוסף למועדפים"}>
                  <IconButton onClick={handleToggleFavorite} color="error">
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </Box>
        </Card>

        {/* דיאלוג מפורט למוצר */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
          aria-labelledby="product-dialog-title"
          sx={{
            '& .MuiDialog-paper': {
              direction: 'rtl',
            },
          }}
        >
          <DialogTitle id="product-dialog-title" sx={{ textAlign: 'center', pb: 1 }}>
            {product.name}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* תמונת המוצר */}
              <Box sx={{ flex: 1, maxWidth: { md: '50%' }, display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 400,
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 2,
                  }}
                >
                  <img
                    src={product.imageUrl || product.image || "https://via.placeholder.com/400x400?text=תמונה+לא+זמינה"}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>

              {/* פרטי המוצר */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* מחיר והנחות */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {formatPrice(product.price)}
                    </Typography>
                    {hasDiscount &&
                      originalPrice &&
                      originalPrice > product.price && (
                        <>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {formatPrice(originalPrice)}
                          </Typography>
                          <Chip
                            label={`הנחה ${product.discount}%`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </>
                      )}
                  </Box>
                  
                  {product.stockQuantity > 0 ? (
                    <Typography variant="body2" color="success.main">
                      זמין במלאי
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error">
                      אזל מהמלאי
                    </Typography>
                  )}
                </Box>

                {/* תיאור */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    תיאור המוצר:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {product.description || 'אין תיאור זמין'}
                  </Typography>
                </Box>

                {/* כפתורי פעולה */}
                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    startIcon={<ShoppingCartIcon />}
                    sx={{ flex: '1 0 200px' }}
                  >
                    {isOutOfStock ? 'אזל מהמלאי' : 'הוסף לעגלה'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleToggleFavorite}
                    startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    sx={{ flex: '1 0 200px' }}
                  >
                    {isFavorite ? 'הסר ממועדפים' : 'שמור למועדפים'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-start', p: 2 }}>
            <Button onClick={handleCloseDialog} color="primary" variant="outlined">
              סגור
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // רנדור מצב רשת (grid) - ברירת המחדל
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          direction: "rtl",
          textAlign: "right",
          "& *": {
            direction: "rtl",
            textAlign: "right",
          },
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 6,
          },
          opacity: isOutOfStock ? 0.7 : 1,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: "200px",
              width: "100%",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              image={
                product.imageUrl ||
                product.image ||
                "https://via.placeholder.com/300x200?text=תמונה+לא+זמינה"
              }
              alt={product.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>

          {/* Top badges */}
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            {hasDiscount && (
              <Chip
                icon={<LocalOfferIcon />}
                label={`-${product.discount}%`}
                color="error"
                size="small"
                sx={{ mb: 1, display: "block" }}
              />
            )}
            {product.isNew && (
              <Chip
                label="חדש"
                color="success"
                size="small"
                sx={{ mb: 1, display: "block" }}
              />
            )}
          </Box>

          {/* Stock status overlay */}
          {isOutOfStock && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Chip
                label="אזל מהמלאי"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: "text.primary",
                  fontWeight: "bold",
                }}
              />
            </Box>
          )}

          {/* Favorite button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "rgba(255,255,255,0.9)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,1)",
              },
            }}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight:0,
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textAlign: "right !important",
                direction: "rtl !important",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "3.2em",
                lineHeight: 1.6,
              }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                textAlign: "right !important",
                direction: "rtl !important",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "3.5em",
                lineHeight: 1.5,
              }}
            >
              {product.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "flex-end",
              }}
            >
              {product.numReviews > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  ({product.numReviews})
                </Typography>
              )}
              <Rating value={product.rating || 0} readOnly size="small" />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              height: "2.5em",
              gap: 1,
            }}
          >
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(product.price)}
            </Typography>
            {hasDiscount && originalPrice && originalPrice > product.price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "text.disabled",
                }}
              >
                {formatPrice(originalPrice)}
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            p: 0,
            height: "60px",
            flexShrink: 0,
            direction: "rtl",
            display: "flex",
          }}
        >
          <Button
            size="small"
            endIcon={<VisibilityIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
            onClick={handleOpenDialog}
            sx={{
              flex: 1,
              borderRadius: 0,
              py: 1.5,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiButton-endIcon": {
                marginLeft: "4px",
                marginRight: "0px",
              },
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            צפה
          </Button>

          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              borderColor: "divider",
              borderWidth: 1
            }} 
          />

          <Button
            size="small"
            endIcon={<ShoppingCartIcon sx={{ fontSize: '1rem', mr: 0.5 }} />}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            sx={{
              flex: 1,
              borderRadius: 0,
              py: 1.5,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiButton-endIcon": {
                marginLeft: "4px",
                marginRight: "0px",
              },
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            {isOutOfStock ? "אזל" : "הוסף לסל"}
          </Button>
        </CardActions>
      </Card>

      {/* דיאלוג מפורט למוצר */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        aria-labelledby="product-dialog-title"
        sx={{
          '& .MuiDialog-paper': {
            direction: 'rtl',
          },
        }}
      >
        <DialogTitle id="product-dialog-title" sx={{ textAlign: 'center', pb: 1 }}>
          {product.name}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* תמונת המוצר */}
            <Box sx={{ flex: 1, maxWidth: { md: '50%' }, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 400,
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 2,
                }}
              >
                <img
                  src={product.imageUrl || product.image || "https://via.placeholder.com/400x400?text=תמונה+לא+זמינה"}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>

            {/* פרטי המוצר */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* מחיר והנחות */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatPrice(product.price)}
                  </Typography>
                  {hasDiscount && originalPrice && (
                    <>
                      <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {formatPrice(originalPrice)}
                      </Typography>
                      <Chip
                        label={`הנחה ${product.discount}%`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </>
                  )}
                </Box>
                
                {product.stockQuantity > 0 ? (
                  <Typography variant="body2" color="success.main">
                    זמין במלאי
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error">
                    אזל מהמלאי
                  </Typography>
                )}
              </Box>

              {/* תיאור */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  תיאור המוצר:
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description || 'אין תיאור זמין'}
                </Typography>
              </Box>

              {/* כפתורי פעולה */}
              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  startIcon={<ShoppingCartIcon />}
                  sx={{ flex: '1 0 200px' }}
                >
                  {isOutOfStock ? 'אזל מהמלאי' : 'הוסף לעגלה'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleToggleFavorite}
                  startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  sx={{ flex: '1 0 200px' }}
                >
                  {isFavorite ? 'הסר ממועדפים' : 'שמור למועדפים'}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start', p: 2 }}>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;