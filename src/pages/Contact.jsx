import React, { useState } from "react";
import { Hero } from "../components/home/Hero";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Link,
  useTheme,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  WhatsApp,
  Instagram,
} from "@mui/icons-material";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbar({
        open: true,
        message: "יש למלא את כל השדות",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: "ההודעה נשלחה בהצלחה! נחזור אליך בהקדם",
        severity: "success",
      });
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Hero />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: theme.palette.background.default,
          minHeight: "90vh",
          direction: "rtl",
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              gutterBottom
              color="primary.main"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 4,
              }}
            >
              צרו קשר איתנו
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: 1.8,
              }}
            >
              נשמח לענות על כל שאלה ולסייע לכם בכל דרך אפשרית
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 6, md: 8, lg: 10 }}
            sx={{ justifyContent: "center" }}
          >
            {/* Contact Form */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 6, md: 8 },
                  borderRadius: 4,
                  backgroundColor: theme.palette.background.paper,
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                  sx={{ mb: 3 }}
                >
                  שלחו לנו הודעה
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 6, fontSize: "1.1rem" }}
                >
                  מלאו את הטופס ונחזור אליכם במהירות האפשרית
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <TextField
                      fullWidth
                      label="שם מלא"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                    />

                    <TextField
                      fullWidth
                      label="כתובת אימייל"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                    />

                    <TextField
                      fullWidth
                      label="ההודעה שלכם"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={5}
                      variant="outlined"
                      placeholder="כתבו כאן את ההודעה שלכם..."
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={
                        <Send />
                      }
                      sx={{
                        py: 2.5,
                        px: 8,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        alignSelf: "flex-end",
                        minWidth: 250,
                        mt: 2,
                        direction: "rtl",
                        gap: 2,
                      }}
                    >
                      {loading ? "שולח..." : "שליחת הודעה"}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={8} lg={6}>
              <Stack spacing={6}>
                {/* Map */}
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49594.541087822734!2d34.847797730921336!3d32.09082829617387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d3673a30753b9%3A0xcde0651f23c1443c!2sPetah%20Tikva!5e0!3m2!1sen!2sil!4v1750080745871!5m2!1sen!2sil"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="מפת הגעה"
                  />
                </Paper>

                {/* Social Media */}
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 6, md: 8 },
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 4 }}
                  >
                    עקבו אחרינו ברשתות החברתיות
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <IconButton
                      component={Link}
                      href="https://facebook.com"
                      target="_blank"
                      size="large"
                      sx={{
                        color: "#1877F2",
                        p: 2,
                        "&:hover": {
                          backgroundColor: "rgba(24, 119, 242, 0.1)",
                        },
                      }}
                    >
                      <Facebook sx={{ fontSize: 32 }} />
                    </IconButton>
                    <IconButton
                      component={Link}
                      href="https://instagram.com"
                      target="_blank"
                      size="large"
                      sx={{
                        color: "#E4405F",
                        p: 2,
                        "&:hover": {
                          backgroundColor: "rgba(228, 64, 95, 0.1)",
                        },
                      }}
                    >
                      <Instagram sx={{ fontSize: 32 }} />
                    </IconButton>
                    <IconButton
                      component={Link}
                      href="https://youtube.com"
                      target="_blank"
                      size="large"
                      sx={{
                        color: "#FF0000",
                        p: 2,
                        "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                      }}
                    >
                      <YouTube sx={{ fontSize: 32 }} />
                    </IconButton>
                    <IconButton
                      component={Link}
                      href="https://twitter.com"
                      target="_blank"
                      size="large"
                      sx={{
                        color: "#1DA1F2",
                        p: 2,
                        "&:hover": {
                          backgroundColor: "rgba(29, 161, 242, 0.1)",
                        },
                      }}
                    >
                      <Twitter sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Stack>
                </Paper>

                {/* Contact Details */}
                <Paper elevation={3} sx={{ p: { xs: 6, md: 8 }, borderRadius: 4, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>פרטי התקשרות</Typography>
                  <Stack spacing={4} sx={{ mt: 3 }}>
                    {[{
                      icon: <Phone sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
                      label: "טלפון",
                      value: <Link href="tel:+972500000000" underline="hover">050-000-0000</Link>,
                    }, {
                      icon: <WhatsApp sx={{ color: "#25D366", fontSize: 28 }} />,
                      label: "ווטסאפ",
                      value: <Link href="https://wa.me/972500000000" underline="hover" target="_blank">050-000-0000</Link>,
                    }, {
                      icon: <Email sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
                      label: "אימייל",
                      value: <Link href="mailto:info@hatene.com" underline="hover">info@hatene.com</Link>,
                    }, {
                      icon: <LocationOn sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
                      label: "כתובת",
                      value: <Typography>רחוב ז'בוטינסקי, פתח תקווה</Typography>,
                    }].map((item, index) => (
                      <Box key={index} sx={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 3 }}>
                        {item.icon}
                        <Box>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>{item.label}</Typography>
                          {item.value}
                        </Box>
                      </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 3 }}>
                      <AccessTime sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                      <Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>שעות פעילות</Typography>
                        <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 0.5 }}>ראשון - חמישי: 10:00 - 17:00</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem" }}>שישי-שבת: סגור</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ fontWeight: 600 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Contact;
