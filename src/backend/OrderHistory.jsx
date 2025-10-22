import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders()
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Lịch Sử Đơn Hàng</h2>
            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={{ marginBottom: '10px' }}>
                        <p>Đơn hàng #{order.id} - Trạng thái: {order.status}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;