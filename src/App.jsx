import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import '../public/style.css';

import Login from './backend/Login';
import Register from './backend/Register';
import ProductList from './backend/ProductList';
import ProductDetail from './backend/ProductDetail';
import StoreHome from './backend/StoreHome';
import Cart from './backend/Cart';
import OrderHistory from './backend/OrderHistory';
import CategoryManagement from './backend/CategoryManagement';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <header>
                    <nav>
                        <ul>
                            <li><Link to="/">Store Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/orders">Order History</Link></li>
                            <li><Link to="/categories">Category Management</Link></li>
                        </ul>
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<StoreHome />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/categories" element={<CategoryManagement />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;