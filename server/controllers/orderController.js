import Order from '../models/Order.js';
import Product from '../models/Product.js';

// יצירת הזמנה חדשה
const createOrder = async (req, res) => {
  try {
    const {
      items,
      contactInfo,
      shipping,
      payment,
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    } = req.body;

    // וידוא שהמשתמש מחובר
    if (!req.user) {
      return res.status(401).json({ message: 'משתמש לא מחובר' });
    }

    // וידוא שיש פריטים בהזמנה
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'אין פריטים בהזמנה' });
    }

    // וידוא זמינות המוצרים
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ 
          message: `מוצר ${item.name} לא נמצא במערכת` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `אין מספיק מלאי עבור ${product.name}` 
        });
      }
    }

    // יצירת ההזמנה בלי מספר הזמנה, נוסיף אותו לאחר השמירה
    const order = new Order({
      user: req.user.id,
      items,
      contactInfo,
      shipping,
      payment,
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    });

    const savedOrder = await order.save();

    // יצירת מספר הזמנה מ-4 הספרות האחרונות של ה-ID
    const orderId = savedOrder._id.toString();
    const lastFourDigits = orderId.slice(-4);
    const orderNumber = `ORD-${lastFourDigits}`;

    // עדכון ההזמנה עם מספר ההזמנה
    await Order.findByIdAndUpdate(savedOrder._id, { orderNumber });

    // עדכון מלאי המוצרים
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // החזרת ההזמנה עם פרטי המשתמש
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price imageUrl');

    res.status(201).json({
      message: 'הזמנה נוצרה בהצלחה',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'שגיאה ביצירת ההזמנה',
      error: error.message 
    });
  }
};

// קבלת כל ההזמנות של המשתמש
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price imageUrl description')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 }) // הזמנות חדשות קודם
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'שגיאה בקבלת ההזמנות',
      error: error.message 
    });
  }
};

// קבלת הזמנה לפי מזהה
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price imageUrl description');

    if (!order) {
      return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    }

    // וידוא שהמשתמש רשאי לצפות בהזמנה
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'אין הרשאה לצפות בהזמנה זו' });
    }

    res.json(order);

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'שגיאה בקבלת ההזמנה',
      error: error.message 
    });
  }
};

// עדכון סטטוס הזמנה (רק למנהלים)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // וידוא שהמשתמש הוא מנהל
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'אין הרשאה לעדכן הזמנות' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'סטטוס לא תקין' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true }
    ).populate('user', 'firstName lastName email')
     .populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    }

    res.json({
      message: 'סטטוס ההזמנה עודכן בהצלחה',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      message: 'שגיאה בעדכון סטטוס ההזמנה',
      error: error.message 
    });
  }
};

// קבלת כל ההזמנות (רק למנהלים)
const getAllOrders = async (req, res) => {
  try {
    // וידוא שהמשתמש הוא מנהל
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'אין הרשאה לצפות בכל ההזמנות' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    // בניית פילטר
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    // חיפוש לפי מספר הזמנה או שם לקוח
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'contactInfo.firstName': { $regex: search, $options: 'i' } },
        { 'contactInfo.lastName': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      message: 'שגיאה בקבלת ההזמנות',
      error: error.message 
    });
  }
};

// מחיקת הזמנה (רק למנהלים)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // וידוא שהמשתמש הוא מנהל
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'אין הרשאה למחוק הזמנות' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    }

    // החזרת מלאי למוצרים אם ההזמנה לא בוטלה
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: 'הזמנה נמחקה בהצלחה' });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      message: 'שגיאה במחיקת ההזמנה',
      error: error.message 
    });
  }
};

export { 
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  deleteOrder
};
