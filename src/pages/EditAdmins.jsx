import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/Forms.css';
import '../styles/AdminDashboard.css'; // Add this import for button styles

const EditAdmins = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get('/admin/list');
      
      if (Array.isArray(response.data)) {
        setAdmins(response.data);
      } else {
        console.error("API response for admins is not an array:", response.data);
        setAdmins([]);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch admin data. Please check the network.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    if (user && user.id === id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await axiosInstance.delete(`/admin/${id}`);
        fetchAdmins();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete admin.");
      }
    }
  };

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <div className="form-container">
        {/* New button to go back to the dashboard */}
        <Link to="/admin-dashboard" className="back-button">
          &lt; Back to Dashboard
        </Link>
        
        <h2>Edit Admins</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.email}</td>
                  <td>{admin.employeeId}</td>
                  <td>
                    <button onClick={() => handleDelete(admin.id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditAdmins;