import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState([]);
  const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFavorites(userData.favorites || []);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error fetching favorites: ', error);
        setError('Failed to load favorites. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
      if (response.data.Response === 'True') {
        return response.data;
      } else {
        console.error('Movie not found:', response.data.Error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const details = [];
      for (const imdbId of favorites) {
        const movieData = await fetchMovieDetails(imdbId);
        if (movieData) {
          details.push(movieData);
        }
      }
      setMovieDetails(details);
    };

    if (favorites.length > 0) {
      getMovieDetails();
    }
  }, [favorites]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-white text-center">My Favorite Movies</h1>

      {isLoading ? (
        <div className="text-white text-center">Loading...</div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : movieDetails.length === 0 ? (
        <p className="text-white text-center">No favorites found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {movieDetails.map((movie, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="relative group">
                <img
                  src={movie.Poster || 'https://via.placeholder.com/300x450'}
                  alt={movie.Title}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>
              </div>
              <div className="p-6 bg-white rounded-b-lg flex flex-col justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">{movie.Title}</h2>
                <p className="text-lg text-gray-600">{movie.Year}</p>
                <p className="mt-4 text-gray-800">{movie.Plot || 'No plot available.'}</p>
                <div className="mt-6 flex justify-between items-center">
                  <span className="font-semibold text-lg">IMDB Rating: {movie.imdbRating || 'N/A'}</span>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg"><Link to={`/movie/${movie.imdbID}`}>view more</Link></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
