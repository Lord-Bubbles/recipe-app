import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MyMealPlan from './pages/MyMealPlan';
import MyRecipes from './pages/MyRecipes';
import useAuthStore from './store/authStore';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const refresh = useAuthStore((state) => state.refresh);

  useEffect(() => {
    // Refresh access and id token on every page refresh
    refresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/my-mealplan" element={<MyMealPlan />} />
        </Route>
      </Routes>
    </Router>
  );
}
