import React from 'react'
import SearchBar from './components/SearchBar'
import MovieDetails from './components/MovieDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SearchProvider } from "./components/SearchContext";
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';


const App = () => {
  return (
    <SearchProvider>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<SearchBar/>}/>
        <Route path="/movie/:id" element={<MovieDetails/>}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
    </SearchProvider>
  )
}

export default App
