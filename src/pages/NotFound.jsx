import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className='text-lg mb-6'>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300">Back to Home</Link>
    </div>
  )
}

export default NotFound
