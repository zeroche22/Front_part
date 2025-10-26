import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/favorite/');
        setFavorites(response.data);
      } catch (err) {
        setError('Failed to load favorite dishes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  const removeFromFavorites = async (id) => {
    try {
      await api.delete(`/api/favorite/${id}/`); 
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      alert('Failed to delete favorite dish');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My favorite dishes</h2>
      {favorites.length > 0 ? (
        favorites.map((fav) => (

          <div key={fav.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h4>{fav.dish.name}</h4>
            <p>From the restaurant: {fav.restaurant.name}</p>
            <p>Price: {fav.dish.price} грн.</p>
            <button onClick={() => removeFromFavorites(fav.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>You haven't added anything to your favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;