import React, { useState } from 'react';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import ProductFilters from './ProductFilters';

const ProductSortBar = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  productsPerPage,
  onProductsPerPageChange,
  totalProducts,
  isMobile,
  filters,
  onFilterChange
}) => {
  const theme = useTheme();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sortOptions = [
    { value: 'createdAt:desc', label: 'החדשים ביותר' },
    { value: 'createdAt:asc', label: 'הישנים ביותר' },
    { value: 'price:asc', label: 'מחיר: נמוך לגבוה' },
    { value: 'price:desc', label: 'מחיר: גבוה לנמוך' },
    { value: 'name:asc', label: 'שם: א-ת' },
    { value: 'name:desc', label: 'שם: ת-א' },
    { value: 'rating:desc', label: 'דירוג גבוה' },
    { value: 'popularity:desc', label: 'פופולריים' }
  ];

  const itemsPerPageOptions = [12, 24, 36, 48];

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Left side - Results count and mobile filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={() => setMobileFiltersOpen(true)}
                color="primary"
                sx={{ 
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1
                }}
              >
                <FilterListIcon />
              </IconButton>
            )}
            
            <Typography variant="body2" color="text.secondary">
              {totalProducts > 0 ? (
                `מציג ${Math.min(productsPerPage, totalProducts)} מתוך ${totalProducts} מוצרים`
              ) : (
                'לא נמצאו מוצרים'
              )}
            </Typography>
          </Box>

          {/* Right side - Sort and view controls */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Sort */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SortIcon color="action" />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>מיון לפי</InputLabel>
                <Select
                  value={sortBy}
                  label="מיון לפי"
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Items per page */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>הצג</InputLabel>
              <Select
                value={productsPerPage}
                label="הצג"
                onChange={(e) => onProductsPerPageChange(e.target.value)}
              >
                {itemsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* View Mode Toggle */}
            {!isMobile && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                sx={{ 
                  '& .MuiToggleButton-root': {
                    border: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="grid" aria-label="תצוגת רשת">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="תצוגת רשימה">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Mobile Filters Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: { width: '100%', maxWidth: 400 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              מסננים
            </Typography>
            <ProductFilters
              filters={filters}
              onFilterChange={(newFilters) => {
                onFilterChange(newFilters);
                setMobileFiltersOpen(false);
              }}
            />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default ProductSortBar;
