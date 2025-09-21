import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';

const addCarSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  carVariantId: z.string().min(1, "Car variant is required"),
  isAvailable: z.boolean(),
  lastServiceDate: z.string().date(), // Validate as a date string
});

const AddCar = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addCarSchema),
    defaultValues: {
      isAvailable: true,
      lastServiceDate: new Date().toISOString().split('T')[0], // Set today's date
    },
  });

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const response = await axiosInstance.get('/variants');
        setVariants(response.data);
      } catch (error) {
        setFormError(error.response?.data?.message || 'Failed to fetch car variants.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVariants();
  }, []);

  const onSubmit = async (data) => {
    setFormError('');
    setFormSuccess('');
    try {
      // Extract carVariantId for the path variable
      const carVariantId = data.carVariantId;
      
      // Create a payload that matches the backend's Car entity fields
      const payload = {
        licensePlate: data.licensePlate,
        isAvailable: data.isAvailable,
        lastServiceDate: data.lastServiceDate,
      };
      
      // Send the POST request with carVariantId in the URL path
      await axiosInstance.post(`/admin/cars/${carVariantId}`, payload);

      setFormSuccess('Car added successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to add car.');
    }
  };

  if (isLoading) {
    return <div className="loading-message">Loading variants...</div>;
  }

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="form-container">
        <h2>Add New Car</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            {formError && <p className="message error">{formError}</p>}
            {formSuccess && <p className="message success">{formSuccess}</p>}
            
            <div className="form-group">
                <label>License Plate:</label>
                <input type="text" {...register('licensePlate')} />
                {errors.licensePlate && <p className="error-message">{errors.licensePlate.message}</p>}
            </div>
            
            <div className="form-group">
                <label>Car Variant:</label>
                <select {...register('carVariantId')}>
                    <option value="">Select a variant</option>
                    {variants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                            {variant.make} {variant.model}
                        </option>
                    ))}
                </select>
                {errors.carVariantId && <p className="error-message">{errors.carVariantId.message}</p>}
            </div>
            
            <div className="form-group checkbox-group">
                <label>Is Available:</label>
                <input type="checkbox" {...register('isAvailable')} defaultChecked />
            </div>
            
            <div className="form-group">
                <label>Last Service Date:</label>
                <input type="date" {...register('lastServiceDate')} />
                {errors.lastServiceDate && <p className="error-message">{errors.lastServiceDate.message}</p>}
            </div>
            
            <div className="button-group">
          <button type="submit">Add Car</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
        </form>
    </div>
  );
};

export default AddCar;