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
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { getProducts } from '../../api/productApi';

const ProductFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // חילוץ הקטגוריות מתוך המוצרים
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // מביא את כל המוצרים, עם גודל דף גדול כדי לקבל כמה שיותר
        const result = await getProducts({ pageSize: 100 });
        if (result.data) {
          // מחלץ את הקטגוריות מהמוצרים
          const uniqueCategories = [...new Set(
            result.data
              .filter(product => product.category) // מסנן מוצרים ללא קטגוריה
              .map(product => product.category) // חילוץ הקטגוריות
          )].sort(); // ממיין אלפביתית
          
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
    if (filters.minPrice || filters.maxPrice) {
      setPriceRange([
        filters.minPrice || 0,
        filters.maxPrice || 1000
      ]);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    const newFilters = {
      ...localFilters,
      minPrice: newValue[0] > 0 ? newValue[0] : '',
      maxPrice: newValue[1] < 1000 ? newValue[1] : ''
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      minRating: 0
    };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 1000]);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== false && value !== 0
  );

  return (
    <Paper sx={{ p: 3 }}>
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

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="חיפוש מוצרים"
          value={localFilters.keyword}
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
                value={localFilters.category || ''}
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
              value={priceRange}
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
                ₪{priceRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₪{priceRange[1]}
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
                checked={localFilters.inStock}
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
              value={localFilters.minRating}
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
    </Paper>
  );
};

export default ProductFilters;
