export async function login(email, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

export async function register(data) {
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function fetchProducts(query = '') {
    const response = await fetch(`http://localhost:5000/api/products${query}`);
    return await response.json();
}

export async function fetchProductDetail(slug) {
    const response = await fetch(`http://localhost:5000/api/products/${slug}`);
    return await response.json();
}

export const addToCart = async (productId, quantity) => {
    const response = await fetch(`/api/cart/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ productId, quantity })
    });
    return response.json();
};

export const fetchCart = async () => {
    const response = await fetch(`/api/cart`);
    return response.json();
};

export const updateCart = async (productId, quantity) => {
    const response = await fetch(`/api/cart/update`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ productId, quantity })
    });
    return response.json();
};

export const removeFromCart = async (productId) => {
    const response = await fetch(`/api/cart/remove?productId=${productId}`, {
        method: 'DELETE'
    });
    return response.json();
};

export const createOrder = async (orderData) => {
    const response = await fetch(`/api/orders`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderData)
    });
    return response.json();
};

export const fetchOrders = async () => {
    const response = await fetch(`/api/orders`);
    return response.json();
};

export const fetchOrderDetail = async (orderId) => {
    const response = await fetch(`/api/orders/${orderId}`);
    return response.json();
};

export const fetchCategories = async () => {
    const response = await fetch(`/api/categories`);
    return response.json();
};

export const createCategory = async (categoryData) => {
    const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(categoryData)
    });
    return response.json();
};

export const updateCategory = async (categoryId, categoryData) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(categoryData)
    });
    return response.json();
};

export const deleteCategory = async (categoryId) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
    });
    return response.json();
};