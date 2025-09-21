import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';

const adminRegistrationSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.literal('ADMIN'),
  employeeId: z.string().min(1, "Employee ID is required"),
});

const AdminRegistrationPage = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      role: 'ADMIN',
    },
  });

  const onSubmit = async (data) => {
    setRegisterError('');
    setRegisterSuccess('');
    try {
      // Send the registration request to the backend.
      // The `Authorization` header will be automatically added by axiosInstance.
      const response = await axiosInstance.post('/auth/admin/register', data);

      setRegisterSuccess('Admin account created successfully!');

      // Redirect to the admin dashboard after a short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);

    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Admin registration failed. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="form-container">
      <h2>Register New Admin</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {registerError && <p className="message error">{registerError}</p>}
        {registerSuccess && <p className="message success">{registerSuccess}</p>}

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
          <label>Employee ID:</label>
          <input type="text" {...register('employeeId')} />
          {errors.employeeId && <p className="error-message">{errors.employeeId.message}</p>}
        </div>

        <div className="button-group">
          <button type="submit">Register</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegistrationPage;