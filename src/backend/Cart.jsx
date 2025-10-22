import React, { useState, useEffect } from 'react';
import { fetchCart, updateCart, removeFromCart } from '../api';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        fetchCart()
            .then(data => setCart(data))
            .catch(err => console.error(err));
    };

    const handleUpdate = (productId, quantity) => {
        updateCart(productId, quantity)
            .then(() => loadCart())
            .catch(err => console.error(err));
    };

    const handleRemove = (productId) => {
        removeFromCart(productId)
            .then(() => loadCart())
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Giỏ Hàng</h2>
            {cart.length === 0 ? (
                <p>Giỏ hàng trống</p>
            ) : (
                cart.map(item => (
                    <div key={item.productId} style={{ marginBottom: '10px' }}>
                        <span>{item.name}</span> - <span>Số lượng: {item.quantity}</span>
                        <button onClick={() => handleUpdate(item.productId, item.quantity + 1)}>+</button>
                        <button onClick={() => handleUpdate(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                        <button onClick={() => handleRemove(item.productId)}>Xóa</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;