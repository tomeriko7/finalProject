import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme, 
  Card, 
  CardContent, 
  Avatar, 
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  useMediaQuery,
  Stack,
  Collapse
} from '@mui/material';

import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
  Notifications as NotificationsIcon,
  LocalShipping as LocalShippingIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';

// Mock data for demonstration
const mockStatistics = [
  { 
    title: 'סך הכנסות', 
    value: '₪16,540', 
    change: '+5.26%', 
    isPositive: true, 
    icon: <AttachMoneyIcon />,
    color: '#8bc34a'
  },
  { 
    title: 'סך לקוחות', 
    value: '578', 
    change: '+2.36%', 
    isPositive: true, 
    icon: <PeopleIcon />,
    color: '#2196f3' 
  },
  { 
    title: 'סך הזמנות', 
    value: '1,485', 
    change: '+2.15%', 
    isPositive: true, 
    icon: <ShoppingBagIcon />,
    color: '#9c27b0' 
  },
  { 
    title: 'הזמנות ממתינות', 
    value: '34', 
    change: '-1.57%', 
    isPositive: false, 
    icon: <LocalShippingIcon />,
    color: '#ff9800' 
  },
];

const mockRecentOrders = [
  { id: '#121245', customer: 'יוסי כהן', date: '24.06.2025', status: 'נשלח', amount: '₪1,290' },
  { id: '#121244', customer: 'שרה לוי', date: '24.06.2025', status: 'בתשלום', amount: '₪459' },
  { id: '#121243', customer: 'דוד גולן', date: '23.06.2025', status: 'בעיבוד', amount: '₪1,140' },
  { id: '#121242', customer: 'מיכל אדם', date: '22.06.2025', status: 'נשלח', amount: '₪860' },
  { id: '#121241', customer: 'אבי פרץ', date: '21.06.2025', status: 'הושלם', amount: '₪340' },
];

const mockPopularProducts = [
  { name: 'חולצת כותנה אורגנית', sales: 124, stock: 431, price: '₪129', progress: 70 },
  { name: 'מכנסי טרנינג', sales: 98, stock: 143, price: '₪240', progress: 55 },
  { name: 'נעלי ספורט גמישות', sales: 92, stock: 54, price: '₪380', progress: 92 },
  { name: 'חולצת פולו אלגנטית', sales: 86, stock: 152, price: '₪179', progress: 48 },
];

const mockLatestCustomers = [
  { name: 'רון מזרחי', date: 'הצטרף לפני 2 דקות', email: 'ron@example.com' },
  { name: 'ליאת כהן', date: 'הצטרפה לפני 3 שעות', email: 'liat@example.com' },
  { name: 'אלכס גולד', date: 'הצטרף לפני 5 שעות', email: 'alex@example.com' },
  { name: 'דנה שלום', date: 'הצטרפה אתמול', email: 'dana@example.com' },
];

const getStatusColor = (status) => {
  switch(status) {
    case 'הושלם': return '#4caf50';
    case 'נשלח': return '#2196f3';
    case 'בעיבוד': return '#ff9800';
    case 'בתשלום': return '#9c27b0';
    default: return '#757575';
  }
};

export const Dashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Media queries for responsiveness
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Function to render mobile order cards instead of table rows
  const renderMobileOrderCard = (order) => (
    <Paper 
      key={order.id}
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">{order.id}</Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: `${getStatusColor(order.status)}15`,
            color: getStatusColor(order.status),
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: getStatusColor(order.status),
              mr: 1,
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
            {order.status}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {order.customer} • {order.date}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">סכום:</Typography>
        <Typography variant="subtitle2" fontWeight="bold">{order.amount}</Typography>
      </Box>
    </Paper>
  );
  
  // Function to render mobile product cards
  const renderMobileProductCard = (product) => (
    <Paper 
      key={product.name}
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        {product.name}
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Typography variant="caption" color="text.secondary">מחיר</Typography>
          <Typography variant="body2" fontWeight="medium">{product.price}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="caption" color="text.secondary">מכירות</Typography>
          <Typography variant="body2" fontWeight="medium">{product.sales}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="caption" color="text.secondary">מלאי</Typography>
          <Typography variant="body2" fontWeight="medium">{product.stock}</Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={product.progress} 
            sx={{ 
              height: 6,
              borderRadius: 3,
              backgroundColor: `${theme.palette.primary.main}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: 
                  product.progress > 80 
                    ? theme.palette.success.main
                    : product.progress > 40
                      ? theme.palette.primary.main
                      : theme.palette.warning.main
              }
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {product.progress}%
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ px: { xs: 0, md: 2 }, py: { xs: 1, md: 2 } }}>
      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        {mockStatistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}15`,
                    p: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Avatar>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: stat.isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                    color: stat.isPositive ? 'success.main' : 'error.main',
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  {stat.isPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <Typography variant="caption" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Row */}
      <Grid container spacing={2}>
        {/* Recent Orders Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Expandable section header for mobile */}
            {isMobile ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSection === 'orders' ? 2 : 0
                }}
                onClick={() => toggleSection('orders')}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  הזמנות אחרונות
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon 
                    sx={{
                      transform: expandedSection === 'orders' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  הזמנות אחרונות
                </Typography>
                <Box>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    aria-controls="orders-menu"
                    aria-haspopup="true"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    id="orders-menu"
                    anchorEl={menuAnchorEl}
                    keepMounted
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>הצג את כל ההזמנות</MenuItem>
                    <MenuItem onClick={handleMenuClose}>ייצא לקובץ Excel</MenuItem>
                    <MenuItem onClick={handleMenuClose}>הדפס דוח</MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
            
            {/* Mobile Orders List or Desktop Table */}
            <Collapse in={!isMobile || expandedSection === 'orders'}>
              {isMobile ? (
                <Box>
                  {mockRecentOrders.map(order => renderMobileOrderCard(order))}
                </Box>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>מספר הזמנה</TableCell>
                        <TableCell>לקוח</TableCell>
                        <TableCell>תאריך</TableCell>
                        <TableCell>סטטוס</TableCell>
                        <TableCell align="right">סכום</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockRecentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: `${getStatusColor(order.status)}15`,
                                color: getStatusColor(order.status),
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: getStatusColor(order.status),
                                  mr: 1,
                                }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                                {order.status}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                            {order.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ borderRadius: 2 }}
                  endIcon={isMobile ? <KeyboardArrowRightIcon /> : null}
                >
                  צפה בכל ההזמנות
                </Button>
              </Box>
            </Collapse>
          </Paper>
        </Grid>

        {/* Latest Customers Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Expandable section header for mobile */}
            {isMobile ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSection === 'customers' ? 2 : 0
                }}
                onClick={() => toggleSection('customers')}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  לקוחות חדשים
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon 
                    sx={{
                      transform: expandedSection === 'customers' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  לקוחות חדשים
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            <Collapse in={!isMobile || expandedSection === 'customers'}>
              <List>
                {mockLatestCustomers.map((customer, index) => (
                  <React.Fragment key={customer.name}>
                    <ListItem alignItems="flex-start" disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {customer.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {customer.name}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {customer.email}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {customer.date}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < mockLatestCustomers.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 2, justifyContent: 'center' }}
                endIcon={isMobile ? <KeyboardArrowRightIcon /> : null}
              >
                צפה בכל הלקוחות
              </Button>
            </Collapse>
          </Paper>
        </Grid>

        {/* Popular Products Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mt: 2,
            }}
          >
            {/* Expandable section header for mobile */}
            {isMobile ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSection === 'products' ? 2 : 0
                }}
                onClick={() => toggleSection('products')}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  מוצרים פופולריים
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon 
                    sx={{
                      transform: expandedSection === 'products' ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 1, 
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  מוצרים פופולריים
                </Typography>
                <Box>
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />}
                    sx={{ 
                      mr: 1,
                      borderRadius: 2,
                      boxShadow: 'none'
                    }}
                  >
                    מוצר חדש
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    ייצא
                  </Button>
                </Box>
              </Box>
            )}
            
            <Collapse in={!isMobile || expandedSection === 'products'}>
              {isMobile && (
                <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />}
                    sx={{ 
                      borderRadius: 2,
                      boxShadow: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    מוצר חדש
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<DownloadIcon />}
                    sx={{ 
                      borderRadius: 2,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ייצא
                  </Button>
                </Stack>
              )}
              
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  mb: 2,
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              >
                <Tab label="הכי נמכרים" />
                <Tab label="חדשים" />
                <Tab label="במלאי נמוך" />
              </Tabs>
              
              {isMobile ? (
                <Box>
                  {mockPopularProducts.map(product => renderMobileProductCard(product))}
                </Box>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>שם המוצר</TableCell>
                        <TableCell align="right">מחיר</TableCell>
                        <TableCell align="right">מכירות</TableCell>
                        <TableCell align="right">מלאי</TableCell>
                        <TableCell align="right">סטטוס</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPopularProducts.map((product) => (
                        <TableRow key={product.name} hover>
                          <TableCell sx={{ fontWeight: 'medium' }}>{product.name}</TableCell>
                          <TableCell align="right">{product.price}</TableCell>
                          <TableCell align="right">{product.sales}</TableCell>
                          <TableCell align="right">{product.stock}</TableCell>
                          <TableCell align="right" sx={{ width: '15%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={product.progress} 
                                  sx={{ 
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: `${theme.palette.primary.main}20`,
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: 
                                        product.progress > 80 
                                          ? theme.palette.success.main
                                          : product.progress > 40
                                            ? theme.palette.primary.main
                                            : theme.palette.warning.main
                                    }
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {product.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;