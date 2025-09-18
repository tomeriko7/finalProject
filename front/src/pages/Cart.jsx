import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Divider,
  TextField,
  Avatar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  updateCartQuantity, 
  removeFromCart, 
  clearCart,
  updateCartQuantityAsync,
  removeFromCartAsync,
  clearCartAsync
} from '../store/slices/cartSlice';
import { AuthContext } from '../services/AuthContext';

const Cart = () => {
  const { items, subtotal, shipping, tax, total, itemCount } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  // חישוב סה"כ דינמי כמו ב-CartDropdown
  const calculateTotal = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      const itemPrice = Number(item.price || item.product?.price || 0);
      const itemQuantity = Number(item.quantity || 1);
      if (isNaN(itemPrice) || isNaN(itemQuantity)) return total;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const dynamicSubtotal = calculateTotal() || 0;
  const dynamicShipping = Number(shipping) || 0;
  const dynamicTax = Number(tax) || 0;
  const dynamicTotal = dynamicSubtotal + dynamicShipping + dynamicTax;
  const totalItems = items ? items.reduce((total, item) => total + (Number(item.quantity) || 1), 0) : 0;

  const handleQuantityChange = async (item, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(item);
      } else {
        if (isAuthenticated) {
          await dispatch(updateCartQuantityAsync({ 
            cartItemId: item._id, 
            quantity: newQuantity 
          })).unwrap();
        } else {
          dispatch(updateCartQuantity({ 
            itemId: item._id || item.id, 
            quantity: newQuantity 
          }));
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      if (isAuthenticated) {
        await dispatch(removeFromCartAsync(item._id)).unwrap();
      } else {
        dispatch(removeFromCart(item._id || item.id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(clearCartAsync()).unwrap();
      } else {
        dispatch(clearCart());
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  
  // לחיצה על כפתור המשך לקנות  
  const handleContinueShopping = () => {
    navigate('/store');
  };

  // לחיצה על כפתור מעבר לקופה
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const CartEmpty = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" gutterBottom fontWeight="500">העגלה שלך ריקה</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        נראה שעדיין לא הוספת פריטים לעגלת הקניות שלך
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        startIcon={<ArrowBackIcon />}
        onClick={handleContinueShopping}
        sx={{ 
          px: 4, 
          py: 1.5,
          fontWeight: 'bold',
          borderRadius: 2
        }}
      >
        המשך לקנות
      </Button>
    </Box>
  );

  const OrderSummary = () => (
    <Card elevation={3} sx={{ position: 'sticky', top: '2rem' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          סיכום הזמנה
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body1">מחיר המוצרים ({totalItems}):</Typography>
            <Typography variant="body1">₪{dynamicSubtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body1">משלוח:</Typography>
            <Typography variant="body1">₪{dynamicShipping.toFixed(2)}</Typography>
          </Box>
          {dynamicTax > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body1">מע"מ:</Typography>
              <Typography variant="body1">₪{dynamicTax.toFixed(2)}</Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">סה"כ לתשלום:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">₪{dynamicTotal.toFixed(2)}</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            onClick={handleCheckout}
            sx={{ mb: 2, py: 1.5, fontWeight: 'bold' }}
          >
            מעבר לקופה
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth
            onClick={handleContinueShopping}
          >
            המשך לקנות
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
  
  // תצוגה למובייל
  const MobileCart = () => (
    <>
      {items.map((item) => (
        <Card key={item._id} sx={{ mb: 2, position: 'relative' }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Avatar 
                  src={(() => {
                    const imgSrc = item.imageUrl || item.image || item.product?.imageUrl || item.product?.image;
                    if (!imgSrc) return 'https://via.placeholder.com/100x100?text=תמונה+לא+זמינה';
                    if (imgSrc.startsWith('http')) return imgSrc;
                    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imgSrc}`;
                  })()}
                  alt={item.name || item.product?.name || 'מוצר'}
                  variant="rounded"
                  sx={{ 
                    width: '100%', 
                    height: 'auto', 
                    aspectRatio: '1/1',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100x100?text=תמונה+לא+זמינה';
                    }
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  מחיר: ₪{(Number(item.price || item.product?.price || 0)).toFixed(2)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item, (Number(item.quantity) || 1) - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={Number(item.quantity) || 1}
                    inputProps={{ 
                      style: { textAlign: 'center' }, 
                      min: 1, 
                      max: 99 
                    }}
                    sx={{ width: 60, mx: 1 }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item, value);
                      }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item, (Number(item.quantity) || 1) + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                סה"כ: ₪{((Number(item.price || item.product?.price || 0)) * (Number(item.quantity) || 1)).toFixed(2)}
              </Typography>
              <IconButton 
                color="error" 
                onClick={() => handleRemoveItem(item)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );

  // תצוגה רגילה (דסקטופ/טאבלט)
  const DesktopCart = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
            <TableCell>מוצר</TableCell>
            <TableCell align="center">מחיר</TableCell>
            <TableCell align="center">כמות</TableCell>
            <TableCell align="center">סה"כ</TableCell>
            <TableCell align="center">הסרה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={(() => {
                      const imgSrc = item.imageUrl || item.image || item.product?.imageUrl || item.product?.image;
                      if (!imgSrc) return 'https://via.placeholder.com/60x60?text=תמונה+לא+זמינה';
                      if (imgSrc.startsWith('http')) return imgSrc;
                      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imgSrc}`;
                    })()}
                    alt={item.name || item.product?.name || 'מוצר'}
                    variant="rounded"
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                    imgProps={{
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/60x60?text=תמונה+לא+זמינה';
                      }
                    }}
                  />
                  <Typography variant="subtitle1">{item.name || item.product?.name}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">₪{(Number(item.price || item.product?.price || 0)).toFixed(2)}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item, (Number(item.quantity) || 1) - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={Number(item.quantity) || 1}
                    inputProps={{ 
                      style: { textAlign: 'center' }, 
                      min: 1, 
                      max: 99 
                    }}
                    sx={{ width: 60, mx: 1 }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item, value);
                      }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item, (Number(item.quantity) || 1) + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                ₪{((Number(item.price || item.product?.price || 0)) * (Number(item.quantity) || 1)).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(item)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // תצוגה עבור עגלה ריקה או מלאה
  return (
    <Container sx={{ py: 4, minHeight: '80vh' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'right' }}>
        עגלת הקניות
      </Typography>
      
      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {isMobile ? <MobileCart /> : <DesktopCart />}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleClearCart}
              >
                נקה עגלה
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleContinueShopping}
              >
                המשך לקנות
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <OrderSummary />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
