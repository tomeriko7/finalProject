import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import { createOrder } from "../services/orderService";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { clearCart } from "../store/slices/cartSlice";

const Checkout = () => {
  const { items, subtotal, shipping, tax, total } = useSelector(
    (state) => state.cart
  );
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [showCvv, setShowCvv] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    // פרטים אישיים
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",

    // כתובת למשלוח
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    zipCode: user?.address?.zipCode || "",

    // פרטי תשלום
    cardName: user ? `${user.firstName} ${user.lastName}` : "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    paymentMethod: "credit_card", // קבוע לכרטיס אשראי בלבד
  });

  const [errors, setErrors] = useState({});

  const steps = ["פרטים אישיים", "כתובת למשלוח", "פרטי תשלום", "סיכום הזמנה"];

  // Debug log המוצרים בעגלה
  useEffect(() => {
    console.log("=== Debug: Cart Items in Checkout ===");
    console.log("items (redux state):", items);
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          _id: item._id,
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product: item.product,
          productId: item.product,
          typeof_id: typeof item._id,
          typeof_product: typeof item.product,
          isValidObjectId_id: /^[0-9a-fA-F]{24}$/.test(item._id || ""),
          isValidObjectId_product: item.product
            ? /^[0-9a-fA-F]{24}$/.test(item.product)
            : false,
          allKeys: Object.keys(item),
        });
      });
    }
    console.log("=====================================");
  }, [items]);

  // בדיקה אם העגלה ריקה - חזרה לדף הראשי
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate("/");
    }
  }, [items, navigate, orderComplete]);

  // טעינת פרטי המשתמש מהמסד נתונים כשהוא זמין
  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstName: user.firstName || prevFormData.firstName,
        lastName: user.lastName || prevFormData.lastName,
        email: user.email || prevFormData.email,
        phone: user.phone || prevFormData.phone,
        address: user.address?.street || prevFormData.address,
        city: user.address?.city || prevFormData.city,
        zipCode: user.address?.zipCode || prevFormData.zipCode,
        cardName: `${user.firstName} ${user.lastName}` || prevFormData.cardName,
      }));
    }
  }, [user]);

  // ניקוי הסימון כשיוצאים מהעמוד או לאחר זמן מסוים
  useEffect(() => {
    const clearOrderCompletedFlag = () => {
      const orderCompletedTime = sessionStorage.getItem("orderCompletedTime");
      if (orderCompletedTime) {
        const timeSinceOrder = Date.now() - parseInt(orderCompletedTime);
        // ניקוי הסימון אחרי 30 דקות (במילישניות)
        if (timeSinceOrder > 30 * 60 * 1000) {
          sessionStorage.removeItem("orderCompleted");
          sessionStorage.removeItem("orderCompletedTime");
          console.log("Order completed flag cleared after 30 minutes");
        }
      }
    };

    // בדיקה כל פעם שהקומפוננטה נטענת
    clearOrderCompletedFlag();

    // ניקוי אוטומטי אחרי 30 דקות
    const timeoutId = setTimeout(() => {
      sessionStorage.removeItem("orderCompleted");
      sessionStorage.removeItem("orderCompletedTime");
      console.log("Order completed flag cleared after timeout");
    }, 30 * 60 * 1000); // 30 דקות

    // ניקוי בעת יציאה מהקומפוננטה
    return () => {
      clearTimeout(timeoutId);
      // לא נמחק את הסימון כאן - נתן לו להישאר זמן רב יותר
    };
  }, [orderComplete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // נקה שגיאות בעת הקלדה
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      // בדיקת פרטים אישיים
      if (!formData.firstName) {
        newErrors.firstName = "שדה חובה";
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = "שם פרטי חייב להיות לפחות 2 תווים";
      }
      if (!formData.lastName) {
        newErrors.lastName = "שדה חובה";
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = "שם משפחה חייב להיות לפחות 2 תווים";
      }
      if (!formData.email) {
        newErrors.email = "שדה חובה";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "כתובת אימייל לא תקינה";
      }
      if (!formData.phone) {
        newErrors.phone = "שדה חובה";
      } else if (!/^0[5-9]\d{8}$/.test(formData.phone)) {
        newErrors.phone = "מספר טלפון לא תקין (לדוגמה: 0501234567)";
      }
    } else if (activeStep === 1) {
      // בדיקת כתובת למשלוח
      if (!formData.address) {
        newErrors.address = "שדה חובה";
      } else if (formData.address.length < 5) {
        newErrors.address = "כתובת חייבת להיות לפחות 5 תווים";
      }
      if (!formData.city) {
        newErrors.city = "שדה חובה";
      } else if (formData.city.length < 2) {
        newErrors.city = "עיר חייבת להיות לפחות 2 תווים";
      }
      if (!formData.zipCode) {
        newErrors.zipCode = "שדה חובה";
      } else if (formData.zipCode.length < 5 || formData.zipCode.length > 10) {
        newErrors.zipCode = "מיקוד חייב להיות בין 5-10 תווים";
      }
    } else if (activeStep === 2) {
      // בדיקת פרטי תשלום - כרטיס אשראי בלבד
      if (!formData.cardName) newErrors.cardName = "שדה חובה";
      if (!formData.cardNumber) {
        newErrors.cardNumber = "שדה חובה";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "מספר כרטיס לא תקין";
      }
      if (!formData.expDate) {
        newErrors.expDate = "שדה חובה";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate)) {
        newErrors.expDate = "פורמט לא תקין (MM/YY)";
      }
      if (!formData.cvv) {
        newErrors.cvv = "שדה חובה";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "קוד אבטחה לא תקין";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        // שליחת ההזמנה
        handleSubmitOrder();
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep()) return;

    // בדיקה נוספת לפני שליחה
    if (!items || items.length === 0) {
      setSnackbarOpen(true);
      setSnackbarMessage("העגלה ריקה. אנא הוסף מוצרים לפני ביצוע הזמנה.");
      return;
    }

    if (!user) {
      setSnackbarOpen(true);
      setSnackbarMessage("יש להיכנס למערכת כדי לבצע הזמנה.");
      navigate("/login");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      setSnackbarOpen(true);
      setSnackbarMessage("אנא מלא את כל הפרטים הנדרשים.");
      return;
    }

    if (!formData.address || !formData.city || !formData.zipCode) {
      setSnackbarOpen(true);
      setSnackbarMessage("אנא מלא את כל פרטי הכתובת.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Cart items before processing:", items);

      // נתוני ההזמנה לשרת
      const orderData = {
        items: items.map((item, index) => {
          console.log(`Processing item ${index}:`, {
            fullItem: item,
            _id: item._id,
            id: item.id,
            product: item.product,
            productId: item.product?._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          });

          // הלוגיקה הנכונה: אם יש item.product._id - זה ה-ID של המוצר במסד הנתונים
          // אחרת נשתמש ב-item._id (במקרה של מוצר שנוסף ישירות)
          const productId = item.product?._id || item._id || item.id;
          console.log(`Final Product ID for item ${index}:`, productId);
          console.log(`Product ID type:`, typeof productId);
          console.log(
            `Is valid ObjectId:`,
            /^[0-9a-fA-F]{24}$/.test(productId || "")
          );

          if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
            console.error(`Invalid product ID for item ${index}:`, productId);
            console.error("Item structure:", item);
          }

          return {
            product: productId,
            name: item.name || item.product?.name || item.title || "מוצר",
            price: Number(item.price || item.product?.price || 0),
            quantity: Number(item.quantity || 1),
            imageUrl: item.image || item.imageUrl || item.product?.image || "",
          };
        }),
        contactInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shipping: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          zipCode: formData.zipCode.trim(),
          method: "standard",
        },
        payment: {
          method: "credit", // תיקון - צריך להיות "credit" ולא "credit_card"
          cardLastFour: formData.cardNumber
            .replace(/\s/g, "")
            .slice(-4), // תיקון שם השדה
        },
        subtotal: Number(subtotal || 0),
        shippingCost: Number(shipping || 0),
        tax: Number(tax || 0),
        total: Number(total || 0),
      };

      console.log("Sending order data:", JSON.stringify(orderData, null, 2));
      
      // Debug payment data specifically
      console.log("Payment data:", {
        method: orderData.payment.method, // צריך להיות "credit"
        cardLastFour: orderData.payment.cardLastFour
      });

      // שליחת ההזמנה לשרת
      const response = await createOrder(orderData);
      setOrderId(
        response._id ||
          response.id ||
          Math.floor(100000 + Math.random() * 900000).toString()
      );

      // עדכון ממשק המשתמש
      setOrderComplete(true);
      dispatch(clearCart());
      
      // מחיקה נוספת של localStorage לבטחון כפול - מחיקת כל נתוני העגלה
      localStorage.removeItem("cart");
      localStorage.removeItem("cartQuantity");
      localStorage.removeItem("cartTotal");
      
      // סימון שהזמנה הושלמה כדי למנוע טעינה מ-localStorage אחרי רענון
      // השימוש ב-sessionStorage יחזיק את הנתונים עד שהברוזר ייסגר
      sessionStorage.setItem("orderCompleted", "true");
      sessionStorage.setItem("orderCompletedTime", Date.now().toString());
      
      console.log("Order completed - localStorage cleared and sessionStorage set");
      
      setSnackbarOpen(true);
      setSnackbarMessage("ההזמנה בוצעה בהצלחה!");
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error response:", error.response?.data);
      setSnackbarOpen(true);

      // הודעת שגיאה מפורטת יותר
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          "נתונים לא תקינים. אנא בדוק את הפרטים ונסה שנית.";
        setSnackbarMessage(errorMessage);
      } else if (error.response?.status === 401) {
        setSnackbarMessage("יש להיכנס למערכת כדי לבצע הזמנה.");
        navigate("/login");
      } else if (error.response?.status === 500) {
        setSnackbarMessage("שגיאת שרת. אנא נסה שנית מאוחר יותר.");
      } else {
        setSnackbarMessage("אירעה שגיאה בעת יצירת ההזמנה. אנא נסה שנית.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: formattedValue,
    });

    if (errors.cardNumber) {
      setErrors({
        ...errors,
        cardNumber: "",
      });
    }
  };

  const handleExpDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, "");

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    setFormData({
      ...formData,
      expDate: value,
    });

    if (errors.expDate) {
      setErrors({
        ...errors,
        expDate: "",
      });
    }
  };

  const renderPersonalDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          פרטים אישיים
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="שם פרטי"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="שם משפחה"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="אימייל"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="טלפון"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          dir="rtl"
        />
      </Grid>
    </Grid>
  );

  const renderShippingAddress = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          כתובת למשלוח
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="כתובת"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="עיר"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="מיקוד"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          error={!!errors.zipCode}
          helperText={errors.zipCode}
          dir="rtl"
        />
      </Grid>
    </Grid>
  );

  const renderPaymentDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          פרטי תשלום בכרטיס אשראי
        </Typography>
      </Grid> 
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="שם בעל הכרטיס"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          error={!!errors.cardName}
          helperText={errors.cardName}
          dir="rtl"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="מספר כרטיס"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 19 }}
          dir="ltr"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="תוקף (MM/YY)"
          name="expDate"
          value={formData.expDate}
          onChange={handleExpDateChange}
          error={!!errors.expDate}
          helperText={errors.expDate}
          inputProps={{ maxLength: 5 }}
          dir="ltr"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="קוד אבטחה"
          name="cvv"
          type={showCvv ? "text" : "password"}
          value={formData.cvv}
          onChange={handleChange}
          error={!!errors.cvv}
          helperText={errors.cvv}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCvv(!showCvv)} edge="end">
                  {showCvv ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 4 }}
          dir="ltr"
        />
      </Grid>
    </Grid>
  );

  const renderOrderSummary = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          סיכום הזמנה
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.neutral" }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            פרטים אישיים
          </Typography>
          <Typography variant="body2">
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2">{formData.email}</Typography>
          <Typography variant="body2">{formData.phone}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            כתובת למשלוח
          </Typography>
          <Typography variant="body2">{formData.address}</Typography>
          <Typography variant="body2">
            {formData.city}, {formData.zipCode}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            אמצעי תשלום
          </Typography>
          <Typography variant="body2">
            כרטיס אשראי מסתיים ב-{formData.cardNumber.slice(-4)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              פרטי ההזמנה
            </Typography>

            {items.map((item) => (
              <Box
                key={item._id || item.id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  {`${item.name || item.product?.name || "מוצר"} x ${
                    item.quantity || 1
                  }`}
                </Typography>
                <Typography variant="body2">
                  ₪
                  {(
                    Number(item.price || item.product?.price || 0) *
                    (Number(item.quantity) || 1)
                  ).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">סכום ביניים:</Typography>
              <Typography variant="body2">₪{subtotal.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">משלוח:</Typography>
              <Typography variant="body2">₪{shipping.toFixed(2)}</Typography>
            </Box>

            {tax > 0 && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">מע"מ:</Typography>
                <Typography variant="body2">₪{tax.toFixed(2)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                סה"כ לתשלום:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                ₪{total.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderOrderComplete = () => (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        תודה על הזמנתך!
      </Typography>
      <Typography variant="body1" paragraph>
        ההזמנה שלך התקבלה בהצלחה ונמצאת בטיפול.
      </Typography>
      <Typography variant="body1" paragraph>
        מספר הזמנה: {orderId}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        אישור הזמנה נשלח לכתובת האימייל שלך.
      </Typography>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
        >
          חזרה לחנות
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate("/profile/orders")}
        >
          צפייה בהזמנות שלי
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalDetails();
      case 1:
        return renderShippingAddress();
      case 2:
        return renderPaymentDetails();
      case 3:
        return renderOrderSummary();
      default:
        return "שלב לא ידוע";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: "80vh" }}>
      {orderComplete ? (
        renderOrderComplete()
      ) : (
        <>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 4, fontWeight: "bold", textAlign: "right" }}
          >
            תשלום וסיום הזמנה
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            {getStepContent(activeStep)}
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate("/cart") : handleBack}
              startIcon={<ArrowBackIcon />}
            >
              {activeStep === 0 ? "חזרה לעגלה" : "חזרה"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {activeStep === steps.length - 1
                ? isSubmitting
                  ? "מבצע הזמנה..."
                  : "בצע הזמנה"
                : "המשך"}
              {isSubmitting && activeStep === steps.length - 1 && (
                <CircularProgress size={24} sx={{ ml: 1, color: "white" }} />
              )}
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;