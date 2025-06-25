import React from 'react';
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
import { updateCartQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const { items, subtotal, shipping, tax, total, itemCount } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
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
            <Typography variant="body1">מחיר המוצרים ({itemCount}):</Typography>
            <Typography variant="body1">₪{subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body1">משלוח:</Typography>
            <Typography variant="body1">₪{shipping.toFixed(2)}</Typography>
          </Box>
          {tax > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body1">מע"מ:</Typography>
              <Typography variant="body1">₪{tax.toFixed(2)}</Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">סה"כ לתשלום:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">₪{total.toFixed(2)}</Typography>
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
                  src={item.imageUrl || 'https://via.placeholder.com/100'} 
                  alt={item.name}
                  variant="rounded"
                  sx={{ width: '100%', height: 'auto', aspectRatio: '1/1' }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  מחיר: ₪{item.price.toFixed(2)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={item.quantity}
                    inputProps={{ 
                      style: { textAlign: 'center' }, 
                      min: 1, 
                      max: 99 
                    }}
                    sx={{ width: 60, mx: 1 }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item._id, value);
                      }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                סה"כ: ₪{(item.price * item.quantity).toFixed(2)}
              </Typography>
              <IconButton 
                color="error" 
                onClick={() => handleRemoveItem(item._id)}
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
                    src={item.imageUrl || 'https://via.placeholder.com/60'} 
                    alt={item.name} 
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Typography variant="subtitle1">{item.name}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">₪{item.price.toFixed(2)}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={item.quantity}
                    inputProps={{ 
                      style: { textAlign: 'center' }, 
                      min: 1, 
                      max: 99 
                    }}
                    sx={{ width: 60, mx: 1 }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item._id, value);
                      }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                ₪{(item.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(item._id)}
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
