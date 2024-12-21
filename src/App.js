import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SearchProvider } from './components/SearchContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieDetails from './components/MovieDetails';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Favorites from './components/Favorites';
import UserProfile from './pages/UserProfile';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <AppRoutes />
      </Router>
      {process.env.NODE_ENV === 'production' && <SpeedInsights />}
    </SearchProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/', '/signup'];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className={!hideNavbar ? 'pt-16' : ''}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
