import { useEffect, useState } from "react";
import { apiFetch } from "../api/axiosConfig";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Restaurant() {
  const { id } = useParams();
  const { token, userId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    apiFetch(`restaurants/${id}/`).then(setRestaurant);
    apiFetch(`dishes/?restaurant=${id}`).then(setDishes);
  }, [id]);

  useEffect(() => {
    if (!token || !userId) return;
    apiFetch(`favorites/${userId}`, "GET", null, token)
      .then((res) => {
        const norm = (res || []).map((f) => ({
          favId: f.id,
          dishId: f.dish?.id || f.dish,
          restaurantId: f.restaurant?.id || f.restaurant,
        }));
        setFavorites(norm);
      })
      .catch(console.error);
  }, [token, userId]);

  const isFavorite = (dishId) => favorites.some((f) => f.dishId === dishId);

  async function addFavorite(dishId) {
    if (!token || !userId) return alert("Login to add to favorites");
    try {
      const body = { dish: dishId, restaurant: parseInt(id) };
      const res = await apiFetch(`favorites/${userId}`, "POST", body, token);
      setFavorites((prev) => [
        ...prev,
        {
          favId: res.id,
          dishId: res.dish,
          restaurantId: res.restaurant,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Error adding to favorites");
    }
  }

  async function removeFavorite(dishId) {
    if (!token || !userId) return;
    const fav = favorites.find((f) => f.dishId === dishId);
    if (!fav) return;

    try {
      await apiFetch(`favorites/${fav.favId}`, "DELETE", null, token);
      setFavorites((prev) => prev.filter((f) => f.favId !== fav.favId));
    } catch (err) {
      console.error(err);
      alert("Error removing from favorites");
    }
  }

  if (!restaurant) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>

      <h2>Menu</h2>
      <div className="grid">
        {dishes.map((dish) => {
          const inFav = isFavorite(dish.id);
          return (
            <div key={dish.id} className="card">
              <h3>{dish.name}</h3>
              <p>{dish.category}</p>
              <p><b>{dish.price} ₽</b></p>

              {token && (
                <button
                  onClick={() =>
                    inFav ? removeFavorite(dish.id) : addFavorite(dish.id)
                  }
                  className="fav-btn"
                >
                  {inFav ? "❤️ remove from favorites" : "🤍 Add to favorites"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
