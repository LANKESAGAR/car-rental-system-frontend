import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Header.css';

const Header = () => {
    const { user, isLoading, logout } = useAuth();

    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">
                    Car Rental
                </Link>
            </div>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    {user ? (
                        <>
                            {user.role === 'CUSTOMER' && (
                                <li><Link to="/customer-dashboard">My Bookings</Link></li>
                            )}
                            {user.role === 'ADMIN' && (
                                <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                            )}
                            {/* Add the "Change Password" link here */}
                            <li><Link to="/change-password">Change Password</Link></li>
                            <li><button onClick={logout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;