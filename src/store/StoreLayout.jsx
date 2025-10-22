import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { motion } from "framer-motion";
import "animate.css";

export default function StoreLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sports Store
          </Typography>
          <Button color="inherit" component={NavLink} to="/" end>
            Home
          </Button>
          <Button color="inherit" component={NavLink} to="/products">
            Products
          </Button>
          <Button color="inherit" component={NavLink} to="/login">
            Login
          </Button>
          <Button color="inherit" component={NavLink} to="/register">
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {/* Dùng animate.css cho hiệu ứng bounce nhẹ khi load */}
        <div className="animate__animated animate__fadeIn">
          <Outlet />
        </div>
      </Container>
      <Box component="footer" sx={{ p: 2, mt: 4, backgroundColor: "#f5f5f5", textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Sports Store. All rights reserved.
        </Typography>
      </Box>
    </motion.div>
  );
}