import React from 'react'
import SearchBar from './components/SearchBar'
import MovieDetails from './components/MovieDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SearchProvider } from "./components/SearchContext";
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Favorites from './components/Favorites';
import { auth, db } from './firebase';



const App = () => {
  return (
    <SearchProvider>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/register" element={<SignUp/>}/>
        <Route path="/search" element={<SearchBar/>}/>
        <Route path="/movie/:id" element={<MovieDetails/>}/>
        <Route path="/favorites" element={<Favorites/>}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
    </SearchProvider>
  )
}

export default App
