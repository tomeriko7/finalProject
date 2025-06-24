import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  Link,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Compare as CompareIcon,
} from "@mui/icons-material";

export const Products = () => {
  const products = [
    {
      id: 1,
      name: "Cactus Collection",
      price: 19.99,
      rating: 4.5,
      image:
        "https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg",
      badge: "Hot",
    },
    {
      id: 2,
      name: "Tropical Plant",
      price: 24.99,
      rating: 4.0,
      image:
        "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg",
    },
    {
      id: 3,
      name: "Succulent Set",
      price: 15.99,
      rating: 4.8,
      image:
        "https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg",
    },
    {
      id: 4,
      name: "Aloe Vera Plant",
      price: 12.99,
      originalPrice: 16.99,
      rating: 4.3,
      image:
        "https://images.pexels.com/photos/7728676/pexels-photo-7728676.jpeg",
      badge: "Sale",
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          החדשים שלנו
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}
        >
          גלו את קולקציות הצמחים ואביזרי הגינה החדשים ביותר שלנו
        </Typography>

        <Grid sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 4,
    justifyContent: "center",
  }}
>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                 sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 10px 20px rgb(232 168 14)",
          },
        }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="260"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  {product.badge && (
                    <Chip
                      label={product.badge}
                      color={product.badge === "Sale" ? "error" : "primary"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                  <Link href="#" underline="none" color="inherit">
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 600,
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {product.name}
                    </Typography>
                  </Link>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    <Rating
                      value={product.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {product.originalPrice && (
                      <Typography
                        component="span"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.disabled",
                          mr: 1,
                          fontSize: "0.9rem",
                        }}
                      >
                        ${product.originalPrice}
                      </Typography>
                    )}
                    <Typography
                      component="span"
                      color="primary"
                      fontWeight="bold"
                    >
                      ${product.price}
                    </Typography>
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{
                    justifyContent: "center",
                    borderTop: "1px solid #eee",
                    padding: "0px",
                    mt: "auto",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      flexGrow: 1,
                      borderRadius: 0,
                      color: "gray",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgb(232 168 14)",
                        color: "white",
                      },
                    }}
                  >
                    מועדפים
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      flexGrow: 1,
                      borderRadius: 0,
                      color: "gray",
                      py: 1.5,
                      borderLeft: "1px solid #eee",
                      borderRight: "1px solid #eee",
                      "&:hover": {
                        backgroundColor: "rgb(232 168 14)",
                        color: "white",
                      },
                    }}
                  >
                    הוסף לסל
                  </Button>
                  <Button
                    size="small"
                    startIcon={<CompareIcon />}
                    sx={{
                      flexGrow: 1,
                      borderRadius: 0,
                      color: "gray",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgb(232 168 14)",
                        color: "white",
                      },
                    }}
                  >
                    השווה
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 20px rgba(25, 115, 96, 0.3)",
              },
            }}
          >
            צפייה בכל המוצרים
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
