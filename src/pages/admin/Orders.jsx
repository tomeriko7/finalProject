import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Stack,
  Collapse,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDate, formatPrice } from '../../utils/formatters';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../../services/orderService';

const AdminOrders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        
        // וידוא שהנתונים הם מערך
        let ordersArray = [];
        if (Array.isArray(response)) {
          ordersArray = response;
        } else if (response && typeof response === 'object') {
          // אם יש מאפיין orders או data, נשתמש בו
          ordersArray = response.orders || response.data || [];
        }
        
        setOrders(ordersArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setSnackbar({
          open: true,
          message: 'שגיאה בטעינת ההזמנות',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  
  // התאמת מצב הפילטרים לשינויים בגודל המסך
  useEffect(() => {
    setFiltersVisible(!isMobile);
  }, [isMobile]);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ));
      
      setSnackbar({
        open: true,
        message: 'סטטוס ההזמנה עודכן בהצלחה',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'שגיאה בעדכון סטטוס ההזמנה',
        severity: 'error'
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter(order => order._id !== orderId));
        setSnackbar({
          open: true,
          message: 'ההזמנה נמחקה בהצלחה',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'שגיאה במחיקת ההזמנה',
          severity: 'error'
        });
      }
    }
  };

  // וידוא שorders הוא מערך לפני ביצוע filter
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = safeOrders.filter(order => {
    if (!order) return false;
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesSearch = false;
    if (searchTerm === '') {
      matchesSearch = true;
    } else {
      // בדיקה בטוחה של כל השדות
      const orderNumberMatch = order.orderNumber && 
        order.orderNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
        
      const userFirstNameMatch = order.user?.firstName && 
        order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase());
        
      const userLastNameMatch = order.user?.lastName && 
        order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        
      const userEmailMatch = order.user?.email && 
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
      matchesSearch = orderNumberMatch || userFirstNameMatch || userLastNameMatch || userEmailMatch;
    }
    
    return matchesStatus && matchesSearch;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // רינדור כרטיסיות הזמנה למובייל
  const renderOrderCard = (order) => (
    <Paper
      key={order._id}
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {order.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(order.createdAt)}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={order.status}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
            variant="outlined"
            sx={{ height: 36 }}
          >
            <MenuItem value="pending">ממתינה לאישור</MenuItem>
            <MenuItem value="processing">בטיפול</MenuItem>
            <MenuItem value="shipped">נשלחה</MenuItem>
            <MenuItem value="delivered">נמסרה</MenuItem>
            <MenuItem value="cancelled">בוטלה</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          {order.user.firstName} {order.user.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {order.user.email}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2">
          {order.items.length} פריטים
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          {formatPrice(order.total)}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={() => handleViewOrder(order)}
          sx={{ borderRadius: 2 }}
        >
          פרטים
        </Button>
        <IconButton
          size="small"
          onClick={() => handleDeleteOrder(order._id)}
          color="error"
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: { xs: 2, md: 4 }, 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
      }}>
        ניהול הזמנות
      </Typography>

      {/* כפתור פתיחת פילטרים במובייל */}
      {isMobile && (
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          endIcon={<KeyboardArrowDownIcon 
            sx={{ 
              transform: filtersVisible ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s'
            }} 
          />}
          onClick={() => setFiltersVisible(!filtersVisible)}
          fullWidth
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {filtersVisible ? 'הסתר פילטרים' : 'הצג פילטרים'}
        </Button>
      )}

      {/* פילטרים וחיפוש */}
      <Collapse in={filtersVisible}>
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="חיפוש הזמנה"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>סטטוס</InputLabel>
                <Select
                  value={statusFilter}
                  label="סטטוס"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">כל הסטטוסים</MenuItem>
                  <MenuItem value="pending">ממתינה לאישור</MenuItem>
                  <MenuItem value="processing">בטיפול</MenuItem>
                  <MenuItem value="shipped">נשלחה</MenuItem>
                  <MenuItem value="delivered">נמסרה</MenuItem>
                  <MenuItem value="cancelled">בוטלה</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  סה"כ {filteredOrders.length} הזמנות
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* טבלת הזמנות למסכים גדולים / כרטיסיות למובייל */}
      <Paper sx={{ borderRadius: 2 }}>
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map(order => renderOrderCard(order))
            ) : (
              <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                לא נמצאו הזמנות
              </Typography>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>מספר הזמנה</TableCell>
                  <TableCell>לקוח</TableCell>
                  <TableCell>תאריך</TableCell>
                  <TableCell>פריטים</TableCell>
                  <TableCell>סכום</TableCell>
                  <TableCell>סטטוס</TableCell>
                  <TableCell>פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.user.firstName} {order.user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.items.length} פריטים
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          variant="outlined"
                        >
                          <MenuItem value="pending">ממתינה לאישור</MenuItem>
                          <MenuItem value="processing">בטיפול</MenuItem>
                          <MenuItem value="shipped">נשלחה</MenuItem>
                          <MenuItem value="delivered">נמסרה</MenuItem>
                          <MenuItem value="cancelled">בוטלה</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="צפייה בפרטים">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקת הזמנה">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "" : "שורות בעמוד:"}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
        />
      </Paper>

      {/* דיאלוג פרטי הזמנה - מסך מלא במובייל */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
          }
        }}
      >
        {isMobile ? (
          <AppBar position="sticky" color="primary" sx={{ mb: 2 }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                פרטי הזמנה {selectedOrder?.orderNumber}
              </Typography>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle>
            פרטי הזמנה {selectedOrder?.orderNumber}
          </DialogTitle>
        )}

        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {selectedOrder && (
            <Grid container spacing={isMobile ? 2 : 3}>
              {/* פרטי לקוח */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>פרטי לקוח</Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>שם:</strong> {selectedOrder.contactInfo.firstName} {selectedOrder.contactInfo.lastName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>אימייל:</strong> {selectedOrder.contactInfo.email}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>טלפון:</strong> {selectedOrder.contactInfo.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* כתובת משלוח */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>כתובת משלוח</Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      {selectedOrder.shipping.address}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedOrder.shipping.city}, {selectedOrder.shipping.zipCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* פרטי תשלום */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>פרטי תשלום</Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>אמצעי תשלום:</strong> {selectedOrder.payment.method === 'credit' ? 'כרטיס אשראי' : 'PayPal'}
                    </Typography>
                    {selectedOrder.payment.cardLastFour && (
                      <Typography variant="body2" gutterBottom>
                        <strong>כרטיס מסתיים ב:</strong> {selectedOrder.payment.cardLastFour}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* פריטים */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                  פריטים בהזמנה
                </Typography>
                <Paper variant="outlined" sx={{ p: isMobile ? 2 : 3 }}>
                  {selectedOrder.items.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                      <Avatar 
                        src={item.imageUrl} 
                        variant="rounded" 
                        sx={{ width: isMobile ? 50 : 60, height: isMobile ? 50 : 60, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × {formatPrice(item.price)}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">סכום ביניים:</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.subtotal)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">משלוח:</Typography>
                    <Typography variant="body2">{formatPrice(selectedOrder.shipping)}</Typography>
                  </Box>
                  
                  {selectedOrder.tax > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">מע"מ:</Typography>
                      <Typography variant="body2">{formatPrice(selectedOrder.tax)}</Typography>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      סה"כ:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {formatPrice(selectedOrder.total)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        {!isMobile && (
          <DialogActions>
            <Button onClick={handleCloseDialog}>סגור</Button>
          </DialogActions>
        )}
        
        {isMobile && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="contained" 
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              סגור
            </Button>
          </Box>
        )}
      </Dialog>

      {/* הודעות */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminOrders;