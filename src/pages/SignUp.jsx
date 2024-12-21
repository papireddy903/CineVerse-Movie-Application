import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const auth = getAuth();
    const firestore = getFirestore();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!email || !password || !confirmPassword) {
            setErrorMessage('All fields are required.');
            setSuccessMessage('');
            return;
        }
    
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setSuccessMessage('');
            return;
        }
    
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Send email verification
            await sendEmailVerification(user);
            setMessage('A verification email has been sent to your email address. Please verify before logging in.');
    
            // Add user details to Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                email: user.email,
                createdAt: serverTimestamp(),
            });
    
            setSuccessMessage('Registration successful! Redirecting to login...');
            setErrorMessage('');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Error during registration:', error.message);
            setErrorMessage("User registration failed. Please try again.");
            setSuccessMessage('');
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-gray-900 p-4">
            <div className="bg-gray-800 w-full max-w-md p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl text-white text-center font-bold mb-6">Sign Up</h1>

                {errorMessage && (
                    <div className="text-red-500 text-sm text-center mb-4">{errorMessage}</div>
                )}

                {successMessage && (
                    <div className="text-green-500 text-sm text-center mb-4">{successMessage}</div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-900 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-500"
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
                            className="w-full p-3 bg-gray-900 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 bg-gray-900 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-bold"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-white text-sm mt-4">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
