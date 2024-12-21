import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useSearch } from "./SearchContext";

const SearchBar = () => {
    const { query, setQuery, year, setYear, movies, setMovies } = useSearch();
    const [isLoading, setIsLoading] = useState(false);
    const [searchInitiated, setSearchInitiated] = useState(false);

    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);
    const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

    const handleSearch = async () => {
        if (!query) return;

        setIsLoading(true);
        setSearchInitiated(true);

        try {
            const yearParam = year && year !== "Year" ? `&y=${year}` : "";
            const response = await axios.get(`https://www.omdbapi.com/?s=${query}${yearParam}&apikey=${API_KEY}`);
            const data = response.data;

            if (data.Response === "True") {
                setMovies(data.Search);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="flex items-center w-full max-w-2xl space-x-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search for a Movie..."
                        className="w-full text-xl p-4 pl-10 text-white bg-gray-700 rounded-full outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-lg placeholder-gray-400"
                    />
                </div>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="text-lg p-4 bg-gray-700 text-white rounded-full outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-lg"
                >
                    <option value="">Year</option>
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="text-xl p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg"
                >
                    Search
                </button>
            </div>

            {isLoading && (
                <div className="mt-8 text-white text-xl">Loading...</div>
            )}

            {!isLoading && searchInitiated && movies.length > 0 && (
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

            {!isLoading && searchInitiated && movies.length === 0 && (
                <div className="mt-8 text-white text-xl">No movies found.</div>
            )}
        </div>
    );
};

export default SearchBar;
