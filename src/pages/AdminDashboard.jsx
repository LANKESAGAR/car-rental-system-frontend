import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carOptions, setCarOptions] = useState({});

    const fetchAdminData = async () => {
        try {
            // Fetch pending bookings
            const bookingsResponse = await axiosInstance.get('/bookings/admin/pending');
            setPendingBookings(bookingsResponse.data);

            // Fetch all cars to populate the dropdown for approval
            const carsResponse = await axiosInstance.get('/admin/cars');

            // Organize cars by car variant ID for easier lookup
            const carsByVariant = {};
            carsResponse.data.forEach(car => {
                const variantId = car.carVariant.id;
                if (!carsByVariant[variantId]) {
                    carsByVariant[variantId] = [];
                }
                carsByVariant[variantId].push(car);
            });
            setCarOptions(carsByVariant);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch admin data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleApprove = async (bookingId, carId) => {
        try {
            await axiosInstance.put(`/bookings/admin/approve/${bookingId}/${carId}`);
            alert('Booking approved successfully!');
            fetchAdminData(); // Refresh the data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve booking.');
            console.error(err);
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await axiosInstance.put(`/bookings/admin/reject/${bookingId}`);
            alert('Booking rejected successfully!');
            fetchAdminData(); // Refresh the data
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reject booking.');
            console.error(err);
        }
    };


    if (isLoading) {
        return <div>Loading admin dashboard...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/admin/register"><button>Register New Admin</button></Link>
                <Link to="/admin/variants/add" style={{ marginLeft: '10px' }}><button>Add New Car Variant</button></Link>
                <Link to="/admin/cars/add" style={{ marginLeft: '10px' }}><button>Add New Car</button></Link>
            </div>
            <h2>Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
                <p>No pending bookings found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pendingBookings.map(booking => (
                        <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>Booking ID: {booking.id}</h3>
                            <p><strong>Customer:</strong> {booking.customerName}</p>
                            <p><strong>Car Variant:</strong> {booking.carVariantModel}</p>
                            <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p><strong>Total Cost:</strong> ${booking.totalCost.toFixed(2)}</p>

                            <div style={{ marginTop: '10px' }}>
                                {/* Car selection for approval */}
                                <label htmlFor={`car-select-${booking.id}`}>Assign a Car:</label>
                                <select id={`car-select-${booking.id}`}>
                                    <option value="">Select Car</option>
                                    {carOptions[booking.carVariantId]?.map(car => (
                                        <option key={car.id} value={car.id}>{car.licensePlate}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => {
                                        const selectedCarId = document.getElementById(`car-select-${booking.id}`).value;
                                        if (selectedCarId) {
                                            handleApprove(booking.id, selectedCarId);
                                        } else {
                                            alert('Please select a car to approve the booking.');
                                        }
                                    }}
                                >
                                    Approve
                                </button>
                                <button style={{ marginLeft: '10px' }} onClick={() => handleReject(booking.id)}>
                                    Reject
                                </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
