import { Hero } from "../components/home/Hero";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

function About() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Hero />

      <Container maxWidth="md" sx={{ mt: 10, mb: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            background: ` linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.8)),url("https://cdn.pixabay.com/photo/2020/07/20/05/58/fig-5421920_1280.png")`,
            borderRadius: 6,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            direction: "rtl",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <LocalFloristIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              sx={{ color: "#1b5e20", mr: 2 }}
            >
              אודות משתלת הטנא
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: "#c8e6c9" }} />

          <Typography
            variant="body1"
            sx={{
              fontSize: isMobile ? "1.15rem" : "1.35rem",
              lineHeight: 2,
              color: "#333",
              fontFamily: "Assistant, sans-serif",
            }}
          >
            משתלת הטנא היא בית אהוב למיני עצים ושתילים אותנטיים של ארץ
            ישראל, צמחי תבלין טריים וכלי גינון איכותיים לבית ולגינה. אנו פונים
            לכל חובבי הגינון – בין אם יש לכם מרפסת קטנה בעיר, גינה ביתית, מוסד
            או גני אירועים – ומציעים מגוון עשיר שמתאים לכל מרחב וטעם. במשתלת
            הטנא אנו מאמינים בגישה של "עשה זאת בעצמך" פשוטה ונעימה, ותומכים
            בלקוחותינו עם ליווי מקצועי, הדרכה ותמיכה מלאה בכל שלב – מהזמנה
            אונליין ועד טיפול והצלחה בגידול הצמחים שלכם.
            <br />
            <br />
            בואו להרגיש את הקסם של הטבע קרוב לבית, ולמלא את הסל שלכם בצמחייה
            איכותית שמביאה חיים ויופי לכל חלל. בין אם אתם חובבי גינון מושבעים או
            פשוט חולמים לקטוף פרי מהעץ שלכם — אנחנו כאן כדי ללוות אתכם בכל שלב.
            כי כל בית יכול להיות ירוק יותר.
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default About;
