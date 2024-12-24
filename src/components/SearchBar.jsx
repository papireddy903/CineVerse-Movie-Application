import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useSearch } from "./SearchContext";

const SearchBar = () => {
    const { query, setQuery, year, setYear, movies, setMovies } = useSearch();
    const [isLoading, setIsLoading] = useState(false);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const years = Array.from({ length: 2025 - 1900 }, (_, i) => 1900 + i);
    const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

    const toggleDropDown = () => {
        setDropDownOpen(!dropDownOpen);
    }

    const handleSearch = async () => {
        if (!query) return;

        setIsLoading(true);
        setSearchInitiated(true);

        try {
            const yearParam = year && year !== "Year" ? `&y=${year}` : "";
            const response = await axios.get(`https://www.omdbapi.com/?s=${query}${yearParam}&apikey=${API_KEY}`);
            const data = response.data;

            if (data.Response === "True") {
                const detailedMovies = await Promise.all(
                    data.Search.map(async (movie) => {
                        const detailResponse = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
                        return detailResponse.data;
                    })
                );
                setMovies(detailedMovies);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const HighToLow = () => {
        const sortedMovies = [...movies].sort((a, b) => {
            const boxOfficeA = a.BoxOffice && a.BoxOffice !== "N/A" && !isNaN(parseInt(a.BoxOffice.replace(/[^0-9]/g, '')))
                ? parseInt(a.BoxOffice.replace(/[^0-9]/g, ''))
                : 0;
            const boxOfficeB = b.BoxOffice && b.BoxOffice !== "N/A" && !isNaN(parseInt(b.BoxOffice.replace(/[^0-9]/g, '')))
                ? parseInt(b.BoxOffice.replace(/[^0-9]/g, ''))
                : 0;
            return boxOfficeB - boxOfficeA;
        });
        setMovies(sortedMovies);
    };
    
    const LowToHigh = () => {
        const sortedMovies = [...movies].sort((a, b) => {
            const boxOfficeA = a.BoxOffice && a.BoxOffice !== "N/A" && !isNaN(parseInt(a.BoxOffice.replace(/[^0-9]/g, '')))
                ? parseInt(a.BoxOffice.replace(/[^0-9]/g, ''))
                : 0;
            const boxOfficeB = b.BoxOffice && b.BoxOffice !== "N/A" && !isNaN(parseInt(b.BoxOffice.replace(/[^0-9]/g, '')))
                ? parseInt(b.BoxOffice.replace(/[^0-9]/g, ''))
                : 0;
            return boxOfficeA - boxOfficeB;
        });
        setMovies(sortedMovies);
    };
    
    const RatingHighToLow = () => {
        const sortedMovies = [...movies].sort((a, b) => 
            (b.imdbRating && b.imdbRating !== "N/A" ? parseFloat(b.imdbRating) : 0) -
            (a.imdbRating && a.imdbRating !== "N/A" ? parseFloat(a.imdbRating) : 0)
        );
        setMovies(sortedMovies);
    };
    
    const RatingLowToHigh = () => {
        const sortedMovies = [...movies].sort((a, b) => 
            (a.imdbRating && a.imdbRating !== "N/A" ? parseFloat(a.imdbRating) : 0) -
            (b.imdbRating && b.imdbRating !== "N/A" ? parseFloat(b.imdbRating) : 0)
        );
        setMovies(sortedMovies);
    };
    
    const NewToOld = () => {
        const sortedMovies = [...movies].sort((a, b) => {
            const yearA = a.Released && a.Released !== "N/A" ? parseInt(a.Released.split(' ').pop()) : 0;
            const yearB = b.Released && b.Released !== "N/A" ? parseInt(b.Released.split(' ').pop()) : 0;
            return yearB - yearA;
        });
        setMovies(sortedMovies);
    };
    
    const OldToNew = () => {
        const sortedMovies = [...movies].sort((a, b) => {
            const yearA = a.Released && a.Released !== "N/A" ? parseInt(a.Released.split(' ').pop()) : 0;
            const yearB = b.Released && b.Released !== "N/A" ? parseInt(b.Released.split(' ').pop()) : 0;
            return yearA - yearB;
        });
        setMovies(sortedMovies);
    };
    

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-gray-300 font-bold mt-5 text-6xl mb-4 text-center">Welcome to CineVerse</h1>
            <p className="text-gray-500 mb-[50px]">Your one-stop platform for exploring movies, managing favorites, and watching trailers effortlessly.</p>
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

                {!isLoading && searchInitiated && (
                    <div>
                        <button className="text-white flex items-center gap-1 bg-purple-600 p-4 rounded-full hover:bg-purple-700 transition-allduration-300 shadow-lg" onClick={toggleDropDown}>
                            <p>Filters</p> 
                            <span className="down">&#9660;</span>
                        </button>

                        {dropDownOpen && (
                            <div className="flex flex-col justify-start items-start absolute bg-gray-700 rounded-lg shadow-lg p-4 space-y-2 text-white">
                            <button className="hover:bg-white hover:text-black" onClick={HighToLow}>Collections High to Low</button>
                            <button className="hover:bg-white hover:text-black" onClick={LowToHigh}>Collections Low to High</button>
                            <button className="hover:bg-white hover:text-black" onClick={RatingHighToLow}>Rating High to Low</button>
                            <button className="hover:bg-white hover:text-black" onClick={RatingLowToHigh}>Rating Low to High</button>
                            <button className="hover:bg-white hover:text-black" onClick={NewToOld}>New to Old</button>
                            <button className="hover:bg-white hover:text-black" onClick={OldToNew}>Old to New</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="mt-8 text-white text-xl">Loading...</div>
            )}

            {!isLoading && searchInitiated && movies.length > 0 && (
                <div>
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
                </div>
            )}

            {!isLoading && searchInitiated && movies.length === 0 && (
                <div className="mt-8 text-white text-xl">No movies found.</div>
            )}
        </div>
    );
};

export default SearchBar;