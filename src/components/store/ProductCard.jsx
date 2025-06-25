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
  Badge,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { formatPrice } from "../../utils/formatters";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    setIsFavorite(!isFavorite);
    setSnackbar({
      open: true,
      message: isFavorite ? "הוסר מהמועדפים" : "נוסף למועדפים",
      severity: "info",
    });
  };

  const isOutOfStock = product.stockQuantity <= 0;

  // Debug - בואו נראה מה יש במוצר
  console.log("Product data:", {
    name: product.name,
    price: product.price,
    discount: product.discount,
    discountType: typeof product.discount,
  });

  // תיקון משופר: בדיקה נכונה להנחה
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

  console.log("Calculated values:", { hasDiscount, originalPrice });

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
            direction: "rtl", // הוספת RTL
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
              {" "}
              {/* שונה מ-left ל-right */}
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
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ textAlign: "right" }}
              >
                {product.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  textAlign: "right",
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
                  justifyContent: "flex-end",
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

              {/* תיקון: הצגת המחיר רק אם יש הנחה ממשית */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-end",
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

            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
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
                  <IconButton color="primary">
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

  // Grid view (default)
  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          direction: "rtl", // הוספת RTL
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
          opacity: isOutOfStock ? 0.7 : 1,
          position: "relative",
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
            {" "}
            {/* שונה מ-right ל-left */}
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
              left: 12, // נשאר באותו מקום
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
            minHeight: 0,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textAlign: "right", // יישור לימין
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
                textAlign: "right", // יישור לימין
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "4.5em",
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
              {" "}
              {/* יישור לימין */}
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

          {/* תיקון פשוט: אל תציג כלום אם אין הנחה */}
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
            {/* הצג מחיר מקורי רק אם יש הנחה ממשית */}
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
            direction: "ltr", // שמירה על סדר הכפתורים במצב LTR
          }}
        >
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            sx={{
              flex: 1,
              borderRadius: 0,
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            צפה
          </Button>

          <Button
            size="small"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            sx={{
              flex: 1,
              borderRadius: 0,
              borderLeft: "1px solid",
              borderColor: "divider",
              py: 1.5,
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
