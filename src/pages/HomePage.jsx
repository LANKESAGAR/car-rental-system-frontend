import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const HomePage = () => {
    const [carVariants, setCarVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarVariants = async () => {
            try {
                const response = await axiosInstance.get('/variants');
                setCarVariants(response.data);
            } catch (err) {
                setError("Failed to fetch car variants. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCarVariants();
    }, []);

    if (isLoading) {
        return <div>Loading available cars...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Available Car Variants</h1>
            {carVariants.length === 0 ? (
                <p>No car variants are available at the moment. Please check back later.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {carVariants.map(variant => (
                        <div key={variant.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '300px' }}>
                            <h3>{variant.make} {variant.model}</h3>
                            <p><strong>Year:</strong> {variant.year}</p>
                            <p><strong>Fuel Type:</strong> {variant.fuelType}</p>
                            <p><strong>Seating Capacity:</strong> {variant.seatingCapacity}</p>
                            <p><strong>Rental Rate:</strong> ${variant.rentalRatePerDay} / day</p>
                            <Link to={`/book/${variant.id}`}>
                                <button>Book Now</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;