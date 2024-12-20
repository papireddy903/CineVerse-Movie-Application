import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setIsLoading(true);

        try {
            const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=a89f1437`);
            const data = response.data;
            
            if (data.Response === "True") {
                setMovies(data.Search);
                console.log(data.Search);
            } else {
                setMovies([]);
            }
        } catch(error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for a Movie..."
                    className="w-full text-xl p-4 pl-10 text-white bg-gray-700 rounded-full outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-lg placeholder-gray-400"
                />
                <div className="absolute right-4 top-4 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 1 1 5.306-12.806A7.5 7.5 0 0 1 9.5 17z"
                        />
                    </svg>
                </div>
            </div>

            {isLoading && (
                <div className="mt-8 text-white text-xl">Loading...</div>
            )}

            {movies.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.imdbID}
                            className="bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Link to={`/movie/${movie.imdbID}`}>
                            <img
                                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
                                alt={movie.Title}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                                className="w-full h-48 object-contain bg-gray-800"
                                
                                />
                                </Link>
                            <div className="p-2 text-center text-white">
                                <h3 className="text-sm font-semibold truncate">{movie.Title}</h3>
                                <p className="text-xs text-gray-400">{movie.Year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
