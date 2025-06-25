import React, { useState, useRef } from 'react';
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
import { removeFromCart, updateCartQuantity } from '../../store/slices/cartSlice';
import CloseIcon from '@mui/icons-material/Close';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, subtotal, itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartQuantity({ itemId, quantity: newQuantity }));
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
            badgeContent={itemCount} 
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
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {items.map((item) => (
                  <React.Fragment key={item._id}>
                    <ListItem alignItems="flex-start">
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
                          {(item.image || item.imageUrl) ? (
                            <Box
                              component="img"
                              src={(() => {
                                const imgSrc = item.image || item.imageUrl;
                                if (!imgSrc) return '/placeholder.png';
                                return imgSrc.startsWith('http') ? imgSrc : `${process.env.REACT_APP_API_URL || ''}${imgSrc}`;
                              })()}
                              alt={item.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                              onError={(e) => {
                                e.target.onerror = null; // הימנעות מלולאה אינסופית
                                e.target.src = '/placeholder.png';
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
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography component="span" variant="body2" color="text.primary">
                              ₪{item.price} × {item.quantity}
                            </Typography>
                            <Typography component="span" variant="body2" color="primary.main" sx={{ display: 'block', fontWeight: 'bold' }}>
                              ₪{(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                          <ButtonGroup size="small" orientation="vertical" variant="outlined">
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </ButtonGroup>
                          <IconButton 
                            size="small"
                            onClick={() => handleRemoveItem(item._id)}
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
                  <Typography variant="subtitle1" fontWeight="bold">₪{subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mb: 1 }}
                  onClick={handleCheckout}
                >
                  מעבר לקופה
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
