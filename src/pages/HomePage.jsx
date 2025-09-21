import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import '../styles/HomePage.css';

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
        <div className="container">
            <h1>Available Car Variants</h1>
            {carVariants.length === 0 ? (
                <p>No car variants are available at the moment. Please check back later.</p>
            ) : (
                <div className="car-list">
                    {carVariants.map(variant => (
                        <div key={variant.id} className="car-card">
                            <h3>{variant.make} {variant.model}</h3>
                            <p><strong>Year:</strong> {variant.year}</p>
                            <p><strong>Fuel Type:</strong> {variant.fuelType}</p>
                            <p><strong>Seating Capacity:</strong> {variant.seatingCapacity}</p>
                            <p className="rate"><strong>Rental Rate:</strong> ${variant.rentalRatePerDay} / day</p>
                            <Link to={`/book/${variant.id}`}>
                                <button className="full-width">Book Now</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;