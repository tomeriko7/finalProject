import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartIcon = () => {
  const navigate = useNavigate();
  const { itemCount } = useSelector((state) => state.cart);
  
  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <Tooltip title="עגלת קניות">
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        sx={{
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            color: '#f0c14b'
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
  );
};

export default CartIcon;
