import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const { user, isLoading, logout } = useAuth();

    return (
        <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 2rem', 
            backgroundColor: '#333', 
            color: '#fff' 
        }}>
            <div className="logo">
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Car Rental
                </Link>
            </div>
            <nav>
                <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
                    {user ? (
                        <>
                            {user.role === 'CUSTOMER' && (
                                <li><Link to="/customer-dashboard" style={{ color: '#fff', textDecoration: 'none' }}>My Bookings</Link></li>
                            )}
                            {user.role === 'ADMIN' && (
                                <li><Link to="/admin-dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Admin Dashboard</Link></li>
                            )}
                            <li><button onClick={logout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link></li>
                            <li><Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;