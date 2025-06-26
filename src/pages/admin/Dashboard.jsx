import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  IconButton,
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
  Collapse,
  Stack,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";

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
} from "@mui/icons-material";

import {
  getDashboardStats,
  getRecentUsers,
  getRecentOrders,
  getSalesStats,
} from "../../services/adminService";

export const Dashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for real data
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesStats, setSalesStats] = useState({
    monthlySales: [],
    comparedToPrevious: 0
  });

  // Media queries for responsiveness
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard statistics
        const statsResponse = await getDashboardStats();
        console.log('Stats Response:', statsResponse);
        if (statsResponse.success && statsResponse.stats) {
          setDashboardStats({
            totalUsers: statsResponse.stats.totalUsers || 0,
            totalOrders: statsResponse.stats.totalOrders || 0,
            totalSales: statsResponse.stats.totalSales || 0,
            pendingOrders: statsResponse.stats.ordersByStatus?.find(s => s._id === 'pending')?.count || 0
          });
        }
        
        // Fetch recent users
        const usersResponse = await getRecentUsers();
        console.log('Users Response:', usersResponse);
        if (usersResponse.success && usersResponse.users) {
          setRecentUsers(usersResponse.users);
        }
        
        // Fetch recent orders
        const ordersResponse = await getRecentOrders();
        console.log('Orders Response:', ordersResponse);
        if (ordersResponse.success) {
          setRecentOrders(ordersResponse.orders || []);
        } else {
          console.warn('Failed to fetch orders:', ordersResponse.message);
          setRecentOrders([]);
        }
        
        // Fetch sales statistics
        const salesResponse = await getSalesStats('month');
        console.log('Sales Response:', salesResponse);
        if (salesResponse.success && salesResponse.stats) {
          setSalesStats({
            monthlySales: salesResponse.stats.monthlySales || [],
            comparedToPrevious: salesResponse.stats.comparedToPrevious || 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("שגיאה בטעינת נתוני לוח הבקרה");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data to display format
  const getStatisticsCards = () => {
    if (!dashboardStats) return [];

    return [
      {
        title: "סך הכנסות החודש",
        value: `₪${dashboardStats.totalSales?.toLocaleString() || "0"}`,
        change: `${dashboardStats.salesGrowth > 0 ? "+" : ""}${
          dashboardStats.salesGrowth?.toFixed(2) || "0"
        }%`,
        isPositive: dashboardStats.salesGrowth >= 0,
        icon: <AttachMoneyIcon />,
        color: "#8bc34a",
      },
      {
        title: "סך לקוחות",
        value: dashboardStats.totalUsers?.toString() || "0",
        change: `+${dashboardStats.newUsersThisMonth || "0"}`,
        isPositive: true,
        icon: <PeopleIcon />,
        color: "#2196f3",
      },
      {
        title: "סך הזמנות",
        value: dashboardStats.totalOrders?.toString() || "0",
        change: `+${dashboardStats.ordersThisMonth || "0"} החודש`,
        isPositive: true,
        icon: <ShoppingBagIcon />,
        color: "#9c27b0",
      },
      {
        title: "הזמנות ממתינות",
        value: dashboardStats.pendingOrders?.toString() || "0",
        change: "דורש טיפול",
        isPositive: dashboardStats.pendingOrders === 0,
        icon: <LocalShippingIcon />,
        color: "#ff9800",
      },
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "הושלם":
        return "#4caf50";
      case "נשלח":
        return "#2196f3";
      case "בעיבוד":
        return "#ff9800";
      case "בתשלום":
        return "#9c27b0";
      default:
        return "#757575";
    }
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {order.id}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
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
              borderRadius: "50%",
              bgcolor: getStatusColor(order.status),
              mr: 1,
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: "medium" }}>
            {order.status}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {order.customer} • {order.date}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">סכום:</Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          {order.amount}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ px: { xs: 0, md: 2 }, py: { xs: 1, md: 2 } }}>
      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
            onClick={() => window.location.reload()}
          >
            נסה שוב
          </Button>
        </Alert>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={2} mb={3}>
            {getStatisticsCards().map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 20px -10px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
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
                        display: "flex",
                        alignItems: "center",
                        bgcolor: stat.isPositive
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(244, 67, 54, 0.1)",
                        color: stat.isPositive ? "success.main" : "error.main",
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                      }}
                    >
                      {stat.isPositive ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : (
                        <TrendingDownIcon fontSize="small" />
                      )}
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "bold", ml: 0.5 }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                      fontWeight: "bold",
                      mb: 0.5,
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
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

          {/* Recent Users Section - Using Real Data */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Expandable section header for mobile */}
                {isMobile ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      mb: expandedSection === "customers" ? 2 : 0,
                    }}
                    onClick={() => toggleSection("customers")}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      לקוחות חדשים
                    </Typography>
                    <IconButton size="small">
                      <ExpandMoreIcon
                        sx={{
                          transform:
                            expandedSection === "customers"
                              ? "rotate(180deg)"
                              : "rotate(0)",
                          transition: "transform 0.3s",
                        }}
                      />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      לקוחות חדשים
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <Collapse in={!isMobile || expandedSection === "customers"}>
                  <List>
                    {recentUsers?.length > 0 ? (
                      recentUsers.map((user, index) => (
                        <React.Fragment key={user._id || user.email}>
                          <ListItem alignItems="flex-start" disableGutters>
                            <ListItemAvatar>
                              <Avatar
                                sx={{ bgcolor: theme.palette.primary.main }}
                              >
                                {user.firstName
                                  ? user.firstName.charAt(0)
                                  : user.email.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.email}
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    component="span"
                                  >
                                    {user.email}
                                  </Typography>
                                  <br />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString("he-IL")}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          {index < recentUsers?.length - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        אין לקוחות חדשים
                      </Typography>
                    )}
                  </List>
                  <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, justifyContent: "center" }}
                    endIcon={isMobile ? <KeyboardArrowRightIcon /> : null}
                  >
                    צפה בכל הלקוחות
                  </Button>
                </Collapse>
              </Paper>
            </Grid>

            {/* Recent Orders Section - Using Real Data */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Expandable section header for mobile */}
                {isMobile ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      mb: expandedSection === "orders" ? 2 : 0,
                    }}
                    onClick={() => toggleSection("orders")}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      הזמנות אחרונות
                    </Typography>
                    <IconButton size="small">
                      <ExpandMoreIcon
                        sx={{
                          transform:
                            expandedSection === "orders"
                              ? "rotate(180deg)"
                              : "rotate(0)",
                          transition: "transform 0.3s",
                        }}
                      />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
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
                        <MenuItem onClick={handleMenuClose}>
                          הצג את כל ההזמנות
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                          ייצא לקובץ Excel
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>הדפס דוח</MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                )}

                {/* Mobile Orders List or Desktop Table */}
                <Collapse in={!isMobile || expandedSection === "orders"}>
                  {isMobile ? (
                    <Box>
                      {recentOrders?.length > 0 ? (
                        recentOrders.map((order) => renderMobileOrderCard(order))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", py: 2 }}
                        >
                          אין הזמנות אחרונות
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <TableContainer sx={{ overflowX: "auto" }}>
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
                          {recentOrders?.length > 0 ? (
                            recentOrders.map((order) => (
                              <TableRow key={order.id} hover>
                                <TableCell sx={{ fontWeight: "medium" }}>
                                  {order.id}
                                </TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      bgcolor: `${getStatusColor(
                                        order.status
                                      )}15`,
                                      color: getStatusColor(order.status),
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: getStatusColor(order.status),
                                        mr: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: "medium" }}
                                    >
                                      {order.status}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: "medium" }}
                                >
                                  {order.amount}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textAlign: "center", py: 2 }}
                                >
                                  אין הזמנות אחרונות
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
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
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
