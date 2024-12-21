import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CiHeart } from "react-icons/ci";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import Youtube from "react-youtube";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const auth = getAuth();
  const api_key=process.env.REACT_APP_OMDB_API_KEY;
  const youtube_api_key=process.env.REACT_APP_YOUTUBE_API_KEY;
//   const youtube_api_key = ";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=${api_key}`
        );
        if (response.data.Response === "True") {
          setMovie(response.data);
        } else {
          setError("Movie details not found");
        }
      } catch (error) {
        setError("Error fetching movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Checking if the movie is already in the user's favorites
  const checkIfFavorite = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.favorites && userData.favorites.includes(id)) {
          setIsFavorite(true);
          console.log("Movie is already in favorites");
        } else {
          setIsFavorite(false);
        }
      }
    }
  };

  // Add or remove the movie from the user's favorites
  const handleToggleFavorite = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (isFavorite) {
          // Remove from favorites
          await updateDoc(userRef, {
            favorites: arrayRemove(movie.imdbID),
          });
          console.log("Removed from favorites");
        } else {
          // Add to favorites
          await updateDoc(userRef, {
            favorites: arrayUnion(movie.imdbID),
          });
          console.log("Added to favorites");
        }

        setIsFavorite(!isFavorite); // Toggle the favorite state
        console.log("Updated isFavorite:", !isFavorite); // Log the updated state
      } else {
        // If the user doesn't exist in the database, create a new record
        await setDoc(userRef, {
          email: auth.currentUser.email,
          favorites: [movie.imdbID],
        });

        setIsFavorite(true);
        console.log("Set isFavorite to true");
      }
    }
  };

  useEffect(() => {
    checkIfFavorite();
  }, [id]);

  const fetchTrailer = async (title, language) => {
    try {
        console.log(title, language);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: `${title} official trailer ${language}`,
            type: "video",
            key: youtube_api_key,
            maxResults: 1,
          },
        }
      );

      if (response.data.items.length > 0) {
        setTrailerId(response.data.items[0].id.videoId);
        setShowTrailer(true);
      } else {
        alert("Trailer not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return <div className="text-center text-white mt-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  const rating = isNaN(parseFloat(movie.imdbRating))
    ? 0
    : parseFloat(movie.imdbRating);
  const fullStars = Math.round(rating);
  const emptyStars = 10 - fullStars;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen py-10">
      <div className="container mx-auto px-6">
        {movie && (
          <div className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center">
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300"
                }
                alt={movie.Title}
                className="rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
              />
              <button
                onClick={() => fetchTrailer(movie.Title, movie.Language.split(", ")[0])}
                className="mt-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white rounded-lg p-2"
              >
                Play Trailer
              </button>
            </div>
            <div className="w-full md:w-1/2 py-6 px-4 flex flex-col justify-between">
              <h2 className="text-4xl font-bold text-white">{movie.Title}</h2>
              <p className="text-lg font-semibold text-gray-400 mb-2">
                <strong>Directed by:</strong> {movie.Director}
              </p>
              <p className="text-lg font-medium text-gray-300 mb-4">
                <strong>Plot:</strong> {movie.Plot}
              </p>
              <div className="flex flex-wrap space-x-6 mb-4">
                <p className="text-md font-semibold text-gray-400">
                  <strong>Year:</strong> {movie.Year}
                </p>
                <p className="text-md font-semibold text-gray-400">
                  <strong>Rated:</strong> {movie.Rated}
                </p>
              </div>
              <div className="text-gray-300 mb-6">
                <p className="text-md font-semibold">
                  <strong>Genre:</strong> {movie.Genre}
                </p>
                <p className="text-md font-semibold">
                  <strong>Actors:</strong> {movie.Actors}
                </p>
                <p className="text-md font-semibold">
                  <strong>Box Office:</strong>{" "}
                  {movie.BoxOffice ? movie.BoxOffice : "N/A"}
                </p>
                <p className="text-md font-semibold">
                  <strong>Awards:</strong> {movie.Awards ? movie.Awards : "N/A"}
                </p>
                <p className="text-md font-semibold">
                  <strong>Runtime:</strong> {movie.Runtime}
                </p>
                <p className="text-md font-semibold">
                  <strong>Language:</strong> {movie.Language.split(", ")[0]}
                </p>

              </div>
              <div className="mt-4 flex items-center space-x-6">
                <p className="text-xl font-bold text-yellow-300">
                  <strong>IMDB Rating:</strong> {movie.imdbRating}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(fullStars)].map((_, index) => (
                  <AiFillStar
                    key={`star-${index}`}
                    className="text-yellow-300"
                  />
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                  <AiOutlineStar
                    key={`empty-star-${index}`}
                    className="text-gray-400"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center mx-2 my-2">
              <div
                onClick={handleToggleFavorite}
                className={`cursor-pointer text-3xl ${
                  isFavorite ? "text-red-700" : "text-white"
                } hover:text-red-700 transition-all duration-100`}
              >
                <CiHeart />
              </div>
            </div>
          </div>
        )}
      </div>

      {showTrailer && trailerId && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-6">
    <div className="bg-gray-800 rounded-lg p-4 w-full max-w-4xl mx-auto">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <Youtube 
          videoId={trailerId}
          className="absolute top-0 left-0 w-full h-full rounded"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      </div>
      <button
        onClick={() => setShowTrailer(false)}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded text-sm font-medium"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default MovieDetails;
