import React, { useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { 
  removeFromCart, 
  updateCartQuantity,
  removeFromCartAsync,
  updateCartQuantityAsync
} from '../../store/slices/cartSlice';
import { AuthContext } from '../../services/AuthContext';
import CloseIcon from '@mui/icons-material/Close';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, subtotal, itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;
  
  // חישוב סה"כ דינמי מהפריטים בעגלה
  const calculateTotal = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      const itemPrice = Number(item.price || item.product?.price || 0);
      const itemQuantity = Number(item.quantity || 1);
      // וידוא שהערכים הם מספרים תקינים
      if (isNaN(itemPrice) || isNaN(itemQuantity)) return total;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const dynamicSubtotal = calculateTotal() || 0;
  const totalItems = items ? items.reduce((total, item) => total + (Number(item.quantity) || 1), 0) : 0;
  
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveItem = async (item) => {
    try {
      if (isAuthenticated) {
        // משתמש מחובר - הסרה מהשרת
        await dispatch(removeFromCartAsync(item._id)).unwrap();
      } else {
        // משתמש לא מחובר - הסרה מ-localStorage
        dispatch(removeFromCart(item._id || item.id));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(item);
      } else {
        if (isAuthenticated) {
          // משתמש מחובר - עדכון בשרת
          await dispatch(updateCartQuantityAsync({ 
            cartItemId: item._id, 
            quantity: newQuantity 
          })).unwrap();
        } else {
          // משתמש לא מחובר - עדכון ב-localStorage
          dispatch(updateCartQuantity({ 
            itemId: item._id || item.id, 
            quantity: newQuantity 
          }));
        }
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <Tooltip title="עגלת קניות">
        <IconButton 
          color="inherit" 
          onClick={toggleDrawer}
          sx={{
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              color: 'primary.main'
            }
          }}
        >
          <Badge 
            badgeContent={totalItems} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 320, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">העגלה שלך</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {items.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '50%',
              textAlign: 'center',
              p: 3
            }}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                העגלה שלך ריקה
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/store');
                }}
              >
                המשך לקנות
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {[...items].reverse().map((item, index) => (
                  <React.Fragment key={item._id || item.id || index}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 1,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {(item.imageUrl || item.image || item.product?.imageUrl || item.product?.image) ? (
                            <Box
                              component="img"
                              src={(() => {
                                const imgSrc = item.imageUrl || item.image || item.product?.imageUrl || item.product?.image;
                                if (!imgSrc) return '/logo192.png';
                                if (imgSrc.startsWith('http')) return imgSrc;
                                return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imgSrc}`;
                              })()}
                              alt={item.name || item.product?.name || 'מוצר'}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/60x60?text=תמונה+לא+זמינה';
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              אין תמונה
                            </Typography>
                          )}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium" noWrap>
                            {item.name || item.product?.name || 'מוצר לא מזוהה'}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography component="span" variant="body2" color="text.primary">
                              ₪{Number(item.price || item.product?.price || 0).toFixed(2)} × {item.quantity || 1}
                            </Typography>
                            <Typography component="span" variant="body2" color="primary.main" sx={{ display: 'block', fontWeight: 'bold' }}>
                              ₪{(Number(item.price || item.product?.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <ButtonGroup size="small" orientation="vertical" variant="outlined">
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item, (item.quantity || 1) + 1)}
                              title="הוספת יחידה"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                            
                            {/* הצגת הכמות */}
                            <Box 
                              sx={{ 
                                py: 0.5, 
                                px: 1, 
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                minWidth: 32,
                                textAlign: 'center'
                              }}
                            >
                              <Typography variant="caption" fontWeight="bold">
                                {item.quantity || 1}
                              </Typography>
                            </Box>
                            
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item, (item.quantity || 1) - 1)}
                              title="הסרת יחידה"
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </ButtonGroup>
                          <IconButton 
                            size="small"
                            onClick={() => handleRemoveItem(item)}
                            color="error"
                            title="הסרת מוצר"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">סה"כ:</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ₪{Number(dynamicSubtotal || 0).toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mb: 1 }}
                  onClick={handleCheckout}
                  disabled={!items || items.length === 0}
                >
                  מעבר לקופה ({totalItems} מוצרים)
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/store');
                  }}
                >
                  המשך לקנות
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CartDropdown;
