import React from "react";
import { Box, Typography, Pagination, Paper, Button } from "@mui/material";
import {
  SearchOff as SearchOffIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  viewMode,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  // Empty state
  if (!products || products.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "grey.50",
        }}
      >
        <SearchOffIcon
          sx={{
            fontSize: 80,
            color: "grey.400",
            mb: 2,
          }}
        />
        <Typography variant="h5" gutterBottom color="text.secondary">
          לא נמצאו מוצרים
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          נסה לשנות את הקריטריונים של החיפוש או המסננים
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          רענן דף
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Products Grid/List */}
      {viewMode === "list" ? (
        // List View
        <Box>
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              viewMode="list"
            />
          ))}
        </Box>
      ) : (
        // Grid View
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            gridAutoRows: { xs: "480px", sm: "520px" },
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              viewMode="grid"
            />
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}

      {/* Results summary */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          עמוד {currentPage} מתוך {totalPages}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductGrid;
