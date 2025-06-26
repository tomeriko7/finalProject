import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Rating,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getProducts } from '../../api/productApi';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClose, // פונקציה לסגירת הפילטר במובייל
  isMobile = false // האם זה מוצג במובייל
}) => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [pendingFilters, setPendingFilters] = useState(filters); // פילטרים זמניים במובייל
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [pendingPriceRange, setPendingPriceRange] = useState([0, 1000]); // טווח מחירים זמני
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // חילוץ הקטגוריות מתוך המוצרים
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await getProducts({ pageSize: 100 });
        if (result.data) {
          const uniqueCategories = [...new Set(
            result.data
              .filter(product => product.category)
              .map(product => product.category)
          )].sort();
          
          console.log('Extracted categories:', uniqueCategories);
          setCategories(uniqueCategories);
        } else {
          setError('שגיאה בטעינת קטגוריות');
          console.error('Failed to load products for categories');
        }
      } catch (err) {
        setError('שגיאה בטעינת קטגוריות');
        console.error('Error fetching products for categories:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
    setPendingFilters(filters);
    if (filters.minPrice || filters.maxPrice) {
      const range = [
        filters.minPrice || 0,
        filters.maxPrice || 1000
      ];
      setPriceRange(range);
      setPendingPriceRange(range);
    }
  }, [filters]);

  // פונקציה לטיפול בשינוי פילטרים
  const handleFilterChange = (key, value) => {
    if (isMobile || isXsScreen) {
      // במובייל - שמירה זמנית
      const newPendingFilters = { ...pendingFilters, [key]: value };
      setPendingFilters(newPendingFilters);
    } else {
      // בדסקטופ - עדכון מיידי
      const newFilters = { ...localFilters, [key]: value };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  // פונקציה לטיפול בשינוי מחירים
  const handlePriceChange = (event, newValue) => {
    if (isMobile || isXsScreen) {
      // במובייל - שמירה זמנית
      setPendingPriceRange(newValue);
      const newPendingFilters = {
        ...pendingFilters,
        minPrice: newValue[0] > 0 ? newValue[0] : '',
        maxPrice: newValue[1] < 1000 ? newValue[1] : ''
      };
      setPendingFilters(newPendingFilters);
    } else {
      // בדסקטופ - עדכון מיידי
      setPriceRange(newValue);
      const newFilters = {
        ...localFilters,
        minPrice: newValue[0] > 0 ? newValue[0] : '',
        maxPrice: newValue[1] < 1000 ? newValue[1] : ''
      };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  // החלת הפילטרים (מובייל)
  const handleApplyFilters = () => {
    setLocalFilters(pendingFilters);
    setPriceRange(pendingPriceRange);
    onFilterChange(pendingFilters);
    if (onClose) {
      onClose(); // סגירת הדרור במובייל
    }
  };

  // ביטול שינויים (מובייל)
  const handleCancelChanges = () => {
    setPendingFilters(localFilters);
    setPendingPriceRange(priceRange);
    if (onClose) {
      onClose();
    }
  };

  // ניקוי פילטרים
  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      minRating: 0
    };
    
    if (isMobile || isXsScreen) {
      setPendingFilters(clearedFilters);
      setPendingPriceRange([0, 1000]);
    } else {
      setLocalFilters(clearedFilters);
      setPriceRange([0, 1000]);
      onFilterChange(clearedFilters);
    }
  };

  // בדיקה אם יש פילטרים פעילים
  const hasActiveFilters = Object.values(
    isMobile || isXsScreen ? pendingFilters : localFilters
  ).some(value => value !== '' && value !== false && value !== 0);

  // הפילטרים הנוכחיים לתצוגה
  const currentFilters = isMobile || isXsScreen ? pendingFilters : localFilters;
  const currentPriceRange = isMobile || isXsScreen ? pendingPriceRange : priceRange;

  return (
    <Paper sx={{ p: 3, height: isMobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* כותרת */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          מסננים
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ color: 'error.main' }}
          >
            נקה
          </Button>
        )}
      </Box>

      {/* תוכן הפילטרים */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="חיפוש מוצרים"
            value={currentFilters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            variant="outlined"
            size="small"
            placeholder="הקלד שם מוצר..."
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Category Filter */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              קטגוריה
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <InputLabel>בחר קטגוריה</InputLabel>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    טוען קטגוריות...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main', mt: 1 }}>
                  <WarningIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </Box>
              ) : (
                <Select
                  value={currentFilters.category || ''}
                  label="בחר קטגוריה"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  disabled={loading || categories.length === 0}
                >
                  <MenuItem value="">כל הקטגוריות</MenuItem>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      אין קטגוריות זמינות
                    </MenuItem>
                  )}
                </Select>
              )}
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              טווח מחירים
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Slider
                value={currentPriceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                valueLabelFormat={(value) => `₪${value}`}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  ₪{currentPriceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ₪{currentPriceRange[1]}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Stock Status */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              זמינות
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentFilters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  color="primary"
                />
              }
              label="רק מוצרים במלאי"
            />
          </AccordionDetails>
        </Accordion>

        {/* Rating Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              דירוג מינימלי
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating
                value={currentFilters.minRating}
                onChange={(event, newValue) => 
                  handleFilterChange('minRating', newValue || 0)
                }
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                ומעלה
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* כפתורים במובייל */}
      {(isMobile || isXsScreen) && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCancelChanges}
              fullWidth
              sx={{ 
                borderColor: 'grey.400',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.600',
                  backgroundColor: 'grey.50'
                }
              }}
            >
              ביטול
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleApplyFilters}
              fullWidth
              sx={{ 
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              החל פילטרים
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default ProductFilters;