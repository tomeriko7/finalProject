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

  return (
    <Box>
      {/* כותרת וכפתור הוספה */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          ניהול מוצרים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
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
        >
          מוצר חדש
        </Button>
      </Box>

      {/* טבלת מוצרים */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* סרגל חיפוש וסינון */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <input
            type="search"
            placeholder="חיפוש מוצרים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "300px",
              height: "40px",
              padding: "0 16px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
              fontFamily: "inherit",
              direction: "rtl",
              backgroundColor: "white",
              cursor: "text",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            disabled={loading}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "150px",
                height: "40px",
                padding: "0 16px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
                fontFamily: "inherit",
                direction: "rtl",
                backgroundColor: "white",
                cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              disabled={loading}
            >
              <option value="הכל">הכל</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              size="small"
              disabled={loading}
            >
              חיפוש
            </Button>
          </Box>
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* הטבלה */}
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

        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="שורות בעמוד:"
          disabled={loading}
        />
      </Paper>

      {/* דיאלוג עריכה/הוספת מוצר */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            direction: "rtl",
            minHeight: "80vh",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* כותרת */}
        <DialogTitle sx={{ textAlign: "right" }}>
          {currentProduct?._id ? "עריכת מוצר" : "הוספת מוצר חדש"}
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            backgroundColor: "white",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ m: 3, mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ p: 2, direction: "rtl" }}>
            <Grid container spacing={3}>
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
                    gap: 3,
                    mb: 3,
                  }}
                >
                  {/* תצוגת תמונה */}
                  <Box
                    component="label"
                    htmlFor="product-image-upload"
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      height: 200,
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
                    ) : null}
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
                    <input
                      type="text"
                      value={currentProduct?.imageUrl || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          imageUrl: e.target.value,
                        })
                      }
                      disabled={loading}
                      style={{
                        width: "100%",
                        height: "56px",
                        padding: "0 16px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        outline: "none",
                        fontFamily: "inherit",
                        direction: "rtl",
                        backgroundColor: loading ? "#f5f5f5" : "white",
                        cursor: loading ? "not-allowed" : "text",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.palette.primary.main;
                        e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "none";
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
              <div style={{ width: "100%" }}>
                <h3
                  style={{
                    marginBottom: "32px",
                    fontWeight: 600,
                    color: "#333",
                    fontSize: "18px",
                    fontFamily: "inherit",
                  }}
                >
                  פרטי מוצר
                </h3>

                <div style={{ display: "grid", gap: "32px" }}>
                  {/* שם המוצר */}
                  <div style={{ width: "100%" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#333",
                        fontFamily: "inherit",
                      }}
                    >
                      שם המוצר *
                    </label>
                    <input
                      type="text"
                      value={currentProduct?.name || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          name: e.target.value,
                        })
                      }
                      disabled={loading}
                      style={{
                        width: "100%",
                        height: "64px",
                        padding: "0 16px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        outline: "none",
                        fontFamily: "inherit",
                        direction: "rtl",
                        backgroundColor: loading ? "#f5f5f5" : "white",
                        cursor: loading ? "not-allowed" : "text",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.palette.primary.main;
                        e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* קטגוריה */}
                  <div style={{ width: "100%" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#333",
                        fontFamily: "inherit",
                      }}
                    >
                      קטגוריה *
                    </label>
                    <select
                      value={currentProduct?.category || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          category: e.target.value,
                        })
                      }
                      disabled={loading}
                      style={{
                        width: "100%",
                        height: "64px",
                        padding: "0 16px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        outline: "none",
                        fontFamily: "inherit",
                        direction: "rtl",
                        backgroundColor: loading ? "#f5f5f5" : "white",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.palette.primary.main;
                        e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="">בחר קטגוריה...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* מחיר וכמות */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "24px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                          fontFamily: "inherit",
                        }}
                      >
                        מחיר (₪) *
                      </label>
                      <input
                        type="number"
                        value={currentProduct?.price || ""}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={loading}
                        style={{
                          width: "100%",
                          height: "64px",
                          padding: "0 16px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          outline: "none",
                          fontFamily: "inherit",
                          direction: "rtl",
                          backgroundColor: loading ? "#f5f5f5" : "white",
                          cursor: loading ? "not-allowed" : "text",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            theme.palette.primary.main;
                          e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                          fontFamily: "inherit",
                        }}
                      >
                        כמות במלאי
                      </label>
                      <input
                        type="number"
                        value={currentProduct?.stockQuantity || ""}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            stockQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={loading}
                        style={{
                          width: "100%",
                          height: "64px",
                          padding: "0 16px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          outline: "none",
                          fontFamily: "inherit",
                          direction: "rtl",
                          backgroundColor: loading ? "#f5f5f5" : "white",
                          cursor: loading ? "not-allowed" : "text",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            theme.palette.primary.main;
                          e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* הנחה וסטטוס */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "24px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                          fontFamily: "inherit",
                        }}
                      >
                        הנחה (%)
                      </label>
                      <input
                        type="number"
                        value={currentProduct?.discount || ""}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            discount: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={loading}
                        style={{
                          width: "100%",
                          height: "64px",
                          padding: "0 16px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          outline: "none",
                          fontFamily: "inherit",
                          direction: "rtl",
                          backgroundColor: loading ? "#f5f5f5" : "white",
                          cursor: loading ? "not-allowed" : "text",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            theme.palette.primary.main;
                          e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                          fontFamily: "inherit",
                        }}
                      >
                        סטטוס המוצר
                      </label>
                      <select
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
                        disabled={loading}
                        style={{
                          width: "100%",
                          height: "64px",
                          padding: "0 16px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          outline: "none",
                          fontFamily: "inherit",
                          direction: "rtl",
                          backgroundColor: loading ? "#f5f5f5" : "white",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            theme.palette.primary.main;
                          e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#ccc";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value={true}>🟢 פעיל</option>
                        <option value={false}>🔴 לא פעיל</option>
                      </select>
                    </div>
                  </div>

                  {/* תיאור */}
                  <div style={{ width: "100%" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#333",
                        fontFamily: "inherit",
                      }}
                    >
                      תיאור המוצר *
                    </label>
                    <textarea
                      value={currentProduct?.description || ""}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          description: e.target.value,
                        })
                      }
                      disabled={loading}
                      rows={4}
                      placeholder="הזן תיאור מפורט של המוצר..."
                      style={{
                        width: "100%",
                        padding: "16px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        outline: "none",
                        fontFamily: "inherit",
                        direction: "rtl",
                        backgroundColor: loading ? "#f5f5f5" : "white",
                        cursor: loading ? "not-allowed" : "text",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        resize: "vertical",
                        minHeight: "120px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.palette.primary.main;
                        e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* תגיות */}
                  <div style={{ width: "100%" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#333",
                        fontFamily: "inherit",
                      }}
                    >
                      תגיות (מופרדות בפסיקים)
                    </label>
                    <input
                      type="text"
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
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "none";
                      }}
                      disabled={loading}
                      placeholder="לדוגמה: אופנה, חורף, מבצע"
                      style={{
                        width: "100%",
                        height: "64px",
                        padding: "0 16px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        outline: "none",
                        fontFamily: "inherit",
                        direction: "rtl",
                        backgroundColor: loading ? "#f5f5f5" : "white",
                        cursor: loading ? "not-allowed" : "text",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.palette.primary.main;
                        e.target.style.boxShadow = `0 0 0 1px ${theme.palette.primary.main}`;
                      }}
                    />

                    {/* הצגת תגיות */}
                    {currentProduct?.tags && currentProduct.tags.length > 0 && (
                      <div
                        style={{
                          marginTop: "16px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {currentProduct.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              border: "1px solid #1976d2",
                              borderRadius: "16px",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Box>
        </DialogContent>

        {/* כפתורים */}
        <DialogActions
          sx={{
            p: 2,
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
            sx={{ minWidth: 140 }}
          >
            {loading
              ? "שומר..."
              : currentProduct?._id
              ? "שמור שינויים"
              : "הוסף מוצר"}
          </Button>
        </DialogActions>
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
