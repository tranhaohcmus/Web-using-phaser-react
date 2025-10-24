import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetail } from "../api";
import { Card, CardMedia, CardContent, Typography, Container, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      const result = await fetchProductDetail(slug);
      if (result.success) {
        setProduct(result.data);
      }
    }
    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          {product.images && product.images.length > 0 && (
            <CardMedia
              component="img"
              height="300"
              image={product.images[0].image_url}
              alt={product.name}
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5">
              {product.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Giá: {product.price}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}