import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchFavorites(user.uid); // Fetch favorites when user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (uid) => {
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFavorites(userData.favorites || []); // Set favorites if they exist
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user from Firebase
      console.log("User logged out successfully");
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleFavorite = () => {
    navigate("/favorites"); // Navigate to the favorites page
  };

  return (
    <div className="absolute right-4 m-5 px-5 w-full flex justify-between items-center">
      {user && (
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="text-gray-400 hover:text-white mx-10">
            Home
          </Link>
          <div className="flex gap-5">
            <button
              onClick={handleFavorite}
              className="text-gray-400 hover:text-white"
            >
              My Favorites
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
