import React, { useState } from "react";
import "./App.css";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/restaurants/")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));

    fetch("http://127.0.0.1:8000/dishes/")
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <h1>Запит</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={fetchData}>
          {loading ? "Завантаження..." : "Отримати дані з API"}
        </button>
      </div>

      <section>
        <h2>Ресторани</h2>
        <ul>
          {restaurants.length === 0 ? <li>Немає даних</li> :
            restaurants.map(r => (
              <li key={r.id}>{r.name}</li>
            ))
          }
        </ul>
      </section>

      <section>
        <h2>Страви</h2>
        <ul>
          {dishes.length === 0 ? <li>Немає даних</li> :
            dishes.map(d => (
              <li key={d.id}>{d.name} - {d.price} ₴</li>
            ))
          }
        </ul>
      </section>
    </div>
  );
}

export default App;
