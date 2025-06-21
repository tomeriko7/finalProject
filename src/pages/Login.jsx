import React, { useState } from "react";
import { authAPI, handleApiError } from "../api/api";
import styles from "../styles/formStyles";
import { Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../services/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "יש להזין כתובת אימייל";
    if (!formData.password) newErrors.password = "יש להזין סיסמה";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "פורמט אימייל לא תקין";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showSnackbar("יש לתקן את השגיאות בטופס", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.login(formData);
      if (data.success) {
        showSnackbar("התחברת בהצלחה! מעביר לדף הבית");
        localStorage.setItem("token", data.token);
        login(data.user, data.token);
        setTimeout(() => navigate("/"), 3000);
        setFormData({ email: "", password: "" });
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
    <div style={styles.loginContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>התחברות</h1>
          <p style={styles.subtitle}>יש להכניס פרטים כדי להתחבר לחשבון</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
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
                  flex: 1,
                  width: "100%",
                }}
                placeholder="הזן סיסמה"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            onClick={() => console.log("👑 נלחץ על התחבר")}
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>

          <div style={styles.footer}>
            <p>
              אין לך חשבון?{" "}
              <Link to="/register" style={styles.link}>
                הרשם
              </Link>
            </p>
          </div>
        </form>
      </div>

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

export default Login;
