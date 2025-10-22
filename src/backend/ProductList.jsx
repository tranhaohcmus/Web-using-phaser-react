import { useState, useEffect } from "react";
import { fetchProducts } from "../api";
import { Link } from "react-router-dom";
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const result = await fetchProducts("?page=1&limit=20");
      if (result.success) {
        setProducts(result.data);
      }
    }
    loadProducts();
  }, []);

  return (
    <Grid container spacing={3}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              {product.images && product.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="160"
                  image={product.images[0].image_url}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description.substring(0, 100) + "..."}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/products/${product.slug}`}>
                  Chi tiết
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}