import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/Forms.css';
import '../styles/Modal.css';

const EditCars = () => {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);

    const fetchCars = async () => {
        try {
            const response = await axiosInstance.get('/admin/cars');
            setCars(response.data);
            setIsLoading(false);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch cars.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleShowConfirm = (id) => {
        setCarToDelete(id);
        setShowConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setCarToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosInstance.delete(`/admin/cars/${carToDelete}`);
            fetchCars(); // Refresh the list
            handleCancelDelete(); // Close the modal
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete car.";
            setError(errorMessage);
            console.error("Deletion failed:", errorMessage);
            handleCancelDelete();
        }
    };

    if (isLoading) {
        return <div className="loading-message">Loading cars...</div>;
    }

    return (
        <div className="container">
            <div className="form-container">
                <Link to="/admin-dashboard" className="back-button">
                    &lt; Back to Dashboard
                </Link>
                <h2>Edit Cars</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>License Plate</th>
                                <th>Variant</th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id}>
                                    <td data-label="License Plate">{car.licensePlate}</td>
                                    <td data-label="Variant">{car.carVariant.model}</td>
                                    <td data-label="Make">{car.carVariant.make}</td>
                                    <td data-label="Model">{car.carVariant.model}</td>
                                    <td data-label="Available">{car.available ? 'Yes' : 'No'}</td>
                                    <td data-label="Actions" className="actions-cell">
                                        <Link to={`/admin/cars/edit/${car.id}`}>
                                            <button className="edit-button">Edit</button>
                                        </Link>
                                        <button onClick={() => handleShowConfirm(car.id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this car? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={handleConfirmDelete} className="confirm-button">Yes, Delete</button>
                            <button onClick={handleCancelDelete} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCars;