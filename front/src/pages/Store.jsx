import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import ProductFilters from '../components/store/ProductFilters';
import ProductGrid from '../components/store/ProductGrid';
import ProductSortBar from '../components/store/ProductSortBar';

const Store = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    minRating: 0
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Extract search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, keyword: searchQuery }));
    }
  }, [location.search]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getProducts({
        page: currentPage,
        pageSize: productsPerPage,
        keyword: filters.keyword,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: sortBy
      });
      
      setProducts(result.data || []);
      setTotalProducts(result.pagination?.total || 0);
      setTotalPages(result.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('שגיאה בטעינת המוצרים. אנא נסה שוב.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters, sort, or page changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage, filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          חנות המוצרים
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {totalProducts > 0 && `נמצאו ${totalProducts} מוצרים`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Filters Sidebar */}
        {!isMobile && (
          <Box sx={{ width: '300px', flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <ProductFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Sort and View Options */}
          <ProductSortBar
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            productsPerPage={productsPerPage}
            onProductsPerPageChange={setProductsPerPage}
            totalProducts={totalProducts}
            isMobile={isMobile}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 4 }}>
              {error}
            </Alert>
          ) : (
            <ProductGrid
              products={products}
              viewMode={viewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Store;