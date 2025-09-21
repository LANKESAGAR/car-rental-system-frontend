import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Forms.css';

const UpdateCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState({
        licensePlate: '',
        available: true,
        lastServiceDate: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axiosInstance.get(`/admin/cars/${id}`);
                setCar({
                    licensePlate: response.data.licensePlate,
                    available: response.data.available,
                    lastServiceDate: response.data.lastServiceDate || '',
                });
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch car data.');
                setIsLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCar(prevCar => ({
            ...prevCar,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/admin/cars/${id}`, car);
            setSuccess('Car updated successfully!');
            setError(null);
            setTimeout(() => {
                navigate('/admin/edit/cars');
            }, 2000);
        } catch (err) {
            setSuccess(null);
            setError(err.response?.data?.message || 'Failed to update car.');
        }
    };

    if (isLoading) {
        return <div className="loading-message">Loading car details...</div>;
    }

    if (error && !car.licensePlate) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container form-container">
            <Link to="/admin/edit/cars" className="back-button">
                &lt; Back to Car List
            </Link>
            <h2>Update Car</h2>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="licensePlate">License Plate</label>
                    <input
                        type="text"
                        id="licensePlate"
                        name="licensePlate"
                        value={car.licensePlate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label htmlFor="available">Available</label>
                    <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={car.available}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastServiceDate">Last Service Date</label>
                    <input
                        type="date"
                        id="lastServiceDate"
                        name="lastServiceDate"
                        value={car.lastServiceDate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Car</button>
            </form>
        </div>
    );
};

export default UpdateCar;