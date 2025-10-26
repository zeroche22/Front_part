import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('/users/login/', {
        username,
        password,
      });
      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      alert('Error! Incorrect login or password.');
    }
  };

const registerUser = async (username, email, password, passwordCheck, first_name = '', last_name = '') => {
    try {
      await api.post('/users/register/', {
        username,
        email,
        password,
        password2: passwordCheck,
        first_name,
        last_name,
      });

      navigate('/login');
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration failed', error);
      if (error.response && error.response.data) {
        alert(`Registration error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('An error occurred while registering. Please try again.');
      }
    }
  };

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  useEffect(() => {
    const checkUserToken = async () => {
      if (authTokens) {
        try {
          const response = await api.post('/users/token/refresh/', {
            refresh: authTokens.refresh,
          });
          const data = response.data;
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          localStorage.setItem('authTokens', JSON.stringify(data));
        } catch (error) {
          console.error('Token refresh failed on load', error);
          setAuthTokens(null);
          setUser(null);
          localStorage.removeItem('authTokens');
        }
      }
      setLoading(false);
    };
    checkUserToken();
  }, []);

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 14;
    let interval = setInterval(() => {
      if (authTokens) {
        const updateToken = async () => {
           try {
              const response = await api.post('/users/token/refresh/', {
                refresh: authTokens.refresh,
              });
              const data = response.data;
              setAuthTokens(data);
              setUser(jwtDecode(data.access));
              localStorage.setItem('authTokens', JSON.stringify(data));
            } catch (error) {
              console.error('Interval refresh failed', error);
              logoutUser(); 
            }
        };
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens]); 

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;