import React, { useState, useEffect, useContext } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";

import herovideo1 from "../../assets/images/herovideo1.mp4";
import herovideo2 from "../../assets/images/herovideo2.mp4";
import herovideo3 from "../../assets/images/herovideo3.mp4";
import herovideo4 from "../../assets/images/herovideo4.mp4";

const videos = [herovideo1, herovideo2, herovideo3, herovideo4];

export const Hero = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const handleShopClick = () => {
    navigate(user ? "/store" : "/login");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % videos.length);
      setIsFading(true);
      setTimeout(() => setIsFading(false), 1800); // מעבר חלק יותר
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "40vh",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* וידאו קודם */}
      {prevIndex !== null && (
        <video
          key={`video-${prevIndex}`}
          src={videos[prevIndex]}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isFading ? 0 : 1,
            transition: "opacity 1.8s ease-in-out",
            zIndex: 0,
          }}
        />
      )}

      {/* וידאו נוכחי */}
      <video
        key={`video-${currentIndex}`}
        src={videos[currentIndex]}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1,
          transition: "opacity 1.8s ease-in-out",
          zIndex: 1,
        }}
      />

      {/* שכבת צבע כהה חצי-שקופה */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 2,
        }}
      />

      {/* תוכן על הווידאו */}
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
          במשתלת "הטנא" תוכלו למלא את הסל משפע הארץ עם שתילים מובחרים משבעת המינים,
          לצד מבחר ריחני של עשבי תבלין. בואו לטעת בגינתכם טעם והוד של מסורת.
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
