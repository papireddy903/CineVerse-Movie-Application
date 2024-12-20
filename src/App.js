import React from 'react'
import SearchBar from './components/SearchBar'
import MovieDetails from './components/MovieDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchBar/>}/>
        <Route path="/movie/:id" element={<MovieDetails/>}/>
      </Routes>
    </Router>
  )
}

export default App
