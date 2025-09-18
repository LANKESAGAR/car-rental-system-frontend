import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'; // We will create this next
import HomePage from './pages/HomePage';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingPage from './pages/BookingPage';
import useAuth from './hooks/useAuth';
import PaymentPage from './pages/PaymentPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import AddCarVariant from './pages/AddCarVariant';
import AddCar from './pages/AddCar';
import Header from './components/Header';


// A custom component for handling protected routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/book/:id" element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <BookingPage />
          </ProtectedRoute>
        } />

        <Route path="/customer-dashboard" element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/payment/:bookingId" element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <PaymentPage />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

<Route path="/admin/register" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRegistrationPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/variants/add" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddCarVariant />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/cars/add" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddCar />
          </ProtectedRoute>
        } />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
