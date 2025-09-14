import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get('/bookings/customer');
                setBookings(response.data);
            } catch (error) {
                setError("Failed to fetch your bookings. Please try again.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);
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
