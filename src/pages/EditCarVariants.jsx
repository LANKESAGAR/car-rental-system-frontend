import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import '../styles/Forms.css';
import '../styles/Modal.css';

const EditCarVariants = () => {
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the custom confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

  const fetchCarVariants = async () => {
    try {
      const response = await axiosInstance.get('/variants');
      setVariants(response.data);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch car variants.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarVariants();
  }, []);

  // New function to open the confirmation modal
  const handleShowConfirm = (id) => {
    setVariantToDelete(id);
    setShowConfirm(true);
  };

  // Function to close the modal and reset state
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setVariantToDelete(null);
  };

  // The actual delete logic, called after user confirmation
  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/variants/${variantToDelete}`);
      fetchCarVariants(); // Refresh the list after successful deletion
      handleCancelDelete(); // Close the modal
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete car variant.";
      setError(errorMessage);
      console.error("Deletion failed:", errorMessage);
      handleCancelDelete(); // Close the modal
    }
  };

  if (isLoading) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="form-container">
        <Link to="/admin-dashboard" className="back-button">
          &lt; Back to Dashboard
        </Link>
        <h2>Edit Car Variants</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Fuel Type</th>
                <th>Seating Capacity</th>
                <th>Rate/Hr</th>
                <th>Rate/Day</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {variants.map(variant => (
                <tr key={variant.id}>
                  {/* Corrected: Add the table data cells */}
                  <td data-label="Make">{variant.make}</td>
                  <td data-label="Model">{variant.model}</td>
                  <td data-label="Year">{variant.year}</td>
                  <td data-label="Fuel Type">{variant.fuelType}</td>
                  <td data-label="Seating Capacity">{variant.seatingCapacity}</td>
                  <td data-label="Rate/Hr">${variant.rentalRatePerHour.toFixed(2)}</td>
                  <td data-label="Rate/Day">${variant.rentalRatePerDay.toFixed(2)}</td>
                  <td>
                    {/* The Delete button */}
                    <button onClick={() => handleShowConfirm(variant.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* The custom confirmation dialog */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this car variant and all associated cars?</p>
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

export default EditCarVariants;