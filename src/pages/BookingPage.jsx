import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';
import '../styles/Forms.css';

// Zod schema for validation, matching your BookingRequestDTO
const bookingSchema = z.object({
    carVariantId: z.string().transform(val => Number(val)), // Ensure it's a number
    startDate: z.string().refine(
        (val) => !isNaN(new Date(val)),
        { message: "Invalid start date format" }
    ).refine(
        (val) => new Date(val) > new Date(),
        { message: "Start date must be in the future" }
    ),
    endDate: z.string().refine(
        (val) => !isNaN(new Date(val)),
        { message: "Invalid end date format" }
    ).refine(
        (val) => new Date(val) > new Date(),
        { message: "End date must be in the future" }
    ),
}).refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
        message: "End date cannot be before the start date",
        path: ["endDate"],
    }
);

const BookingPage = () => {
    const { id: carVariantId } = useParams();
    const navigate = useNavigate();
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            carVariantId: carVariantId,
            startDate: '',
            endDate: ''
        }
    });

    const onSubmit = async (data) => {
        setBookingError('');
        setBookingSuccess('');
        try {
            const response = await axiosInstance.post('/bookings/customer', data);
            setBookingSuccess("Booking request submitted successfully! Redirecting to payment...");
            setTimeout(() => {
                navigate(`/payment/${response.data.id}`); // Redirect to a payment page
            }, 2000);
        } catch (error) {
            setBookingError(error.response?.data?.message || 'Failed to create booking.');
        }
    };

    const handleCancel = () => {
        navigate('/');
      };

    return (
        <div className="form-container">
            <h2>Book a Car</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {bookingError && <p className="message error">{bookingError}</p>}
                {bookingSuccess && <p className="message success">{bookingSuccess}</p>}
                <div className="form-group">
                    <label>Start Date:</label>
                    <input type="date" {...register('startDate')} />
                    {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input type="date" {...register('endDate')} />
                    {errors.endDate && <p className="error-message">{errors.endDate.message}</p>}
                </div>
                <div className="button-group">
                    <button type="submit">Submit Booking Request</button>
                    <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage
