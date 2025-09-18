import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  Button,
  Stack
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import HomeIcon from "@mui/icons-material/Home";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";

// Context
import { AuthContext } from "../services/AuthContext";

export const Footer = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const isAuthenticated = !!user;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.custom?.footer || theme.palette.grey[900],
        color: "white",
        py: { xs: 4, md: 6 },
        mt: 'auto',
        direction: "rtl",
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* לוגו וטקסט */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Box
                component="img"
                src="/IconHatene.png" 
                alt="לוגו החברה"
                sx={{
                  height: 60,
                  mb: 2,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }}
              />
              <Typography variant="body2" sx={{ mb: 2, textAlign: { xs: 'center', md: 'right' } }}>
              מובילים בתחום המשתלות בישראל מאז 2021.
אנו מציעים צמחים וציוד גינון איכותיים במחירים משתלמים במיוחד
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton color="primary" aria-label="פייסבוק" size="small">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary" aria-label="אינסטגרם" size="small">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary" aria-label="יוטיוב" size="small">
                  <YouTubeIcon />
                </IconButton>
                <IconButton color="primary" aria-label="טוויטר" size="small">
                  <TwitterIcon />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          {/* קישורים מהירים */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              קישורים מהירים
            </Typography>
            <List dense disablePadding>
              <ListItem component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <HomeIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="דף הבית" />
              </ListItem>
              <ListItem component={Link} to="/store" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <StoreIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="חנות" />
              </ListItem>
              <ListItem component={Link} to="/about" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="אודות" />
              </ListItem>
              <ListItem component={Link} to="/contact" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ContactSupportIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="צור קשר" />
              </ListItem>
            </List>
          </Grid>

          {/* מידע משפטי */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              מידע משפטי
            </Typography>
            <List dense disablePadding>
              <ListItem component={Link} to="/privacy" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <PrivacyTipIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="מדיניות פרטיות" />
              </ListItem>
              <ListItem component={Link} to="/terms" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <GavelIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="תנאי שימוש" />
              </ListItem>
              {isAuthenticated && (
                <ListItem component={Link} to="/profile" sx={{ color: 'inherit', textDecoration: 'none' }}>
                  <ListItemText primary="החשבון שלי" />
                </ListItem>
              )}
              {!isAuthenticated && (
                <>
                  <ListItem component={Link} to="/login" sx={{ color: 'inherit', textDecoration: 'none' }}>
                    <ListItemText primary="התחברות" />
                  </ListItem>
                  <ListItem component={Link} to="/register" sx={{ color: 'inherit', textDecoration: 'none' }}>
                    <ListItemText primary="הרשמה" />
                  </ListItem>
                </>
              )}
            </List>
          </Grid>

          {/* צור קשר */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              צור קשר
            </Typography>
            <List dense disablePadding>
              <ListItem sx={{ px: 0 }}>
                <LocationOnIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="רחוב ז'בוטינסקי פתח תקווה" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <PhoneIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="03-1234567" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <EmailIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="info@hatene.com" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <WhatsAppIcon fontSize="small" sx={{ ml: 1 }} />
                <ListItemText primary="050-000-0000" />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        {/* זכויות יוצרים */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          <Typography variant="body2" sx={{ mb: isMobile ? 2 : 0 }}>
            © {new Date().getFullYear()} כל הזכויות שמורות לתומר קרואני
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isMobile && (
              <Button
                component="a"
                href="#"
                variant="text"
                size="small"
                sx={{ color: 'white' }}
              >
                מפת האתר
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
