import React from 'react';
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
  Tooltip,
  Menu,
  Paper,
} from '@mui/material';
import { 
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { removeFromFavorites } from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';

const FavoritesDropdown = ({ anchorEl, onClose, isMobile = false }) => {
  const { favorites, quantity } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isOpen = Boolean(anchorEl);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromFavorites(itemId));
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product }));
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  // Mobile version - full screen drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "350px" },
            direction: "rtl",
          },
        }}
      >
        <Box sx={{ 
          width: "100%", 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          direction: "rtl"
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography variant="h6" fontWeight="bold">המועדפים שלי</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {favorites.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '50%',
              textAlign: 'center',
              p: 3
            }}>
              <FavoriteBorderIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                אין לך עדיין פריטים מועדפים
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => handleNavigate('/store')}
              >
                המשך לקנות
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {favorites.map((item) => (
                  <React.Fragment key={item.id || item._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {item.imageUrl || item.image ? (
                            <img
                              src={item.imageUrl || item.image}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
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
                            <Typography component="span" variant="body2" color="primary.main" sx={{ display: 'block', fontWeight: 'bold' }}>
                              ₪{item.price && item.price.toFixed ? item.price.toFixed(2) : item.price}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="העבר לסל">
                            <IconButton 
                              size="small"
                              onClick={() => handleMoveToCart(item)}
                              sx={{ mb: 1 }}
                            >
                              <ShoppingCartIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="הסר מהמועדפים">
                            <IconButton 
                              size="small"
                              onClick={() => handleRemoveItem(item.id || item._id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mb: 1 }}
                  onClick={() => handleNavigate('/favorites')}
                >
                  צפייה בכל המועדפים
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => handleNavigate('/store')}
                >
                  המשך לקנות
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    );
  }

  // Desktop version - dropdown menu
  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: 350,
          maxHeight: 500,
          direction: "rtl",
          mt: 1,
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight="bold">המועדפים שלי</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {favorites.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4,
            textAlign: 'center'
          }}>
            <FavoriteBorderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              אין לך עדיין פריטים מועדפים
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={() => handleNavigate('/store')}
            >
              המשך לקנות
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
              {favorites.slice(0, 4).map((item) => (
                <React.Fragment key={item.id || item._id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        {item.imageUrl || item.image ? (
                          <img
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.png';
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                            אין תמונה
                          </Typography>
                        )}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="primary.main" fontWeight="bold">
                          ₪{item.price && item.price.toFixed ? item.price.toFixed(2) : item.price}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Tooltip title="העבר לסל">
                          <IconButton 
                            size="small"
                            onClick={() => handleMoveToCart(item)}
                          >
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="הסר מהמועדפים">
                          <IconButton 
                            size="small"
                            onClick={() => handleRemoveItem(item.id || item._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {favorites.indexOf(item) < Math.min(favorites.length - 1, 3) && (
                    <Divider variant="inset" />
                  )}
                </React.Fragment>
              ))}
            </List>
            
            {favorites.length > 4 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                +{favorites.length - 4} פריטים נוספים
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                onClick={() => handleNavigate('/favorites')}
              >
                צפה בהכל
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                onClick={() => handleNavigate('/store')}
              >
                המשך לקנות
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Menu>
  );
};

export default FavoritesDropdown;