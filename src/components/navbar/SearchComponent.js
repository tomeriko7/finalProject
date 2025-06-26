import React, { useState, useRef } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  Paper,
  InputBase,
  ClickAwayListener,
  Fade,
  Popper,
} from "@mui/material";

import {
  Search as SearchIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchProductsSuggestions } from "../../api/productApi";
import { formatPrice } from "../../utils/formatters";
import { addToCart } from "../../store/slices/cartSlice";

const SearchComponent = ({ searchOpen, setSearchOpen, theme, showSnackbar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchAnchorRef = useRef(null);
  const searchTimerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setShowSuggestions(false);
      setSearchResults([]);
    }
  };

  const handleSearchChange = async (value) => {
    setSearchQuery(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (value.trim().length > 1) {
      setIsSearching(true);
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
          console.error("Failed to search products:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setShowSuggestions(false);
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    setShowSuggestions(false);
    setSearchResults([]);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    try {
      const cartProduct = {
        _id: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        imageUrl: product.image,
        discount: product.discount || 0,
        stockQuantity: product.stockQuantity || 10,
      };
      dispatch(addToCart({ product: cartProduct }));
      showSnackbar("המוצר נוסף לעגלה בהצלחה!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showSnackbar("שגיאה בהוספת המוצר לעגלה", "error");
    }
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setShowSuggestions(false);
    setSearchResults([]);
  };

  return (
    <>
  

      <Popper
        open={searchOpen}
        anchorEl={searchAnchorRef.current}
        placement="bottom-start"
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
                direction: "rtl",
              }}
            >
              <ClickAwayListener onClickAway={handleCloseSearch}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      חיפוש מוצרים
                    </Typography>
                    <IconButton size="small" onClick={handleCloseSearch}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Paper
                    component="form"
                    sx={{
                      p: "4px 8px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      direction: "rtl",
                      position: "relative",
                    }}
                    onSubmit={handleSearchSubmit}
                  >
                    <InputBase
                      sx={{
                        flex: 1,
                        direction: "rtl",
                        textAlign: "right",
                        "& input": {
                          textAlign: "right",
                        },
                      }}
                      placeholder="חפש מוצרים..."
                      inputProps={{ "aria-label": "חיפוש מוצרים" }}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      autoFocus
                    />
                    <IconButton
                      type="submit"
                      sx={{ p: "8px" }}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>

                    {/* Search Results Dropdown */}
                    {showSuggestions && searchResults.length > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          left: 0,
                          zIndex: 1000,
                          mt: 1,
                          maxHeight: "400px",
                          overflow: "auto",
                          width: "100%",
                          borderRadius: 1,
                          boxShadow: 3,
                          bgcolor: "background.paper",
                          direction: "rtl",
                        }}
                      >
                        {searchResults.map((product) => (
                          <Box
                            key={product.id}
                            component={Button}
                            onClick={() => handleProductClick(product.id)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              width: "100%",
                              textAlign: "right",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              textTransform: "none",
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 70,
                                height: 70,
                                position: "relative",
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#f5f5f5",
                              }}
                            >
                              {product.image ? (
                                <Box
                                  component="img"
                                  src={
                                    product.image.startsWith("http")
                                      ? product.image
                                      : `${
                                          process.env.REACT_APP_API_URL || ""
                                        }${product.image}`
                                  }
                                  alt={product.name}
                                  sx={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.png";
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    bgcolor: "#f5f5f5",
                                  }}
                                >
                                  אין תמונה
                                </Box>
                              )}
                            </Box>
                            <Box
                              sx={{
                                flex: 1,
                                textAlign: "right",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                component="span"
                                noWrap
                                sx={{ maxWidth: "200px" }}
                              >
                                {product.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 0.5,
                                }}
                              >
                                {product.discount > 0 ? (
                                  <>
                                    <Typography
                                      variant="body2"
                                      color="error"
                                      component="span"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      {formatPrice(
                                        product.price * (1 - product.discount / 100)
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      component="span"
                                      sx={{
                                        textDecoration: "line-through",
                                        mr: 1,
                                      }}
                                    >
                                      {formatPrice(product.price)}
                                    </Typography>
                                  </>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    component="span"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {formatPrice(product.price)}
                                  </Typography>
                                )}
                              </Box>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{
                                  mt: 0.5,
                                  fontSize: "0.7rem",
                                  py: 0.2,
                                }}
                                onClick={(e) => handleAddToCart(e, product)}
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

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "right" }}
                  >
                    חפש מוצרים לפי שם, קטגוריה או תיאור
                  </Typography>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default SearchComponent;