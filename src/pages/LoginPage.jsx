import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { data, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axiosInstance from '../api/axios';
import '../styles/Forms.css';

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(['CUSTOMER', 'ADMIN'], { message: "Please select a role" }),
    employeeId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'ADMIN' && (!data.employeeId || data.employeeId.trim() === '')) {
        ctx.addIssue({
            code: "custom",
            path: ['employeeId'],
            message: "Employee ID is required for Admin login",
        });
    }
});


const LoginPage = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        setAuthError('');
        try {
            const response = await axiosInstance.post('/auth/login', data);
            // Backend returns { accessToken, tokenType }
            const { accessToken, refreshToken } = response.data;

            console.log(accessToken);
            console.log(refreshToken);

            if (!accessToken || !refreshToken) {
                setAuthError("Login failed: Invalid tokens returned");
                return;
            }

            login(accessToken, refreshToken); // pass only the raw JWT

            // Redirect based on role
            const userRole = data.role; // role user selected at login
            console.log(userRole);
            if (userRole === 'ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/customer-dashboard');
            }
        } catch (error) {
            setAuthError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="page-background login">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {authError && <p className="message error">{authError}</p>}
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" {...register('email')} />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" {...register('password')} />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>
                    <div className="form-group">
                        <label>I am a:</label>
                        <select {...register('role')}>
                            <option value="">Select Role</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        {errors.role && <p className="error-message">{errors.role.message}</p>}
                    </div>
                    {selectedRole === 'ADMIN' && (
                        <div className="form-group">
                            <label>Employee ID:</label>
                            <input type="text" {...register('employeeId')} />
                            {errors.employeeId && <p className="error-message">{errors.employeeId.message}</p>}
                        </div>
                    )}
                    <button type="submit">Login</button>
                </form>
                <p className="link-text">Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default LoginPage
