import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already signed in when the component mounts
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Redirect to the home page if the user is already logged in
                navigate('/search');
            }
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Both email and password are required.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setErrorMessage('');
            console.log('Logged in successfully');
            navigate('/search'); // Redirect to home after successful login
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="bg-gray-700 w-full max-w-md p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl text-white text-center font-bold mb-6">Login</h1>

                {errorMessage && (
                    <div className="text-red-500 text-sm text-center mb-4">{errorMessage}</div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 placeholder-gray-400"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 placeholder-gray-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold"
                    >
                        Login
                    </button>
                </form>

                <div className="text-center mt-4 text-gray-400">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-purple-400 hover:underline">Signup</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
