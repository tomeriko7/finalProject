import React, { useState } from "react";
import { Hero } from "../components/home/Hero";
import { Box, Typography, Link, useMediaQuery, useTheme } from "@mui/material";
import { Facebook, Twitter, YouTube } from '@mui/icons-material';
import styles from "../styles/formStyles";
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Hero />
 
      <Box sx={{ maxWidth: 700, mx: "auto", px: 2, pb: 4,mt:3, }}>
        {/* טופס צור קשר עם תיחום */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#fafafa",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ mb: 2, textAlign: "right" }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
               צור קשר
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              נשמח לשמוע ממך
            </Typography>
          </Box>

          {submitted ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "#d0f0c0",
                borderRadius: 1,
                textAlign: "center",
                fontWeight: "bold",
                color: "#2e7d32",
              }}
            >
              ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.
            </Box>
          ) : (
            <form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
              <Box sx={{ mb: 1 }}>
                <Typography component="label" htmlFor="name" sx={{ mb: 0.5, display: "block", fontWeight: 600, }}>
                  שם מלא
                </Typography>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    boxSizing: "border-box",
                    
                  }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography component="label" htmlFor="email" sx={{ mb: 0.5, display: "block", fontWeight: 600 }}>
                  אימייל
                </Typography>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    boxSizing: "border-box",
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography component="label" htmlFor="message" sx={{ mb: 0.5, display: "block", fontWeight: 600 }}>
                  הודעה
                </Typography>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    fontSize: 16,
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </Box>

              <button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: styles.submitButton.backgroundColor,
                  color: "white",
                  padding: "12px 0",
                  border: "none",
                  borderRadius: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(123 59 17 / 68%)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor)}
              >
                שליחה
              </button>
            </form>
          )}
        </Box>

       <Box
  sx={{
    p: 3,
    border: "1px solid #ccc",
    borderRadius: 2,
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    direction: "rtl",
    display: "flex",
    flexDirection: isSmallScreen ? "column" : "row",
    gap: 3,
    alignItems: "flex-start",
    mt: 4,
  }}
>
  {/* תיבת מפה */}
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <Typography
      variant="h6"
      sx={{ mb: 1, fontWeight: "bold", textAlign: "right" }}
    >דרכי יצירת קשר והגעה
    </Typography>
    <Box
      component="iframe"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49594.541087822734!2d34.847797730921336!3d32.09082829617387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d3673a30753b9%3A0xcde0651f23c1443c!2sPetah%20Tikva!5e0!3m2!1sen!2sil!4v1750080745871!5m2!1sen!2sil"
      width="100%"
      height="200"
      style={{ border: 0, borderRadius: 6 }}
      loading="lazy"
      title="מפת הגעה למשתלה"
    />
  </Box>

  {/* תיבת פרטי קשר */}
  <Box sx={{ flex: 1, minWidth: 0, textAlign: "right", fontSize: 14, mt:4 }}>
    <Typography sx={{ mb: 1 }}>
      <strong>טלפון:</strong>{" "}
      <Link
        href="tel:+972500000000"
        underline="hover"
        color="inherit"
        sx={{ direction: "ltr", display: "inline-block" }}
      >
        +972 5000 000
      </Link>
    </Typography>
    <Typography sx={{ mb: 1 }}>
      <strong>אימייל:</strong>{" "}
      <Link
        href="mailto:info@hatene.com"
        underline="hover"
        color="inherit"
      >
        info@hatene.com
      </Link>
    </Typography>
    <Typography>
      <strong>כתובת:</strong> ז'בוטינסקי פתח תקווה 
    </Typography>
    <Typography>
      <strong>שעות פעילות:</strong> ראשון עד חמישי 10:00–17:00, שישי שבת סגור
    </Typography>
  </Box>
  <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="https://facebook.com" target="_blank" color="inherit" aria-label="Facebook">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" target="_blank" color="inherit" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="https://youtube.com" target="_blank" color="inherit" aria-label="YouTube">
                <YouTube />
              </Link>
            </Box>
</Box>

      </Box>
    </>
  );
}

export default Contact;
