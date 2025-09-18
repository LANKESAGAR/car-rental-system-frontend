// src/pages/AddCarVariant.jsx (Corrected Code)
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const carVariantSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Year must be a valid car year"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seatingCapacity: z.number().int().min(1, "Seating capacity must be at least 1"),
  rentalRatePerHour: z.number().min(0, "Rental rate per hour cannot be negative"),
  rentalRatePerDay: z.number().min(0, "Rental rate per day cannot be negative"),
});

const AddCarVariant = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(carVariantSchema),
    defaultValues: { // Good practice to set default values
        year: new Date().getFullYear(),
        seatingCapacity: 4,
        rentalRatePerHour: 0.0,
        rentalRatePerDay: 0.0
    }
  });

  const onSubmit = async (data) => {
    setFormError('');
    setFormSuccess('');
    try {
      // Send all required fields to the backend
      await axiosInstance.post('/variants', data);
      setFormSuccess('Car variant added successfully!');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to add car variant.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Car Variant</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}

        <div>
          <label>Make:</label>
          <input type="text" {...register('make')} />
          {errors.make && <p style={{ color: 'red' }}>{errors.make.message}</p>}
        </div>
        <div>
          <label>Model:</label>
          <input type="text" {...register('model')} />
          {errors.model && <p style={{ color: 'red' }}>{errors.model.message}</p>}
        </div>
        <div>
          <label>Year:</label>
          <input type="number" {...register('year', { valueAsNumber: true })} />
          {errors.year && <p style={{ color: 'red' }}>{errors.year.message}</p>}
        </div>
        <div>
          <label>Fuel Type:</label>
          <input type="text" {...register('fuelType')} />
          {errors.fuelType && <p style={{ color: 'red' }}>{errors.fuelType.message}</p>}
        </div>
        <div>
          <label>Seating Capacity:</label>
          <input type="number" {...register('seatingCapacity', { valueAsNumber: true })} />
          {errors.seatingCapacity && <p style={{ color: 'red' }}>{errors.seatingCapacity.message}</p>}
        </div>
        <div>
          <label>Hourly Rate:</label>
          <input type="number" step="0.01" {...register('rentalRatePerHour', { valueAsNumber: true })} />
          {errors.rentalRatePerHour && <p style={{ color: 'red' }}>{errors.rentalRatePerHour.message}</p>}
        </div>
        <div>
          <label>Daily Rate:</label>
          <input type="number" step="0.01" {...register('rentalRatePerDay', { valueAsNumber: true })} />
          {errors.rentalRatePerDay && <p style={{ color: 'red' }}>{errors.rentalRatePerDay.message}</p>}
        </div>
        
        <button type="submit">Add Variant</button>
      </form>
    </div>
  );
};

export default AddCarVariant;