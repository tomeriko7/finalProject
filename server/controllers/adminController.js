import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';

// קבלת סטטיסטיקות ללוח הבקרה
export const getDashboardStats = async (req, res) => {
  try {
    // חישוב סטטיסטיקות
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // סך כל המכירות
    const salesResult = await Order.aggregate([
      { $match: { status: { $in: ['shipped', 'delivered'] } } },
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
    
    // סטטיסטיקות מכירות לפי סטטוס
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // משתמשים חדשים החודש
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    // מוצרים אזלו מהמלאי
    const outOfStockProducts = await Product.countDocuments({ countInStock: 0 });
    
    // הזמנות החודש
    const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    // מכירות לפי חודש (6 חודשים אחרונים)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    const monthlySales = await Order.aggregate([
      { $match: { 
        createdAt: { $gte: sixMonthsAgo },
        status: { $in: ['shipped', 'delivered'] } 
      } },
      { $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        sales: { $sum: "$total" },
        count: { $sum: 1 }
      } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // עיבוד התוצאות למבנה נוח יותר
    const formattedMonthlySales = monthlySales.map(item => {
      const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", 
                         "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
      return {
        month: monthNames[item._id.month - 1],
        year: item._id.year,
        sales: item.sales || 0,
        count: item.count || 0
      };
    });
    
    // מוצרים פופולריים
    const popularProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" }
      } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo'
      } },
      { $unwind: "$productInfo" },
      { $project: {
        _id: 1,
        name: "$productInfo.name",
        totalSold: 1,
        price: "$productInfo.price",
        image: "$productInfo.image"
      } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales,
        newUsersThisMonth,
        outOfStockProducts,
        ordersThisMonth,
        ordersByStatus,
        monthlySales: formattedMonthlySales,
        popularProducts
      }
    });
  } catch (error) {
    logger.error('שגיאה בקבלת סטטיסטיקות לוח הבקרה:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית',
      error: error.message
    });
  }
};

// קבלת סטטיסטיקות מכירות לפי תקופה
export const getSalesStats = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        // השבוע האחרון
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        // החודש האחרון
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        // השנה האחרונה
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // ברירת מחדל: החודש האחרון
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    const salesData = await Order.aggregate([
      { $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['shipped', 'delivered'] }
      } },
      { $group: {
        _id: period === 'year' ? { month: { $month: "$createdAt" } } :
             period === 'month' ? { day: { $dayOfMonth: "$createdAt" } } :
             { day: { $dayOfWeek: "$createdAt" } },
        sales: { $sum: "$total" },
        orders: { $sum: 1 }
      } },
      { $sort: { "_id.month": 1, "_id.day": 1 } }
    ]);
    
    // הוספת הגנות לנתונים
    const safeSalesData = salesData.map(item => ({
      _id: item._id,
      sales: item.sales || 0,
      orders: item.orders || 0
    }));
    
    res.json({
      success: true,
      period,
      salesData: safeSalesData
    });
  } catch (error) {
    logger.error('שגיאה בקבלת סטטיסטיקות מכירות:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית',
      error: error.message
    });
  }
};

// קבלת רשימת משתמשים אחרונים
export const getRecentUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    logger.error('שגיאה בקבלת משתמשים אחרונים:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית',
      error: error.message
    });
  }
};

// קבלת הזמנות אחרונות
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // אם אין הזמנות, החזר מערך ריק
    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        orders: [],
        message: 'לא נמצאו הזמנות'
      });
    }
    
    // עיבוד הנתונים לפורמט מתאים לתצוגה
    const formattedOrders = orders.map(order => ({
      id: `#${order._id.toString().slice(-6)}`,
      customer: order.user?.name || 'לקוח אנונימי',
      date: new Date(order.createdAt).toLocaleDateString('he-IL'),
      status: getStatusInHebrew(order.status || 'pending'),
      amount: `₪${(order.total || 0).toFixed(2)}`
    }));
    
    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    logger.error('שגיאה בקבלת הזמנות אחרונות:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית',
      error: error.message,
      orders: []
    });
  }
};

// פונקציית עזר לתרגום סטטוס להעברית
const getStatusInHebrew = (status) => {
  const statusMap = {
    'pending': 'בעיבוד',
    'processing': 'בתהליך',
    'shipped': 'נשלח',
    'delivered': 'הושלם',
    'cancelled': 'בוטל'
  };
  return statusMap[status] || status;
};
