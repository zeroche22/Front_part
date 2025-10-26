import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Favorites from './pages/Favorites';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="restaurant/:id" element={<RestaurantDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;