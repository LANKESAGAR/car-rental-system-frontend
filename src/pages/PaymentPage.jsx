import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../api/axios';

const paymentSchema = z.object({
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionId: z.string().min(5, "Transaction ID must be at least 5 characters long"),
});

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a temporary useEffect to fetch booking details for displaying to the user
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/customer`);
        const booking = response.data.find(b => b.id === Number(bookingId));
        if (!booking) {
          throw new Error('Booking not found or not accessible.');
        }
        setBookingDetails(booking);
      } catch (err) {
        setPaymentError(err.message || 'Failed to load booking details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data) => {
    setPaymentError('');
    setPaymentSuccess('');
    try {
      // The backend expects query parameters, not a JSON body
      const response = await axiosInstance.post(
        `/payments/process/${bookingId}?paymentMethod=${data.paymentMethod}&transactionId=${data.transactionId}`
      );
      setPaymentSuccess('Payment successful! Your booking is now paid.');
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 2000);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };
  
  if (isLoading) {
    return <div>Loading payment page...</div>;
  }

  if (paymentError && !bookingDetails) {
    return <div style={{ color: 'red' }}>Error: {paymentError}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Complete Your Payment</h2>
      {bookingDetails && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>Booking Summary</h3>
          <p><strong>Booking ID:</strong> {bookingDetails.id}</p>
          <p><strong>Car:</strong> {bookingDetails.carVariantModel}</p>
          <p><strong>Total Cost:</strong> ${bookingDetails.totalCost.toFixed(2)}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {paymentError && <p style={{ color: 'red' }}>{paymentError}</p>}
        {paymentSuccess && <p style={{ color: 'green' }}>{paymentSuccess}</p>}
        <div>
          <label>Payment Method:</label>
          <input type="text" {...register('paymentMethod')} />
          {errors.paymentMethod && <p>{errors.paymentMethod.message}</p>}
        </div>
        <div>
          <label>Transaction ID:</label>
          <input type="text" {...register('transactionId')} />
          {errors.transactionId && <p>{errors.transactionId.message}</p>}
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;