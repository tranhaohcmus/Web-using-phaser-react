import { useState } from 'react';
import { register } from '../api';

export default function Register() {
    const [data, setData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        address: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(data);
        if (result.success) {
            setMessage('Registration successful!');
        } else {
            setMessage(result.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={data.email} 
                    onChange={handleChange} 
                    required 
                /><br />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={data.password} 
                    onChange={handleChange} 
                    required 
                /><br />
                <input 
                    type="text" 
                    name="full_name"
                    placeholder="Full name" 
                    value={data.full_name} 
                    onChange={handleChange} 
                /><br />
                <input 
                    type="text" 
                    name="phone"
                    placeholder="Phone" 
                    value={data.phone} 
                    onChange={handleChange} 
                /><br />
                <input 
                    type="text" 
                    name="address"
                    placeholder="Address" 
                    value={data.address} 
                    onChange={handleChange} 
                /><br />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}