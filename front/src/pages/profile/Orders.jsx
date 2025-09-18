import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Grid, 
  Chip, 
  Avatar, 
  Card, 
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { AuthContext } from '../../services/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { formatDate } from '../../utils/formatters';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let data = await getUserOrders();
        // וידוא שהנתונים הם מערך
        let ordersArray = Array.isArray(data) ? data : (data.orders || data.data || []);
        // סידור ההזמנות מהחדשה לישנה
        const sortedOrders = ordersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('אירעה שגיאה בטעינת ההזמנות. אנא נסה שנית מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // פונקציה להצגת סטטוס ההזמנה בעברית
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'ממתינה לאישור',
      'processing': 'בטיפול',
      'shipped': 'נשלחה',
      'delivered': 'נמסרה',
      'cancelled': 'בוטלה'
    };
    return statusMap[status] || status;
  };

  // פונקציה להצגת צבע הסטטוס
  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'error'
    };
    return colorMap[status] || 'default';
  };

  // רינדור של הזמנה בודדת
  const renderOrder = (order) => {
    return (
      <Accordion key={order._id} sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`order-${order._id}-content`}
          id={`order-${order._id}-header`}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <ShoppingBagIcon color="primary" />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold">
                הזמנה {order.orderNumber || `#${order._id.substring(0, 8)}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(order.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                {order.items.length} פריטים
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ₪{order.total.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Chip 
                label={getStatusText(order.status)} 
                color={getStatusColor(order.status)}
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionSummary>
        
        <AccordionDetails>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={3}>
              {/* פרטי המוצרים */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  פריטים שהוזמנו
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {order.items.map((item) => (
                    <Box key={item._id || item.product._id} sx={{ display: 'flex', mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={item.product?.imageUrl || 'https://via.placeholder.com/60'} 
                          variant="rounded" 
                          sx={{ width: 60, height: 60, mx: 2 }} 
                        />
                        <Box>
                          <Typography variant="subtitle2">
                            {item.product?.name || 'מוצר לא ידוע'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} יחידות x ₪{(typeof item.product?.price === 'number' ? item.product.price : (typeof item.price === 'number' ? item.price : 0)).toFixed(2)}
                          </Typography>
                          {item.product?.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {item.product.description.substring(0, 80)}{item.product.description.length > 80 ? '...' : ''}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        ₪{(item.quantity * (typeof item.product?.price === 'number' ? item.product.price : (typeof item.price === 'number' ? item.price : 0))).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              {/* פרטי משלוח ותשלום */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  פרטי הזמנה
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        תאריך הזמנה: {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          כתובת למשלוח:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.address}
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.city}, {order.shipping.zipCode}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {order.payment.method === 'credit' 
                          ? `כרטיס אשראי המסתיים ב-${order.payment.cardLastFour}` 
                          : 'PayPal'}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">סכום ביניים:</Typography>
                      <Typography variant="body2">₪{(typeof order.subtotal === 'number' ? order.subtotal : 0).toFixed(2)}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">משלוח:</Typography>
                      <Typography variant="body2">₪{(typeof order.shippingCost === 'number' ? order.shippingCost : (typeof order.shipping === 'number' ? order.shipping : 0)).toFixed(2)}</Typography>
                    </Box>
                    
                    {order.tax > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">מע"מ:</Typography>
                        <Typography variant="body2">₪{(typeof order.tax === 'number' ? order.tax : 0).toFixed(2)}</Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        סה"כ:
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        ₪{(typeof order.total === 'number' ? order.total : 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // רינדור של הזמנות ריקות
  const renderEmptyOrders = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" gutterBottom fontWeight="500">
        אין לך הזמנות קודמות
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        נראה שעדיין לא ביצעת הזמנות בחנות שלנו
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        href="/store"
        sx={{ px: 4, py: 1.5 }}
      >
        התחל לקנות
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'right' }}>
        ההזמנות שלי
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : orders.length > 0 ? (
        <Box>
          {orders.map(renderOrder)}
        </Box>
      ) : (
        renderEmptyOrders()
      )}
    </Container>
  );
};

export default Orders;
