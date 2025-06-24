import React, { useEffect, useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { authAPI, handleApiError } from "../api/api";
import { AuthContext } from "../services/AuthContext";
import styles from "../styles/formStyles";

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          const data = await authAPI.getProfile();
          setFormData(data.user);
          updateUser(data.user);
        } catch (error) {
          setSnackbar({
            open: true,
            message: handleApiError(error),
            severity: "error",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, updateUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await authAPI.updateProfile(formData);
      setSnackbar({
        open: true,
        message: "הפרופיל עודכן בהצלחה!",
        severity: "success",
      });

      updateUser(result.user);
    } catch (error) {
      setSnackbar({
        open: true,
        message: handleApiError(error),
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading || !formData) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          ...טוען פרופיל
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        mb: 5,
        px: 2,
        py: 4,
        backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,

        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        fontWeight="bold"
        sx={{ color: theme.palette.text.primary, mr: 2 }}
      >
        פרופיל אישי
      </Typography>
      <form onSubmit={handleSubmit} dir="rtl">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="שם פרטי"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="שם משפחה"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="אימייל"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="טלפון"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="רחוב"
            name="address.street"
            value={formData.address?.street || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="עיר"
            name="address.city"
            value={formData.address?.city || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <TextField
            label="מיקוד"
            name="address.zipCode"
            value={formData.address?.zipCode || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            dir="rtl"
            InputLabelProps={{ sx: styles.rtlLabelStyles }}
            InputProps={{ sx: styles.rtlInputStyles }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            sx={{ mt: 3, px: 4, alignSelf: "center", mb: 6 }}
          >
            {saving ? "שומר..." : "שמור שינויים"}
          </Button>
        </Box>
      </form>

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
    </Box>
  );
};

export default Profile;
