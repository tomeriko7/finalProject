import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Button
} from "@mui/material";
import { getProducts } from "../../api/productApi";
import ProductCard from "../store/ProductCard";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        // שימוש ב-API כדי להביא את המוצרים החדשים ביותר, עד 4 מוצרים
        const result = await getProducts({
          pageSize: 4,            // הצגת 4 מוצרים בלבד
          sort: 'createdAt:desc', // מיון לפי תאריך יצירה בסדר יורד
        });
        
        setProducts(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching new products:', err);
        setError(err.toString());
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const handleViewAllProducts = () => {
    navigate('/store');
  };

  return (
    <Box sx={{ py: 8, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          החדשים שלנו
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}
        >
          גלו את קולקציות הצמחים ואביזרי הגינה החדשים ביותר שלנו
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            אין מוצרים חדשים להצגה כרגע
          </Alert>
        ) : (

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            gridAutoRows: { xs: '480px', sm: '520px' },
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 }
          }}
        >
          {products?.map((product) => (
            <ProductCard 
              key={product.id || product._id}
              product={product} 
              viewMode="grid"
            />
          ))}
        </Box>
        )}

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 20px rgba(25, 115, 96, 0.3)",
              },
            }}
            onClick={handleViewAllProducts}
          >
            צפייה בכל המוצרים
          </Button>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};
