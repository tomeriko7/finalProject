import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
  useMediaQuery,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  InputAdornment,
  AppBar,
  Toolbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PhotoCamera as PhotoCameraIcon,
  Clear as ClearIcon,
  Link as LinkIcon,
  Save as SaveIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import {
  uploadProductImage,
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
} from "../../api/productApi";

// קטגוריות לסינון מוצרים
const categories = ["צמחי תבלין", "עצים", "שתילים", "כלי גינה", "תערובות ודשן"];

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("הכל");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Get token from localStorage (adjust based on your auth implementation)
  const token = localStorage.getItem("token");

  // Load products on component mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [page, rowsPerPage, searchQuery, category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: page + 1, // API expects 1-based pagination
        pageSize: rowsPerPage,
        keyword: searchQuery,
        category: category === "הכל" ? "" : category,
        isAdmin: true, // Show all products including inactive ones
      };

      const result = await getProducts(params);

      setProducts(result.data);
      setTotalProducts(result.pagination.total);
      setTotalPages(result.pagination.pages);
    } catch (err) {
      setError(typeof err === "string" ? err : "שגיאה בטעינת המוצרים");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (product) => {
    setCurrentProduct({
      ...product,
      tags: product.tags || [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setError("");
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      setError("");

      if (
        !currentProduct.name ||
        !currentProduct.description ||
        !currentProduct.category ||
        !currentProduct.price
      ) {
        setError("אנא מלא את כל השדות הנדרשים: שם, תיאור, קטגוריה ומחיר");
        return;
      }

      // Prepare product data - ensure all fields are converted to the right format
      const productData = {
        name: currentProduct.name,
        category: currentProduct.category,
        description: currentProduct.description || "",
        price: parseFloat(currentProduct.price),
        stockQuantity: parseInt(currentProduct.stockQuantity || 0),
        imageUrl: currentProduct.imageUrl || "",
        isActive:
          currentProduct.isActive !== undefined
            ? currentProduct.isActive
            : true,
        discount: parseFloat(currentProduct.discount || 0),
        tags: currentProduct.tags || [],
      };

      // Debug logging
      console.log("Product data before sending to API:", productData);

      let result;
      if (currentProduct._id) {
        // Update existing product
        result = await updateProduct(currentProduct._id, productData, token);
      } else {
        // Create new product
        result = await createProduct(productData, token);
      }

      setSuccess(
        currentProduct._id ? "המוצר עודכן בהצלחה" : "המוצר נוסף בהצלחה"
      );
      handleCloseDialog();
      await loadProducts(); // Reload products list
    } catch (err) {
      setError(typeof err === "string" ? err : "שגיאה בשמירת המוצר");
      console.error("Error saving product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(productId, token);
      setSuccess("המוצר נמחק בהצלחה");
      await loadProducts(); // Reload products list
    } catch (err) {
      setError(typeof err === "string" ? err : "שגיאה במחיקת המוצר");
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לתצוגת מחיר עם הנחה
  const displayPrice = (price, discount) => {
    if (discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return (
        <Box>
          <Typography
            component="span"
            sx={{
              textDecoration: "line-through",
              color: "text.secondary",
              mr: 1,
              fontSize: "0.875rem",
            }}
          >
            ₪{price.toFixed(2)}
          </Typography>
          <Typography component="span" color="error.main" fontWeight="bold">
            ₪{discountedPrice.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return <Typography>₪{price.toFixed(2)}</Typography>;
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
  };

  const handleUploadImage = async (event) => {
    try {
      setLoading(true);
      setError("");

      const file = event.target.files[0];
      if (!file) {
        setError("לא נבחרה תמונה");
        return;
      }

      // Pass the file directly, not wrapped in FormData
      const result = await uploadProductImage(file, token);

      if (result && result.imageUrl) {
        setCurrentProduct({
          ...currentProduct,
          imageUrl: result.imageUrl, // Use the correct property from the response
        });
        console.log("Image uploaded successfully:", result.imageUrl);
      } else {
        throw new Error("קבלת URL התמונה נכשלה");
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "שגיאה בהעלאת התמונה");
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // רינדור כרטיסיית מוצר למובייל
  const renderProductCard = (product) => (
    <Card
      key={product._id}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl || 'https://placehold.co/400x200/e0e0e0/cccccc?text=אין+תמונה'}
          alt={product.name}
        />
        <Chip
          label={product.isActive ? "פעיל" : "לא פעיל"}
          color={product.isActive ? "success" : "default"}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="subtitle1" component="div" fontWeight="bold" gutterBottom noWrap>
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.category}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2">
            במלאי: {product.stockQuantity}
          </Typography>
          {displayPrice(product.price, product.discount)}
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ p: 1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditClick(product)}
        >
          ערוך
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteProduct(product._id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* כותרת וכפתור הוספה */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ 
          fontWeight: "bold",
          fontSize: { xs: '1.5rem', sm: '1.75rem' }
        }}>
          ניהול מוצרים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, alignSelf: { xs: 'stretch', sm: 'auto' } }}
          onClick={() => {
            setCurrentProduct({
              name: "",
              category: "",
              description: "",
              price: 0,
              stockQuantity: 0,
              imageUrl: "",
              isActive: true,
              discount: 0,
              tags: [],
            });
            setOpenDialog(true);
          }}
          disabled={loading}
          fullWidth={isMobile}
        >
          מוצר חדש
        </Button>
      </Box>

      {/* טבלת מוצרים */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* סרגל חיפוש וסינון */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="חיפוש מוצרים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size={isMobile ? "small" : "medium"}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
            disabled={loading}
          />

          <FormControl 
            variant="outlined" 
            size={isMobile ? "small" : "medium"}
            sx={{ minWidth: { xs: '100%', sm: 150 } }}
          >
            <InputLabel>קטגוריה</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="קטגוריה"
              disabled={loading}
            >
              <MenuItem value="הכל">הכל</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* הטבלה או תצוגת כרטיסיות */}
        {isMobile ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {products.slice(0, rowsPerPage).map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">תמונה</TableCell>
                  <TableCell align="right">שם</TableCell>
                  <TableCell align="right">קטגוריה</TableCell>
                  <TableCell align="right">מחיר</TableCell>
                  <TableCell align="right">במלאי</TableCell>
                  <TableCell align="right">סטטוס</TableCell>
                  <TableCell align="right">פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(0, rowsPerPage)
                  .map((product) => (
                    <TableRow key={product._id}>
                      <TableCell align="right">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                            }}
                          >
                            אין תמונה
                          </div>
                        )}
                      </TableCell>
                      <TableCell align="right">{product.name}</TableCell>
                      <TableCell align="right">{product.category}</TableCell>
                      <TableCell align="right">
                        {displayPrice(product.price, product.discount)}
                      </TableCell>
                      <TableCell align="right">{product.stockQuantity}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={product.isActive ? "פעיל" : "לא פעיל"}
                          color={product.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(product)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteProduct(product._id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "" : "שורות בעמוד:"}
          disabled={loading}
        />
      </Paper>

      {/* דיאלוג עריכה/הוספת מוצר */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            direction: "rtl",
            minHeight: isMobile ? "100%" : "80vh",
            maxHeight: isMobile ? "100%" : "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* כותרת */}
        {isMobile ? (
          <AppBar position="sticky" sx={{ mb: 2 }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                {currentProduct?._id ? "עריכת מוצר" : "הוספת מוצר חדש"}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handleSaveProduct}
                disabled={loading}
              >
                {loading ? "שומר..." : "שמור"}
              </Button>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle sx={{ textAlign: "right", p: 3 }}>
            {currentProduct?._id ? "עריכת מוצר" : "הוספת מוצר חדש"}
          </DialogTitle>
        )}

        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: "white",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ m: 1, mt: 0, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ direction: "rtl" }}>
            <Grid container spacing={isMobile ? 2 : 3}>
              {/* תמונת מוצר */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  תמונת מוצר
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 3 },
                    mb: 3,
                  }}
                >
                  {/* תצוגת תמונה */}
                  <Box
                    component="label"
                    htmlFor="product-image-upload"
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      height: { xs: 180, sm: 200 },
                      borderRadius: 2,
                      border: `2px dashed ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      backgroundColor: "background.paper",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: "action.hover",
                      },
                      "&:hover .upload-overlay": {
                        opacity: 1,
                      },
                    }}
                  >
                    {currentProduct?.imageUrl ? (
                      <>
                        <img
                          src={currentProduct.imageUrl}
                          alt="תמונת מוצר"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          className="upload-overlay"
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
                            opacity: 0,
                            transition: "opacity 0.2s",
                            color: "white",
                          }}
                        >
                          <PhotoCameraIcon fontSize="large" />
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <PhotoCameraIcon fontSize="large" sx={{ opacity: 0.5, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          לחץ להעלאת תמונה
                        </Typography>
                      </Box>
                    )}
                    <input
                      id="product-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleUploadImage}
                      disabled={loading}
                    />
                  </Box>

                  {/* שדה URL */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="קישור לתמונה"
                      value={currentProduct?.imageUrl || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          imageUrl: e.target.value,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        endAdornment: currentProduct?.imageUrl && (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setCurrentProduct({...currentProduct, imageUrl: ""})}
                              edge="end"
                              size="small"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    <Box
                      sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LinkIcon />}
                        onClick={() => {
                          navigator.clipboard.readText().then((text) => {
                            if (text) {
                              setCurrentProduct({
                                ...currentProduct,
                                imageUrl: text,
                              });
                            }
                          });
                        }}
                        disabled={loading}
                      >
                        הדבק קישור
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* פרטי מוצר */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  פרטי מוצר
                </Typography>

                <Grid container spacing={2}>
                  {/* שם המוצר */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="שם המוצר *"
                      value={currentProduct?.name || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          name: e.target.value,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      required
                    />
                  </Grid>

                  {/* קטגוריה */}
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"}>
                      <InputLabel>קטגוריה *</InputLabel>
                      <Select
                        value={currentProduct?.category || ""}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category: e.target.value,
                          })
                        }
                        label="קטגוריה *"
                        disabled={loading}
                        required
                      >
                        <MenuItem value="">בחר קטגוריה...</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* מחיר וכמות */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="מחיר (₪) *"
                      type="number"
                      value={currentProduct?.price || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="כמות במלאי"
                      type="number"
                      value={currentProduct?.stockQuantity || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>

                  {/* הנחה וסטטוס */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="הנחה (%)"
                      type="number"
                      value={currentProduct?.discount || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"}>
                      <InputLabel>סטטוס המוצר</InputLabel>
                      <Select
                        value={
                          currentProduct?.isActive !== undefined
                            ? currentProduct.isActive
                            : true
                        }
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            isActive: e.target.value === "true",
                          })
                        }
                        label="סטטוס המוצר"
                        disabled={loading}
                      >
                        <MenuItem value={"true"}>🟢 פעיל</MenuItem>
                        <MenuItem value={"false"}>🔴 לא פעיל</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* תיאור */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="תיאור המוצר *"
                      multiline
                      rows={4}
                      value={currentProduct?.description || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          description: e.target.value,
                        })
                      }
                      disabled={loading}
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                      placeholder="הזן תיאור מפורט של המוצר..."
                      required
                    />
                  </Grid>

                  {/* תגיות */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="תגיות (מופרדות בפסיקים)"
                      value={currentProduct?.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                      onBlur={(e) => {
                        setCurrentProduct({
                          ...currentProduct,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag !== ""),
                        });
                      }}
                      disabled={loading}
                      placeholder="לדוגמה: אופנה, חורף, מבצע"
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />
                    
                    {/* הצגת תגיות */}
                    {currentProduct?.tags && currentProduct.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {currentProduct.tags.map((tag, index) => (
                          tag && (
                            <Chip
                              key={index}
                              label={tag}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          )
                        ))}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* כפתורים - רק במסך רחב, במובייל הכפתורים בAppBar */}
        {!isMobile && (
          <DialogActions
            sx={{
              p: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: "background.paper",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              flexDirection: 'row-reverse',
              justifyContent: 'start'
            }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleSaveProduct}
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={loading}
              sx={{ minWidth: 140, mr: 1 }}
            >
              {loading
                ? "שומר..."
                : currentProduct?._id
                ? "שמור שינויים"
                : "הוסף מוצר"}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;