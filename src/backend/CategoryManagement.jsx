import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        fetchCategories()
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    };

    const handleCreate = () => {
        if (!newCategory.trim()) return;
        createCategory({ name: newCategory })
            .then(() => {
                setNewCategory('');
                loadCategories();
            })
            .catch(err => console.error(err));
    };

    const handleUpdate = (id, currentName) => {
        const updatedName = prompt('Nhập tên danh mục mới', currentName);
        if (updatedName && updatedName.trim() !== '') {
            updateCategory(id, { name: updatedName })
                .then(() => loadCategories())
                .catch(err => console.error(err));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn xóa danh mục này không?')) {
            deleteCategory(id)
                .then(() => loadCategories())
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <h2>Quản Lý Danh Mục</h2>
            <div>
                <input 
                    type="text" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Tên danh mục mới" 
                />
                <button onClick={handleCreate}>Thêm danh mục</button>
            </div>
            <ul>
                {categories.map(cat => (
                    <li key={cat.id}>
                        {cat.name}
                        <button onClick={() => handleUpdate(cat.id, cat.name)}>Sửa</button>
                        <button onClick={() => handleDelete(cat.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManagement;