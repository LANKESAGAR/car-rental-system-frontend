import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';


const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get('/bookings/customer');
            setBookings(response.data);
        } catch (err) {
            setError("Failed to fetch your bookings. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const navigateToPayment = (bookingId) => {
        navigate(`/payment/${bookingId}`)
    }

    const handleCancelBooking = async (bookingId) => {
        setIsLoading(true);
        try {
            await axiosInstance.put(`/bookings/customer/cancel/${bookingId}`);
            alert('Booking cancelled successfully!');
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading your bookings...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    }
    return (
        <div style={{ padding: '20px' }}>
            <h1>Your Bookings</h1>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>Booking ID: {booking.id}</h3>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Car Model:</strong> {booking.carVariantModel}</p>
                            <p><strong>License Plate:</strong> {booking.assignedCarLicensePlate || 'N/A'}</p>
                            <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p><strong>Total Cost:</strong> ${booking.totalCost.toFixed(2)}</p>
                            {/* Conditional Buttons based on status */}
                            {booking.status === 'APPROVED' && (
                                <button onClick={() => navigateToPayment(booking.id)}>Proceed to Payment</button>
                            )}
                            {booking.status === 'PENDING' && (
                                <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard
