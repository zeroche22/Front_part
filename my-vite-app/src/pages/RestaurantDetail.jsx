import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const restaurantResponse = await api.get(`/api/restaurants/${id}/`);
        setRestaurant(restaurantResponse.data);
        const dishesResponse = await api.get(`/api/dishes/?restaurant_id=${id}`); 
        const groupedMenu = (dishesResponse.data || []).reduce((acc, dish) => {
          const category = dish.category || 'Uncategorized'; 
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(dish);
          return acc;
        }, {});
        setMenu(groupedMenu);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToFavorites = async (dishId) => {
    if (!user) {
      alert("Please sign in or regist to add to favorites.");
      navigate('/login');
      return;
    }

    try {
      await api.post('/api/favorite/', {
        dish: dishId,
        restaurant: id
      });
      alert('The dish has been added to your favorites!');
    } catch (err) {
      console.error('Failed to add to favorites', err);
      if (err.response && err.response.status === 400) {
         alert('Error: This dish may already be a favorite.');
      } else {
         alert('Failed to add to favorites.');
      }
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div>
      <div style={{ borderBottom: '2px solid black', paddingBottom: '20px' }}>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.address}</p>
        <p>{restaurant.description}</p>
      </div>

      <div style={{ paddingTop: '20px' }}>
        <h2>Menu</h2>
        {Object.keys(menu).length > 0 ? (
          Object.keys(menu).map((category) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <h3>{category}</h3>
              {menu[category].map((dish) => (
                <div key={dish.id} style={styles.dishCard}>
                  
                  <div style={styles.dishHeader}>
                    <strong>{dish.name}</strong>
                    <strong>{dish.price} грн.</strong>
                  </div>
                  
                  {dish.description && <p style={styles.dishText}>{dish.description}</p>}
                  
                  {dish.ingredients && (
                    <small style={styles.dishText}>
                      <strong>Ingredients:</strong> {dish.ingredients}
                    </small>
                  )}
                  
                  {user && (
                    <button 
                      onClick={() => handleAddToFavorites(dish.id)} 
                      style={styles.favButton}
                    >
                      Add to favorites
                    </button>
                  )}
                  
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>menu for this restaurant has not yet been added.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  dishCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '10px 15px',
    margin: '10px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  dishHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1em',
    marginBottom: '5px',
  },
  dishText: {
    margin: '5px 0',
    color: '#333',
  },
  favButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
  }
};

export default RestaurantDetail;