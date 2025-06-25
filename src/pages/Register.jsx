import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { authAPI, handleApiError } from "../api/api";
import styles from "../styles/formStyles";

const Register = () => {
  const navigate = useNavigate();

  // State עבור Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // פונקציה להצגת Snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // סגירת Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { address: {} };

    if (!formData.firstName.trim()) newErrors.firstName = "יש להזין שם פרטי";
    if (!formData.lastName.trim()) newErrors.lastName = "יש להזין שם משפחה";
    if (!formData.email.trim()) newErrors.email = "יש להזין כתובת אימייל";
    if (!formData.password) newErrors.password = "יש להזין סיסמה";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "יש להזין אימות סיסמה";
    if (!formData.phone.trim()) newErrors.phone = "יש להזין מספר טלפון";
    if (!formData.address.street.trim()) {
      newErrors.address.street = "יש להזין רחוב ומספר בית";
    }
    if (!formData.address.city.trim()) {
      newErrors.address.city = "יש להזין עיר";
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.address.zipCode = "יש להזין מיקוד";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "פורמט אימייל לא תקין";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    }
    if (formData.address.zipCode && formData.address.zipCode.length < 7) {
      newErrors.address.zipCode = " המיקוד חייב להכיל לפחות 7 תווים";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות אינן תואמות";
    }

    const phoneRegex = /^0[5-9]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "מספר טלפון ישראלי לא חוקי";
    }

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 1 &&
      Object.keys(newErrors.address).filter((k) => newErrors.address[k])
        .length === 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnackbar("יש לתקן את השגיאות בטופס", "error");
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.register(formData);

      if (data.success) {
        // הצג הודעת הצלחה
        showSnackbar("🎉 נרשמת בהצלחה! מעביר לדף הבית...");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ניווט לדף הבית אחרי 2 שניות
        setTimeout(() => {
          navigate("/");
        }, 2000);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: { street: "", city: "", zipCode: "" },
          preferences: { newsletter: true, smsNotifications: false },
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showSnackbar(errorMessage, "error");

      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path || err.param] = err.msg || err.message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.registerContainer }}>
      {/* תוכן הכרטיס */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "85%",
          maxWidth: "600px",
          mx: 'auto',
          
        }}
      >
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>הרשמה</h1>
            <p style={styles.subtitle}>צור חשבון והתחל להזמין</p>
          </div>

          <form
            style={styles.form}
            onSubmit={handleSubmit}
            dir="rtl"
            noValidate
          >
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>שם פרטי *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.firstName ? styles.inputError : {}),
                  }}
                  placeholder="ישראל"
                />
                {errors.firstName && (
                  <span style={styles.errorText}>{errors.firstName}</span>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>שם משפחה *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.lastName ? styles.inputError : {}),
                  }}
                  placeholder="כהן"
                />
                {errors.lastName && (
                  <span style={styles.errorText}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>אימייל *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {}),
                }}
                placeholder="israel@example.com"
              />
              {errors.email && (
                <span style={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>טלפון *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.phone ? styles.inputError : {}),
                }}
                placeholder="0501234567"
              />
              {errors.phone && (
                <span style={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>סיסמה *</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.password ? styles.inputError : {}),
                      paddingRight: "45px",
                    }}
                    placeholder="לפחות 6 תווים"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? "👁" : "🙈"}
                  </button>
                </div>
                {errors.password && (
                  <span style={styles.errorText}>{errors.password}</span>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>אימות סיסמה *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.confirmPassword ? styles.inputError : {}),
                  }}
                  placeholder="חזור על הסיסמה"
                />
                {errors.confirmPassword && (
                  <span style={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* שדות כתובת מקוצרים */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>כתובת</h3>
              <div style={styles.field}>
                <label style={styles.label}>רחוב ומספר בית</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.address?.street ? styles.inputError : {}),
                  }}
                  placeholder="הרצל 12"
                />
                {errors.address?.street && (
                  <span style={styles.errorText}>{errors.address.street}</span>
                )}
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>עיר</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.address?.city ? styles.inputError : {}),
                    }}
                    placeholder="תל אביב"
                  />
                  {errors.address?.city && (
                    <span style={styles.errorText}>{errors.address.city}</span>
                  )}
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>מיקוד</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address?.zipCode}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.address?.zipCode ? styles.inputError : {}),
                    }}
                    placeholder="1234567"
                  />
                  {errors.address?.zipCode && (
                    <span style={styles.errorText}>
                      {errors.address.zipCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
              }}
            >
              {loading ? "יוצר חשבון..." : "הירשם"}
            </button>

            <div style={styles.footer}>
              <p>
                כבר יש לך חשבון?{" "}
                <Link to="/login" style={styles.link}>
                  התחבר
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* MUI Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
