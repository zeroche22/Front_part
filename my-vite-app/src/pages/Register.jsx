import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [errors, setErrors] = useState({});

  const { registerUser } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Email is required';
    if (!passwordCheck) newErrors.passwordCheck = 'Password repetition is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Incorrect email format';
    }

    if (password && password.length < 8) {
      newErrors.password = 'The password must be at least 8 characters long.';
    }

    if (password && passwordCheck && password !== passwordCheck) {
      newErrors.passwordCheck = 'The passwords must match';
    }
    
    if (username.length > 33) newErrors.username = 'Max 33 characters';
    if (firstName.length > 33) newErrors.firstName = 'Max 33 characters';
    if (lastName.length > 33) newErrors.lastName = 'Max 33 characters';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await registerUser(username, email, password, passwordCheck, firstName, lastName);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <div>
          <label>Username (login) *</label>
          <input
            type="text"
            maxLength="33"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        <div>
          <label>Email *</label>
          <input
            type="email"
            maxLength="100"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label>First name(optional)</label>
          <input
            type="text"
            maxLength="33"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
        </div>
        <div>
          <label>Last name (optional)</label>
          <input
            type="text"
            maxLength="33"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
        </div>
        <div>
          <label>Password *</label>
          <input
            type="password"
            maxLength="128"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <div>
          <label>Repeat password (password2) *</label>
          <input
            type="password"
            maxLength="128"
            required
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {errors.passwordCheck && <p style={{ color: 'red' }}>{errors.passwordCheck}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;