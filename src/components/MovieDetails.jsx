import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CiHeart } from "react-icons/ci";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';


const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=a89f1437`);
                if (response.data.Response === 'True') {
                    setMovie(response.data);
                } else {
                    setError('Movie details not found');
                }
            } catch (error) {
                setError('Error fetching movie details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (isLoading) return <div className="text-center text-white mt-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

    const rating = isNaN(parseFloat(movie.imdbRating))?0:parseFloat(movie.imdbRating);
    const fullStars = Math.round(rating);
    const emptyStars = 10 - fullStars; 

    return (
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 min-h-screen py-10">
            <div className="container mx-auto px-6">
                {movie && (
                    <div className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
                        <div className="w-full md:w-1/2 p-6">
                            <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300'}
                                alt={movie.Title}
                                className="rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
                            />
                        </div>
                        <div className="w-full md:w-1/2 py-6 px-4 flex flex-col justify-between">
                            <h2 className="text-4xl font-bold text-white">{movie.Title}</h2>
                            <p className="text-lg font-semibold text-gray-400 mb-2"><strong>Directed by:</strong> {movie.Director}</p>
                            <p className="text-lg font-medium text-gray-300 mb-4"><strong>Plot:</strong> {movie.Plot}</p>
                            <div className="flex flex-wrap space-x-6 mb-4">
                                <p className="text-md font-semibold text-gray-400"><strong>Year:</strong> {movie.Year}</p>
                                <p className="text-md font-semibold text-gray-400"><strong>Rated:</strong> {movie.Rated}</p>
                            </div>
                            <div className="text-gray-300 mb-6">
                                <p className="text-md font-semibold"><strong>Genre:</strong> {movie.Genre}</p>
                                <p className="text-md font-semibold"><strong>Actors:</strong> {movie.Actors}</p>
                                <p className="text-md font-semibold"><strong>Box Office:</strong> {movie.BoxOffice ? movie.BoxOffice : 'N/A'}</p>
                                <p className="text-md font-semibold"><strong>Awards:</strong> {movie.Awards ? movie.Awards : 'N/A'}</p>
                                <p className="text-md font-semibold"><strong>Runtime:</strong> {movie.Runtime}</p>
                            </div>
                            <div className="mt-4 flex items-center space-x-6">
                                <p className="text-xl font-bold text-yellow-300">
                                    <strong>IMDB Rating:</strong> {movie.imdbRating}
                                </p>
                                
                            </div>
                            <div className="flex items-center">
                                    {[...Array(fullStars)].map((_, index) => (
                                        <AiFillStar key={`star-${index}`} className="text-yellow-300" />
                                    ))}
                                    {[...Array(emptyStars)].map((_, index) => (
                                        <AiOutlineStar key={`empty-star-${index}`} className="text-gray-400" />
                                    ))}
                                </div>

                        </div>
                <div className='flex justify-center mx-2 my-2'>
                    <div className='cursor-pointer text-3xl text-red-500 hover:text-red-700 transition-all duration-300'>
                        <CiHeart />
                    </div>
                </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
