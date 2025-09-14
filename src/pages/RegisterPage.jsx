import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

// Zod schema for registration, matching the backend's AuthRequest DTO for a customer
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const onSubmit = async (data) => {
    setRegisterError('');
    setRegisterSuccess('');
    try {
      // Create a payload that includes the role, as expected by the AuthRequest DTO
      const payload = {
        email: data.email,
        password: data.password,
        username: data.username,
        role: "CUSTOMER" // Explicitly set the role for a customer registration
      };
      
      const response = await axiosInstance.post('/auth/register', payload);
      setRegisterSuccess(response.data);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setRegisterError(error.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register as a New Customer</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
        {registerSuccess && <p style={{ color: 'green' }}>{registerSuccess}</p>}
        
        <div>
          <label>Username:</label>
          <input type="text" {...register('username')} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default RegisterPage;