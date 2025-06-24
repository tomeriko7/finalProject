import React, { useState, useEffect, useContext } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";


const images = [
  "https://images.pexels.com/photos/39351/purple-grapes-vineyard-napa-valley-napa-vineyard-39351.jpeg",
  "https://cdn.pixabay.com/photo/2014/05/30/01/09/figs-357683_1280.jpg",
  "https://cdn.pixabay.com/photo/2017/11/01/17/17/olive-2908688_1280.jpg",
];

export const Hero = () => {
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleShopClick = () =>{
    if (user) {
      navigate("/store")
    } else {
      navigate("/login")
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000); // כל 6 שניות
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: "relative", height: "40vh", color: "white", overflow: "hidden" }}>
      {/* רקעים מתחלפים */}
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0)), url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: index === currentIndex ? 1 : 0,
            filter: index === currentIndex ? "blur(0px)" : "blur(6px)",
            transition: "opacity 1.8s ease-in-out, filter 1.8s ease-in-out",
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              zIndex: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "30%",
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent)",
              zIndex: 2,
            },
          }}
        />
      ))}

      {/* תוכן */}
      <Container
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 5,
            animation: "pulseFade 3s ease-in-out infinite",
            "@keyframes pulseFade": {
              "0%, 100%": { opacity: 1, transform: "translateY(0)" },
              "50%": { opacity: 0.8, transform: "translateY(8px)" },
            },
          }}
        >
          ולקחת מראשית כל פרי האדמה
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            maxWidth: "800px",
            mx: "auto",
            animation: "fadeIn 1s ease-out 0.3s forwards",
            opacity: 0,
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          במשתלת "הטנא" תוכלו למלא את הסל משפע הארץ עם שתילים מובחרים משבעת המינים, לצד מבחר ריחני של עשבי תבלין. בואו לטעת בגינתכם טעם והוד של מסורת
        </Typography>

        <Box
          sx={{
            animation: "fadeIn 1s ease-out 0.6s forwards",
            opacity: 0,
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Button
          onClick={handleShopClick}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mr: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              transition: "all 0.3s ease",
              backgroundColor: "rgba(25, 115, 96, 0.5)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 20px rgba(25, 115, 96, 0.3)",
              },
            }}
          >
            לרכישה באתר
          </Button>
          <Button
          href="/about"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#ffffff",
              color: "rgb(25 115 96)",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f0f0f0",
                transform: "translateY(-3px)",
                boxShadow: "0 10px 20px rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            קצת עלינו
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
