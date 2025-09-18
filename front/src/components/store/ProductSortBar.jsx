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
  useMediaQuery,
  Collapse,
  Button
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
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
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOptionsExpanded, setSortOptionsExpanded] = useState(false);

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

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'מיון לפי';
  };

  // Mobile-first layout for very small screens
  if (isXsScreen) {
    return (
      <>
        <Paper sx={{ p: 1.5, mb: 2 }}>
          {/* Top row - Results count and mobile filters button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {totalProducts > 0 ? (
                `${Math.min(productsPerPage, totalProducts)} מתוך ${totalProducts}`
              ) : (
                'לא נמצאו מוצרים'
              )}
            </Typography>
            
            <IconButton
              onClick={() => setMobileFiltersOpen(true)}
              color="primary"
              size="small"
              sx={{ 
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Collapsible sort section */}
          <Box>
            <Button
              onClick={() => setSortOptionsExpanded(!sortOptionsExpanded)}
              startIcon={<SortIcon />}
              endIcon={sortOptionsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mb: 1, justifyContent: 'space-between' }}
            >
              {getCurrentSortLabel()}
            </Button>
            
            <Collapse in={sortOptionsExpanded}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                <FormControl size="small" fullWidth>
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

                <FormControl size="small" fullWidth>
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
              </Box>
            </Collapse>
          </Box>
        </Paper>

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="right"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: { width: '100%' }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              מסננים
            </Typography>
            <ProductFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onClose={() => setMobileFiltersOpen(false)}
              isMobile={true}
            />
          </Box>
        </Drawer>
      </>
    );
  }

  // Tablet layout for medium screens
  if (isMdScreen) {
    return (
      <>
        <Paper sx={{ p: 2, mb: 3 }}>
          {/* First row - Results count and mobile filters */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              {totalProducts > 0 ? (
                `מציג ${Math.min(productsPerPage, totalProducts)} מתוך ${totalProducts} מוצרים`
              ) : (
                'לא נמצאו מוצרים'
              )}
            </Typography>
            
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
          </Box>

          {/* Second row - Controls */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Sort */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 200 }}>
              <SortIcon color="action" />
              <FormControl size="small" fullWidth sx={{ maxWidth: 200 }}>
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
          </Box>
        </Paper>

        {/* Mobile Filters Drawer */}
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
              onFilterChange={onFilterChange}
              onClose={() => setMobileFiltersOpen(false)}
              isMobile={true}
            />
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop layout (original with minor improvements)
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
          {/* Left side - Results count */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            flexWrap: 'nowrap'
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
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ProductSortBar;