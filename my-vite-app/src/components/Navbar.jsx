import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#f0f0f0' }}>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/favorites">Favorites</Link>
          <button onClick={logoutUser}>Log out ({user.username})</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Registration</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;